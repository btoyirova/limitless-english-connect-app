import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser with 50mb limit to handle audio recordings (base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Healthcheck endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Limitless English Connect' });
});

// AI Speaking Evaluation Endpoint using @google/genai SDK
// Evaluates real recorded audio for beginner blind and low-vision learners
app.post('/api/evaluate-speech', async (req, res) => {
  try {
    const { audioBase64, mimeType, question, topicTitle, expectedLevel } = req.body;

    if (!audioBase64) {
      return res.status(400).json({
        error: 'Missing audio data for evaluation.',
        isReliable: false,
        unclearReason: 'No audio was received.',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
        isReliable: false,
        unclearReason: 'AI speech evaluation service is unavailable.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Cleanly strip data URI scheme even if parameters like ;codecs=opus are present
    let cleanBase64 = audioBase64;
    const commaIndex = audioBase64.indexOf(',');
    if (commaIndex !== -1 && audioBase64.startsWith('data:')) {
      cleanBase64 = audioBase64.slice(commaIndex + 1);
    }
    cleanBase64 = cleanBase64.replace(/\s/g, '');

    // Normalize audio mime type for Gemini (strip extra parameters like ;codecs=opus)
    let rawMime = (mimeType || 'audio/webm').split(';')[0].trim().toLowerCase();
    const supportedAudioMimes: Record<string, string> = {
      'audio/webm': 'audio/webm',
      'audio/wav': 'audio/wav',
      'audio/x-wav': 'audio/wav',
      'audio/mp3': 'audio/mp3',
      'audio/mpeg': 'audio/mp3',
      'audio/ogg': 'audio/ogg',
      'audio/aac': 'audio/aac',
      'audio/m4a': 'audio/mp4',
      'audio/mp4': 'audio/mp4',
      'audio/x-m4a': 'audio/mp4',
    };
    const cleanMime = supportedAudioMimes[rawMime] || 'audio/webm';

    const systemInstruction = `You are a supportive, encouraging English speaking teacher specializing in teaching Uzbek students who are beginner English learners (CEFR Pre-A1 to A1), including blind and low-vision learners.
Your role is to listen to the student's real recorded voice, transcribe what they said accurately, and evaluate their speaking attempt with bilingual English and Uzbek guidance.

Evaluation Guidelines:
1. Absolute Beginner Perspective: Be warm, constructive, gentle, and confidence-building.
2. Accents: Do NOT penalize foreign or Uzbek accents simply for being non-native. Value communicative intelligibility.
3. Clarity: Evaluate if words are clearly articulated for beginner level.
4. Grammar/Sentence Structure: Check if words fit beginner patterns (e.g. "My name is...", "I like...").
5. Relevance: Check if they answered the prompt/question.
6. Reliability Check: If the audio has no speech, is completely unintelligible noise, empty silence, or cut off, mark isReliable = false, set transcript to "", and provide unclearReason with kind guidance asking them to record again in a quiet room. NEVER invent a transcript when recording is unclear.
7. Bilingual Feedback:
   - Provide positive feedback in warm English and explain their strengths in simple natural Uzbek (Latin script: O'zbekcha).
   - Explain key corrections gently in simple Uzbek (Latin script) so beginner Uzbek learners immediately understand what to adjust.
   - Provide one improved, clear English example sentence.
   - Offer a short actionable English practice tip.
8. Spoken Summary: Formulate a short 2-3 sentence audio-friendly summary that will be read aloud to a blind student via screen reader or voice synthesis.`;

    const promptText = `Please listen to this student audio recording and evaluate it.
Target Topic: "${topicTitle || 'General Beginner Practice'}"
Speaking Question: "${question || 'Practice Question'}"
Expected Student Level: "${expectedLevel || 'Pre-A1 to A1 beginner'}"

Evaluate the audio accurately and return the JSON response with bilingual English and Uzbek fields.`;

    const schemaConfig = {
      systemInstruction,
      temperature: 0.2,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isReliable: {
            type: Type.BOOLEAN,
            description: 'Whether the audio contains recognizable speech that could be evaluated',
          },
          unclearReason: {
            type: Type.STRING,
            description: 'If isReliable is false, explaining why (e.g., silence, heavy background noise)',
          },
          transcript: {
            type: Type.STRING,
            description: 'Exact verbatim transcription of what the student said in English, or empty string if unclear',
          },
          clarityScore: {
            type: Type.INTEGER,
            description: 'Pronunciation and clarity score on a scale from 1 (unclear) to 5 (excellent)',
          },
          grammarScore: {
            type: Type.INTEGER,
            description: 'Grammar and vocabulary appropriateness from 1 to 5 for beginner level',
          },
          relevanceScore: {
            type: Type.INTEGER,
            description: 'Relevance to the question from 1 to 5',
          },
          positiveFeedback: {
            type: Type.STRING,
            description: 'Warm English praise highlighting what the student did well (e.g., clear pronunciation, confident greeting)',
          },
          uzbekFeedback: {
            type: Type.STRING,
            description: 'Simple, encouraging explanation in Uzbek (Latin script) of what the student did well',
          },
          gentleCorrection: {
            type: Type.STRING,
            description: 'Gentle, encouraging tip in English on one specific thing to improve',
          },
          uzbekCorrection: {
            type: Type.STRING,
            description: 'Key correction explained in simple, supportive Uzbek (Latin script)',
          },
          improvedEnglishExample: {
            type: Type.STRING,
            description: 'One polished, natural beginner English example sentence',
          },
          nextPracticeTip: {
            type: Type.STRING,
            description: 'An actionable speaking exercise or sentence starter for their next attempt in English',
          },
          spokenSummary: {
            type: Type.STRING,
            description: 'Concise spoken feedback summary designed to be read aloud to a blind learner',
          },
        },
        required: [
          'isReliable',
          'transcript',
          'clarityScore',
          'grammarScore',
          'relevanceScore',
          'positiveFeedback',
          'uzbekFeedback',
          'gentleCorrection',
          'uzbekCorrection',
          'improvedEnglishExample',
          'nextPracticeTip',
          'spokenSummary',
        ],
      },
    };

    const callModel = async (modelName: string) => {
      return await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            parts: [
              {
                inlineData: {
                  data: cleanBase64,
                  mimeType: cleanMime,
                },
              },
              {
                text: promptText,
              },
            ],
          },
        ],
        config: schemaConfig,
      });
    };

    let response;
    const modelToUse = 'gemini-3.8-flash';
    let lastError: any = null;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        response = await callModel(modelToUse);
        break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Speech evaluation attempt ${attempt} with ${modelToUse} failed:`, err?.status, err?.message);
        if (attempt < 2) {
          // Brief backoff if model is experiencing temporary demand spikes (e.g. 503)
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
    }

    if (!response) {
      throw lastError || new Error(`Failed to evaluate speech with ${modelToUse}`);
    }

    const responseText = response.text || '{}';
    const parsed = JSON.parse(responseText);

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error evaluating speech with Gemini:', error);
    return res.status(500).json({
      error: 'Speech evaluation failed.',
      details: error?.message || 'AI service error',
      isReliable: false,
      unclearReason: 'AI service encountered a temporary error. Please try recording again.',
    });
  }
});

// In-memory student coin state to enforce atomic balance integrity & prevent duplicate awards on server
interface ServerStudentAvatarState {
  coinsBalance: number;
  ownedItemIds: Set<string>;
  completedActivityKeys: Set<string>;
  avatarConfig?: any;
}
const serverStudentState = new Map<string, ServerStudentAvatarState>();

function getOrCreateServerStudent(studentId: string): ServerStudentAvatarState {
  if (!serverStudentState.has(studentId)) {
    serverStudentState.set(studentId, {
      coinsBalance: 0,
      ownedItemIds: new Set([
        'short-crop',
        'curly-crop',
        'natural-waves',
        'starter-navy-tee',
        'starter-emerald-polo',
        'starter-sunny-hoodie',
        'starter-plum-sweater',
        'eye-style-gentle',
        'eye-style-round',
        'eye-color-dark-brown',
        'eye-color-hazel',
      ]),
      completedActivityKeys: new Set(),
    });
  }
  return serverStudentState.get(studentId)!;
}

// Server endpoint: Save avatar appearance
app.post('/api/avatar/save-appearance', (req, res) => {
  const { studentId, avatarConfig } = req.body;
  if (!studentId || !avatarConfig) {
    return res.status(400).json({ error: 'Missing studentId or avatarConfig' });
  }
  const student = getOrCreateServerStudent(studentId);
  student.avatarConfig = avatarConfig;
  return res.json({ success: true, avatarConfig: student.avatarConfig });
});

// Server endpoint: Securely award coins (with strict once-per-activity check)
app.post('/api/avatar/award-coins', (req, res) => {
  const { studentId, amount, activityKey, description } = req.body;
  if (!studentId || !activityKey || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Invalid reward request parameters' });
  }

  const student = getOrCreateServerStudent(studentId);

  // Deduplication check: Coins can only be awarded once per qualifying activity
  if (student.completedActivityKeys.has(activityKey)) {
    return res.json({
      success: false,
      balance: student.coinsBalance,
      message: 'Activity has already been awarded coins previously.',
      alreadyAwarded: true,
    });
  }

  if (amount <= 0) {
    return res.status(400).json({ error: 'Reward amount must be positive' });
  }

  student.coinsBalance += amount;
  student.completedActivityKeys.add(activityKey);

  console.log(`[COINS AWARDED] Student ${studentId} +${amount} for ${activityKey}. New balance: ${student.coinsBalance}`);

  return res.json({
    success: true,
    balance: student.coinsBalance,
    message: `Earned ${amount} English Coins!`,
    activityKey,
  });
});

// Server endpoint: Secure purchase item
app.post('/api/avatar/purchase-item', (req, res) => {
  const { studentId, itemId, price } = req.body;
  if (!studentId || !itemId || typeof price !== 'number') {
    return res.status(400).json({ error: 'Invalid purchase parameters' });
  }

  const student = getOrCreateServerStudent(studentId);

  if (student.ownedItemIds.has(itemId)) {
    return res.json({
      success: true,
      balance: student.coinsBalance,
      message: 'Item already owned.',
      ownedItemIds: Array.from(student.ownedItemIds),
    });
  }

  if (student.coinsBalance < price) {
    return res.status(400).json({
      success: false,
      balance: student.coinsBalance,
      message: `Not enough coins. Need ${price} coins, but currently have ${student.coinsBalance}.`,
    });
  }

  student.coinsBalance -= price;
  student.ownedItemIds.add(itemId);

  console.log(`[ITEM PURCHASED] Student ${studentId} bought ${itemId} for ${price} coins. Remaining balance: ${student.coinsBalance}`);

  return res.json({
    success: true,
    balance: student.coinsBalance,
    ownedItemIds: Array.from(student.ownedItemIds),
    message: 'Item purchased successfully!',
  });
});

// Server Endpoint: Real Lesson Completion & Automatic Coin Reward (Anti-Cheating)
app.post('/api/lessons/verify-and-complete', (req, res) => {
  const { studentId, topicId, lessonId, category, verificationData } = req.body;
  if (!studentId || !topicId || !lessonId) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const student = getOrCreateServerStudent(studentId);
  const activityKey = `lesson-${topicId}-${lessonId}`;

  // Deduplication check: if already completed, do not award duplicate coins
  if (student.completedActivityKeys.has(activityKey)) {
    return res.json({
      success: true,
      alreadyCompleted: true,
      coinsAwarded: 0,
      balance: student.coinsBalance,
      message: 'Lesson already completed previously. Practice progress recorded.',
      activityKey,
    });
  }

  // Verify genuine learning participation based on lesson category
  let isValidCompletion = false;
  let reason = '';

  if (category === 'vocabulary') {
    // Requires quiz score >= 60%
    const { quizScore, quizTotal } = verificationData || {};
    if (typeof quizScore === 'number' && typeof quizTotal === 'number' && quizTotal > 0) {
      const percentage = quizScore / quizTotal;
      if (percentage >= 0.6) {
        isValidCompletion = true;
      } else {
        reason = `Practice quiz score (${Math.round(percentage * 100)}%) is below the required 60% passing mark. Please review the words and try again!`;
      }
    } else {
      reason = 'Vocabulary practice quiz must be completed with at least 60% passing score.';
    }
  } else if (category === 'sentences') {
    // Requires sentence pattern practice + comprehension check
    const { patternsPracticedCount, comprehensionPassed } = verificationData || {};
    if (comprehensionPassed === true && (patternsPracticedCount || 0) >= 1) {
      isValidCompletion = true;
    } else {
      reason = 'Sentence building pattern practice and comprehension check must be completed.';
    }
  } else if (category === 'practice' || category === 'conversation') {
    // Requires dialogue listening + comprehension questions
    const { questionsCorrectCount, totalQuestions, listenedDialogue } = verificationData || {};
    if (listenedDialogue && (questionsCorrectCount || 0) >= 1) {
      isValidCompletion = true;
    } else {
      reason = 'Conversation dialogue listening and comprehension questions must be completed.';
    }
  } else {
    // Speaking / other verified activity
    const { hasValidAudioOrInput } = verificationData || {};
    if (hasValidAudioOrInput) {
      isValidCompletion = true;
    } else {
      reason = 'Meaningful speaking activity or accessible text alternative required.';
    }
  }

  if (!isValidCompletion) {
    return res.status(400).json({
      success: false,
      error: reason || 'Genuine learning activity completion requirements not yet met.',
    });
  }

  // Atomically award 20 coins
  const awardAmount = 20;
  student.coinsBalance += awardAmount;
  student.completedActivityKeys.add(activityKey);

  console.log(`[VERIFIED LESSON COMPLETION] Student ${studentId} completed ${activityKey} (+${awardAmount} coins). New balance: ${student.coinsBalance}`);

  return res.json({
    success: true,
    alreadyCompleted: false,
    coinsAwarded: awardAmount,
    balance: student.coinsBalance,
    message: `🎉 Lesson Verified & Completed! You automatically earned ${awardAmount} English Coins!`,
    activityKey,
  });
});

// Server Endpoint: Verified Speaking Activity Reward (10 Coins)
app.post('/api/rewards/verify-speaking', (req, res) => {
  const { studentId, topicId, promptIndex, hasSpokenOrSubmitted } = req.body;
  if (!studentId || !topicId || typeof promptIndex !== 'number') {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  if (!hasSpokenOrSubmitted) {
    return res.status(400).json({ error: 'Valid speaking submission or accessible alternative required.' });
  }

  const student = getOrCreateServerStudent(studentId);
  const activityKey = `speaking-${topicId}-${promptIndex}`;

  if (student.completedActivityKeys.has(activityKey)) {
    return res.json({
      success: true,
      alreadyAwarded: true,
      coinsAwarded: 0,
      balance: student.coinsBalance,
      message: 'Speaking practice recorded. Coins were already awarded previously.',
    });
  }

  const awardAmount = 10;
  student.coinsBalance += awardAmount;
  student.completedActivityKeys.add(activityKey);

  return res.json({
    success: true,
    alreadyAwarded: false,
    coinsAwarded: awardAmount,
    balance: student.coinsBalance,
    message: `🎉 Speaking Activity Verified! +${awardAmount} English Coins.`,
    activityKey,
  });
});

// Server Endpoint: Verified Topic Test & Milestone Rewards (30, 50, 100 Coins)
app.post('/api/rewards/verify-topic-test', (req, res) => {
  const { studentId, topicId, score, totalQuestions, passed, completedLessonIds, totalTopicLessons } = req.body;
  if (!studentId || !topicId) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  if (!passed || (typeof score === 'number' && typeof totalQuestions === 'number' && score / totalQuestions < 0.6)) {
    return res.status(400).json({ error: 'Test not passed. Must achieve at least 60%.' });
  }

  const student = getOrCreateServerStudent(studentId);
  const testKey = `test-pass-${topicId}`;
  let totalCoinsAwarded = 0;
  const awardsGiven: string[] = [];

  // 1. 30 Coins for passing topic test (once)
  if (!student.completedActivityKeys.has(testKey)) {
    student.coinsBalance += 30;
    student.completedActivityKeys.add(testKey);
    totalCoinsAwarded += 30;
    awardsGiven.push('30 coins for passing Topic Test');
  }

  // 2. 50 Coins for completing all required lessons AND passing test in a topic (once)
  const masteryKey = `topic-mastery-${topicId}`;
  const allLessonsDone = Array.isArray(completedLessonIds) && totalTopicLessons > 0 && completedLessonIds.length >= totalTopicLessons;
  if (allLessonsDone && !student.completedActivityKeys.has(masteryKey)) {
    student.coinsBalance += 50;
    student.completedActivityKeys.add(masteryKey);
    totalCoinsAwarded += 50;
    awardsGiven.push('50 coins for mastering entire topic');
  }

  // 3. 100 Coins for completing all 20 topics (once)
  const all20Key = 'milestone-all-20-topics';
  const passedTestKeys = Array.from(student.completedActivityKeys).filter((k) => k.startsWith('test-pass-'));
  if (passedTestKeys.length >= 20 && !student.completedActivityKeys.has(all20Key)) {
    student.coinsBalance += 100;
    student.completedActivityKeys.add(all20Key);
    totalCoinsAwarded += 100;
    awardsGiven.push('100 coins for completing all 20 topics curriculum');
  }

  return res.json({
    success: true,
    totalCoinsAwarded,
    balance: student.coinsBalance,
    awardsGiven,
    message: totalCoinsAwarded > 0
      ? `🎉 Congratulations! Earned ${totalCoinsAwarded} English Coins!`
      : 'Topic test verified. Coins were already awarded previously.',
  });
});

// AI Conversation Practice Endpoint powered by Gemini 3.8 Flash
app.post('/api/conversation-practice', async (req, res) => {
  try {
    const { topicTitle, scenarioContext, studentMessage, history } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured.',
        reply: "Hello! I am happy to practice English with you. What is your name?",
        suggestions: ["Hello!", "My name is...", "Nice to meet you!"]
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are a warm, kind, and encouraging English speaking partner for an absolute beginner student who is blind or low-vision (CEFR Pre-A1 to A1).
Current Learning Topic: "${topicTitle || 'General English Practice'}"
Scenario Context: "${scenarioContext || 'Friendly conversation'}"

Rules for Conversation:
1. Keep your reply short: 1 or 2 simple sentences maximum.
2. Use clear, easy vocabulary (Pre-A1/A1).
3. Do not use emojis, markdown formatting, or bullet points in the reply because it is read aloud by screen readers.
4. Always ask one simple, friendly question to invite the student to speak next.
5. Provide 2-3 short suggested starter phrases that the student can say in reply.`;

    // Construct conversation history for Gemini
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: studentMessage || 'Hello!' }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.4,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: 'Short 1-2 sentence English response for a beginner learner, audio-friendly without emojis',
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2 to 3 simple suggested English reply options for the learner',
            },
          },
          required: ['reply', 'suggestions'],
        },
      },
    });

    const responseText = response.text || '{}';
    const parsed = JSON.parse(responseText);

    return res.json({
      reply: parsed.reply || "Hello! It is wonderful to practice English with you. How are you today?",
      suggestions: parsed.suggestions || ["I am good, thank you!", "I am happy!", "How are you?"],
    });
  } catch (err: any) {
    console.error('Conversation practice API error:', err);
    return res.json({
      reply: "Hello! That was a great sentence. How are you doing today?",
      suggestions: ["I am doing well!", "I am happy to learn English.", "Nice to talk with you!"],
    });
  }
});

