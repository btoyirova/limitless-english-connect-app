export interface Badge {
  id: string;
  name: string;
  category: 'topic' | 'milestone';
  topicId?: string;
  description: string;
  unlockCriteria: string;
  iconName: string; // Lucide or custom SVG key
  color: string; // Tailwind color theme
  coinReward: number;
}

export interface EarnedBadge {
  badgeId: string;
  studentId: string;
  badgeName: string;
  earnedAt: string;
  coinsAwarded: number;
}

export interface TestAttempt {
  id: string;
  studentId: string;
  topicId: string;
  topicTitle: string;
  objectiveScore: number; // e.g. 3 or 4
  totalObjective: number; // 4
  scorePercentage: number; // e.g. 75 or 100
  speakingCompleted: boolean;
  passed: boolean;
  coinsAwarded: number;
  completedAt: string;
}

export interface StudentAchievementsProfile {
  studentId: string;
  earnedBadges: EarnedBadge[];
  testAttempts: TestAttempt[];
  completedTopicIds: string[];
  totalCoinsEarned: number;
  updatedAt: string;
}

export interface TestQuestion {
  id: string;
  type: 'listening' | 'vocabulary' | 'sentence' | 'speaking';
  title: string;
  audioPrompt?: string; // Sentence or conversation to listen to
  question: string;
  options?: { id: string; text: string; isCorrect: boolean }[];
  scrambledWords?: string[];
  correctSentence?: string;
  sampleAnswer?: string;
  teacherTip?: string;
  explanation: string;
}

export interface TopicTest {
  topicId: string;
  topicTitle: string;
  level: string;
  badge: Badge;
  questions: TestQuestion[]; // 2 listening, 2 vocab/sentence, 1 speaking
}
