import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  ShieldAlert, 
  BookOpen, 
  CheckCircle, 
  AlertTriangle, 
  UserCheck, 
  UserX, 
  Plus, 
  Volume2,
  Lock,
  HeartHandshake,
  Database,
  ShieldBan,
  Sparkles,
  Award,
  Coins,
  Mic,
  Play,
  Square,
  MessageSquare,
  ClipboardList,
  GraduationCap,
  Search,
  Filter,
  Calendar,
  Clock,
  ArrowRight,
  Eye,
  RefreshCw,
  Send,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  AlertCircle,
  Settings,
  UserPlus,
  Trash2
} from 'lucide-react';
import { 
  User, 
  SafetyReport, 
  ConversationTopic, 
  StudentProgressSummary, 
  ClassRoom, 
  Assignment, 
  AssignmentSubmission, 
  TeacherFeedbackItem, 
  PracticeRecording, 
  StudentAdjustmentRecord,
  TestAttempt
} from '../types';
import { storage } from '../services/storage';
import { teacherService } from '../services/teacherService';
import { soundEffects } from '../services/soundEffects';
import { speechService } from '../services/speechService';
import { supabaseService } from '../services/supabase';
import { achievementService } from '../services/achievementService';
import { messagingService } from '../services/messagingService';

// Child modals and tabs
import { CurriculumEditorTab } from '../components/teacher/CurriculumEditorTab';
import { StudentProfileModal } from '../components/teacher/StudentProfileModal';
import { StudentAdjustmentModal } from '../components/teacher/StudentAdjustmentModal';
import { TeacherMessagesTab } from '../components/teacher/TeacherMessagesTab';
import { ClassEnrollmentModal } from '../components/teacher/ClassEnrollmentModal';
import { EditAssignmentModal } from '../components/teacher/EditAssignmentModal';

interface TeacherDashboardViewProps {
  currentUser: User | null;
  onRefreshData: () => void;
  onOpenAuth: () => void;
  onOpenSupabaseConfig?: () => void;
}