// Teacher Role & Administrative Access Verification Endpoint
app.post('/api/admin/verify-teacher-access', (req, res) => {
  const { userRole, isApproved } = req.body;
  if (userRole === 'teacher' && isApproved === true) {
    return res.json({ authorized: true, message: 'Teacher administrator verified.' });
  }
  return res.status(403).json({ 
    authorized: false, 
    error: 'Access denied. Administrative settings and database configuration are restricted to verified teacher administrators.' 
  });
});

// Server-side Authorization for Database Configuration
app.post('/api/admin/save-supabase-config', (req, res) => {
  const { userRole, isApproved, url, anonKey } = req.body;
  if (!userRole || userRole !== 'teacher' || isApproved !== true) {
    return res.status(403).json({
      authorized: false,
      error: 'Access denied. Only verified teachers can configure Supabase project settings.'
    });
  }

  if (!url || typeof url !== 'string' || !url.startsWith('https://')) {
    return res.status(400).json({ error: 'Invalid Supabase Project URL. Must begin with https://' });
  }

  if (!anonKey || typeof anonKey !== 'string' || anonKey.trim().length < 20) {
    return res.status(400).json({ error: 'Invalid publishable anon key.' });
  }

  // Safety check: ensure no service-role key is mistakenly stored
  if (anonKey.toLowerCase().includes('service_role') || anonKey.toLowerCase().includes('secret')) {
    return res.status(400).json({ 
      error: 'Security Warning: Never enter the service-role secret key. Only enter the public Anon key.' 
    });
  }

  return res.json({ success: true, message: 'Supabase configuration validated and authorized.' });
});

