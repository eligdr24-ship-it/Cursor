import { randomUUID } from 'node:crypto';
import type {
  Agency,
  AiAgent,
  Alert,
  ApprovalTask,
  AuditLog,
  BusinessProfile,
  DashboardMetric,
  GoogleAccount,
  ImportedGmailAccount,
  MorningBriefing,
  Permission,
  Role,
  RoleName,
  User
} from '../shared/types.js';

interface CreateAuditLogInput {
  agencyId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

interface CreateImportedGmailAccountInput {
  agencyId: string;
  email: string;
  source: ImportedGmailAccount['source'];
  profileName?: string;
  locationId?: string;
  importedByUserId: string;
}

interface CreateGoogleAccountInput {
  agencyId: string;
  userId: string;
  googleEmail: string;
  scopes: string[];
}

interface CreateBusinessProfileInput {
  agencyId: string;
  googleAccountId?: string;
  locationId: string;
  name: string;
  address: string;
  primaryCategory: string;
  status?: BusinessProfile['status'];
}

const now = () => new Date().toISOString();

const permissionsByRole: Record<RoleName, Permission[]> = {
  owner: [
    'agency:read',
    'agency:manage',
    'google:connect',
    'google:read',
    'profiles:read',
    'profiles:manage',
    'imports:create',
    'tasks:approve',
    'audit:read',
    'ai:chat'
  ],
  admin: [
    'agency:read',
    'google:connect',
    'google:read',
    'profiles:read',
    'profiles:manage',
    'imports:create',
    'tasks:approve',
    'audit:read',
    'ai:chat'
  ],
  operator: ['agency:read', 'google:read', 'profiles:read', 'imports:create', 'ai:chat'],
  viewer: ['agency:read', 'google:read', 'profiles:read', 'audit:read']
};

export class ControlTowerStore {
  private agencies: Agency[] = [];
  private roles: Role[] = [];
  private users: User[] = [];
  private googleAccounts: GoogleAccount[] = [];
  private importedGmailAccounts: ImportedGmailAccount[] = [];
  private businessProfiles: BusinessProfile[] = [];
  private auditLogs: AuditLog[] = [];
  private pendingTasks: ApprovalTask[] = [];
  private alerts: Alert[] = [];
  private agents: AiAgent[] = [];

  constructor() {
    this.seed();
  }

  getDefaultAgency() {
    return this.agencies[0];
  }

  getDefaultUser() {
    return this.users[0];
  }

  getRole(roleId: string) {
    return this.roles.find((role) => role.id === roleId);
  }

  getUser(userId: string) {
    return this.users.find((user) => user.id === userId);
  }

  listGoogleAccounts(agencyId: string) {
    return this.googleAccounts.filter((account) => account.agencyId === agencyId);
  }

  listImportedGmailAccounts(agencyId: string) {
    return this.importedGmailAccounts.filter((account) => account.agencyId === agencyId);
  }

  listBusinessProfiles(agencyId: string) {
    return this.businessProfiles.filter((profile) => profile.agencyId === agencyId);
  }

  listAuditLogs(agencyId: string, limit = 25) {
    return this.auditLogs.filter((log) => log.agencyId === agencyId).slice(0, limit);
  }

  listAgents() {
    return this.agents;
  }

  listPendingTasks(agencyId: string) {
    return this.pendingTasks.filter((task) => task.agencyId === agencyId);
  }

  listAlerts(agencyId: string) {
    return this.alerts.filter((alert) => alert.agencyId === agencyId);
  }

  createGoogleAccount(input: CreateGoogleAccountInput) {
    const existing = this.googleAccounts.find(
      (account) => account.agencyId === input.agencyId && account.googleEmail === input.googleEmail
    );

    if (existing) {
      existing.status = 'connected';
      existing.scopes = input.scopes;
      existing.connectedAt = now();
      return existing;
    }

    const account: GoogleAccount = {
      id: randomUUID(),
      agencyId: input.agencyId,
      userId: input.userId,
      googleEmail: input.googleEmail,
      status: 'connected',
      scopes: input.scopes,
      connectedAt: now()
    };
    this.googleAccounts.unshift(account);
    return account;
  }

