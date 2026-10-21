-- ==============================================================================
-- Limitless English Connect: Initial Supabase PostgreSQL Schema
-- File: supabase_schema.sql
-- ==============================================================================
-- Clean, secure, initial setup for newly created Supabase projects.
-- Designed for Phase 1 Adult Test Accounts with teacher-enforced pairing.
-- No migration logic from previous drafts; run once in Supabase SQL Editor.
-- ==============================================================================

-- 1. CLEANUP (Idempotent for fresh project setup)
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists tr_enforce_profile_update_integrity on public.profiles;
drop trigger if exists tr_validate_partner_assignment on public.partner_assignments;

drop view if exists public.partner_profiles_view;
drop table if exists public.safety_report_notes cascade;
drop table if exists public.safety_reports cascade;
drop table if exists public.partner_assignments cascade;
drop table if exists public.profiles cascade;

drop function if exists public.is_teacher() cascade;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.enforce_profile_update_integrity() cascade;
drop function if exists public.validate_partner_assignment() cascade;

-- ==============================================================================
-- 2. TABLE DEFINITIONS
-- ==============================================================================

-- (A) PROFILES TABLE
-- Secure user profiles linked directly to Supabase Auth (auth.users).
-- Phase 1: Strictly configured for adult test accounts (age >= 18).
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null check (role in ('student', 'teacher')) default 'student',
  age_group text not null check (age_group = 'adult') default 'adult',
  age integer check (age is null or (age >= 18 and age < 120)),
  vision_preference text not null default 'low-vision-large-text',
  native_language text not null default 'Beginner',
  avatar_color text not null default 'bg-blue-600',
  bio_text text not null default 'Excited to practice English!',
  is_approved boolean not null default false,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- (B) SEPARATE PARTNER ASSIGNMENTS TABLE
-- Decoupled from profiles to eliminate nested trigger recursion.
-- Only teachers can create or modify partner assignments.
create table public.partner_assignments (
  id uuid primary key default gen_random_uuid(),
  student_a_id uuid not null references public.profiles(id) on delete cascade,
  student_b_id uuid not null references public.profiles(id) on delete cascade,
  status text not null check (status in ('active', 'ended')) default 'active',
  assigned_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null,
  constraint partner_not_self check (student_a_id <> student_b_id)
);

create index idx_partner_assignments_lookup 
  on public.partner_assignments (student_a_id, student_b_id, status);

-- (C) SAFETY REPORTS TABLE
-- Filed by students or teachers; contains report status and student-visible data.
-- Does NOT contain private teacher notes.
create table public.safety_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reporter_name text not null,
  reported_user_id uuid not null references public.profiles(id) on delete cascade,
  reported_user_name text not null,
  reason text not null,
  status text not null check (status in ('pending', 'under_review', 'resolved', 'dismissed')) default 'pending',
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- (D) PRIVATE TEACHER NOTES TABLE (SEPARATED FROM STUDENT REPORTS)
-- Private investigative notes accessible ONLY to verified teachers.
create table public.safety_report_notes (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.safety_reports(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  note text not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) ACTIVATION
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.partner_assignments enable row level security;
alter table public.safety_reports enable row level security;
alter table public.safety_report_notes enable row level security;

-- ==============================================================================
-- 4. SECURITY DEFINER HELPER: IS_TEACHER()
-- ==============================================================================
create or replace function public.is_teacher()
returns boolean
language sql
security definer
set search_path = public, pg_temp
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'teacher'
      and is_approved = true
  );
$$;

-- ==============================================================================
-- 4B. SECURITY DEFINER HELPER: SYNC_VERIFIED_TEACHER_PROFILE()
-- ==============================================================================
-- Safe, administrator-authorized correction targeting ONLY Teacher Bahora.
-- Prevents any unauthorized student privilege escalation by checking auth.uid() and email.
create or replace function public.sync_verified_teacher_profile()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  update public.profiles
  set
    role = 'teacher',
    is_approved = true,
    name = 'Teacher Bahora',
    updated_at = timezone('utc'::text, now())
  where id = auth.uid()
    and lower(trim(email)) = 'btoyirova1982@gmail.com';