// 6 Simplified Main Sections + Sub-feature Views
export type TeacherTab = 
  | 'students'
  | 'achievements'
  | 'messages'
  | 'recordings'
  | 'curriculum'
  | 'settings'
  | 'assignments'
  | 'tests'
  | 'feedback'
  | 'classes'
  | 'safeguards';

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  currentUser,
  onRefreshData,
  onOpenAuth,
  onOpenSupabaseConfig
}) => {
  const [activeTab, setActiveTab] = useState<TeacherTab>('students');
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [settingsSection, setSettingsSection] = useState<'roster' | 'assignments' | 'safeguards' | 'profile'>('roster');
  const [teacherStatusNotice, setTeacherStatusNotice] = useState<string | null>(null);
  
  // Data states
  const [studentsSummaries, setStudentsSummaries] = useState<StudentProgressSummary[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [recordings, setRecordings] = useState<PracticeRecording[]>([]);
  const [feedbackList, setFeedbackList] = useState<TeacherFeedbackItem[]>([]);
  const [adjustmentLogs, setAdjustmentLogs] = useState<StudentAdjustmentRecord[]>([]);
  const [reports, setReports] = useState<SafetyReport[]>(storage.getSafetyReports());
  const [topics, setTopics] = useState<ConversationTopic[]>(storage.getTopics());
  const [loading, setLoading] = useState(false);

  // Selected student modal
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<User | null>(null);
  const [selectedStudentSummary, setSelectedStudentSummary] = useState<StudentProgressSummary | undefined>(undefined);

  // Selected student for coin adjustment
  const [adjustmentStudent, setAdjustmentStudent] = useState<User | null>(null);
  const [adjustmentBalance, setAdjustmentBalance] = useState<number>(0);

  // Search & Filters
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [recordingSearchQuery, setRecordingSearchQuery] = useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');

  // Matchmaker state (within Safeguards tab)
  const [selectedStudent1, setSelectedStudent1] = useState<string>('');
  const [selectedStudent2, setSelectedStudent2] = useState<string>('');
  const [matchmakerError, setMatchmakerError] = useState<string | null>(null);
  const [matchmakerSuccess, setMatchmakerSuccess] = useState<string | null>(null);

  // New Class Form State
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');
  const [newClassStudentIds, setNewClassStudentIds] = useState<string[]>([]);

  // New Assignment Form State
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [newAsnTitle, setNewAsnTitle] = useState('');
  const [newAsnType, setNewAsnType] = useState<'lesson' | 'quiz' | 'speaking' | 'custom'>('lesson');
  const [newAsnTopicId, setNewAsnTopicId] = useState(topics[0]?.id || 'greetings');
  const [newAsnLessonId, setNewAsnLessonId] = useState('');
  const [newAsnClassId, setNewAsnClassId] = useState('');
  const [newAsnStudentIds, setNewAsnStudentIds] = useState<string[]>([]);
  const [newAsnInstructions, setNewAsnInstructions] = useState('');
  const [newAsnDueDate, setNewAsnDueDate] = useState('');

  // Review submission modal / drawer
  const [reviewingSubmission, setReviewingSubmission] = useState<AssignmentSubmission | null>(null);
  const [reviewScore, setReviewScore] = useState<number>(100);
  const [reviewFeedbackText, setReviewFeedbackText] = useState('');

  // Dedicated Audio Player for Speaking Recordings tab
  const [activePlayingRecId, setActivePlayingRecId] = useState<string | null>(null);
  const [activeAudioElement, setActiveAudioElement] = useState<HTMLAudioElement | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);

  // Quick Teacher Feedback Composer modal
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [fbTargetStudentId, setFbTargetStudentId] = useState('');
  const [fbTargetType, setFbTargetType] = useState<'recording' | 'assignment' | 'lesson' | 'test' | 'general'>('general');
  const [fbTargetTitle, setFbTargetTitle] = useState('Learning Check-in');
  const [fbText, setFbText] = useState('');
  const [fbPraise, setFbPraise] = useState('');
  const [fbTip, setFbTip] = useState('');
  const [fbSuccessMsg, setFbSuccessMsg] = useState<string | null>(null);

  const isCloudConnected = supabaseService.isConfigured();

  // Load all dashboard records
  const loadData = async () => {
    setLoading(true);

    if (isCloudConnected) {
      const cloudProfiles = await supabaseService.fetchAllProfiles();
      if (cloudProfiles.length > 0) {
        setUsers(cloudProfiles);
      } else {
        setUsers(storage.getUsers());
      }
      const cloudReports = await supabaseService.fetchSafetyReports();
      setReports(cloudReports.length > 0 ? cloudReports : storage.getSafetyReports());
    } else {
      setUsers(storage.getUsers());
      setReports(storage.getSafetyReports());
    }

    const summaries = await teacherService.getStudentProgressSummaries();
    setStudentsSummaries(summaries);

    const clsList = teacherService.getClasses();
    setClasses(clsList);

    const asnList = teacherService.getAssignments();
    setAssignments(asnList);

    const subs = teacherService.getSubmissions();
    setSubmissions(subs);

    const recs = teacherService.getStudentRecordings();
    setRecordings(recs);

    const fb = teacherService.getFeedback();
    setFeedbackList(fb);

    const adjs = teacherService.getStudentAdjustmentRecords();
    setAdjustmentLogs(adjs);

    setTopics(storage.getTopics());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    return () => {
      if (activeAudioElement) {
        activeAudioElement.pause();
      }
    };
  }, [isCloudConnected]);

  const refreshAll = async () => {
    await loadData();
    onRefreshData();
  };

  // Role Gate: Non-teachers cannot see or manage educational dashboard
  if (!currentUser || currentUser.role !== 'teacher' || !currentUser.isApproved) {
    return (
      <div className="bg-white rounded-3xl p-8 border-4 border-purple-400 shadow-xl space-y-6 text-center max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
          <ShieldBan className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900">
            Teacher Administrator Access Required
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            This dashboard contains sensitive student safeguarding records, assignments, curriculum editing, and student portfolios. To access it, you must be signed in with a verified teacher account.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={onOpenAuth}
            className="px-6 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-sm shadow-md"
          >
            Sign In with Teacher Account
          </button>
        </div>
      </div>
    );
  }

  // --- AUDIO CONTROLS FOR SPEAKING RECORDINGS ---
  const handleTogglePlayRecording = (rec: PracticeRecording) => {
    soundEffects.playClick();
    if (activePlayingRecId === rec.id && activeAudioElement) {
      activeAudioElement.pause();
      setActivePlayingRecId(null);
      setActiveAudioElement(null);
      return;
    }

    if (activeAudioElement) {
      activeAudioElement.pause();
    }

    const audio = new Audio(rec.audioUrl);
    audio.playbackRate = audioSpeed;
    audio.onended = () => {
      setActivePlayingRecId(null);
      setActiveAudioElement(null);
    };
    audio.play();
    setActiveAudioElement(audio);
    setActivePlayingRecId(rec.id);
  };

  const handleStopAllAudio = () => {
    if (activeAudioElement) {
      activeAudioElement.pause();
      setActivePlayingRecId(null);
      setActiveAudioElement(null);
    }
  };

  // --- CREATE CLASS ---
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    try {
      soundEffects.playSuccess();
      teacherService.createClass(newClassName, newClassDescription, newClassStudentIds, currentUser);
      setNewClassName('');
      setNewClassDescription('');
      setNewClassStudentIds([]);
      setIsCreatingClass(false);
      refreshAll();
      speechService.announce('Class cohort created successfully.');
    } catch (err: any) {
      soundEffects.playWarning();
      const msg = err?.message || 'Error creating class.';
      setTeacherStatusNotice(msg);
      speechService.announce(msg);
    }
  };

  // --- CREATE ASSIGNMENT ---
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsnTitle.trim() || !newAsnTopicId) return;

    const topicObj = topics.find((t) => t.id === newAsnTopicId);
    const lessonObj = topicObj?.lessons?.find((l) => l.id === newAsnLessonId);

    // Determine target students: class or specific student IDs
    let targetStudents: string[] = [];
    let selectedClassName: string | undefined;

    if (newAsnClassId) {
      const cls = classes.find((c) => c.id === newAsnClassId);
      if (cls) {
        targetStudents = cls.studentIds;
        selectedClassName = cls.name;
      }
    } else {
      targetStudents = newAsnStudentIds;
    }

    if (targetStudents.length === 0) {
      soundEffects.playWarning();
      const msg = 'Please assign to at least one student or select a class cohort.';
      setTeacherStatusNotice(msg);
      speechService.announce(msg);
      return;
    }

    try {
      soundEffects.playSuccess();
      teacherService.createAssignment({
        classId: newAsnClassId || undefined,
        className: selectedClassName,
        teacherId: currentUser.id,
        teacherName: currentUser.name,
        title: newAsnTitle.trim(),
        type: newAsnType,
        topicId: newAsnTopicId,
        topicTitle: topicObj?.title || 'English Practice',
        lessonId: newAsnLessonId || undefined,
        lessonTitle: lessonObj?.title,
        instructions: newAsnInstructions.trim(),
        dueDate: newAsnDueDate || undefined,
        studentIds: targetStudents,
      }, currentUser);

      setNewAsnTitle('');
      setNewAsnInstructions('');
      setNewAsnDueDate('');
      setNewAsnClassId('');
      setNewAsnStudentIds([]);
      setIsCreatingAssignment(false);
      refreshAll();
      speechService.announce('Assignment assigned successfully to students.');
    } catch (err: any) {
      soundEffects.playWarning();
      const msg = err?.message || 'Error creating assignment.';
      setTeacherStatusNotice(msg);
      speechService.announce(msg);
    }
  };

  // --- SUBMIT REVIEW FOR ASSIGNMENT ---
  const handleReviewSubmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingSubmission) return;

    try {
      soundEffects.playSuccess();
      teacherService.reviewSubmission(
        reviewingSubmission.id,
        reviewScore,
        reviewFeedbackText.trim() || `Reviewed by ${currentUser?.name || 'Teacher Bahora'}. Good effort!`,
        currentUser
      );
      setReviewingSubmission(null);
      setReviewFeedbackText('');
      refreshAll();
      speechService.announce('Assignment reviewed and feedback recorded.');
    } catch (err: any) {
      soundEffects.playWarning();
      const msg = err?.message || 'Error saving review.';
      setTeacherStatusNotice(msg);
      speechService.announce(msg);
    }
  };

  // --- SEND DIRECT TEACHER FEEDBACK ---
  const handleSendFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbTargetStudentId || !fbText.trim()) return;

    const studentObj = users.find((u) => u.id === fbTargetStudentId);

    try {
      soundEffects.playSuccess();
      teacherService.sendFeedback({
        studentId: fbTargetStudentId,
        studentName: studentObj?.name || 'Student',
        teacherId: currentUser.id,
        teacherName: currentUser.name,
        targetType: fbTargetType,
        targetId: 'manual-feedback',
        targetTitle: fbTargetTitle.trim() || 'Learning Guidance',
        feedbackText: fbText.trim(),
        praisePoints: fbPraise.trim() || undefined,
        improvementTip: fbTip.trim() || undefined,
      }, currentUser);

      setFbSuccessMsg(`Feedback delivered directly to ${studentObj?.name || 'student'}'s dashboard!`);
      setFbText('');
      setFbPraise('');
      setFbTip('');
      refreshAll();
      setTimeout(() => {
        setFbSuccessMsg(null);
        setIsFeedbackModalOpen(false);
      }, 3000);
    } catch (err: any) {
      soundEffects.playWarning();
      const msg = err?.message || 'Error sending feedback.';
      setTeacherStatusNotice(msg);
      speechService.announce(msg);
    }
  };

  // --- SAFEGUARDS: APPROVALS & MATCHMAKER ---
  const handleApproveUser = async (userId: string, userName: string) => {
    soundEffects.playSuccess();
    if (isCloudConnected) {
      const res = await supabaseService.approveLearner(userId);
      if (!res.success) {
        soundEffects.playWarning();
        speechService.announce(`Approval error: ${res.error}`);
        return;
      }
    } else {
      storage.approveUser(userId);
    }
    speechService.announce(`Approved ${userName}. Student can now safely communicate with their assigned cohort.`);
    await refreshAll();
  };

  const handlePairStudents = async (e: React.FormEvent) => {
    e.preventDefault();
    setMatchmakerError(null);
    setMatchmakerSuccess(null);

    if (!selectedStudent1 || !selectedStudent2) {
      setMatchmakerError('Please select both students to pair.');
      return;
    }
    if (selectedStudent1 === selectedStudent2) {
      setMatchmakerError('Cannot pair a student with themselves.');
      return;
    }

    if (isCloudConnected) {
      const res = await supabaseService.pairLearners(selectedStudent1, selectedStudent2);
      if (!res.success) {
        soundEffects.playTone(300, 0.2, 'sawtooth');
        setMatchmakerError(res.error || 'Failed to pair students in cloud database.');
        speechService.announce(`Pairing blocked: ${res.error}`);
      } else {
        soundEffects.playSuccess();
        setMatchmakerSuccess('Students paired successfully in cloud database with age-appropriate safeguard checks verified!');
        speechService.announce('Students paired successfully.');
        setSelectedStudent1('');
        setSelectedStudent2('');
        await refreshAll();
      }
    } else {
      const res = storage.pairStudents(selectedStudent1, selectedStudent2);
      if (!res.success) {
        soundEffects.playTone(300, 0.2, 'sawtooth');
        setMatchmakerError(res.error || 'Failed to pair students.');
        speechService.announce(`Pairing blocked: ${res.error}`);
      } else {
        soundEffects.playSuccess();
        setMatchmakerSuccess('Students paired successfully with age-appropriate safeguard checks verified!');
        speechService.announce('Students paired successfully.');
        setSelectedStudent1('');
        setSelectedStudent2('');
        await refreshAll();
      }
    }
  };

  const handleUnpair = async (studentId: string) => {
    soundEffects.playClick();
    if (isCloudConnected) {
      await supabaseService.unpairLearner(studentId);
    } else {
      storage.unpairStudent(studentId);
    }
    await refreshAll();
  };

  const handleResolveReport = async (reportId: string) => {
    soundEffects.playSuccess();
    if (isCloudConnected) {
      await supabaseService.resolveReport(reportId, `Reviewed and resolved by ${currentUser?.name || 'Teacher Bahora'} in Supabase.`);
    } else {
      storage.resolveReport(reportId, `Reviewed and resolved by ${currentUser?.name || 'Teacher Bahora'}. Safety verified.`);
    }
    speechService.announce('Safety report resolved.');
    await refreshAll();
  };

  const pendingUsers = users.filter((u) => !u.isApproved && u.role === 'student');
  const activeStudents = users.filter((u) => u.isApproved && u.role === 'student');

  // Filter students assigned to Teacher Bahora's class
  const teacherId = currentUser?.id || 'teacher-bahora';
  const assignedClass = classes.find(
    (c) => c.teacherId === teacherId || c.teacherName.toLowerCase().includes('bahora')
  ) || classes[0];

  const assignedStudentIds = new Set<string>(assignedClass ? assignedClass.studentIds : []);
  const assignedSummaries = studentsSummaries.filter((sum) => assignedStudentIds.has(sum.student.id));

  // Filtered students for My Students tab
  const filteredSummaries = assignedSummaries.filter((sum) => {
    const matchesSearch = sum.student.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
                          sum.student.email.toLowerCase().includes(studentSearchQuery.toLowerCase());
    return matchesSearch;
  });

  const unreadStudentMessagesCount = messagingService.getUnreadCountForUser(currentUser.id);

  // Filtered recordings
  const filteredRecordings = recordings.filter((r) => {
    const matchesSearch = r.studentName.toLowerCase().includes(recordingSearchQuery.toLowerCase()) ||
                          r.topicTitle.toLowerCase().includes(recordingSearchQuery.toLowerCase());
    const matchesTopic = selectedTopicFilter === 'all' || r.topicId === selectedTopicFilter;
    return matchesSearch && matchesTopic;
  });

  // Students needing additional support (score < 60% or 0 completed lessons)
  const studentsNeedingSupport = studentsSummaries.filter(
    (s) => (s.testAttemptsCount > 0 && s.averageTestScore < 65) || (s.completedLessonsCount === 0)
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Teacher Dashboard Header */}
      <section 
        className="rounded-3xl bg-linear-to-r from-purple-900 via-indigo-900 to-blue-900 text-white p-6 md:p-8 border-4 border-purple-600 shadow-xl"
        aria-labelledby="dashboard-title"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-800 text-purple-200 text-xs font-black">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Teacher Bahora's Administration & Management Desk</span>
            </div>
            <h1 id="dashboard-title" className="text-3xl md:text-4xl font-black tracking-tight">
              Welcome, Teacher Bahora
            </h1>
            <p className="text-sm md:text-base text-purple-100 max-w-3xl font-medium">
              Monitor your enrolled students' genuine progress, exchange private text and voice messages, review speaking recordings, edit curriculum live, and manage class cohorts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Prominent Required Button: MY STUDENTS — VIEW PROGRESS */}
            <button
              onClick={() => {
                soundEffects.playClick();
                handleStopAllAudio();
                setActiveTab('students');
                speechService.announce('Opening My Students view.');
              }}
              className="flex items-center gap-2 bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 py-3 px-5 rounded-2xl text-xs md:text-sm font-black text-amber-950 shrink-0 shadow-xl border-2 border-amber-300 focus:ring-4 focus:ring-amber-300 transition-transform active:scale-95 cursor-pointer"
              aria-label="MY STUDENTS — VIEW PROGRESS: View all students assigned to Teacher Bahora"
            >
              <Users className="w-5 h-5 text-amber-950" />
              <span>MY STUDENTS — VIEW PROGRESS</span>
            </button>

            {/* Prominent Quick Button: Student Messages */}
            <button
              onClick={() => {
                soundEffects.playClick();
                handleStopAllAudio();
                setActiveTab('messages');
                speechService.announce('Opening Student Messages.');
              }}
              className="flex items-center gap-2 bg-purple-800 hover:bg-purple-700 py-3 px-4 rounded-2xl border-2 border-purple-400 text-xs font-black text-white shrink-0 shadow-md cursor-pointer relative"
              aria-label="Student Messages: View student inquiries and audio notes"
            >
              <MessageSquare className="w-4 h-4 text-purple-200" />
              <span>Student Messages</span>
              {unreadStudentMessagesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black animate-pulse">
                  {unreadStudentMessagesCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2 bg-purple-950/80 p-3 rounded-2xl border border-purple-700 text-xs font-bold shrink-0">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Role: Verified Educator ({currentUser?.name?.toUpperCase() || 'BAHORA'})</span>
            </div>

            {onOpenSupabaseConfig && (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onOpenSupabaseConfig();
                }}
                className="flex items-center gap-2 bg-emerald-900/80 hover:bg-emerald-800 p-3 rounded-2xl border border-emerald-500 text-xs font-bold text-white shrink-0 transition-colors shadow-sm focus:ring-4 focus:ring-emerald-400 cursor-pointer"
                aria-label="Teacher Admin: Configure Supabase Database"
              >
                <Database className="w-4 h-4 text-emerald-300" />
                <span>{isCloudConnected ? 'Cloud DB Active' : 'Supabase Setup'}</span>
              </button>
            )}

            <button
              onClick={() => {
                soundEffects.playClick();
                setIsFeedbackModalOpen(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 p-3 rounded-2xl text-xs font-black text-white shrink-0 shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Feedback</span>
            </button>
          </div>
        </div>
      </section>

      {/* Teacher Status Notice Banner if any */}
      {teacherStatusNotice && (
        <div className="bg-amber-100 text-amber-950 border-2 border-amber-300 p-4 rounded-2xl flex items-center justify-between text-xs font-bold" role="status">
          <span>ℹ️ {teacherStatusNotice}</span>
          <button onClick={() => setTeacherStatusNotice(null)} className="underline ml-3 font-black">Dismiss</button>
        </div>
      )}

      {/* Simplified Tabs Navigation (6 Core Sections) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin" role="tablist" aria-label="Teacher dashboard views">
        <button
          onClick={() => {
            soundEffects.playClick();
            handleStopAllAudio();
            setActiveTab('students');
          }}
          role="tab"
          aria-selected={activeTab === 'students'}
          className={`px-4 py-3 rounded-2xl font-black text-xs md:text-sm transition-all border-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'students'
              ? 'bg-purple-800 text-white border-purple-900 shadow-md'
              : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4 text-purple-400" />
          <span>1. My Students ({assignedSummaries.length})</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            handleStopAllAudio();
            setActiveTab('achievements');
          }}
          role="tab"
          aria-selected={activeTab === 'achievements'}
          className={`px-4 py-3 rounded-2xl font-black text-xs md:text-sm transition-all border-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'achievements'
              ? 'bg-purple-800 text-white border-purple-900 shadow-md'
              : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>2. Student Progress</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            handleStopAllAudio();
            setActiveTab('messages');
          }}
          role="tab"
          aria-selected={activeTab === 'messages'}
          className={`px-4 py-3 rounded-2xl font-black text-xs md:text-sm transition-all border-2 flex items-center gap-2 whitespace-nowrap cursor-pointer relative ${
            activeTab === 'messages'
              ? 'bg-purple-800 text-white border-purple-900 shadow-md'
              : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <span>3. Student Messages</span>
          {unreadStudentMessagesCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white">
              {unreadStudentMessagesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('recordings');
          }}
          role="tab"
          aria-selected={activeTab === 'recordings'}
          className={`px-4 py-3 rounded-2xl font-black text-xs md:text-sm transition-all border-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'recordings'
              ? 'bg-purple-800 text-white border-purple-900 shadow-md'
              : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Mic className="w-4 h-4 text-rose-400" />
          <span>4. Speaking Recordings ({recordings.length})</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            handleStopAllAudio();
            setActiveTab('curriculum');
          }}
          role="tab"
          aria-selected={activeTab === 'curriculum'}
          className={`px-4 py-3 rounded-2xl font-black text-xs md:text-sm transition-all border-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'curriculum'
              ? 'bg-purple-800 text-white border-purple-900 shadow-md'
              : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>5. Manage Lessons ({topics.length})</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            handleStopAllAudio();
            setActiveTab('settings');
          }}
          role="tab"
          aria-selected={activeTab === 'settings'}
          className={`px-4 py-3 rounded-2xl font-black text-xs md:text-sm transition-all border-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-purple-800 text-white border-purple-900 shadow-md'
              : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>6. Teacher Settings</span>
          {(pendingUsers.length + reports.filter((r) => r.status === 'pending').length > 0) && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
              {pendingUsers.length + reports.filter((r) => r.status === 'pending').length}
            </span>
          )}
        </button>
      </div>


      {/* =========================================================================
          TAB 1: MY STUDENTS (Student List, Progress %, Portfolio Modal)
         ========================================================================= */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Teacher Bahora's Enrolled Students ({assignedSummaries.length})
                </h2>
                <p className="text-sm text-slate-600">
                  Individual student lesson completion, topic mastery, test score averages, audio practice recordings, and badges. Click any student name to open their full progress portfolio.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setIsEnrollModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                  aria-label="Enroll or manage class students"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Enroll Students</span>
                </button>

                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search enrolled students..."
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:border-purple-600 bg-white"
                  />
                </div>
              </div>
            </div>

            {assignedSummaries.length === 0 ? (
              <div className="p-8 md:p-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-purple-300 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  No students are assigned to your class yet.
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Enroll existing approved students into Teacher Bahora's class cohort to begin tracking their lesson completions, test scores, speaking recordings, and earned badges.
                </p>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setIsEnrollModalOpen(true);
                  }}
                  className="py-3 px-6 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-sm inline-flex items-center gap-2 shadow-md cursor-pointer"
                  aria-label="Enroll existing students into Teacher Bahora's class"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Enroll Students into Class</span>
                </button>
              </div>
            ) : filteredSummaries.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-bold bg-slate-50 rounded-2xl">
                No students match your search criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSummaries.map((sum) => (
                  <div
                    key={sum.student.id}
                    className="p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-purple-300 transition-all shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl ${sum.student.avatarColor || 'bg-blue-600'} text-white flex items-center justify-center font-black text-lg shadow-xs`}>
                            {sum.student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              {/* Clickable student name opens progress report */}
                              <button
                                onClick={() => {
                                  soundEffects.playClick();
                                  setSelectedStudentForProfile(sum.student);
                                  setSelectedStudentSummary(sum);
                                }}
                                className="font-black text-slate-900 text-base hover:text-purple-700 hover:underline text-left cursor-pointer flex items-center gap-1"
                                aria-label={`Open progress report for ${sum.student.name}`}
                              >
                                <span>{sum.student.name}</span>
                                <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
                              </button>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-black uppercase">
                                {sum.student.ageGroup}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500 font-medium block">
                              Vision: {sum.student.visionPreference}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            setAdjustmentStudent(sum.student);
                            setAdjustmentBalance(sum.coinsBalance);
                          }}
                          className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1"
                          title="Administrative Adjustment for Coins"
                        >
                          <Coins className="w-3.5 h-3.5 text-amber-600" />
                          <span>Adjust</span>
                        </button>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-600">Curriculum Progress:</span>
                          <span className="font-black text-purple-700">{sum.progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                          <div 
                            className="bg-purple-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${sum.progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Metrics Badges: All Required Fields */}
                      <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Completed Lessons</span>
                          <strong className="text-slate-900 font-black">{sum.completedLessonsCount} / {sum.totalLessonsCount}</strong>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Completed Topics</span>
                          <strong className="text-emerald-800 font-black">{sum.completedTopicIds.length} / {sum.totalTopicsCount}</strong>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">English Coins</span>
                          <strong className="text-amber-700 font-black flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5" />
                            {sum.coinsBalance}
                          </strong>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Earned Badges</span>
                          <strong className="text-purple-700 font-black flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" />
                            {sum.earnedBadgesCount}
                          </strong>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Test Scores</span>
                          <strong className={`font-black ${sum.averageTestScore >= 70 ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {sum.testAttemptsCount > 0 ? `${sum.averageTestScore}% (${sum.testAttemptsCount} test${sum.testAttemptsCount > 1 ? 's' : ''})` : 'N/A'}
                          </strong>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Speaking Recordings</span>
                          <strong className="text-rose-700 font-black flex items-center gap-1">
                            <Mic className="w-3.5 h-3.5" />
                            {sum.recordingsCount}
                          </strong>
                        </div>
                      </div>

                      {/* Last Learning Activity */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Last Activity:</span>
                        </span>
                        <strong className="text-slate-800 font-bold">
                          {new Date(sum.lastActiveAt).toLocaleDateString()}
                        </strong>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        setSelectedStudentForProfile(sum.student);
                        setSelectedStudentSummary(sum);
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-black text-xs flex items-center justify-center gap-1.5 border border-purple-200 cursor-pointer"
                      aria-label={`Open complete progress report and portfolio for ${sum.student.name}`}
                    >
                      <span>Open Individual Progress Report</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: MANAGE CURRICULUM (CurriculumEditorTab)
         ========================================================================= */}
      {activeTab === 'curriculum' && (
        <CurriculumEditorTab 
          currentUser={currentUser}
          onCurriculumUpdated={refreshAll}
        />
      )}

      {/* =========================================================================
          TAB 3: STUDENT ACHIEVEMENTS (Badges, Coins, Support Alerts, Audit)
         ========================================================================= */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          {/* Support Alerts Banner */}
          {studentsNeedingSupport.length > 0 && (
            <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-base">Students Needing Additional Educational Support ({studentsNeedingSupport.length})</h3>
              </div>
              <p className="text-xs text-amber-900">
                The system detected students with low test scores (&lt;65%) or unfinished starter lessons. Review their work and send encouraging guidance.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {studentsNeedingSupport.map((st) => (
                  <span key={st.student.id} className="px-3 py-1 rounded-full bg-white border border-amber-400 font-bold text-xs text-amber-900 shadow-2xs">
                    {st.student.name} ({st.completedLessonsCount} lessons completed, Avg score: {st.averageTestScore}%)
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Achievements Matrix */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Student Badges, Coins & Mastery Achievements
                </h2>
                <p className="text-sm text-slate-600">
                  Review earned milestones across the curriculum. Teachers can make auditable coin adjustments if justified.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 bg-slate-50 text-slate-700 font-black uppercase">
                    <th className="p-3">Student</th>
                    <th className="p-3">Coins Balance</th>
                    <th className="p-3">Badges Earned</th>
                    <th className="p-3">Topics Mastered</th>
                    <th className="p-3">Unfinished Activities</th>
                    <th className="p-3">Support Status</th>
                    <th className="p-3 text-right">Audit Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {studentsSummaries.map((sum) => {
                    const needsSupport = (sum.testAttemptsCount > 0 && sum.averageTestScore < 65) || (sum.completedLessonsCount === 0);
                    return (
                      <tr key={sum.student.id} className="hover:bg-slate-50">
                        <td className="p-3 font-black text-slate-900 flex items-center gap-2">
                          <span className={`w-7 h-7 rounded-lg ${sum.student.avatarColor || 'bg-blue-600'} text-white flex items-center justify-center font-bold text-xs`}>
                            {sum.student.name.charAt(0)}
                          </span>
                          <span>{sum.student.name}</span>
                        </td>
                        <td className="p-3 text-amber-700 font-black">
                          <span className="flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5" />
                            {sum.coinsBalance}
                          </span>
                        </td>
                        <td className="p-3 text-purple-700 font-black">
                          <span className="flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" />
                            {sum.earnedBadgesCount} Badges
                          </span>
                        </td>
                        <td className="p-3 text-emerald-800 font-bold">
                          {sum.completedTopicIds.length} of 20 Topics
                        </td>
                        <td className="p-3 text-slate-600">
                          {Math.max(0, sum.totalLessonsCount - sum.completedLessonsCount)} lessons remaining
                        </td>
                        <td className="p-3">
                          {needsSupport ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                              Needs Support
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                              On Track
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              soundEffects.playClick();
                              setAdjustmentStudent(sum.student);
                              setAdjustmentBalance(sum.coinsBalance);
                            }}
                            className="px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs"
                          >
                            Adjust Coins
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Auditable Corrections History */}
            <div className="pt-6 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <h3 className="text-base font-black text-slate-900">
                  Administrative Adjustment Audit Trail ({adjustmentLogs.length})
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                All teacher corrections are permanently recorded with mandatory recorded reasons to prevent arbitrary coin generation.
              </p>

              {adjustmentLogs.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 text-slate-500 text-xs italic">
                  No administrative adjustments logged yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {adjustmentLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-3">
                      <div>
                        <strong className="text-slate-900">{log.studentName}</strong>: {log.coinAdjustment >= 0 ? `+${log.coinAdjustment}` : log.coinAdjustment} coins.
                        <span className="text-slate-600 italic block">Reason: "{log.reason}"</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {new Date(log.timestamp).toLocaleDateString()} by {log.teacherName}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: STUDENT MESSAGES (TeacherMessagesTab: Inquiries, Voice Play/Record)
         ========================================================================= */}
      {activeTab === 'messages' && currentUser && (
        <TeacherMessagesTab
          currentUser={currentUser}
          students={users.filter((u) => u.role === 'student')}
          onRefresh={refreshAll}
        />
      )}

      {/* =========================================================================
          TAB 4: STUDENT ASSIGNMENTS (Classes, Create Assignment, Submissions)
         ========================================================================= */}
      {(activeTab === 'assignments' || (activeTab === 'settings' && settingsSection === 'assignments')) && (
        <div className="space-y-6">
          {/* Header & Create Button */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Class & Student Assignment Manager
                </h2>
                <p className="text-sm text-slate-600">
                  Assign lessons, quizzes, or speaking activities with optional deadlines, and review student submissions.
                </p>
              </div>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setIsCreatingAssignment(!isCreatingAssignment);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs md:text-sm flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isCreatingAssignment ? 'Cancel' : 'Create New Assignment'}</span>
              </button>
            </div>

            {/* Create Assignment Form */}
            {isCreatingAssignment && (
              <form onSubmit={handleCreateAssignment} className="p-6 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 space-y-4 animate-in fade-in">
                <h3 className="text-base font-black text-emerald-950">New Educational Assignment</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-black uppercase text-slate-700 block">Assignment Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Master Food Vocabulary & Take Quiz"
                      value={newAsnTitle}
                      onChange={(e) => setNewAsnTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-700 block">Topic *</label>
                    <select
                      value={newAsnTopicId}
                      onChange={(e) => {
                        setNewAsnTopicId(e.target.value);
                        setNewAsnLessonId('');
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                    >
                      {topics.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-700 block">Lesson (Optional)</label>
                    <select
                      value={newAsnLessonId}
                      onChange={(e) => setNewAsnLessonId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                    >
                      <option value="">-- Whole Topic / General --</option>
                      {topics.find((t) => t.id === newAsnTopicId)?.lessons?.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-700 block">Assign to Cohort Class</label>
                    <select
                      value={newAsnClassId}
                      onChange={(e) => setNewAsnClassId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                    >
                      <option value="">-- Choose Individual Students Below --</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.studentIds.length} students)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-700 block">Optional Due Date</label>
                    <input
                      type="date"
                      value={newAsnDueDate}
                      onChange={(e) => setNewAsnDueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                    />
                  </div>

                  {!newAsnClassId && (
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-black uppercase text-slate-700 block mb-1">Select Specific Students:</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {activeStudents.map((st) => (
                          <label key={st.id} className="p-2 rounded-xl bg-white border border-slate-300 flex items-center gap-2 text-xs font-bold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newAsnStudentIds.includes(st.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewAsnStudentIds([...newAsnStudentIds, st.id]);
                                } else {
                                  setNewAsnStudentIds(newAsnStudentIds.filter((id) => id !== st.id));
                                }
                              }}
                            />
                            <span>{st.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-black uppercase text-slate-700 block">Instructions for Students</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Listen carefully to English vocabulary and complete the comprehension practice."
                      value={newAsnInstructions}
                      onChange={(e) => setNewAsnInstructions(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingAssignment(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-xs"
                  >
                    Publish Assignment Live
                  </button>
                </div>
              </form>
            )}

            {/* Assignments List */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900">Active Course Assignments</h3>
              {assignments.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-bold bg-slate-50 rounded-2xl">
                  No assignments created yet. Click "Create New Assignment" above.
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments.map((asn) => {
                    const asnSubs = submissions.filter((s) => s.assignmentId === asn.id);
                    const completedSubs = asnSubs.filter((s) => s.status === 'completed' || s.status === 'reviewed');
                    return (
                      <div key={asn.id} className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-black text-slate-900">{asn.title}</h4>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-900">
                                {asn.type.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">
                              Topic: <strong>{asn.topicTitle}</strong> {asn.lessonTitle ? `• ${asn.lessonTitle}` : ''} • Cohort: {asn.className || 'Selected Students'}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {asn.dueDate && (
                              <span className="text-xs text-amber-800 font-bold bg-amber-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                Due: {asn.dueDate}
                              </span>
                            )}
                            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900">
                              {completedSubs.length} of {asn.studentIds.length} Submitted
                            </span>

                            <button
                              onClick={() => {
                                soundEffects.playClick();
                                setEditingAssignment(asn);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center gap-1 border border-slate-300 shadow-2xs cursor-pointer"
                              aria-label={`Edit assignment ${asn.title}`}
                            >
                              <Settings className="w-3.5 h-3.5 text-slate-600" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => {
                                soundEffects.playWarning();
                                teacherService.deleteAssignment(asn.id, currentUser);
                                refreshAll();
                                speechService.announce(`Assignment ${asn.title} deleted.`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs flex items-center gap-1 border border-rose-200 cursor-pointer"
                              aria-label={`Delete assignment ${asn.title}`}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>

                        {asn.instructions && (
                          <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                            <strong>Instructions:</strong> {asn.instructions}
                          </p>
                        )}

                        {/* Submissions Roster */}
                        <div className="pt-2">
                          <span className="text-[11px] font-black uppercase text-slate-500 block mb-1.5">Student Submissions:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {asn.studentIds.map((sId) => {
                              const sub = asnSubs.find((s) => s.studentId === sId);
                              const student = users.find((u) => u.id === sId);
                              const status = sub?.status || 'assigned';
                              return (
                                <div key={sId} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2 text-xs">
                                  <div className="truncate">
                                    <strong className="block truncate text-slate-900">{student?.name || sId}</strong>
                                    <span className={`text-[10px] font-bold ${
                                      status === 'reviewed' ? 'text-purple-700' :
                                      status === 'completed' ? 'text-emerald-700' : 'text-slate-400'
                                    }`}>
                                      Status: {status.toUpperCase()} {sub?.score !== undefined ? `(${sub.score}%)` : ''}
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => {
                                      soundEffects.playClick();
                                      setReviewingSubmission(sub || {
                                        id: `sub-${asn.id}-${sId}`,
                                        assignmentId: asn.id,
                                        studentId: sId,
                                        studentName: student?.name || 'Student',
                                        status: 'assigned',
                                      });
                                      setReviewScore(sub?.score || 95);
                                      setReviewFeedbackText(sub?.teacherFeedback || '');
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-[11px] border border-purple-200"
                                  >
                                    Review
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: SPEAKING RECORDINGS (Review Audio, Evaluations, Play/Stop, Feedback)
         ========================================================================= */}
      {activeTab === 'recordings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Student Speaking Recordings Desk
                </h2>
                <p className="text-sm text-slate-600">
                  Listen to genuine learner audio recordings with secure Play/Stop controls, review AI scores, and record teacher feedback.
                </p>
              </div>

              {/* Speed & Search Controls */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-300">
                  <span className="px-2 text-slate-500">Speed:</span>
                  {[0.8, 1.0, 1.2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => {
                        setAudioSpeed(spd);
                        if (activeAudioElement) activeAudioElement.playbackRate = spd;
                      }}
                      className={`px-2 py-1 rounded-lg font-bold text-xs ${
                        audioSpeed === spd ? 'bg-purple-700 text-white' : 'text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                <div className="relative flex-1 sm:w-48">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by student..."
                    value={recordingSearchQuery}
                    onChange={(e) => setRecordingSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {filteredRecordings.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-bold bg-slate-50 rounded-2xl">
                No speaking recordings found.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecordings.map((rec) => {
                  const isPlaying = activePlayingRecId === rec.id;
                  return (
                    <div
                      key={rec.id}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        isPlaying ? 'border-purple-600 bg-purple-50/50 shadow-md' : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-slate-900">{rec.studentName}</h3>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold">
                              {rec.topicTitle}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Prompt: "{rec.questionText}" • Recorded: {new Date(rec.submittedAt).toLocaleString()}
                          </p>
                        </div>

                        {/* Audio Play/Stop Button */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTogglePlayRecording(rec)}
                            className={`px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer ${
                              isPlaying
                                ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-200'
                                : 'bg-purple-700 hover:bg-purple-800 text-white'
                            }`}
                          >
                            {isPlaying ? (
                              <>
                                <Square className="w-4 h-4 fill-white" />
                                <span>Stop Audio</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 fill-white" />
                                <span>Play Recording ({rec.durationSeconds}s)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Evaluation Breakdown */}
                      {rec.evaluation ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                          <div className="md:col-span-2 space-y-3">
                            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                              <span className="text-[11px] font-bold uppercase text-slate-500">Student Speech Transcript:</span>
                              <p className="text-sm font-semibold text-slate-900 italic">
                                "{rec.evaluation.transcript}"
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                                <strong className="text-emerald-950 font-black block mb-0.5">Strengths (Positive Feedback):</strong>
                                <p className="text-emerald-900">{rec.evaluation.positiveFeedback}</p>
                                {rec.evaluation.uzbekFeedback && (
                                  <p className="text-emerald-800 text-[11px] italic mt-1 font-medium">Uzbek: {rec.evaluation.uzbekFeedback}</p>
                                )}
                              </div>
                              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                                <strong className="text-amber-950 font-black block mb-0.5">Gentle Correction:</strong>
                                <p className="text-amber-900">{rec.evaluation.gentleCorrection}</p>
                                {rec.evaluation.uzbekCorrection && (
                                  <p className="text-amber-800 text-[11px] italic mt-1 font-medium">Uzbek: {rec.evaluation.uzbekCorrection}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                              <span className="font-bold text-slate-600 block uppercase text-[10px]">Speech Scores:</span>
                              <div className="flex justify-between items-center">
                                <span>Clarity:</span>
                                <strong className="text-purple-700 font-black">{rec.evaluation.clarityScore} / 5</strong>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Grammar:</span>
                                <strong className="text-blue-700 font-black">{rec.evaluation.grammarScore} / 5</strong>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Relevance:</span>
                                <strong className="text-emerald-700 font-black">{rec.evaluation.relevanceScore} / 5</strong>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                soundEffects.playClick();
                                setFbTargetStudentId(rec.studentId);
                                setFbTargetType('recording');
                                setFbTargetTitle(`Feedback on ${rec.topicTitle}`);
                                setFbPraise(rec.evaluation?.positiveFeedback || '');
                                setFbTip(rec.evaluation?.nextPracticeTip || '');
                                setIsFeedbackModalOpen(true);
                              }}
                              className="w-full py-2 px-3 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold text-xs flex items-center justify-center gap-1 border border-purple-300"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Leave Teacher Feedback</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic pt-2">No AI evaluation metadata attached to this recording.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: TEST RESULTS (Test attempts, Scores, Questions)
         ========================================================================= */}
      {activeTab === 'tests' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                End-of-Topic Test Results & Analysis
              </h2>
              <p className="text-sm text-slate-600">
                Review quiz assessments across all 20 topics. Passing requirement is 80% with verified speaking completion.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                <span className="text-xs font-bold text-purple-800 uppercase">Total Tests Taken</span>
                <p className="text-2xl font-black text-purple-950 mt-1">
                  {studentsSummaries.reduce((acc, s) => acc + s.testAttemptsCount, 0)}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 uppercase">Average Mastery Score</span>
                <p className="text-2xl font-black text-emerald-950 mt-1">
                  {Math.round(
                    studentsSummaries.filter(s => s.testAttemptsCount > 0).reduce((acc, s) => acc + s.averageTestScore, 0) /
                    Math.max(1, studentsSummaries.filter(s => s.testAttemptsCount > 0).length)
                  )}%
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                <span className="text-xs font-bold text-blue-800 uppercase">Mastery Badges Awarded</span>
                <p className="text-2xl font-black text-blue-950 mt-1">
                  {studentsSummaries.reduce((acc, s) => acc + s.earnedBadgesCount, 0)}
                </p>
              </div>
            </div>

            {/* Test attempts list */}
            <div className="space-y-3">
              <h3 className="text-lg font-black text-slate-900">Recent Student Test Submissions</h3>
              <div className="space-y-3">
                {studentsSummaries.map((sum) => {
                  return (
                    <div key={sum.student.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-base text-slate-900 font-black">{sum.student.name}</strong>
                          <span className="text-xs text-slate-500">({sum.student.email})</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Tests Taken: <strong>{sum.testAttemptsCount}</strong> • Average Score: <strong>{sum.averageTestScore}%</strong> • Mastered Topics: {sum.completedTopicIds.join(', ') || 'None'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            setSelectedStudentForProfile(sum.student);
                            setSelectedStudentSummary(sum);
                          }}
                          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-900 font-bold text-xs"
                        >
                          View Test History
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: TEACHER FEEDBACK HUB (History & Sent Guidance)
         ========================================================================= */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Teacher Feedback & Guidance Hub
                </h2>
                <p className="text-sm text-slate-600">
                  Written notes, praise points, and pronunciation tips sent directly to students.
                </p>
              </div>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setIsFeedbackModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs md:text-sm flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Compose New Feedback</span>
              </button>
            </div>

            {feedbackList.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-bold bg-slate-50 rounded-2xl">
                No feedback sent yet. Click "Compose New Feedback" above to encourage your learners!
              </div>
            ) : (
              <div className="space-y-3">
                {feedbackList.map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <strong className="text-base text-slate-900 font-black">{item.studentName}</strong>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 uppercase">
                          {item.targetType}
                        </span>
                        <span className="text-xs text-slate-600 font-bold">"{item.targetTitle}"</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          item.isReadByStudent ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.isReadByStudent ? 'Read by Student' : 'Unread'}
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-800 font-medium bg-white p-3 rounded-xl border border-slate-200">
                      {item.feedbackText}
                    </p>

                    {(item.praisePoints || item.improvementTip) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        {item.praisePoints && (
                          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-950 border border-emerald-200">
                            <strong>Praise:</strong> {item.praisePoints}
                          </div>
                        )}
                        {item.improvementTip && (
                          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-950 border border-indigo-200">
                            <strong>Tip for next time:</strong> {item.improvementTip}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: TEACHER SETTINGS SUB-NAVIGATION HEADER
         ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Teacher Administration & Settings
              </h2>
              <p className="text-xs text-slate-600">
                Manage student cohorts, optional course assignments, safety approvals, and cloud database connectivity.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-purple-100 text-purple-900 font-bold text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-700" />
                <span>Verified Teacher: {currentUser?.name || 'Teacher Bahora'}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4" role="tablist" aria-label="Teacher settings sections">
            <button
              onClick={() => {
                soundEffects.playClick();
                setSettingsSection('roster');
              }}
              role="tab"
              aria-selected={settingsSection === 'roster'}
              className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer border-2 ${
                settingsSection === 'roster'
                  ? 'bg-purple-800 text-white border-purple-900 shadow-xs'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>1. Class Cohorts & Roster ({classes.length})</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                setSettingsSection('assignments');
              }}
              role="tab"
              aria-selected={settingsSection === 'assignments'}
              className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer border-2 ${
                settingsSection === 'assignments'
                  ? 'bg-purple-800 text-white border-purple-900 shadow-xs'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>2. Course Assignments ({assignments.length})</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                setSettingsSection('safeguards');
              }}
              role="tab"
              aria-selected={settingsSection === 'safeguards'}
              className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer border-2 ${
                settingsSection === 'safeguards'
                  ? 'bg-purple-800 text-white border-purple-900 shadow-xs'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>3. Safeguards & Approvals</span>
              {(pendingUsers.length + reports.filter((r) => r.status === 'pending').length > 0) && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                  {pendingUsers.length + reports.filter((r) => r.status === 'pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                setSettingsSection('profile');
              }}
              role="tab"
              aria-selected={settingsSection === 'profile'}
              className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer border-2 ${
                settingsSection === 'profile'
                  ? 'bg-purple-800 text-white border-purple-900 shadow-xs'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>4. Teacher Account & Cloud Sync</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          ROSTER SUB-SECTION (Classes list, Rosters, Create Class, Enroll Students)
         ========================================================================= */}
      {(activeTab === 'classes' || (activeTab === 'settings' && settingsSection === 'roster')) && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Class Cohorts & Collective Progress
                </h2>
                <p className="text-sm text-slate-600">
                  Organize students into classes, track group completion rates, and manage class enrollments.
                </p>
              </div>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setIsCreatingClass(!isCreatingClass);
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs md:text-sm flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isCreatingClass ? 'Cancel' : 'Create New Class'}</span>
              </button>
            </div>

            {/* Create Class Form */}
            {isCreatingClass && (
              <form onSubmit={handleCreateClass} className="p-6 rounded-2xl bg-purple-50/70 border-2 border-purple-300 space-y-4 animate-in fade-in">
                <h3 className="text-base font-black text-purple-950">Create New Class Cohort</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-700 block">Class Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Intermediate Adults Cohort B"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-700 block">Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Focus on everyday practical speaking"
                      value={newClassDescription}
                      onChange={(e) => setNewClassDescription(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-black uppercase text-slate-700 block mb-1">Enroll Students:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {activeStudents.map((st) => (
                        <label key={st.id} className="p-2 rounded-xl bg-white border border-slate-300 flex items-center gap-2 text-xs font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newClassStudentIds.includes(st.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewClassStudentIds([...newClassStudentIds, st.id]);
                              } else {
                                setNewClassStudentIds(newClassStudentIds.filter((id) => id !== st.id));
                              }
                            }}
                          />
                          <span>{st.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingClass(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-xs"
                  >
                    Save & Create Class
                  </button>
                </div>
              </form>
            )}

            {/* Classes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.map((cls) => {
                const enrolledSummaries = studentsSummaries.filter((s) => cls.studentIds.includes(s.student.id));
                const avgProgress = enrolledSummaries.length > 0
                  ? Math.round(enrolledSummaries.reduce((acc, s) => acc + s.progressPercentage, 0) / enrolledSummaries.length)
                  : 0;

                return (
                  <div key={cls.id} className="p-6 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-black text-slate-900">{cls.name}</h3>
                        <p className="text-xs text-slate-600 mt-0.5">{cls.description || 'General English Cohort'}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-black">
                        {cls.studentIds.length} Students
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-600">Cohort Average Progress:</span>
                        <strong className="text-purple-700 font-black">{avgProgress}%</strong>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-600 h-full rounded-full" style={{ width: `${avgProgress}%` }} />
                      </div>
                    </div>

                    {/* Student Chips */}
                    <div>
                      <span className="text-[11px] font-black uppercase text-slate-500 block mb-1">Roster:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {cls.studentIds.map((sId) => {
                          const st = users.find((u) => u.id === sId);
                          return (
                            <span key={sId} className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-800">
                              {st?.name || sId}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 9: SAFEGUARDS & SAFETY REPORTS (Approvals, Matchmaker, Safety Desk)
         ========================================================================= */}
      {(activeTab === 'safeguards' || (activeTab === 'settings' && settingsSection === 'safeguards')) && (
        <div className="space-y-6">
          {/* Safeguarding Alert Card */}
          <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex items-start gap-3">
            <Lock className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
            <div className="text-xs md:text-sm text-indigo-950 space-y-1">
              <strong className="block text-indigo-900 font-black">Strict Child Safeguarding Rules Active</strong>
              <p>
                Learners under 18 can only be approved and paired with other verified minors. Adult learners are kept in separate adult cohorts.
              </p>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-black text-slate-900">
              New Learner Registrations Awaiting Review ({pendingUsers.length})
            </h2>

            {pendingUsers.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 text-center text-slate-500 font-bold">
                All registered students have been reviewed and approved!
              </div>
            ) : (
              <div className="space-y-3" role="list" aria-label="Pending learners">
                {pendingUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    role="listitem"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-slate-900">{user.name}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-200 text-amber-900">
                          {user.ageGroup.toUpperCase()} (Age {user.age || 'N/A'})
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
                          {user.visionPreference}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Email: {user.email} • Native Language: {user.nativeLanguage || 'Beginner'}
                      </p>
                      {user.bioText && (
                        <p className="text-xs text-slate-800 italic">"{user.bioText}"</p>
                      )}
                    </div>

                    <button
                      onClick={() => handleApproveUser(user.id, user.name)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm flex items-center gap-2 shadow-xs cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Approve Learner</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Safe Partner Matchmaker */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-slate-900">
              Safe Speaking Partner Matchmaker
            </h2>

            {matchmakerError && (
              <div className="p-4 rounded-2xl bg-rose-100 border-2 border-rose-400 text-rose-950 font-bold text-sm flex items-center gap-2" role="alert">
                <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0" />
                <span>{matchmakerError}</span>
              </div>
            )}

            {matchmakerSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-950 font-bold text-sm flex items-center gap-2" role="alert">
                <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>{matchmakerSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePairStudents} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 border-2 border-slate-200">
              <div>
                <label className="block text-sm font-black text-slate-900 mb-2">
                  Select First Student:
                </label>
                <select
                  value={selectedStudent1}
                  onChange={(e) => setSelectedStudent1(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
                >
                  <option value="">-- Choose Learner --</option>
                  {activeStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.ageGroup.toUpperCase()}, Age {s.age || '?'}) {s.partnerId ? '• Currently Paired' : '• Unpaired'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-900 mb-2">
                  Select Second Student:
                </label>
                <select
                  value={selectedStudent2}
                  onChange={(e) => setSelectedStudent2(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
                >
                  <option value="">-- Choose Learner --</option>
                  {activeStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.ageGroup.toUpperCase()}, Age {s.age || '?'}) {s.partnerId ? '• Currently Paired' : '• Unpaired'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-sm flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <HeartHandshake className="w-5 h-5" />
                  <span>Pair Speaking Partners Safely</span>
                </button>
              </div>
            </form>
          </div>

          {/* Safety Reports Desk */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-slate-900">
              Safety Reports & Inappropriate Behavior Moderation
            </h2>

            {reports.length === 0 ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-center text-emerald-900 space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="text-base font-black">All Clear — Zero Pending Safety Incidents</h3>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => (
                  <div key={rep.id} className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-black">{rep.reporterName} reported {rep.reportedUserName}</strong>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                        rep.status === 'pending' ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'
                      }`}>
                        {rep.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">Reason: {rep.reason}</p>
                    {rep.status === 'pending' && (
                      <button
                        onClick={() => handleResolveReport(rep.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-xs"
                      >
                        Resolve Report
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Teacher Account & Cloud Sync Section */}
      {activeTab === 'settings' && settingsSection === 'profile' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-xl font-black text-slate-900">
              Verified Educator Profile & Database Synchronization
            </h3>
            <p className="text-xs text-slate-600">
              Trusted administrator credentials and cloud database status for Teacher Bahora.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-purple-50 border-2 border-purple-200 space-y-2">
              <span className="text-[10px] font-black uppercase text-purple-800 block">Verified Teacher Account</span>
              <p className="text-lg font-black text-slate-900">{currentUser?.name || 'Teacher Bahora'}</p>
              <p className="text-xs text-slate-600">Email: <strong>{currentUser?.email || 'btoyirova1982@gmail.com'}</strong></p>
              <p className="text-xs text-slate-600">Role: <span className="px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 font-bold uppercase text-[10px]">{currentUser?.role}</span></p>
              <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Verified Educator Privileges Active</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-3">
              <span className="text-[10px] font-black uppercase text-slate-500 block">Database Synchronization</span>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${isCloudConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <strong className="text-slate-900 text-sm">{isCloudConnected ? 'Supabase Database Connected' : 'Local Mode (Supabase Not Connected)'}</strong>
              </div>
              <p className="text-xs text-slate-600">
                {isCloudConnected 
                  ? 'Your student records, speaking evaluations, and messages sync securely with Supabase.' 
                  : 'Currently operating with local storage. Configure Supabase to enable cross-device persistence.'}
              </p>
              {onOpenSupabaseConfig && (
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    onOpenSupabaseConfig();
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs inline-flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Database className="w-4 h-4" />
                  <span>Configure Supabase Credentials</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS: Student Profile, Coin Adjustment, Review Assignment, Feedback
         ========================================================================= */}

      {/* 1. Student Detailed Portfolio Modal */}
      {selectedStudentForProfile && (
        <StudentProfileModal
          student={selectedStudentForProfile}
          summary={selectedStudentSummary}
          currentUser={currentUser}
          onClose={() => {
            setSelectedStudentForProfile(null);
            setSelectedStudentSummary(undefined);
          }}
          onRefresh={refreshAll}
        />
      )}

      {/* 2. Auditable Coin Adjustment Modal */}
      {adjustmentStudent && (
        <StudentAdjustmentModal
          student={adjustmentStudent}
          currentBalance={adjustmentBalance}
          currentUser={currentUser}
          onClose={() => {
            setAdjustmentStudent(null);
          }}
          onSuccess={refreshAll}
        />
      )}

      {/* 3. Class Enrollment Modal */}
      {isEnrollModalOpen && (
        <ClassEnrollmentModal
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
          currentUser={currentUser}
          onEnrolled={refreshAll}
        />
      )}

      {/* 4. Edit Assignment Modal */}
      {editingAssignment && (
        <EditAssignmentModal
          isOpen={!!editingAssignment}
          onClose={() => setEditingAssignment(null)}
          assignment={editingAssignment}
          currentUser={currentUser}
          onSaved={refreshAll}
        />
      )}

      {/* 3. Review Assignment Submission Drawer/Modal */}
      {reviewingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-2xl border-4 border-purple-600">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-xs font-black uppercase text-purple-700">Educator Grading Desk</span>
              <h3 className="text-xl font-black text-slate-900">
                Review Submission: {reviewingSubmission.studentName}
              </h3>
            </div>

            <form onSubmit={handleReviewSubmissionSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                  Grade / Score Percentage (0 - 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={reviewScore}
                  onChange={(e) => setReviewScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-black text-base"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                  Teacher Feedback & Comments
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Excellent work on vocabulary recognition! Next time, pay close attention to example sentences."
                  value={reviewFeedbackText}
                  onChange={(e) => setReviewFeedbackText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setReviewingSubmission(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-xs"
                >
                  Save Review & Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Quick Teacher Feedback Composer Modal */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-2xl border-4 border-blue-600">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-xs font-black uppercase text-blue-700">Student Encouragement Desk</span>
              <h3 className="text-xl font-black text-slate-900">
                Send Direct Feedback to Student
              </h3>
            </div>

            {fbSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-100 text-emerald-950 font-black text-xs flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>{fbSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleSendFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                    Select Recipient Student *
                  </label>
                  <select
                    required
                    value={fbTargetStudentId}
                    onChange={(e) => setFbTargetStudentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-xs bg-white"
                  >
                    <option value="">-- Choose Student --</option>
                    {activeStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                      Context / Category
                    </label>
                    <select
                      value={fbTargetType}
                      onChange={(e) => setFbTargetType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-xs bg-white"
                    >
                      <option value="general">General Guidance</option>
                      <option value="recording">Speaking Recording</option>
                      <option value="assignment">Assignment</option>
                      <option value="test">Test Assessment</option>
                      <option value="lesson">Lesson Practice</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                      Subject / Title
                    </label>
                    <input
                      type="text"
                      value={fbTargetTitle}
                      onChange={(e) => setFbTargetTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-xs bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-700 block mb-1">
                    Written Feedback Message *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Write personalized encouraging feedback for this student..."
                    value={fbText}
                    onChange={(e) => setFbText(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Praise Points (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Pronunciation was crystal clear!"
                      value={fbPraise}
                      onChange={(e) => setFbPraise(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Improvement Tip (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Try reading sentence slowly."
                      value={fbTip}
                      onChange={(e) => setFbTip(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsFeedbackModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs shadow-xs"
                  >
                    Send to Student
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