// ==============================================================================
// TEACHER DASHBOARD & EDUCATIONAL MANAGEMENT ENDPOINTS
// ==============================================================================

// In-memory data store for teacher management
interface ServerCurriculumState {
  publishedTopics: any[] | null;
  draftTopics: any[] | null;
  auditLogs: any[];
}
const serverCurriculum: ServerCurriculumState = {
  publishedTopics: null,
  draftTopics: null,
  auditLogs: [],
};

const serverClasses: any[] = [
  {
    id: 'class-beginner-a',
    teacherId: 'teacher-bahora',
    teacherName: 'Teacher Bahora',
    name: "Teacher Bahora's English Cohort",
    description: 'Level 1 & 2 Adult English Learners cohort focused on daily conversation.',
    studentIds: ['student-david', 'student-elena', 'student-carlos', 'student-amina'],
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  }
];

const serverAssignments: any[] = [
  {
    id: 'asn-1',
    classId: 'class-beginner-a',
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
    studentIds: ['student-david', 'student-elena', 'student-carlos', 'student-amina'],
    createdAt: new Date().toISOString(),
  }
];

const serverSubmissions: any[] = [
  {
    id: 'sub-asn-1-student-david',
    assignmentId: 'asn-1',
    studentId: 'student-david',
    studentName: 'David',
    status: 'assigned',
  },
  {
    id: 'sub-asn-1-student-elena',
    assignmentId: 'asn-1',
    studentId: 'student-elena',
    studentName: 'Elena',
    status: 'assigned',
  },
  {
    id: 'sub-asn-1-student-carlos',
    assignmentId: 'asn-1',
    studentId: 'student-carlos',
    studentName: 'Carlos',
    status: 'assigned',
  },
  {
    id: 'sub-asn-1-student-amina',
    assignmentId: 'asn-1',
    studentId: 'student-amina',
    studentName: 'Amina',
    status: 'assigned',
  }
];

