import { 
  User, 
  ConversationTopic, 
  VoiceMessage, 
  SafetyReport, 
  PartnerPairing, 
  PracticeRecording,
  ClassRoom,
  Assignment,
  AssignmentSubmission,
  TeacherFeedbackItem,
  StudentAdjustmentRecord,
  CurriculumAuditLog
} from '../types';

// Helper to generate valid WAV data for seed messages
function createAudioDataUri(frequency: number, durationSec: number): string {
  if (typeof window === 'undefined') return '';
  const sampleRate = 22050;
  const numSamples = sampleRate * durationSec;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const wave = Math.sin(2 * Math.PI * frequency * t) * 0.22 * Math.sin((Math.PI * i) / numSamples);
    const val = Math.max(-1, Math.min(1, wave));
    view.setInt16(offset, val < 0 ? val * 0x8000 : val * 0x7fff, true);
    offset += 2;
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}
import { CURRICULUM_TOPICS } from '../data/curriculum';
import { augmentTopicsWithUzbek } from '../data/curriculumUzbek';

export const INITIAL_TOPICS: ConversationTopic[] = augmentTopicsWithUzbek(CURRICULUM_TOPICS);

export const INITIAL_USERS: User[] = [
  {
    id: 'teacher-bahora',
    name: 'Teacher Bahora',
    email: 'btoyirova1982@gmail.com',
    role: 'teacher',
    ageGroup: 'adult',
    age: 38,
    visionPreference: 'standard',
    isApproved: true,
    avatarColor: 'bg-purple-700',
    bioText: 'English Instructor & Educational Lead at Limitless English Connect. Here to guide, encourage, and support your speaking journey.',
    createdAt: '2026-01-01'
  },
  {
    id: 'student-amina',
    name: 'Amina',
    email: 'amina@limitless.edu',
    role: 'student',
    ageGroup: 'child',
    age: 11,
    visionPreference: 'low-vision-large-text',
    nativeLanguage: 'Arabic',
    isApproved: true,
    partnerId: 'student-carlos',
    avatarColor: 'bg-emerald-600',
    bioText: 'Beginner student. I love music, storytelling, and practicing English with my speaking partner Carlos.',
    createdAt: '2026-02-10'
  },
  {
    id: 'student-carlos',
    name: 'Carlos',
    email: 'carlos@limitless.edu',
    role: 'student',
    ageGroup: 'child',
    age: 12,
    visionPreference: 'screen-reader',
    nativeLanguage: 'Spanish',
    isApproved: true,
    partnerId: 'student-amina',
    avatarColor: 'bg-amber-600',
    bioText: 'Screen reader user. Learning English for school. I love science and listening to audio sports.',
    createdAt: '2026-02-11'
  },
  {
    id: 'student-david',
    name: 'David',
    email: 'david@limitless.edu',
    role: 'student',
    ageGroup: 'adult',
    age: 28,
    visionPreference: 'high-contrast',
    nativeLanguage: 'Portuguese',
    isApproved: true,
    partnerId: 'student-elena',
    avatarColor: 'bg-indigo-600',
    bioText: 'Adult learner. Practicing English for daily conversations and work.',
    createdAt: '2026-02-15'
  },
  {
    id: 'student-elena',
    name: 'Elena',
    email: 'elena@limitless.edu',
    role: 'student',
    ageGroup: 'adult',
    age: 34,
    visionPreference: 'low-vision-large-text',
    nativeLanguage: 'Greek',
    isApproved: true,
    partnerId: 'student-david',
    avatarColor: 'bg-purple-600',
    bioText: 'Adult learner. I like cooking, family conversations, and gentle speaking practice.',
    createdAt: '2026-02-16'
  },
  {
    id: 'student-liam',
    name: 'Liam',
    email: 'liam@limitless.edu',
    role: 'student',
    ageGroup: 'child',
    age: 13,
    visionPreference: 'screen-reader',
    nativeLanguage: 'French',
    isApproved: false, // Pending teacher approval
    avatarColor: 'bg-cyan-600',
    bioText: 'New student waiting for Teacher Bahora to approve my account and pair me with a practice buddy.',
    createdAt: '2026-10-10'
  }
];