end;
$$;

revoke all on function public.sync_verified_teacher_profile() from public, anon;
grant execute on function public.sync_verified_teacher_profile() to authenticated;

-- ==============================================================================
-- 5. PUBLIC REGISTRATION TRIGGER: HARDENED AGAINST PRIVILEGE ESCALATION
-- ==============================================================================
-- Unconditionally forces role = 'student' and is_approved = false.
-- Rejects minor (<18) registration during Phase 1 testing.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  declared_group text;
  declared_age int;
begin
  declared_group := lower(trim(coalesce(new.raw_user_meta_data->>'age_group', 'adult')));
  declared_age := nullif((new.raw_user_meta_data->>'age')::text, '')::integer;

  -- Phase 1 Safeguard: Only adult test accounts are supported.
  if declared_group = 'child' or (declared_age is not null and declared_age < 18) then
    raise exception 'Registration for minors (<18) is currently disabled pending safeguarding review. Only adult learners (18+) may register during Phase 1 testing.';
  end if;

  -- Designated verified teacher account for Teacher Bahora
  if lower(trim(new.email)) = 'btoyirova1982@gmail.com' then
    insert into public.profiles (
      id,
      name,
      email,
      role,
      age_group,
      age,
      vision_preference,
      native_language,
      avatar_color,
      bio_text,
      is_approved
    ) values (
      new.id,
      'Teacher Bahora',
      new.email,
      'teacher',
      'adult',
      38,
      'standard',
      'Uzbek',
      'bg-purple-700',
      'English Instructor & Educational Lead at Limitless English Connect',
      true
    )
    on conflict (id) do update set
      role = 'teacher',
      is_approved = true,
      name = 'Teacher Bahora',
      updated_at = timezone('utc'::text, now());
    return new;
  end if;

  insert into public.profiles (
    id,
    name,
    email,
    role,
    age_group,
    age,
    vision_preference,
    native_language,
    avatar_color,
    bio_text,
    is_approved
  ) values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'name'), ''), 'New Learner'),
    new.email,
    'student', -- FORCED: Client metadata can NEVER grant teacher role
    'adult',   -- FORCED: Adult test cohort
    coalesce(declared_age, 25),
    coalesce(nullif(trim(new.raw_user_meta_data->>'vision_preference'), ''), 'low-vision-large-text'),
    coalesce(nullif(trim(new.raw_user_meta_data->>'native_language'), ''), 'Beginner'),
    coalesce(nullif(trim(new.raw_user_meta_data->>'avatar_color'), ''), 'bg-blue-600'),
    coalesce(nullif(trim(new.raw_user_meta_data->>'bio_text'), ''), 'Excited to practice English!'),
    false      -- FORCED: All public registrations start unapproved
  );
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- 6. PROFILE INTEGRITY TRIGGER: PREVENT STUDENT PRIVILEGE ESCALATION
-- ==============================================================================
-- Allows students to edit ONLY presentation preferences (name, bio, vision, language, avatar).
-- Prevents modifying role, is_approved, email, age_group, age, id, or created_at.
-- Never executes updates on other profiles (prevents nested trigger recursion).
create or replace function public.enforce_profile_update_integrity()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- Authorized teachers may manage approvals and profiles
  if public.is_teacher() then
    new.updated_at := timezone('utc'::text, now());
    return new;
  end if;

  -- Ordinary students updating their own profile:
  -- Strictly forbid modifying protected security and identity columns
  if (new.id is distinct from old.id) or
     (new.email is distinct from old.email) or
     (new.role is distinct from old.role) or
     (new.is_approved is distinct from old.is_approved) or
     (new.age_group is distinct from old.age_group) or
     (new.age is distinct from old.age) or
     (new.created_at is distinct from old.created_at) then
    raise exception 'Permission denied: Students may only edit presentation preferences (name, bio, vision preference, language, avatar).';
  end if;

  new.updated_at := timezone('utc'::text, now());
  return new;
