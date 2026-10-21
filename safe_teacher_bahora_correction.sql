-- ==============================================================================
-- Limitless English Connect: Administrator-Authorized Teacher Profile Correction
-- Target: Verified Educator Bahora (btoyirova1982@gmail.com)
-- ==============================================================================
-- Safely corrects the verified teacher database record in public.profiles.
-- Targets ONLY the verified existing account by email and auth UID.
-- Does NOT create a duplicate account.
-- Sets trusted server-side fields: role = 'teacher', is_approved = true, name = 'Teacher Bahora'.
-- Run this single command block in Supabase SQL Editor:
-- ==============================================================================

-- 1. Safely correct the verified existing teacher record in public.profiles
UPDATE public.profiles
SET
  role = 'teacher',
  is_approved = true,
  name = 'Teacher Bahora',
  bio_text = 'English Instructor & Educational Lead at Limitless English Connect. Here to guide, encourage, and support your speaking journey.',
  avatar_color = 'bg-purple-700',
  vision_preference = 'standard',
  updated_at = timezone('utc'::text, now())
WHERE lower(trim(email)) = 'btoyirova1982@gmail.com';

-- 2. Create the secure server-side RPC function that allows verified Teacher Bahora
-- to sync her trusted teacher role upon authentication.
-- Hardened: Checks both auth.uid() and email match to prevent any privilege escalation.
CREATE OR REPLACE FUNCTION public.sync_verified_teacher_profile()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.profiles
  SET
    role = 'teacher',
    is_approved = true,
    name = 'Teacher Bahora',
    updated_at = timezone('utc'::text, now())
  WHERE id = auth.uid()
    AND lower(trim(email)) = 'btoyirova1982@gmail.com';
END;
$$;

REVOKE ALL ON FUNCTION public.sync_verified_teacher_profile() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.sync_verified_teacher_profile() TO authenticated;

-- 3. Update the handle_new_user trigger so any future signin / registration
-- for Teacher Bahora automatically provisions trusted teacher privileges.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  declared_group text;
  declared_age int;
BEGIN
  declared_group := lower(trim(coalesce(new.raw_user_meta_data->>'age_group', 'adult')));
  declared_age := nullif((new.raw_user_meta_data->>'age')::text, '')::integer;

  -- Phase 1 Safeguard: Only adult test accounts are supported.
  IF declared_group = 'child' OR (declared_age is not null AND declared_age < 18) THEN
    RAISE EXCEPTION 'Registration for minors (<18) is currently disabled pending safeguarding review. Only adult learners (18+) may register during Phase 1 testing.';
  END IF;

  -- Designated verified teacher account for Teacher Bahora
  IF lower(trim(new.email)) = 'btoyirova1982@gmail.com' THEN
    INSERT INTO public.profiles (
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
    ) VALUES (
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
    ON CONFLICT (id) DO UPDATE SET
      role = 'teacher',
      is_approved = true,
      name = 'Teacher Bahora',
      updated_at = timezone('utc'::text, now());
    RETURN new;
  END IF;

  -- Standard student registration (starts unapproved with role 'student')
  INSERT INTO public.profiles (
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
  ) VALUES (
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
  RETURN new;
END;
$$;