const serverTeacherFeedback: any[] = [];
const serverStudentAdjustments: any[] = [];

// Teacher Authorization Middleware
function requireTeacherOrAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const role = (req.headers['x-user-role'] as string) || req.body?.userRole;
  const isApproved = req.headers['x-user-approved'] === 'true' || req.body?.isApproved === true;

  if ((role === 'teacher' || role === 'admin') && isApproved) {
    return next();
  }

  return res.status(403).json({
    error: 'Access denied. You must be an authorized teacher or administrator to access this educational management feature.',
    authorized: false
  });
}

// 1. Publish Curriculum (Teacher Only)
app.post('/api/teacher/curriculum/publish', requireTeacherOrAdmin, (req, res) => {
  const { topics, teacherId, teacherName } = req.body;
  if (!Array.isArray(topics) || topics.length === 0) {
    return res.status(400).json({ error: 'Invalid curriculum topics.' });
  }

  serverCurriculum.publishedTopics = topics;
  serverCurriculum.draftTopics = null;
  const log = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    teacherId: teacherId || 'teacher',
    teacherName: teacherName || 'Teacher',
    action: 'publish_curriculum',
    topicId: 'all',
    description: `Published updated curriculum with ${topics.length} topics.`,
    timestamp: new Date().toISOString()
  };
  serverCurriculum.auditLogs.unshift(log);

  console.log(`[CURRICULUM PUBLISHED] by ${teacherName || teacherId}. Topics: ${topics.length}`);
  return res.json({ success: true, message: 'Curriculum published successfully live to students.', auditLog: log });
});