  createImportedGmailAccounts(inputs: CreateImportedGmailAccountInput[]) {
    const created: ImportedGmailAccount[] = [];

    for (const input of inputs) {
      const normalizedEmail = input.email.toLowerCase();
      const existing = this.importedGmailAccounts.find(
        (account) => account.agencyId === input.agencyId && account.email === normalizedEmail
      );

      if (existing) {
        existing.profileName = input.profileName || existing.profileName;
        existing.locationId = input.locationId || existing.locationId;
        created.push(existing);
        continue;
      }

      const account: ImportedGmailAccount = {
        id: randomUUID(),
        agencyId: input.agencyId,
        email: normalizedEmail,
        source: input.source,
        profileName: input.profileName,
        locationId: input.locationId,
        importedAt: now(),
        importedByUserId: input.importedByUserId
      };
      this.importedGmailAccounts.unshift(account);
      created.push(account);
    }

    return created;
  }

  createBusinessProfile(input: CreateBusinessProfileInput) {
    const existing = this.businessProfiles.find(
      (profile) => profile.agencyId === input.agencyId && profile.locationId === input.locationId
    );

    if (existing) {
      existing.name = input.name;
      existing.address = input.address;
      existing.primaryCategory = input.primaryCategory;
      existing.googleAccountId = input.googleAccountId || existing.googleAccountId;
      existing.lastSyncedAt = now();
      return existing;
    }

    const profile: BusinessProfile = {
      id: randomUUID(),
      agencyId: input.agencyId,
      googleAccountId: input.googleAccountId,
      locationId: input.locationId,
      name: input.name,
      address: input.address,
      primaryCategory: input.primaryCategory,
      status: input.status || 'needs_access',
      rating: 0,
      reviewCount: 0,
      healthScore: 72,
      lastSyncedAt: now()
    };
    this.businessProfiles.unshift(profile);
    return profile;
  }

  createAuditLog(input: CreateAuditLogInput) {
    const log: AuditLog = {
      id: randomUUID(),
      agencyId: input.agencyId,
      userId: input.userId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata: input.metadata || {},
      createdAt: now()
    };
    this.auditLogs.unshift(log);
    return log;
  }

  getMetrics(agencyId: string): DashboardMetric[] {
    const profiles = this.listBusinessProfiles(agencyId);
    const activeProfiles = profiles.filter((profile) => profile.status === 'active').length;
    const connectedAccounts = this.listGoogleAccounts(agencyId).filter((account) => account.status === 'connected').length;
    const averageHealth = profiles.length
      ? Math.round(profiles.reduce((sum, profile) => sum + profile.healthScore, 0) / profiles.length)
      : 0;

    return [
      { label: 'GBP profiles', value: String(profiles.length), trend: `${activeProfiles} active`, tone: 'blue' },
      { label: 'Google accounts', value: String(connectedAccounts), trend: 'OAuth only', tone: 'green' },
      { label: 'Avg. health', value: `${averageHealth}%`, trend: 'Scanner ready', tone: 'purple' },
      { label: 'Pending approvals', value: String(this.listPendingTasks(agencyId).length), trend: 'Sensitive actions gated', tone: 'orange' }
    ];
  }

  getMorningBriefing(agencyId: string): MorningBriefing {
    const profiles = this.listBusinessProfiles(agencyId);
    const needsAccess = profiles.filter((profile) => profile.status === 'needs_access').length;
    const suspended = profiles.filter((profile) => profile.status === 'suspended').length;

    return {
      headline: 'Tower AI found the highest leverage setup actions for today.',
      priorities: [
        `${needsAccess} imported locations need Google access confirmation.`,
        `${suspended} profiles need recovery review.`,
        'Connect Google OAuth to unlock auto-discovery, reviews, posts, media, rankings, health, and compliance workflows.'
      ],
      generatedAt: now()
    };
  }

