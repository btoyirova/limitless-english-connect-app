-- ==============================================================================
-- Limitless English Connect: Student-Teacher & Community Messaging Migration
-- File: supabase_messaging_migration.sql
-- Privacy Constitution: Enforced via Database Row Level Security (RLS)
-- ==============================================================================
-- Summary of Privacy & Access Architecture:
-- 1. Teacher Bahora <-> Student Direct Messages:
--    - Teacher Bahora has FULL access to view, listen, and reply to all her own
--      conversations with students.
--    - Student-to-student private conversations are STRICTLY PRIVATE.
--      Teacher Bahora cannot browse, search, retrieve, or listen to student-to-student
--      chats under any circumstance, enforced at the PostgreSQL RLS and Storage policy levels.
-- 2. Anti-Impersonation & Read Status Anti-Tampering:
--    - Only the authenticated sender can insert messages as themselves (sender_id = auth.uid()).
--    - Receivers can only update read status (is_read); a trigger strictly forbids
--      modifying participants, content, audio, or timestamps.
-- 3. Class Group Chats (Teacher-Moderated):
--    - Group chats managed by Teacher Bahora display a mandatory moderation notice.
--    - Only enrolled group members and designated moderators can view or post messages.
--    - Server-side verified moderation: Only Teacher Bahora and group moderators can delete/moderate.
-- 4. Reported Messages (Minimal & Specific Disclosure):
--    - A third-party private message is disclosed to Teacher Bahora ONLY if explicitly
--      referenced by an active, un-dismissed safety report (status = 'pending' or 'under_review').
-- 5. Private Voice Storage ('voice-messages'):
--    - Voice recordings are private (public = false).
--    - Direct message audio is accessible ONLY to the conversation participants.
--    - Group message audio is accessible ONLY to verified group members.
-- ==============================================================================

-- 0. PREREQUISITE: VERIFIED TEACHER ROLE HELPER (IDEMPOTENT)
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

revoke all on function public.is_teacher() from public, anon;
grant execute on function public.is_teacher() to authenticated;


-- ==============================================================================
-- 1. DIRECT MESSAGES TABLE (TEACHER-STUDENT & PRIVATE STUDENT-STUDENT)
-- ==============================================================================
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

-- Add reported_message_id to safety_reports if missing
alter table public.safety_reports add column if not exists reported_message_id uuid references public.teacher_student_messages(id) on delete set null;
alter table public.safety_reports add column if not exists reported_message_content text;

-- Enable RLS
alter table public.teacher_student_messages enable row level security;

-- (A) SELECT POLICY: Strictly private 1-to-1 conversations
-- Only conversation participants can view their conversation.
-- Teacher Bahora has full access to her own conversations (as sender or receiver).
-- Student-to-student conversations remain strictly inaccessible to Teacher Bahora,
-- UNLESS explicitly reported under an active safety report.
drop policy if exists "Users can view their own direct messages" on public.teacher_student_messages;
create policy "Users can view their own direct messages"
  on public.teacher_student_messages for select
  to authenticated
  using (
    -- Direct conversation participant
    sender_id = auth.uid()
    or receiver_id = auth.uid()
    -- Limited safety disclosure: strictly for explicitly reported messages under active review
    or (
      public.is_teacher()
      and exists (
        select 1 from public.safety_reports sr
        where sr.reported_message_id = public.teacher_student_messages.id
          and sr.status in ('pending', 'under_review')
      )
    )
  );

-- (B) INSERT POLICY: Anti-impersonation: authenticated users can only insert messages as themselves
drop policy if exists "Users can insert direct messages as self" on public.teacher_student_messages;
create policy "Users can insert direct messages as self"
  on public.teacher_student_messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
  );

-- (C) ANTI-TAMPERING TRIGGER: Prevent modifying message content, participants, audio, or dates
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
     new.duration_seconds is distinct from old.duration_seconds or
     new.created_at <> old.created_at then
    raise exception 'Permission denied: Message participants, text content, audio, and metadata cannot be modified. Only recipient may update read status.';
  end if;
  return new;
end;
$$;

drop trigger if exists tr_enforce_message_read_only_update on public.teacher_student_messages;
create trigger tr_enforce_message_read_only_update
  before update on public.teacher_student_messages
  for each row execute procedure public.enforce_message_read_only_update();

