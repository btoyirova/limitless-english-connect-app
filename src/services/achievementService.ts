import { Badge, EarnedBadge, TestAttempt, StudentAchievementsProfile, TopicTest, TestQuestion } from '../types/achievements';
import { ConversationTopic } from '../types';
import { CURRICULUM_TOPICS } from '../data/curriculum';
import { avatarService } from './avatarService';
import { supabaseService } from './supabase';
import { soundEffects } from './soundEffects';
import { speechService } from './speechService';

export const ALL_BADGES: Badge[] = [
  // --- TOPIC BADGES (TOPICS 1 - 20) ---
  {
    id: 'badge-topic-greetings',
    name: 'Greetings Star',
    category: 'topic',
    topicId: 'greetings',
    description: 'Mastered English greetings, introductions, and polite goodbyes.',
    unlockCriteria: 'Pass the Topic 1 End-of-Topic Test with 60% or higher and speaking challenge.',
    iconName: 'hand',
    color: 'from-blue-500 to-indigo-600',
    coinReward: 50,
  },
  {
    id: 'badge-topic-introducing-myself',
    name: 'Introduction Champion',
    category: 'topic',
    topicId: 'introducing-myself',
    description: 'Fluently shared personal details, origins, and English learning goals.',
    unlockCriteria: 'Pass the Topic 2 End-of-Topic Test with 60% or higher and speaking challenge.',
    iconName: 'user',
    color: 'from-teal-500 to-emerald-600',
    coinReward: 50,
  },
  {
    id: 'badge-topic-my-family',
    name: 'Family Explorer',
    category: 'topic',
    topicId: 'my-family',
    description: 'Described loved ones and shared meaningful family stories.',
    unlockCriteria: 'Pass the Topic 3 End-of-Topic Test with 60% or higher and speaking challenge.',
    iconName: 'users',
    color: 'from-indigo-500 to-purple-600',
    coinReward: 50,
  },
  {
    id: 'badge-topic-favorite-food-drinks',
    name: 'Food Expert',
    category: 'topic',
    topicId: 'favorite-food-drinks',
    description: 'Articulated food and beverage preferences and ordered politely.',
    unlockCriteria: 'Pass the Topic 4 End-of-Topic Test with 60% or higher and speaking challenge.',
    iconName: 'utensils',
    color: 'from-amber-500 to-orange-600',
    coinReward: 50,
  },
  {
    id: 'badge-topic-hobbies-free-time',
    name: 'Hobby Hero',
    category: 'topic',
    topicId: 'hobbies-free-time',
    description: 'Conversed about free-time activities, music, and weekend relaxation.',
    unlockCriteria: 'Pass the Topic 5 End-of-Topic Test with 60% or higher and speaking challenge.',
    iconName: 'smile',
    color: 'from-emerald-500 to-teal-600',
    coinReward: 50,
  },
  {
    id: 'badge-topic-daily-routine',
    name: 'Routine Master',
    category: 'topic',
    topicId: 'daily-routine',
    description: 'Described morning, afternoon, and evening schedules with present simple verbs.',
    unlockCriteria: 'Pass the Topic 6 End-of-Topic Test with 60% or higher and speaking challenge.',
    iconName: 'clock',
    color: 'from-sky-500 to-blue-600',
    coinReward: 50,
  },
  {
    id: 'badge-topic-days-time-dates',
    name: 'Time Captain',
    category: 'topic',
    topicId: 'days-time-dates',
    description: 'Accurately scheduled meetings, told the time, and named calendar days.',
    unlockCriteria: 'Pass the Topic 7 End-of-Topic Test with 60% or higher and speaking challenge.',
    iconName: 'calendar',
    color: 'from-cyan-500 to-blue-600',
    coinReward: 50,
  },
  {
    id: 'badge-topic-shopping-prices',
    name: 'Smart Shopper',
    category: 'topic',
    topicId: 'shopping-prices',
    description: 'Politely inquired about prices and completed store transactions.',
    unlockCriteria: 'Pass the Topic 8 End-of-Topic Test with 60% or higher and speaking challenge.',
    iconName: 'shopping',
    color: 'from-purple-500 to-fuchsia-600',
    coinReward: 50,
  },
  {
    id: 'badge-topic-home-room',
    name: 'Cozy Home Designer',
    category: 'topic',
    topicId: 'home-room',
    description: 'Described living areas, furniture, and spatial locations with prepositions.',
    unlockCriteria: 'Pass the Topic 9 End-of-Topic Test with 60% or higher and speaking challenge.',
    iconName: 'home',
    color: 'from-rose-500 to-pink-600',
    coinReward: 50,
  },
  {
    id: 'badge-topic-weather-seasons',
    name: 'Weather Forecaster',
    category: 'topic',
    topicId: 'weather-seasons',
    description: 'Delivered weather reports and discussed seasonal clothing and conditions.',
    unlockCriteria: 'Pass the Topic 10 End-of-Topic Test with 60% or higher and speaking challenge.',
    iconName: 'sun',
    color: 'from-amber-400 to-yellow-600',
    coinReward: 50,
  },
  {
    id: 'badge-topic-ordering-restaurant',
    name: 'Gourmet Diner',
    category: 'topic',
    topicId: 'ordering-restaurant',
    description: 'Dined out with confidence, requested special diets, and paid the bill.',
    unlockCriteria: 'Pass the Topic 11 End-of-Topic Test with 60% or higher and speaking challenge.',
    iconName: 'coffee',
    color: 'from-orange-500 to-red-600',
    coinReward: 50,
  },
  {
    id: 'badge-topic-asking-directions',
    name: 'City Navigator',
    category: 'topic',
    topicId: 'asking-directions',
    description: 'Navigated city avenues, confirmed routes, and located transit hubs.',
    unlockCriteria: 'Pass the Topic 12 End-of-Topic Test with 60% or higher and speaking challenge.',
    iconName: 'map-pin',
    color: 'from-emerald-500 to-green-700',
    coinReward: 50,
  },
  {
    id: 'badge-topic-making-friends',
    name: 'Friendship Builder',
    category: 'topic',
    topicId: 'making-friends',
    description: 'Initiated casual conversations and built international bonds of kindness.',
    unlockCriteria: 'Pass the Topic 13 End-of-Topic Test with 60% or higher and speaking challenge.',
    iconName: 'heart',
    color: 'from-pink-500 to-rose-600',
    coinReward: 50,
  },
  {
    id: 'badge-topic-visiting-doctor',
    name: 'Wellness Advocate',
    category: 'topic',
    topicId: 'visiting-doctor',
    description: 'Articulated symptoms, understood prescription dosage, and prioritized health.',
    unlockCriteria: 'Pass the Topic 14 End-of-Topic Test with 60% or higher and speaking challenge.',
    iconName: 'activity',
    color: 'from-teal-600 to-cyan-700',
    coinReward: 50,
  },
  {
    id: 'badge-topic-travel-transport',
    name: 'Global Traveler',
    category: 'topic',
    topicId: 'travel-transport',
    description: 'Booked train journeys, verified departure gates, and traversed continents.',
    unlockCriteria: 'Pass the Topic 15 End-of-Topic Test with 60% or higher and speaking challenge.',
    iconName: 'compass',
    color: 'from-blue-600 to-indigo-800',
    coinReward: 50,
  },
  {
    id: 'badge-topic-past-experiences',
    name: 'Storyteller Legend',
    category: 'topic',
    topicId: 'past-experiences',
    description: 'Narrated past memories and travels using regular and irregular past verbs.',
    unlockCriteria: 'Pass the Topic 16 End-of-Topic Test with 60% or higher and speaking challenge.',
    iconName: 'book',
    color: 'from-indigo-600 to-violet-800',
    coinReward: 50,
  },
  {
    id: 'badge-topic-future-plans',
    name: 'Future Visionary',
    category: 'topic',
    topicId: 'future-plans',
    description: 'Expressed ambitious learning roadmaps with "going to" and "will".',
    unlockCriteria: 'Pass the Topic 17 End-of-Topic Test with 60% or higher and speaking challenge.',
    iconName: 'target',
    color: 'from-violet-600 to-purple-800',
    coinReward: 50,
  },
  {
    id: 'badge-topic-expressing-opinions',
    name: 'Thought Leader',
    category: 'topic',
    topicId: 'expressing-opinions',
    description: 'Advocated for inclusive ideas and agreed and disagreed with grace.',
    unlockCriteria: 'Pass the Topic 18 End-of-Topic Test with 60% or higher and speaking challenge.',
    iconName: 'message',
    color: 'from-emerald-600 to-teal-800',
    coinReward: 50,
  },
  {
    id: 'badge-topic-everyday-problems',
    name: 'Problem Solver',
    category: 'topic',
    topicId: 'everyday-problems',
    description: 'Calmly resolved technical hurdles and expressed sincere gratitude.',
    unlockCriteria: 'Pass the Topic 19 End-of-Topic Test with 60% or higher and speaking challenge.',
    iconName: 'help',
    color: 'from-amber-500 to-yellow-700',
    coinReward: 50,
  },
  {
    id: 'badge-topic-dreams-goals',
    name: 'Limitless Graduate',
    category: 'topic',
    topicId: 'dreams-goals',
    description: 'Celebrated completing the full 20-topic curriculum. The summit of achievement!',
    unlockCriteria: 'Pass the Topic 20 End-of-Topic Test with 60% or higher and speaking challenge.',
    iconName: 'star',
    color: 'from-yellow-400 via-amber-500 to-yellow-600',
    coinReward: 50,
  },

  // --- MILESTONE BADGES (5 MILESTONES) ---
  {
    id: 'badge-milestone-first-test',
    name: 'First Test Completed',
    category: 'milestone',
    description: 'Passed your very first end-of-topic mastery test in English.',
    unlockCriteria: 'Successfully pass any 1 topic test.',
    iconName: 'award',
    color: 'from-blue-600 to-cyan-600',
    coinReward: 20,
  },
  {
    id: 'badge-milestone-5-topics',
    name: '5 Topics Completed',
    category: 'milestone',
    description: 'Completed Level 1 Foundations by passing all 5 opening units.',
    unlockCriteria: 'Pass 5 topic tests.',
    iconName: 'shield',
    color: 'from-emerald-600 to-green-700',
    coinReward: 50,
  },
  {
    id: 'badge-milestone-10-topics',
    name: '10 Topics Completed',
    category: 'milestone',
    description: 'Completed Level 2 Everyday Life by passing 10 topics.',
    unlockCriteria: 'Pass 10 topic tests.',
    iconName: 'trophy',
    color: 'from-indigo-600 to-blue-700',
    coinReward: 50,
  },
  {
    id: 'badge-milestone-20-topics',
    name: '20 Topics Completed',
    category: 'milestone',
    description: 'Mastered all 20 units of the entire Limitless English Connect curriculum.',
    unlockCriteria: 'Pass all 20 topic tests.',
    iconName: 'crown',
    color: 'from-amber-400 via-yellow-500 to-amber-600',
    coinReward: 100,
  },
  {
    id: 'badge-milestone-brave-speaker',
    name: 'Brave Speaker',
    category: 'milestone',
    description: 'Completed spoken voice recording challenges with courage and dedication.',
    unlockCriteria: 'Successfully complete a speaking challenge in a topic test.',
    iconName: 'mic',
    color: 'from-rose-500 to-purple-600',
    coinReward: 20,
  },
];

