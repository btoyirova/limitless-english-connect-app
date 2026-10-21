import { 
  DirectMessage, 
  StudentPresenceProfile, 
  CommunityGroupChat, 
  CommunityGroupMessage, 
  BlockedUserRecord, 
  UserAvailabilityStatus 
} from '../types/messaging';
import { User } from '../types';
import { supabaseService } from './supabase';
import { storage } from './storage';
import { soundEffects } from './soundEffects';
import { speechService } from './speechService';

// Default Educational Group Chats
export const DEFAULT_COMMUNITY_GROUPS: CommunityGroupChat[] = [
  {
    id: 'grp-beginner-practice',
    name: 'Beginner English Practice',
    description: 'A friendly, supportive space to ask beginner questions and share daily progress.',
    category: 'beginner',
    createdById: 'teacher-bahora',
    createdByName: 'Teacher Bahora',
    memberIds: ['teacher-bahora', 'student-amina', 'student-carlos', 'student-david', 'student-elena'],
    isArchived: false,
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 'grp-greetings-intros',
    name: 'Greetings and Introductions',
    description: 'Practice saying hello, introducing yourself, and meeting international classmates.',
    category: 'topic',
    topicId: 'greetings',
    createdById: 'teacher-bahora',
    createdByName: 'Teacher Bahora',
    memberIds: ['teacher-bahora', 'student-amina', 'student-carlos'],
    isArchived: false,
    createdAt: '2026-02-05T00:00:00.000Z',
    updatedAt: '2026-02-05T00:00:00.000Z',
  },
  {
    id: 'grp-food-daily-life',
    name: 'Food and Daily Life',
    description: 'Share your favorite meals, recipes, drinks, and daily routines in English.',
    category: 'topic',
    topicId: 'favorite-food-drinks',
    createdById: 'teacher-bahora',
    createdByName: 'Teacher Bahora',
    memberIds: ['teacher-bahora', 'student-david', 'student-elena'],
    isArchived: false,
    createdAt: '2026-02-10T00:00:00.000Z',
    updatedAt: '2026-02-10T00:00:00.000Z',
  },
  {
    id: 'grp-hobbies-free-time',
    name: 'Hobbies and Free Time',
    description: 'Talk about music, sports, outdoor walks, audiobooks, and weekend activities.',
    category: 'topic',
    topicId: 'hobbies-free-time',
    createdById: 'teacher-bahora',
    createdByName: 'Teacher Bahora',
    memberIds: ['teacher-bahora', 'student-carlos', 'student-david'],
    isArchived: false,
    createdAt: '2026-02-15T00:00:00.000Z',
    updatedAt: '2026-02-15T00:00:00.000Z',
  },
  {
    id: 'grp-speaking-practice',
    name: 'Speaking Practice',
    description: 'Send short audio clips, practice pronunciation, and exchange gentle corrections.',
    category: 'speaking',
    createdById: 'teacher-bahora',
    createdByName: 'Teacher Bahora',
    memberIds: ['teacher-bahora', 'student-amina', 'student-carlos', 'student-david', 'student-elena'],
    isArchived: false,
    createdAt: '2026-02-20T00:00:00.000Z',
    updatedAt: '2026-02-20T00:00:00.000Z',
  },
];

class MessagingService {
  private directMessagesKey = 'le_direct_messages_v1';
  private presenceKey = 'le_community_presence_v1';
  private groupsKey = 'le_community_groups_v1';
  private groupMessagesKey = 'le_group_messages_v1';
  private blocksKey = 'le_blocked_users_v1';

  constructor() {
    this.initDefaults();
  }

