-- ==============================================================================
-- Limitless English Connect: Minimal Teacher-Student Messaging Migration
-- File: minimal_teacher_student_messaging_migration.sql
-- ==============================================================================
-- Requirements met:
-- 1. Creates public.teacher_student_messages table matching messagingService.ts.
-- 2. Uses real authenticated Supabase UUIDs referencing public.profiles(id).
-- 3. Strict privacy: Only the authenticated sender and receiver can view their messages.
-- 4. Anti-impersonation: Only the authenticated sender can send (sender_id = auth.uid()).
-- 5. Anti-tampering: Receivers can mark messages as read without altering content or participants.
-- 6. Enables Supabase Realtime publication.
-- 7. Deterministic RPC function public.get_verified_teacher_id() to resolve Teacher Bahora's UUID.
-- 8. ZERO dependencies on safety_reports, community groups, or unrelated tables.
-- ==============================================================================

-- 1. TEACHER <-> STUDENT DIRECT MESSAGES TABLE
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

-- Enable Row Level Security
alter table public.teacher_student_messages enable row level security;

-- (A) SELECT POLICY: Strictly private to sender and intended receiver
drop policy if exists "Users can view their own direct messages" on public.teacher_student_messages;
create policy "Users can view their own direct messages"
  on public.teacher_student_messages for select
  to authenticated
  using (
    sender_id = auth.uid()
    or receiver_id = auth.uid()
  );

-- (B) INSERT POLICY: Anti-impersonation (users can only send as themselves)
drop policy if exists "Users can insert direct messages as self" on public.teacher_student_messages;
create policy "Users can insert direct messages as self"
  on public.teacher_student_messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
  );

-- (C) ANTI-TAMPERING TRIGGER: Prevent modifying message content or participants
create or replace function public.enforce_message_read_only_update()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.id <> old.id or
     new.sender_id <> old.sender_id or
     new.receiver_id <> old.receiver_id or
     new.sender_role <> old.sender_role or
     new.sender_name <> old.sender_name or
     new.receiver_name <> old.receiver_name or
     new.text_content is distinct from old.text_content or
     new.audio_url is distinct from old.audio_url or
     new.created_at <> old.created_at then
    raise exception 'Permission denied: Message participants and content cannot be altered. Only is_read status may be updated by recipient.';
  end if;
  return new;
end;
$$;

drop trigger if exists tr_enforce_message_read_only_update on public.teacher_student_messages;
create trigger tr_enforce_message_read_only_update
  before update on public.teacher_student_messages
  for each row execute procedure public.enforce_message_read_only_update();

-- (D) UPDATE POLICY: Receivers can mark messages as read
drop policy if exists "Receivers can mark messages as read" on public.teacher_student_messages;
create policy "Receivers can mark messages as read"
  on public.teacher_student_messages for update
  to authenticated
  using (receiver_id = auth.uid())
  with check (receiver_id = auth.uid());

-- 2. ENABLE REALTIME PUBLICATION
do $$
begin
  if exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    begin
      alter publication supabase_realtime add table public.teacher_student_messages;
    exception when others then
      null;
    end;
  end if;
end;
$$;

-- 3. DETERMINISTIC TEACHER DISCOVERY RPC
-- Safe SECURITY DEFINER helper to return Teacher Bahora's verified UUID to authenticated students
create or replace function public.get_verified_teacher_id()
returns table (
  id uuid,
  name text,
  email text,
  role text,
  avatar_color text
)
language sql
security definer
set search_path = public, pg_temp
stable
as $$
  select id, name, email, role, avatar_color
  from public.profiles
  where (role = 'teacher' and is_approved = true)
     or email = 'btoyirova1982@gmail.com'
  order by (email = 'btoyirova1982@gmail.com') desc, created_at asc
  limit 1;
$$;

revoke all on function public.get_verified_teacher_id() from public, anon;
grant execute on function public.get_verified_teacher_id() to authenticated;

-- 4. GRANT PERMISSIONS TO AUTHENTICATED USERS
grant select, insert, update on public.teacher_student_messages to authenticated;