// 2. Save Curriculum Draft (Teacher Only)
app.post('/api/teacher/curriculum/save-draft', requireTeacherOrAdmin, (req, res) => {
  const { topics, teacherId, teacherName } = req.body;
  if (!Array.isArray(topics)) {
    return res.status(400).json({ error: 'Invalid draft topics.' });
  }

  serverCurriculum.draftTopics = topics;
  const log = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    teacherId: teacherId || 'teacher',
    teacherName: teacherName || 'Teacher',
    action: 'save_draft',
    topicId: 'all',
    description: `Saved draft curriculum with ${topics.length} topics.`,
    timestamp: new Date().toISOString()
  };
  serverCurriculum.auditLogs.unshift(log);

  return res.json({ success: true, message: 'Curriculum draft saved.', auditLog: log });
});

// 3. Get Curriculum & Draft
app.get('/api/teacher/curriculum', (req, res) => {
  return res.json({
    publishedTopics: serverCurriculum.publishedTopics,
    draftTopics: serverCurriculum.draftTopics,
    auditLogs: serverCurriculum.auditLogs
  });
});

// 4. Classes (Teacher Only)
app.get('/api/teacher/classes', requireTeacherOrAdmin, (req, res) => {
  return res.json({ classes: serverClasses });
});

app.post('/api/teacher/classes', requireTeacherOrAdmin, (req, res) => {
  const { name, description, studentIds, teacherId, teacherName } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Class name is required.' });
  }

  const newClass = {
    id: `class-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    teacherId: teacherId || 'teacher',
    teacherName: teacherName || 'Teacher',
    name: name.trim(),
    description: (description || '').trim(),
    studentIds: Array.isArray(studentIds) ? studentIds : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  serverClasses.push(newClass);
  return res.json({ success: true, class: newClass });
});

// 5. Assignments (Teacher Only)
app.get('/api/teacher/assignments', requireTeacherOrAdmin, (req, res) => {
  return res.json({ assignments: serverAssignments, submissions: serverSubmissions });
});

app.post('/api/teacher/assignments', requireTeacherOrAdmin, (req, res) => {
  const { classId, className, title, type, topicId, topicTitle, lessonId, lessonTitle, instructions, dueDate, studentIds, teacherId, teacherName } = req.body;
  if (!title || !topicId || !studentIds || !Array.isArray(studentIds)) {
    return res.status(400).json({ error: 'Missing required assignment fields.' });
  }

  const newAsn = {
    id: `asn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    classId,
    className,
    teacherId: teacherId || 'teacher',
    teacherName: teacherName || 'Teacher',
    title: title.trim(),
    type: type || 'lesson',
    topicId,
    topicTitle,
    lessonId,
    lessonTitle,
    instructions: instructions || '',
    dueDate: dueDate || '',
    studentIds,
    createdAt: new Date().toISOString(),
  };

  serverAssignments.unshift(newAsn);

  studentIds.forEach((sId: string) => {
    serverSubmissions.unshift({
      id: `sub-${newAsn.id}-${sId}`,
      assignmentId: newAsn.id,
      studentId: sId,
      status: 'assigned',
    });
  });

  return res.json({ success: true, assignment: newAsn });
});