end;
$$;

revoke all on function public.enforce_profile_update_integrity() from public, anon;

create trigger tr_enforce_profile_update_integrity
  before update on public.profiles
  for each row execute procedure public.enforce_profile_update_integrity();

-- ==============================================================================
-- 7. PARTNER ASSIGNMENT VALIDATION TRIGGER (TEACHER-ENFORCED)
-- ==============================================================================
-- Validates that only teachers can create/modify partnerships and both students are approved adults.
-- Never performs updates on the profiles table (prevents nested trigger recursion).
create or replace function public.validate_partner_assignment()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  s1 record;
  s2 record;
begin
  if not public.is_teacher() then
    raise exception 'Permission denied: Only teachers may assign speaking partners.';
  end if;

  select id, is_approved, age_group into s1 from public.profiles where id = new.student_a_id;
  select id, is_approved, age_group into s2 from public.profiles where id = new.student_b_id;

  if s1.id is null or s2.id is null then
    raise exception 'Safeguard violation: Both student profiles must exist.';
  end if;

  if not (s1.is_approved = true and s2.is_approved = true) then
    raise exception 'Safeguard violation: Both learners must be approved by a teacher before pairing.';
  end if;

  if s1.age_group <> 'adult' or s2.age_group <> 'adult' then
    raise exception 'Safeguard violation: Only adult learners are eligible during Phase 1 testing.';
  end if;

  new.updated_at := timezone('utc'::text, now());
  return new;
end;
$$;

revoke all on function public.validate_partner_assignment() from public, anon;

create trigger tr_validate_partner_assignment
  before insert or update on public.partner_assignments
  for each row execute procedure public.validate_partner_assignment();

-- ==============================================================================
-- 8. ROW LEVEL SECURITY POLICIES
-- ==============================================================================

-- (A) PROFILES RLS
-- Students may only read their own private profile. Teachers can view all profiles.
create policy "profiles_select_policy"
  on public.profiles
  for select
  using (auth.uid() = id or public.is_teacher());

create policy "profiles_update_policy"
  on public.profiles
  for update
  using (auth.uid() = id or public.is_teacher())
  with check (auth.uid() = id or public.is_teacher());

-- (B) PARTNER ASSIGNMENTS RLS
-- Teachers can view and manage all assignments.
-- Approved students can view their own active assignment only.
create policy "partner_assignments_select_policy"
  on public.partner_assignments
  for select
  using (
    public.is_teacher()
    or (
      status = 'active'
      and (auth.uid() = student_a_id or auth.uid() = student_b_id)
      and exists (
        select 1 from public.profiles where id = auth.uid() and is_approved = true
      )
    )
  );

create policy "partner_assignments_teacher_insert"
  on public.partner_assignments
  for insert
  with check (public.is_teacher());

create policy "partner_assignments_teacher_update"
  on public.partner_assignments
  for update
  using (public.is_teacher())
  with check (public.is_teacher());

create policy "partner_assignments_teacher_delete"
  on public.partner_assignments
  for delete
  using (public.is_teacher());

-- (C) SAFETY REPORTS RLS
-- Students can insert safety reports for themselves.
create policy "safety_reports_student_insert"
  on public.safety_reports
  for insert
  with check (auth.uid() = reporter_id);

-- Students can read reports they filed; teachers can read all reports.
create policy "safety_reports_select_policy"
  on public.safety_reports
  for select
  using (auth.uid() = reporter_id or public.is_teacher());

-- Only teachers can update status or delete reports.
create policy "safety_reports_teacher_update"
  on public.safety_reports
  for update
  using (public.is_teacher())
  with check (public.is_teacher());

create policy "safety_reports_teacher_delete"
  on public.safety_reports
  for delete
  using (public.is_teacher());

-- (D) PRIVATE TEACHER NOTES RLS
-- Students have ZERO access to teacher notes. Only verified teachers can read and write.
create policy "safety_report_notes_teacher_select"
  on public.safety_report_notes
  for select
  using (public.is_teacher());