class StorageService {
  private usersKey = 'le_users_v2';
  private currentUserKey = 'le_current_user_v2';
  private messagesKey = 'le_messages_v2';
  private reportsKey = 'le_reports_v2';
  private topicsKey = 'le_topics_v3';
  private draftTopicsKey = 'le_topics_draft_v1';
  private auditLogsKey = 'le_curriculum_audit_logs_v1';
  private classesKey = 'le_classes_v1';
  private assignmentsKey = 'le_assignments_v1';
  private submissionsKey = 'le_submissions_v1';
  private feedbackKey = 'le_teacher_feedback_v1';
  private adjustmentsKey = 'le_student_adjustments_v1';
  private practiceKey = 'le_practice_recordings_v1';

  constructor() {
    this.initDefaults();
  }

  private initDefaults() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(this.usersKey)) {
      localStorage.setItem(this.usersKey, JSON.stringify(INITIAL_USERS));
    }
    // Only initialize if not already stored to preserve teacher edits
    if (!localStorage.getItem(this.topicsKey)) {
      localStorage.setItem(this.topicsKey, JSON.stringify(INITIAL_TOPICS));
    }
    if (!localStorage.getItem(this.messagesKey)) {
      // Seed initial messages with real generated audio URIs
      const seedMessages: VoiceMessage[] = [
        {
          id: 'msg-seed-1',
          conversationId: 'student-amina_student-carlos',
          senderId: 'student-carlos',
          senderName: 'Carlos',
          receiverId: 'student-amina',
          audioUrl: createAudioDataUri(330, 3.5),
          durationSeconds: 4,
          topicId: 'greetings',
          transcript: 'Hello Amina! Good morning. How are you feeling today? I am happy to practice English with you.',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          isListened: true
        },
        {
          id: 'msg-seed-2',
          conversationId: 'student-amina_student-carlos',
          senderId: 'student-amina',
          senderName: 'Amina',
          receiverId: 'student-carlos',
          audioUrl: createAudioDataUri(440, 4.0),
          durationSeconds: 4,
          topicId: 'greetings',
          transcript: 'Good morning Carlos! I am doing very well, thank you. The weather is sunny here today.',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          isListened: true
        },
        {
          id: 'msg-seed-3',
          conversationId: 'student-david_student-elena',
          senderId: 'student-david',
          senderName: 'David',
          receiverId: 'student-elena',
          audioUrl: createAudioDataUri(260, 4.5),
          durationSeconds: 5,
          topicId: 'favorite-food',
          transcript: 'Hello Elena! My favorite food is vegetable soup and fresh bread. What food do you like to cook?',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          isListened: false
        }
      ];
      localStorage.setItem(this.messagesKey, JSON.stringify(seedMessages));
    }
    if (!localStorage.getItem(this.reportsKey)) {
      localStorage.setItem(this.reportsKey, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.practiceKey)) {
      localStorage.setItem(this.practiceKey, JSON.stringify([]));
    }
  }

  getUsers(): User[] {
    try {
      const data = localStorage.getItem(this.usersKey);
      let users: User[] = data ? JSON.parse(data) : INITIAL_USERS;
      // Auto-migrate any legacy teacher records or btoyirova1982@gmail.com to verified Teacher Bahora
      users = users.map((u) => {
        if (
          u.id === 'teacher-sarah' || 
          u.id === 'teacher-bahora' || 
          u.email === 'btoyirova1982@gmail.com' || 
          (u.role === 'teacher' && (u.name === 'Teacher Sarah' || u.name === 'Teacher Bahora'))
        ) {
          return {
            ...u,
            id: u.id.startsWith('student-') ? 'teacher-bahora' : u.id,
            name: 'Teacher Bahora',
            email: 'btoyirova1982@gmail.com',
            role: 'teacher' as const,
            isApproved: true,
            avatarColor: u.avatarColor || 'bg-purple-700',
          };
        }
        return u;
      });
      return users;
    } catch {
      return INITIAL_USERS;
    }
  }

  saveUsers(users: User[]) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  saveUser(updated: User) {
    const users = this.getUsers().map((u) => (u.id === updated.id ? updated : u));
    this.saveUsers(users);
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    let currentId = localStorage.getItem(this.currentUserKey);
    if (!currentId) return null;
    if (currentId === 'teacher-sarah') currentId = 'teacher-bahora';
    const users = this.getUsers();
    return users.find((u) => u.id === currentId) || null;
  }

  clearCurrentUser() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.currentUserKey);
    }
  }

  setCurrentUser(userId: string) {
    if (userId === 'teacher-sarah') userId = 'teacher-bahora';
    localStorage.setItem(this.currentUserKey, userId);
  }

  getUserById(id: string): User | undefined {
    if (id === 'teacher-sarah') id = 'teacher-bahora';
    return this.getUsers().find((u) => u.id === id);
  }

  registerUser(userData: Omit<User, 'id' | 'isApproved' | 'createdAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...userData,
      id: `student-${Date.now()}`,
      isApproved: userData.role === 'teacher', // Teachers auto-approved in demo, students require teacher review
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser.id);
    return newUser;
  }

  approveUser(userId: string) {
    const users = this.getUsers();
    const target = users.find((u) => u.id === userId);
    if (target) {
      target.isApproved = true;
      this.saveUsers(users);
    }
  }

  // Safeguard matching: Minors can only be paired with Minors! Adults with Adults!
  pairStudents(student1Id: string, student2Id: string): { success: boolean; error?: string } {
    const users = this.getUsers();
    const s1 = users.find((u) => u.id === student1Id);
    const s2 = users.find((u) => u.id === student2Id);

    if (!s1 || !s2) return { success: false, error: 'Student not found.' };

    // Safeguard check
    if (s1.ageGroup !== s2.ageGroup) {
      return {
        success: false,
        error: `Safety rule violation: A ${s1.ageGroup} learner cannot be paired with an ${s2.ageGroup} learner. Minors and adults must be in separate cohorts.`
      };
    }

    s1.partnerId = s2.id;
    s2.partnerId = s1.id;
    this.saveUsers(users);
    return { success: true };
  }

  unpairStudent(studentId: string) {
    const users = this.getUsers();
    const s = users.find((u) => u.id === studentId);
    if (s && s.partnerId) {
      const partner = users.find((u) => u.id === s.partnerId);
      if (partner) partner.partnerId = undefined;
      s.partnerId = undefined;
      this.saveUsers(users);
    }
  }

  getTopics(): ConversationTopic[] {
    try {
      const data = localStorage.getItem(this.topicsKey);
      if (data) {
        const list = JSON.parse(data);
        const foodTopic = Array.isArray(list) ? list.find((t: any) => t.id === 'favorite-food-drinks') : null;
        if (foodTopic && Array.isArray(foodTopic.lessons) && foodTopic.lessons.length >= 6) {
          return augmentTopicsWithUzbek(list);
        }
      }
      return augmentTopicsWithUzbek(INITIAL_TOPICS);
    } catch {
      return augmentTopicsWithUzbek(INITIAL_TOPICS);
    }
  }

  getTopicById(id: string): ConversationTopic | undefined {
    return this.getTopics().find((t) => t.id === id);
  }

  getMessages(): VoiceMessage[] {
    try {
      const data = localStorage.getItem(this.messagesKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  getMessagesForPair(user1Id: string, user2Id: string): VoiceMessage[] {
    const all = this.getMessages();
    return all.filter(
      (m) =>
        (m.senderId === user1Id && m.receiverId === user2Id) ||
        (m.senderId === user2Id && m.receiverId === user1Id)
    );
  }

  addVoiceMessage(msg: Omit<VoiceMessage, 'id' | 'createdAt' | 'isListened'>): VoiceMessage {
    const all = this.getMessages();
    const newMsg: VoiceMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isListened: false
    };
    all.push(newMsg);
    localStorage.setItem(this.messagesKey, JSON.stringify(all));
    return newMsg;
  }

  markMessageAsListened(messageId: string) {
    const all = this.getMessages();
    const m = all.find((msg) => msg.id === messageId);
    if (m) {
      m.isListened = true;
      localStorage.setItem(this.messagesKey, JSON.stringify(all));
    }
  }

  getSafetyReports(): SafetyReport[] {
    try {
      const data = localStorage.getItem(this.reportsKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  submitSafetyReport(report: Omit<SafetyReport, 'id' | 'createdAt' | 'status'>): SafetyReport {
    const all = this.getSafetyReports();
    const newRep: SafetyReport = {
      ...report,
      id: `rep-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    all.push(newRep);
    localStorage.setItem(this.reportsKey, JSON.stringify(all));
    return newRep;
  }

  resolveReport(reportId: string, notes: string) {
    const all = this.getSafetyReports();
    const r = all.find((item) => item.id === reportId);
    if (r) {
      r.status = 'resolved';
      r.teacherNotes = notes;
      localStorage.setItem(this.reportsKey, JSON.stringify(all));
    }
  }

  // --- PRACTICE RECORDINGS & EVALUATION HISTORY ---

  getPracticeRecordings(studentId?: string): PracticeRecording[] {
    try {
      const data = localStorage.getItem(this.practiceKey);
      const list: PracticeRecording[] = data ? JSON.parse(data) : [];
      if (studentId) {
        return list.filter((r) => r.studentId === studentId);
      }
      return list;
    } catch {
      return [];
    }
  }

  savePracticeRecording(recording: PracticeRecording): PracticeRecording {
    const list = this.getPracticeRecordings();
    // Prepend newer recordings
    const existingIndex = list.findIndex((r) => r.id === recording.id);
    if (existingIndex >= 0) {
      list[existingIndex] = recording;
    } else {
      list.unshift(recording);
    }
    localStorage.setItem(this.practiceKey, JSON.stringify(list));
    return recording;
  }

  deletePracticeRecording(id: string): boolean {
    const list = this.getPracticeRecordings();
    const filtered = list.filter((r) => r.id !== id);
    localStorage.setItem(this.practiceKey, JSON.stringify(filtered));
    return true;
  }

  saveTopics(topics: ConversationTopic[]): void {
    localStorage.setItem(this.topicsKey, JSON.stringify(topics));
  }

  getCurriculumDraft(): ConversationTopic[] | null {
    try {
      const data = localStorage.getItem(this.draftTopicsKey);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  saveCurriculumDraft(topics: ConversationTopic[]): void {
    localStorage.setItem(this.draftTopicsKey, JSON.stringify(topics));
  }

  clearCurriculumDraft(): void {
    localStorage.removeItem(this.draftTopicsKey);
  }

  restoreDefaultCurriculum(): ConversationTopic[] {
    localStorage.setItem(this.topicsKey, JSON.stringify(INITIAL_TOPICS));
    localStorage.removeItem(this.draftTopicsKey);
    return INITIAL_TOPICS;
  }

  // --- CLASSES ---
  getClasses(): ClassRoom[] {
    try {
      const data = localStorage.getItem(this.classesKey);
      if (data) {
        const list: ClassRoom[] = JSON.parse(data);
        return list.map((c) => {
          if (c.teacherId === 'teacher-sarah' || c.teacherName === 'Teacher Sarah') {
            return {
              ...c,
              teacherId: 'teacher-bahora',
              teacherName: 'Teacher Bahora',
              name: c.name.replace(/Teacher Sarah/g, 'Teacher Bahora'),
            };
          }
          return c;
        });
      }
      // Seed default class
      const defaultClass: ClassRoom = {
        id: 'class-bahora-cohort-a',
        teacherId: 'teacher-bahora',
        teacherName: 'Teacher Bahora',
        name: "Teacher Bahora's English Cohort",
        description: 'Level 1 & 2 Adult English Learners cohort focused on daily conversation.',
        studentIds: [],
        createdAt: '2026-02-01T00:00:00.000Z',
        updatedAt: '2026-02-01T00:00:00.000Z',
      };
      localStorage.setItem(this.classesKey, JSON.stringify([defaultClass]));
      return [defaultClass];
    } catch {
      return [];
    }
  }

  enrollStudentInClass(classId: string, studentId: string): ClassRoom | null {
    const list = this.getClasses();
    const target = list.find((c) => c.id === classId);
    if (target) {
      if (!target.studentIds.includes(studentId)) {
        target.studentIds.push(studentId);
        target.updatedAt = new Date().toISOString();
        this.saveClass(target);
      }
      return target;
    }
    return null;
  }

  unenrollStudentFromClass(classId: string, studentId: string): ClassRoom | null {
    const list = this.getClasses();
    const target = list.find((c) => c.id === classId);
    if (target) {
      target.studentIds = target.studentIds.filter((id) => id !== studentId);
      target.updatedAt = new Date().toISOString();
      this.saveClass(target);
      return target;
    }
    return null;
  }

  saveClass(cls: ClassRoom): ClassRoom {
    const list = this.getClasses();
    const idx = list.findIndex(c => c.id === cls.id);
    if (idx >= 0) {
      list[idx] = cls;
    } else {
      list.push(cls);
    }
    localStorage.setItem(this.classesKey, JSON.stringify(list));
    return cls;
  }

  deleteClass(classId: string): boolean {
    const list = this.getClasses().filter(c => c.id !== classId);
    localStorage.setItem(this.classesKey, JSON.stringify(list));
    return true;
  }

  // --- ASSIGNMENTS ---
  getAssignments(studentId?: string): Assignment[] {
    try {
      const data = localStorage.getItem(this.assignmentsKey);
      let list: Assignment[] = [];
      if (data) {
        list = JSON.parse(data);
      } else {
        // Seed initial assignment
        const seedAssignment: Assignment = {
          id: 'asn-1',
          classId: 'class-bahora-cohort-a',
          className: "Teacher Bahora's English Cohort",
          teacherId: 'teacher-bahora',
          teacherName: 'Teacher Bahora',
          title: 'Master Fruits & Vegetables Vocabulary',
          type: 'lesson',
          topicId: 'favorite-food-drinks',
          topicTitle: 'My Favorite Food and Drinks',
          lessonId: 'food-l1',
          lessonTitle: 'Lesson 1: Fruits',
          instructions: 'Please practice all 12 fruit words. Listen to the natural English pronunciation and achieve at least 60% on the quiz.',
          dueDate: '2026-10-25',
          studentIds: [],
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(this.assignmentsKey, JSON.stringify([seedAssignment]));
        list = [seedAssignment];
      }
      // Normalize any legacy teacher references
      list = list.map((a) => {
        if (a.teacherId === 'teacher-sarah' || a.teacherName === 'Teacher Sarah') {
          return {
            ...a,
            teacherId: 'teacher-bahora',
            teacherName: 'Teacher Bahora',
          };
        }
        return a;
      });
      if (studentId) {
        return list.filter((a) => a.studentIds.includes(studentId));
      }
      return list;
    } catch {
      return [];
    }
  }

  saveAssignment(asn: Assignment): Assignment {
    const list = this.getAssignments();
    const idx = list.findIndex(a => a.id === asn.id);
    if (idx >= 0) {
      list[idx] = asn;
    } else {
      list.unshift(asn);
    }
    localStorage.setItem(this.assignmentsKey, JSON.stringify(list));
    return asn;
  }

  deleteAssignment(assignmentId: string): boolean {
    const list = this.getAssignments().filter(a => a.id !== assignmentId);
    localStorage.setItem(this.assignmentsKey, JSON.stringify(list));
    return true;
  }

  // --- ASSIGNMENT SUBMISSIONS ---
  getAssignmentSubmissions(assignmentId?: string, studentId?: string): AssignmentSubmission[] {
    try {
      const data = localStorage.getItem(this.submissionsKey);
      let list: AssignmentSubmission[] = data ? JSON.parse(data) : [];
      if (assignmentId) {
        list = list.filter(s => s.assignmentId === assignmentId);
      }
      if (studentId) {
        list = list.filter(s => s.studentId === studentId);
      }
      return list;
    } catch {
      return [];
    }
  }

  saveAssignmentSubmission(sub: AssignmentSubmission): AssignmentSubmission {
    const list = this.getAssignmentSubmissions();
    const idx = list.findIndex(s => s.id === sub.id || (s.assignmentId === sub.assignmentId && s.studentId === sub.studentId));
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...sub };
    } else {
      list.unshift(sub);
    }
    localStorage.setItem(this.submissionsKey, JSON.stringify(list));
    return sub;
  }

  // --- TEACHER FEEDBACK ---
  getTeacherFeedback(studentId?: string): TeacherFeedbackItem[] {
    try {
      const data = localStorage.getItem(this.feedbackKey);
      let list: TeacherFeedbackItem[] = data ? JSON.parse(data) : [];
      if (studentId) {
        list = list.filter(f => f.studentId === studentId);
      }
      return list;
    } catch {
      return [];
    }
  }

  saveTeacherFeedback(item: TeacherFeedbackItem): TeacherFeedbackItem {
    const list = this.getTeacherFeedback();
    const idx = list.findIndex(f => f.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    localStorage.setItem(this.feedbackKey, JSON.stringify(list));
    return item;
  }

  markTeacherFeedbackRead(id: string): void {
    const list = this.getTeacherFeedback();
    const item = list.find(f => f.id === id);
    if (item) {
      item.isReadByStudent = true;
      localStorage.setItem(this.feedbackKey, JSON.stringify(list));
    }
  }

  // --- AUDIT LOGS ---
  getCurriculumAuditLogs(): CurriculumAuditLog[] {
    try {
      const data = localStorage.getItem(this.auditLogsKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  addCurriculumAuditLog(log: Omit<CurriculumAuditLog, 'id' | 'timestamp'>): CurriculumAuditLog {
    const list = this.getCurriculumAuditLogs();
    const newLog: CurriculumAuditLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    list.unshift(newLog);
    localStorage.setItem(this.auditLogsKey, JSON.stringify(list));
    return newLog;
  }

  // --- STUDENT ADJUSTMENT RECORDS ---
  getStudentAdjustmentRecords(): StudentAdjustmentRecord[] {
    try {
      const data = localStorage.getItem(this.adjustmentsKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  addStudentAdjustmentRecord(rec: StudentAdjustmentRecord): void {
    const list = this.getStudentAdjustmentRecords();
    list.unshift(rec);
    localStorage.setItem(this.adjustmentsKey, JSON.stringify(list));
  }

  resetToDemoDefaults() {
    localStorage.removeItem(this.usersKey);
    localStorage.removeItem(this.currentUserKey);
    localStorage.removeItem(this.messagesKey);
    localStorage.removeItem(this.reportsKey);
    localStorage.removeItem(this.topicsKey);
    localStorage.removeItem(this.draftTopicsKey);
    localStorage.removeItem(this.auditLogsKey);
    localStorage.removeItem(this.classesKey);
    localStorage.removeItem(this.assignmentsKey);
    localStorage.removeItem(this.submissionsKey);
    localStorage.removeItem(this.feedbackKey);
    localStorage.removeItem(this.adjustmentsKey);
    localStorage.removeItem(this.practiceKey);
    this.initDefaults();
  }
}

export const storage = new StorageService();