-- (D) UPDATE POLICY: Receivers can mark messages as read without altering content
drop policy if exists "Receivers can mark messages as read" on public.teacher_student_messages;
create policy "Receivers can mark messages as read"
  on public.teacher_student_messages for update
  to authenticated
  using (receiver_id = auth.uid())
  with check (receiver_id = auth.uid());

-- Enable Realtime publication for instant delivery
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

-- Allow authenticated learners to discover verified teachers (to obtain real auth UUID for messaging)
drop policy if exists "profiles_select_policy" on public.profiles;
create policy "profiles_select_policy"
  on public.profiles
  for select
  to authenticated
  using (
    auth.uid() = id 
    or public.is_teacher() 
    or (role = 'teacher' and is_approved = true)
  );

-- Helper RPC for learners to safely retrieve the verified teacher's UUID without broad profile exposure
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
  where role = 'teacher' and is_approved = true
  limit 1;
$$;

revoke all on function public.get_verified_teacher_id() from public, anon;
grant execute on function public.get_verified_teacher_id() to authenticated;


-- ==============================================================================
-- 2. TEACHER-MODERATED COMMUNITY GROUP CHATS & MEMBERSHIPS
-- ==============================================================================
create table if not exists public.community_group_chats (
  id text primary key,
  name text not null,
  description text not null,
  topic_id text,
  created_by uuid references public.profiles(id) on delete set null,
  moderator_name text not null default 'Teacher Bahora',
  moderation_notice text not null default 'Notice: This class group is moderated by Teacher Bahora to maintain a safe, supportive learning community.',
  is_active boolean not null default true,
  max_members integer not null default 50,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create table if not exists public.community_group_members (
  id uuid primary key default gen_random_uuid(),
  group_id text not null references public.community_group_chats(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('member', 'moderator', 'admin')) default 'member',
  joined_at timestamptz default timezone('utc'::text, now()) not null,
  constraint unique_group_member unique (group_id, user_id)
);

alter table public.community_group_chats enable row level security;
alter table public.community_group_members enable row level security;

-- Group chats: active groups visible to authenticated users
drop policy if exists "Approved learners can view group chats" on public.community_group_chats;
create policy "Approved learners can view group chats"
  on public.community_group_chats for select
  to authenticated
  using (is_active = true or public.is_teacher());

-- Group chats management: only verified teachers can create/modify groups
drop policy if exists "Only teachers can manage groups" on public.community_group_chats;
create policy "Only teachers can manage groups"
  on public.community_group_chats for all
  to authenticated
  using (public.is_teacher())
  with check (public.is_teacher());

-- Group members roster: group members and teachers can view
drop policy if exists "View group members" on public.community_group_members;
create policy "View group members"
  on public.community_group_members for select
  to authenticated
  using (
    user_id = auth.uid()
    or public.is_teacher()
    or exists (
      select 1 from public.community_group_members gm
      where gm.group_id = public.community_group_members.group_id
        and gm.user_id = auth.uid()
    )
  );

-- Group members management: only teachers can enroll/remove members
drop policy if exists "Teachers manage group memberships" on public.community_group_members;
create policy "Teachers manage group memberships"
  on public.community_group_members for all
  to authenticated
  using (public.is_teacher())
  with check (public.is_teacher());


-- ==============================================================================
-- 3. COMMUNITY GROUP MESSAGES TABLE
-- ==============================================================================
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

-- Group messages SELECT: ONLY authorized group members and group moderators/teachers
drop policy if exists "Authorized members and moderators can view group messages" on public.community_group_messages;
create policy "Authorized members and moderators can view group messages"
  on public.community_group_messages for select
  to authenticated
  using (
    public.is_teacher()
    or exists (
      select 1 from public.community_group_chats gc
      where gc.id = public.community_group_messages.group_id
        and gc.created_by = auth.uid()
    )
    or exists (
      select 1 from public.community_group_members gm
      where gm.group_id = public.community_group_messages.group_id
        and gm.user_id = auth.uid()
    )
  );

-- Group messages INSERT: verified members posting as themselves
drop policy if exists "Authorized members can post group messages" on public.community_group_messages;
create policy "Authorized members can post group messages"
  on public.community_group_messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and (
      public.is_teacher()
      or exists (
        select 1 from public.community_group_members gm
        where gm.group_id = public.community_group_messages.group_id
          and gm.user_id = auth.uid()
      )
    )
    and (is_announcement = false or public.is_teacher())
  );