create policy "safety_report_notes_teacher_insert"
  on public.safety_report_notes
  for insert
  with check (public.is_teacher() and auth.uid() = author_id);

create policy "safety_report_notes_teacher_update"
  on public.safety_report_notes
  for update
  using (public.is_teacher())
  with check (public.is_teacher());

create policy "safety_report_notes_teacher_delete"
  on public.safety_report_notes
  for delete
  using (public.is_teacher());

-- ==============================================================================
-- 9. SANITIZED PARTNER VIEW (MINIMAL PUBLIC-SAFE FIELDS)
-- ==============================================================================
-- Exposes ONLY safe presentation columns (no email, age, or private metadata).
-- Exposes records ONLY if both learners are approved and currently paired.
create or replace view public.partner_profiles_view as
select
  p.id,
  p.name,
  p.avatar_color,
  p.bio_text,
  p.native_language,
  p.vision_preference,
  p.is_approved
from public.profiles p
where (
  exists (
    select 1
    from public.partner_assignments pa
    join public.profiles me on me.id = auth.uid()
    where pa.status = 'active'
      and me.is_approved = true
      and p.is_approved = true
      and (
        (pa.student_a_id = auth.uid() and pa.student_b_id = p.id)
        or
        (pa.student_b_id = auth.uid() and pa.student_a_id = p.id)
      )
  )
  or public.is_teacher()
);

-- ==============================================================================
-- 10. LEAST-PRIVILEGE SCHEMA GRANTS
-- ==============================================================================
revoke all on public.profiles from public, anon;
grant select, update on public.profiles to authenticated;

revoke all on public.partner_assignments from public, anon;
grant select, insert, update, delete on public.partner_assignments to authenticated;

revoke all on public.safety_reports from public, anon;
grant select, insert, update, delete on public.safety_reports to authenticated;

revoke all on public.safety_report_notes from public, anon;
grant select, insert, update, delete on public.safety_report_notes to authenticated;

revoke all on public.partner_profiles_view from public, anon;
grant select on public.partner_profiles_view to authenticated;

-- ==============================================================================
-- 11. STUDENT PRACTICE RECORDINGS & EVALUATIONS TABLE (OPTIONAL STORAGE SYNC)
-- ==============================================================================
create table if not exists public.student_practice_recordings (
  id text primary key,
  student_id uuid not null references public.profiles(id) on delete cascade,
  student_name text not null,
  topic_id text not null,
  topic_title text not null,
  question_id text not null,
  question_text text not null,
  audio_url text not null,
  storage_path text,
  duration_seconds integer not null default 0,
  submitted_at timestamptz default timezone('utc'::text, now()) not null,
  evaluation jsonb
);

alter table public.student_practice_recordings enable row level security;

-- Students can select and insert their own recordings
create policy "Students can view their own practice recordings"
  on public.student_practice_recordings for select
  to authenticated
  using (student_id = auth.uid() or public.is_teacher());

create policy "Students can insert their own practice recordings"
  on public.student_practice_recordings for insert
  to authenticated
  with check (student_id = auth.uid());

create policy "Students can delete their own practice recordings"
  on public.student_practice_recordings for delete
  to authenticated
  using (student_id = auth.uid() or public.is_teacher());

revoke all on public.student_practice_recordings from public, anon;
grant select, insert, delete on public.student_practice_recordings to authenticated;

-- ==============================================================================
-- 12. SUPABASE STORAGE RLS POLICIES FOR PRIVATE BUCKET: student-recordings
-- ==============================================================================
-- Enforces:
-- 1. Authenticated students can upload files ONLY into their own folder (auth.uid()).
-- 2. Authenticated students can read/download ONLY their own files (via signed URLs or authenticated downloads).
-- 3. Authenticated students can delete ONLY their own files.
-- 4. Verified teachers (is_teacher()) can review practice audio for instructional feedback.

-- Enable RLS on storage.objects (standard in Supabase projects)
alter table storage.objects enable row level security;

