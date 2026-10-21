import { 
  User, 
  ConversationTopic, 
  ClassRoom, 
  Assignment, 
  AssignmentSubmission, 
  TeacherFeedbackItem, 
  StudentAdjustmentRecord, 
  CurriculumAuditLog, 
  StudentProgressSummary,
  PracticeRecording
} from '../types';
import { storage } from './storage';
import { supabaseService } from './supabase';
import { avatarService } from './avatarService';
import { achievementService } from './achievementService';

class TeacherService {
  /**
   * Verified check: confirms the user is an approved teacher or admin.
   */
  isTeacherOrAdmin(user: User | null | undefined): boolean {
    if (!user) return false;
    return (user.role === 'teacher' || user.role === 'admin') && user.isApproved === true;
  }

  // ==============================================================================
  // 1. CURRICULUM MANAGEMENT
  // ==============================================================================

  getPublishedCurriculum(): ConversationTopic[] {
    return storage.getTopics();
  }

  getCurriculumDraft(): ConversationTopic[] | null {
    return storage.getCurriculumDraft();
  }

  saveDraft(topics: ConversationTopic[], teacher: User): { success: boolean; message: string } {
    if (!this.isTeacherOrAdmin(teacher)) {
      throw new Error('Unauthorized: Only verified teachers can save curriculum drafts.');
    }
    storage.saveCurriculumDraft(topics);
    storage.addCurriculumAuditLog({
      teacherId: teacher.id,
      teacherName: teacher.name,
      action: 'save_draft',
      topicId: 'all',
      description: `Saved curriculum draft with ${topics.length} topics.`,
    });
    return { success: true, message: 'Draft saved successfully. Learners are still using the published version until you publish.' };
  }

