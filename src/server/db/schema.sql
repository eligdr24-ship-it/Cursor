create extension if not exists "uuid-ossp";
create extension if not exists citext;

create table agencies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  plan text not null default 'starter',
  created_at timestamptz not null default now()
);

create table roles (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid references agencies(id) on delete cascade,
  name text not null,
  permissions text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (agency_id, name)
);

create table users (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid not null references agencies(id) on delete cascade,
  role_id uuid not null references roles(id),
  email citext not null,
  name text not null,
  avatar_url text,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  unique (agency_id, email)
);

create table google_accounts (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid not null references agencies(id) on delete cascade,
  user_id uuid not null references users(id),
  google_email citext not null,
  status text not null default 'connected',
  scopes text[] not null default '{}',
  access_token_encrypted text,
  refresh_token_encrypted text,
  connected_at timestamptz not null default now(),
  unique (agency_id, google_email)
);

create table imported_gmail_accounts (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid not null references agencies(id) on delete cascade,
  email citext not null,
  source text not null,
  profile_name text,
  location_id text,
  imported_by_user_id uuid not null references users(id),
  imported_at timestamptz not null default now(),
  unique (agency_id, email)
);

create table business_profiles (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid not null references agencies(id) on delete cascade,
  google_account_id uuid references google_accounts(id),
  location_id text not null,
  name text not null,
  address text not null default '',
  primary_category text not null default '',
  status text not null default 'needs_access',
  rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  health_score integer not null default 0,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  unique (agency_id, location_id)
);

create table reviews (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid not null references agencies(id) on delete cascade,
  profile_id uuid not null references business_profiles(id) on delete cascade,
  google_review_id text not null,
  rating integer not null,
  reviewer_name text not null default '',
  comment text not null default '',
  response text,
  reviewed_at timestamptz not null,
  unique (profile_id, google_review_id)
);

create table posts (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid not null references agencies(id) on delete cascade,
  profile_id uuid not null references business_profiles(id) on delete cascade,
  title text not null,
  body text not null,
  status text not null default 'draft',
  requires_approval boolean not null default true,
  scheduled_for timestamptz,
  published_at timestamptz
);

create table media_assets (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid not null references agencies(id) on delete cascade,
  profile_id uuid references business_profiles(id) on delete cascade,
  url text not null,
  kind text not null,
  status text not null default 'draft',
  requires_approval boolean not null default true,
  created_at timestamptz not null default now()
);

create table ranking_scans (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid not null references agencies(id) on delete cascade,
  profile_id uuid not null references business_profiles(id) on delete cascade,
  keyword text not null,
  status text not null default 'queued',
  created_at timestamptz not null default now()
);

create table ranking_results (
  id uuid primary key default uuid_generate_v4(),
  scan_id uuid not null references ranking_scans(id) on delete cascade,
  position integer,
  url text,
  captured_at timestamptz not null default now()
);

create table geo_grid_scans (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid not null references agencies(id) on delete cascade,
  profile_id uuid not null references business_profiles(id) on delete cascade,
  keyword text not null,
  grid_size integer not null default 49,
  status text not null default 'queued',
  created_at timestamptz not null default now()
);

create table health_issues (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid not null references agencies(id) on delete cascade,
  profile_id uuid not null references business_profiles(id) on delete cascade,
  severity text not null,
  title text not null,
  body text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table compliance_findings (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid not null references agencies(id) on delete cascade,
  profile_id uuid not null references business_profiles(id) on delete cascade,
  severity text not null,
  policy_area text not null,
  finding text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table tasks (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid not null references agencies(id) on delete cascade,
  title text not null,
  description text not null default '',
  sensitivity text not null default 'low',
  status text not null default 'pending_approval',
  requested_by_agent text,
  approved_by_user_id uuid references users(id),
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create table alerts (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid not null references agencies(id) on delete cascade,
  profile_id uuid references business_profiles(id) on delete cascade,
  severity text not null,
  title text not null,
  body text not null,
  acknowledged_at timestamptz,
  created_at timestamptz not null default now()
);

create table reports (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid not null references agencies(id) on delete cascade,
  title text not null,
  status text not null default 'draft',
  period_start date not null,
  period_end date not null,
  created_at timestamptz not null default now()
);

create table ai_agents (
  id text primary key,
  name text not null,
  focus text not null,
  permissions text[] not null default '{}',
  status text not null default 'active'
);

create table agent_memory (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid not null references agencies(id) on delete cascade,
  agent_id text not null references ai_agents(id),
  key text not null,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  unique (agency_id, agent_id, key)
);

create table agent_chats (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid not null references agencies(id) on delete cascade,
  agent_id text not null references ai_agents(id),
  user_id uuid not null references users(id),
  role text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid not null references agencies(id) on delete cascade,
  user_id uuid not null references users(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table recovery_cases (
  id uuid primary key default uuid_generate_v4(),
  agency_id uuid not null references agencies(id) on delete cascade,
  profile_id uuid not null references business_profiles(id) on delete cascade,
  case_type text not null,
  status text not null default 'open',
  notes text not null default '',
  created_at timestamptz not null default now()
);

create index audit_logs_agency_created_at_idx on audit_logs (agency_id, created_at desc);
create index business_profiles_agency_status_idx on business_profiles (agency_id, status);
create index tasks_agency_status_idx on tasks (agency_id, status);