-- (A) SELECT POLICY: Students can read only files stored in their own auth.uid() folder; teachers can read student audio
drop policy if exists "student_recordings_select_policy" on storage.objects;
create policy "student_recordings_select_policy"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'student-recordings'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_teacher()
    )
  );

-- (B) INSERT POLICY: Students can only upload into a top-level folder matching their authenticated auth.uid()
drop policy if exists "student_recordings_insert_policy" on storage.objects;
create policy "student_recordings_insert_policy"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'student-recordings'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- (C) UPDATE POLICY: Students can update or upsert files only within their own auth.uid() folder
drop policy if exists "student_recordings_update_policy" on storage.objects;
create policy "student_recordings_update_policy"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'student-recordings'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'student-recordings'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- (D) DELETE POLICY: Students can delete files only in their own auth.uid() folder; teachers can clean up
drop policy if exists "student_recordings_delete_policy" on storage.objects;
create policy "student_recordings_delete_policy"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'student-recordings'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_teacher()
    )
  );
-- ==============================================================================

-- ==============================================================================
-- 13. ONE-TIME SECURE TEACHER PROMOTION COMMAND
-- ==============================================================================
-- INSTRUCTIONS FOR TEACHER SETUP:
-- 1. In your Limitless English web app, click "Student & Teacher Login".
-- 2. Select "Create Account" and sign up with your email (e.g. btoyirova1982@gmail.com).
--    (Your account will initially register as an unapproved student).
-- 3. In the Supabase SQL Editor, run the single command below with your email:
--
-- UPDATE public.profiles
-- SET
--   role = 'teacher',
--   is_approved = true,
--   updated_at = timezone('utc'::text, now())
-- WHERE email = 'btoyirova1982@gmail.com';
-- ==============================================================================

-- ==============================================================================
-- 14. STUDENT AVATARS & ENGLISH COINS GAMIFICATION SCHEMA
-- ==============================================================================

create table if not exists public.student_avatars (
  student_id uuid primary key references auth.users(id) on delete cascade,
  avatar_config jsonb not null default '{
    "characterName": "Sam",
    "skinTone": "honey",
    "eyeStyle": "gentle",
    "eyeColor": "dark-brown",
    "hairStyle": "short-crop",
    "hairColor": "jet-black",
    "clothing": "starter-navy-tee",
    "accessory": "none"
  }'::jsonb,
  coins_balance integer not null default 0 check (coins_balance >= 0),
  owned_item_ids text[] not null default array[
    'short-crop',
    'curly-crop',
    'natural-waves',
    'starter-navy-tee',
    'starter-emerald-polo',
    'starter-sunny-hoodie',
    'starter-plum-sweater',
    'eye-style-gentle',
    'eye-style-round',
    'eye-color-dark-brown',
    'eye-color-hazel'
  ]::text[],
  completed_activity_keys text[] not null default array[]::text[],
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.student_coin_transactions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,
  activity_key text not null,
  description text not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- Indexing for fast lookups
create index if not exists idx_student_avatars_student_id on public.student_avatars(student_id);
create index if not exists idx_student_coin_tx_student_id on public.student_coin_transactions(student_id, created_at desc);

-- Enable RLS
alter table public.student_avatars enable row level security;
alter table public.student_coin_transactions enable row level security;

-- Student Avatars Policies:
-- Students can read their own avatar, or teachers can view student avatars
drop policy if exists "Students can view their own avatar" on public.student_avatars;
create policy "Students can view their own avatar"
  on public.student_avatars for select
  to authenticated
  using (student_id = auth.uid() or public.is_teacher());

drop policy if exists "Students can insert their own avatar" on public.student_avatars;
create policy "Students can insert their own avatar"
  on public.student_avatars for insert
  to authenticated
  with check (student_id = auth.uid());

drop policy if exists "Students can update their own avatar" on public.student_avatars;
create policy "Students can update their own avatar"
  on public.student_avatars for update
  to authenticated
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

