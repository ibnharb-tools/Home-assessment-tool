-- Everstead — Supabase schema
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query).

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  address text not null,
  latitude double precision,
  longitude double precision,
  questionnaire_data jsonb not null,
  assessment_result jsonb not null,
  nickname text
);

create index if not exists assessments_user_id_created_at_idx
  on public.assessments (user_id, created_at desc);

-- Row Level Security: each user can only see and manage their own rows.
alter table public.assessments enable row level security;

drop policy if exists "Users manage their own assessments" on public.assessments;
create policy "Users manage their own assessments"
  on public.assessments
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Assessment logs: anonymous, insert-only telemetry for prompt/source review.
-- ---------------------------------------------------------------------------
create table if not exists public.assessment_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  address text,
  latitude double precision,
  longitude double precision,
  mock boolean,
  questionnaire_data jsonb,
  result_summary jsonb
);

alter table public.assessment_logs enable row level security;

-- Allow inserts from the anon role (the app logs server-side with the anon key);
-- no public SELECT, so logs are only readable from the Supabase dashboard / a
-- service-role key.
drop policy if exists "Anyone can insert a log" on public.assessment_logs;
create policy "Anyone can insert a log"
  on public.assessment_logs
  for insert
  to anon, authenticated
  with check (true);