const ACHIEVEMENTS_STORAGE_PREFIX = 'limitless_achievements_';

export class AchievementService {
  /**
   * Generates or retrieves the structured 5-question test for any topic.
   * Structure: 2 listening, 2 vocab/sentence, 1 speaking.
   */
  getTopicTest(topicId: string): TopicTest | null {
    const topic = CURRICULUM_TOPICS.find((t) => t.id === topicId);
    if (!topic) return null;

    const badge = ALL_BADGES.find((b) => b.topicId === topicId) || ALL_BADGES[0];

    const questions: TestQuestion[] = [];

    // 1. Listening Question 1
    const lc1 = topic.listenAndChoose?.[0];
    if (lc1) {
      questions.push({
        id: `q-${topic.id}-l1`,
        type: 'listening',
        title: 'Listening Question 1',
        audioPrompt: lc1.audioPrompt,
        question: lc1.question,
        options: lc1.options,
        explanation: lc1.explanation,
      });
    } else {
      questions.push({
        id: `q-${topic.id}-l1`,
        type: 'listening',
        title: 'Listening Question 1',
        audioPrompt: topic.audioInstruction,
        question: `What is the main learning goal of ${topic.title}?`,
        options: [
          { id: 'opt-1', text: topic.learningObjective, isCorrect: true },
          { id: 'opt-2', text: 'To memorize silent grammar books', isCorrect: false },
          { id: 'opt-3', text: 'To write complicated essays', isCorrect: false },
        ],
        explanation: `Topic ${topic.title} focuses on ${topic.learningObjective}.`,
      });
    }

    // 2. Listening Question 2
    const lc2 = topic.listenAndChoose?.[1];
    if (lc2) {
      questions.push({
        id: `q-${topic.id}-l2`,
        type: 'listening',
        title: 'Listening Question 2',
        audioPrompt: lc2.audioPrompt,
        question: lc2.question,
        options: lc2.options,
        explanation: lc2.explanation,
      });
    } else if (topic.dialogue && topic.dialogue.length >= 2) {
      const line1 = topic.dialogue[0];
      const line2 = topic.dialogue[1];
      questions.push({
        id: `q-${topic.id}-l2`,
        type: 'listening',
        title: 'Listening Question 2',
        audioPrompt: `${line1.speaker} says: "${line1.text}". ${line2.speaker} replies: "${line2.text}".`,
        question: `How does ${line2.speaker} respond to ${line1.speaker}?`,
        options: [
          { id: 'opt-a', text: line2.text, isCorrect: true },
          { id: 'opt-b', text: 'Goodbye, see you never!', isCorrect: false },
          { id: 'opt-c', text: 'I do not want to talk.', isCorrect: false },
        ],
        explanation: `${line2.speaker} kindly said "${line2.text}".`,
      });
    } else {
      questions.push({
        id: `q-${topic.id}-l2`,
        type: 'listening',
        title: 'Listening Question 2',
        audioPrompt: `In English, practicing speaking every day builds natural confidence.`,
        question: `According to the speaker, what builds natural confidence?`,
        options: [
          { id: 'opt-a', text: 'Practicing speaking every day', isCorrect: true },
          { id: 'opt-b', text: 'Never trying to speak', isCorrect: false },
          { id: 'opt-c', text: 'Only reading silently', isCorrect: false },
        ],
        explanation: `Daily speaking practice builds communicative confidence.`,
      });
    }

    // 3. Vocabulary Question
    const vc = topic.vocabularyChallenge?.[0];
    if (vc) {
      // Pick another word from vocabularyChallenge for distractors
      const otherVc = topic.vocabularyChallenge?.[1] || { word: 'Practice', definition: 'To do an activity repeatedly' };
      questions.push({
        id: `q-${topic.id}-v1`,
        type: 'vocabulary',
        title: 'Vocabulary Challenge',
        question: `What is the meaning of the word "${vc.word}"?`,
        options: [
          { id: 'v-opt-1', text: vc.definition, isCorrect: true },
          { id: 'v-opt-2', text: otherVc.definition, isCorrect: false },
          { id: 'v-opt-3', text: 'Something that is completely broken', isCorrect: false },
        ],
        explanation: `"${vc.word}" means: ${vc.definition}. Example: "${vc.exampleSentence}"`,
      });
    } else {
      questions.push({
        id: `q-${topic.id}-v1`,
        type: 'vocabulary',
        title: 'Vocabulary Challenge',
        question: `Which word represents a friendly greeting in English?`,
        options: [
          { id: 'v-1', text: 'Hello', isCorrect: true },
          { id: 'v-2', text: 'Closed', isCorrect: false },
          { id: 'v-3', text: 'Late', isCorrect: false },
        ],
        explanation: `"Hello" is universally recognized as a friendly greeting.`,
      });
    }

    // 4. Sentence Building / Grammar Question
    const sb = topic.sentenceBuilder?.[0];
    if (sb) {
      questions.push({
        id: `q-${topic.id}-s1`,
        type: 'sentence',
        title: 'Sentence Building',
        question: `Which sentence is in the correct English word order?`,
        options: [
          { id: 's-opt-1', text: sb.targetSentence, isCorrect: true },
          { id: 's-opt-2', text: sb.scrambledWords.join(' '), isCorrect: false },
          { id: 's-opt-3', text: sb.targetSentence.split(' ').reverse().join(' '), isCorrect: false },
        ],
        explanation: `Correct word order: "${sb.targetSentence}". ${sb.hint}`,
      });
    } else {
      questions.push({
        id: `q-${topic.id}-s1`,
        type: 'sentence',
        title: 'Sentence Building',
        question: `Which sentence is structured correctly?`,
        options: [
          { id: 's-1', text: `I am happy to study English today.`, isCorrect: true },
          { id: 's-2', text: `Happy I today English study am.`, isCorrect: false },
          { id: 's-3', text: `Study English today am I happy.`, isCorrect: false },
        ],
        explanation: `Standard English subject-verb structure: "I am happy to study English today."`,
      });
    }

    // 5. Short Speaking Participation Challenge
    const sm = topic.speakingMission || {
      id: `sm-${topic.id}`,
      missionTitle: `Speaking Challenge for ${topic.title}`,
      promptQuestion: topic.prompts[0]?.question || `Introduce your thoughts on ${topic.title}.`,
      sentenceStarters: topic.prompts[0]?.sentenceStarters || [`My answer is...`, `I would like to say...`],
      sampleGoodAnswer: topic.prompts[0]?.exampleAnswer || `Hello! I really enjoyed studying this topic.`,
      teacherEncouragement: `Speak clearly with your natural voice. Every sincere attempt earns full credit!`,
    };

    questions.push({
      id: `q-${topic.id}-sp1`,
      type: 'speaking',
      title: 'Speaking Challenge',
      question: sm.promptQuestion,
      sampleAnswer: sm.sampleGoodAnswer,
      teacherTip: sm.teacherEncouragement,
      explanation: `Speaking participation is celebrated! Speech differences or foreign accents are never penalized.`,
    });

    return {
      topicId: topic.id,
      topicTitle: topic.title,
      level: topic.level,
      badge,
      questions,
    };
  }