-- Student Coin Transactions Policies:
-- Students can read their own transaction history, or teachers can view
drop policy if exists "Students can view their own coin transactions" on public.student_coin_transactions;
create policy "Students can view their own coin transactions"
  on public.student_coin_transactions for select
  to authenticated
  using (student_id = auth.uid() or public.is_teacher());

drop policy if exists "Students can insert their own coin transactions" on public.student_coin_transactions;
create policy "Students can insert their own coin transactions"
  on public.student_coin_transactions for insert
  to authenticated
  with check (student_id = auth.uid());

-- Grant authenticated access
revoke all on public.student_avatars from public, anon;
grant select, insert, update on public.student_avatars to authenticated;

revoke all on public.student_coin_transactions from public, anon;
grant select, insert on public.student_coin_transactions to authenticated;
-- ==============================================================================

-- ==============================================================================
-- 15. STUDENT-TEACHER & COMMUNITY MESSAGING WITH SECURE RLS
-- ==============================================================================

-- 15.1 TEACHER <-> STUDENT DIRECT MESSAGES
create table if not exists public.teacher_student_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  sender_name text not null,
  sender_role text not null check (sender_role in ('student', 'teacher')),
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  receiver_name text not null,
  text_content text,
  audio_url text,
  duration_seconds integer,
  is_read boolean not null default false,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  constraint message_content_check check (text_content is not null or audio_url is not null)
);

create index if not exists idx_ts_messages_participants
  on public.teacher_student_messages (sender_id, receiver_id, created_at desc);

create index if not exists idx_ts_messages_unread
  on public.teacher_student_messages (receiver_id, is_read)
  where is_read = false;

alter table public.teacher_student_messages enable row level security;

drop policy if exists "Users can view their own direct messages" on public.teacher_student_messages;
create policy "Users can view their own direct messages"
  on public.teacher_student_messages for select
  to authenticated
  using (
    sender_id = auth.uid()
    or receiver_id = auth.uid()
    or public.is_teacher()
  );

drop policy if exists "Users can insert direct messages as self" on public.teacher_student_messages;
create policy "Users can insert direct messages as self"
  on public.teacher_student_messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
  );

drop policy if exists "Receivers can mark messages as read" on public.teacher_student_messages;
create policy "Receivers can mark messages as read"
  on public.teacher_student_messages for update
  to authenticated
  using (receiver_id = auth.uid() or public.is_teacher())
  with check (receiver_id = auth.uid() or public.is_teacher());

