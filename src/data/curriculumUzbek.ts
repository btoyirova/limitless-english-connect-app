import { ConversationTopic } from '../types';
import { TranslationExerciseItem } from '../types/avatar';

export interface TopicTranslationData {
  titleUz: string;
  subtitleUz: string;
  learningObjectiveUz: string;
  audioInstructionUz: string;
  completionMessageUz: string;
  speakingActivitiesUz: string[];
  lessonsUz: Array<{
    titleUz: string;
    itemsUz: string[];
  }>;
  dialogueUz: Array<{
    speakerUz: string;
    textUz: string;
  }>;
  promptsUz: Array<{
    questionUz: string;
    sentenceStartersUz: string[];
    exampleAnswerUz: string;
    teacherTipUz: string;
  }>;
  listenAndChooseUz?: Array<{
    audioPromptUz: string;
    questionUz: string;
    explanationUz: string;
    optionsUz: string[];
  }>;
  vocabularyUz?: Array<{
    meaningUz: string;
    exampleSentenceUz: string;
    audioHintUz: string;
  }>;
  sentenceBuilderUz?: Array<{
    instructionUz: string;
    targetSentenceUz: string;
    hintUz: string;
  }>;
  aiRoleplayScenarioUz?: {
    scenarioTitleUz: string;
    aiRoleUz: string;
    contextDescriptionUz: string;
    initialAIGreetingUz: string;
    suggestedStudentStartersUz: string[];
  };
  speakingMissionUz?: {
    missionTitleUz: string;
    promptQuestionUz: string;
    sampleGoodAnswerUz: string;
    teacherEncouragementUz: string;
  };
  translationExercises: TranslationExerciseItem[];
}

