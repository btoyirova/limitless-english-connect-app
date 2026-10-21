export type AvatarPresentation = 'female' | 'male' | 'neutral';

export interface AvatarConfig {
  characterName: string;
  presentation: AvatarPresentation;
  skinTone: string; // 'fair', 'peach', 'honey', 'amber', 'bronze', 'deep'
  eyeStyle: string; // 'round', 'gentle', 'almond', 'sparkle'
  eyeColor: string; // 'dark-brown', 'hazel', 'emerald', 'sapphire', 'amber'
  hairStyle: string; // starter & shop hairstyles
  hairColor: string; // 'jet-black', 'deep-brown', 'golden-blonde', 'auburn', 'silver-gray'
  clothing: string; // starter & shop outfits (shirts, dresses, jackets, suits)
  accessory: string; // 'none', 'studio-headphones', 'reading-glasses', 'aviator-sunglasses', 'winter-beanie', 'woven-scarf', 'champion-star'
}

export type ShopCategory = 'presentation' | 'hairStyle' | 'hairColor' | 'eyeStyle' | 'eyeColor' | 'clothing' | 'accessory' | 'skinTone';

export interface ShopItem {
  id: string;
  name: string;
  category: ShopCategory;
  price: number;
  description: string;
  isStarter?: boolean;
}

export interface CoinTransaction {
  id: string;
  studentId: string;
  amount: number; // positive for earn, negative for purchase
  activityKey: string;
  description: string;
  timestamp: string;
}

export interface StudentAvatarProfile {
  studentId: string;
  avatarConfig: AvatarConfig;
  coinsBalance: number;
  ownedItemIds: string[];
  completedActivityKeys: string[];
  updatedAt: string;
}

// Interactive Learning Activities Types
export interface ListenAndChooseOption {
  id: string;
  text: string;
  textUz?: string;
  isCorrect: boolean;
}

export interface ListenAndChooseItem {
  id: string;
  audioPrompt: string; // The English sentence or mini-conversation to listen to
  audioPromptUz?: string;
  question: string;
  questionUz?: string;
  options: ListenAndChooseOption[];
  explanation: string;
  explanationUz?: string;
}

export interface VocabularyWordItem {
  id: string;
  word: string;
  phonetic: string;
  definition: string;
  meaningUz?: string; // Natural Uzbek translation in Latin script
  exampleSentence: string;
  exampleSentenceUz?: string;
  audioHint: string;
  audioHintUz?: string;
}

export interface SentenceBuilderItem {
  id: string;
  instruction: string;
  instructionUz?: string;
  targetSentence: string;
  targetSentenceUz?: string;
  scrambledWords: string[];
  hint: string;
  hintUz?: string;
}

export interface AIRoleplayScenario {
  id: string;
  scenarioTitle: string;
  scenarioTitleUz?: string;
  aiPartnerName?: string;
  aiRole: string;
  aiRoleUz?: string;
  contextDescription: string;
  contextDescriptionUz?: string;
  initialAIGreeting: string;
  initialAIGreetingUz?: string;
  suggestedStudentStarters: string[];
  suggestedStudentStartersUz?: string[];
}

export interface SpeakingMissionItem {
  id: string;
  missionTitle: string;
  missionTitleUz?: string;
  promptQuestion: string;
  promptQuestionUz?: string;
  sentenceStarters?: string[];
  sentenceStartersUz?: string[];
  sampleGoodAnswer: string;
  sampleGoodAnswerUz?: string;
  teacherEncouragement: string;
  teacherEncouragementUz?: string;
}

export interface TranslationExerciseItem {
  id: string;
  type: 'word-match' | 'sentence-choice' | 'listen-identify' | 'sentence-translate';
  englishPrompt: string;
  uzbekPrompt: string;
  options?: { id: string; text: string; isCorrect: boolean }[];
  correctAnswer: string;
  explanationUz: string;
  explanationEn: string;
  hintUz: string;
}
