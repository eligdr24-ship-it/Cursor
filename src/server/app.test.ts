import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';

const app = createApp();

describe('Control Tower AI API', () => {
  it('reports health', async () => {
    const response = await request(app).get('/api/health').expect(200);

    expect(response.body).toMatchObject({
      ok: true,
      service: 'control-tower-ai'
    });
  });

  it('returns mission-control bootstrap data', async () => {
    const response = await request(app).get('/api/bootstrap').expect(200);

    expect(response.body.agency.name).toBe('Northstar Local Agency');
    expect(response.body.role.permissions).toContain('imports:create');
    expect(response.body.businessProfiles.length).toBeGreaterThan(0);
    expect(response.body.auditLogs[0].action).toBe('workspace.seeded');
  });

  it('starts a Google OAuth flow and audits it', async () => {
    const response = await request(app).post('/api/auth/google/start').send({}).expect(200);

    expect(response.body.authUrl).toContain('accounts.google.com');
    expect(response.body.scopes).toContain('https://www.googleapis.com/auth/business.manage');

    const bootstrap = await request(app).get('/api/bootstrap').expect(200);
    expect(bootstrap.body.auditLogs[0].action).toBe('auth.google_oauth_started');
  });

  it('imports Gmail accounts from CSV and creates pending profiles', async () => {
    const response = await request(app)
      .post('/api/imports/gmail/csv')
      .send({
        fileName: 'accounts.csv',
        csv: 'email,profile_name,location_id\nmanager@example.com,Manager Test,locations/test-1'
      })
      .expect(201);

    expect(response.body.accounts[0]).toMatchObject({
      email: 'manager@example.com',
      profileName: 'Manager Test'
    });
    expect(response.body.profiles[0]).toMatchObject({
      locationId: 'locations/test-1',
      status: 'needs_access'
    });
    expect(response.body.auditLogs[0].action).toBe('imports.gmail_csv_uploaded');
  });
});