// 6. Review Assignment Submission (Teacher Only)
app.post('/api/teacher/assignments/review', requireTeacherOrAdmin, (req, res) => {
  const { submissionId, score, feedback, reviewerName } = req.body;
  const sub = serverSubmissions.find(s => s.id === submissionId);
  if (!sub) {
    return res.status(404).json({ error: 'Submission not found.' });
  }

  sub.status = 'reviewed';
  sub.score = score;
  sub.teacherFeedback = feedback;
  sub.reviewedAt = new Date().toISOString();
  sub.reviewedBy = reviewerName || 'Teacher';

  return res.json({ success: true, submission: sub });
});

// 7. Teacher Feedback (Teacher Only)
app.post('/api/teacher/feedback', requireTeacherOrAdmin, (req, res) => {
  const { studentId, studentName, teacherId, teacherName, targetType, targetId, targetTitle, feedbackText, praisePoints, improvementTip } = req.body;
  if (!studentId || !feedbackText) {
    return res.status(400).json({ error: 'studentId and feedbackText are required.' });
  }

  const newFeedback = {
    id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    studentId,
    studentName: studentName || 'Student',
    teacherId: teacherId || 'teacher',
    teacherName: teacherName || 'Teacher',
    targetType: targetType || 'general',
    targetId: targetId || '',
    targetTitle: targetTitle || 'Feedback',
    feedbackText,
    praisePoints,
    improvementTip,
    createdAt: new Date().toISOString(),
    isReadByStudent: false
  };

  serverTeacherFeedback.unshift(newFeedback);
  return res.json({ success: true, feedback: newFeedback });
});