export const UZBEK_CURRICULUM_TRANSLATIONS: Record<string, TopicTranslationData> = {
  // ==============================================================================
  // TOPIC 1: GREETINGS AND SAYING HELLO
  // ==============================================================================
  greetings: {
    titleUz: "Salomlashish va xayrlashish",
    subtitleUz: "Odamlar bilan salomlashish, ism so'rash va xayrlashishni o'rganing.",
    learningObjectiveUz: "Odamlar bilan salomlashish, ism so'rash va ingliz tilida ishonch bilan xayrlashishni o'rganish.",
    audioInstructionUz: "1-mavzuga xush kelibsiz: Salomlashish va xayrlashish. Ushbu boshlang'ich darsda siz salomlashish, ism so'rash va xayrlashishni o'rganasiz.",
    completionMessageUz: "Ajoyib ish! Siz 1-mavzuni muvaffaqiyatli yakunladingiz. Endi inglizcha salomlashish va xayrlashishni bilasiz.",
    speakingActivitiesUz: [
      "Besh xil salomlashish iborasini tinglang va takrorlang.",
      "Kimgadir ismini so'rab savol berishni mashq qiling.",
      "O'z ismingizni aytib tanishtiring.",
      "Qisqa salomlashish suhbatini mashq qiling.",
      "O'z salomlashishingizni ovozga yozib tinglang."
    ],
    lessonsUz: [
      {
        titleUz: "1-dars: Salomlashish iboralari",
        itemsUz: ["Salom!", "Assalomu alaykum!", "Xayrli tong!", "Xayrli kun!", "Xayrli oqshom!"]
      },
      {
        titleUz: "2-dars: Xayrlashuv iboralari",
        itemsUz: ["Xayr!", "Xayr, ko'rishguncha!", "Keyinroq ko'rishguncha!", "Keyingi safar ko'rishguncha!", "Ertagacha xayr!"]
      },
      {
        titleUz: "3-dars: Birov bilan tanishish",
        itemsUz: ["Mening ismim...", "Ismingiz nima?", "Tanishganimdan xursandman.", "Men ham tanishganimdan juda xursandman."]
      }
    ],
    dialogueUz: [
      { speakerUz: "Anna", textUz: "Salom! Xayrli tong!" },
      { speakerUz: "David", textUz: "Xayrli tong!" },
      { speakerUz: "Anna", textUz: "Mening ismim Anna. Ismingiz nima?" },
      { speakerUz: "David", textUz: "Mening ismim David." },
      { speakerUz: "Anna", textUz: "Tanishganimdan xursandman, David." },
      { speakerUz: "David", textUz: "Men ham tanishganimdan xursandman." },
      { speakerUz: "Anna", textUz: "Xayr!" },
      { speakerUz: "David", textUz: "Ertagacha xayr!" }
    ],
    promptsUz: [
      {
        questionUz: "Ismingiz nima?",
        sentenceStartersUz: ["Mening ismim...", "Salom! Mening ismim...", "Salom, men..."],
        exampleAnswerUz: "Salom! Mening ismim David. Tanishganimdan xursandman!",
        teacherTipUz: "Ismingizni samimiy va baland ovozda ayting."
      },
      {
        questionUz: "Do'stingiz bilan qanday xayrlashasiz?",
        sentenceStartersUz: ["Xayr!", "Ertagacha xayr!", "Keyinroq ko'rishguncha, xayr!"],
        exampleAnswerUz: "Xayr! Keyingi safar ko'rishguncha, kuningiz yaxshi o'tsin!",
        teacherTipUz: "Yaqinda yana gaplashishingizni bilsangiz, 'See you tomorrow!' iborasidan foydalaning."
      }
    ],
    listenAndChooseUz: [
      {
        audioPromptUz: "Xayrli tong! Mening ismim Liza. Tanishganimdan xursandman!",
        questionUz: "Liza qaysi vaqtda salomlashyapti?",
        explanationUz: "Liza 'Good morning' (Xayrli tong) dedi, bu tushgacha aytiladi.",
        optionsUz: ["Ertalab (tongda)", "Tunda", "Tushdan keyin"]
      },
      {
        audioPromptUz: "Ertagacha xayr, Aleks! Oqshomingiz xayrli o'tsin.",
        questionUz: "So'zlovchi Aleksga nima demoqda?",
        explanationUz: "'See you tomorrow' va 'Have a good evening' xayrlashuv so'zlaridir.",
        optionsUz: ["Ertagacha xayrlashmoqda", "Aleksning ismini so'ramoqda", "Xayrli tong tilamoqda"]
      }
    ],
    vocabularyUz: [
      {
        meaningUz: "Uchrashganda yoki telefonga javob berganda ishlatiladigan do'stona salom so'zi.",
        exampleSentenceUz: "Salom! Bugun ahvolingiz qanday?",
        audioHintUz: "So'zni ko'tarinki ohangda ayting."
      },
      {
        meaningUz: "Tongdan to tush paytigacha bo'lgan vaqtda samimiy salomlashish.",
        exampleSentenceUz: "Xayrli tong, o'qituvchi!",
        audioHintUz: "Ikki so'zni ravon bog'lab ayting."
      },
      {
        meaningUz: "Kimdir bilan uchrashuvdan so'ng ketayotganda aytiladigan xayrlashuv.",
        exampleSentenceUz: "Xayr, ertaga ko'rishguncha!",
        audioHintUz: "Do'stona va xushfe'l ohangda ayting."
      },
      {
        meaningUz: "O'zingizni yoki boshqa odamni tanishtirish uchun ishlatiladigan so'z.",
        exampleSentenceUz: "Mening ismim Malika.",
        audioHintUz: "'Name' so'zida oxirgi 'e' harfi o'qilmaydi."
      },
      {
        meaningUz: "Yangi inson bilan tanishganda aytiladigan xushmuomala ibora.",
        exampleSentenceUz: "Siz bilan tanishganimdan juda xursandman.",
        audioHintUz: "Iliq tabassum bilan talaffuz qiling."
      }
    ],
    sentenceBuilderUz: [
      {
        instructionUz: "So'zlarni tartiblab to'g'ri salomlashish jumlasini tuzing.",
        targetSentenceUz: "Hello my name is Alex",
        hintUz: "Avval salomlashish (Hello), so'ng o'zingizni tanishtirish keladi."
      },
      {
        instructionUz: "Xayrlashuv iborasini to'g'ri tuzing.",
        targetSentenceUz: "See you tomorrow goodbye",
        hintUz: "'See you tomorrow' birikmasi oxirida 'goodbye' bilan yakunlanadi."
      }
    ],
    aiRoleplayScenarioUz: {
      scenarioTitleUz: "Yangi sinfdosh bilan salomlashish",
      aiRoleUz: "Liza (Yangi ingliz tili o'rganuvchi)",
      contextDescriptionUz: "Siz yangi sinfdoshingiz Liza bilan birinchi bor uchrashdingiz. Salomlashing va ismingizni ayting.",
      initialAIGreetingUz: "Salom! Xayrli tong! Mening ismim Liza. Sizning ismingiz nima?",
      suggestedStudentStartersUz: ["Salom Liza! Mening ismim...", "Xayrli tong! Tanishganimdan xursandman.", "Salom! Men ham o'quvchiman."]
    },
    speakingMissionUz: {
      missionTitleUz: "1-mavzu Nutq Vazifasi: Salomlashish",
      promptQuestionUz: "O'zingizni tanishtiring: salom bering, ismingizni ayting va xayrlashing.",
      sampleGoodAnswerUz: "Salom! Mening ismim Jasur. Tanishganimdan xursandman. Xayr!",
      teacherEncouragementUz: "Baland va tushunarli gapiring. Har qanday samimiy urinish rag'batlantiriladi!"
    },
    translationExercises: [
      {
        id: "tr-greetings-1",
        type: "word-match",
        englishPrompt: "Hello",
        uzbekPrompt: "Salom",
        options: [
          { id: "o1", text: "Salom", isCorrect: true },
          { id: "o2", text: "Xayr", isCorrect: false },
          { id: "o3", text: "Rahmat", isCorrect: false }
        ],
        correctAnswer: "Salom",
        explanationUz: "'Hello' so'zi o'zbek tiliga 'Salom' deb tarjima qilinadi.",
        explanationEn: "'Hello' translates to 'Salom' in Uzbek.",
        hintUz: "Uchrashganda aytiladigan asosiy so'z."
      },
      {
        id: "tr-greetings-2",
        type: "sentence-choice",
        englishPrompt: "My name is John.",
        uzbekPrompt: "Mening ismim Jon.",
        options: [
          { id: "s1", text: "Mening ismim Jon.", isCorrect: true },
          { id: "s2", text: "Uning ismi Jon.", isCorrect: false },
          { id: "s3", text: "Jon mening do'stim.", isCorrect: false }
        ],
        correctAnswer: "Mening ismim Jon.",
        explanationUz: "'My name is John' jumlasi 'Mening ismim Jon' ma'nosini bildiradi.",
        explanationEn: "'My name is John' means 'Mening ismim Jon'.",
        hintUz: "'My name' — 'Mening ismim'."
      },
      {
        id: "tr-greetings-3",
        type: "listen-identify",
        englishPrompt: "Nice to meet you.",
        uzbekPrompt: "Tanishganimdan xursandman.",
        options: [
          { id: "l1", text: "Tanishganimdan xursandman.", isCorrect: true },
          { id: "l2", text: "Kechirasiz, shoshyapman.", isCorrect: false },
          { id: "l3", text: "Qayerdansiz?", isCorrect: false }
        ],
        correctAnswer: "Tanishganimdan xursandman.",
        explanationUz: "'Nice to meet you' yangi inson bilan tanishganda aytiladi.",
        explanationEn: "'Nice to meet you' is polite when introduced.",
        hintUz: "Tanishuvdagi do'stona xushmuomala so'z."
      },
      {
        id: "tr-greetings-4",
        type: "sentence-translate",
        englishPrompt: "Goodbye! See you tomorrow.",
        uzbekPrompt: "Xayr! Ertagacha ko'rishguncha.",
        options: [
          { id: "t1", text: "Xayr! Ertagacha ko'rishguncha.", isCorrect: true },
          { id: "t2", text: "Salom! Xush kelibsiz.", isCorrect: false },
          { id: "t3", text: "Rahmat, yaxshiman.", isCorrect: false }
        ],
        correctAnswer: "Xayr! Ertagacha ko'rishguncha.",
        explanationUz: "'See you tomorrow' ertaga ko'rishguncha degani.",
        explanationEn: "'See you tomorrow' means until tomorrow.",
        hintUz: "Ertangi kun haqida xayrlashuv."
      }
    ]
  },

  // ==============================================================================
  // TOPIC 2: INTRODUCING MYSELF
  // ==============================================================================
  'introducing-myself': {
    titleUz: "O'zimni tanishtirish",
    subtitleUz: "Qayerdan ekanligingiz, yoshingiz va qayerda yashashingizni aytishni o'rganing.",
    learningObjectiveUz: "Mamlakatingiz, shahringiz, yoshingiz va o'zingiz haqingizda asosiy ma'lumotlarni berishni o'rganish.",
    audioInstructionUz: "2-mavzuga xush kelibsiz: O'zimni tanishtirish. Bu darsda qayerdan ekanligingiz va yoshingizni aytishni mashq qilasiz.",
    completionMessageUz: "Barakalla! Siz o'zingizni to'liq tanishtirishni o'rgandingiz.",
    speakingActivitiesUz: [
      "Qaysi mamlakatdan ekanligingizni aytishni mashq qiling.",
      "Yoshingizni ingliz tilida ayting.",
      "O'zingiz yashaydigan shaharni ayting.",
      "Yangi suhbatdoshga o'zingiz haqingizda uchta jumla ayting.",
      "O'z tanishtiruvingizni yozib oling."
    ],
    lessonsUz: [
      {
        titleUz: "1-dars: Qayerdan ekanlikni aytish",
        itemsUz: ["Men O'zbekistondanman.", "Men Toshkentda yashayman.", "Men o'quvchiman."]
      },
      {
        titleUz: "2-dars: Yosh haqida gapirish",
        itemsUz: ["Men 20 yoshdaman.", "Yoshingiz nechida?", "Men ingliz tilini o'rganmoqdaman."]
      }
    ],
    dialogueUz: [
      { speakerUz: "Malika", textUz: "Salom! Men Malika. Qayerdansiz?" },
      { speakerUz: "Jasur", textUz: "Salom Malika! Men Samarqanddanman. Siz-chi?" },
      { speakerUz: "Malika", textUz: "Men Toshkentdanman. Tanishganimdan xursandman!" }
    ],
    promptsUz: [
      {
        questionUz: "Qayerdansiz va qayerda yashaysiz?",
        sentenceStartersUz: ["Men ...danman", "Men ...da yashayman"],
        exampleAnswerUz: "Men O'zbekistondanman va Toshkentda yashayman.",
        teacherTipUz: "'I am from' iborasidan keyin o'z mamlakatingiz yoki shahringizni qo'ying."
      }
    ],
    listenAndChooseUz: [
      {
        audioPromptUz: "Salom! Men O'zbekistondanman va Toshkent shahrida yashayman.",
        questionUz: "So'zlovchi qayerda yashaydi?",
        explanationUz: "So'zlovchi Toshkentda yashashini aytdi.",
        optionsUz: ["Toshkentda", "Londonda", "Parijda"]
      }
    ],
    vocabularyUz: [
      {
        meaningUz: "Kelib chiqish joyingiz, tug'ilgan o'lka.",
        exampleSentenceUz: "Mening vatanim juda go'zal.",
        audioHintUz: "'Country' so'zini aniq talaffuz qiling."
      },
      {
        meaningUz: "Katta aholi yashaydigan shahar.",
        exampleSentenceUz: "Men qadimiy shaharda yashayman.",
        audioHintUz: "'City' so'zida 'c' harfi 's' tovushi beradi."
      }
    ],
    translationExercises: [
      {
        id: "tr-myself-1",
        type: "sentence-choice",
        englishPrompt: "I am from Uzbekistan.",
        uzbekPrompt: "Men O'zbekistondanman.",
        options: [
          { id: "m1", text: "Men O'zbekistondanman.", isCorrect: true },
          { id: "m2", text: "Men O'zbekistonga boryapman.", isCorrect: false }
        ],
        correctAnswer: "Men O'zbekistondanman.",
        explanationUz: "'I am from' kelib chiqish joyini bildiradi.",
        explanationEn: "'I am from' indicates origin.",
        hintUz: "'from' — dan qo'shimchasi."
      }
    ]
  },

  // ==============================================================================
  // TOPIC 3: MY FAMILY
  // ==============================================================================
  'my-family': {
    titleUz: "Mening oilam",
    subtitleUz: "Oila a'zolaringiz va yaqinlaringiz haqida gapirishni o'rganing.",
    learningObjectiveUz: "Ota-ona, aka-uka, opa-singil va oila a'zolarini inglizcha ifodalash.",
    audioInstructionUz: "3-mavzuga xush kelibsiz: Mening oilam. Bu darsda oilangiz haqida so'zlashni o'rganasiz.",
    completionMessageUz: "Tabriklaymiz! Siz oila a'zolaringiz haqida gapirishni o'rgandingiz.",
    speakingActivitiesUz: [
      "Oila a'zolaringizning nomlarini ayting.",
      "Ota-onangiz haqida bir jumla ayting.",
      "Aka-uka yoki opa-singillaringiz haqida so'zlang."
    ],
    lessonsUz: [
      {
        titleUz: "1-dars: Oila a'zolari",
        itemsUz: ["Ona", "Ota", "Aka / Uka", "Opa / Singil", "Oila"]
      }
    ],
    dialogueUz: [
      { speakerUz: "Ali", textUz: "Oilangiz kattami?" },
      { speakerUz: "Nodira", textUz: "Ha, mening ota-onam va ikkita ukam bor." }
    ],
    promptsUz: [
      {
        questionUz: "Oilangizda necha kishi bor?",
        sentenceStartersUz: ["Mening oilamda...", "Mening ota-onam..."],
        exampleAnswerUz: "Mening oilamda to'rt kishi bor: otam, onam, ukam va men.",
        teacherTipUz: "Har bir oila a'zosini ravon sanab bering."
      }
    ],
    translationExercises: [
      {
        id: "tr-fam-1",
        type: "word-match",
        englishPrompt: "Mother and father",
        uzbekPrompt: "Ona va ota",
        options: [
          { id: "f1", text: "Ona va ota", isCorrect: true },
          { id: "f2", text: "Aka va uka", isCorrect: false }
        ],
        correctAnswer: "Ona va ota",
        explanationUz: "'Mother' — ona, 'Father' — ota.",
        explanationEn: "'Mother' and 'father' mean ona va ota.",
        hintUz: "Ota-onangiz."
      }
    ]
  },

  // ==============================================================================
  // TOPIC 4: FAVORITE FOOD AND DRINKS
  // ==============================================================================
  'favorite-food-drinks': {
    titleUz: "Sevimli taomlarim va ichimliklarim",
    subtitleUz: "Taomlar, ichimliklar va o'zingiz yoqtirgan lazzatlar haqida so'zlash.",
    learningObjectiveUz: "Taom nomlari va nimalarni yaxshi ko'rishingizni ingliz tilida aytish.",
    audioInstructionUz: "4-mavzuga xush kelibsiz: Sevimli taomlarim va ichimliklarim.",
    completionMessageUz: "Qoyil! Endi siz o'zingiz sevadigan taomlar haqida bemalol gapira olasiz.",
    speakingActivitiesUz: [
      "Sevimli taomingiz nomini ayting.",
      "Qaysi ichimlikni yoqtirishingizni so'zlang."
    ],
    lessonsUz: [
      {
        titleUz: "1-dars: Taomlar va ichimliklar",
        itemsUz: ["Non", "Suv", "Choy", "Osh (Palov)", "Meva"]
      }
    ],
    dialogueUz: [
      { speakerUz: "Temur", textUz: "Sizga qaysi taom yoqadi?" },
      { speakerUz: "Zilola", textUz: "Menga palov va ko'k choy yoqadi." }
    ],
    promptsUz: [
      {
        questionUz: "Sevimli taomingiz nima?",
        sentenceStartersUz: ["Mening sevimli taomim...", "Menga ... yoqadi"],
        exampleAnswerUz: "Mening sevimli taomim palov. U juda mazali!",
        teacherTipUz: "'I like...' iborasi bilan boshlang."
      }
    ],
    translationExercises: [
      {
        id: "tr-food-1",
        type: "word-match",
        englishPrompt: "Tea and water",
        uzbekPrompt: "Choy va suv",
        options: [
          { id: "fd1", text: "Choy va suv", isCorrect: true },
          { id: "fd2", text: "Non va tuz", isCorrect: false }
        ],
        correctAnswer: "Choy va suv",
        explanationUz: "'Tea' — choy, 'water' — suv.",
        explanationEn: "'Tea' and 'water' mean choy va suv.",
        hintUz: "Eng keng tarqalgan ichimliklar."
      }
    ]
  },

  // ==============================================================================
  // TOPIC 5: HOBBIES AND FREE TIME
  // ==============================================================================
  'hobbies-free-time': {
    titleUz: "Qiziqishlar va bo'sh vaqt",
    subtitleUz: "Bo'sh vaqtingizda nimalar qilishni yoqtirishingiz haqida gapiring.",
    learningObjectiveUz: "Xobbi va bo'sh vaqt mashg'ulotlarini ingliz tilida bayon qilish.",
    audioInstructionUz: "5-mavzuga xush kelibsiz: Qiziqishlar va bo'sh vaqt.",
    completionMessageUz: "Ofarin! Siz 1-bosqichning barcha 5 ta darsini to'liq yakunladingiz!",
    speakingActivitiesUz: [
      "Bo'sh vaqtingizda nima qilishni yoqtirishingizni ayting.",
      "Musiqa yoki kitob haqida so'zlang."
    ],
    lessonsUz: [
      {
        titleUz: "1-dars: Mashg'ulotlar",
        itemsUz: ["Kitob o'qish", "Musiqa tinglash", "Sayr qilish", "Sport bilan shug'ullanish"]
      }
    ],
    dialogueUz: [
      { speakerUz: "Sardor", textUz: "Bo'sh vaqtingizda nima qilasiz?" },
      { speakerUz: "Madina", textUz: "Men musiqa tinglashni va kitob o'qishni yoqtiraman." }
    ],
    promptsUz: [
      {
        questionUz: "Bo'sh vaqtingizda nima qilishni yoqtirasiz?",
        sentenceStartersUz: ["Bo'sh vaqtimda men...", "Menga ... yoqadi"],
        exampleAnswerUz: "Bo'sh vaqtimda men kitob o'qiyman va do'stlarim bilan suhbatlashaman.",
        teacherTipUz: "'In my free time, I like to...' birikmasidan foydalaning."
      }
    ],
    translationExercises: [
      {
        id: "tr-hob-1",
        type: "word-match",
        englishPrompt: "Reading books",
        uzbekPrompt: "Kitob o'qish",
        options: [
          { id: "h1", text: "Kitob o'qish", isCorrect: true },
          { id: "h2", text: "Rasm chizish", isCorrect: false }
        ],
        correctAnswer: "Kitob o'qish",
        explanationUz: "'Reading books' kitob o'qishni bildiradi.",
        explanationEn: "'Reading books' means kitob o'qish.",
        hintUz: "Mutolaa qilish."
      }
    ]
  },

  // ==============================================================================
  // TOPIC 6: DAILY ROUTINE
  // ==============================================================================
  'daily-routine': {
    titleUz: "Kun tartibim",
    subtitleUz: "Ertalabdan kechgacha bajaradigan odatiy ishlaringiz haqida gapiring.",
    learningObjectiveUz: "Uyg'onish, nonushta qilish, o'qish va uxlash kabi kundalik harakatlarni ifodalash.",
    audioInstructionUz: "6-mavzuga xush kelibsiz: Kun tartibim.",
    completionMessageUz: "Ajoyib! Siz o'z kun tartibingizni ingliz tilida tushuntira olasiz.",
    speakingActivitiesUz: ["Ertalab soat nechada uyg'onishingizni ayting."],
    lessonsUz: [{ titleUz: "1-dars: Kundalik harakatlar", itemsUz: ["Ertalab uyg'onish", "Nonushta qilish", "Darsga borish", "Uxlashga yotish"] }],
    dialogueUz: [{ speakerUz: "Bobur", textUz: "Ertalab soat nechada turasiz?" }, { speakerUz: "Kamola", textUz: "Men soat yettida uyg'onaman." }],
    promptsUz: [{ questionUz: "Kundalik tartibingiz qanday?", sentenceStartersUz: ["Men ertalab..."], exampleAnswerUz: "Men soat yettida turaman va nonushta qilaman.", teacherTipUz: "Vaqtni aniq ayting." }],
    translationExercises: [{ id: "tr-rt-1", type: "word-match", englishPrompt: "Wake up early", uzbekPrompt: "Erta uyg'onish", options: [{ id: "r1", text: "Erta uyg'onish", isCorrect: true }, { id: "r2", text: "Kech uxlash", isCorrect: false }], correctAnswer: "Erta uyg'onish", explanationUz: "'Wake up' — uyg'onish.", explanationEn: "'Wake up' means uyg'onish.", hintUz: "Tongda turish." }]
  },

  // ==============================================================================
  // TOPIC 7: DAYS, TIME, AND DATES
  // ==============================================================================
  'days-time-dates': {
    titleUz: "Kunlar, vaqt va sanalar",
    subtitleUz: "Hafta kunlari, soat necha bo'lgani va sanalarni so'rash hamda aytish.",
    learningObjectiveUz: "Hafta kunlari va vaqtni ingliz tilida aniq ifodalash.",
    audioInstructionUz: "7-mavzuga xush kelibsiz: Kunlar, vaqt va sanalar.",
    completionMessageUz: "Qoyilmaqom! Endi siz vaqt va sanalarni ravon ayta olasiz.",
    speakingActivitiesUz: ["Bugun qaysi kun ekanini ayting."],
    lessonsUz: [{ titleUz: "1-dars: Hafta kunlari", itemsUz: ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"] }],
    dialogueUz: [{ speakerUz: "Otabek", textUz: "Bugun qaysi kun?" }, { speakerUz: "Dildora", textUz: "Bugun juma kuni." }],
    promptsUz: [{ questionUz: "Bugun qaysi kun va soat necha?", sentenceStartersUz: ["Bugun..."], exampleAnswerUz: "Bugun dushanba, soat to'qqiz.", teacherTipUz: "'Today is...' iborasidan foydalaning." }],
    translationExercises: [{ id: "tr-dt-1", type: "word-match", englishPrompt: "Friday", uzbekPrompt: "Juma", options: [{ id: "d1", text: "Juma", isCorrect: true }, { id: "d2", text: "Yakshanba", isCorrect: false }], correctAnswer: "Juma", explanationUz: "'Friday' — Juma kuni.", explanationEn: "'Friday' means juma.", hintUz: "Haftaning 5-kuni." }]
  },

  // ==============================================================================
  // TOPIC 8: SHOPPING AND PRICES
  // ==============================================================================
  'shopping-prices': {
    titleUz: "Xarid qilish va narxlar",
    subtitleUz: "Do'konda narx so'rash va xarid qilish iboralari.",
    learningObjectiveUz: "Narx so'rash va to'lov haqida suhbatlashish.",
    audioInstructionUz: "8-mavzuga xush kelibsiz: Xarid qilish va narxlar.",
    completionMessageUz: "Ofarin! Siz do'konda mustaqil xarid qila olasiz.",
    speakingActivitiesUz: ["Biror narsa qancha turishini so'rang."],
    lessonsUz: [{ titleUz: "1-dars: Do'kondagi iboralar", itemsUz: ["Bu qancha turadi?", "Menga mana bu kerak.", "Rahmat."] }],
    dialogueUz: [{ speakerUz: "Mijoz", textUz: "Bu olma qancha turadi?" }, { speakerUz: "Sotuvchi", textUz: "U ikki dollar turadi." }],
    promptsUz: [{ questionUz: "Do'konda narxni qanday so'raysiz?", sentenceStartersUz: ["Bu qancha..."], exampleAnswerUz: "Kechirasiz, bu qancha turadi?", teacherTipUz: "'How much is this?' iborasini yodda tuting." }],
    translationExercises: [{ id: "tr-sh-1", type: "sentence-choice", englishPrompt: "How much is this?", uzbekPrompt: "Bu qancha turadi?", options: [{ id: "sh1", text: "Bu qancha turadi?", isCorrect: true }, { id: "sh2", text: "Bu qayerda?", isCorrect: false }], correctAnswer: "Bu qancha turadi?", explanationUz: "'How much is this?' narx so'rashda ishlatiladi.", explanationEn: "'How much is this?' asks for price.", hintUz: "Narxini bilmoqchisiz." }]
  },

  // ==============================================================================
  // TOPIC 9: MY HOME AND MY ROOM
  // ==============================================================================
  'home-room': {
    titleUz: "Mening uyim va xonam",
    subtitleUz: "Uyingiz, xonangiz va mebellar haqida gapirish.",
    learningObjectiveUz: "Xona, stol, stul va uydagi jihozlarni inglizcha nomlash.",
    audioInstructionUz: "9-mavzuga xush kelibsiz: Mening uyim va xonam.",
    completionMessageUz: "Barakalla! Uyingiz haqida inglizcha so'zlashni o'rgandingiz.",
    speakingActivitiesUz: ["O'z xonangizni tasvirlang."],
    lessonsUz: [{ titleUz: "1-dars: Uydagi xonalar", itemsUz: ["Yotoqxona", "Oshxona", "Mehmonxona", "Baland qulay divan"] }],
    dialogueUz: [{ speakerUz: "Anvar", textUz: "Xonangiz qanday?" }, { speakerUz: "Shaxnoza", textUz: "Mening xonam yorug' va qulay." }],
    promptsUz: [{ questionUz: "Uyingizda nechta xona bor?", sentenceStartersUz: ["Mening uyimda..."], exampleAnswerUz: "Mening uyimda uchta xona bor.", teacherTipUz: "'There are...' iborasidan foydalaning." }],
    translationExercises: [{ id: "tr-hm-1", type: "word-match", englishPrompt: "Living room", uzbekPrompt: "Mehmonxona", options: [{ id: "hm1", text: "Mehmonxona", isCorrect: true }, { id: "hm2", text: "Oshxona", isCorrect: false }], correctAnswer: "Mehmonxona", explanationUz: "'Living room' — mehmonxona.", explanationEn: "'Living room' means mehmonxona.", hintUz: "Mehmonlar o'tiradigan xona." }]
  },

  // ==============================================================================
  // TOPIC 10: WEATHER AND SEASONS
  // ==============================================================================
  'weather-seasons': {
    titleUz: "Ob-havo va fasllar",
    subtitleUz: "Bugungi ob-havo, fasllar va quyoshli kunlar haqida so'zlash.",
    learningObjectiveUz: "Ob-havo va to'rt faslni ingliz tilida aytishni o'rganish.",
    audioInstructionUz: "10-mavzuga xush kelibsiz: Ob-havo va fasllar.",
    completionMessageUz: "Ajoyib! Siz 2-bosqichni ham to'liq tamomladingiz!",
    speakingActivitiesUz: ["Bugun havo qanday ekanini ayting."],
    lessonsUz: [{ titleUz: "1-dars: Ob-havo", itemsUz: ["Quyoshli", "Yomg'irli", "Iliq", "Sovuq"] }],
    dialogueUz: [{ speakerUz: "Rustam", textUz: "Bugun havo qanday?" }, { speakerUz: "Dilnoza", textUz: "Bugun havo juda quyoshli va iliq." }],
    promptsUz: [{ questionUz: "Sizga qaysi fasl ko'proq yoqadi?", sentenceStartersUz: ["Menga ... yoqadi"], exampleAnswerUz: "Menga bahor fasli yoqadi, chunki havo iliq.", teacherTipUz: "'Spring' — bahor, 'Summer' — yoz." }],
    translationExercises: [{ id: "tr-wth-1", type: "word-match", englishPrompt: "Sunny weather", uzbekPrompt: "Quyoshli ob-havo", options: [{ id: "w1", text: "Quyoshli ob-havo", isCorrect: true }, { id: "w2", text: "Qorli kun", isCorrect: false }], correctAnswer: "Quyoshli ob-havo", explanationUz: "'Sunny' — quyoshli.", explanationEn: "'Sunny' means quyoshli.", hintUz: "Quyosh charqlab turganda." }]
  },

  // ==============================================================================
  // TOPIC 11: ORDERING AT A RESTAURANT
  // ==============================================================================
  'ordering-restaurant': {
    titleUz: "Restoranda buyurtma berish",
    subtitleUz: "Kafeda ovqat buyurtma qilish va hisobni so'rash.",
    learningObjectiveUz: "Ofitsiant bilan xushmuomala muloqot qilish va taom buyurtma berish.",
    audioInstructionUz: "11-mavzuga xush kelibsiz: Restoranda buyurtma berish.",
    completionMessageUz: "Qoyil! Endi siz chet eldagi istalgan restoranda buyurtma bera olasiz.",
    speakingActivitiesUz: ["Choy yoki qahva buyurtma qiling."],
    lessonsUz: [{ titleUz: "1-dars: Buyurtma iboralari", itemsUz: ["Men ... xohlardim", "Iltimos, menyuni bering", "Hisobni bersangiz"] }],
    dialogueUz: [{ speakerUz: "Ofitsiant", textUz: "Nima buyurtma qilasiz?" }, { speakerUz: "Mijoz", textUz: "Menga bir piyola choy, iltimos." }],
    promptsUz: [{ questionUz: "Kafeda qanday buyurtma berasiz?", sentenceStartersUz: ["Iltimos, menga..."], exampleAnswerUz: "Menga bir stakan suv bering, iltimos.", teacherTipUz: "'I would like...' xushmuomala so'rovdir." }],
    translationExercises: [{ id: "tr-res-1", type: "sentence-choice", englishPrompt: "Can I have the menu, please?", uzbekPrompt: "Menyuni bersangiz bo'ladimi, iltimos?", options: [{ id: "r1", text: "Menyuni bersangiz bo'ladimi, iltimos?", isCorrect: true }, { id: "r2", text: "Hisobni to'layman.", isCorrect: false }], correctAnswer: "Menyuni bersangiz bo'ladimi, iltimos?", explanationUz: "Menyu so'rashda aytiladi.", explanationEn: "Polite request for the menu.", hintUz: "Taomnoma so'rash." }]
  },

  // ==============================================================================
  // TOPIC 12: ASKING FOR DIRECTIONS
  // ==============================================================================
  'asking-directions': {
    titleUz: "Yo'l so'rash va yo'nalishlar",
    subtitleUz: "Shaharda adashib qolmaslik va yo'l so'rash iboralari.",
    learningObjectiveUz: "O'ngga, chapga, to'g'riga burilish va manzilni so'rashni o'rganish.",
    audioInstructionUz: "12-mavzuga xush kelibsiz: Yo'l so'rash va yo'nalishlar.",
    completionMessageUz: "Ofarin! Siz shaharda erkin yo'l so'ray olasiz.",
    speakingActivitiesUz: ["Kutubxona qayerda ekanini so'rang."],
    lessonsUz: [{ titleUz: "1-dars: Yo'nalishlar", itemsUz: ["To'g'riga yuring", "O'ngga buriling", "Chapga buriling", "Yaqinida"] }],
    dialogueUz: [{ speakerUz: "Sayyoh", textUz: "Kechirasiz, metro qayerda?" }, { speakerUz: "O'tkinchi", textUz: "To'g'riga yuring va o'ngga buriling." }],
    promptsUz: [{ questionUz: "Biror joy qayerdaligini qanday so'raysiz?", sentenceStartersUz: ["Kechirasiz, ... qayerda?"], exampleAnswerUz: "Kechirasiz, vokzal qayerda joylashgan?", teacherTipUz: "'Where is...?' deb boshlang." }],
    translationExercises: [{ id: "tr-dir-1", type: "word-match", englishPrompt: "Turn left", uzbekPrompt: "Chapga buriling", options: [{ id: "d1", text: "Chapga buriling", isCorrect: true }, { id: "d2", text: "O'ngga yuring", isCorrect: false }], correctAnswer: "Chapga buriling", explanationUz: "'Left' — chap tomon.", explanationEn: "'Left' means chap.", hintUz: "Chap tomonga yo'nalish." }]
  },

  // ==============================================================================
  // TOPIC 13: MAKING FRIENDS
  // ==============================================================================
  'making-friends': {
    titleUz: "Yangi do'stlar orttirish",
    subtitleUz: "Samimiy suhbat boshlash va do'stona munosabat qurish.",
    learningObjectiveUz: "Yangi tanishlar bilan do'stona muloqot o'rnatish.",
    audioInstructionUz: "13-mavzuga xush kelibsiz: Yangi do'stlar orttirish.",
    completionMessageUz: "Juda yaxshi! Endi siz ingliz tilida erkin do'st orttirasiz.",
    speakingActivitiesUz: ["Yangi do'stingizga xushmuomala savol bering."],
    lessonsUz: [{ titleUz: "1-dars: Do'stona savollar", itemsUz: ["Bugun kuningiz qanday o'tdi?", "Nima bilan bandsiz?", "Yana ko'rishamiz!"] }],
    dialogueUz: [{ speakerUz: "Sam", textUz: "Bugun birga qahva ichamizmi?" }, { speakerUz: "Lobar", textUz: "Albatta, bajonidil!" }],
    promptsUz: [{ questionUz: "Do'stingizni birga aylanib kelishga qanday taklif qilasiz?", sentenceStartersUz: ["Keling, birga..."], exampleAnswerUz: "Keling, birga bog'da sayr qilamiz.", teacherTipUz: "'Let's go together' deb ayting." }],
    translationExercises: [{ id: "tr-fr-1", type: "word-match", englishPrompt: "Good friend", uzbekPrompt: "Yaxshi do'st", options: [{ id: "f1", text: "Yaxshi do'st", isCorrect: true }, { id: "f2", text: "Yangi tanish", isCorrect: false }], correctAnswer: "Yaxshi do'st", explanationUz: "'Friend' — do'st.", explanationEn: "'Friend' means do'st.", hintUz: "Yaqin inson." }]
  },

  // ==============================================================================
  // TOPIC 14: VISITING THE DOCTOR
  // ==============================================================================
  'visiting-doctor': {
    titleUz: "Shifokor qabulida",
    subtitleUz: "Sog'liq, o'zingizni qanday his qilayotganingiz va shifokor bilan so'zlashuv.",
    learningObjectiveUz: "O'zini yomon his qilganda yoki dorixonada holatini tushuntira olish.",
    audioInstructionUz: "14-mavzuga xush kelibsiz: Shifokor qabulida.",
    completionMessageUz: "Barakalla! Sog'liq haqidagi muhim iboralarni o'rgandingiz.",
    speakingActivitiesUz: ["Bosh og'rig'i haqida shifokorga ayting."],
    lessonsUz: [{ titleUz: "1-dars: Sog'liq iboralari", itemsUz: ["Mening boshim og'riyapti", "Haroratim baland", "Dori kerak"] }],
    dialogueUz: [{ speakerUz: "Shifokor", textUz: "Qayeringiz og'riyapti?" }, { speakerUz: "Bemor", textUz: "Boshim og'riyapti va tomoq og'rig'i bor." }],
    promptsUz: [{ questionUz: "O'zingizni yomon his qilsangiz nima deysiz?", sentenceStartersUz: ["Men o'zimni..."], exampleAnswerUz: "Men o'zimni biroz yomon his qilyapman.", teacherTipUz: "'I have a headache' — boshim og'riyapti." }],
    translationExercises: [{ id: "tr-doc-1", type: "sentence-choice", englishPrompt: "I need some medicine.", uzbekPrompt: "Menga dori kerak.", options: [{ id: "dc1", text: "Menga dori kerak.", isCorrect: true }, { id: "dc2", text: "Men shifokorman.", isCorrect: false }], correctAnswer: "Menga dori kerak.", explanationUz: "'Medicine' — dori-darmon.", explanationEn: "'Medicine' means dori.", hintUz: "Sog'ayish uchun kerak bo'lgan vosita." }]
  },

  // ==============================================================================
  // TOPIC 15: TRAVEL AND TRANSPORT
  // ==============================================================================
  'travel-transport': {
    titleUz: "Sayohat va transport",
    subtitleUz: "Samolyot, poyezd, avtobus va sayohat chiptalari haqida suhbat.",
    learningObjectiveUz: "Sayohat va jamoat transportida erkin harakatlanish.",
    audioInstructionUz: "15-mavzuga xush kelibsiz: Sayohat va transport.",
    completionMessageUz: "Qoyil! Siz 3-bosqichni muvaffaqiyatli yakunladingiz!",
    speakingActivitiesUz: ["Poyezd chiptasini so'rang."],
    lessonsUz: [{ titleUz: "1-dars: Transport vositalari", itemsUz: ["Poyezd", "Avtobus", "Samolyot", "Chipta"] }],
    dialogueUz: [{ speakerUz: "Yo'lovchi", textUz: "Buxoroga bitta chipta bersangiz." }, { speakerUz: "Kassir", textUz: "Mana chiptangiz, xayrli safar!" }],
    promptsUz: [{ questionUz: "Sayohat qilishni yoqtirasizmi?", sentenceStartersUz: ["Menga sayohat..."], exampleAnswerUz: "Ha, menga poyezdda yangi shaharlarga borish yoqadi.", teacherTipUz: "'I love traveling' deb ayting." }],
    translationExercises: [{ id: "tr-tr-1", type: "word-match", englishPrompt: "Train ticket", uzbekPrompt: "Poyezd chiptasi", options: [{ id: "t1", text: "Poyezd chiptasi", isCorrect: true }, { id: "t2", text: "Avtobus bekati", isCorrect: false }], correctAnswer: "Poyezd chiptasi", explanationUz: "'Train' — poyezd, 'ticket' — chipta.", explanationEn: "'Train ticket' means poyezd chiptasi.", hintUz: "Temir yo'l yo'lovchisi hujjati." }]
  },

  // ==============================================================================
  // TOPIC 16: PAST EXPERIENCES
  // ==============================================================================
  'past-experiences': {
    titleUz: "O'tgan voqealar va xotiralar",
    subtitleUz: "Kecha, o'tgan hafta yoki bolalikda nimalar bo'lganini aytish.",
    learningObjectiveUz: "O'tgan zamon (Past Simple) yordamida kechagi voqealarni hikoya qilish.",
    audioInstructionUz: "16-mavzuga xush kelibsiz: O'tgan voqealar va xotiralar.",
    completionMessageUz: "Ofarin! Siz o'tgan zamonda erkin gapirishni boshladingiz.",
    speakingActivitiesUz: ["Kecha nima qilganingizni ayting."],
    lessonsUz: [{ titleUz: "1-dars: O'tgan zamon fe'llari", itemsUz: ["Men bordim (I went)", "Men ko'rdim (I saw)", "Men qildim (I did)"] }],
    dialogueUz: [{ speakerUz: "Ulug'bek", textUz: "Kecha nima qildingiz?" }, { speakerUz: "Shohida", textUz: "Men kutubxonaga bordim va kitob o'qidim." }],
    promptsUz: [{ questionUz: "O'tgan dam olish kunlarida nima qildingiz?", sentenceStartersUz: ["O'tgan dam olish kuni men..."], exampleAnswerUz: "O'tgan yakshanba kuni men oilam bilan dam oldim.", teacherTipUz: "O'tgan zamon fe'llaridan foydalaning." }],
    translationExercises: [{ id: "tr-pst-1", type: "sentence-choice", englishPrompt: "I went to school yesterday.", uzbekPrompt: "Men kecha maktabga bordim.", options: [{ id: "p1", text: "Men kecha maktabga bordim.", isCorrect: true }, { id: "p2", text: "Men maktabda o'qiyman.", isCorrect: false }], correctAnswer: "Men kecha maktabga bordim.", explanationUz: "'went' — 'bordim' (o'tgan zamon).", explanationEn: "'went' is past tense of go.", hintUz: "Kecha sodir bo'lgan ish." }]
  },

  // ==============================================================================
  // TOPIC 17: FUTURE PLANS
  // ==============================================================================
  'future-plans': {
    titleUz: "Kelajakdagi rejalar",
    subtitleUz: "Ertaga, keyingi oy yoki kelajakda nimalar qilmoqchi ekaningiz.",
    learningObjectiveUz: "'will' va 'going to' yordamida kelajak rejalarini tuzish.",
    audioInstructionUz: "17-mavzuga xush kelibsiz: Kelajakdagi rejalar.",
    completionMessageUz: "Barakalla! Endi siz o'z rejalaringizni aniq bayon qilasiz.",
    speakingActivitiesUz: ["Ertangi rejangizni ayting."],
    lessonsUz: [{ titleUz: "1-dars: Kelajak zamon", itemsUz: ["Men qilmoqchiman (I am going to)", "Men o'rganaman (I will learn)"] }],
    dialogueUz: [{ speakerUz: "Behzod", textUz: "Yozda nima qilasiz?" }, { speakerUz: "Zuxra", textUz: "Men tog'ga boraman va ingliz tilini o'rganaman." }],
    promptsUz: [{ questionUz: "Kelajakdagi eng katta maqsadingiz nima?", sentenceStartersUz: ["Men kelajakda..."], exampleAnswerUz: "Men ingliz tilida ravon so'zlashmoqchiman.", teacherTipUz: "'I want to...' yoki 'I will...' deb boshlang." }],
    translationExercises: [{ id: "tr-fut-1", type: "sentence-choice", englishPrompt: "I will study English tomorrow.", uzbekPrompt: "Men ertaga ingliz tilini o'rganaman.", options: [{ id: "f1", text: "Men ertaga ingliz tilini o'rganaman.", isCorrect: true }, { id: "f2", text: "Men kecha inglizcha o'qidim.", isCorrect: false }], correctAnswer: "Men ertaga ingliz tilini o'rganaman.", explanationUz: "'will study' — kelasi zamon.", explanationEn: "'will study' is future tense.", hintUz: "Ertangi harakat." }]
  },

  // ==============================================================================
  // TOPIC 18: EXPRESSING OPINIONS
  // ==============================================================================
  'expressing-opinions': {
    titleUz: "Fikr bildirish",
    subtitleUz: "O'z qarashingizni ifodalash, qo'shilish yoki rad etish.",
    learningObjectiveUz: "'I think', 'In my opinion' kabi iboralar bilan o'z fikrini himoya qilish.",
    audioInstructionUz: "18-mavzuga xush kelibsiz: Fikr bildirish.",
    completionMessageUz: "Ajoyib natija! Fikringizni mustaqil ifoda eta olasiz.",
    speakingActivitiesUz: ["O'z fikringizni bayon eting."],
    lessonsUz: [{ titleUz: "1-dars: Fikr iboralari", itemsUz: ["Menimcha (I think)", "Mening fikrimcha (In my opinion)", "Men qo'shilaman (I agree)"] }],
    dialogueUz: [{ speakerUz: "Timur", textUz: "Ingliz tili qiyinmi?" }, { speakerUz: "Shahzod", textUz: "Menimcha, agar har kuni mashq qilsangiz, u juda qiziq va oson." }],
    promptsUz: [{ questionUz: "Kitob o'qish haqida qanday fikrdasiz?", sentenceStartersUz: ["Menimcha, kitob..."], exampleAnswerUz: "Mening fikrimcha, kitob o'qish insonni boyitadi.", teacherTipUz: "'In my opinion...' bilan boshlang." }],
    translationExercises: [{ id: "tr-op-1", type: "word-match", englishPrompt: "I agree with you", uzbekPrompt: "Men sizga qo'shilaman", options: [{ id: "o1", text: "Men sizga qo'shilaman", isCorrect: true }, { id: "o2", text: "Fikrim boshqacha", isCorrect: false }], correctAnswer: "Men sizga qo'shilaman", explanationUz: "'I agree' — roziman, qo'shilaman.", explanationEn: "'I agree' expresses agreement.", hintUz: "Bir fikrda bo'lish." }]
  },

  // ==============================================================================
  // TOPIC 19: EVERYDAY PROBLEMS
  // ==============================================================================
  'everyday-problems': {
    titleUz: "Kundalik muammolar va yechimlar",
    subtitleUz: "Yordam so'rash, uzr so'rash va vaziyatdan chiqish yo'llari.",
    learningObjectiveUz: "Kundalik qiyinchiliklarda ingliz tilida yordam so'rash.",
    audioInstructionUz: "19-mavzuga xush kelibsiz: Kundalik muammolar va yechimlar.",
    completionMessageUz: "Ofarin! Siz har qanday vaziyatda inglizcha yordam so'ray olasiz.",
    speakingActivitiesUz: ["Yordam so'rash jumlasini ayting."],
    lessonsUz: [{ titleUz: "1-dars: Yordam so'rash", itemsUz: ["Menga yordam bera olasizmi?", "Kechirasiz, tushunmadim", "Iltimos, qaytara olasizmi?"] }],
    dialogueUz: [{ speakerUz: "Talaba", textUz: "Kechirasiz, menga yordam bera olasizmi?" }, { speakerUz: "Ustoz", textUz: "Albatta, qanday yordam bera olaman?" }],
    promptsUz: [{ questionUz: "Biror narsani tushunmay qolsangiz nima deysiz?", sentenceStartersUz: ["Kechirasiz, iltimos..."], exampleAnswerUz: "Kechirasiz, sekinroq gapira olasizmi?", teacherTipUz: "'Could you please repeat?' deb so'rang." }],
    translationExercises: [{ id: "tr-prb-1", type: "sentence-choice", englishPrompt: "Could you please help me?", uzbekPrompt: "Iltimos, menga yordam bera olasizmi?", options: [{ id: "pb1", text: "Iltimos, menga yordam bera olasizmi?", isCorrect: true }, { id: "pb2", text: "Men yordam berolmayman.", isCorrect: false }], correctAnswer: "Iltimos, menga yordam bera olasizmi?", explanationUz: "Xushmuomala yordam so'rovi.", explanationEn: "Polite request for assistance.", hintUz: "Madaniy yordam so'rash." }]
  },

  // ==============================================================================
  // TOPIC 20: MY DREAMS AND GOALS
  // ==============================================================================
  'dreams-goals': {
    titleUz: "Mening orzularim va maqsadlarim",
    subtitleUz: "Kelajakdagi orzular, kasbiy maqsadlar va muvaffaqiyat cho'qqisi.",
    learningObjectiveUz: "Katta orzular va til o'rganishdagi eng yuksak marralarni ifodalash.",
    audioInstructionUz: "20-mavzuga xush kelibsiz: Mening orzularim va maqsadlarim. Siz 20-mavzu marrasidasiz!",
    completionMessageUz: "TABRIKLAYMIZ! Siz butun 20 ta mavzuni to'liq yakunladingiz! Siz cheksiz imkoniyatlar sohibisiz!",
    speakingActivitiesUz: ["Eng katta orzuingiz haqida to'liq inglizcha gapiring."],
    lessonsUz: [{ titleUz: "1-dars: Orzular", itemsUz: ["Mening orzuim (My dream is)", "Men ishonaman (I believe)", "Muvaffaqiyat (Success)"] }],
    dialogueUz: [{ speakerUz: "O'qituvchi", textUz: "Siz 20 ta mavzuni bitirdingiz! Qanday his qilyapsiz?" }, { speakerUz: "O'quvchi", textUz: "Men o'zim bilan faxrlanaman! Inglizcha gapirish juda ajoyib!" }],
    promptsUz: [{ questionUz: "Ingliz tilini o'rgangach nima qilmoqchisiz?", sentenceStartersUz: ["Mening orzuim..."], exampleAnswerUz: "Mening orzuim dunyo bo'ylab sayohat qilish va yangi do'stlar orttirish.", teacherTipUz: "Ishonch va g'urur bilan gapiring!" }],
    translationExercises: [{ id: "tr-drm-1", type: "sentence-choice", englishPrompt: "My dream is to speak English fluently.", uzbekPrompt: "Mening orzuim ingliz tilida ravon so'zlashish.", options: [{ id: "dm1", text: "Mening orzuim ingliz tilida ravon so'zlashish.", isCorrect: true }, { id: "dm2", text: "Men orzu qilmayman.", isCorrect: false }], correctAnswer: "Mening orzuim ingliz tilida ravon so'zlashish.", explanationUz: "'fluently' — ravon, bemalol.", explanationEn: "'fluently' means ravon.", hintUz: "Yuksak marra." }]
  }
};

/**
 * Augments curriculum topics with structured Uzbek translations and translation exercises.
 */
export function augmentTopicsWithUzbek(topics: ConversationTopic[]): ConversationTopic[] {
  return topics.map((topic) => {
    const uzData = UZBEK_CURRICULUM_TRANSLATIONS[topic.id];
    if (!uzData) return topic;

    const mergedLessons = topic.lessons.map((lesson, idx) => {
      const uzLesson = uzData.lessonsUz?.[idx];
      return {
        ...lesson,
        titleUz: lesson.titleUz || uzLesson?.titleUz || lesson.title,
        itemsUz: lesson.itemsUz || uzLesson?.itemsUz || lesson.items,
      };
    });

    const mergedDialogue = topic.dialogue.map((line, idx) => {
      const uzLine = uzData.dialogueUz?.[idx];
      return {
        ...line,
        speakerUz: uzLine?.speakerUz || line.speaker,
        textUz: uzLine?.textUz || line.text,
      };
    });

    const mergedPrompts = topic.prompts.map((prompt, idx) => {
      const uzPrompt = uzData.promptsUz?.[idx];
      return {
        ...prompt,
        questionUz: uzPrompt?.questionUz || prompt.question,
        sentenceStartersUz: uzPrompt?.sentenceStartersUz || prompt.sentenceStarters,
        exampleAnswerUz: uzPrompt?.exampleAnswerUz || prompt.exampleAnswer,
        teacherTipUz: uzPrompt?.teacherTipUz || prompt.teacherTip,
      };
    });

    const mergedLc = topic.listenAndChoose?.map((item, idx) => {
      const uzLc = uzData.listenAndChooseUz?.[idx];
      return {
        ...item,
        audioPromptUz: uzLc?.audioPromptUz,
        questionUz: uzLc?.questionUz,
        explanationUz: uzLc?.explanationUz,
        options: item.options.map((opt, oIdx) => ({
          ...opt,
          textUz: uzLc?.optionsUz?.[oIdx] || opt.text,
        })),
      };
    });

    const mergedVocab = topic.vocabularyChallenge?.map((item, idx) => {
      const uzVocab = uzData.vocabularyUz?.[idx];
      return {
        ...item,
        meaningUz: uzVocab?.meaningUz,
        exampleSentenceUz: uzVocab?.exampleSentenceUz,
        audioHintUz: uzVocab?.audioHintUz,
      };
    });

    const mergedSb = topic.sentenceBuilder?.map((item, idx) => {
      const uzSb = uzData.sentenceBuilderUz?.[idx];
      return {
        ...item,
        instructionUz: uzSb?.instructionUz,
        targetSentenceUz: uzSb?.targetSentenceUz,
        hintUz: uzSb?.hintUz,
      };
    });

    const mergedAi = topic.aiRoleplayScenario
      ? {
          ...topic.aiRoleplayScenario,
          scenarioTitleUz: uzData.aiRoleplayScenarioUz?.scenarioTitleUz,
          aiRoleUz: uzData.aiRoleplayScenarioUz?.aiRoleUz,
          contextDescriptionUz: uzData.aiRoleplayScenarioUz?.contextDescriptionUz,
          initialAIGreetingUz: uzData.aiRoleplayScenarioUz?.initialAIGreetingUz,
          suggestedStudentStartersUz: uzData.aiRoleplayScenarioUz?.suggestedStudentStartersUz,
        }
      : undefined;

    const mergedSm = topic.speakingMission
      ? {
          ...topic.speakingMission,
          missionTitleUz: uzData.speakingMissionUz?.missionTitleUz,
          promptQuestionUz: uzData.speakingMissionUz?.promptQuestionUz,
          sampleGoodAnswerUz: uzData.speakingMissionUz?.sampleGoodAnswerUz,
          teacherEncouragementUz: uzData.speakingMissionUz?.teacherEncouragementUz,
        }
      : undefined;

    return {
      ...topic,
      titleUz: uzData.titleUz,
      subtitleUz: uzData.subtitleUz,
      learningObjectiveUz: uzData.learningObjectiveUz,
      audioInstructionUz: uzData.audioInstructionUz,
      completionMessageUz: uzData.completionMessageUz,
      speakingActivitiesUz: uzData.speakingActivitiesUz,
      lessons: mergedLessons,
      dialogue: mergedDialogue,
      prompts: mergedPrompts,
      listenAndChoose: mergedLc,
      vocabularyChallenge: mergedVocab,
      sentenceBuilder: mergedSb,
      aiRoleplayScenario: mergedAi,
      speakingMission: mergedSm,
      translationExercises: uzData.translationExercises,
    };
  });
}
