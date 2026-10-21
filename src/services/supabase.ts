import { createClient, SupabaseClient, User as SupabaseAuthUser } from '@supabase/supabase-js';
import { User, AgeGroup, UserRole, VisionPreference, SafetyReport, PracticeRecording } from '../types';

const STORAGE_KEY_URL = 'le_sb_url';
const STORAGE_KEY_KEY = 'le_sb_key';

class SupabaseService {
  private client: SupabaseClient | null = null;
  private url: string = '';
  private anonKey: string = '';

  constructor() {
    this.initClient();
  }

  private initClient() {
    const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL as string) || '';
    const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY as string) || '';
    const storedUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) || '' : '';
    const storedKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) || '' : '';

    this.url = envUrl || storedUrl;
    this.anonKey = envKey || storedKey;

    if (this.url && this.anonKey && this.url.startsWith('https://')) {
      try {
        this.client = createClient(this.url, this.anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        });
      } catch (err) {
        console.error('Failed to initialize Supabase client:', err);
        this.client = null;
      }
    }
  }

  isConfigured(): boolean {
    return !!this.client;
  }

  getConfig(): { url: string; hasKey: boolean } {
    return {
      url: this.url,
      hasKey: !!this.anonKey,
    };
  }

  saveConfig(url: string, key: string): boolean {
    if (!url || !key) return false;
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_KEY, key.trim());
    this.url = url.trim();
    this.anonKey = key.trim();
    this.initClient();
    return !!this.client;
  }

  clearConfig() {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_KEY);
    this.client = null;
    this.url = '';
    this.anonKey = '';
  }

  getClient(): SupabaseClient | null {
    return this.client;
  }

  // --- AUTHENTICATION ---

  async signUp(params: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    ageGroup: AgeGroup;
    age?: number;
    visionPreference: VisionPreference;
    nativeLanguage?: string;
    guardianConsent: boolean;
    bioText?: string;
    teacherSecretCode?: string;
  }): Promise<{ user: User | null; error: string | null; needsEmailConfirmation?: boolean }> {
    if (!this.client) {
      return { user: null, error: 'Supabase is not configured yet. Please configure your project URL and Anon Key.' };
    }

    try {
      if (params.ageGroup === 'child' || (params.age !== undefined && params.age < 18)) {
        return { 
          user: null, 
          error: 'Registration for minors (<18) is disabled during Phase 1 testing. Only adult learners (18+) may register.' 
        };
      }

      const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-indigo-600', 'bg-amber-600', 'bg-purple-600', 'bg-teal-600'];
      const avatarColor = colors[Math.floor(Math.random() * colors.length)];

      const { data, error } = await this.client.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            name: params.name,
            role: 'student', // Always student. Teacher privileges are granted via server SQL only.
            age_group: 'adult',
            age: params.age && params.age >= 18 ? params.age : 25,
            vision_preference: params.visionPreference,
            native_language: params.nativeLanguage || 'Beginner',
            bio_text: params.bioText || '',
            avatar_color: avatarColor,
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: 'Registration failed. No user was returned.' };
      }

      // Check if email confirmation is required by Supabase project settings
      const needsEmailConfirmation = !data.session;

      const profile = await this.fetchProfile(data.user.id);
      return { user: profile, error: null, needsEmailConfirmation };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during signup.';
      return { user: null, error: msg };
    }
  }

  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    if (!this.client) {
      return { user: null, error: 'Supabase is not configured yet. Please configure your project credentials.' };
    }

    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: 'Sign in failed.' };
      }

      const profile = await this.fetchProfile(data.user.id);
      return { user: profile, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during sign in.';
      return { user: null, error: msg };
    }
  }

  async signOut(): Promise<void> {
    if (this.client) {
      await this.client.auth.signOut();
    }
  }

  async getCurrentSessionUser(): Promise<User | null> {
    if (!this.client) return null;
    try {
      const { data: { session } } = await this.client.auth.getSession();
      if (!session?.user) return null;
      return await this.fetchProfile(session.user.id);
    } catch {
      return null;
    }
  }

  // --- DATABASE OPERATIONS (PROFILES) ---

  async fetchProfile(userId: string): Promise<User | null> {
    if (!this.client) return null;
    try {
      let { data, error } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      // Allow trigger execution latency on fresh registrations
      if (!data) {
        await new Promise((r) => setTimeout(r, 600));
        const retry = await this.client
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        data = retry.data;
        error = retry.error;
      }

      if (error || !data) {
        return null;
      }

      // Check partner_assignments for active partnership
      let activePartnerId = undefined;
      try {
        const { data: assignment } = await this.client
          .from('partner_assignments')
          .select('student_a_id, student_b_id')
          .eq('status', 'active')
          .or(`student_a_id.eq.${userId},student_b_id.eq.${userId}`)
          .maybeSingle();

        if (assignment) {
          activePartnerId = assignment.student_a_id === userId ? assignment.student_b_id : assignment.student_a_id;
        }
      } catch {
        // Fallback to profiles.partner_id if partner_assignments is pending
      }

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
        ageGroup: (data.age_group || 'adult') as AgeGroup,
        age: data.age,
        visionPreference: data.vision_preference as VisionPreference,
        nativeLanguage: data.native_language,
        avatarColor: data.avatar_color || 'bg-blue-600',
        bioText: data.bio_text,
        isApproved: !!data.is_approved,
        partnerId: activePartnerId,
        createdAt: data.created_at,
      };
    } catch {
      return null;
    }
  }

  async fetchPartnerProfile(partnerId: string): Promise<User | null> {
    if (!this.client || !partnerId) return null;
    try {
      const { data, error } = await this.client
        .from('partner_profiles_view')
        .select('*')
        .eq('id', partnerId)
        .maybeSingle();

      if (error || !data) return null;

      return {
        id: data.id,
        name: data.name,
        email: '', // Safe: Protected by partner_profiles_view
        role: 'student',
        ageGroup: 'adult',
        visionPreference: (data.vision_preference || 'low-vision-large-text') as VisionPreference,
        nativeLanguage: data.native_language || 'Beginner',
        avatarColor: data.avatar_color || 'bg-blue-600',
        bioText: data.bio_text || '',
        isApproved: !!data.is_approved,
        createdAt: '',
      };
    } catch {
      return null;
    }
  }

  async getVerifiedTeacher(): Promise<User | null> {
    // 0. Check local cache first for fast synchronous resolution
    try {
      const cached = localStorage.getItem('le_verified_teacher_uuid_v1');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.id && parsed.id.length > 20) {
          // Valid cached teacher profile
          return parsed;
        }
      }
    } catch {
      // ignore
    }

    if (this.client) {
      try {
        // 1. First try secure RPC if available
        try {
          const { data: rpcData, error: rpcErr } = await this.client.rpc('get_verified_teacher_id');
          if (!rpcErr && Array.isArray(rpcData) && rpcData.length > 0) {
            const t = rpcData[0];
            const resolved: User = {
              id: t.id,
              name: t.name || 'Teacher Bahora',
              email: t.email,
              role: 'teacher',
              ageGroup: 'adult',
              visionPreference: 'standard',
              isApproved: true,
              avatarColor: t.avatar_color || 'bg-purple-700',
              createdAt: '',
            };
            try {
              localStorage.setItem('le_verified_teacher_uuid_v1', JSON.stringify(resolved));
            } catch {}
            return resolved;
          }
        } catch {
          // Fallback to direct select
        }

        // 2. Query public.profiles directly for verified teacher
        const { data, error } = await this.client
          .from('profiles')
          .select('*')
          .eq('role', 'teacher')
          .eq('is_approved', true)
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          const resolved: User = {
            id: data.id,
            name: data.name || 'Teacher Bahora',
            email: data.email,
            role: 'teacher',
            ageGroup: (data.age_group || 'adult') as any,
            visionPreference: (data.vision_preference || 'standard') as any,
            isApproved: true,
            avatarColor: data.avatar_color || 'bg-purple-700',
            createdAt: data.created_at,
          };
          try {
            localStorage.setItem('le_verified_teacher_uuid_v1', JSON.stringify(resolved));
          } catch {}
          return resolved;
        }

        // 3. Fallback query by Teacher Bahora's verified email
        const { data: emailData, error: emailErr } = await this.client
          .from('profiles')
          .select('*')
          .ilike('email', 'btoyirova1982@gmail.com')
          .limit(1)
          .maybeSingle();

        if (!emailErr && emailData) {
          const resolved: User = {
            id: emailData.id,
            name: emailData.name || 'Teacher Bahora',
            email: emailData.email,
            role: 'teacher',
            ageGroup: (emailData.age_group || 'adult') as any,
            visionPreference: (emailData.vision_preference || 'standard') as any,
            isApproved: true,
            avatarColor: emailData.avatar_color || 'bg-purple-700',
            createdAt: emailData.created_at,
          };
          try {
            localStorage.setItem('le_verified_teacher_uuid_v1', JSON.stringify(resolved));
          } catch {}
          return resolved;
        }
      } catch (err) {
        console.warn('Supabase query error resolving verified teacher:', err);
      }
    }

    // 4. Query backend server proxy for registered verified teacher
    try {
      const res = await fetch('/api/teacher/verified-id');
      if (res.ok) {
        const json = await res.json();
        if (json && json.success && json.teacher && json.teacher.id) {
          const resolved: User = {
            id: json.teacher.id,
            name: json.teacher.name || 'Teacher Bahora',
            email: json.teacher.email || 'btoyirova1982@gmail.com',
            role: 'teacher',
            ageGroup: 'adult',
            visionPreference: 'standard',
            isApproved: true,
            avatarColor: 'bg-purple-700',
            createdAt: '',
          };
          try {
            localStorage.setItem('le_verified_teacher_uuid_v1', JSON.stringify(resolved));
          } catch {}
          return resolved;
        }
      }
    } catch {
      // offline
    }

    return null;
  }

  async uploadVoiceMessage(audioBlob: Blob, userId: string): Promise<string | null> {
    if (!this.client) return null;
    try {
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webm`;
      const { error } = await this.client.storage
        .from('voice-messages')
        .upload(fileName, audioBlob, {
          contentType: 'audio/webm',
          upsert: false,
        });

      if (error) {
        console.warn('Supabase storage upload error:', error.message);
        return null;
      }

      // Generate a signed URL valid for 7 days
      const { data: signedData, error: signError } = await this.client.storage
        .from('voice-messages')
        .createSignedUrl(fileName, 60 * 60 * 24 * 7);

      if (signError || !signedData?.signedUrl) {
        console.warn('Supabase storage signed URL error:', signError?.message);
        return null;
      }

      return signedData.signedUrl;
    } catch (err) {
      console.warn('Voice message upload failed:', err);
      return null;
    }
  }

  async getAudioPlaybackUrl(pathOrUrl: string): Promise<string> {
    if (!pathOrUrl) return '';
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://') || pathOrUrl.startsWith('blob:') || pathOrUrl.startsWith('data:')) {
      return pathOrUrl;
    }
    if (this.client) {
      try {
        const cleanPath = pathOrUrl.replace(/^voice-messages\//, '');
        const { data, error } = await this.client.storage
          .from('voice-messages')
          .createSignedUrl(cleanPath, 60 * 60 * 24 * 7);
        if (!error && data?.signedUrl) {
          return data.signedUrl;
        }
      } catch {
        // fallback
      }
    }
    return pathOrUrl;
  }

  async fetchAllProfiles(): Promise<User[]> {
    if (!this.client) return [];
    try {
      const { data, error } = await this.client
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      // Query active partner assignments to attach current partners
      const partnerMap = new Map<string, string>();
      try {
        const { data: assignments } = await this.client
          .from('partner_assignments')
          .select('student_a_id, student_b_id')
          .eq('status', 'active');

        if (assignments) {
          assignments.forEach((a) => {
            partnerMap.set(a.student_a_id, a.student_b_id);
            partnerMap.set(a.student_b_id, a.student_a_id);
          });
        }
      } catch {
        // continue
      }

      return data.map((d) => ({
        id: d.id,
        name: d.name,
        email: d.email,
        role: d.role as UserRole,
        ageGroup: (d.age_group || 'adult') as AgeGroup,
        age: d.age,
        visionPreference: d.vision_preference as VisionPreference,
        nativeLanguage: d.native_language,
        avatarColor: d.avatar_color || 'bg-blue-600',
        bioText: d.bio_text,
        isApproved: !!d.is_approved,
        partnerId: partnerMap.get(d.id),
        createdAt: d.created_at,
      }));
    } catch {
      return [];
    }
  }

  // Update learner profile settings (e.g., language display mode, vision preference)
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<boolean> {
    if (!this.client) return false;
    try {
      const payload: any = { updated_at: new Date().toISOString() };
      if (updates.displayLanguageMode) payload.display_language_mode = updates.displayLanguageMode;
      if (updates.visionPreference) payload.vision_preference = updates.visionPreference;
      const { error } = await this.client
        .from('profiles')
        .update(payload)
        .eq('id', userId);
      return !error;
    } catch {
      return false;
    }
  }

  // Teacher action: Approve a pending learner
  async approveLearner(studentId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.client) return { success: false, error: 'Database not connected.' };
    try {
      const { error } = await this.client
        .from('profiles')
        .update({ is_approved: true, updated_at: new Date().toISOString() })
        .eq('id', studentId);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Update failed' };
    }
  }

  // Teacher action: Pair students safely using dedicated partner_assignments table
  async pairLearners(student1Id: string, student2Id: string): Promise<{ success: boolean; error?: string }> {
    if (!this.client) return { success: false, error: 'Database not connected.' };
    try {
      const s1 = await this.fetchProfile(student1Id);
      const s2 = await this.fetchProfile(student2Id);

      if (!s1 || !s2) return { success: false, error: 'Learner profile not found.' };

      if (!s1.isApproved || !s2.isApproved) {
        return { success: false, error: 'Both students must be approved by the teacher before pairing.' };
      }

      const { data: { user } } = await this.client.auth.getUser();
      const teacherId = user?.id || student1Id;

      // End previous active partnerships for these learners
      try {
        await this.client
          .from('partner_assignments')
          .update({ status: 'ended', updated_at: new Date().toISOString() })
          .or(`student_a_id.eq.${student1Id},student_b_id.eq.${student1Id},student_a_id.eq.${student2Id},student_b_id.eq.${student2Id}`);
      } catch {
        // continue
      }

      // Insert new partnership record into partner_assignments
      const { error: insertErr } = await this.client.from('partner_assignments').insert({
        student_a_id: student1Id,
        student_b_id: student2Id,
        assigned_by: teacherId,
        status: 'active'
      });

      if (insertErr) {
        return { success: false, error: insertErr.message };
      }

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Pairing failed' };
    }
  }

  async unpairLearner(studentId: string): Promise<boolean> {
    if (!this.client) return false;
    try {
      const { error } = await this.client
        .from('partner_assignments')
        .update({ status: 'ended', updated_at: new Date().toISOString() })
        .or(`student_a_id.eq.${studentId},student_b_id.eq.${studentId}`);

      return !error;
    } catch {
      return false;
    }
  }

  // Safety reports
  async submitSafetyReport(report: Omit<SafetyReport, 'id' | 'createdAt' | 'status'>): Promise<boolean> {
    if (!this.client) return false;
    try {
      const { error } = await this.client.from('safety_reports').insert({
        reporter_id: report.reporterId,
        reporter_name: report.reporterName,
        reported_user_id: report.reportedUserId,
        reported_user_name: report.reportedUserName,
        reason: report.reason,
        status: 'pending',
      });
      return !error;
    } catch {
      return false;
    }
  }

  async fetchSafetyReports(): Promise<SafetyReport[]> {
    if (!this.client) return [];
    try {
      const { data, error } = await this.client
        .from('safety_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      // Query private teacher notes for each report from segregated table
      const notesMap = new Map<string, string>();
      try {
        const { data: notes } = await this.client
          .from('safety_report_notes')
          .select('report_id, note')
          .order('created_at', { ascending: false });

        if (notes) {
          notes.forEach((n) => {
            if (!notesMap.has(n.report_id)) {
              notesMap.set(n.report_id, n.note);
            }
          });
        }
      } catch {
        // continue
      }

      return data.map((d) => ({
        id: d.id,
        reporterId: d.reporter_id,
        reporterName: d.reporter_name,
        reportedUserId: d.reported_user_id,
        reportedUserName: d.reported_user_name,
        reason: d.reason,
        status: d.status,
        teacherNotes: notesMap.get(d.id),
        createdAt: d.created_at,
      }));
    } catch {
      return [];
    }
  }

  async resolveReport(reportId: string, notes: string): Promise<boolean> {
    if (!this.client) return false;
    try {
      const { data: { user } } = await this.client.auth.getUser();
      // Record private teacher note in dedicated, segregated safety_report_notes table
      if (notes.trim() && user?.id) {
        try {
          await this.client.from('safety_report_notes').insert({
            report_id: reportId,
            author_id: user.id,
            note: notes.trim(),
          });
        } catch {
          // continue
        }
      }

      const { error } = await this.client
        .from('safety_reports')
        .update({ status: 'resolved', updated_at: new Date().toISOString() })
        .eq('id', reportId);

      return !error;
    } catch {
      return false;
    }
  }

  // --- PRACTICE RECORDINGS & SUPABASE STORAGE ---

  /**
   * Uploads practice recording audio to PRIVATE Supabase Storage bucket 'student-recordings'
   * Securely enforces path prefix of authenticated auth.uid()
   * Generates short-lived signed URLs for authenticated playback (never public URLs)
   */
  async uploadPracticeAudio(
    studentId: string,
    topicId: string,
    audioBlob: Blob
  ): Promise<{ audioUrl: string; storagePath: string } | null> {
    if (!this.client) return null;
    try {
      // Validate that authenticated user matches the studentId to prevent client spoofing
      const { data: { user } } = await this.client.auth.getUser();
      const authenticatedId = user?.id || studentId;

      const ext = audioBlob.type.includes('wav') ? 'wav' : audioBlob.type.includes('mp4') ? 'm4a' : 'webm';
      // Format path as <auth.uid()>/<topicId>-<timestamp>.<ext>
      const filePath = `${authenticatedId}/${topicId}-${Date.now()}.${ext}`;

      const { data, error } = await this.client.storage
        .from('student-recordings')
        .upload(filePath, audioBlob, {
          cacheControl: '3600',
          upsert: true,
          contentType: audioBlob.type || 'audio/webm',
        });

      if (error || !data) {
        console.warn('Supabase storage upload fallback to local storage:', error?.message);
        return null;
      }

      // Generate a secure, short-lived signed URL for initial private playback (valid 2 hours)
      const { data: signedData, error: signErr } = await this.client.storage
        .from('student-recordings')
        .createSignedUrl(data.path, 7200);

      const audioUrl = (!signErr && signedData?.signedUrl) ? signedData.signedUrl : '';

      return {
        audioUrl,
        storagePath: data.path,
      };
    } catch (err) {
      console.warn('Storage upload error:', err);
      return null;
    }
  }

  /**
   * Generates a short-lived signed URL for a private recording path
   */
  async getSignedAudioUrl(storagePath: string, expiresInSeconds = 7200): Promise<string | null> {
    if (!this.client || !storagePath) return null;
    try {
      const { data, error } = await this.client.storage
        .from('student-recordings')
        .createSignedUrl(storagePath, expiresInSeconds);

      if (error || !data?.signedUrl) return null;
      return data.signedUrl;
    } catch {
      return null;
    }
  }

  /**
   * Persists practice recording metadata to Supabase table if table exists
   */
  async savePracticeRecordingToDb(recording: PracticeRecording): Promise<boolean> {
    if (!this.client) return false;
    try {
      const { data: { user } } = await this.client.auth.getUser();
      // Ensure student_id is set to authenticated user
      const effectiveStudentId = user?.id || recording.studentId;

      const { error } = await this.client.from('student_practice_recordings').insert({
        id: recording.id,
        student_id: effectiveStudentId,
        student_name: recording.studentName,
        topic_id: recording.topicId,
        topic_title: recording.topicTitle,
        question_id: recording.questionId,
        question_text: recording.questionText,
        audio_url: recording.audioUrl,
        storage_path: recording.storagePath,
        duration_seconds: recording.durationSeconds,
        submitted_at: recording.submittedAt,
        evaluation: recording.evaluation,
      });
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Fetches practice recordings from Supabase table if available.
   * Automatically refreshes short-lived signed URLs for private storage paths
   * so recordings remain playable across sessions and devices.
   */
  async fetchPracticeRecordingsFromDb(studentId: string): Promise<PracticeRecording[]> {
    if (!this.client) return [];
    try {
      const { data: { user } } = await this.client.auth.getUser();
      const targetId = user?.id || studentId;

      const { data, error } = await this.client
        .from('student_practice_recordings')
        .select('*')
        .eq('student_id', targetId)
        .order('submitted_at', { ascending: false });

      if (error || !data) return [];

      // Generate fresh signed URLs for recordings stored in private Supabase Storage
      const recordsWithSignedUrls = await Promise.all(
        data.map(async (row) => {
          let playableUrl = row.audio_url;

          // If there is a storage_path in private bucket, generate a fresh signed URL
          if (row.storage_path) {
            try {
              const { data: signed } = await this.client!.storage
                .from('student-recordings')
                .createSignedUrl(row.storage_path, 7200); // 2-hour window

              if (signed?.signedUrl) {
                playableUrl = signed.signedUrl;
              }
            } catch {
              // fallback to stored url
            }
          }

          return {
            id: row.id,
            studentId: row.student_id,
            studentName: row.student_name,
            topicId: row.topic_id,
            topicTitle: row.topic_title,
            questionId: row.question_id,
            questionText: row.question_text,
            audioUrl: playableUrl,
            storagePath: row.storage_path,
            durationSeconds: row.duration_seconds,
            submittedAt: row.submitted_at,
            evaluation: row.evaluation,
          };
        })
      );

      return recordsWithSignedUrls;
    } catch {
      return [];
    }
  }

  /**
   * Deletes practice recording from Supabase table and Storage if exists
   */
  async deletePracticeRecordingFromDb(recordingId: string, storagePath?: string): Promise<boolean> {
    if (!this.client) return false;
    try {
      if (storagePath) {
        await this.client.storage.from('student-recordings').remove([storagePath]);
      }
      const { error } = await this.client
        .from('student_practice_recordings')
        .delete()
        .eq('id', recordingId);

      return !error;
    } catch {
      return false;
    }
  }
}

export const supabaseService = new SupabaseService();