// 8. Auditable Student Account Adjustment (Teacher Only)
app.post('/api/teacher/adjust-student', requireTeacherOrAdmin, (req, res) => {
  const { studentId, studentName, coinAdjustment, badgeId, reason, teacherId, teacherName } = req.body;
  if (!studentId || typeof coinAdjustment !== 'number' || !reason || reason.trim().length < 5) {
    return res.status(400).json({ error: 'Valid studentId, coinAdjustment number, and mandatory reason (min 5 chars) required.' });
  }

  if (Math.abs(coinAdjustment) > 100) {
    return res.status(400).json({ error: 'Adjustment limit is bounded between -100 and +100 coins.' });
  }

  const student = getOrCreateServerStudent(studentId);
  const prevBalance = student.coinsBalance;
  student.coinsBalance = Math.max(0, student.coinsBalance + coinAdjustment);

  const adjRecord = {
    id: `adj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    studentId,
    studentName: studentName || 'Student',
    teacherId: teacherId || 'teacher',
    teacherName: teacherName || 'Teacher',
    coinAdjustment,
    badgeId,
    reason: reason.trim(),
    timestamp: new Date().toISOString()
  };
  serverStudentAdjustments.unshift(adjRecord);

  console.log(`[STUDENT ADJUSTMENT AUDIT] ${teacherName} adjusted ${studentId} by ${coinAdjustment}. Reason: ${reason}. Balance: ${prevBalance} -> ${student.coinsBalance}`);

  return res.json({
    success: true,
    newBalance: student.coinsBalance,
    record: adjRecord,
    message: `Adjusted balance by ${coinAdjustment >= 0 ? `+${coinAdjustment}` : coinAdjustment} coins.`
  });
});

// 9. Student Endpoints (Students accessing their own assigned work & feedback)
app.get('/api/student/assignments/:studentId', (req, res) => {
  const { studentId } = req.params;
  const assigned = serverAssignments.filter(a => a.studentIds.includes(studentId));
  const submissions = serverSubmissions.filter(s => s.studentId === studentId);
  return res.json({ assignments: assigned, submissions });
});

app.get('/api/student/feedback/:studentId', (req, res) => {
  const { studentId } = req.params;
  const feedback = serverTeacherFeedback.filter(f => f.studentId === studentId);
  return res.json({ feedback });
});

app.post('/api/student/feedback/:id/read', (req, res) => {
  const { id } = req.params;
  const fb = serverTeacherFeedback.find(f => f.id === id);
  if (fb) {
    fb.isReadByStudent = true;
  }
  return res.json({ success: true });
});

// --- REAL-TIME STUDENT-TEACHER & COMMUNITY MESSAGING ---
const serverDirectMessages: any[] = [];
const serverCommunityPresence: any[] = [];
const serverCommunityGroupMessages: any[] = [];

// Registry for Teacher Bahora's active authenticated Supabase UUID
const serverVerifiedTeacher = {
  id: '',
  name: 'Teacher Bahora',
  email: 'btoyirova1982@gmail.com',
};

app.post('/api/teacher/register-verified-uuid', (req, res) => {
  const { id, name, email } = req.body;
  if (id && typeof id === 'string' && id.trim().length > 10) {
    serverVerifiedTeacher.id = id.trim();
    if (name) serverVerifiedTeacher.name = name;
    if (email) serverVerifiedTeacher.email = email;
    console.log(`[TEACHER REGISTERED] Registered verified teacher ${serverVerifiedTeacher.name} (${serverVerifiedTeacher.id})`);
    return res.json({ success: true, teacher: serverVerifiedTeacher });
  }
  return res.status(400).json({ error: 'Valid teacher id is required.' });
});

app.get('/api/teacher/verified-id', (_req, res) => {
  if (serverVerifiedTeacher.id) {
    return res.json({ success: true, teacher: serverVerifiedTeacher });
  }
  return res.json({ success: false, teacher: null });
});

app.post('/api/messages/send', (req, res) => {
  const msg = req.body;
  if (!msg || !msg.senderId || !msg.receiverId) {
    return res.status(400).json({ error: 'senderId and receiverId are required.' });
  }

  // Canonicalize IDs if teacher UUID is known
  let senderId = msg.senderId;
  let receiverId = msg.receiverId;
  if (serverVerifiedTeacher.id) {
    if (senderId === 'teacher-bahora' || senderId.toLowerCase().includes('bahora')) {
      senderId = serverVerifiedTeacher.id;
    }
    if (receiverId === 'teacher-bahora' || receiverId.toLowerCase().includes('bahora')) {
      receiverId = serverVerifiedTeacher.id;
    }
  }

  const savedMsg = {
    ...msg,
    senderId,
    receiverId,
    id: msg.id || `dm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: msg.createdAt || new Date().toISOString(),
    isRead: false,
  };
  serverDirectMessages.push(savedMsg);
  return res.json({ success: true, message: savedMsg });
});