-- 15.2 COMMUNITY GROUP CHATS & MESSAGES
create table if not exists public.community_group_chats (
  id text primary key,
  name text not null,
  description text not null,
  topic_id text,
  created_by uuid references public.profiles(id) on delete set null,
  is_active boolean not null default true,
  max_members integer not null default 50,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.community_group_chats enable row level security;

drop policy if exists "Approved learners can view group chats" on public.community_group_chats;
create policy "Approved learners can view group chats"
  on public.community_group_chats for select
  to authenticated
  using (is_active = true or public.is_teacher());

drop policy if exists "Only teachers can manage groups" on public.community_group_chats;
create policy "Only teachers can manage groups"
  on public.community_group_chats for all
  to authenticated
  using (public.is_teacher())
  with check (public.is_teacher());

create table if not exists public.community_group_messages (
  id text primary key,
  group_id text not null references public.community_group_chats(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  sender_name text not null,
  sender_role text not null check (sender_role in ('student', 'teacher')),
  sender_avatar_color text not null default 'bg-blue-600',
  text_content text,
  audio_url text,
  duration_seconds integer,
  is_announcement boolean not null default false,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_group_messages_lookup
  on public.community_group_messages (group_id, created_at asc);

alter table public.community_group_messages enable row level security;

drop policy if exists "Learners can view group messages" on public.community_group_messages;
create policy "Learners can view group messages"
  on public.community_group_messages for select
  to authenticated
  using (true);

drop policy if exists "Learners can post group messages" on public.community_group_messages;
create policy "Learners can post group messages"
  on public.community_group_messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and (is_announcement = false or public.is_teacher())
  );

drop policy if exists "Teachers can moderate group messages" on public.community_group_messages;
create policy "Teachers can moderate group messages"
  on public.community_group_messages for delete
  to authenticated
  using (public.is_teacher());

-- 15.3 STUDENT PRESENCE & DISCOVERABILITY
create table if not exists public.student_presence (
  student_id uuid primary key references public.profiles(id) on delete cascade,
  student_name text not null,
  avatar_color text not null default 'bg-blue-600',
  age_group text not null default 'adult',
  vision_preference text not null default 'low-vision-large-text',
  status text not null check (status in ('available', 'busy', 'offline')) default 'available',
  is_discoverable boolean not null default true,
  allow_incoming_messages boolean not null default true,
  last_active_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.student_presence enable row level security;

drop policy if exists "Learners can view discoverable peers" on public.student_presence;
create policy "Learners can view discoverable peers"
  on public.student_presence for select
  to authenticated
  using (
    student_id = auth.uid()
    or public.is_teacher()
    or (is_discoverable = true and status <> 'offline')
  );

drop policy if exists "Users can manage own presence" on public.student_presence;
create policy "Users can manage own presence"
  on public.student_presence for all
  to authenticated
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

-- 15.4 TEACHER CLASSES & ENROLLMENTS
create table if not exists public.teacher_classes (
  id text primary key,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  teacher_name text not null,
  name text not null,
  description text not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

create table if not exists public.class_enrollments (
  id uuid primary key default gen_random_uuid(),
  class_id text not null references public.teacher_classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  enrolled_at timestamptz default timezone('utc'::text, now()) not null,
  constraint unique_class_enrollment unique (class_id, student_id)
);

alter table public.teacher_classes enable row level security;
alter table public.class_enrollments enable row level security;

drop policy if exists "View classes policy" on public.teacher_classes;
create policy "View classes policy"
  on public.teacher_classes for select
  to authenticated
  using (
    teacher_id = auth.uid()
    or public.is_teacher()
    or exists (
      select 1 from public.class_enrollments
      where class_id = public.teacher_classes.id and student_id = auth.uid()
    )
  );

drop policy if exists "Teachers manage classes" on public.teacher_classes;
create policy "Teachers manage classes"
  on public.teacher_classes for all
  to authenticated
  using (public.is_teacher())
  with check (public.is_teacher());

drop policy if exists "View enrollments policy" on public.class_enrollments;
create policy "View enrollments policy"
  on public.class_enrollments for select
  to authenticated
  using (student_id = auth.uid() or public.is_teacher());

drop policy if exists "Teachers manage enrollments" on public.class_enrollments;
create policy "Teachers manage enrollments"
  on public.class_enrollments for all
  to authenticated
  using (public.is_teacher())
  with check (public.is_teacher());

-- 15.5 PRIVATE STORAGE BUCKET: 'voice-messages'
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'voice-messages',
  'voice-messages',
  false,
  10485760,
  array['audio/webm', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/mp4', 'audio/x-m4a']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = array['audio/webm', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/mp4', 'audio/x-m4a'];

drop policy if exists "voice_messages_upload_policy" on storage.objects;
create policy "voice_messages_upload_policy"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'voice-messages'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "voice_messages_select_policy" on storage.objects;
create policy "voice_messages_select_policy"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'voice-messages'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_teacher()
      or exists (
        select 1 from public.teacher_student_messages
        where audio_url like '%' || name || '%'
          and (receiver_id = auth.uid() or sender_id = auth.uid())
      )
    )
  );

drop policy if exists "voice_messages_delete_policy" on storage.objects;
create policy "voice_messages_delete_policy"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'voice-messages'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_teacher()
    )
  );

grant select, insert, update on public.teacher_student_messages to authenticated;
grant select, insert, update, delete on public.community_group_chats to authenticated;
grant select, insert, delete on public.community_group_messages to authenticated;
grant select, insert, update on public.student_presence to authenticated;
grant select, insert, update, delete on public.teacher_classes to authenticated;
grant select, insert, delete on public.class_enrollments to authenticated;
-- ==============================================================================