  /**
   * Retrieves the student's achievements profile (earned badges, test attempts, completed topic IDs).
   */
  async getAchievements(studentId: string): Promise<StudentAchievementsProfile> {
    const local = this.getLocalAchievements(studentId);

    if (supabaseService.isConfigured()) {
      try {
        const client = supabaseService.getClient();
        if (client) {
          // Fetch achievements
          const { data: badgesData } = await client
            .from('student_achievements')
            .select('*')
            .eq('student_id', studentId);

          // Fetch test attempts
          const { data: attemptsData } = await client
            .from('student_test_attempts')
            .select('*')
            .eq('student_id', studentId)
            .order('created_at', { ascending: false });

          if (badgesData && attemptsData) {
            const earnedBadges: EarnedBadge[] = badgesData.map((b: any) => ({
              badgeId: b.badge_id,
              studentId: b.student_id,
              badgeName: b.badge_name,
              earnedAt: b.earned_at || b.created_at,
              coinsAwarded: b.coins_awarded || 30,
            }));

            const testAttempts: TestAttempt[] = attemptsData.map((a: any) => ({
              id: a.id,
              studentId: a.student_id,
              topicId: a.topic_id,
              topicTitle: a.topic_title,
              objectiveScore: a.objective_score,
              totalObjective: a.total_objective || 4,
              scorePercentage: a.score_percentage,
              speakingCompleted: a.speaking_completed,
              passed: a.passed,
              coinsAwarded: a.coins_awarded,
              completedAt: a.created_at,
            }));

            const passedTopicIds = Array.from(
              new Set(testAttempts.filter((a) => a.passed).map((a) => a.topicId))
            );

            const profile: StudentAchievementsProfile = {
              studentId,
              earnedBadges,
              testAttempts,
              completedTopicIds: passedTopicIds,
              totalCoinsEarned: earnedBadges.reduce((sum, b) => sum + (b.coinsAwarded || 0), 0),
              updatedAt: new Date().toISOString(),
            };

            this.saveLocalAchievements(profile);
            return profile;
          }
        }
      } catch (err) {
        console.warn('Could not fetch achievements from Supabase, using local:', err);
      }
    }

    return local;
  }