app.get('/api/messages/history', (req, res) => {
  const { user1, user2 } = req.query as { user1: string; user2: string };
  if (!user1 || !user2) {
    return res.status(400).json({ error: 'user1 and user2 query parameters are required.' });
  }

  const matchesUser = (msgUser: string, queryUser: string): boolean => {
    if (msgUser === queryUser) return true;
    if (serverVerifiedTeacher.id) {
      const isMsgTeacher = msgUser === 'teacher-bahora' || msgUser === serverVerifiedTeacher.id || msgUser.toLowerCase().includes('bahora');
      const isQueryTeacher = queryUser === 'teacher-bahora' || queryUser === serverVerifiedTeacher.id || queryUser.toLowerCase().includes('bahora');
      if (isMsgTeacher && isQueryTeacher) return true;
    } else {
      const isMsgTeacher = msgUser === 'teacher-bahora' || msgUser.toLowerCase().includes('bahora');
      const isQueryTeacher = queryUser === 'teacher-bahora' || queryUser.toLowerCase().includes('bahora');
      if (isMsgTeacher && isQueryTeacher) return true;
    }
    return false;
  };

  const history = serverDirectMessages.filter(
    (m) =>
      (matchesUser(m.senderId, user1) && matchesUser(m.receiverId, user2)) ||
      (matchesUser(m.senderId, user2) && matchesUser(m.receiverId, user1))
  );
  return res.json({ messages: history });
});

app.post('/api/messages/mark-read', (req, res) => {
  const { senderId, receiverId } = req.body;
  serverDirectMessages.forEach((m) => {
    if (
      (m.senderId === senderId && m.receiverId === receiverId) ||
      (serverVerifiedTeacher.id && m.senderId === serverVerifiedTeacher.id && receiverId === m.receiverId)
    ) {
      m.isRead = true;
    }
  });
  return res.json({ success: true });
});

app.post('/api/community/presence', (req, res) => {
  const profile = req.body;
  if (profile && profile.studentId) {
    const idx = serverCommunityPresence.findIndex((p) => p.studentId === profile.studentId);
    if (idx >= 0) {
      serverCommunityPresence[idx] = profile;
    } else {
      serverCommunityPresence.push(profile);
    }
  }
  return res.json({ success: true });
});

app.get('/api/community/presence', (req, res) => {
  return res.json({ presence: serverCommunityPresence });
});

app.post('/api/community/group-messages', (req, res) => {
  const msg = req.body;
  if (!msg || !msg.groupId || !msg.senderId) {
    return res.status(400).json({ error: 'groupId and senderId are required.' });
  }
  serverCommunityGroupMessages.push(msg);
  return res.json({ success: true, message: msg });
});

app.get('/api/community/group-messages/:groupId', (req, res) => {
  const { groupId } = req.params;
  const msgs = serverCommunityGroupMessages.filter((m) => m.groupId === groupId);
  return res.json({ messages: msgs });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