  private initDefaults() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(this.groupsKey)) {
      localStorage.setItem(this.groupsKey, JSON.stringify(DEFAULT_COMMUNITY_GROUPS));
    }

    if (!localStorage.getItem(this.groupMessagesKey)) {
      const seedGroupMsgs: CommunityGroupMessage[] = [
        {
          id: 'gmsg-1',
          groupId: 'grp-beginner-practice',
          senderId: 'teacher-bahora',
          senderName: 'Teacher Bahora',
          senderRole: 'teacher',
          senderAvatarColor: 'bg-purple-700',
          text: 'Welcome to our beginner English learning group! You can write text questions or send voice practice notes here. I am here to help you!',
          isAnnouncement: true,
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
        {
          id: 'gmsg-2',
          groupId: 'grp-beginner-practice',
          senderId: 'student-carlos',
          senderName: 'Carlos',
          senderRole: 'student',
          senderAvatarColor: 'bg-amber-600',
          text: 'Hello Teacher Bahora! Hello everyone! I am happy to practice English with all of you.',
          createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        },
        {
          id: 'gmsg-3',
          groupId: 'grp-speaking-practice',
          senderId: 'teacher-bahora',
          senderName: 'Teacher Bahora',
          senderRole: 'teacher',
          senderAvatarColor: 'bg-purple-700',
          text: 'Today\'s Speaking Challenge: Describe what you had for breakfast in one clear English sentence!',
          isAnnouncement: true,
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        }
      ];
      localStorage.setItem(this.groupMessagesKey, JSON.stringify(seedGroupMsgs));
    }

    if (!localStorage.getItem(this.directMessagesKey)) {
      const seedDirect: DirectMessage[] = [
        {
          id: 'dm-1',
          senderId: 'student-carlos',
          senderName: 'Carlos',
          senderRole: 'student',
          receiverId: 'teacher-bahora',
          receiverName: 'Teacher Bahora',
          text: 'Hello Teacher Bahora! I completed Lesson 1 fruit vocabulary. Could you check my speaking recording when you have a moment?',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        },
        {
          id: 'dm-2',
          senderId: 'teacher-bahora',
          senderName: 'Teacher Bahora',
          senderRole: 'teacher',
          receiverId: 'student-carlos',
          receiverName: 'Carlos',
          text: 'Great work Carlos! Your pronunciation of "apples" and "oranges" was very clear. Keep it up!',
          isRead: true,
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: 'dm-3',
          senderId: 'student-amina',
          senderName: 'Amina',
          senderRole: 'student',
          receiverId: 'teacher-bahora',
          receiverName: 'Teacher Bahora',
          text: 'Teacher Bahora, is the Topic 2 mastery test ready for me to try today?',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        }
      ];
      localStorage.setItem(this.directMessagesKey, JSON.stringify(seedDirect));
    }
  }

  // ==============================================================================
  // 1. TEACHER <-> STUDENT & PRIVATE STUDENT-TO-STUDENT MESSAGING
  // ==============================================================================

  getDirectMessages(user1Id: string, user2Id: string): DirectMessage[] {
    try {
      const raw = localStorage.getItem(this.directMessagesKey);
      const all: DirectMessage[] = raw ? JSON.parse(raw) : [];
      return all.filter((m) => {
        // Direct matching by ID
        if ((m.senderId === user1Id && m.receiverId === user2Id) ||
            (m.senderId === user2Id && m.receiverId === user1Id)) {
          return true;
        }

        // Flexible teacher alias matching for Teacher Bahora
        const isTeacher1 = user1Id === 'teacher-bahora' || user1Id.toLowerCase().includes('bahora');
        const isTeacher2 = user2Id === 'teacher-bahora' || user2Id.toLowerCase().includes('bahora');

        if (isTeacher1) {
          if (m.senderId === user2Id && (m.senderRole === 'student' || m.receiverName?.toLowerCase().includes('bahora') || m.receiverId === 'teacher-bahora')) return true;
          if (m.receiverId === user2Id && (m.senderRole === 'teacher' || m.senderName?.toLowerCase().includes('bahora') || m.senderId === 'teacher-bahora')) return true;
        }

        if (isTeacher2) {
          if (m.senderId === user1Id && (m.senderRole === 'student' || m.receiverName?.toLowerCase().includes('bahora') || m.receiverId === 'teacher-bahora')) return true;
          if (m.receiverId === user1Id && (m.senderRole === 'teacher' || m.senderName?.toLowerCase().includes('bahora') || m.senderId === 'teacher-bahora')) return true;
        }

        return false;
      }).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } catch {
      return [];
    }
  }

  getAllDirectMessages(): DirectMessage[] {
    try {
      const raw = localStorage.getItem(this.directMessagesKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private mapRow(d: any): DirectMessage {
    return {
      id: String(d.id),
      senderId: d.sender_id,
      senderName: d.sender_name,
      senderRole: d.sender_role,
      receiverId: d.receiver_id,
      receiverName: d.receiver_name,
      text: d.text_content || undefined,
      audioUrl: d.audio_url || undefined,
      durationSeconds: d.duration_seconds || undefined,
      isRead: !!d.is_read,
      createdAt: d.created_at,
    };
  }

  private isUuid(str?: string): boolean {
    if (!str) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());
  }

  async fetchDirectMessages(user1Id: string, user2Id: string): Promise<DirectMessage[]> {
    let resolvedUser1 = user1Id;
    let resolvedUser2 = user2Id;

    if (!this.isUuid(resolvedUser1)) {
      const t = await supabaseService.getVerifiedTeacher();
      if (t?.id && this.isUuid(t.id)) resolvedUser1 = t.id;
    }
    if (!this.isUuid(resolvedUser2)) {
      const t = await supabaseService.getVerifiedTeacher();
      if (t?.id && this.isUuid(t.id)) resolvedUser2 = t.id;
    }

    // 1. Authoritative: Fetch from Supabase PostgreSQL teacher_student_messages
    if (supabaseService.isConfigured() && this.isUuid(resolvedUser1) && this.isUuid(resolvedUser2)) {
      try {
        const client = supabaseService.getClient();
        if (client) {
          const { data, error } = await client
            .from('teacher_student_messages')
            .select('*')
            .or(`and(sender_id.eq.${resolvedUser1},receiver_id.eq.${resolvedUser2}),and(sender_id.eq.${resolvedUser2},receiver_id.eq.${resolvedUser1})`)
            .order('created_at', { ascending: true });

          if (!error && Array.isArray(data)) {
            const mapped: DirectMessage[] = data.map((d: any) => this.mapRow(d));
            // Keep local cache as offline mirror
            localStorage.setItem(this.directMessagesKey, JSON.stringify(mapped));
            return mapped;
          } else if (error) {
            console.warn('Supabase fetchDirectMessages query warning:', error.message);
          }
        }
      } catch (err) {
        console.warn('Could not fetch direct messages from Supabase:', err);
      }
    }

    // 2. Query backend server proxy for multi-tab fallback
    try {
      const res = await fetch(`/api/messages/history?user1=${encodeURIComponent(resolvedUser1)}&user2=${encodeURIComponent(resolvedUser2)}`);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.messages) && json.messages.length > 0) {
          return json.messages;
        }
      }
    } catch {
      // offline fallback
    }

    return this.getDirectMessages(resolvedUser1, resolvedUser2);
  }

  async sendDirectMessage(msg: {
    senderId: string;
    senderName: string;
    senderRole: 'student' | 'teacher';
    receiverId: string;
    receiverName: string;
    text?: string;
    audioUrl?: string;
    durationSeconds?: number;
  }): Promise<DirectMessage> {
    const isBlocked = this.isUserBlocked(msg.receiverId, msg.senderId);
    if (isBlocked) {
      throw new Error('Message cannot be delivered: recipient has blocked communications.');
    }

    if (!msg.text?.trim() && !msg.audioUrl) {
      throw new Error('Message must contain either text content or an audio voice message.');
    }

    // Resolve real UUIDs for both sender and receiver
    let finalSenderId = msg.senderId;
    let finalReceiverId = msg.receiverId;
    let finalReceiverName = msg.receiverName;

    if (!this.isUuid(finalReceiverId)) {
      const verifiedTeacher = await supabaseService.getVerifiedTeacher();
      if (verifiedTeacher?.id && this.isUuid(verifiedTeacher.id)) {
        finalReceiverId = verifiedTeacher.id;
        finalReceiverName = verifiedTeacher.name || msg.receiverName;
      }
    }

    if (!this.isUuid(finalSenderId) && msg.senderRole === 'teacher') {
      const verifiedTeacher = await supabaseService.getVerifiedTeacher();
      if (verifiedTeacher?.id && this.isUuid(verifiedTeacher.id)) {
        finalSenderId = verifiedTeacher.id;
      }
    }

    let createdMessage: DirectMessage | null = null;

    // 1. Authoritative: Insert directly into Supabase PostgreSQL
    if (supabaseService.isConfigured()) {
      if (!this.isUuid(finalSenderId) || !this.isUuid(finalReceiverId)) {
        console.warn('Cannot insert into Supabase: sender or receiver ID is not a valid UUID.', { finalSenderId, finalReceiverId });
        throw new Error('Cannot deliver message: Teacher Bahora\'s verified Supabase account ID is resolving. Please ensure supabase_messaging_migration.sql has been executed in your Supabase SQL Editor.');
      }

      const client = supabaseService.getClient();
      if (client) {
        const { data, error } = await client
          .from('teacher_student_messages')
          .insert({
            sender_id: finalSenderId,
            sender_name: msg.senderName,
            sender_role: msg.senderRole,
            receiver_id: finalReceiverId,
            receiver_name: finalReceiverName,
            text_content: msg.text?.trim() || null,
            audio_url: msg.audioUrl || null,
            duration_seconds: msg.durationSeconds || null,
            is_read: false,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          console.error('Supabase message insert error:', error);
          throw new Error(`Failed to deliver message to Supabase database: ${error.message}. Please verify that supabase_messaging_migration.sql has been executed in your Supabase SQL Editor.`);
        }

        if (data) {
          createdMessage = this.mapRow(data);
        }
      }
    }

    // 2. Fallback offline construction if Supabase is unconfigured
    if (!createdMessage) {
      createdMessage = {
        id: `dm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        senderId: finalSenderId,
        senderName: msg.senderName,
        senderRole: msg.senderRole,
        receiverId: finalReceiverId,
        receiverName: finalReceiverName,
        text: msg.text?.trim() || undefined,
        audioUrl: msg.audioUrl,
        durationSeconds: msg.durationSeconds,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
    }

    // Save to local cache mirror
    const all = this.getAllDirectMessages();
    all.push(createdMessage);
    localStorage.setItem(this.directMessagesKey, JSON.stringify(all));

    // Post to backend server proxy for multi-tab notification
    fetch('/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createdMessage),
    }).catch(() => {});

    soundEffects.playSuccess();
    speechService.announce(`Message sent to ${finalReceiverName}.`);
    return createdMessage;
  }

  async markDirectMessagesAsRead(senderId: string, receiverId: string): Promise<void> {
    let sId = senderId;
    let rId = receiverId;

    if (!this.isUuid(sId)) {
      const t = await supabaseService.getVerifiedTeacher();
      if (t?.id && this.isUuid(t.id)) sId = t.id;
    }
    if (!this.isUuid(rId)) {
      const t = await supabaseService.getVerifiedTeacher();
      if (t?.id && this.isUuid(t.id)) rId = t.id;
    }

    const all = this.getAllDirectMessages();
    let updated = false;
    all.forEach((m) => {
      if ((m.senderId === sId || m.senderId === senderId) && (m.receiverId === rId || m.receiverId === receiverId) && !m.isRead) {
        m.isRead = true;
        updated = true;
      }
    });
    if (updated) {
      localStorage.setItem(this.directMessagesKey, JSON.stringify(all));
    }

    // Update in Supabase
    if (supabaseService.isConfigured() && this.isUuid(sId) && this.isUuid(rId)) {
      try {
        const client = supabaseService.getClient();
        if (client) {
          client
            .from('teacher_student_messages')
            .update({ is_read: true })
            .eq('sender_id', sId)
            .eq('receiver_id', rId)
            .then(() => {});
        }
      } catch {
        // ignore
      }
    }

    // Update backend proxy
    fetch('/api/messages/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId: sId, receiverId: rId }),
    }).catch(() => {});
  }

  getUnreadCountForUser(userId: string): number {
    const all = this.getAllDirectMessages();
    return all.filter((m) => m.receiverId === userId && !m.isRead).length;
  }

  getUnreadCountFromSender(senderId: string, receiverId: string): number {
    const all = this.getAllDirectMessages();
    return all.filter((m) => m.senderId === senderId && m.receiverId === receiverId && !m.isRead).length;
  }

  async fetchTeacherConversations(
    teacherId: string,
    students: User[]
  ): Promise<{
    studentId: string;
    studentName: string;
    lastMessage: DirectMessage;
    unreadCount: number;
    totalCount: number;
  }[]> {
    let resolvedTeacherId = teacherId;
    if (!this.isUuid(resolvedTeacherId)) {
      const t = await supabaseService.getVerifiedTeacher();
      if (t?.id && this.isUuid(t.id)) resolvedTeacherId = t.id;
    }

    const map = new Map<string, { studentId: string; studentName: string; lastMessage: DirectMessage; unreadCount: number; totalCount: number }>();

    // 1. Authoritative: Query all teacher messages directly from Supabase
    if (supabaseService.isConfigured() && this.isUuid(resolvedTeacherId)) {
      try {
        const client = supabaseService.getClient();
        if (client) {
          const { data, error } = await client
            .from('teacher_student_messages')
            .select('*')
            .or(`sender_id.eq.${resolvedTeacherId},receiver_id.eq.${resolvedTeacherId}`)
            .order('created_at', { ascending: true });

          if (!error && Array.isArray(data)) {
            data.forEach((row) => {
              const m = this.mapRow(row);
              const isFromTeacher = m.senderId === resolvedTeacherId;
              const studentId = isFromTeacher ? m.receiverId : m.senderId;
              const studentName = isFromTeacher ? m.receiverName : m.senderName;
              const isUnread = m.receiverId === resolvedTeacherId && !m.isRead;

              const existing = map.get(studentId);
              if (!existing) {
                map.set(studentId, {
                  studentId,
                  studentName,
                  lastMessage: m,
                  unreadCount: isUnread ? 1 : 0,
                  totalCount: 1,
                });
              } else {
                existing.totalCount += 1;
                if (isUnread) existing.unreadCount += 1;
                existing.lastMessage = m; // Since ordered ascending, last is latest
              }
            });
          } else if (error) {
            console.warn('Supabase fetchTeacherConversations query error:', error.message);
          }
        }
      } catch (err) {
        console.warn('Error fetching teacher conversations from Supabase:', err);
      }
    }

    // 2. If Supabase is empty or offline, fallback to local storage
    if (map.size === 0) {
      const localConvs = this.getTeacherConversations(resolvedTeacherId);
      localConvs.forEach((c) => map.set(c.studentId, c));
    }

    // 3. Ensure all registered/approved students exist in conversation list so Teacher Bahora can initiate contact
    students
      .filter((s) => s.role === 'student' && s.isApproved)
      .forEach((st) => {
        if (!map.has(st.id)) {
          map.set(st.id, {
            studentId: st.id,
            studentName: st.name,
            lastMessage: {
              id: `seed-${st.id}`,
              senderId: st.id,
              senderName: st.name,
              senderRole: 'student',
              receiverId: resolvedTeacherId,
              receiverName: 'Teacher Bahora',
              text: 'No messages yet. Click to message student.',
              isRead: true,
              createdAt: st.createdAt || new Date().toISOString(),
            },
            unreadCount: 0,
            totalCount: 0,
          });
        }
      });

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );
  }

  // Realtime subscription for conversation between two users
  subscribeToDirectMessages(
    user1Id: string,
    user2Id: string,
    onMessage: (msg: DirectMessage) => void
  ): () => void {
    if (!supabaseService.isConfigured()) return () => {};
    const client = supabaseService.getClient();
    if (!client) return () => {};

    // Resolve UUIDs for subscription matching
    let u1 = user1Id;
    let u2 = user2Id;
    try {
      const cached = localStorage.getItem('le_verified_teacher_uuid_v1');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.id && this.isUuid(parsed.id)) {
          if (!this.isUuid(u1) && (u1 === 'teacher-bahora' || u1.includes('bahora'))) u1 = parsed.id;
          if (!this.isUuid(u2) && (u2 === 'teacher-bahora' || u2.includes('bahora'))) u2 = parsed.id;
        }
      }
    } catch {}

    const channelName = `dm_${[u1, u2].sort().join('_')}_${Date.now()}`;
    const channel = client
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'teacher_student_messages',
        },
        (payload: any) => {
          const row = payload.new;
          const isMatch = (
            (row.sender_id === u1 && row.receiver_id === u2) ||
            (row.sender_id === u2 && row.receiver_id === u1) ||
            (row.sender_id === user1Id && row.receiver_id === user2Id) ||
            (row.sender_id === user2Id && row.receiver_id === user1Id)
          );
          if (isMatch) {
            onMessage(this.mapRow(row));
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }

  // Realtime subscription for Teacher Bahora's inbox
  subscribeToTeacherInbox(
    teacherId: string,
    onNewMessage: (msg: DirectMessage) => void
  ): () => void {
    if (!supabaseService.isConfigured()) return () => {};
    const client = supabaseService.getClient();
    if (!client) return () => {};

    let tId = teacherId;
    try {
      const cached = localStorage.getItem('le_verified_teacher_uuid_v1');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.id && this.isUuid(parsed.id)) {
          tId = parsed.id;
        }
      }
    } catch {}

    const channelName = `inbox_teacher_${tId}_${Date.now()}`;
    const channel = client
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'teacher_student_messages',
        },
        (payload: any) => {
          const row = payload.new;
          if (
            row.receiver_id === tId ||
            row.sender_id === tId ||
            row.receiver_id === teacherId ||
            row.sender_id === teacherId
          ) {
            onNewMessage(this.mapRow(row));
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }

  getTeacherConversations(teacherId: string): {
    studentId: string;
    studentName: string;
    lastMessage: DirectMessage;
    unreadCount: number;
    totalCount: number;
  }[] {
    const all = this.getAllDirectMessages();
    const map = new Map<string, { studentId: string; studentName: string; lastMessage: DirectMessage; unreadCount: number; totalCount: number }>();

    all.forEach((m) => {
      let studentId: string | null = null;
      let studentName = '';
      const isFromTeacher = m.senderId === teacherId || m.senderRole === 'teacher';
      const isToTeacher = m.receiverId === teacherId;

      if (isFromTeacher) {
        studentId = m.receiverId;
        studentName = m.receiverName;
      } else if (isToTeacher) {
        studentId = m.senderId;
        studentName = m.senderName;
      }

      if (studentId) {
        const existing = map.get(studentId);
        const isUnread = isToTeacher && !m.isRead;
        if (!existing) {
          map.set(studentId, {
            studentId,
            studentName,
            lastMessage: m,
            unreadCount: isUnread ? 1 : 0,
            totalCount: 1,
          });
        } else {
          existing.totalCount += 1;
          if (isUnread) existing.unreadCount += 1;
          if (new Date(m.createdAt).getTime() > new Date(existing.lastMessage.createdAt).getTime()) {
            existing.lastMessage = m;
          }
        }
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );
  }

  // ==============================================================================
  // 2. STUDENT COMMUNITY PRESENCE & DISCOVERABILITY
  // ==============================================================================

  getCommunityPresence(): StudentPresenceProfile[] {
    try {
      const raw = localStorage.getItem(this.presenceKey);
      if (raw) return JSON.parse(raw);

      // Seed presence for registered students
      const users = storage.getUsers().filter((u) => u.role === 'student');
      const seedPresence: StudentPresenceProfile[] = users.map((u, idx) => ({
        studentId: u.id,
        studentName: u.name,
        avatarColor: u.avatarColor || 'bg-blue-600',
        ageGroup: u.ageGroup,
        visionPreference: u.visionPreference,
        status: idx === 0 ? 'available' : idx === 1 ? 'available' : 'offline',
        isDiscoverable: true,
        allowIncomingMessages: true,
        lastActiveAt: new Date().toISOString(),
      }));
      localStorage.setItem(this.presenceKey, JSON.stringify(seedPresence));
      return seedPresence;
    } catch {
      return [];
    }
  }

  async fetchCommunityPresence(): Promise<StudentPresenceProfile[]> {
    if (supabaseService.isConfigured()) {
      try {
        const client = supabaseService.getClient();
        if (client) {
          const { data, error } = await client.from('student_presence').select('*');
          if (!error && data && data.length > 0) {
            const mapped: StudentPresenceProfile[] = data.map((d: any) => ({
              studentId: d.student_id,
              studentName: d.student_name,
              avatarColor: d.avatar_color,
              ageGroup: d.age_group,
              visionPreference: d.vision_preference,
              status: d.status,
              isDiscoverable: d.is_discoverable,
              allowIncomingMessages: d.allow_incoming_messages,
              lastActiveAt: d.last_active_at,
            }));
            localStorage.setItem(this.presenceKey, JSON.stringify(mapped));
            return mapped;
          }
        }
      } catch (err) {
        console.warn('Could not fetch presence from Supabase:', err);
      }
    }

    try {
      const res = await fetch('/api/community/presence');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.presence) && json.presence.length > 0) {
          localStorage.setItem(this.presenceKey, JSON.stringify(json.presence));
          return json.presence;
        }
      }
    } catch {}

    return this.getCommunityPresence();
  }

  updateMyPresence(studentId: string, updates: Partial<StudentPresenceProfile>): StudentPresenceProfile {
    const list = this.getCommunityPresence();
    let profile = list.find((p) => p.studentId === studentId);

    if (!profile) {
      const user = storage.getUserById(studentId);
      profile = {
        studentId,
        studentName: user?.name || 'Student',
        avatarColor: user?.avatarColor || 'bg-blue-600',
        ageGroup: user?.ageGroup || 'adult',
        visionPreference: user?.visionPreference || 'standard',
        status: 'available',
        isDiscoverable: true,
        allowIncomingMessages: true,
        lastActiveAt: new Date().toISOString(),
      };
      list.push(profile);
    }

    Object.assign(profile, updates, { lastActiveAt: new Date().toISOString() });
    localStorage.setItem(this.presenceKey, JSON.stringify(list));

    // Sync to backend proxy
    fetch('/api/community/presence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    }).catch(() => {});

    // Sync to Supabase
    if (supabaseService.isConfigured()) {
      try {
        const client = supabaseService.getClient();
        if (client) {
          client.from('student_presence').upsert({
            student_id: profile.studentId,
            student_name: profile.studentName,
            avatar_color: profile.avatarColor,
            age_group: profile.ageGroup,
            vision_preference: profile.visionPreference,
            status: profile.status,
            is_discoverable: profile.isDiscoverable,
            allow_incoming_messages: profile.allowIncomingMessages,
            last_active_at: profile.lastActiveAt,
          }).then(() => {});
        }
      } catch {}
    }

    return profile;
  }

  getAvailableStudents(currentStudent: User): StudentPresenceProfile[] {
    const list = this.getCommunityPresence();
    const blockedList = this.getBlockedUsers(currentStudent.id);

    return list.filter((p) => {
      // Exclude self
      if (p.studentId === currentStudent.id) return false;
      // Must be discoverable and allow messages
      if (!p.isDiscoverable || !p.allowIncomingMessages) return false;
      // Exclude blocked
      if (blockedList.includes(p.studentId)) return false;
      // Age safeguarding: minors can only discover/message fellow minors! Adults with adults!
      if (currentStudent.ageGroup !== p.ageGroup) return false;

      return true;
    });
  }

  // ==============================================================================
  // 3. GROUP CHATS
  // ==============================================================================

  getGroupChats(): CommunityGroupChat[] {
    try {
      const raw = localStorage.getItem(this.groupsKey);
      return raw ? JSON.parse(raw) : DEFAULT_COMMUNITY_GROUPS;
    } catch {
      return DEFAULT_COMMUNITY_GROUPS;
    }
  }

  async fetchGroupChats(): Promise<CommunityGroupChat[]> {
    if (supabaseService.isConfigured()) {
      try {
        const client = supabaseService.getClient();
        if (client) {
          const { data, error } = await client
            .from('community_group_chats')
            .select('*')
            .eq('is_archived', false)
            .order('created_at', { ascending: true });

          if (!error && data && data.length > 0) {
            const mapped: CommunityGroupChat[] = data.map((d: any) => ({
              id: d.id,
              name: d.name,
              topicId: d.topic_id || undefined,
              description: d.description,
              category: d.category,
              createdById: d.created_by_id,
              createdByName: d.created_by_name,
              memberIds: d.member_ids || [],
              isArchived: !!d.is_archived,
              createdAt: d.created_at,
              updatedAt: d.updated_at,
            }));
            localStorage.setItem(this.groupsKey, JSON.stringify(mapped));
            return mapped;
          }
        }
      } catch (err) {
        console.warn('Could not fetch group chats from Supabase:', err);
      }
    }
    return this.getGroupChats();
  }

  getGroupById(groupId: string): CommunityGroupChat | undefined {
    return this.getGroupChats().find((g) => g.id === groupId);
  }

  createGroupChat(
    name: string,
    description: string,
    category: 'beginner' | 'topic' | 'speaking' | 'announcements',
    creator: User,
    topicId?: string
  ): CommunityGroupChat {
    const groups = this.getGroupChats();
    const newGroup: CommunityGroupChat = {
      id: `grp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      description: description.trim(),
      category,
      topicId,
      createdById: creator.id,
      createdByName: creator.name,
      memberIds: [creator.id],
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    groups.unshift(newGroup);
    localStorage.setItem(this.groupsKey, JSON.stringify(groups));

    fetch('/api/community/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGroup),
    }).catch(() => {});

    // Sync to Supabase
    if (supabaseService.isConfigured()) {
      try {
        const client = supabaseService.getClient();
        if (client) {
          client.from('community_group_chats').insert({
            id: newGroup.id,
            name: newGroup.name,
            description: newGroup.description,
            category: newGroup.category,
            topic_id: newGroup.topicId || null,
            created_by_id: newGroup.createdById,
            created_by_name: newGroup.createdByName,
            member_ids: newGroup.memberIds,
            is_archived: false,
            created_at: newGroup.createdAt,
            updated_at: newGroup.updatedAt,
          }).then(() => {});
        }
      } catch {}
    }

    return newGroup;
  }

  joinGroup(groupId: string, userId: string): CommunityGroupChat {
    const groups = this.getGroupChats();
    const group = groups.find((g) => g.id === groupId);
    if (!group) throw new Error('Group not found');

    if (!group.memberIds.includes(userId)) {
      group.memberIds.push(userId);
      group.updatedAt = new Date().toISOString();
      localStorage.setItem(this.groupsKey, JSON.stringify(groups));
    }
    return group;
  }

  leaveGroup(groupId: string, userId: string): CommunityGroupChat {
    const groups = this.getGroupChats();
    const group = groups.find((g) => g.id === groupId);
    if (!group) throw new Error('Group not found');

    group.memberIds = group.memberIds.filter((id) => id !== userId);
    group.updatedAt = new Date().toISOString();
    localStorage.setItem(this.groupsKey, JSON.stringify(groups));
    return group;
  }

  archiveGroup(groupId: string): void {
    const groups = this.getGroupChats();
    const group = groups.find((g) => g.id === groupId);
    if (group) {
      group.isArchived = true;
      group.updatedAt = new Date().toISOString();
      localStorage.setItem(this.groupsKey, JSON.stringify(groups));

      if (supabaseService.isConfigured()) {
        try {
          const client = supabaseService.getClient();
          if (client) {
            client
              .from('community_group_chats')
              .update({ is_archived: true, updated_at: group.updatedAt })
              .eq('id', groupId)
              .then(() => {});
          }
        } catch {}
      }
    }
  }

  getGroupMessages(groupId: string): CommunityGroupMessage[] {
    try {
      const raw = localStorage.getItem(this.groupMessagesKey);
      const all: CommunityGroupMessage[] = raw ? JSON.parse(raw) : [];
      return all.filter((m) => m.groupId === groupId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } catch {
      return [];
    }
  }

  async fetchGroupMessages(groupId: string): Promise<CommunityGroupMessage[]> {
    if (supabaseService.isConfigured()) {
      try {
        const client = supabaseService.getClient();
        if (client) {
          const { data, error } = await client
            .from('community_group_messages')
            .select('*')
            .eq('group_id', groupId)
            .order('created_at', { ascending: true });

          if (!error && data && data.length > 0) {
            const mapped: CommunityGroupMessage[] = data.map((d: any) => ({
              id: d.id,
              groupId: d.group_id,
              senderId: d.sender_id,
              senderName: d.sender_name,
              senderRole: d.sender_role,
              senderAvatarColor: d.sender_avatar_color,
              text: d.text_content || undefined,
              audioUrl: d.audio_url || undefined,
              durationSeconds: d.duration_seconds || undefined,
              isAnnouncement: !!d.is_announcement,
              createdAt: d.created_at,
            }));

            // Merge into local cache
            const raw = localStorage.getItem(this.groupMessagesKey);
            const all: CommunityGroupMessage[] = raw ? JSON.parse(raw) : [];
            const existingIds = new Set(all.map((m) => m.id));
            let hasNew = false;
            mapped.forEach((m) => {
              if (!existingIds.has(m.id)) {
                all.push(m);
                hasNew = true;
              }
            });
            if (hasNew) {
              localStorage.setItem(this.groupMessagesKey, JSON.stringify(all));
            }
            return mapped;
          }
        }
      } catch (err) {
        console.warn('Could not fetch group messages from Supabase:', err);
      }
    }

    try {
      const res = await fetch(`/api/community/group-messages/${encodeURIComponent(groupId)}`);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.messages) && json.messages.length > 0) {
          const raw = localStorage.getItem(this.groupMessagesKey);
          const all: CommunityGroupMessage[] = raw ? JSON.parse(raw) : [];
          const existingIds = new Set(all.map((m) => m.id));
          let hasNew = false;
          json.messages.forEach((m: CommunityGroupMessage) => {
            if (!existingIds.has(m.id)) {
              all.push(m);
              hasNew = true;
            }
          });
          if (hasNew) {
            localStorage.setItem(this.groupMessagesKey, JSON.stringify(all));
          }
        }
      }
    } catch {}

    return this.getGroupMessages(groupId);
  }

  async sendGroupMessage(msg: {
    groupId: string;
    senderId: string;
    senderName: string;
    senderRole: 'student' | 'teacher';
    senderAvatarColor: string;
    text?: string;
    audioUrl?: string;
    durationSeconds?: number;
    isAnnouncement?: boolean;
  }): Promise<CommunityGroupMessage> {
    const newMsg: CommunityGroupMessage = {
      id: `gmsg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      groupId: msg.groupId,
      senderId: msg.senderId,
      senderName: msg.senderName,
      senderRole: msg.senderRole,
      senderAvatarColor: msg.senderAvatarColor,
      text: msg.text?.trim() || undefined,
      audioUrl: msg.audioUrl,
      durationSeconds: msg.durationSeconds,
      isAnnouncement: msg.isAnnouncement,
      createdAt: new Date().toISOString(),
    };

    const raw = localStorage.getItem(this.groupMessagesKey);
    const all: CommunityGroupMessage[] = raw ? JSON.parse(raw) : [];
    all.push(newMsg);
    localStorage.setItem(this.groupMessagesKey, JSON.stringify(all));

    // Post to backend proxy
    try {
      await fetch('/api/community/group-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg),
      });
    } catch {
      // offline
    }

    // Sync to Supabase
    if (supabaseService.isConfigured()) {
      try {
        const client = supabaseService.getClient();
        if (client) {
          client.from('community_group_messages').insert({
            id: newMsg.id,
            group_id: newMsg.groupId,
            sender_id: newMsg.senderId,
            sender_name: newMsg.senderName,
            sender_role: newMsg.senderRole,
            sender_avatar_color: newMsg.senderAvatarColor,
            text_content: newMsg.text || null,
            audio_url: newMsg.audioUrl || null,
            duration_seconds: newMsg.durationSeconds || null,
            is_announcement: !!newMsg.isAnnouncement,
            created_at: newMsg.createdAt,
          }).then(() => {});
        }
      } catch {}
    }

    soundEffects.playSuccess();
    return newMsg;
  }

  // ==============================================================================
  // 4. BLOCKING & SAFETY CONTROLS
  // ==============================================================================

  getBlockedUsers(userId: string): string[] {
    try {
      const raw = localStorage.getItem(this.blocksKey);
      const list: BlockedUserRecord[] = raw ? JSON.parse(raw) : [];
      return list.filter((b) => b.blockerId === userId).map((b) => b.blockedId);
    } catch {
      return [];
    }
  }

  blockUser(blockerId: string, blockedId: string): void {
    const raw = localStorage.getItem(this.blocksKey);
    const list: BlockedUserRecord[] = raw ? JSON.parse(raw) : [];
    if (!list.some((b) => b.blockerId === blockerId && b.blockedId === blockedId)) {
      list.push({
        id: `blk-${Date.now()}`,
        blockerId,
        blockedId,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(this.blocksKey, JSON.stringify(list));
    }
  }

  unblockUser(blockerId: string, blockedId: string): void {
    const raw = localStorage.getItem(this.blocksKey);
    const list: BlockedUserRecord[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter((b) => !(b.blockerId === blockerId && b.blockedId === blockedId));
    localStorage.setItem(this.blocksKey, JSON.stringify(filtered));
  }

  isUserBlocked(blockerId: string, blockedId: string): boolean {
    return this.getBlockedUsers(blockerId).includes(blockedId);
  }
}

export const messagingService = new MessagingService();