  /**
   * Submits a test attempt with objective answers and speaking status.
   * Evaluates score against the supportive 60% pass threshold.
   * Awards topic badge + 30 coins for first-time pass, plus milestone badges.
   */
  async submitTestAttempt(
    studentId: string,
    topicId: string,
    objectiveScore: number, // out of 4
    totalObjective: number = 4,
    speakingCompleted: boolean = true
  ): Promise<{
    passed: boolean;
    scorePercentage: number;
    coinsAwarded: number;
    newBadges: Badge[];
    message: string;
  }> {
    const profile = await this.getAchievements(studentId);
    const topic = CURRICULUM_TOPICS.find((t) => t.id === topicId);
    const topicTitle = topic?.title || topicId;

    const scorePercentage = Math.round((objectiveScore / totalObjective) * 100);
    // Supportive pass target: 60% on objective questions + speaking challenge attempted
    const passed = scorePercentage >= 60 && speakingCompleted;

    const isFirstTimePass = passed && !profile.completedTopicIds.includes(topicId);
    let coinsAwarded = 0;
    const newBadges: Badge[] = [];

    if (passed && isFirstTimePass) {
      // 1. Award Topic Badge
      const topicBadge = ALL_BADGES.find((b) => b.topicId === topicId);
      if (topicBadge) {
        newBadges.push(topicBadge);
        coinsAwarded += topicBadge.coinReward || 30;
      }

      // Add to completed topic IDs
      profile.completedTopicIds.push(topicId);

      // 2. Check Milestones
      // Milestone: First Test Completed
      const firstTestBadge = ALL_BADGES.find((b) => b.id === 'badge-milestone-first-test');
      if (firstTestBadge && !profile.earnedBadges.some((b) => b.badgeId === firstTestBadge.id)) {
        newBadges.push(firstTestBadge);
        coinsAwarded += firstTestBadge.coinReward || 20;
      }

      // Milestone: 5 Topics Completed
      const fiveBadge = ALL_BADGES.find((b) => b.id === 'badge-milestone-5-topics');
      if (
        fiveBadge &&
        profile.completedTopicIds.length >= 5 &&
        !profile.earnedBadges.some((b) => b.badgeId === fiveBadge.id)
      ) {
        newBadges.push(fiveBadge);
        coinsAwarded += fiveBadge.coinReward || 50;
      }

      // Milestone: 10 Topics Completed
      const tenBadge = ALL_BADGES.find((b) => b.id === 'badge-milestone-10-topics');
      if (
        tenBadge &&
        profile.completedTopicIds.length >= 10 &&
        !profile.earnedBadges.some((b) => b.badgeId === tenBadge.id)
      ) {
        newBadges.push(tenBadge);
        coinsAwarded += tenBadge.coinReward || 50;
      }

      // Milestone: 20 Topics Completed
      const twentyBadge = ALL_BADGES.find((b) => b.id === 'badge-milestone-20-topics');
      if (
        twentyBadge &&
        profile.completedTopicIds.length >= 20 &&
        !profile.earnedBadges.some((b) => b.badgeId === twentyBadge.id)
      ) {
        newBadges.push(twentyBadge);
        coinsAwarded += twentyBadge.coinReward || 100;
      }

      // Milestone: Brave Speaker
      if (speakingCompleted) {
        const speakerBadge = ALL_BADGES.find((b) => b.id === 'badge-milestone-brave-speaker');
        if (speakerBadge && !profile.earnedBadges.some((b) => b.badgeId === speakerBadge.id)) {
          newBadges.push(speakerBadge);
          coinsAwarded += speakerBadge.coinReward || 20;
        }
      }

      // Award the coins through the atomic avatarService
      if (coinsAwarded > 0) {
        await avatarService.awardCoins(
          studentId,
          coinsAwarded,
          `test-pass-${topicId}`,
          `Passed ${topicTitle} Test & Earned Badges`
        );
      }
    }

    // Record test attempt
    const attempt: TestAttempt = {
      id: `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      studentId,
      topicId,
      topicTitle,
      objectiveScore,
      totalObjective,
      scorePercentage,
      speakingCompleted,
      passed,
      coinsAwarded,
      completedAt: new Date().toISOString(),
    };

    profile.testAttempts.unshift(attempt);

    // Record earned badges in profile
    const nowIso = new Date().toISOString();
    for (const b of newBadges) {
      profile.earnedBadges.push({
        badgeId: b.id,
        studentId,
        badgeName: b.name,
        earnedAt: nowIso,
        coinsAwarded: b.coinReward,
      });
    }

    profile.totalCoinsEarned += coinsAwarded;
    profile.updatedAt = nowIso;

    // Save locally
    this.saveLocalAchievements(profile);

    // Sync to Supabase
    if (supabaseService.isConfigured()) {
      try {
        const client = supabaseService.getClient();
        if (client) {
          // Insert test attempt
          await client.from('student_test_attempts').insert({
            student_id: studentId,
            topic_id: topicId,
            topic_title: topicTitle,
            objective_score: objectiveScore,
            total_objective: totalObjective,
            score_percentage: scorePercentage,
            speaking_completed: speakingCompleted,
            passed,
            coins_awarded: coinsAwarded,
          });

          // Insert new badges
          for (const b of newBadges) {
            await client.from('student_achievements').insert({
              student_id: studentId,
              badge_id: b.id,
              badge_name: b.name,
              badge_category: b.category,
              coins_awarded: b.coinReward,
            });
          }
        }
      } catch (err) {
        console.warn('Could not sync test attempt or badges to Supabase:', err);
      }
    }

    // Notify Express server if available
    try {
      await fetch('/api/test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          topicId,
          objectiveScore,
          totalObjective,
          speakingCompleted,
          passed,
          coinsAwarded,
          newBadgeIds: newBadges.map((b) => b.id),
        }),
      });
    } catch {
      // Standalone mode
    }

    // Play feedback sound and announcement
    if (passed) {
      soundEffects.playSuccess();
      const badgeText =
        newBadges.length > 0 ? ` You unlocked ${newBadges.map((b) => b.name).join(' and ')}!` : '';
      const coinText = coinsAwarded > 0 ? ` You earned ${coinsAwarded} English Coins!` : '';
      const msg = `Congratulations! You passed the ${topicTitle} Test with a score of ${scorePercentage}%.${badgeText}${coinText}`;
      speechService.announce(msg);
      return {
        passed: true,
        scorePercentage,
        coinsAwarded,
        newBadges,
        message: msg,
      };
    } else {
      soundEffects.playWarning();
      let hint = '';
      if (!speakingCompleted) {
        hint = ' Please make sure to record your speaking answer to complete the test.';
      } else {
        hint = ` You scored ${scorePercentage}%. The supportive pass target is 60%. You have unlimited retries without penalties.`;
      }
      const msg = `Good try on the ${topicTitle} Test!${hint} Feel free to review the lesson and try again anytime.`;
      speechService.announce(msg);
      return {
        passed: false,
        scorePercentage,
        coinsAwarded: 0,
        newBadges: [],
        message: msg,
      };
    }
  }

  getBadge(badgeId: string): Badge | undefined {
    return ALL_BADGES.find((b) => b.id === badgeId);
  }

  getAllBadges(): Badge[] {
    return ALL_BADGES;
  }

  private getLocalAchievements(studentId: string): StudentAchievementsProfile {
    try {
      const raw = localStorage.getItem(`${ACHIEVEMENTS_STORAGE_PREFIX}${studentId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.earnedBadges)) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }

    return {
      studentId,
      earnedBadges: [],
      testAttempts: [],
      completedTopicIds: [],
      totalCoinsEarned: 0,
      updatedAt: new Date().toISOString(),
    };
  }

  private saveLocalAchievements(profile: StudentAchievementsProfile): void {
    try {
      localStorage.setItem(`${ACHIEVEMENTS_STORAGE_PREFIX}${profile.studentId}`, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }
}

export const achievementService = new AchievementService();
