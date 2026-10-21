import { ConversationTopic } from '../types';

export const LEVEL_1_TOPICS: ConversationTopic[] = [
  // ==============================================================================
  // TOPIC 1: GREETINGS AND SAYING HELLO
  // ==============================================================================
  {
    id: 'greetings',
    title: 'Greetings and Saying Hello',
    titleUz: 'Salomlashish va xayrlashish',
    subtitle: 'Learn to greet people, ask someone’s name, and say goodbye.',
    subtitleUz: 'Odamlar bilan salomlashish, ism so‘rash va xayrlashishni o‘rganing.',
    level: 'Pre-A1',
    levelGroup: 'Level 1',
    learningObjective: 'Learn to greet people, ask someone’s name, and say goodbye with confidence.',
    learningObjectiveUz: 'Odamlar bilan salomlashish, ism so‘rash va ingliz tilida ishonch bilan xayrlashishni o‘rganish.',
    iconName: 'hand',
    color: 'blue',
    audioInstruction: 'Welcome to Topic 1: Greetings and Saying Hello. In this beginner lesson, you will learn to greet people, ask for someone’s name, and say goodbye with confidence.',
    audioInstructionUz: '1-mavzuga xush kelibsiz: Salomlashish va xayrlashish. Ushbu boshlang‘ich darsda siz salomlashish, ism so‘rash va xayrlashishni o‘rganasiz.',
    lessons: [
      {
        id: 'greet-l1',
        title: 'Lesson 1: Everyday Greetings',
        titleUz: '1-dars: Kundalik salomlashish',
        lessonNumber: 1,
        category: 'vocabulary',
        description: 'Common greetings used throughout the day.',
        descriptionUz: 'Kun davomida ishlatiladigan odatiy salomlashish so‘zlari.',
        items: [
          'Hello — Salom / Assalomu alaykum',
          'Hi — Salom (norasmiy)',
          'Good morning — Xayrli tong (ertalab)',
          'Good afternoon — Xayrli kun (tushdan keyin)',
          'Good evening — Xayrli kech / oqshom',
          'Hey — Salom / Hoy',
          'Welcome — Xush kelibsiz',
          'How are you? — Qandaysiz? / Ishlar qalay?',
          'I am fine — Men yaxshiman',
          'Great — Juda yaxshi / Zo‘r',
          'Wonderful — Ajoyib',
          'Nice to see you — Sizni ko‘rganimdan xursandman'
        ],
        itemsUz: [
          'Salom / Assalomu alaykum',
          'Salom (norasmiy)',
          'Xayrli tong (ertalab)',
          'Xayrli kun (tushdan keyin)',
          'Xayrli kech / oqshom',
          'Salom / Hoy',
          'Xush kelibsiz',
          'Qandaysiz? / Ishlar qalay?',
          'Men yaxshiman',
          'Juda yaxshi / Zo‘r',
          'Ajoyib',
          'Sizni ko‘rganimdan xursandman'
        ],
        vocabulary: [
          { english: 'Hello', uzbek: 'Salom / Assalomu alaykum', phonetic: '/həˈloʊ/', exampleSentence: 'Hello! How are you today?', exampleSentenceUz: 'Salom! Bugun ahvolingiz qanday?' },
          { english: 'Hi', uzbek: 'Salom (norasmiy)', phonetic: '/haɪ/', exampleSentence: 'Hi, my friend!', exampleSentenceUz: 'Salom, mening do‘stim!' },
          { english: 'Good morning', uzbek: 'Xayrli tong', phonetic: '/ɡʊd ˈmɔːr.nɪŋ/', exampleSentence: 'Good morning, teacher!', exampleSentenceUz: 'Xayrli tong, ustoz!' },
          { english: 'Good afternoon', uzbek: 'Xayrli kun', phonetic: '/ɡʊd ˌæf.tɚˈnuːn/', exampleSentence: 'Good afternoon, everyone.', exampleSentenceUz: 'Xayrli kun, hammaga.' },
          { english: 'Good evening', uzbek: 'Xayrli kech', phonetic: '/ɡʊd ˈiːv.nɪŋ/', exampleSentence: 'Good evening, nice to see you.', exampleSentenceUz: 'Xayrli kech, sizni ko‘rganimdan xursandman.' },
          { english: 'Welcome', uzbek: 'Xush kelibsiz', phonetic: '/ˈwel.kəm/', exampleSentence: 'Welcome to our English class!', exampleSentenceUz: 'Ingliz tili darsimizga xush kelibsiz!' },
          { english: 'How are you?', uzbek: 'Qandaysiz?', phonetic: '/haʊ ɑːr juː/', exampleSentence: 'Hello, how are you today?', exampleSentenceUz: 'Salom, bugun qandaysiz?' },
          { english: 'I am fine', uzbek: 'Men yaxshiman', phonetic: '/aɪ æm faɪn/', exampleSentence: 'I am fine, thank you.', exampleSentenceUz: 'Men yaxshiman, rahmat.' },
          { english: 'Great', uzbek: 'Juda yaxshi / Zo‘r', phonetic: '/ɡreɪt/', exampleSentence: 'I feel great today!', exampleSentenceUz: 'Bugun o‘zimni juda zo‘r his qilyapman!' },
          { english: 'Wonderful', uzbek: 'Ajoyib', phonetic: '/ˈwʌn.dɚ.fəl/', exampleSentence: 'Have a wonderful morning.', exampleSentenceUz: 'Xayrli va ajoyib tong tilayman.' },
          { english: 'Nice to see you', uzbek: 'Sizni ko‘rganimdan xursandman', phonetic: '/naɪs tuː siː juː/', exampleSentence: 'Nice to see you again!', exampleSentenceUz: 'Sizni yana ko‘rganimdan xursandman!' }
        ]
      },
      {
        id: 'greet-l2',
        title: 'Lesson 2: Saying Goodbye',
        titleUz: '2-dars: Xayrlashish iboralari',
        lessonNumber: 2,
        category: 'vocabulary',
        description: 'Polite and friendly ways to say goodbye.',
        descriptionUz: 'Xayrlashishning xushmuomala va do‘stona usullari.',
        items: [
          'Goodbye — Xayr',
          'Bye-bye — Xayr (do‘stona)',
          'See you later — Keyinroq ko‘rishguncha',
          'See you tomorrow — Ertagacha xayr',
          'See you soon — Tez orada ko‘rishguncha',
          'Have a good day — Kнингiz xayrli o‘tsin',
          'Take care — O‘zingizni ehtiyot qiling',
          'Good night — Xayrli tun',
          'Until next time — Keyingi safargacha',
          'Have a nice weekend — Dam olish kuningiz yaxshi o‘tsin'
        ],
        itemsUz: [
          'Xayr',
          'Xayr (do‘stona)',
          'Keyinroq ko‘rishguncha',
          'Ertagacha xayr',
          'Tez orada ko‘rishguncha',
          'Kuningiz xayrli o‘tsin',
          'O‘zingizni ehtiyot qiling',
          'Xayrli tun',
          'Keyingi safargacha',
          'Dam olish kuningiz yaxshi o‘tsin'
        ],
        vocabulary: [
          { english: 'Goodbye', uzbek: 'Xayr', phonetic: '/ɡʊdˈbaɪ/', exampleSentence: 'Goodbye, see you on Monday!', exampleSentenceUz: 'Xayr, dushanba kuni ko‘rishguncha!' },
          { english: 'Bye-bye', uzbek: 'Xayr', phonetic: '/ˈbaɪ.baɪ/', exampleSentence: 'Bye-bye, have fun!', exampleSentenceUz: 'Xayr, maroqli hordiq chiqaring!' },
          { english: 'See you later', uzbek: 'Keyinroq ko‘rishguncha', phonetic: '/siː juː ˈleɪ.tɚ/', exampleSentence: 'See you later at the cafe.', exampleSentenceUz: 'Keyinroq kafeda ko‘rishguncha.' },
          { english: 'See you tomorrow', uzbek: 'Ertagacha xayr', phonetic: '/siː juː təˈmɔːr.oʊ/', exampleSentence: 'See you tomorrow at nine.', exampleSentenceUz: 'Ertaga soat to‘qqizda ko‘rishguncha.' },
          { english: 'Have a good day', uzbek: 'Kuningiz xayrli o‘tsin', phonetic: '/hæv ə ɡʊd deɪ/', exampleSentence: 'Have a good day at school!', exampleSentenceUz: 'Maktabda kuningiz yaxshi o‘tsin!' },
          { english: 'Good night', uzbek: 'Xayrli tun', phonetic: '/ɡʊd naɪt/', exampleSentence: 'Good night, sweet dreams.', exampleSentenceUz: 'Xayrli tun, shirin tushlar ko‘ring.' },
          { english: 'Take care', uzbek: 'O‘zingizni ehtiyot qiling', phonetic: '/teɪk ker/', exampleSentence: 'Take care and stay safe!', exampleSentenceUz: 'O‘zingizni ehtiyot qiling va sog‘ bo‘ling!' }
        ]
      },
      {
        id: 'greet-l3',
        title: 'Lesson 3: Meeting Someone and Introductions',
        titleUz: '3-dars: Tanishish va ism aytish',
        lessonNumber: 3,
        category: 'sentences',
        description: 'Introduce your name and ask for others’ names politely.',
        descriptionUz: 'O‘z ismingizni aytish va boshqalarning ismini xushmuomalalik bilan so‘rash.',
        items: [
          'My name is... — Mening ismim...',
          'I am... — Men...',
          'What is your name? — Ismingiz nima?',
          'Nice to meet you — Tanishganimdan xursandman',
          'Nice to meet you, too — Men ham tanishganimdan xursandman',
          'Pleased to meet you — Siz bilan tanishganimdan mamnunman',
          'This is my friend — Bu mening do‘stim'
        ],
        itemsUz: [
          'Mening ismim...',
          'Men...',
          'Ismingiz nima?',
          'Tanishganimdan xursandman',
          'Men ham tanishganimdan xursandman',
          'Siz bilan tanishganimdan mamnunman',
          'Bu mening do‘stim'
        ],
        sentences: [
          {
            english: 'My name is Alex.',
            uzbek: 'Mening ismim Aleks.',
            substitutions: {
              slotName: 'Name',
              options: [
                { en: 'Alex', uz: 'Aleks' },
                { en: 'Sarah', uz: 'Sara' },
                { en: 'David', uz: 'David' },
                { en: 'Anora', uz: 'Anora' },
                { en: 'Jasur', uz: 'Jasur' }
              ]
            }
          },
          {
            english: 'What is your name?',
            uzbek: 'Ismingiz nima?'
          },
          {
            english: 'Nice to meet you, Sarah.',
            uzbek: 'Tanishganimdan xursandman, Sara.',
            substitutions: {
              slotName: 'Person',
              options: [
                { en: 'Sarah', uz: 'Sara' },
                { en: 'my friend', uz: 'do‘stim' },
                { en: 'teacher', uz: 'ustoz' }
              ]
            }
          },
          {
            english: 'Nice to meet you, too.',
            uzbek: 'Men ham tanishganimdan juda xursandman.'
          }
        ]
      },
      {
        id: 'greet-l4',
        title: 'Lesson 4: Polite Phrases and Courtesies',
        titleUz: '4-dars: Odob va muloyimlik iboralari',
        lessonNumber: 4,
        category: 'vocabulary',
        description: 'Essential polite words for every English conversation.',
        descriptionUz: 'Har bir inglizcha suhbatda kerak bo‘ladigan muloyim so‘zlar.',
        items: [
          'Please — Iltimos',
          'Thank you — Rahmat',
          'Thanks a lot — Katta rahmat',
          'You are welcome — Arzimaydi / Marhamat',
          'Excuse me — Kechirasiz (diqqatni tortish)',
          'I am sorry — Kechirasiz (uzr so‘rash)',
          'No problem — Muammo yo‘q / Hechqisi yo‘q',
          'Yes, please — Ha, iltimos',
          'No, thank you — Yo‘q, rahmat'
        ],
        itemsUz: [
          'Iltimos',
          'Rahmat',
          'Katta rahmat',
          'Arzimaydi / Marhamat',
          'Kechirasiz (diqqatni tortish)',
          'Kechirasiz (uzr so‘rash)',
          'Muammo yo‘q / Hechqisi yo‘q',
          'Ha, iltimos',
          'Yo‘q, rahmat'
        ],
        vocabulary: [
          { english: 'Please', uzbek: 'Iltimos', phonetic: '/pliːz/', exampleSentence: 'Please sit down.', exampleSentenceUz: 'Iltimos, o‘tiring.' },
          { english: 'Thank you', uzbek: 'Rahmat', phonetic: '/ˈθæŋk juː/', exampleSentence: 'Thank you for your help.', exampleSentenceUz: 'Yordamingiz uchun rahmat.' },
          { english: 'You are welcome', uzbek: 'Arzimaydi', phonetic: '/jʊər ˈwel.kəm/', exampleSentence: 'You are welcome, anytime!', exampleSentenceUz: 'Arzimaydi, doimo xursandman!' },
          { english: 'Excuse me', uzbek: 'Kechirasiz', phonetic: '/ɪkˈskjuːz miː/', exampleSentence: 'Excuse me, where is the room?', exampleSentenceUz: 'Kechirasiz, xona qayerda?' },
          { english: 'I am sorry', uzbek: 'Kechirasiz (uzr)', phonetic: '/aɪ æm ˈsɔːr.i/', exampleSentence: 'I am sorry, I am late.', exampleSentenceUz: 'Kechirasiz, men kechikdim.' },
          { english: 'No problem', uzbek: 'Hechqisi yo‘q', phonetic: '/noʊ ˈprɑː.bləm/', exampleSentence: 'No problem at all!', exampleSentenceUz: 'Hechqisi yo‘q, tashvishlanmang!' }
        ]
      },
      {
        id: 'greet-l5',
        title: 'Lesson 5: Listening and Speaking Practice',
        titleUz: '5-dars: Tinglash va gapirish amaliyoti',
        lessonNumber: 5,
        category: 'practice',
        description: 'Practice real-life greeting conversations with voice replay.',
        descriptionUz: 'Haqiqiy hayotiy salomlashuv suhbatlarini ovoz bilan mashq qiling.',
        items: [
          'A: Hello! Good morning! — Salom! Xayrli tong!',
          'B: Good morning! How are you? — Xayrli tong! Ahvolingiz qanday?',
          'A: I am fine, thank you. My name is Anna. What is your name? — Yaxshiman, rahmat. Ismim Anna. Ismingiz nima?',
          'B: My name is David. Nice to meet you! — Ismim David. Tanishganimdan xursandman!',
          'A: Nice to meet you, too, David. Goodbye! — Men ham tanishganimdan xursandman, David. Xayr!',
          'B: See you tomorrow! — Ertagacha xayr!'
        ],
        itemsUz: [
          'A: Salom! Xayrli tong!',
          'B: Xayrli tong! Ahvolingiz qanday?',
          'A: Yaxshiman, rahmat. Ismim Anna. Ismingiz nima?',
          'B: Ismim David. Tanishganimdan xursandman!',
          'A: Men ham xursandman, David. Xayr!',
          'B: Ertagacha xayr!'
        ],
        dialogue: [
          { speaker: 'Anna', speakerUz: 'Anna', text: 'Hello! Good morning!', textUz: 'Salom! Xayrli tong!' },
          { speaker: 'David', speakerUz: 'David', text: 'Good morning! How are you?', textUz: 'Xayrli tong! Ahvolingiz qanday?' },
          { speaker: 'Anna', speakerUz: 'Anna', text: 'I am fine, thank you. My name is Anna. What is your name?', textUz: 'Yaxshiman, rahmat. Mening ismim Anna. Ismingiz nima?' },
          { speaker: 'David', speakerUz: 'David', text: 'My name is David. Nice to meet you!', textUz: 'Mening ismim David. Tanishganimdan xursandman!' },
          { speaker: 'Anna', speakerUz: 'Anna', text: 'Nice to meet you, too. Goodbye!', textUz: 'Men ham tanishganimdan xursandman. Xayr!' },
          { speaker: 'David', speakerUz: 'David', text: 'See you tomorrow, Anna!', textUz: 'Ertagacha xayr, Anna!' }
        ]
      }
    ],
    dialogue: [
      { speaker: 'Anna', text: 'Hello! Good morning!' },
      { speaker: 'David', text: 'Good morning! How are you?' },
      { speaker: 'Anna', text: 'I am fine, thank you. My name is Anna. What is your name?' },
      { speaker: 'David', text: 'My name is David. Nice to meet you!' },
      { speaker: 'Anna', text: 'Nice to meet you, too, David. Goodbye!' },
      { speaker: 'David', text: 'See you tomorrow, Anna!' }
    ],
    speakingActivities: [
      'Listen to and repeat morning and evening greetings.',
      'Practice asking someone’s name politely.',
      'Introduce yourself using your name and say nice to meet you.',
      'Practice a short goodbye conversation.',
      'Record your own complete greeting and listen back.'
    ],
    prompts: [
      {
        id: 'greet-q1',
        question: 'What is your name and how are you today?',
        questionUz: 'Ismingiz nima va bugun ahvolingiz qanday?',
        sentenceStarters: ['Hello! My name is...', 'Good morning, my name is...', 'Hi! I am... and I am fine!'],
        sentenceStartersUz: ['Salom! Mening ismim...', 'Xayrli tong, mening ismim...', 'Salom! Men... va men yaxshiman!'],
        exampleAnswer: 'Hello! My name is David, and I am fine today. Nice to meet you!',
        exampleAnswerUz: 'Salom! Mening ismim David va bugun ahvolim yaxshi. Tanishganimdan xursandman!',
        teacherTip: 'Speak your name clearly with a warm, friendly voice.'
      },
      {
        id: 'greet-q2',
        question: 'How do you say goodbye to a friend until tomorrow?',
        questionUz: 'Do‘stingizga ertagacha xayrlashishni qanday aytasiz?',
        sentenceStarters: ['Goodbye! See you tomorrow!', 'Bye-bye, have a good day!'],
        sentenceStartersUz: ['Xayr! Ertagacha ko‘rishguncha!', 'Xayr, kuningiz yaxshi o‘tsin!'],
        exampleAnswer: 'Goodbye, my friend! See you tomorrow, have a wonderful evening!',
        exampleAnswerUz: 'Xayr, do‘stim! Ertagacha ko‘rishguncha, oqshomingiz ajoyib o‘tsin!',
        teacherTip: 'Try using "See you tomorrow!" when you know you will talk again soon.'
      }
    ],
    completionMessage: 'Great job! You finished Topic 1: Greetings and Saying Hello. You now know how to say hello, introduce your name, and say goodbye in English.',
    completionMessageUz: 'Ajoyib ish! Siz 1-mavzuni muvaffaqiyatli yakunladingiz. Endi inglizcha salomlashish va xayrlashishni bilasiz.',
    listenAndChoose: [
      {
        id: 'greet-lc1',
        audioPrompt: 'Good morning! My name is Lisa. Nice to meet you!',
        question: 'What time of day is Lisa greeting you?',
        options: [
          { id: 'opt-1', text: 'In the morning', isCorrect: true },
          { id: 'opt-2', text: 'Late at night', isCorrect: false },
          { id: 'opt-3', text: 'In the afternoon', isCorrect: false }
        ],
        explanation: 'Lisa said "Good morning", which is used before noon.'
      },
      {
        id: 'greet-lc2',
        audioPrompt: 'See you tomorrow, Alex! Have a good evening.',
        question: 'What is the speaker saying to Alex?',
        options: [
          { id: 'opt-a', text: 'Saying goodbye until tomorrow', isCorrect: true },
          { id: 'opt-b', text: 'Asking for Alex’s name', isCorrect: false },
          { id: 'opt-c', text: 'Saying good morning', isCorrect: false }
        ],
        explanation: '"See you tomorrow" and "Have a good evening" are polite goodbyes.'
      }
    ],
    vocabularyChallenge: [
      {
        id: 'vocab-hello',
        word: 'Hello',
        phonetic: '/həˈloʊ/',
        definition: 'A friendly word used when meeting someone or answering the phone.',
        exampleSentence: 'Hello! How are you today?',
        audioHint: 'Say hello with a rising tone.'
      },
      {
        id: 'vocab-morning',
        word: 'Morning',
        phonetic: '/ˈmɔːr.nɪŋ/',
        definition: 'The early part of the day from sunrise to midday.',
        exampleSentence: 'Good morning, teacher!',
        audioHint: 'Pronounce the "m-o-r" softly.'
      },
      {
        id: 'vocab-name',
        word: 'Name',
        phonetic: '/neɪm/',
        definition: 'The word people call you.',
        exampleSentence: 'My name is Sarah.',
        audioHint: 'Rhymes with "game" and "same".'
      },
      {
        id: 'vocab-meet',
        word: 'Meet',
        phonetic: '/miːt/',
        definition: 'To see and talk to someone for the first time.',
        exampleSentence: 'Nice to meet you.',
        audioHint: 'Long "ee" sound like "see".'
      },
      {
        id: 'vocab-goodbye',
        word: 'Goodbye',
        phonetic: '/ɡʊdˈbaɪ/',
        definition: 'A word said when parting or leaving.',
        exampleSentence: 'Goodbye, see you on Monday!',
        audioHint: 'Two syllables: good-bye.'
      }
    ],
    sentenceBuilder: [
      {
        id: 'sb-greet-1',
        instruction: 'Arrange these words to make a friendly greeting:',
        targetSentence: 'Hello my name is Alex',
        scrambledWords: ['is', 'name', 'Hello', 'Alex', 'my'],
        hint: 'Start with the greeting word "Hello".'
      },
      {
        id: 'sb-greet-2',
        instruction: 'Arrange these words to politely say nice to meet someone:',
        targetSentence: 'Nice to meet you too',
        scrambledWords: ['you', 'Nice', 'too', 'to', 'meet'],
        hint: 'Start with the word "Nice".'
      }
    ],
    aiRoleplayScenario: {
      id: 'ai-roleplay-greet',
      scenarioTitle: 'Morning Coffee Shop Encounter',
      aiRole: 'Emma, a friendly London barista',
      contextDescription: 'You enter a quiet morning cafe. Emma warmly welcomes you to order and introduces herself.',
      initialAIGreeting: 'Good morning! Welcome to our cafe. My name is Emma. How are you doing today?',
      suggestedStudentStarters: [
        'Good morning! My name is...',
        'Hello Emma! I am doing well, thank you.',
        'Nice to meet you, Emma! How are you?'
      ]
    },
    speakingMission: {
      id: 'mission-greet',
      missionTitle: 'Say Hello and Introduce Yourself',
      promptQuestion: 'Greet your speaking partner, say your name, and ask how they are doing today.',
      sampleGoodAnswer: 'Good morning! My name is Alex. How are you doing today? Nice to meet you!',
      teacherEncouragement: 'Speak with a calm, friendly tone. Even a simple "Hello, my name is..." is wonderful!'
    }
  },

  // ==============================================================================
  // TOPIC 2: INTRODUCING MYSELF AND BACKGROUND
  // ==============================================================================
  {
    id: 'introducing-myself',
    title: 'Introducing Myself and Countries',
    titleUz: 'O‘zini tanishtirish va mamlakatlar',
    subtitle: 'Learn to share your name, age, country, city, and nationality.',
    subtitleUz: 'Ismingiz, yoshingiz, mamlakatingiz va shahringizni aytishni o‘rganing.',
    level: 'Pre-A1 to A1',
    levelGroup: 'Level 1',
    learningObjective: 'Learn to share your name, age, country, and language with clear beginner sentences.',
    learningObjectiveUz: 'Ismingiz, yoshingiz, mamlakatingiz va ona tilingizni sodda gaplar bilan aytishni o‘rganish.',
    iconName: 'user',
    color: 'blue',
    audioInstruction: 'Welcome to Topic 2: Introducing Myself. You will learn country names, numbers for age, and how to introduce where you live.',
    audioInstructionUz: '2-mavzuga xush kelibsiz: O‘zini tanishtirish. Siz mamlakatlar, yoshingizni aytish va qayerda yashashingizni ifodalashni o‘rganasiz.',
    lessons: [
      {
        id: 'intro-l1',
        title: 'Lesson 1: Countries and Nationalities',
        titleUz: '1-dars: Mamlakatlar va millatlar',
        lessonNumber: 1,
        category: 'vocabulary',
        description: 'Learn common country names in English.',
        descriptionUz: 'Ingliz tilidagi asosiy mamlakatlar nomlarini o‘rganing.',
        items: [
          'Uzbekistan — O‘zbekiston',
          'Uzbek — O‘zbekcha / O‘zbek',
          'United States / America — Amerika',
          'United Kingdom / Britain — Buyuk Britaniya',
          'Canada — Kanada',
          'Turkey — Turkiya',
          'Germany — Germaniya',
          'France — Fransiya',
          'Japan — Yaponiya',
          'China — Xitoy',
          'South Korea — Janubiy Koreya',
          'World — Dunyo / Olam',
          'Country — Mamlakat / Davlat',
          'City — Shahar',
          'Capital — Poytaxt'
        ],
        itemsUz: [
          'O‘zbekiston',
          'O‘zbekcha / O‘zbek',
          'Amerika',
          'Buyuk Britaniya',
          'Kanada',
          'Turkiya',
          'Germaniya',
          'Fransiya',
          'Yaponiya',
          'Xitoy',
          'Janubiy Koreya',
          'Dunyo / Olam',
          'Mamlakat / Davlat',
          'Shahar',
          'Poytaxt'
        ],
        vocabulary: [
          { english: 'Uzbekistan', uzbek: 'O‘zbekiston', phonetic: '/ˌʊz.bek.ɪˈstæn/', exampleSentence: 'I live in Uzbekistan.', exampleSentenceUz: 'Men O‘zbekistonda yashayman.' },
          { english: 'Country', uzbek: 'Mamlakat', phonetic: '/ˈkʌn.tri/', exampleSentence: 'Uzbekistan is a beautiful country.', exampleSentenceUz: 'O‘zbekiston go‘zal mamlakat.' },
          { english: 'City', uzbek: 'Shahar', phonetic: '/ˈsɪt.i/', exampleSentence: 'Tashkent is a large city.', exampleSentenceUz: 'Toshkent katta shahar.' },
          { english: 'Capital', uzbek: 'Poytaxt', phonetic: '/ˈkæp.ə.t̬əl/', exampleSentence: 'Tashkent is the capital of Uzbekistan.', exampleSentenceUz: 'Toshkent O‘zbekistonning poytaxti.' },
          { english: 'Turkey', uzbek: 'Turkiya', phonetic: '/ˈtɝː.ki/', exampleSentence: 'Istanbul is a famous city in Turkey.', exampleSentenceUz: 'Istanbul Turkiyadagi mashhur shahar.' },
          { english: 'United Kingdom', uzbek: 'Buyuk Britaniya', phonetic: '/juːˌnaɪ.tɪd ˈkɪŋ.dəm/', exampleSentence: 'London is in the United Kingdom.', exampleSentenceUz: 'London Buyuk Britaniyada joylashgan.' }
        ]
      },
      {
        id: 'intro-l2',
        title: 'Lesson 2: Age and Numbers for Age',
        titleUz: '2-dars: Yosh va yoshni aytish',
        lessonNumber: 2,
        category: 'vocabulary',
        description: 'Numbers and words used to express age and background.',
        descriptionUz: 'Yoshni va shaxsiy ma’lumotlarni aytishda ishlatiladigan sonlar.',
        items: [
          'Age — Yosh',
          'Years old — Yoshda',
          'How old are you? — Yoshingiz nechida?',
          'Eighteen (18) — O‘n sakkiz',
          'Nineteen (19) — O‘n to‘qqiz',
          'Twenty (20) — Yigirma',
          'Twenty-five (25) — Yigirma besh',
          'Thirty (30) — O‘ttiz',
          'Thirty-five (35) — O‘ttiz besh',
          'Forty (40) — Qirq',
          'Fifty (50) — Ellik',
          'Birthday — Tug‘ilgan kun',
          'Adult — Katta yoshli / Balog‘atga yetgan',
          'Student — Talaba / O‘quvchi'
        ],
        itemsUz: [
          'Yosh',
          'Yoshda',
          'Yoshingiz nechida?',
          'O‘n sakkiz',
          'O‘n to‘qqiz',
          'Yigirma',
          'Yigirma besh',
          'O‘ttiz',
          'O‘ttiz besh',
          'Qirq',
          'Ellik',
          'Tug‘ilgan kun',
          'Katta yoshli',
          'Talaba / O‘quvchi'
        ],
        vocabulary: [
          { english: 'Age', uzbek: 'Yosh', phonetic: '/eɪdʒ/', exampleSentence: 'What is your age?', exampleSentenceUz: 'Yoshingiz nechida?' },
          { english: 'Years old', uzbek: 'Yoshda', phonetic: '/jɪrz oʊld/', exampleSentence: 'I am twenty years old.', exampleSentenceUz: 'Men yigirma yoshdaman.' },
          { english: 'Student', uzbek: 'Talaba', phonetic: '/ˈstuː.dənt/', exampleSentence: 'I am an English student.', exampleSentenceUz: 'Men ingliz tili talabasiman.' },
          { english: 'Birthday', uzbek: 'Tug‘ilgan kun', phonetic: '/ˈbɝːθ.deɪ/', exampleSentence: 'My birthday is in May.', exampleSentenceUz: 'Mening tug‘ilgan kunim may oyida.' }
        ]
      },
      {
        id: 'intro-l3',
        title: 'Lesson 3: Sentence Patterns for Introducing Yourself',
        titleUz: '3-dars: O‘zini tanishtirish gap qoliplari',
        lessonNumber: 3,
        category: 'sentences',
        description: 'Put vocabulary together into clear introduction sentences.',
        descriptionUz: 'Lug‘at so‘zlarini birlashtirib, aniq tanishtiruv gaplari tuzing.',
        items: [
          'I am from Uzbekistan. — Men O‘zbekistondanman.',
          'I live in Tashkent. — Men Toshkentda yashayman.',
          'I am twenty-two years old. — Men yigirma ikki yoshdaman.',
          'I am a student. — Men talabaman.',
          'I speak Uzbek and English. — Men o‘zbek va ingliz tillarida gaplashaman.'
        ],
        itemsUz: [
          'Men O‘zbekistondanman.',
          'Men Toshkentda yashayman.',
          'Men yigirma ikki yoshdaman.',
          'Men talabaman.',
          'Men o‘zbek va ingliz tillarida gaplashaman.'
        ],
        sentences: [
          {
            english: 'I am from Uzbekistan.',
            uzbek: 'Men O‘zbekistondanman.',
            substitutions: {
              slotName: 'Country',
              options: [
                { en: 'Uzbekistan', uz: 'O‘zbekiston' },
                { en: 'Turkey', uz: 'Turkiya' },
                { en: 'Canada', uz: 'Kanada' }
              ]
            }
          },
          {
            english: 'I live in Tashkent.',
            uzbek: 'Men Toshkentda yashayman.',
            substitutions: {
              slotName: 'City',
              options: [
                { en: 'Tashkent', uz: 'Toshkent' },
                { en: 'Samarkand', uz: 'Samarqand' },
                { en: 'Bukhara', uz: 'Buxoro' },
                { en: 'Fergana', uz: 'Farg‘ona' }
              ]
            }
          },
          {
            english: 'I am twenty years old.',
            uzbek: 'Men yigirma yoshdaman.',
            substitutions: {
              slotName: 'Age',
              options: [
                { en: 'eighteen', uz: 'o‘n sakkiz' },
                { en: 'twenty', uz: 'yigirma' },
                { en: 'twenty-five', uz: 'yigirma besh' },
                { en: 'thirty', uz: 'o‘ttiz' }
              ]
            }
          },
          {
            english: 'I speak Uzbek and English.',
            uzbek: 'Men o‘zbek va ingliz tillarida gaplashaman.'
          }
        ]
      },
      {
        id: 'intro-l4',
        title: 'Lesson 4: Listening and Speaking Practice',
        titleUz: '4-dars: Tinglash va gapirish amaliyoti',
        lessonNumber: 4,
        category: 'practice',
        description: 'Full dialogue of two learners meeting and introducing backgrounds.',
        descriptionUz: 'Ikki talabaning tanishishi va o‘zlari haqida so‘zlab berish suhbati.',
        items: [
          'A: Where are you from? — Qayerdansiz?',
          'B: I am from Uzbekistan. How about you? — Men O‘zbekistondanman. Siz-chi?',
          'A: I am from the United Kingdom. Where do you live in Uzbekistan? — Men Buyuk Britaniyadanman. O‘zbekistonning qayerida yashaysiz?',
          'B: I live in Tashkent. It is a wonderful city. — Men Toshkentda yashayman. Bu ajoyib shahar.',
          'A: How old are you? — Yoshingiz nechida?',
          'B: I am twenty-four years old. — Men yigirma to‘rt yoshdaman.'
        ],
        itemsUz: [
          'A: Qayerdansiz?',
          'B: Men O‘zbekistondanman. Siz-chi?',
          'A: Men Buyuk Britaniyadanman. Qayerida yashaysiz?',
          'B: Men Toshkentda yashayman. Bu ajoyib shahar.',
          'A: Yoshingiz nechida?',
          'B: Men yigirma to‘rt yoshdaman.'
        ],
        dialogue: [
          { speaker: 'Anna', text: 'Where are you from, David?' },
          { speaker: 'David', text: 'I am from Uzbekistan. I live in Tashkent.' },
          { speaker: 'Anna', text: 'That is great! How old are you?' },
          { speaker: 'David', text: 'I am twenty-four years old. I am an English learner.' }
        ]
      }
    ],
    dialogue: [
      { speaker: 'Anna', text: 'Where are you from, David?' },
      { speaker: 'David', text: 'I am from Uzbekistan. I live in Tashkent.' },
      { speaker: 'Anna', text: 'That is wonderful! How old are you?' },
      { speaker: 'David', text: 'I am twenty-four years old. I am learning English.' }
    ],
    speakingActivities: [
      'Say where you are from in complete English.',
      'State your age clearly using "I am ... years old".',
      'Tell your speaking partner which city you live in.',
      'Practice asking someone where they live.',
      'Record a full self-introduction.'
    ],
    prompts: [
      {
        id: 'intro-q1',
        question: 'Where are you from and what city do you live in?',
        questionUz: 'Qayerdansiz va qaysi shaharda yashaysiz?',
        sentenceStarters: ['I am from...', 'I live in the city of...', 'My home country is...'],
        exampleAnswer: 'I am from Uzbekistan, and I live in Tashkent. It is a friendly and historic city.',
        teacherTip: 'State the country first, followed by your city.'
      }
    ],
    completionMessage: 'Well done! You finished Topic 2: Introducing Myself. You can now state your country, city, and background.',
    completionMessageUz: 'Barakalla! Siz 2-mavzuni tugatdingiz. Endi mamlakatingiz, shahringiz va o‘zingiz haqingizda gapira olasiz.',
    listenAndChoose: [
      {
        id: 'intro-lc1',
        audioPrompt: 'My name is Malika. I am twenty-two years old, and I live in Samarkand, Uzbekistan.',
        question: 'Where does Malika live?',
        options: [
          { id: 'opt-1', text: 'Samarkand, Uzbekistan', isCorrect: true },
          { id: 'opt-2', text: 'London, England', isCorrect: false },
          { id: 'opt-3', text: 'New York, America', isCorrect: false }
        ],
        explanation: 'Malika clearly stated she lives in Samarkand, Uzbekistan.'
      }
    ],
    vocabularyChallenge: [
      {
        id: 'vocab-country',
        word: 'Country',
        phonetic: '/ˈkʌn.tri/',
        definition: 'A nation with its own government and land.',
        exampleSentence: 'Uzbekistan is my country.',
        audioHint: 'Begins with a crisp "c" sound.'
      },
      {
        id: 'vocab-city',
        word: 'City',
        phonetic: '/ˈsɪt.i/',
        definition: 'A large town where many people live.',
        exampleSentence: 'Tashkent is a vibrant city.',
        audioHint: 'Soft "s" sound at the start.'
      }
    ],
    sentenceBuilder: [
      {
        id: 'sb-intro-1',
        instruction: 'Assemble this self-introduction sentence:',
        targetSentence: 'I am from Uzbekistan',
        scrambledWords: ['Uzbekistan', 'am', 'from', 'I'],
        hint: 'Start with the subject pronoun "I".'
      }
    ],
    aiRoleplayScenario: {
      id: 'ai-roleplay-intro',
      scenarioTitle: 'International Student Meetup',
      aiRole: 'Kenji, an exchange student from Tokyo',
      contextDescription: 'You meet Kenji in an international audio lounge. He asks where you are from and what languages you speak.',
      initialAIGreeting: 'Hello there! My name is Kenji and I am from Japan. Where are you from?',
      suggestedStudentStarters: [
        'Hello Kenji! I am from Uzbekistan.',
        'Nice to meet you! I live in Tashkent.',
        'I am from Uzbekistan and I speak Uzbek and English.'
      ]
    },
    speakingMission: {
      id: 'mission-intro',
      missionTitle: 'Full Personal Introduction',
      promptQuestion: 'Introduce yourself: state your name, your country, your city, and your age.',
      sampleGoodAnswer: 'Hello! My name is Jasur. I am twenty-two years old. I am from Uzbekistan and I live in Tashkent.',
      teacherEncouragement: 'Speak slowly and calmly. Each sentence tells a clear fact about yourself.'
    }
  },

  // ==============================================================================
  // TOPIC 3: MY FAMILY AND RELATIVES
  // ==============================================================================
  {
    id: 'my-family',
    title: 'My Family and Relatives',
    titleUz: 'Mening oilam va qarindoshlarim',
    subtitle: 'Learn to talk about your parents, siblings, children, and relatives.',
    subtitleUz: 'Ota-onangiz, aka-uka, opa-singil va qarindoshlaringiz haqida gapirishni o‘rganing.',
    level: 'Pre-A1 to A1',
    levelGroup: 'Level 1',
    learningObjective: 'Learn family vocabulary and describe relationships and family members.',
    learningObjectiveUz: 'Oila a’zolari so‘zlarini o‘rganish va oila a’zolarini tasvirlash.',
    iconName: 'users',
    color: 'blue',
    audioInstruction: 'Welcome to Topic 3: My Family and Relatives. Learn words for family members and how to describe your household with warmth.',
    audioInstructionUz: '3-mavzuga xush kelibsiz: Mening oilam. Oila a’zolari so‘zlarini o‘rganasiz va oilangizni mehr bilan tasvirlashni mashq qilasiz.',
    lessons: [
      {
        id: 'fam-l1',
        title: 'Lesson 1: Immediate Family Members',
        titleUz: '1-dars: Yaqin oila a’zolari',
        lessonNumber: 1,
        category: 'vocabulary',
        description: 'Core family members you live with or see every day.',
        descriptionUz: 'Har kuni birga yashaydigan yoki ko‘radigan yaqin oila a’zolari.',
        items: [
          'Family — Oila',
          'Mother / Mom — Ona / Oyi',
          'Father / Dad — Ota / Dadam',
          'Parents — Ota-ona',
          'Brother — Aka / Uka',
          'Sister — Opa / Singil',
          'Son — O‘g‘il (farzand)',
          'Daughter — Qiz (farzand)',
          'Grandmother / Grandma — Buvi',
          'Grandfather / Grandpa — Bobo',
          'Grandparents — Bobo va buvi',
          'Husband — Turmush o‘rtoq (er)',
          'Wife — Turmush o‘rtoq (xotin)',
          'Baby / Child — Chaqaloq / Bola'
        ],
        itemsUz: [
          'Oila',
          'Ona / Oyi',
          'Ota / Dadam',
          'Ota-ona',
          'Aka / Uka',
          'Opa / Singil',
          'O‘g‘il (farzand)',
          'Qiz (farzand)',
          'Buvi',
          'Bobo',
          'Bobo va buvi',
          'Turmush o‘rtoq (er)',
          'Turmush o‘rtoq (xotin)',
          'Chaqaloq / Bola'
        ],
        vocabulary: [
          { english: 'Mother', uzbek: 'Ona', phonetic: '/ˈmʌð.ɚ/', exampleSentence: 'My mother is very kind.', exampleSentenceUz: 'Mening onam juda mehribon.' },
          { english: 'Father', uzbek: 'Ota', phonetic: '/ˈfɑː.ðɚ/', exampleSentence: 'My father is a teacher.', exampleSentenceUz: 'Mening otam o‘qituvchi.' },
          { english: 'Brother', uzbek: 'Aka / Uka', phonetic: '/ˈbrʌð.ɚ/', exampleSentence: 'I have one brother.', exampleSentenceUz: 'Mening bitta ukam bor.' },
          { english: 'Sister', uzbek: 'Opa / Singil', phonetic: '/ˈsɪs.tɚ/', exampleSentence: 'My sister is fifteen years old.', exampleSentenceUz: 'Mening singlim o‘n besh yoshda.' },
          { english: 'Grandfather', uzbek: 'Bobo', phonetic: '/ˈɡræn.fɑː.ðɚ/', exampleSentence: 'My grandfather tells great stories.', exampleSentenceUz: 'Bobom ajoyib hikoyalar aytib beradi.' },
          { english: 'Grandmother', uzbek: 'Buvi', phonetic: '/ˈɡræn.mʌð.ɚ/', exampleSentence: 'My grandmother bakes delicious bread.', exampleSentenceUz: 'Buvim mazali non yopadi.' }
        ]
      },
      {
        id: 'fam-l2',
        title: 'Lesson 2: Extended Family and Relatives',
        titleUz: '2-dars: Qarindoshlar va tog‘a-ammalar',
        lessonNumber: 2,
        category: 'vocabulary',
        description: 'Relatives and extended family terms.',
        descriptionUz: 'Qarindoshlar va katta oila a’zolari nomlari.',
        items: [
          'Uncle — Tog‘a / Amaki',
          'Aunt — Xola / Amma',
          'Cousin — Amakivachcha / Tog‘avachcha / Xolavachcha',
          'Nephew — Jiyan (o‘g‘il bola)',
          'Niece — Jiyan (qiz bola)',
          'Relatives — Qarindoshlar',
          'Big family — Katta oila',
          'Small family — Kichik oila',
          'Older brother — Katta aka',
          'Younger sister — Kichik singil'
        ],
        itemsUz: [
          'Tog‘a / Amaki',
          'Xola / Amma',
          'Amakivachcha / Xolavachcha',
          'Jiyan (o‘g‘il)',
          'Jiyan (qiz)',
          'Qarindoshlar',
          'Katta oila',
          'Kichik oila',
          'Katta aka',
          'Kichik singil'
        ],
        vocabulary: [
          { english: 'Uncle', uzbek: 'Tog‘a / Amaki', phonetic: '/ˈʌŋ.kəl/', exampleSentence: 'My uncle lives nearby.', exampleSentenceUz: 'Tog‘am yaqin atrofda yashaydi.' },
          { english: 'Aunt', uzbek: 'Xola / Amma', phonetic: '/ænt/', exampleSentence: 'My aunt is coming to visit.', exampleSentenceUz: 'Xolam mehmonga kelyapti.' },
          { english: 'Cousin', uzbek: 'Jiyan / Amakivachcha', phonetic: '/ˈkʌz.ən/', exampleSentence: 'My cousin and I play games.', exampleSentenceUz: 'Amakivachcham bilan o‘yin o‘ynaymiz.' },
          { english: 'Relatives', uzbek: 'Qarindoshlar', phonetic: '/ˈrel.ə.t̬ɪvz/', exampleSentence: 'All our relatives gather for Navruz.', exampleSentenceUz: 'Navro‘zda barcha qarindoshlarimiz yig‘iladi.' }
        ]
      },
      {
        id: 'fam-l3',
        title: 'Lesson 3: Describing Family Members',
        titleUz: '3-dars: Oila a’zolarini tasvirlash',
        lessonNumber: 3,
        category: 'vocabulary',
        description: 'Useful descriptive words for family personalities and appearance.',
        descriptionUz: 'Oila a’zolarining fe’l-atvori va xarakterini tasvirlash so‘zlari.',
        items: [
          'Kind — Mehribon',
          'Friendly — Do‘stona / Ochiqko‘ngil',
          'Tall — Baland bo‘yli',
          'Short — Past bo‘yli',
          'Young — Yosh',
          'Old — Katta yoshli / Keksa',
          'Hardworking — Mehnatkash',
          'Funny — Qiziqarli / Quvnoq',
          'Smart — Aqlli',
          'Loving — Mehrli',
          'Caring — G‘amxo‘r'
        ],
        itemsUz: [
          'Mehribon',
          'Do‘stona / Ochiqko‘ngil',
          'Baland bo‘yli',
          'Past bo‘yli',
          'Yosh',
          'Katta yoshli / Keksa',
          'Mehnatkash',
          'Qiziqarli / Quvnoq',
          'Aqlli',
          'Mehrli',
          'G‘amxo‘r'
        ],
        vocabulary: [
          { english: 'Kind', uzbek: 'Mehribon', phonetic: '/kaɪnd/', exampleSentence: 'My mother is very kind.', exampleSentenceUz: 'Mening onam juda mehribon.' },
          { english: 'Hardworking', uzbek: 'Mehnatkash', phonetic: '/ˌhɑːrdˈwɝː.kɪŋ/', exampleSentence: 'My father is hardworking.', exampleSentenceUz: 'Otam juda mehnatkash.' },
          { english: 'Funny', uzbek: 'Quvnoq / Kulgili', phonetic: '/ˈfʌn.i/', exampleSentence: 'My little brother is funny.', exampleSentenceUz: 'Kichik ukam juda quvnoq.' }
        ]
      },
      {
        id: 'fam-l4',
        title: 'Lesson 4: Talking About Family and Sentence Patterns',
        titleUz: '4-dars: Oila haqida gapirish qoliplari',
        lessonNumber: 4,
        category: 'sentences',
        description: 'Construct complete sentences describing your family.',
        descriptionUz: 'Oilangiz haqida to‘liq va aniq gaplar tuzing.',
        items: [
          'This is my mother. — Bu mening onam.',
          'I have two brothers and one sister. — Mening ikkita ukam va bitta singlim bor.',
          'My family is big and happy. — Mening oilam katta va baxtli.',
          'We live together in Tashkent. — Biz Toshkentda birga yashaymiz.',
          'I love my family very much. — Men oilamni juda yaxshi ko‘raman.'
        ],
        itemsUz: [
          'Bu mening onam.',
          'Mening ikkita ukam va bitta singlim bor.',
          'Mening oilam katta va baxtli.',
          'Biz Toshkentda birga yashaymiz.',
          'Men oilamni juda yaxshi ko‘raman.'
        ],
        sentences: [
          {
            english: 'This is my mother.',
            uzbek: 'Bu mening onam.',
            substitutions: {
              slotName: 'Family Member',
              options: [
                { en: 'mother', uz: 'onam' },
                { en: 'father', uz: 'otam' },
                { en: 'brother', uz: 'akam / ukam' },
                { en: 'sister', uz: 'opam / singlim' },
                { en: 'grandfather', uz: 'bobom' }
              ]
            }
          },
          {
            english: 'I have two brothers.',
            uzbek: 'Mening ikkita ukam bor.',
            substitutions: {
              slotName: 'Siblings',
              options: [
                { en: 'one brother', uz: 'bitta ukam' },
                { en: 'two brothers', uz: 'ikkita ukam' },
                { en: 'one sister', uz: 'bitta singlim' },
                { en: 'a big family', uz: 'katta oilam' }
              ]
            }
          },
          {
            english: 'My mother is very kind.',
            uzbek: 'Mening onam juda mehribon.'
          },
          {
            english: 'I love my family very much.',
            uzbek: 'Men oilamni juda yaxshi ko‘raman.'
          }
        ]
      },
      {
        id: 'fam-l5',
        title: 'Lesson 5: Listening and Speaking Practice',
        titleUz: '5-dars: Tinglash va gapirish amaliyoti',
        lessonNumber: 5,
        category: 'practice',
        description: 'Listen to a family description and practice talking about your own.',
        descriptionUz: 'Oila haqidagi hikoyani tinglang va o‘z oilangiz haqida gapirishni mashq qiling.',
        items: [
          'A: Tell me about your family! — Menga oilangiz haqida so‘zlab bering!',
          'B: I have a wonderful family. There are five people in my family. — Mening ajoyib oilam bor. Oilamizda besh kishi bor.',
          'A: Do you have brothers or sisters? — Aka-uka yoki opa-singillaringiz bormi?',
          'B: Yes, I have one older brother and one younger sister. — Ha, bitta katta akam va bitta kichik singlim bor.'
        ],
        itemsUz: [
          'A: Menga oilangiz haqida so‘zlab bering!',
          'B: Mening ajoyib oilam bor. Oilamizda besh kishi bor.',
          'A: Aka-uka yoki opa-singillaringiz bormi?',
          'B: Ha, bitta katta akam va bitta kichik singlim bor.'
        ],
        dialogue: [
          { speaker: 'Anna', text: 'Do you have a big family, David?' },
          { speaker: 'David', text: 'Yes, I have two brothers and one sister. My parents are very kind.' },
          { speaker: 'Anna', text: 'That is lovely! Do your grandparents live with you?' },
          { speaker: 'David', text: 'Yes, my grandmother lives with us. We love her very much.' }
        ]
      }
    ],
    dialogue: [
      { speaker: 'Anna', text: 'Do you have a big family, David?' },
      { speaker: 'David', text: 'Yes, I have two brothers and one sister. My parents are very kind.' },
      { speaker: 'Anna', text: 'That is lovely! Do your grandparents live with you?' },
      { speaker: 'David', text: 'Yes, my grandmother lives with us. We love her very much.' }
    ],
    speakingActivities: [
      'Name your immediate family members in English.',
      'State how many brothers or sisters you have.',
      'Describe one family member using a positive adjective.',
      'Practice asking someone about their family.',
      'Record an audio story about your family.'
    ],
    prompts: [
      {
        id: 'fam-q1',
        question: 'Who is in your family and how do you describe them?',
        questionUz: 'Oilangizda kimlar bor va ularni qanday tasvirlaysiz?',
        sentenceStarters: ['In my family, there are...', 'I have...', 'My mother is...', 'My father is...'],
        exampleAnswer: 'In my family, there are my parents, my brother, and me. My mother is very caring and my father is hardworking.',
        teacherTip: 'Mention each member and one nice word about them.'
      }
    ],
    completionMessage: 'Congratulations! You completed Topic 3: My Family and Relatives. You can now describe your loved ones in English.',
    completionMessageUz: 'Tabriklaymiz! Siz 3-mavzuni muvaffaqiyatli yakunladingiz. Endi yaqinlaringiz haqida inglizcha gapira olasiz.',
    listenAndChoose: [
      {
        id: 'fam-lc1',
        audioPrompt: 'I have an older brother named Timur and a little sister named Madina. We all live together with our parents.',
        question: 'How many siblings does the speaker have?',
        options: [
          { id: 'opt-1', text: 'One brother and one sister', isCorrect: true },
          { id: 'opt-2', text: 'Three brothers', isCorrect: false },
          { id: 'opt-3', text: 'No siblings at all', isCorrect: false }
        ],
        explanation: 'The speaker mentioned an older brother (Timur) and a little sister (Madina).'
      }
    ],
    vocabularyChallenge: [
      {
        id: 'vocab-mother',
        word: 'Mother',
        phonetic: '/ˈmʌð.ɚ/',
        definition: 'A female parent.',
        exampleSentence: 'My mother is caring.',
        audioHint: 'Soft "th" sound in the middle.'
      },
      {
        id: 'vocab-brother',
        word: 'Brother',
        phonetic: '/ˈbrʌð.ɚ/',
        definition: 'A male sibling with the same parents.',
        exampleSentence: 'My brother plays chess with me.',
        audioHint: 'Begins with "br".'
      }
    ],
    sentenceBuilder: [
      {
        id: 'sb-fam-1',
        instruction: 'Assemble this family sentence:',
        targetSentence: 'I love my family very much',
        scrambledWords: ['family', 'much', 'love', 'I', 'very', 'my'],
        hint: 'Start with "I love".'
      }
    ],
    aiRoleplayScenario: {
      id: 'ai-roleplay-family',
      scenarioTitle: 'Sharing Family Photos with a Partner',
      aiRole: 'Chloe, an English conversation partner',
      contextDescription: 'You and Chloe are sharing stories about who lives in your home.',
      initialAIGreeting: 'Hi! I love hearing about families. Do you have a big family or a small family?',
      suggestedStudentStarters: [
        'I have a big family with my parents and siblings.',
        'I have two brothers and one sister.',
        'My family is very close and friendly.'
      ]
    },
    speakingMission: {
      id: 'mission-family',
      missionTitle: 'Describe Your Family',
      promptQuestion: 'Talk about your family: mention who you live with and describe one person.',
      sampleGoodAnswer: 'I have a wonderful family. I live with my parents and my younger sister. My sister is very friendly and smart.',
      teacherEncouragement: 'Speak with warmth and pride. Family words are some of the most useful in English!'
    }
  },

  // ==============================================================================
  // TOPIC 4: MY FAVORITE FOOD AND DRINKS (EXACT USER SPECIFICATION)
  // ==============================================================================
  {
    id: 'favorite-food-drinks',
    title: 'My Favorite Food and Drinks',
    titleUz: 'Mening sevimli taomlarim va ichimliklarim',
    subtitle: 'Learn fruits, vegetables, everyday foods, drinks, and food preferences.',
    subtitleUz: 'Mevalar, sabzavotlar, kundalik taomlar, ichimliklar va ta’bni ifodalashni o‘rganing.',
    level: 'A1',
    levelGroup: 'Level 1',
    learningObjective: 'Learn comprehensive food and drink vocabulary first, then construct preference sentences and substitution practice.',
    learningObjectiveUz: 'Avval mevalar, sabzavotlar, taomlar va ichimliklarni o‘rganib, so‘ng afzalliklarni ifodalovchi gaplar tuzish.',
    iconName: 'utensils',
    color: 'amber',
    audioInstruction: 'Welcome to Topic 4: My Favorite Food and Drinks. In this expanded curriculum, you will learn fruits first, vegetables second, everyday foods third, drinks fourth, and then practice expressing food preferences.',
    audioInstructionUz: '4-mavzuga xush kelibsiz: Sevimli taomlarim va ichimliklarim. Kengaytirilgan o‘quv dasturimizda avval mevalar, keyin sabzavotlar, taomlar, ichimliklar va yakunda o‘z ta’bingizni ifodalashni o‘rganasiz.',
    lessons: [
      // LESSON 1: FRUITS (15 FRUITS WITH EXACT REQUESTED ITEMS)
      {
        id: 'food-l1',
        title: 'Lesson 1: Fruits',
        titleUz: '1-dars: Mevalar',
        lessonNumber: 1,
        category: 'vocabulary',
        description: 'Learn 15 delicious and common fruits in English with Uzbek translations.',
        descriptionUz: 'Ingliz tilida 15 ta eng ko‘p uchraydigan shirin mevalarni o‘rganing.',
        items: [
          'Apple — Olma',
          'Banana — Banan',
          'Orange — Apelsin',
          'Grapes — Uzum',
          'Strawberry — Qulupnay',
          'Watermelon — Tarvuz',
          'Melon — Qovun',
          'Peach — Shaftoli',
          'Pear — Nok',
          'Cherry — Gilos',
          'Lemon — Limon',
          'Pineapple — Ananas',
          'Pomegranate — Anor',
          'Apricot — O‘rik',
          'Fig — Anjir'
        ],
        itemsUz: [
          'Olma',
          'Banan',
          'Apelsin',
          'Uzum',
          'Qulupnay',
          'Tarvuz',
          'Qovun',
          'Shaftoli',
          'Nok',
          'Gilos',
          'Limon',
          'Ananas',
          'Anor',
          'O‘rik',
          'Anjir'
        ],
        vocabulary: [
          { english: 'Apple', uzbek: 'Olma', phonetic: '/ˈæp.əl/', exampleSentence: 'A red apple is sweet.', exampleSentenceUz: 'Qizil olma shirin bo‘ladi.', audioHint: 'Short "a" sound like "cat".' },
          { english: 'Banana', uzbek: 'Banan', phonetic: '/bəˈnæn.ə/', exampleSentence: 'Monkeys love yellow bananas.', exampleSentenceUz: 'Maymunlar sariq bananlarni yaxshi ko‘radi.', audioHint: 'Three syllables: ba-na-na.' },
          { english: 'Orange', uzbek: 'Apelsin', phonetic: '/ˈɔːr.ɪndʒ/', exampleSentence: 'An orange is full of vitamin C.', exampleSentenceUz: 'Apelsin C vitaminiga boy.', audioHint: 'Ends with soft "j" sound.' },
          { english: 'Grapes', uzbek: 'Uzum', phonetic: '/ɡreɪps/', exampleSentence: 'Green grapes are juicy.', exampleSentenceUz: 'Yashil uzum sershira bo‘ladi.', audioHint: 'Plural: ends in "s".' },
          { english: 'Strawberry', uzbek: 'Qulupnay', phonetic: '/ˈstrɔːˌber.i/', exampleSentence: 'Fresh strawberries are delicious.', exampleSentenceUz: 'Yangi uzilgan qulupnaylar juda mazali.', audioHint: 'Compound word: straw-berry.' },
          { english: 'Watermelon', uzbek: 'Tarvuz', phonetic: '/ˈwɑː.t̬ɚˌmel.ən/', exampleSentence: 'Cold watermelon is wonderful in summer.', exampleSentenceUz: 'Muzdek tarvuz yozda ajoyib bo‘ladi.', audioHint: 'Water + melon.' },
          { english: 'Melon', uzbek: 'Qovun', phonetic: '/ˈmel.ən/', exampleSentence: 'Uzbek sweet melon is world-famous.', exampleSentenceUz: 'O‘zbekiston shirin qovunlari butun dunyoga mashhur.', audioHint: 'Two syllables: me-lon.' },
          { english: 'Peach', uzbek: 'Shaftoli', phonetic: '/piːtʃ/', exampleSentence: 'A ripe peach is soft and sweet.', exampleSentenceUz: 'Pishgan shaftoli yumshoq va shirin bo‘ladi.', audioHint: 'Ends with "ch" sound.' },
          { english: 'Pear', uzbek: 'Nok', phonetic: '/per/', exampleSentence: 'I like eating a yellow pear.', exampleSentenceUz: 'Men sariq nok yeyishni yaxshi ko‘raman.', audioHint: 'Sounds like "pair".' },
          { english: 'Cherry', uzbek: 'Gilos', phonetic: '/ˈtʃer.i/', exampleSentence: 'Sweet red cherries grow in spring.', exampleSentenceUz: 'Shirin qizil giloslar bahorda pishadi.', audioHint: 'Begins with "ch".' },
          { english: 'Lemon', uzbek: 'Limon', phonetic: '/ˈlem.ən/', exampleSentence: 'A lemon is yellow and sour.', exampleSentenceUz: 'Limon sariq va nordon bo‘ladi.', audioHint: 'Two syllables: le-mon.' },
          { english: 'Pineapple', uzbek: 'Ananas', phonetic: '/ˈpaɪnˌæp.əl/', exampleSentence: 'Pineapple is a tropical fruit.', exampleSentenceUz: 'Ananas tropik meva hisoblanadi.', audioHint: 'Pine + apple.' },
          { english: 'Pomegranate', uzbek: 'Anor', phonetic: '/ˈpɑː.məˌɡræn.ɪt/', exampleSentence: 'Pomegranate seeds are ruby red.', exampleSentenceUz: 'Anor donalari yoqutdek qizil.', audioHint: 'Pome-gran-ate.' },
          { english: 'Apricot', uzbek: 'O‘rik', phonetic: '/ˈeɪ.prɪ.kɑːt/', exampleSentence: 'Dry apricots are healthy snacks.', exampleSentenceUz: 'Quritilgan o‘riklar (turshak) foydali tamaddi.', audioHint: 'Ap-ri-cot.' },
          { english: 'Fig', uzbek: 'Anjir', phonetic: '/fɪɡ/', exampleSentence: 'Sweet fresh figs grow in sunny gardens.', exampleSentenceUz: 'Shirin yangi anjirlar oftobli bog‘larda o‘sadi.', audioHint: 'One short syllable: f-i-g.' }
        ]
      },

      // LESSON 2: VEGETABLES (14 VEGETABLES WITH EXACT REQUESTED ITEMS)
      {
        id: 'food-l2',
        title: 'Lesson 2: Vegetables',
        titleUz: '2-dars: Sabzavotlar',
        lessonNumber: 2,
        category: 'vocabulary',
        description: 'Learn 14 essential vegetables for cooking and healthy meals.',
        descriptionUz: 'Pazandachilik va sog‘lom ovqatlanish uchun zarur 14 ta sabzavot nomini o‘rganing.',
        items: [
          'Carrot — Sabzi',
          'Potato — Kartoshka',
          'Onion — Piyoz',
          'Tomato — Pomidor',
          'Cucumber — Bodring',
          'Cabbage — Karam',
          'Garlic — Sarimsoq',
          'Pepper — Qalampir',
          'Eggplant — Baqlajon',
          'Pumpkin — Qovoq',
          'Spinach — Ismaloq',
          'Broccoli — Brokkoli',
          'Beetroot — Lavlagi',
          'Cauliflower — Gulkaram'
        ],
        itemsUz: [
          'Sabzi',
          'Kartoshka',
          'Piyoz',
          'Pomidor',
          'Bodring',
          'Karam',
          'Sarimsoq',
          'Qalampir',
          'Baqlajon',
          'Qovoq',
          'Ismaloq',
          'Brokkoli',
          'Lavlagi',
          'Gulkaram'
        ],
        vocabulary: [
          { english: 'Carrot', uzbek: 'Sabzi', phonetic: '/ˈker.ət/', exampleSentence: 'Orange carrots are good for the eyes.', exampleSentenceUz: 'Sabzi ko‘rish qobiliyati uchun juda foydali.', audioHint: 'Car-rot.' },
          { english: 'Potato', uzbek: 'Kartoshka', phonetic: '/pəˈteɪ.t̬oʊ/', exampleSentence: 'Boiled potatoes are in the salad.', exampleSentenceUz: 'Pishirilgan kartoshka salat ichida bor.', audioHint: 'Three syllables: po-ta-to.' },
          { english: 'Onion', uzbek: 'Piyoz', phonetic: '/ˈʌn.jən/', exampleSentence: 'We chop onions for soup.', exampleSentenceUz: 'Sho‘rva uchun piyoz to‘g‘raymiz.', audioHint: 'Un-yun.' },
          { english: 'Tomato', uzbek: 'Pomidor', phonetic: '/təˈmeɪ.t̬oʊ/', exampleSentence: 'Red tomatoes make great salad.', exampleSentenceUz: 'Qizil pomidorlar ajoyib salat bo‘ladi.', audioHint: 'To-ma-to.' },
          { english: 'Cucumber', uzbek: 'Bodring', phonetic: '/ˈkjuː.kʌm.bɚ/', exampleSentence: 'Fresh cucumbers are green and crispy.', exampleSentenceUz: 'Yangi bodringlar yashil va qarsildoq.', audioHint: 'Cue-cum-ber.' },
          { english: 'Cabbage', uzbek: 'Karam', phonetic: '/ˈkæb.ɪdʒ/', exampleSentence: 'We make cabbage rolls for dinner.', exampleSentenceUz: 'Kechki ovqatga karam do‘lma pishiramiz.', audioHint: 'Cab-bige.' },
          { english: 'Garlic', uzbek: 'Sarimsoq', phonetic: '/ˈɡɑːr.lɪk/', exampleSentence: 'Garlic gives soup a wonderful aroma.', exampleSentenceUz: 'Sarimsoq sho‘rvaga ajoyib xushbo‘y hid beradi.', audioHint: 'Gar-lic.' },
          { english: 'Pepper', uzbek: 'Qalampir', phonetic: '/ˈpep.ɚ/', exampleSentence: 'Sweet bell peppers are red and green.', exampleSentenceUz: 'Shirin bolgar qalampirlari qizil va yashil bo‘ladi.', audioHint: 'Pep-per.' },
          { english: 'Eggplant', uzbek: 'Baqlajon', phonetic: '/ˈeɡ.plænt/', exampleSentence: 'Fried eggplant with garlic is tasty.', exampleSentenceUz: 'Sarimsoq bilan qovurilgan baqlajon mazali.', audioHint: 'Egg + plant.' },
          { english: 'Pumpkin', uzbek: 'Qovoq', phonetic: '/ˈpʌmp.kɪn/', exampleSentence: 'Uzbek pumpkin somsa is very delicious.', exampleSentenceUz: 'O‘zbekcha qovoqli somsa juda mazali bo‘ladi.', audioHint: 'Pump-kin.' },
          { english: 'Spinach', uzbek: 'Ismaloq', phonetic: '/ˈspɪn.ɪtʃ/', exampleSentence: 'Fresh spinach has many vitamins.', exampleSentenceUz: 'Yangi ismaloqda ko‘plab vitaminlar bor.', audioHint: 'Spin-itch.' },
          { english: 'Broccoli', uzbek: 'Brokkoli', phonetic: '/ˈbrɑː.kəl.i/', exampleSentence: 'Steamed broccoli is healthy.', exampleSentenceUz: 'Bug‘da pishgan brokkoli sog‘lom taom.', audioHint: 'Broc-co-li.' },
          { english: 'Beetroot', uzbek: 'Lavlagi', phonetic: '/ˈbiːt.ruːt/', exampleSentence: 'Beetroot makes soup deep red.', exampleSentenceUz: 'Lavlagi sho‘rvani to‘q qizil rangga kiritadi.', audioHint: 'Beet + root.' },
          { english: 'Cauliflower', uzbek: 'Gulkaram', phonetic: '/ˈkɑː.ləˌflaʊ.ɚ/', exampleSentence: 'White cauliflower is delicious baked.', exampleSentenceUz: 'Oq gulkaram pechda pishirilganda mazali.', audioHint: 'Cau-li-flow-er.' }
        ]
      },

      // LESSON 3: EVERYDAY FOODS (14 FOODS WITH EXACT REQUESTED ITEMS)
      {
        id: 'food-l3',
        title: 'Lesson 3: Everyday Foods',
        titleUz: '3-dars: Kundalik taomlar',
        lessonNumber: 3,
        category: 'vocabulary',
        description: 'Useful staple foods eaten for breakfast, lunch, and dinner.',
        descriptionUz: 'Nonushta, tushlik va kechki ovqatda iste’mol qilinadigan asosiy oziq-ovqatlar.',
        items: [
          'Bread — Non',
          'Rice — Guruch',
          'Egg — Tuxum',
          'Meat — Go‘sht',
          'Chicken — Tovuq go‘shti',
          'Fish — Baliq',
          'Milk — Sut',
          'Cheese — Pishloq',
          'Butter — Sariyog‘',
          'Soup — Sho‘rva',
          'Pasta — Makaron',
          'Yogurt — Qatiq / Yogurt',
          'Pilaf / Osh — Palov',
          'Honey — Asal'
        ],
        itemsUz: [
          'Non',
          'Guruch',
          'Tuxum',
          'Go‘sht',
          'Tovuq go‘shti',
          'Baliq',
          'Sut',
          'Pishloq',
          'Sariyog‘',
          'Sho‘rva',
          'Makaron',
          'Qatiq / Yogurt',
          'Palov',
          'Asal'
        ],
        vocabulary: [
          { english: 'Bread', uzbek: 'Non', phonetic: '/bred/', exampleSentence: 'Warm fresh bread is on the table.', exampleSentenceUz: 'Issiq yangi non dasturxonda turibdi.', audioHint: 'One syllable: rhymes with "head".' },
          { english: 'Rice', uzbek: 'Guruch', phonetic: '/raɪs/', exampleSentence: 'We use white rice for traditional pilaf.', exampleSentenceUz: 'Biz an’anaviy palov uchun oq guruch ishlatamiz.', audioHint: 'Rhymes with "nice".' },
          { english: 'Egg', uzbek: 'Tuxum', phonetic: '/eɡ/', exampleSentence: 'I eat two boiled eggs for breakfast.', exampleSentenceUz: 'Men nonushtaga ikkita qaynatilgan tuxum yeyman.', audioHint: 'Short "e" sound.' },
          { english: 'Meat', uzbek: 'Go‘sht', phonetic: '/miːt/', exampleSentence: 'Beef is red meat.', exampleSentenceUz: 'Mol go‘shti qizil go‘sht hisoblanadi.', audioHint: 'Sounds like "meet".' },
          { english: 'Chicken', uzbek: 'Tovuq go‘shti', phonetic: '/ˈtʃɪk.ɪn/', exampleSentence: 'Roast chicken is delicious.', exampleSentenceUz: 'Qovurilgan tovuq go‘shti juda mazali.', audioHint: 'Chick-en.' },
          { english: 'Fish', uzbek: 'Baliq', phonetic: '/fɪʃ/', exampleSentence: 'Grilled fish is healthy.', exampleSentenceUz: 'Pishirilgan baliq juda foydali.', audioHint: 'Ends in "sh".' },
          { english: 'Milk', uzbek: 'Sut', phonetic: '/mɪlk/', exampleSentence: 'Cold milk is in the cup.', exampleSentenceUz: 'Sovuq sut finjonda.', audioHint: 'One syllable: m-i-l-k.' },
          { english: 'Cheese', uzbek: 'Pishloq', phonetic: '/tʃiːz/', exampleSentence: 'I like cheese on my sandwich.', exampleSentenceUz: 'Sendvichimda pishloq bo‘lishini yaxshi ko‘raman.', audioHint: 'Long "ee" like "bee".' },
          { english: 'Butter', uzbek: 'Sariyog‘', phonetic: '/ˈbʌt̬.ɚ/', exampleSentence: 'Put butter on warm bread.', exampleSentenceUz: 'Issiq nonga sariyog‘ surting.', audioHint: 'But-ter.' },
          { english: 'Soup', uzbek: 'Sho‘rva', phonetic: '/suːp/', exampleSentence: 'Warm soup is comforting on cold days.', exampleSentenceUz: 'Issiq sho‘rva sovuq kunlarda darmon bo‘ladi.', audioHint: 'Rhymes with "hoop".' },
          { english: 'Pasta', uzbek: 'Makaron', phonetic: '/ˈpɑː.stə/', exampleSentence: 'We have pasta with tomato sauce.', exampleSentenceUz: 'Biz pomidor sousli makaron yeymiz.', audioHint: 'Pas-ta.' },
          { english: 'Yogurt', uzbek: 'Qatiq / Yogurt', phonetic: '/ˈjoʊ.ɡɚt/', exampleSentence: 'Natural yogurt is good for digestion.', exampleSentenceUz: 'Tabiiy qatiq hazm qilish uchun foydali.', audioHint: 'Yo-gurt.' },
          { english: 'Pilaf', uzbek: 'Palov / Osh', phonetic: '/piːˈlɑːf/', exampleSentence: 'Uzbek pilaf is cooked with rice, meat, and carrots.', exampleSentenceUz: 'O‘zbekcha palov guruch, go‘sht va sabzi bilan pishiriladi.', audioHint: 'Pi-laf.' },
          { english: 'Honey', uzbek: 'Asal', phonetic: '/ˈhʌn.i/', exampleSentence: 'Sweet honey goes well with warm tea.', exampleSentenceUz: 'Shirin asal issiq choy bilan ajoyib ketadi.', audioHint: 'Hun-ey.' }
        ]
      },

      // LESSON 4: DRINKS (12 DRINKS WITH EXACT REQUESTED ITEMS)
      {
        id: 'food-l4',
        title: 'Lesson 4: Drinks',
        titleUz: '4-dars: Ichimliklar',
        lessonNumber: 4,
        category: 'vocabulary',
        description: 'Common drinks and beverages ordered in cafes and homes.',
        descriptionUz: 'Kafeda va uyda ichiladigan asosiy ichimliklar nomlari.',
        items: [
          'Water — Suv',
          'Tea — Choy',
          'Coffee — Qahva',
          'Juice — Sharbat',
          'Milk — Sut',
          'Lemonade — Limonad',
          'Mineral water — Mineral suv',
          'Hot chocolate — Issiq shokolad',
          'Green tea — Ko‘k choy',
          'Black tea — Qora choy',
          'Compote — Kompot',
          'Ayran — Ayron'
        ],
        itemsUz: [
          'Suv',
          'Choy',
          'Qahva',
          'Sharbat',
          'Sut',
          'Limonad',
          'Mineral suv',
          'Issiq shokolad',
          'Ko‘k choy',
          'Qora choy',
          'Kompot',
          'Ayron'
        ],
        vocabulary: [
          { english: 'Water', uzbek: 'Suv', phonetic: '/ˈwɑː.t̬ɚ/', exampleSentence: 'Please drink clean water.', exampleSentenceUz: 'Iltimos, toza suv iching.', audioHint: 'Wa-ter.' },
          { english: 'Tea', uzbek: 'Choy', phonetic: '/tiː/', exampleSentence: 'Tea is our favorite drink.', exampleSentenceUz: 'Choy bizning eng sevimli ichimligimiz.', audioHint: 'Rhymes with "see".' },
          { english: 'Coffee', uzbek: 'Qahva', phonetic: '/ˈkɑː.fi/', exampleSentence: 'Hot coffee smells wonderful in the morning.', exampleSentenceUz: 'Ertalab issiq qahva ajoyib hid taratadi.', audioHint: 'Cof-fee.' },
          { english: 'Juice', uzbek: 'Sharbat', phonetic: '/dʒuːs/', exampleSentence: 'Fresh orange juice is sweet.', exampleSentenceUz: 'Yangi apelsin sharbati shirin.', audioHint: 'Rhymes with "loose".' },
          { english: 'Milk', uzbek: 'Sut', phonetic: '/mɪlk/', exampleSentence: 'A glass of warm milk before sleep.', exampleSentenceUz: 'Uxlayotganda bir stakan iliq sut.', audioHint: 'M-i-l-k.' },
          { english: 'Lemonade', uzbek: 'Limonad', phonetic: '/ˌlem.əˈneɪd/', exampleSentence: 'Cold lemonade is refreshing.', exampleSentenceUz: 'Muzdek limonad chanqoqni bosadi.', audioHint: 'Lem-on-ade.' },
          { english: 'Mineral water', uzbek: 'Mineral suv', phonetic: '/ˈmɪn.ər.əl ˌwɑː.t̬ɚ/', exampleSentence: 'Still or sparkling mineral water?', exampleSentenceUz: 'Gazsizmi yoki gazli mineral suvmi?', audioHint: 'Min-er-al wa-ter.' },
          { english: 'Hot chocolate', uzbek: 'Issiq shokolad', phonetic: '/ˌhɑːt ˈtʃɑːk.lət/', exampleSentence: 'Hot chocolate warms you in winter.', exampleSentenceUz: 'Issiq shokolad qishda sizni isitadi.', audioHint: 'Hot choc-o-late.' },
          { english: 'Green tea', uzbek: 'Ko‘k choy', phonetic: '/ˌɡriːn ˈtiː/', exampleSentence: 'In Uzbekistan, we drink green tea in bowls.', exampleSentenceUz: 'O‘zbekistonda ko‘k choyni piyolada ichamiz.', audioHint: 'Green + tea.' },
          { english: 'Black tea', uzbek: 'Qora choy', phonetic: '/ˌblæk ˈtiː/', exampleSentence: 'Black tea with lemon and sugar.', exampleSentenceUz: 'Limon va shakarli qora choy.', audioHint: 'Black + tea.' },
          { english: 'Compote', uzbek: 'Kompot', phonetic: '/ˈkɑːm.poʊt/', exampleSentence: 'Homemade fruit compote is delicious.', exampleSentenceUz: 'Uyda tayyorlangan mevali kompot juda mazali.', audioHint: 'Com-pote.' },
          { english: 'Ayran', uzbek: 'Ayron', phonetic: '/aɪˈrɑːn/', exampleSentence: 'Cold ayran is good with summer lunch.', exampleSentenceUz: 'Yozgi tushlikda muzdek ayron ajoyib ketadi.', audioHint: 'Ay-ran.' }
        ]
      },

      // LESSON 5: TALKING ABOUT FOOD PREFERENCES (INTRODUCED ONLY AFTER VOCABULARY!)
      {
        id: 'food-l5',
        title: 'Lesson 5: Talking About Food Preferences',
        titleUz: '5-dars: Taom ta’bi haqida gapirish',
        lessonNumber: 5,
        category: 'sentences',
        description: 'Only after learning the food vocabulary, master sentence patterns with interactive substitutions.',
        descriptionUz: 'Lug‘atni o‘rgangach, endi o‘z ta’bingiz va xohishingizni ifodalovchi gap qoliplarini mashq qiling.',
        items: [
          'I like apples. — Men olmani yaxshi ko‘raman.',
          'I don\'t like coffee. — Men qahvani yoqtirmayman.',
          'My favorite food is soup. — Mening sevimli taomim sho‘rva.',
          'I drink tea every morning. — Men har kuni ertalab choy ichaman.',
          'I would like some water, please. — Iltimos, menga suv bering.'
        ],
        itemsUz: [
          'Men olmani yaxshi ko‘raman.',
          'Men qahvani yoqtirmayman.',
          'Mening sevimli taomim sho‘rva.',
          'Men har kuni ertalab choy ichaman.',
          'Iltimos, menga suv bering.'
        ],
        sentences: [
          {
            english: 'I like apples.',
            uzbek: 'Men olmani yaxshi ko‘raman.',
            patternRule: 'I like + [Food / Fruit / Drink]',
            substitutions: {
              slotName: 'Food / Drink',
              options: [
                { en: 'apples', uz: 'olmani' },
                { en: 'bananas', uz: 'bananni' },
                { en: 'grapes', uz: 'uzumni' },
                { en: 'soup', uz: 'sho‘rvani' },
                { en: 'bread', uz: 'nonni' },
                { en: 'pilaf', uz: 'palovni' },
                { en: 'green tea', uz: 'ko‘k choyni' }
              ]
            }
          },
          {
            english: "I don't like coffee.",
            uzbek: 'Men qahvani yoqtirmayman.',
            patternRule: "I don't like + [Food / Drink]",
            substitutions: {
              slotName: 'Food / Drink',
              options: [
                { en: 'coffee', uz: 'qahvani' },
                { en: 'garlic', uz: 'sarimsoqni' },
                { en: 'onions', uz: 'piyozni' },
                { en: 'black tea', uz: 'qora choyni' }
              ]
            }
          },
          {
            english: 'My favorite food is soup.',
            uzbek: 'Mening sevimli taomim sho‘rva.',
            patternRule: 'My favorite food is + [Food]',
            substitutions: {
              slotName: 'Favorite Food',
              options: [
                { en: 'soup', uz: 'sho‘rva' },
                { en: 'pilaf', uz: 'palov' },
                { en: 'chicken with rice', uz: 'guruchli tovuq' },
                { en: 'pasta', uz: 'makaron' },
                { en: 'pumpkin somsa', uz: 'qovoqli somsa' }
              ]
            }
          },
          {
            english: 'I drink tea every morning.',
            uzbek: 'Men har kuni ertalab choy ichaman.',
            patternRule: 'I drink + [Drink] + every morning',
            substitutions: {
              slotName: 'Drink',
              options: [
                { en: 'tea', uz: 'choy' },
                { en: 'green tea', uz: 'ko‘k choy' },
                { en: 'clean water', uz: 'toza suv' },
                { en: 'warm milk', uz: 'iliq sut' },
                { en: 'orange juice', uz: 'apelsin sharbati' }
              ]
            }
          },
          {
            english: 'I would like some water, please.',
            uzbek: 'Iltimos, menga suv bering.',
            patternRule: 'I would like some + [Drink / Food], please.',
            substitutions: {
              slotName: 'Request Item',
              options: [
                { en: 'water', uz: 'suv' },
                { en: 'green tea', uz: 'ko‘k choy' },
                { en: 'bread', uz: 'non' },
                { en: 'lemonade', uz: 'limonad' },
                { en: 'hot chocolate', uz: 'issiq shokolad' }
              ]
            }
          }
        ]
      },

      // LESSON 6: LISTENING AND SPEAKING PRACTICE
      {
        id: 'food-l6',
        title: 'Lesson 6: Listening and Speaking Practice',
        titleUz: '6-dars: Tinglash va gapirish amaliyoti',
        lessonNumber: 6,
        category: 'practice',
        description: 'Realistic cafe and dinner conversations about food and drinks.',
        descriptionUz: 'Taom va ichimliklar haqidagi hayotiy suhbatlar va nutq mashqlari.',
        items: [
          'Waiter: Welcome! What would you like to drink? — Xush kelibsiz! Nima ichishni xohlaysiz?',
          'Customer: I would like some green tea, please. — Iltimos, menga ko‘k choy bering.',
          'Waiter: And what is your favorite food for lunch? — Tushlik uchun sevimli taomingiz nima?',
          'Customer: My favorite food is traditional pilaf with fresh salad. — Mening sevimli taomim barra salatli an’anaviy palov.',
          'Customer: I also like apples and grapes for dessert! — Shuningdek shirinlikka olma va uzumni yaxshi ko‘raman!'
        ],
        itemsUz: [
          'Ofitsiant: Xush kelibsiz! Nima ichishni xohlaysiz?',
          'Mijoz: Iltimos, menga ko‘k choy bering.',
          'Ofitsiant: Tushlikka sevimli taomingiz nima?',
          'Mijoz: Sevimli taomim barra salatli an’anaviy palov.',
          'Mijoz: Shirinlikka olma va uzumni ham yaxshi ko‘raman!'
        ],
        dialogue: [
          { speaker: 'Waiter', text: 'Welcome! What would you like to drink today?' },
          { speaker: 'David', text: 'I would like some warm green tea, please.' },
          { speaker: 'Waiter', text: 'Certainly! And what food would you like?' },
          { speaker: 'David', text: 'My favorite food is rice with vegetables and chicken.' },
          { speaker: 'Waiter', text: 'Excellent choice. Would you like some fresh fruit?' },
          { speaker: 'David', text: 'Yes, please! I like sweet apples and grapes.' }
        ]
      }
    ],
    dialogue: [
      { speaker: 'Waiter', text: 'Welcome! What would you like to drink today?' },
      { speaker: 'David', text: 'I would like some warm green tea, please.' },
      { speaker: 'Waiter', text: 'Certainly! And what food would you like?' },
      { speaker: 'David', text: 'My favorite food is rice with vegetables and chicken.' },
      { speaker: 'Waiter', text: 'Excellent choice. Would you like some fresh fruit?' },
      { speaker: 'David', text: 'Yes, please! I like sweet apples and grapes.' }
    ],
    speakingActivities: [
      'Practice naming 5 fruits you like in English.',
      'Practice naming 3 vegetables you eat in soup or salads.',
      'Politely order a drink using "I would like some..., please".',
      'Explain your favorite meal using "My favorite food is...".',
      'Record your voice talking about what you drink every morning.'
    ],
    prompts: [
      {
        id: 'food-q1',
        question: 'What is your favorite food and what drink do you like every morning?',
        questionUz: 'Sevimli taomingiz nima va har kuni ertalab qanday ichimlik ichasiz?',
        sentenceStarters: ['My favorite food is...', 'I like eating...', 'Every morning, I drink...'],
        exampleAnswer: 'My favorite food is warm pilaf with salad, and every morning I drink hot green tea with honey.',
        teacherTip: 'Use words from Lesson 1–4: fruits, vegetables, and drinks.'
      }
    ],
    completionMessage: 'Well done! You completed Topic 4: My Favorite Food and Drinks. You learned fruits, vegetables, staple foods, drinks, and sentence patterns.',
    completionMessageUz: 'Barakalla! Siz 4-mavzuni tugatdingiz. Mevalar, sabzavotlar, taomlar va ichimliklarni mukammal o‘rgandingiz.',
    listenAndChoose: [
      {
        id: 'food-lc1',
        audioPrompt: 'Every morning, I drink hot green tea with honey and eat fresh bread with butter.',
        question: 'What does the speaker drink every morning?',
        options: [
          { id: 'opt-1', text: 'Hot green tea with honey', isCorrect: true },
          { id: 'opt-2', text: 'Cold lemonade only', isCorrect: false },
          { id: 'opt-3', text: 'Black coffee without sugar', isCorrect: false }
        ],
        explanation: 'The speaker said: "I drink hot green tea with honey".'
      },
      {
        id: 'food-lc2',
        audioPrompt: 'I love fresh fruits. My favorite fruits are sweet watermelon, red strawberries, and ripe peaches.',
        question: 'Which fruits does the speaker love?',
        options: [
          { id: 'opt-a', text: 'Watermelon, strawberries, and peaches', isCorrect: true },
          { id: 'opt-b', text: 'Onions and garlic only', isCorrect: false },
          { id: 'opt-c', text: 'Rice and meat', isCorrect: false }
        ],
        explanation: 'The speaker explicitly listed watermelon, strawberries, and peaches.'
      }
    ],
    vocabularyChallenge: [
      {
        id: 'vocab-apple',
        word: 'Apple',
        phonetic: '/ˈæp.əl/',
        definition: 'A round fruit with red, yellow, or green skin and sweet white flesh.',
        exampleSentence: 'I eat an apple every day.',
        audioHint: 'Short "a" sound.'
      },
      {
        id: 'vocab-carrot',
        word: 'Carrot',
        phonetic: '/ˈker.ət/',
        definition: 'A long pointed orange vegetable that grows underground.',
        exampleSentence: 'Carrots make the soup taste sweet.',
        audioHint: 'Car-rot.'
      },
      {
        id: 'vocab-bread',
        word: 'Bread',
        phonetic: '/bred/',
        definition: 'A staple baked food made of flour and water.',
        exampleSentence: 'Fresh warm bread is on the table.',
        audioHint: 'Rhymes with "red".'
      },
      {
        id: 'vocab-water',
        word: 'Water',
        phonetic: '/ˈwɑː.t̬ɚ/',
        definition: 'A clear liquid essential for all life.',
        exampleSentence: 'I would like some water, please.',
        audioHint: 'Wa-ter.'
      }
    ],
    sentenceBuilder: [
      {
        id: 'sb-food-1',
        instruction: 'Assemble this sentence expressing a food preference:',
        targetSentence: 'My favorite food is soup',
        scrambledWords: ['food', 'is', 'soup', 'My', 'favorite'],
        hint: 'Start with "My favorite".'
      },
      {
        id: 'sb-food-2',
        instruction: 'Assemble this polite drink order:',
        targetSentence: 'I would like some water please',
        scrambledWords: ['please', 'water', 'some', 'like', 'I', 'would'],
        hint: 'Start with "I would like".'
      }
    ],
    aiRoleplayScenario: {
      id: 'ai-roleplay-food',
      scenarioTitle: 'Ordering at an Accessible Food Cafe',
      aiRole: 'Oliver, a helpful cafe waiter',
      contextDescription: 'You are ordering lunch at a cozy cafe. Oliver greets you and asks what you would like to eat and drink.',
      initialAIGreeting: 'Hello and welcome! What would you like to drink today? We have fresh water, tea, coffee, and fruit juice.',
      suggestedStudentStarters: [
        'I would like some green tea, please.',
        'My favorite food is soup and rice.',
        'Do you have fresh apples and watermelon?'
      ]
    },
    speakingMission: {
      id: 'mission-food',
      missionTitle: 'Describe Your Food and Drink Preferences',
      promptQuestion: 'Tell your speaking partner about two foods you like, one drink you enjoy, and one thing you do not like.',
      sampleGoodAnswer: 'I like apples and rice with chicken. I drink tea every morning with honey. I do not like black coffee.',
      teacherEncouragement: 'Use your favorite words from our Fruits, Vegetables, and Drinks lessons!'
    }
  },

  // ==============================================================================
  // TOPIC 5: FREE TIME AND HOBBIES (EXACT USER SPECIFICATION)
  // ==============================================================================
  {
    id: 'hobbies-free-time',
    title: 'Free Time and Hobbies',
    titleUz: 'Bo‘sh vaqt va qiziqishlar',
    subtitle: 'Learn indoor hobbies, outdoor hobbies, sports, and talking about hobbies.',
    subtitleUz: 'Uy ichidagi va tashqarisidagi mashg‘ulotlar, sport va qiziqishlar haqida gapirishni o‘rganing.',
    level: 'A1',
    levelGroup: 'Level 1',
    learningObjective: 'Learn categorized hobby vocabulary first (indoor, outdoor, sports), then practice sentence patterns and speaking.',
    learningObjectiveUz: 'Avval sevimli mashg‘ulotlar lug‘atini (uy, ochiq havo, sport) o‘rganib, so‘ng ular haqida gap tuzish.',
    iconName: 'smile',
    color: 'emerald',
    audioInstruction: 'Welcome to Topic 5: Free Time and Hobbies. Learn indoor hobbies first, outdoor hobbies second, sports third, and then practice talking about your favorite hobbies with sentence patterns.',
    audioInstructionUz: '5-mavzuga xush kelibsiz: Bo‘sh vaqt va qiziqishlar. Avval uy mashg‘ulotlari, keyin ochiq havoda hordiq, sport turlari va so‘ngra qiziqishlaringiz haqida gapirishni o‘rganasiz.',
    lessons: [
      // LESSON 1: INDOOR HOBBIES (EXACT USER SPECIFICATION)
      {
        id: 'hobby-l1',
        title: 'Lesson 1: Indoor Hobbies',
        titleUz: '1-dars: Uy ichidagi mashg‘ulotlar',
        lessonNumber: 1,
        category: 'vocabulary',
        description: 'Learn hobbies and creative activities you enjoy inside the home.',
        descriptionUz: 'Uy ichida maroq bilan shug‘ullaniladigan qiziqarli mashg‘ulotlar nomlari.',
        items: [
          'Reading — Kitob o‘qish',
          'Drawing — Rasm chizish',
          'Cooking — Ovqat pishirish',
          'Singing — Qo‘shiq aytish',
          'Listening to music — Musiqa tinglash',
          'Playing chess — Shaxmat o‘ynash',
          'Watching movies — Film tomosha qilish',
          'Playing video games — Video o‘yinlar o‘ynash',
          'Knitting — To‘qish',
          'Solving puzzles — Boshqotirma yechish',
          'Writing stories — Hikoyalar yozish',
          'Baking — Pishiriq pishirish'
        ],
        itemsUz: [
          'Kitob o‘qish',
          'Rasm chizish',
          'Ovqat pishirish',
          'Qo‘shiq aytish',
          'Musiqa tinglash',
          'Shaxmat o‘ynash',
          'Film tomosha qilish',
          'Video o‘yinlar o‘ynash',
          'To‘qish',
          'Boshqotirma yechish',
          'Hikoyalar yozish',
          'Pishiriq pishirish'
        ],
        vocabulary: [
          { english: 'Reading', uzbek: 'Kitob o‘qish', phonetic: '/ˈriː.dɪŋ/', exampleSentence: 'Reading audiobooks is my favorite hobby.', exampleSentenceUz: 'Audiokitoblar tinglash mening sevimli mashg‘ulotim.', audioHint: 'Read-ing.' },
          { english: 'Drawing', uzbek: 'Rasm chizish', phonetic: '/ˈdrɑː.ɪŋ/', exampleSentence: 'She is drawing a beautiful tree.', exampleSentenceUz: 'U go‘zal daraxt rasmini chizyapti.', audioHint: 'Draw-ing.' },
          { english: 'Cooking', uzbek: 'Ovqat pishirish', phonetic: '/ˈkʊk.ɪŋ/', exampleSentence: 'Cooking dinner for my family makes me happy.', exampleSentenceUz: 'Oilamga kechki ovqat pishirish menga quvonch keltiradi.', audioHint: 'Cook-ing.' },
          { english: 'Singing', uzbek: 'Qo‘shiq aytish', phonetic: '/ˈsɪŋ.ɪŋ/', exampleSentence: 'He enjoys singing traditional songs.', exampleSentenceUz: 'U an’anaviy qo‘shiqlarni kuylashni yoqtiradi.', audioHint: 'Sing-ing.' },
          { english: 'Listening to music', uzbek: 'Musiqa tinglash', phonetic: '/ˈlɪs.ən.ɪŋ tuː ˈmjuː.zɪk/', exampleSentence: 'I relax by listening to music.', exampleSentenceUz: 'Men musiqa tinglab dam olaman.', audioHint: 'Lis-ten-ing.' },
          { english: 'Playing chess', uzbek: 'Shaxmat o‘ynash', phonetic: '/ˈpleɪ.ɪŋ tʃes/', exampleSentence: 'Uzbek grandmasters are great at playing chess.', exampleSentenceUz: 'O‘zbekistonlik grossmeysterlar shaxmat o‘ynashda tengsiz.', audioHint: 'Play-ing chess.' }
        ]
      },

      // LESSON 2: OUTDOOR HOBBIES (EXACT USER SPECIFICATION)
      {
        id: 'hobby-l2',
        title: 'Lesson 2: Outdoor Hobbies',
        titleUz: '2-dars: Ochiq havodagi mashg‘ulotlar',
        lessonNumber: 2,
        category: 'vocabulary',
        description: 'Activities and pastimes enjoyed outside in fresh air and nature.',
        descriptionUz: 'Toza havoda va tabiat qo‘ynida bajariladigan ajoyib mashg‘ulotlar.',
        items: [
          'Walking — Sayr qilish / Piyoda yurish',
          'Running — Yugurish',
          'Cycling — Velosiped minish',
          'Gardening — Bog‘dorchilik qilish',
          'Hiking — Tog‘da piyoda yurish',
          'Fishing — Baliq ovlash',
          'Camping — Chodirda dam olish',
          'Photography — Suratga olish',
          'Horse riding — Ot minish',
          'Traveling — Sayohat qilish',
          'Bird watching — Qushlarni kuzatish',
          'Rollerblading — Rolikda uchish'
        ],
        itemsUz: [
          'Sayr qilish / Piyoda yurish',
          'Yugurish',
          'Velosiped minish',
          'Bog‘dorchilik qilish',
          'Tog‘da piyoda yurish',
          'Baliq ovlash',
          'Chodirda dam olish',
          'Suratga olish',
          'Ot minish',
          'Sayohat qilish',
          'Qushlarni kuzatish',
          'Rolikda uchish'
        ],
        vocabulary: [
          { english: 'Walking', uzbek: 'Sayr qilish', phonetic: '/ˈwɑː.kɪŋ/', exampleSentence: 'A morning walking routine keeps you fit.', exampleSentenceUz: 'Ertalabki sayr qilish tetiklik beradi.', audioHint: 'Silent "l": walk-ing.' },
          { english: 'Running', uzbek: 'Yugurish', phonetic: '/ˈrʌn.ɪŋ/', exampleSentence: 'He goes running in the park every morning.', exampleSentenceUz: 'U har kuni ertalab bog‘da yugurish bilan shug‘ullanadi.', audioHint: 'Run-ning.' },
          { english: 'Cycling', uzbek: 'Velosiped minish', phonetic: '/ˈsaɪ.klɪŋ/', exampleSentence: 'Cycling along the street is fun.', exampleSentenceUz: 'Ko‘chada velosiped minish maroqli.', audioHint: 'Cy-cling.' },
          { english: 'Gardening', uzbek: 'Bog‘dorchilik', phonetic: '/ˈɡɑːr.dən.ɪŋ/', exampleSentence: 'My grandfather enjoys gardening.', exampleSentenceUz: 'Bobom bog‘dorchilik qilishni yaxshi ko‘radi.', audioHint: 'Gar-den-ing.' },
          { english: 'Hiking', uzbek: 'Tog‘da sayr qilish', phonetic: '/ˈhaɪ.kɪŋ/', exampleSentence: 'Hiking in the Chimgan mountains is exciting.', exampleSentenceUz: 'Chimyon tog‘larida piyoda yurish zavqli.', audioHint: 'Hike-ing.' },
          { english: 'Fishing', uzbek: 'Baliq ovlash', phonetic: '/ˈfɪʃ.ɪŋ/', exampleSentence: 'My uncle loves fishing at the lake.', exampleSentenceUz: 'Tog‘am ko‘lda baliq ovlashni yaxshi ko‘radi.', audioHint: 'Fish-ing.' }
        ]
      },

      // LESSON 3: SPORTS AND ACTIVITIES (EXACT USER SPECIFICATION)
      {
        id: 'hobby-l3',
        title: 'Lesson 3: Sports and Physical Activities',
        titleUz: '3-dars: Sport va faol mashg‘ulotlar',
        lessonNumber: 3,
        category: 'vocabulary',
        description: 'Sports, team games, and fitness activities.',
        descriptionUz: 'Sport turlari, jamoaviy o‘yinlar va chiniqish mashqlari.',
        items: [
          'Football — Futbol',
          'Basketball — Basketbol',
          'Swimming — Suzish',
          'Dancing — Raqsga tushish',
          'Yoga — Yoga mashqlari',
          'Volleyball — Voleybol',
          'Tennis — Tennis',
          'Gymnastics — Gimnastika',
          'Table tennis — Stol tennisi',
          'Karate / Martial arts — Kurash / Jang san’ati',
          'Badminton — Badminton',
          'Fitness — Fitnes / Chiniqish'
        ],
        itemsUz: [
          'Futbol',
          'Basketbol',
          'Suzish',
          'Raqsga tushish',
          'Yoga mashqlari',
          'Voleybol',
          'Tennis',
          'Gimnastika',
          'Stol tennisi',
          'Kurash / Jang san’ati',
          'Badminton',
          'Fitnes / Chiniqish'
        ],
        vocabulary: [
          { english: 'Football', uzbek: 'Futbol', phonetic: '/ˈfʊt.bɑːl/', exampleSentence: 'Millions of people play football.', exampleSentenceUz: 'Millionlab odamlar futbol o‘ynaydi.', audioHint: 'Foot + ball.' },
          { english: 'Swimming', uzbek: 'Suzish', phonetic: '/ˈswɪm.ɪŋ/', exampleSentence: 'Swimming in the pool is refreshing.', exampleSentenceUz: 'Hovuzda suzish tetiklashtiradi.', audioHint: 'Swim-ming.' },
          { english: 'Dancing', uzbek: 'Raqsga tushish', phonetic: '/ˈdæn.sɪŋ/', exampleSentence: 'Uzbek national dancing is graceful.', exampleSentenceUz: 'O‘zbek milliy raqsi juda nafis.', audioHint: 'Dan-cing.' },
          { english: 'Yoga', uzbek: 'Yoga', phonetic: '/ˈjoʊ.ɡə/', exampleSentence: 'Yoga helps relax the mind and body.', exampleSentenceUz: 'Yoga aql va tanani bo‘shashtirishga yordam beradi.', audioHint: 'Yo-ga.' }
        ]
      },

      // LESSON 4: TALKING ABOUT HOBBIES (EXACT USER SPECIFICATION - AFTER VOCAB!)
      {
        id: 'hobby-l4',
        title: 'Lesson 4: Talking About Hobbies',
        titleUz: '4-dars: Qiziqishlar haqida gapirish',
        lessonNumber: 4,
        category: 'sentences',
        description: 'Use the hobby vocabulary to speak about what you like and do on weekends.',
        descriptionUz: 'Lug‘atdagi so‘zlardan foydalanib, bo‘sh vaqtingiz haqida gapiring.',
        items: [
          'I like reading. — Men kitob o‘qishni yaxshi ko‘raman.',
          'My hobby is cooking. — Mening sevimli mashg‘ulotim ovqat pishirish.',
          'I enjoy listening to music. — Men musiqa tinglashdan zavqlanaman.',
          'I play football on weekends. — Men dam olish kunlari futbol o‘ynayman.',
          'In my free time, I like walking. — Bo‘sh vaqtimda sayr qilishni yoqtiraman.'
        ],
        itemsUz: [
          'Men kitob o‘qishni yaxshi ko‘raman.',
          'Mening sevimli mashg‘ulotim ovqat pishirish.',
          'Men musiqa tinglashdan zavqlanaman.',
          'Men dam olish kunlari futbol o‘ynayman.',
          'Bo‘sh vaqtimda sayr qilishni yoqtiraman.'
        ],
        sentences: [
          {
            english: 'I like reading.',
            uzbek: 'Men kitob o‘qishni yaxshi ko‘raman.',
            patternRule: 'I like + [Hobby (-ing)]',
            substitutions: {
              slotName: 'Hobby',
              options: [
                { en: 'reading', uz: 'kitob o‘qishni' },
                { en: 'cooking', uz: 'ovqat pishirishni' },
                { en: 'swimming', uz: 'suzishni' },
                { en: 'drawing', uz: 'rasm chizishni' },
                { en: 'dancing', uz: 'raqsga tushishni' }
              ]
            }
          },
          {
            english: 'My hobby is cooking.',
            uzbek: 'Mening sevimli mashg‘ulotim ovqat pishirish.',
            patternRule: 'My hobby is + [Activity]',
            substitutions: {
              slotName: 'Hobby',
              options: [
                { en: 'cooking', uz: 'ovqat pishirish' },
                { en: 'playing chess', uz: 'shaxmat o‘ynash' },
                { en: 'gardening', uz: 'bog‘dorchilik' },
                { en: 'cycling', uz: 'velosiped minish' }
              ]
            }
          },
          {
            english: 'I enjoy listening to music.',
            uzbek: 'Men musiqa tinglashdan zavqlanaman.',
            patternRule: 'I enjoy + [Activity (-ing)]',
            substitutions: {
              slotName: 'Enjoyment',
              options: [
                { en: 'listening to music', uz: 'musiqa tinglashdan' },
                { en: 'walking in nature', uz: 'tabiatda sayr qilishdan' },
                { en: 'playing video games', uz: 'video o‘yinlar o‘ynashdan' }
              ]
            }
          },
          {
            english: 'I play football on weekends.',
            uzbek: 'Men dam olish kunlari futbol o‘ynayman.',
            patternRule: 'I play + [Sport] + on weekends',
            substitutions: {
              slotName: 'Sport',
              options: [
                { en: 'football', uz: 'futbol' },
                { en: 'basketball', uz: 'basketbol' },
                { en: 'table tennis', uz: 'stol tennisi' },
                { en: 'volleyball', uz: 'voleybol' }
              ]
            }
          }
        ]
      },

      // LESSON 5: LISTENING AND SPEAKING PRACTICE
      {
        id: 'hobby-l5',
        title: 'Lesson 5: Listening and Speaking Practice',
        titleUz: '5-dars: Tinglash va gapirish amaliyoti',
        lessonNumber: 5,
        category: 'practice',
        description: 'Listen to a natural dialogue about hobbies and practice speaking with your partner.',
        descriptionUz: 'Qiziqishlar haqidagi suhbatni tinglang va sherigingiz bilan gaplashishni mashq qiling.',
        items: [
          'A: What do you like doing in your free time? — Bo‘sh vaqtingizda nima qilishni yoqtirasiz?',
          'B: I enjoy listening to music and reading audiobooks. How about you? — Men musiqa tinglash va audiokitob o‘qishdan zavqlanaman. Siz-chi?',
          'A: My hobby is cooking! On weekends, I also play football. — Mening qiziqishim ovqat pishirish! Dam olish kunlari futbol ham o‘ynayman.',
          'B: That sounds wonderful! Do you play football with friends? — Ajoyib-ku! Futbolni do‘stlaringiz bilan o‘ynaysizmi?',
          'A: Yes, we play every Saturday morning! — Ha, har shanba ertalab o‘ynaymiz!'
        ],
        itemsUz: [
          'A: Bo‘sh vaqtingizda nima qilishni yoqtirasiz?',
          'B: Musiqa tinglash va audiokitob o‘qishni yoqtiraman. Siz-chi?',
          'A: Mening qiziqishim ovqat pishirish! Dam olish kunlari futbol ham o‘ynayman.',
          'B: Ajoyib-ku! Futbolni do‘stlar bilan o‘ynaysizmi?',
          'A: Ha, har shanba ertalab o‘ynaymiz!'
        ],
        dialogue: [
          { speaker: 'Anna', text: 'What do you like doing in your free time, David?' },
          { speaker: 'David', text: 'I enjoy reading books and listening to music. My hobby is cooking!' },
          { speaker: 'Anna', text: 'That is awesome! Do you do any sports?' },
          { speaker: 'David', text: 'Yes, I play football on weekends and I love swimming in summer.' }
        ]
      }
    ],
    dialogue: [
      { speaker: 'Anna', text: 'What do you like doing in your free time, David?' },
      { speaker: 'David', text: 'I enjoy reading books and listening to music. My hobby is cooking!' },
      { speaker: 'Anna', text: 'That is awesome! Do you do any sports?' },
      { speaker: 'David', text: 'Yes, I play football on weekends and I love swimming in summer.' }
    ],
    speakingActivities: [
      'Name your favorite indoor hobby in English.',
      'Name one outdoor activity you enjoy.',
      'Say what sport or physical activity you like.',
      'Use the sentence "I play ... on weekends" to describe your routine.',
      'Record an audio answer about what you do in your free time.'
    ],
    prompts: [
      {
        id: 'hobby-q1',
        question: 'What are your hobbies and what do you do in your free time?',
        questionUz: 'Qiziqishlaringiz nima va bo‘sh vaqtingizda nimalar qilasiz?',
        sentenceStarters: ['In my free time, I like...', 'My hobby is...', 'On weekends, I play...'],
        exampleAnswer: 'In my free time, I like reading and listening to music. My hobby is cooking delicious meals for my family.',
        teacherTip: 'Notice the "-ing" on activities: reading, cooking, walking, swimming.'
      }
    ],
    completionMessage: 'Congratulations! You completed Topic 5: Free Time and Hobbies. You have completed Level 1 Foundations!',
    completionMessageUz: 'Tabriklaymiz! Siz 5-mavzuni muvaffaqiyatli yakunladingiz va 1-bosqichni to‘liq tugatdingiz!',
    listenAndChoose: [
      {
        id: 'hobby-lc1',
        audioPrompt: 'On weekends, David plays football with his friends and cooks dinner for his family.',
        question: 'What does David do on weekends?',
        options: [
          { id: 'opt-1', text: 'Plays football and cooks dinner', isCorrect: true },
          { id: 'opt-2', text: 'Only sleeps all day', isCorrect: false },
          { id: 'opt-3', text: 'Goes swimming alone', isCorrect: false }
        ],
        explanation: 'David explicitly said he plays football and cooks dinner.'
      }
    ],
    vocabularyChallenge: [
      {
        id: 'vocab-reading',
        word: 'Reading',
        phonetic: '/ˈriː.dɪŋ/',
        definition: 'The action or skill of reading written or audio material.',
        exampleSentence: 'Reading books expands your world.',
        audioHint: 'Read-ing.'
      },
      {
        id: 'vocab-football',
        word: 'Football',
        phonetic: '/ˈfʊt.bɑːl/',
        definition: 'A popular sport played with a round ball between two teams.',
        exampleSentence: 'I play football on weekends.',
        audioHint: 'Foot-ball.'
      }
    ],
    sentenceBuilder: [
      {
        id: 'sb-hobby-1',
        instruction: 'Assemble this sentence about a weekend hobby:',
        targetSentence: 'I play football on weekends',
        scrambledWords: ['weekends', 'play', 'on', 'football', 'I'],
        hint: 'Start with "I play".'
      }
    ],
    aiRoleplayScenario: {
      id: 'ai-roleplay-hobby',
      scenarioTitle: 'Weekend Hobby Exchange',
      aiRole: 'Lucas, a student hobby club leader',
      contextDescription: 'Lucas is asking members what they enjoy doing in their free time.',
      initialAIGreeting: 'Hi! Welcome to our hobby club. What do you love doing in your free time?',
      suggestedStudentStarters: [
        'I like reading and listening to music.',
        'My hobby is cooking traditional meals.',
        'On weekends, I enjoy playing football and walking.'
      ]
    },
    speakingMission: {
      id: 'mission-hobby',
      missionTitle: 'Share Your Hobbies',
      promptQuestion: 'Describe two hobbies you enjoy: one indoor activity and one outdoor activity or sport.',
      sampleGoodAnswer: 'My favorite indoor hobby is reading books and listening to music. For outdoor fun, I enjoy cycling in the park.',
      teacherEncouragement: 'Speak with excitement! Hobbies bring joy and connect people around the world.'
    }
  }
];
