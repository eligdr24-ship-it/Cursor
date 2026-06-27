import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { googleOAuthScopes } from './config.js';
import { parseCsv } from './csv.js';
import { requirePermission, type AuthenticatedRequest } from './auth.js';
import { store } from './store.js';

export const apiRouter = Router();

const oauthCallbackSchema = z.object({
  code: z.string().min(3),
  state: z.string().min(8).optional(),
  googleEmail: z.string().email().optional()
});

const csvImportSchema = z.object({
  fileName: z.string().trim().min(1).default('gmail-accounts.csv'),
  csv: z.string().min(5)
});

function currentContext(req: AuthenticatedRequest) {
  return {
    user: req.currentUser,
    role: req.currentRole,
    agency: store.getDefaultAgency()
  };
}

apiRouter.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'control-tower-ai',
    version: '0.1.0'
  });
});

apiRouter.get('/bootstrap', requirePermission('agency:read'), (req, res) => {
  const { agency, role, user } = currentContext(req as AuthenticatedRequest);

  res.json({
    agency,
    user,
    role,
    metrics: store.getMetrics(agency.id),
    briefing: store.getMorningBriefing(agency.id),
    googleAccounts: store.listGoogleAccounts(agency.id),
    importedGmailAccounts: store.listImportedGmailAccounts(agency.id),
    businessProfiles: store.listBusinessProfiles(agency.id),
    agents: store.listAgents(),
    pendingTasks: store.listPendingTasks(agency.id),
    alerts: store.listAlerts(agency.id),
    auditLogs: store.listAuditLogs(agency.id)
  });
});

apiRouter.post('/auth/google/start', requirePermission('google:connect'), (req, res) => {
  const { agency, user } = currentContext(req as AuthenticatedRequest);
  const state = randomUUID();
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || 'configure-google-client-id',
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback',
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    scope: googleOAuthScopes.join(' '),
    state
  });

  store.createAuditLog({
    agencyId: agency.id,
    userId: user.id,
    action: 'auth.google_oauth_started',
    entityType: 'google_account',
    metadata: { scopes: googleOAuthScopes }
  });

  res.json({
    state,
    authUrl: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    scopes: googleOAuthScopes
  });
});

apiRouter.post('/auth/google/callback', requirePermission('google:connect'), (req, res) => {
  const { agency, user } = currentContext(req as AuthenticatedRequest);
  const payload = oauthCallbackSchema.parse(req.body);
  const account = store.createGoogleAccount({
    agencyId: agency.id,
    userId: user.id,
    googleEmail: payload.googleEmail || user.email,
    scopes: [...googleOAuthScopes]
  });

  store.createAuditLog({
    agencyId: agency.id,
    userId: user.id,
    action: 'auth.google_oauth_completed',
    entityType: 'google_account',
    entityId: account.id,
    metadata: { state: payload.state || null, codeReceived: Boolean(payload.code) }
  });

  res.json({
    ok: true,
    account,
    session: {
      userId: user.id,
      agencyId: agency.id
    }
  });
});

apiRouter.post('/imports/gmail/csv', requirePermission('imports:create'), (req, res) => {
  const { agency, user } = currentContext(req as AuthenticatedRequest);
  const payload = csvImportSchema.parse(req.body);
  const rows = parseCsv(payload.csv);

  const accounts = store.createImportedGmailAccounts(
    rows.flatMap((row) => {
      const email = row.email || row.gmail || row.google_email || row.account_email;
      if (!email) return [];

      return [
        {
          agencyId: agency.id,
          email,
          source: 'csv',
          profileName: row.profile_name || row.business_name || row.location_name,
          locationId: row.location_id || row.gbp_location_id,
          importedByUserId: user.id
        }
      ];
    })
  );

  const profiles = accounts.flatMap((account) => {
    if (!account.locationId || !account.profileName) return [];

    return [
      store.createBusinessProfile({
        agencyId: agency.id,
        locationId: account.locationId,
        name: account.profileName,
        address: 'Imported via Gmail account CSV',
        primaryCategory: 'Pending discovery',
        status: 'needs_access'
      })
    ];
  });

  store.createAuditLog({
    agencyId: agency.id,
    userId: user.id,
    action: 'imports.gmail_csv_uploaded',
    entityType: 'imported_gmail_accounts',
    metadata: {
      fileName: payload.fileName,
      importedRows: rows.length,
      importedAccounts: accounts.length,
      createdOrUpdatedProfiles: profiles.length
    }
  });

  res.status(201).json({
    ok: true,
    accounts,
    profiles,
    auditLogs: store.listAuditLogs(agency.id)
  });
});

apiRouter.post('/google/profiles/discover', requirePermission('google:read'), (req, res) => {
  const { agency, user } = currentContext(req as AuthenticatedRequest);
  const googleAccounts = store.listGoogleAccounts(agency.id);
  const importedAccounts = store.listImportedGmailAccounts(agency.id);

  const discovered = importedAccounts.map((account, index) =>
    store.createBusinessProfile({
      agencyId: agency.id,
      googleAccountId: googleAccounts[index % Math.max(googleAccounts.length, 1)]?.id,
      locationId: account.locationId || `locations/discovered-${account.id}`,
      name: account.profileName || account.email.split('@')[0].replace(/[._-]+/g, ' '),
      address: 'Auto-discovery pending Google verification',
      primaryCategory: 'Pending discovery',
      status: googleAccounts.length ? 'pending_verification' : 'needs_access'
    })
  );

  store.createAuditLog({
    agencyId: agency.id,
    userId: user.id,
    action: 'google.business_profiles_discovered',
    entityType: 'business_profiles',
    metadata: {
      importedAccountCount: importedAccounts.length,
      discoveredProfileCount: discovered.length
    }
  });

  res.json({
    ok: true,
    discovered,
    requiresApprovalForSensitiveActions: true
  });
});

apiRouter.get('/business-profiles', requirePermission('profiles:read'), (req, res) => {
  const { agency } = currentContext(req as AuthenticatedRequest);

  res.json({
    profiles: store.listBusinessProfiles(agency.id)
  });
});

apiRouter.get('/audit-logs', requirePermission('audit:read'), (req, res) => {
  const { agency } = currentContext(req as AuthenticatedRequest);

  res.json({
    auditLogs: store.listAuditLogs(agency.id, 100)
  });
});