-- Group messages DELETE: Teacher Bahora and designated group moderators only
drop policy if exists "Moderators and teachers can delete group messages" on public.community_group_messages;
create policy "Moderators and teachers can delete group messages"
  on public.community_group_messages for delete
  to authenticated
  using (
    public.is_teacher()
    or exists (
      select 1 from public.community_group_members gm
      where gm.group_id = public.community_group_messages.group_id
        and gm.user_id = auth.uid()
        and gm.role in ('moderator', 'admin')
    )
    or exists (
      select 1 from public.community_group_chats gc
      where gc.id = public.community_group_messages.group_id
        and gc.created_by = auth.uid()
    )
  );

-- Add group messages to Realtime publication
do $$
begin
  if exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    begin
      alter publication supabase_realtime add table public.community_group_messages;
    exception when others then
      null;
    end;
  end if;
end;
$$;


-- ==============================================================================
-- 4. STUDENT PRESENCE & DISCOVERABILITY TABLE
-- ==============================================================================
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


-- ==============================================================================
-- 5. TEACHER CLASSES & STUDENT ENROLLMENTS
-- ==============================================================================
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


-- ==============================================================================
-- 6. PRIVATE STORAGE BUCKET: 'voice-messages'
-- ==============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'voice-messages',
  'voice-messages',
  false, -- STRICT: Private bucket, signed URLs and participant RLS enforced
  10485760, -- 10MB maximum voice file size
  array['audio/webm', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/mp4', 'audio/x-m4a']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = array['audio/webm', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/mp4', 'audio/x-m4a'];

-- Storage RLS: Upload to voice-messages
-- Users can only upload into their own folder (auth.uid())
drop policy if exists "voice_messages_upload_policy" on storage.objects;
create policy "voice_messages_upload_policy"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'voice-messages'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage RLS: Download/Listen to voice-messages
-- Strictly limited to:
-- 1. The original uploader
-- 2. The direct conversation participant (sender or receiver of the message)
-- 3. Authorized members of a group chat containing the audio
-- 4. Authorized teacher ONLY if the specific message was reported under active review
drop policy if exists "voice_messages_select_policy" on storage.objects;
create policy "voice_messages_select_policy"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'voice-messages'
    and (
      -- Uploader
      (storage.foldername(name))[1] = auth.uid()::text
      -- Direct message conversation participant
      or exists (
        select 1 from public.teacher_student_messages m
        where m.audio_url like '%' || name || '%'
          and (m.receiver_id = auth.uid() or m.sender_id = auth.uid())
      )
      -- Group chat member
      or exists (
        select 1 from public.community_group_messages gm
        where gm.audio_url like '%' || name || '%'
          and (
            exists (
              select 1 from public.community_group_members mem
              where mem.group_id = gm.group_id and mem.user_id = auth.uid()
            )
            or exists (
              select 1 from public.community_group_chats gc
              where gc.id = gm.group_id and gc.created_by = auth.uid()
            )
          )
      )
      -- Reported content disclosure (strictly limited to active safety reports)
      or (
        public.is_teacher()
        and exists (
          select 1 from public.safety_reports sr
          join public.teacher_student_messages sm on sr.reported_message_id = sm.id
          where sm.audio_url like '%' || name || '%'
            and sr.status in ('pending', 'under_review')
        )
      )
    )
  );

-- Storage RLS: Delete voice-messages
-- Only the original uploader can delete their audio file
drop policy if exists "voice_messages_delete_policy" on storage.objects;
create policy "voice_messages_delete_policy"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'voice-messages'
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- ==============================================================================
-- 7. PERMISSION GRANTS
-- ==============================================================================
grant select, insert, update on public.teacher_student_messages to authenticated;
grant select, insert, update, delete on public.community_group_chats to authenticated;
grant select, insert, update, delete on public.community_group_members to authenticated;
grant select, insert, delete on public.community_group_messages to authenticated;
grant select, insert, update on public.student_presence to authenticated;
grant select, insert, update, delete on public.teacher_classes to authenticated;
grant select, insert, delete on public.class_enrollments to authenticated;
-- ==============================================================================