  private seed() {
    const agencyId = 'agency_northstar';
    const ownerRoleId = 'role_owner';
    const ownerUserId = 'user_owner';

    this.agencies = [
      {
        id: agencyId,
        name: 'Northstar Local Agency',
        plan: 'enterprise',
        createdAt: now()
      }
    ];

    this.roles = (Object.keys(permissionsByRole) as RoleName[]).map((roleName) => ({
      id: `role_${roleName}`,
      name: roleName,
      permissions: permissionsByRole[roleName]
    }));

    this.users = [
      {
        id: ownerUserId,
        agencyId,
        email: 'owner@northstarlocal.example',
        name: 'Maya Chen',
        roleId: ownerRoleId,
        createdAt: now(),
        lastLoginAt: now()
      }
    ];

    this.googleAccounts = [
      {
        id: 'google_account_demo',
        agencyId,
        userId: ownerUserId,
        googleEmail: 'gbp-admin@northstarlocal.example',
        status: 'connected',
        scopes: ['business.manage', 'gmail.readonly'],
        connectedAt: now()
      }
    ];

    this.businessProfiles = [
      {
        id: 'profile_1',
        agencyId,
        googleAccountId: 'google_account_demo',
        locationId: 'locations/1001',
        name: 'Beacon Dental Studio',
        address: '1221 Main St, Austin, TX',
        primaryCategory: 'Dentist',
        status: 'active',
        rating: 4.8,
        reviewCount: 214,
        healthScore: 91,
        lastSyncedAt: now()
      },
      {
        id: 'profile_2',
        agencyId,
        googleAccountId: 'google_account_demo',
        locationId: 'locations/1002',
        name: 'North Loop Auto Care',
        address: '84 Lamar Blvd, Austin, TX',
        primaryCategory: 'Auto repair shop',
        status: 'pending_verification',
        rating: 4.4,
        reviewCount: 89,
        healthScore: 76,
        lastSyncedAt: now()
      },
      {
        id: 'profile_3',
        agencyId,
        locationId: 'locations/imported-001',
        name: 'Imported Demo Location',
        address: 'Access pending',
        primaryCategory: 'Unknown',
        status: 'needs_access',
        rating: 0,
        reviewCount: 0,
        healthScore: 48,
        lastSyncedAt: now()
      }
    ];

    this.importedGmailAccounts = [
      {
        id: 'import_1',
        agencyId,
        email: 'manager@imported-demo.example',
        source: 'csv',
        profileName: 'Imported Demo Location',
        locationId: 'locations/imported-001',
        importedAt: now(),
        importedByUserId: ownerUserId
      }
    ];

    this.pendingTasks = [
      {
        id: 'task_1',
        agencyId,
        title: 'Approve GBP access request email',
        description: 'Tower AI drafted an access request for Imported Demo Location. Approval is required before sending.',
        sensitivity: 'medium',
        status: 'pending_approval',
        requestedByAgent: 'agent_recovery',
        createdAt: now()
      }
    ];

    this.alerts = [
      {
        id: 'alert_1',
        agencyId,
        profileId: 'profile_2',
        severity: 'warning',
        title: 'Verification pending',
        body: 'North Loop Auto Care is waiting on verification. Recovery workflows are available after OAuth confirmation.',
        createdAt: now()
      }
    ];

    this.agents = [
      { id: 'agent_tower', name: 'Tower AI', focus: 'Daily briefing, prioritization, approvals', permissions: ['agency:read', 'profiles:read', 'ai:chat'], status: 'active' },
      { id: 'agent_ranking', name: 'Ranking', focus: 'Rank tracking and geo-grid recommendations', permissions: ['profiles:read', 'ai:chat'], status: 'active' },
      { id: 'agent_health', name: 'GBP Health', focus: 'Profile health scans and issue detection', permissions: ['profiles:read', 'ai:chat'], status: 'active' },
      { id: 'agent_reviews', name: 'Reviews', focus: 'Review insights and response drafts', permissions: ['profiles:read', 'ai:chat'], status: 'active' },
      { id: 'agent_content', name: 'Content', focus: 'Google Posts planning and approvals', permissions: ['profiles:read', 'ai:chat'], status: 'active' },
      { id: 'agent_media', name: 'Media', focus: 'Media gap analysis and publishing queues', permissions: ['profiles:read', 'ai:chat'], status: 'active' },
      { id: 'agent_compliance', name: 'Compliance', focus: 'Policy risk and compliance findings', permissions: ['profiles:read', 'ai:chat'], status: 'active' },
      { id: 'agent_recovery', name: 'Recovery', focus: 'Suspensions, access, and verification cases', permissions: ['profiles:read', 'ai:chat'], status: 'active' },
      { id: 'agent_reporting', name: 'Reporting', focus: 'Agency and client reporting', permissions: ['profiles:read', 'audit:read', 'ai:chat'], status: 'active' },
      { id: 'agent_automation', name: 'Automation', focus: 'Rules, schedules, and safe automation', permissions: ['profiles:read', 'ai:chat'], status: 'active' }
    ];

    this.auditLogs = [
      {
        id: 'audit_seed',
        agencyId,
        userId: ownerUserId,
        action: 'workspace.seeded',
        entityType: 'agency',
        entityId: agencyId,
        metadata: { source: 'local_bootstrap' },
        createdAt: now()
      }
    ];
  }
}

export const store = new ControlTowerStore();