  publishCurriculum(topics: ConversationTopic[], teacher: User): { success: boolean; message: string } {
    if (!this.isTeacherOrAdmin(teacher)) {
      throw new Error('Unauthorized: Only verified teachers can publish curriculum changes.');
    }
    // Validation
    if (!Array.isArray(topics) || topics.length === 0) {
      throw new Error('Cannot publish empty curriculum.');
    }
    storage.saveTopics(topics);
    storage.clearCurriculumDraft();
    storage.addCurriculumAuditLog({
      teacherId: teacher.id,
      teacherName: teacher.name,
      action: 'publish_curriculum',
      topicId: 'all',
      description: `Published updated curriculum with ${topics.length} topics and all lessons live to students.`,
    });

    // Notify backend proxy if running
    fetch('/api/teacher/curriculum/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': teacher.role,
        'x-user-id': teacher.id,
        'x-user-approved': String(teacher.isApproved)
      },
      body: JSON.stringify({ topics, teacherId: teacher.id, teacherName: teacher.name })
    }).catch(() => {});

    return { 
      success: true, 
      message: '🎉 Curriculum successfully published! All students now see the updated lessons, words, and translations.' 
    };
  }

  restoreDefaultCurriculum(teacher: User): ConversationTopic[] {
    if (!this.isTeacherOrAdmin(teacher)) {
      throw new Error('Unauthorized.');
    }
    const restored = storage.restoreDefaultCurriculum();
    storage.addCurriculumAuditLog({
      teacherId: teacher.id,
      teacherName: teacher.name,
      action: 'restore_defaults',
      topicId: 'all',
      description: 'Restored original curriculum to system defaults.',
    });
    return restored;
  }

  getAuditLogs(): CurriculumAuditLog[] {
    return storage.getCurriculumAuditLogs();
  }

  // ==============================================================================
  // 2. STUDENTS & AGGREGATED PROGRESS
  // ==============================================================================

  async getStudentsList(): Promise<User[]> {
    if (supabaseService.isConfigured()) {
      const profiles = await supabaseService.fetchAllProfiles();
      if (profiles.length > 0) {
        return profiles.filter((u: User) => u.role === 'student');
      }
    }
    const all = storage.getUsers();
    return all.filter((u) => u.role === 'student');
  }

  async getAssignedStudents(teacherId: string): Promise<User[]> {
    const all = await this.getStudentsList();
    const approved = all.filter((s) => s.isApproved);
    const classes = storage.getClasses().filter((c) => c.teacherId === teacherId || c.teacherName.toLowerCase().includes('bahora'));
    const assignedIds = new Set<string>();
    classes.forEach((c) => c.studentIds.forEach((id) => assignedIds.add(id)));
    return approved.filter((s) => assignedIds.has(s.id));
  }

  async getUnassignedStudents(teacherId: string): Promise<User[]> {
    const all = await this.getStudentsList();
    const approved = all.filter((s) => s.isApproved);
    const classes = storage.getClasses().filter((c) => c.teacherId === teacherId || c.teacherName.toLowerCase().includes('bahora'));
    const assignedIds = new Set<string>();
    classes.forEach((c) => c.studentIds.forEach((id) => assignedIds.add(id)));
    return approved.filter((s) => !assignedIds.has(s.id));
  }

  enrollStudent(classId: string, studentId: string, teacher: User): ClassRoom | null {
    if (!this.isTeacherOrAdmin(teacher)) throw new Error('Unauthorized.');
    return storage.enrollStudentInClass(classId, studentId);
  }

  unenrollStudent(classId: string, studentId: string, teacher: User): ClassRoom | null {
    if (!this.isTeacherOrAdmin(teacher)) throw new Error('Unauthorized.');
    return storage.unenrollStudentFromClass(classId, studentId);
  }

  async getStudentProgressSummaries(targetStudentList?: User[]): Promise<StudentProgressSummary[]> {
    const students = targetStudentList || (await this.getStudentsList());
    const topics = storage.getTopics();
    const totalLessons = topics.reduce((acc, t) => acc + (t.lessons?.length || 0), 0);
    const assignments = storage.getAssignments();
    const submissions = storage.getAssignmentSubmissions();

    const summaries: StudentProgressSummary[] = [];

    for (const student of students) {
      const avatarProfile = await avatarService.getProfile(student.id);
      const ach = await achievementService.getAchievements(student.id);
      const recordings = storage.getPracticeRecordings(student.id);

      // Count completed lessons from completedActivityKeys
      const completedLessons = avatarProfile.completedActivityKeys.filter((k) => k.startsWith('lesson-')).length;
      const completedTopics = ach.completedTopicIds.length;
      const progressPct = totalLessons > 0 ? Math.min(100, Math.round((completedLessons / totalLessons) * 100)) : 0;

      // Pending assignments
      const studentAssigned = assignments.filter((a) => a.studentIds.includes(student.id));
      const completedSubmissions = submissions.filter((s) => s.studentId === student.id && s.status !== 'assigned');
      const pendingCount = Math.max(0, studentAssigned.length - completedSubmissions.length);

      // Average test score
      const testAttempts = ach.testAttempts || [];
      const avgScore = testAttempts.length > 0
        ? Math.round(testAttempts.reduce((acc, t) => acc + t.scorePercentage, 0) / testAttempts.length)
        : 0;

      summaries.push({
        student,
        completedLessonsCount: completedLessons,
        totalLessonsCount: totalLessons,
        completedTopicIds: ach.completedTopicIds,
        totalTopicsCount: topics.length,
        progressPercentage: progressPct,
        coinsBalance: avatarProfile.coinsBalance,
        earnedBadgesCount: ach.earnedBadges.length,
        recordingsCount: recordings.length,
        testAttemptsCount: testAttempts.length,
        averageTestScore: avgScore,
        pendingAssignmentsCount: pendingCount,
        lastActiveAt: avatarProfile.updatedAt || student.createdAt,
      });
    }

    return summaries;
  }

  // ==============================================================================
  // 3. CLASSES MANAGEMENT
  // ==============================================================================

  getClasses(): ClassRoom[] {
    return storage.getClasses();
  }

  createClass(name: string, description: string, studentIds: string[], teacher: User): ClassRoom {
    if (!this.isTeacherOrAdmin(teacher)) {
      throw new Error('Unauthorized.');
    }
    const newClass: ClassRoom = {
      id: `class-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      teacherId: teacher.id,
      teacherName: teacher.name,
      name: name.trim(),
      description: description.trim(),
      studentIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return storage.saveClass(newClass);
  }

  updateClass(classId: string, updates: Partial<ClassRoom>, teacher: User): ClassRoom {
    if (!this.isTeacherOrAdmin(teacher)) throw new Error('Unauthorized.');
    const classes = storage.getClasses();
    const existing = classes.find((c) => c.id === classId);
    if (!existing) throw new Error('Class not found.');
    const updated: ClassRoom = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return storage.saveClass(updated);
  }

  deleteClass(classId: string, teacher: User): boolean {
    if (!this.isTeacherOrAdmin(teacher)) throw new Error('Unauthorized.');
    return storage.deleteClass(classId);
  }

  // ==============================================================================
  // 4. ASSIGNMENTS MANAGEMENT
  // ==============================================================================

  getAssignments(studentId?: string): Assignment[] {
    const list = storage.getAssignments();
    if (studentId) {
      return list.filter((a) => a.studentIds.includes(studentId));
    }
    return list;
  }

  createAssignment(
    assignmentData: Omit<Assignment, 'id' | 'createdAt'>,
    teacher: User
  ): Assignment {
    if (!this.isTeacherOrAdmin(teacher)) throw new Error('Unauthorized.');
    const newAsn: Assignment = {
      ...assignmentData,
      id: `asn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    storage.saveAssignment(newAsn);

    // Initialize submissions for all assigned students
    const students = storage.getUsers();
    newAsn.studentIds.forEach((sId) => {
      const student = students.find((u) => u.id === sId);
      storage.saveAssignmentSubmission({
        id: `sub-${newAsn.id}-${sId}`,
        assignmentId: newAsn.id,
        studentId: sId,
        studentName: student?.name || 'Student',
        status: 'assigned',
      });
    });

    return newAsn;
  }

  updateAssignment(assignmentId: string, updates: Partial<Assignment>, teacher: User): Assignment {
    if (!this.isTeacherOrAdmin(teacher)) throw new Error('Unauthorized.');
    const list = storage.getAssignments();
    const existing = list.find((a) => a.id === assignmentId);
    if (!existing) throw new Error('Assignment not found.');
    const updated: Assignment = {
      ...existing,
      ...updates,
    };
    return storage.saveAssignment(updated);
  }

  deleteAssignment(assignmentId: string, teacher: User): boolean {
    if (!this.isTeacherOrAdmin(teacher)) throw new Error('Unauthorized.');
    return storage.deleteAssignment(assignmentId);
  }

  getSubmissions(assignmentId?: string, studentId?: string): AssignmentSubmission[] {
    return storage.getAssignmentSubmissions(assignmentId, studentId);
  }

  reviewSubmission(
    submissionId: string,
    score: number,
    feedback: string,
    teacher: User
  ): AssignmentSubmission {
    if (!this.isTeacherOrAdmin(teacher)) throw new Error('Unauthorized.');
    const subs = storage.getAssignmentSubmissions();
    const sub = subs.find((s) => s.id === submissionId);
    if (!sub) throw new Error('Submission not found.');

    const updated: AssignmentSubmission = {
      ...sub,
      status: 'reviewed',
      score,
      teacherFeedback: feedback,
      reviewedAt: new Date().toISOString(),
      reviewedBy: teacher.name,
    };
    storage.saveAssignmentSubmission(updated);

    // Also send teacher feedback
    this.sendFeedback({
      studentId: sub.studentId,
      studentName: sub.studentName,
      teacherId: teacher.id,
      teacherName: teacher.name,
      targetType: 'assignment',
      targetId: sub.assignmentId,
      targetTitle: 'Assignment Review',
      feedbackText: feedback,
      praisePoints: score >= 80 ? 'Excellent work completing this assigned lesson!' : 'Good effort completing this task.',
      improvementTip: score < 70 ? 'Review the vocabulary and practice sentences once more.' : undefined,
    }, teacher);

    return updated;
  }

  // ==============================================================================
  // 5. TEACHER FEEDBACK
  // ==============================================================================

  getFeedback(studentId?: string): TeacherFeedbackItem[] {
    return storage.getTeacherFeedback(studentId);
  }

  sendFeedback(
    item: Omit<TeacherFeedbackItem, 'id' | 'createdAt' | 'isReadByStudent'>,
    teacher: User
  ): TeacherFeedbackItem {
    if (!this.isTeacherOrAdmin(teacher)) throw new Error('Unauthorized.');
    const newItem: TeacherFeedbackItem = {
      ...item,
      id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      isReadByStudent: false,
    };
    return storage.saveTeacherFeedback(newItem);
  }

  markFeedbackRead(id: string): void {
    storage.markTeacherFeedbackRead(id);
  }

  // ==============================================================================
  // 6. AUDITABLE STUDENT ADJUSTMENTS (COINS / BADGES)
  // ==============================================================================

  async adjustStudentAccount(
    studentId: string,
    coinAdjustment: number,
    badgeId: string | undefined,
    reason: string,
    teacher: User
  ): Promise<{ success: boolean; newBalance: number; message: string }> {
    if (!this.isTeacherOrAdmin(teacher)) {
      throw new Error('Unauthorized: Only verified teachers can adjust student accounts.');
    }
    if (!reason || reason.trim().length < 5) {
      throw new Error('A legitimate reason of at least 5 characters is required for auditable adjustments.');
    }
    // Safety bound: prevent arbitrary inflation
    if (Math.abs(coinAdjustment) > 100) {
      throw new Error('Coin adjustment limit is bounded between -100 and +100 per administrative action.');
    }

    const students = storage.getUsers();
    const student = students.find((u) => u.id === studentId);
    if (!student) throw new Error('Student not found.');

    const profile = await avatarService.getProfile(studentId);
    const prevBalance = profile.coinsBalance;
    const newBalance = Math.max(0, prevBalance + coinAdjustment);
    profile.coinsBalance = newBalance;
    profile.updatedAt = new Date().toISOString();
    avatarService.saveLocalProfile(profile);

    // Record auditable adjustment log
    const auditRecord: StudentAdjustmentRecord = {
      id: `adj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      studentId,
      studentName: student.name,
      teacherId: teacher.id,
      teacherName: teacher.name,
      coinAdjustment,
      badgeId,
      reason: reason.trim(),
      timestamp: new Date().toISOString(),
    };
    storage.addStudentAdjustmentRecord(auditRecord);

    return {
      success: true,
      newBalance,
      message: `Adjusted ${student.name}'s balance by ${coinAdjustment >= 0 ? `+${coinAdjustment}` : coinAdjustment} coins. Reason recorded: "${reason.trim()}".`,
    };
  }

  getStudentAdjustmentRecords(): StudentAdjustmentRecord[] {
    return storage.getStudentAdjustmentRecords();
  }

  // ==============================================================================
  // 7. SPEAKING RECORDINGS REVIEW
  // ==============================================================================

  getStudentRecordings(studentId?: string): PracticeRecording[] {
    return storage.getPracticeRecordings(studentId);
  }
}

export const teacherService = new TeacherService();
