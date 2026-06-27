export type RoleName = 'owner' | 'admin' | 'operator' | 'viewer';

export type Permission =
  | 'agency:read'
  | 'agency:manage'
  | 'google:connect'
  | 'google:read'
  | 'profiles:read'
  | 'profiles:manage'
  | 'imports:create'
  | 'tasks:approve'
  | 'audit:read'
  | 'ai:chat';

export interface Role {
  id: string;
  name: RoleName;
  permissions: Permission[];
}

export interface Agency {
  id: string;
  name: string;
  plan: 'starter' | 'growth' | 'enterprise';
  createdAt: string;
}

export interface User {
  id: string;
  agencyId: string;
  email: string;
  name: string;
  roleId: string;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface GoogleAccount {
  id: string;
  agencyId: string;
  userId: string;
  googleEmail: string;
  status: 'connected' | 'needs_reauth' | 'revoked';
  scopes: string[];
  connectedAt: string;
}

export interface ImportedGmailAccount {
  id: string;
  agencyId: string;
  email: string;
  source: 'csv' | 'excel' | 'gmail';
  profileName?: string;
  locationId?: string;
  importedAt: string;
  importedByUserId: string;
}

export interface BusinessProfile {
  id: string;
  agencyId: string;
  googleAccountId?: string;
  locationId: string;
  name: string;
  address: string;
  primaryCategory: string;
  status: 'active' | 'pending_verification' | 'suspended' | 'needs_access';
  rating: number;
  reviewCount: number;
  healthScore: number;
  lastSyncedAt?: string;
}

export interface AuditLog {
  id: string;
  agencyId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface ApprovalTask {
  id: string;
  agencyId: string;
  title: string;
  description: string;
  sensitivity: 'low' | 'medium' | 'high';
  status: 'pending_approval' | 'approved' | 'rejected' | 'completed';
  requestedByAgent: string;
  createdAt: string;
}

export interface Alert {
  id: string;
  agencyId: string;
  profileId?: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  body: string;
  createdAt: string;
  acknowledgedAt?: string;
}

export interface AiAgent {
  id: string;
  name: string;
  focus: string;
  permissions: Permission[];
  status: 'active' | 'paused';
}

export interface DashboardMetric {
  label: string;
  value: string;
  trend: string;
  tone: 'blue' | 'green' | 'orange' | 'purple';
}

export interface MorningBriefing {
  headline: string;
  priorities: string[];
  generatedAt: string;
}

export interface BootstrapPayload {
  agency: Agency;
  user: User;
  role: Role;
  metrics: DashboardMetric[];
  briefing: MorningBriefing;
  googleAccounts: GoogleAccount[];
  importedGmailAccounts: ImportedGmailAccount[];
  businessProfiles: BusinessProfile[];
  agents: AiAgent[];
  pendingTasks: ApprovalTask[];
  alerts: Alert[];
  auditLogs: AuditLog[];
}
