export type UserRole = 'student' | 'teacher' | 'admin';
export type AgeGroup = 'child' | 'adult';
export type VisionPreference = 'standard' | 'low-vision-large-text' | 'high-contrast' | 'screen-reader';

// Three learning display modes: English + Uzbek (default), English Only, Uzbek Support
export type DisplayLanguageMode = 'bilingual' | 'en-only' | 'uz-support';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ageGroup: AgeGroup;
  age?: number;
  visionPreference: VisionPreference;
  nativeLanguage?: string;
  displayLanguageMode?: DisplayLanguageMode;
  isApproved: boolean;
  partnerId?: string;
  avatarColor: string;
  bioText?: string;
  createdAt: string;
}

export interface LessonVocabularyItem {
  english: string;
  uzbek: string;
  phonetic?: string;
  exampleSentence?: string;
  exampleSentenceUz?: string;
  audioHint?: string;
}

export interface LessonSentenceItem {
  english: string;
  uzbek: string;
  patternRule?: string;
  substitutions?: {
    slotName: string;
    options: { en: string; uz: string }[];
  };
}

export interface LessonSection {
  id: string;
  title: string;
  titleUz?: string;
  lessonNumber?: number;
  category?: 'vocabulary' | 'sentences' | 'conversation' | 'practice';
  description?: string;
  descriptionUz?: string;
  items: string[];
  itemsUz?: string[];
  vocabulary?: LessonVocabularyItem[];
  sentences?: LessonSentenceItem[];
  dialogue?: DialogueLine[];
  speakingPrompt?: {
    prompt: string;
    promptUz?: string;
    starter: string;
    starterUz?: string;
  };
}

export interface DialogueLine {
  speaker: string;
  speakerUz?: string;
  text: string;
  textUz?: string;
}

export interface TopicPrompt {
  id: string;
  question: string;
  questionUz?: string;
  sentenceStarters: string[];
  sentenceStartersUz?: string[];
  exampleAnswer: string;
  exampleAnswerUz?: string;
  teacherTip: string;
  teacherTipUz?: string;
  optional?: boolean; // Allows learners to skip personal or sensitive questions
}

import {
  ListenAndChooseItem,
  VocabularyWordItem,
  SentenceBuilderItem,
  AIRoleplayScenario,
  SpeakingMissionItem,
  TranslationExerciseItem
} from './avatar';

export interface ConversationTopic {
  id: string;
  title: string;
  titleUz?: string;
  subtitle: string;
  subtitleUz?: string;
  level: string; // Pre-A1, A1, A1-A2
  levelGroup?: 'Level 1' | 'Level 2' | 'Level 3' | 'Level 4';
  learningObjective: string;
  learningObjectiveUz?: string;
  iconName: string;
  color: string;
  audioInstruction: string;
  audioInstructionUz?: string;
  lessons: LessonSection[];
  dialogue: DialogueLine[];
  speakingActivities: string[];
  speakingActivitiesUz?: string[];
  prompts: TopicPrompt[];
  completionMessage: string;
  completionMessageUz?: string;
  // 5 Interactive Learning Activities
  listenAndChoose?: ListenAndChooseItem[];
  vocabularyChallenge?: VocabularyWordItem[];
  sentenceBuilder?: SentenceBuilderItem[];
  aiRoleplayScenario?: AIRoleplayScenario;
  speakingMission?: SpeakingMissionItem;
  // Optional Translation Practice Activities
  translationExercises?: TranslationExerciseItem[];
}

export interface VoiceMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  audioUrl: string; // Blob URL or audio data URI
  durationSeconds: number;
  topicId?: string;
  transcript?: string;
  createdAt: string;
  isListened: boolean;
}

export interface SafetyReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId: string;
  reportedUserName: string;
  reason: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
  teacherNotes?: string;
}

export interface SpeakingEvaluation {
  clarityScore: number; // 1-5
  grammarScore: number; // 1-5
  relevanceScore: number; // 1-5
  transcript: string;
  positiveFeedback: string;
  uzbekFeedback?: string; // Strengths explained in simple Uzbek (Latin script)
  gentleCorrection: string;
  uzbekCorrection?: string; // Gentle speaking correction explained in simple Uzbek
  improvedEnglishExample?: string; // One polished English example sentence
  nextPracticeTip: string;
  spokenSummary: string;
  isReliable: boolean;
  unclearReason?: string;
}

export interface PracticeRecording {
  id: string;
  studentId: string;
  studentName: string;
  topicId: string;
  topicTitle: string;
  questionId: string;
  questionText: string;
  audioUrl: string; // Storage URL or audio data URI
  storagePath?: string;
  durationSeconds: number;
  submittedAt: string;
  evaluation?: SpeakingEvaluation;
}

export interface PartnerPairing {
  id: string;
  student1Id: string;
  student2Id: string;
  topicId?: string;
  status: 'active' | 'pending_teacher_approval' | 'blocked';
  createdAt: string;
}

export interface ClassRoom {
  id: string;
  teacherId: string;
  teacherName: string;
  name: string;
  description?: string;
  studentIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  classId?: string;
  className?: string;
  teacherId: string;
  teacherName: string;
  title: string;
  type: 'lesson' | 'quiz' | 'speaking' | 'custom';
  topicId: string;
  topicTitle: string;
  lessonId?: string;
  lessonTitle?: string;
  instructions: string;
  dueDate?: string;
  studentIds: string[];
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  status: 'assigned' | 'completed' | 'reviewed';
  completedAt?: string;
  score?: number;
  teacherFeedback?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface TeacherFeedbackItem {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  targetType: 'recording' | 'assignment' | 'lesson' | 'test' | 'general';
  targetId: string;
  targetTitle: string;
  feedbackText: string;
  praisePoints?: string;
  improvementTip?: string;
  createdAt: string;
  isReadByStudent: boolean;
}

export interface StudentAdjustmentRecord {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  coinAdjustment: number;
  badgeId?: string;
  reason: string;
  timestamp: string;
}

export interface CurriculumAuditLog {
  id: string;
  teacherId: string;
  teacherName: string;
  action: 'create_lesson' | 'edit_lesson' | 'edit_vocab' | 'add_vocab' | 'edit_dialogue' | 'publish_curriculum' | 'save_draft' | 'restore_defaults';
  topicId: string;
  lessonId?: string;
  description: string;
  timestamp: string;
}

export interface StudentProgressSummary {
  student: User;
  completedLessonsCount: number;
  totalLessonsCount: number;
  completedTopicIds: string[];
  totalTopicsCount: number;
  progressPercentage: number;
  coinsBalance: number;
  earnedBadgesCount: number;
  recordingsCount: number;
  testAttemptsCount: number;
  averageTestScore: number;
  pendingAssignmentsCount: number;
  lastActiveAt: string;
}

export * from './avatar';
export * from './achievements';
export * from './messaging';
