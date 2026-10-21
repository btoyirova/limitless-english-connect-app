import { ConversationTopic } from '../types';

export const LEVEL_3_TOPICS: ConversationTopic[] = [
  // ==============================================================================
  // TOPIC 11: PLACES IN THE CITY AND TRANSPORTATION
  // ==============================================================================
  {
    id: 'city-transportation',
    title: 'Places in the City and Transportation',
    titleUz: 'Shahar joylari va transport',
    subtitle: 'Learn public buildings, vehicles, asking for directions, and city travel.',
    subtitleUz: 'Shahar binolari, transport turlari, yo‘l so‘rash va sayohatni o‘rganing.',
    level: 'A1-A2',
    levelGroup: 'Level 3',
    learningObjective: 'Learn city places and vehicles first, then practice asking for and giving clear directions.',
    learningObjectiveUz: 'Shahar joylari va transport so‘zlarini o‘rganib, yo‘l so‘rash va yo‘nalish ko‘rsatishni mashq qilish.',
    iconName: 'map-pin',
    color: 'indigo',
    audioInstruction: 'Welcome to Topic 11: Places in the City and Transportation. Learn words for the bank, hospital, bus, metro, and how to ask for directions.',
    audioInstructionUz: '11-mavzuga xush kelibsiz: Shahar va transport. Bank, shifoxona, avtobus, metro va yo‘l so‘rashni o‘rganasiz.',
    lessons: [
      {
        id: 'city-l1',
        title: 'Lesson 1: City Places and Public Buildings',
        titleUz: '1-dars: Shahar joylari va jamoat binolari',
        lessonNumber: 1,
        category: 'vocabulary',
        description: 'Key locations you visit in any city or town.',
        descriptionUz: 'Har qanday shaharda eng ko‘p tashrif buyuriladigan asosiy joylar.',
        items: [
          'Bank — Bank',
          'Hospital — Shifoxona',
          'School — Maktab',
          'Supermarket — Supermarket / Do‘kon',
          'Park — Istirohat bog‘i',
          'Pharmacy / Chemist — Dorixona',
          'Post office — Aloqa bo‘limi / Pochta',
          'Library — Kutubxona',
          'Hotel — Mehmonxona',
          'Mosque — Masjid',
          'Museum — Muzey',
          'Station — Vokzal / Bekat'
        ],
        itemsUz: [
          'Bank',
          'Shifoxona',
          'Maktab',
          'Supermarket',
          'Bog‘',
          'Dorixona',
          'Pochta',
          'Kutubxona',
          'Mehmonxona',
          'Masjid',
          'Muzey',
          'Vokzal / Bekat'
        ],
        vocabulary: [
          { english: 'Pharmacy', uzbek: 'Dorixona', phonetic: '/ˈfɑːr.mə.si/', exampleSentence: 'Buy medicine at the pharmacy.', exampleSentenceUz: 'Dorixonadan dori sotib oling.' },
          { english: 'Park', uzbek: 'Bog‘', phonetic: '/pɑːrk/', exampleSentence: 'A walk in the green park.', exampleSentenceUz: 'Yashil bog‘da sayr qilish.' },
          { english: 'Hospital', uzbek: 'Shifoxona', phonetic: '/ˈhɑː.spɪ.t̬əl/', exampleSentence: 'The hospital is near the center.', exampleSentenceUz: 'Shifoxona markazga yaqin.' }
        ]
      },
      {
        id: 'city-l2',
        title: 'Lesson 2: Transportation and Vehicles',
        titleUz: '2-dars: Transport turlari',
        lessonNumber: 2,
        category: 'vocabulary',
        description: 'Ways of traveling across the city and countryside.',
        descriptionUz: 'Shahar bo‘ylab va viloyatlararo harakatlanish vositalari.',
        items: [
          'Bus — Avtobus',
          'Metro / Subway — Metro',
          'Taxi — Taksi',
          'Car — Avtomobil / Mashina',
          'Train — Poyezd',
          'Bicycle / Bike — Velosiped',
          'Airplane / Plane — Samolyot',
          'Bus stop — Avtobus bekati',
          'Metro station — Metro bekati',
          'Traffic light — Svetofor',
          'Street — Ko‘cha',
          'Road — Yo‘l'
        ],
        itemsUz: [
          'Avtobus',
          'Metro',
          'Taksi',
          'Mashina',
          'Poyezd',
          'Velosiped',
          'Samolyot',
          'Avtobus bekati',
          'Metro bekati',
          'Svetofor',
          'Ko‘cha',
          'Yo‘l'
        ],
        vocabulary: [
          { english: 'Metro', uzbek: 'Metro', phonetic: '/ˈmet.roʊ/', exampleSentence: 'Tashkent Metro stations are stunning.', exampleSentenceUz: 'Toshkent metrosi bekatlari juda go‘zal.' },
          { english: 'Bus stop', uzbek: 'Avtobus bekati', phonetic: '/ˈbʌs ˌstɑːp/', exampleSentence: 'Wait at the bus stop.', exampleSentenceUz: 'Avtobus bekatida kuting.' }
        ]
      },
      {
        id: 'city-l3',
        title: 'Lesson 3: Directions and Prepositions of Place',
        titleUz: '3-dars: Yo‘nalish va o‘rin predloglari',
        lessonNumber: 3,
        category: 'vocabulary',
        description: 'Direction words to navigate streets and landmarks.',
        descriptionUz: 'Ko‘cha va binolarni topish uchun yo‘nalish so‘zlari.',
        items: [
          'Turn left — Chapga buriling',
          'Turn right — O‘ngga buriling',
          'Go straight ahead — To‘g‘riga boring',
          'Next to — Yonida',
          'Opposite — Qarshisida',
          'Near — Yaqinida',
          'Far — Uzoqda',
          'On the corner — Burchakda',
          'Across the street — Ko‘chaning narigi tomonida'
        ],
        itemsUz: [
          'Chapga buriling',
          'O‘ngga buriling',
          'To‘g‘riga boring',
          'Yonida',
          'Qarshisida',
          'Yaqinida',
          'Uzoqda',
          'Burchakda',
          'Ko‘chaning narigi tomonida'
        ],
        vocabulary: [
          { english: 'Turn left', uzbek: 'Chapga buriling', phonetic: '/tɝːn left/', exampleSentence: 'Turn left at the pharmacy.', exampleSentenceUz: 'Dorixona yonidan chapga buriling.' },
          { english: 'Go straight', uzbek: 'To‘g‘riga boring', phonetic: '/ɡoʊ streɪt/', exampleSentence: 'Go straight for two hundred meters.', exampleSentenceUz: 'Ikki yuz metr to‘g‘riga boring.' }
        ]
      },
      {
        id: 'city-l4',
        title: 'Lesson 4: Asking for and Giving Directions',
        titleUz: '4-dars: Yo‘l so‘rash va ko‘rsatish qoliplari',
        lessonNumber: 4,
        category: 'sentences',
        description: 'Polite sentences to ask where buildings are located.',
        descriptionUz: 'Bino va manzillarni muloyimlik bilan so‘rash qoliplari.',
        items: [
          'Excuse me, where is the nearest pharmacy? — Kechirasiz, eng yaqin dorixona qayerda?',
          'Go straight ahead and turn right. — To‘g‘riga boring va o‘ngga buriling.',
          'It is next to the bank. — U bankning yonida.',
          'You can take the bus or metro. — Avtobus yoki metroda borsangiz bo‘ladi.'
        ],
        itemsUz: [
          'Eng yaqin dorixona qayerda?',
          'To‘g‘riga boring va o‘ngga buriling.',
          'U bankning yonida.',
          'Avtobus yoki metroda borsangiz bo‘ladi.'
        ],
        sentences: [
          {
            english: 'Excuse me, where is the pharmacy?',
            uzbek: 'Kechirasiz, dorixona qayerda?',
            patternRule: 'Excuse me, where is the + [Place]?',
            substitutions: {
              slotName: 'Place',
              options: [
                { en: 'pharmacy', uz: 'dorixona' },
                { en: 'metro station', uz: 'metro bekati' },
                { en: 'bank', uz: 'bank' },
                { en: 'park', uz: 'bog‘' },
                { en: 'hotel', uz: 'mehmonxona' }
              ]
            }
          },
          {
            english: 'It is next to the bank.',
            uzbek: 'U bankning yonida.',
            patternRule: 'It is next to the + [Building]',
            substitutions: {
              slotName: 'Landmark',
              options: [
                { en: 'bank', uz: 'bank' },
                { en: 'supermarket', uz: 'supermarket' },
                { en: 'school', uz: 'maktab' },
                { en: 'park', uz: 'bog‘' }
              ]
            }
          }
        ]
      },
      {
        id: 'city-l5',
        title: 'Lesson 5: Listening and Speaking Practice',
        titleUz: '5-dars: Tinglash va gapirish amaliyoti',
        lessonNumber: 5,
        category: 'practice',
        description: 'Dialogue of a lost traveler asking for the metro station.',
        descriptionUz: 'Yo‘l so‘rayotgan sayyoh va yo‘nalish ko‘rsatish suhbati.',
        items: [
          'Traveler: Excuse me, where is the nearest metro station? — Kechirasiz, eng yaqin metro bekati qayerda?',
          'Local: Go straight ahead two blocks, then turn left. It is opposite the park! — Ikki chorraha to‘g‘riga boring, so‘ng chapga buriling. Bog‘ning ro‘parasida!',
          'Traveler: Thank you very much! Have a great day. — Katta rahmat! Kuningiz xayrli o‘tsin.'
        ],
        itemsUz: [
          'Sayyoh: Eng yaqin metro bekati qayerda?',
          'Mahalliy aholi: To‘g‘riga boring, chapga buriling. Bog‘ qarshisida!',
          'Sayyoh: Katta rahmat! Kuningiz xayrli o‘tsin.'
        ],
        dialogue: [
          { speaker: 'Traveler', text: 'Excuse me, how can I get to the city library?' },
          { speaker: 'David', text: 'Go straight ahead and turn right at the traffic light. It is next to the museum.' },
          { speaker: 'Traveler', text: 'Is it far from here?' },
          { speaker: 'David', text: 'No, it is only a five-minute walk. Very close!' }
        ]
      }
    ],
    dialogue: [
      { speaker: 'Traveler', text: 'Excuse me, how can I get to the city library?' },
      { speaker: 'David', text: 'Go straight ahead and turn right at the traffic light. It is next to the museum.' },
      { speaker: 'Traveler', text: 'Is it far from here?' },
      { speaker: 'David', text: 'No, it is only a five-minute walk. Very close!' }
    ],
    speakingActivities: [
      'Name 4 public buildings in your town.',
      'Practice asking: "Excuse me, where is the...?" in English.',
      'Give simple directions: "Turn right and go straight".',
      'Name two types of public transportation you use.',
      'Record an audio guide giving directions to a friend.'
    ],
    prompts: [
      {
        id: 'city-q1',
        question: 'How do you get to school or work, and what places are near your home?',
        questionUz: 'Maktab yoki ishga qanday transportda borasiz va uyingiz yaqinida qanday joylar bor?',
        sentenceStarters: ['I take the...', 'Near my home, there is a...', 'To get there, I...'],
        exampleAnswer: 'I take the metro to work every morning. Near my home, there is a green park and a fresh bakery.',
        teacherTip: 'Use prepositions like "next to", "near", or "by bus".'
      }
    ],
    completionMessage: 'Well done! You finished Topic 11: Places in the City. You can now navigate and give directions in English.',
    completionMessageUz: 'Barakalla! Siz 11-mavzuni tugatdingiz. Endi shaharda yo‘l so‘rash va yo‘nalish ko‘rsatishni bilasiz.',
    listenAndChoose: [
      {
        id: 'city-lc1',
        audioPrompt: 'Go straight ahead along Navoi street, and turn left at the traffic light. The post office is next to the bank.',
        question: 'Where is the post office located?',
        options: [
          { id: 'opt-1', text: 'Next to the bank', isCorrect: true },
          { id: 'opt-2', text: 'Inside the airport', isCorrect: false },
          { id: 'opt-3', text: 'In another country', isCorrect: false }
        ],
        explanation: 'The speaker clearly said: "The post office is next to the bank".'
      }
    ],
    vocabularyChallenge: [
      {
        id: 'vocab-metro',
        word: 'Metro',
        phonetic: '/ˈmet.roʊ/',
        definition: 'An underground electric railway system in a city.',
        exampleSentence: 'I travel by metro.',
        audioHint: 'Met-ro.'
      }
    ],
    sentenceBuilder: [
      {
        id: 'sb-city-1',
        instruction: 'Assemble this direction sentence:',
        targetSentence: 'The pharmacy is next to the bank',
        scrambledWords: ['is', 'bank', 'to', 'The', 'the', 'next', 'pharmacy'],
        hint: 'Start with "The pharmacy".'
      }
    ],
    aiRoleplayScenario: {
      id: 'ai-roleplay-city',
      scenarioTitle: 'Asking for Directions in London',
      aiRole: 'Officer Jenkins, a polite city guide',
      contextDescription: 'You are looking for the British Museum in London.',
      initialAIGreeting: 'Good day! May I assist you with directions today?',
      suggestedStudentStarters: [
        'Excuse me, where is the museum?',
        'Can I take the bus or walk?',
        'Is it near the metro station?'
      ]
    },
    speakingMission: {
      id: 'mission-city',
      missionTitle: 'Guide a Friend in Your City',
      promptQuestion: 'Tell a friend how to get from your home to the nearest market or metro station.',
      sampleGoodAnswer: 'From my home, go straight ahead down the street. Turn right at the supermarket. The metro station is directly opposite the park.',
      teacherEncouragement: 'Speak with clear direction steps. You are giving a wonderful helpful guide!'
    }
  },

  // ==============================================================================
  // TOPIC 12: HEALTH, BODY AND WELLNESS
  // ==============================================================================
  {
    id: 'health-body',
    title: 'Health, Body and Wellness',
    titleUz: 'Salomatlik, tana a’zolari va parvarish',
    subtitle: 'Learn parts of the body, symptoms, healthy habits, and doctor visits.',
    subtitleUz: 'Tana a’zolari, shamollash belgilari, sog‘lom turmush tarzi va shifokor suhbati.',
    level: 'A1-A2',
    levelGroup: 'Level 3',
    learningObjective: 'Learn parts of the body and symptoms first, then practice explaining health feelings and doctor advice.',
    learningObjectiveUz: 'Tana a’zolari va kasallik alomatlarini o‘rganib, salomatlik haqida gapirish.',
    iconName: 'heart',
    color: 'rose',
    audioInstruction: 'Welcome to Topic 12: Health, Body and Wellness. Learn words for head, eyes, hands, how to say when you feel ill, and healthy habits.',
    audioInstructionUz: '12-mavzuga xush kelibsiz: Salomatlik va tana a’zolari. Bosh, ko‘z, qo‘l, shamollash va shifokor bilan suhbatlashishni o‘rganasiz.',
    lessons: [
      {
        id: 'health-l1',
        title: 'Lesson 1: Parts of the Head and Face',
        titleUz: '1-dars: Bosh va yuz a’zolari',
        lessonNumber: 1,
        category: 'vocabulary',
        description: 'Learn facial features and sensory body parts.',
        descriptionUz: 'Yuz va sezgi a’zolari nomlari.',
        items: [
          'Head — Bosh',
          'Face — Yuz',
          'Eye / Eyes — Ko‘z / Ko‘zlar',
          'Ear / Ears — Quloq / Quloqlar',
          'Nose — Burun',
          'Mouth — Og‘iz',
          'Tooth / Teeth — Tish / Tishlar',
          'Hair — Soch',
          'Neck — Bo‘yin',
          'Forehead — Peshona',
          'Tongue — Til',
          'Smile — Tabassum'
        ],
        itemsUz: [
          'Bosh',
          'Yuz',
          'Ko‘z / Ko‘zlar',
          'Quloq / Quloqlar',
          'Burun',
          'Og‘iz',
          'Tish / Tishlar',
          'Soch',
          'Bo‘yin',
          'Peshona',
          'Til',
          'Tabassum'
        ],
        vocabulary: [
          { english: 'Head', uzbek: 'Bosh', phonetic: '/hed/', exampleSentence: 'Rest your head on the pillow.', exampleSentenceUz: 'Boshingizni yostiqqa qo‘ying.' },
          { english: 'Ear', uzbek: 'Quloq', phonetic: '/ɪr/', exampleSentence: 'Listen with both ears.', exampleSentenceUz: 'Ikkala quloq bilan tinglang.' },
          { english: 'Mouth', uzbek: 'Og‘iz', phonetic: '/maʊθ/', exampleSentence: 'A warm friendly smile on her mouth.', exampleSentenceUz: 'Uning yuzida iliq tabassum.' }
        ]
      },
      {
        id: 'health-l2',
        title: 'Lesson 2: Body Parts and Limbs',
        titleUz: '2-dars: Tana va qo‘l-oyoqlar',
        lessonNumber: 2,
        category: 'vocabulary',
        description: 'Learn major parts of the body and posture.',
        descriptionUz: 'Tana, qo‘llar, oyoqlar va qaddi-qomat a’zolari.',
        items: [
          'Body — Tana',
          'Arm — Qo‘l (yelkadan bilakkacha)',
          'Hand — Qo‘l (kaft)',
          'Finger — Barmoq',
          'Leg — Oyoq (son-boldir)',
          'Foot / Feet — Oyoq (panja)',
          'Knee — Tizza',
          'Shoulder — Yelka',
          'Back — Bel / Orqa',
          'Chest — Ko‘krak',
          'Stomach — Oshqozon / Qorin',
          'Heart — Yurak'
        ],
        itemsUz: [
          'Tana',
          'Qo‘l (yelkadan bilakkacha)',
          'Qo‘l (kaft)',
          'Barmoq',
          'Oyoq (son-boldir)',
          'Oyoq (panja)',
          'Tizza',
          'Yelka',
          'Bel / Orqa',
          'Ko‘krak',
          'Qorin / Oshqozon',
          'Yurak'
        ],
        vocabulary: [
          { english: 'Heart', uzbek: 'Yurak', phonetic: '/hɑːrt/', exampleSentence: 'A healthy heart beats steadily.', exampleSentenceUz: 'Sog‘lom yurak maromida uradi.' },
          { english: 'Hand', uzbek: 'Qo‘l (kaft)', phonetic: '/hænd/', exampleSentence: 'Wash your hands with soap.', exampleSentenceUz: 'Qo‘llaringizni sovun bilan yuving.' }
        ]
      },
      {
        id: 'health-l3',
        title: 'Lesson 3: Symptoms and Illnesses',
        titleUz: '3-dars: Kasallik va noxushlik alomatlari',
        lessonNumber: 3,
        category: 'vocabulary',
        description: 'How to describe when you are sick or unwell.',
        descriptionUz: 'O‘zingizni yomon his qilganda holatingizni aytish so‘zlari.',
        items: [
          'Headache — Bosh og‘rig‘i',
          'Stomachache — Qorin og‘rig‘i',
          'Toothache — Tish og‘rig‘i',
          'Fever / Temperature — Isitma',
          'Cold / Flu — Shamollash / Gripp',
          'Cough — Yo‘tal',
          'Sore throat — Tomoq og‘rig‘i',
          'Tired — Charchagan / Holsiz',
          'Healthy — Sog‘lom',
          'Medicine — Dori-darmon'
        ],
        itemsUz: [
          'Bosh og‘rig‘i',
          'Qorin og‘rig‘i',
          'Tish og‘rig‘i',
          'Isitma',
          'Shamollash / Gripp',
          'Yo‘tal',
          'Tomoq og‘rig‘i',
          'Charchagan',
          'Sog‘lom',
          'Dori-darmon'
        ],
        vocabulary: [
          { english: 'Headache', uzbek: 'Bosh og‘rig‘i', phonetic: '/ˈhed.eɪk/', exampleSentence: 'I have a mild headache.', exampleSentenceUz: 'Menda yengil bosh og‘rig‘i bor.' },
          { english: 'Healthy', uzbek: 'Sog‘lom', phonetic: '/ˈhel.θi/', exampleSentence: 'Eating fruit keeps you healthy.', exampleSentenceUz: 'Meva yeyish sizni sog‘lom saqlaydi.' }
        ]
      },
      {
        id: 'health-l4',
        title: 'Lesson 4: Talking About Health and Advice',
        titleUz: '4-dars: Salomatlik haqida gapirish va maslahatlar',
        lessonNumber: 4,
        category: 'sentences',
        description: 'Sentences: "I have a...", "You should drink warm tea", "Take care".',
        descriptionUz: 'Kasallikni aytish va sog‘ayish uchun maslahat berish qoliplari.',
        items: [
          'I have a headache. — Boshim og‘riyapti.',
          'I have a sore throat. — Tomog‘im og‘riyapti.',
          'You should drink warm tea with honey. — Asalli issiq choy ichishingiz kerak.',
          'Please take this medicine and rest. — Iltimos, ushbu dorini iching va dam oling.'
        ],
        itemsUz: [
          'Boshim og‘riyapti.',
          'Tomog‘im og‘riyapti.',
          'Asalli issiq choy ichishingiz kerak.',
          'Ushbu dorini iching va dam oling.'
        ],
        sentences: [
          {
            english: 'I have a headache.',
            uzbek: 'Boshim og‘riyapti.',
            patternRule: 'I have a + [Ache / Symptom]',
            substitutions: {
              slotName: 'Symptom',
              options: [
                { en: 'headache', uz: 'bosh og‘rig‘i' },
                { en: 'stomachache', uz: 'qorin og‘rig‘i' },
                { en: 'sore throat', uz: 'tomoq og‘rig‘i' },
                { en: 'fever', uz: 'isitma' },
                { en: 'cold', uz: 'shamollash' }
              ]
            }
          },
          {
            english: 'You should drink warm tea.',
            uzbek: 'Issiq choy ichishingiz kerak.',
            patternRule: 'You should + [Healthy action]',
            substitutions: {
              slotName: 'Health Advice',
              options: [
                { en: 'drink warm tea', uz: 'issiq choy ichish' },
                { en: 'rest in bed', uz: 'o‘rinda dam olish' },
                { en: 'see a doctor', uz: 'shifokorga ko‘rinish' },
                { en: 'drink more water', uz: 'ko‘proq suv ichish' }
              ]
            }
          }
        ]
      },
      {
        id: 'health-l5',
        title: 'Lesson 5: Listening and Speaking Practice',
        titleUz: '5-dars: Tinglash va gapirish amaliyoti',
        lessonNumber: 5,
        category: 'practice',
        description: 'Doctor and patient dialogue at a clinic.',
        descriptionUz: 'Shifokor va bemor o‘rtasidagi maslahat suhbati.',
        items: [
          'Doctor: Good morning. How are you feeling today? — Xayrli tong. Bugun o‘zingizni qanday his qilyapsiz?',
          'Patient: I feel tired and I have a sore throat. — Charchaganman va tomog‘im og‘riyapti.',
          'Doctor: Let me check. Drink warm tea with lemon and rest today. — Qani ko‘ray-chi. Limonli issiq choy iching va bugun dam oling.'
        ],
        itemsUz: [
          'Shifokor: Xayrli tong. Bugun o‘zingizni qanday his qilyapsiz?',
          'Bemor: Holsizman va tomog‘im og‘riyapti.',
          'Shifokor: Limonli issiq choy iching va bugun dam oling.'
        ],
        dialogue: [
          { speaker: 'Doctor', text: 'Hello! What seems to be the problem today?' },
          { speaker: 'David', text: 'Hello Doctor. I have a headache and a slight fever.' },
          { speaker: 'Doctor', text: 'I understand. Please take this medicine after meals and drink plenty of water.' },
          { speaker: 'David', text: 'Thank you very much, Doctor. I will rest today.' }
        ]
      }
    ],
    dialogue: [
      { speaker: 'Doctor', text: 'Hello! What seems to be the problem today?' },
      { speaker: 'David', text: 'Hello Doctor. I have a headache and a slight fever.' },
      { speaker: 'Doctor', text: 'I understand. Please take this medicine after meals and drink plenty of water.' },
      { speaker: 'David', text: 'Thank you very much, Doctor. I will rest today.' }
    ],
    speakingActivities: [
      'Name 5 parts of the head and face in English.',
      'Explain how you feel when you are sick: "I have a...".',
      'Give one healthy advice tip: "You should...".',
      'Practice asking someone: "How are you feeling today?".',
      'Record an audio answer about healthy habits.'
    ],
    prompts: [
      {
        id: 'health-q1',
        question: 'What healthy habits do you follow to keep your body strong?',
        questionUz: 'Tanangizni baquvvat saqlash uchun qanday sog‘lom odatlarga rioya qilasiz?',
        sentenceStarters: ['To stay healthy, I...', 'Every day, I drink...', 'I like walking because...'],
        exampleAnswer: 'To stay healthy, I drink plenty of clean water, eat fresh apples, and walk outside every morning.',
        teacherTip: 'Mention everyday habits: sleep, water, fruits, and walking.'
      }
    ],
    completionMessage: 'Well done! You finished Topic 12: Health, Body and Wellness. You can now talk about health and care.',
    completionMessageUz: 'Barakalla! Siz 12-mavzuni tugatdingiz. Tana a’zolari va salomatlik haqida gapirishni o‘rgandingiz.',
    listenAndChoose: [
      {
        id: 'health-lc1',
        audioPrompt: 'The doctor advised the patient to drink warm green tea with honey and rest in bed for two days.',
        question: 'What did the doctor advise the patient to do?',
        options: [
          { id: 'opt-1', text: 'Drink warm tea and rest', isCorrect: true },
          { id: 'opt-2', text: 'Run a marathon', isCorrect: false },
          { id: 'opt-3', text: 'Drink ice cold water', isCorrect: false }
        ],
        explanation: 'The doctor advised: "drink warm green tea with honey and rest in bed".'
      }
    ],
    vocabularyChallenge: [
      {
        id: 'vocab-heart',
        word: 'Heart',
        phonetic: '/hɑːrt/',
        definition: 'The vital organ that pumps blood throughout the body.',
        exampleSentence: 'A healthy heart.',
        audioHint: 'Rhymes with "part".'
      }
    ],
    sentenceBuilder: [
      {
        id: 'sb-health-1',
        instruction: 'Assemble this health advice sentence:',
        targetSentence: 'You should drink warm tea with honey',
        scrambledWords: ['tea', 'drink', 'warm', 'should', 'You', 'honey', 'with'],
        hint: 'Start with "You should".'
      }
    ],
    aiRoleplayScenario: {
      id: 'ai-roleplay-health',
      scenarioTitle: 'Consulting a Caring Nurse',
      aiRole: 'Nurse Brenda, a compassionate clinic nurse',
      contextDescription: 'You visit a local community health station.',
      initialAIGreeting: 'Hello dear! How are you feeling today? Are you experiencing any pain?',
      suggestedStudentStarters: [
        'I have a headache and feel tired.',
        'My throat hurts a little bit.',
        'I need some advice on healthy resting.'
      ]
    },
    speakingMission: {
      id: 'mission-health',
      missionTitle: 'Describe Healthy Habits',
      promptQuestion: 'Share your top three health habits: talk about water, food, and sleep.',
      sampleGoodAnswer: 'To stay healthy and strong, I drink eight glasses of water every day, eat fresh fruits like apples, and sleep eight hours each night.',
      teacherEncouragement: 'Taking care of health is true wisdom. You spoke clearly and beautifully!'
    }
  },

  // ==============================================================================
  // TOPIC 13: ANIMALS AND NATURE
  // ==============================================================================
  {
    id: 'animals-nature',
    title: 'Animals and Nature',
    titleUz: 'Hayvonlar va tabiat',
    subtitle: 'Learn domestic animals, wild wildlife, natural landscapes, and animal traits.',
    subtitleUz: 'Uy hayvonlari, yovvoyi jonivorlar, tabiat manzaralari va hayvonlarni tasvirlash.',
    level: 'A1-A2',
    levelGroup: 'Level 3',
    learningObjective: 'Learn domestic and wild animal words and nature terms, then describe animal habitats and actions.',
    learningObjectiveUz: 'Uy va yovvoyi hayvonlar nomlarini o‘rganib, ularning xatti-harakati va yashash joylarini aytish.',
    iconName: 'heart',
    color: 'emerald',
    audioInstruction: 'Welcome to Topic 13: Animals and Nature. Learn words for cats, dogs, horses, birds, mountains, rivers, and wildlife.',
    audioInstructionUz: '13-mavzuga xush kelibsiz: Hayvonlar va tabiat. Mushuk, it, ot, qushlar, tog‘lar va daryolarni inglizcha o‘rganasiz.',
    lessons: [
      {
        id: 'animals-l1',
        title: 'Lesson 1: Pets and Domestic Animals',
        titleUz: '1-dars: Uy hayvonlari va parrandalar',
        lessonNumber: 1,
        category: 'vocabulary',
        description: 'Friendly animals kept at home or raised on farms.',
        descriptionUz: 'Xonadonda boqiladigan va qishloq xo‘jaligidagi uy hayvonlari.',
        items: [
          'Cat — Mushuk',
          'Dog — It',
          'Horse — Ot',
          'Cow — Sigir',
          'Sheep — Qo‘y',
          'Goat — Echki',
          'Chicken / Hen — Tovuq',
          'Rooster — Xo‘roz',
          'Duck — O‘rdak',
          'Donkey — Eshak',
          'Rabbit — Quyon',
          'Bird — Qush'
        ],
        itemsUz: [
          'Mushuk',
          'It',
          'Ot',
          'Sigir',
          'Qo‘y',
          'Echki',
          'Tovuq',
          'Xo‘roz',
          'O‘rdak',
          'Eshak',
          'Quyon',
          'Qush'
        ],
        vocabulary: [
          { english: 'Cat', uzbek: 'Mushuk', phonetic: '/kæt/', exampleSentence: 'The fluffy cat purrs softly.', exampleSentenceUz: 'Paxmoq mushuk muloyim xurillaydi.' },
          { english: 'Horse', uzbek: 'Ot', phonetic: '/hɔːrs/', exampleSentence: 'A strong horse runs in the meadow.', exampleSentenceUz: 'Chopqir ot yaylovda chopmoqda.' },
          { english: 'Bird', uzbek: 'Qush', phonetic: '/bɝːd/', exampleSentence: 'The bird sings in the morning.', exampleSentenceUz: 'Qush ertalab sayraydi.' }
        ]
      },
      {
        id: 'animals-l2',
        title: 'Lesson 2: Wild Animals and Wildlife',
        titleUz: '2-dars: Yovvoyi jonivorlar',
        lessonNumber: 2,
        category: 'vocabulary',
        description: 'Magnificent animals living freely in forests, mountains, and plains.',
        descriptionUz: 'Tog‘, o‘rmon va cho‘llarda yashaydigan yovvoyi jonivorlar.',
        items: [
          'Lion — Sher / Arslon',
          'Tiger — Yo‘lbars',
          'Bear — Ayiq',
          'Wolf — Bo‘ri',
          'Fox — Tulki',
          'Elephant — Fil',
          'Giraffe — Jirafa',
          'Monkey — Maymun',
          'Eagle — Burgut',
          'Owl — Boyqush',
          'Dolphin — Delfin',
          'Deer — Bug‘u'
        ],
        itemsUz: [
          'Sher / Arslon',
          'Yo‘lbars',
          'Ayiq',
          'Bo‘ri',
          'Tulki',
          'Fil',
          'Jirafa',
          'Maymun',
          'Burgut',
          'Boyqush',
          'Delfin',
          'Bug‘u'
        ],
        vocabulary: [
          { english: 'Eagle', uzbek: 'Burgut', phonetic: '/ˈiː.ɡəl/', exampleSentence: 'The golden eagle flies high in the mountains.', exampleSentenceUz: 'Burgut tog‘lar uzra baland parvoz qiladi.' },
          { english: 'Lion', uzbek: 'Sher', phonetic: '/ˈlaɪ.ən/', exampleSentence: 'The lion is strong and brave.', exampleSentenceUz: 'Sher kuchli va jasur.' }
        ]
      },
      {
        id: 'animals-l3',
        title: 'Lesson 3: Nature and Landscapes',
        titleUz: '3-dars: Tabiat va manzaralar',
        lessonNumber: 3,
        category: 'vocabulary',
        description: 'Earth, waters, mountains, and trees in our natural world.',
        descriptionUz: 'Tog‘lar, daryolar, ko‘llar va daraxtlar nomlari.',
        items: [
          'Mountain — Tog‘',
          'River — Daryo',
          'Lake — Ko‘l',
          'Sea / Ocean — Dengiz / Ummon',
          'Forest / Woods — O‘rmon',
          'Tree — Daraxt',
          'Flower — Gul',
          'Grass — O‘t / Maysa',
          'Sky — Osmon',
          'Sun — Quyosh',
          'Star — Yulduz',
          'Moon — Oy'
        ],
        itemsUz: [
          'Tog‘',
          'Daryo',
          'Ko‘l',
          'Dengiz',
          'O‘rmon',
          'Daraxt',
          'Gul',
          'Maysa',
          'Osmon',
          'Quyosh',
          'Yulduz',
          'Oy'
        ],
        vocabulary: [
          { english: 'Mountain', uzbek: 'Tog‘', phonetic: '/ˈmaʊn.tən/', exampleSentence: 'Snow covers the mountain top.', exampleSentenceUz: 'Tog‘ cho‘qqisini qor qoplagan.' },
          { english: 'River', uzbek: 'Daryo', phonetic: '/ˈrɪv.ɚ/', exampleSentence: 'The Syr Darya is a long river.', exampleSentenceUz: 'Sirdaryo uzun daryodir.' }
        ]
      },
      {
        id: 'animals-l4',
        title: 'Lesson 4: Describing Animals and Nature',
        titleUz: '4-dars: Hayvonlar va tabiatni tasvirlash qoliplari',
        lessonNumber: 4,
        category: 'sentences',
        description: 'Sentences describing animal abilities and beautiful scenes.',
        descriptionUz: 'Hayvonlarning qobiliyatlari va tabiat go‘zalligini aytish.',
        items: [
          'Horses can run very fast. — Otlar juda tez yugura oladi.',
          'Birds sing in the morning. — Qushlar ertalab sayraydi.',
          'The mountains are high and majestic. — Tog‘lar baland va ulug‘vor.',
          'I love walking near the river. — Daryo bo‘yida sayr qilishni yaxshi ko‘raman.'
        ],
        itemsUz: [
          'Otlar juda tez yugura oladi.',
          'Qushlar ertalab sayraydi.',
          'Tog‘lar baland va ulug‘vor.',
          'Daryo bo‘yida sayr qilishni yaxshi ko‘raman.'
        ],
        sentences: [
          {
            english: 'Horses can run very fast.',
            uzbek: 'Otlar juda tez yugura oladi.',
            patternRule: '[Animals] can + [Action verb]',
            substitutions: {
              slotName: 'Animal & Ability',
              options: [
                { en: 'Horses can run very fast', uz: 'Otlar juda tez yugura oladi' },
                { en: 'Birds can fly high in the sky', uz: 'Qushlar osmonda baland ucha oladi' },
                { en: 'Fish can swim in deep water', uz: 'Baliqlar chuqur suvda suza oladi' }
              ]
            }
          },
          {
            english: 'I love animals very much.',
            uzbek: 'Men jonivorlarni juda yaxshi ko‘raman.'
          }
        ]
      },
      {
        id: 'animals-l5',
        title: 'Lesson 5: Listening and Speaking Practice',
        titleUz: '5-dars: Tinglash va gapirish amaliyoti',
        lessonNumber: 5,
        category: 'practice',
        description: 'Dialogue discussing pets and nature walks.',
        descriptionUz: 'Uy hayvonlari va tabiatdagi sayr haqidagi suhbat.',
        items: [
          'A: Do you have a pet at home? — Uyingizda jonivor boqasizmi?',
          'B: Yes, I have a gentle cat. She likes sleeping in the sun! — Ha, menda muloyim mushuk bor. U oftobda uxlashni yoqtiradi.',
          'A: What is your favorite wild animal? — Sevimli yovvoyi hayvoningiz nima?',
          'B: I admire the mountain eagle because it flies so freely. — Men tog‘ burgutiga qoyil qolaman, chunki u erkin parvoz qiladi.'
        ],
        itemsUz: [
          'A: Uyingizda jonivor boqasizmi?',
          'B: Ha, mushugim bor, oftobda uxlashni yoqtiradi.',
          'A: Sevimli yovvoyi hayvoningiz qaysi?',
          'B: Tog‘ burgutini yoqtiraman, erkin uchadi.'
        ],
        dialogue: [
          { speaker: 'Anna', text: 'Do you enjoy spending time in nature, David?' },
          { speaker: 'David', text: 'Yes, I love walking in the mountains and listening to birds sing.' },
          { speaker: 'Anna', text: 'Nature is so relaxing. Do you have any pets?' },
          { speaker: 'David', text: 'We have a friendly dog in our yard. He is very loyal!' }
        ]
      }
    ],
    dialogue: [
      { speaker: 'Anna', text: 'Do you enjoy spending time in nature, David?' },
      { speaker: 'David', text: 'Yes, I love walking in the mountains and listening to birds sing.' },
      { speaker: 'Anna', text: 'Nature is so relaxing. Do you have any pets?' },
      { speaker: 'David', text: 'We have a friendly dog in our yard. He is very loyal!' }
    ],
    speakingActivities: [
      'Name 3 domestic animals in English.',
      'Name 2 wild animals you find interesting.',
      'Describe a pet or an animal you love.',
      'Talk about a natural place you enjoy visiting.',
      'Record an audio story about nature.'
    ],
    prompts: [
      {
        id: 'animals-q1',
        question: 'What is your favorite animal, and why do you find it special?',
        questionUz: 'Sevimli hayvoningiz nima va nima uchun u sizga yoqadi?',
        sentenceStarters: ['My favorite animal is the...', 'I love it because it is...', 'It lives in the...'],
        exampleAnswer: 'My favorite animal is the horse. I love it because it is strong, fast, and very loyal to humans.',
        teacherTip: 'Describe size, color, or traits: strong, gentle, fast, or loyal.'
      }
    ],
    completionMessage: 'Well done! You finished Topic 13: Animals and Nature. You can now describe animals and landscapes.',
    completionMessageUz: 'Barakalla! Siz 13-mavzuni tugatdingiz. Jonivorlar va tabiat haqida chiroyli gapira olasiz.',
    listenAndChoose: [
      {
        id: 'animals-lc1',
        audioPrompt: 'The golden eagle lives high in the mountains and has powerful wings to soar through the sky.',
        question: 'Where does the golden eagle live?',
        options: [
          { id: 'opt-1', text: 'High in the mountains', isCorrect: true },
          { id: 'opt-2', text: 'Under the ocean waves', isCorrect: false },
          { id: 'opt-3', text: 'Inside a city bank', isCorrect: false }
        ],
        explanation: 'The speaker said: "The golden eagle lives high in the mountains".'
      }
    ],
    vocabularyChallenge: [
      {
        id: 'vocab-eagle',
        word: 'Eagle',
        phonetic: '/ˈiː.ɡəl/',
        definition: 'A large bird of prey with keen vision and powerful wings.',
        exampleSentence: 'An eagle flies high.',
        audioHint: 'Ea-gle.'
      }
    ],
    sentenceBuilder: [
      {
        id: 'sb-animals-1',
        instruction: 'Assemble this animal sentence:',
        targetSentence: 'Horses can run very fast',
        scrambledWords: ['run', 'Horses', 'very', 'can', 'fast'],
        hint: 'Start with "Horses".'
      }
    ],
    aiRoleplayScenario: {
      id: 'ai-roleplay-animals',
      scenarioTitle: 'Visiting a Nature Reserve',
      aiRole: 'Ranger Sam, a wildlife park ranger',
      contextDescription: 'Ranger Sam welcomes you to a scenic mountain nature sanctuary.',
      initialAIGreeting: 'Welcome to the nature park! Which animals are you hoping to learn about today?',
      suggestedStudentStarters: [
        'I love birds and wild mountain animals.',
        'Can we see horses or deer here?',
        'Nature here is so peaceful and clean.'
      ]
    },
    speakingMission: {
      id: 'mission-animals',
      missionTitle: 'Describe an Animal You Love',
      promptQuestion: 'Talk about an animal you love: say where it lives, what it eats or does, and why it is special.',
      sampleGoodAnswer: 'I love horses. They live on open green farms and run very fast. They are strong, beautiful, and noble animals.',
      teacherEncouragement: 'Animals bring so much beauty to our planet. Speak with enthusiasm!'
    }
  },

  // ==============================================================================
  // TOPIC 14: FEELINGS AND EMOTIONS
  // ==============================================================================
  {
    id: 'feelings-emotions',
    title: 'Feelings and Emotions',
    titleUz: 'Tuyg‘ular va hissiyotlar',
    subtitle: 'Learn positive and challenging feelings, reasons, and showing empathy.',
    subtitleUz: 'Quvonch, charchoq, mehr va hissiyotlarni sababi bilan aytishni o‘rganing.',
    level: 'A1-A2',
    levelGroup: 'Level 3',
    learningObjective: 'Learn emotion vocabulary first, then construct "I feel ... because ..." sentences and show empathy.',
    learningObjectiveUz: 'Avval tuyg‘ular nomlarini o‘rganib, so‘ng "Men o‘zimni ... his qilyapman, chunki ..." qolipida gap tuzish.',
    iconName: 'smile',
    color: 'amber',
    audioInstruction: 'Welcome to Topic 14: Feelings and Emotions. Learn words for happy, calm, tired, excited, and how to express why you feel that way.',
    audioInstructionUz: '14-mavzuga xush kelibsiz: Tuyg‘ular va hissiyotlar. Xursand, xotirjam, charchagan, hayajonlangan kabi hislarni ifodalashni o‘rganasiz.',
    lessons: [
      {
        id: 'feel-l1',
        title: 'Lesson 1: Positive Emotions and Moods',
        titleUz: '1-dars: Ijobiy tuyg‘ular va kayfiyat',
        lessonNumber: 1,
        category: 'vocabulary',
        description: 'Uplifting feeling words to share joy, gratitude, and energy.',
        descriptionUz: 'Quvonch, minnatdorlik va tetiklikni ifodalovchi so‘zlar.',
        items: [
          'Happy — Xursand / Baxtli',
          'Glad — Mamnun',
          'Excited — Hayajonlangan / Intizor',
          'Calm — Xotirjam',
          'Peaceful — Tinch / Osoyishta',
          'Proud — Faxrlangan',
          'Grateful / Thankful — Minnatdor',
          'Loved — Sevimli / Qadrli',
          'Confident — O‘ziga ishongan',
          'Cheerful — Quvnoq',
          'Energetic — G‘ayratli / Faol',
          'Relaxed — Hordiq chiqargan / Erkin'
        ],
        itemsUz: [
          'Xursand',
          'Mamnun',
          'Hayajonlangan',
          'Xotirjam',
          'Tinch',
          'Faxrlangan',
          'Minnatdor',
          'Qadrli',
          'O‘ziga ishongan',
          'Quvnoq',
          'G‘ayratli',
          'Hordiq chiqargan'
        ],
        vocabulary: [
          { english: 'Happy', uzbek: 'Xursand', phonetic: '/ˈhæp.i/', exampleSentence: 'I am happy to learn English.', exampleSentenceUz: 'Ingliz tilini o‘rganayotganimdan xursandman.' },
          { english: 'Grateful', uzbek: 'Minnatdor', phonetic: '/ˈɡreɪt.fəl/', exampleSentence: 'I am grateful for my family.', exampleSentenceUz: 'Oilamdan doimo minnatdorman.' },
          { english: 'Confident', uzbek: 'O‘ziga ishongan', phonetic: '/ˈkɑːn.fə.dənt/', exampleSentence: 'Speak with a confident voice.', exampleSentenceUz: 'Ishonchli ovozda gapiring.' }
        ]
      },
      {
        id: 'feel-l2',
        title: 'Lesson 2: Challenging Emotions and Sensations',
        titleUz: '2-dars: Qiyin tuyg‘ular va holsizlik',
        lessonNumber: 2,
        category: 'vocabulary',
        description: 'Words to honestly share sadness, worry, or fatigue.',
        descriptionUz: 'Charchoq, xavotir yoki g‘amginlikni bildirish so‘zlari.',
        items: [
          'Sad — G‘amgin / Xafa',
          'Tired — Charchagan / Holsiz',
          'Sleepy — Uyqusiragan',
          'Angry — Jahli chiqqan / G‘azablangan',
          'Worried — Xavotirlangan',
          'Nervous — Hayajonda / Xavotirda',
          'Scared / Afraid — Qo‘rqqan',
          'Bored — Zerikkan',
          'Stressed — Zo‘riqqan / Toliqqan',
          'Lonely — Yolg‘iz'
        ],
        itemsUz: [
          'G‘amgin / Xafa',
          'Charchagan',
          'Uyqusiragan',
          'Jahli chiqqan',
          'Xavotirlangan',
          'Hayajonda',
          'Qo‘rqqan',
          'Zerikkan',
          'Zo‘riqqan',
          'Yolg‘iz'
        ],
        vocabulary: [
          { english: 'Tired', uzbek: 'Charchagan', phonetic: '/taɪərd/', exampleSentence: 'I feel tired after a long day.', exampleSentenceUz: 'Uzoq kundan keyin charchoq his qilyapman.' },
          { english: 'Worried', uzbek: 'Xavotirlangan', phonetic: '/ˈwɝː.id/', exampleSentence: 'Do not be worried, everything will be fine.', exampleSentenceUz: 'Xavotir olmang, hammasi yaxshi bo‘ladi.' }
        ]
      },
      {
        id: 'feel-l3',
        title: 'Lesson 3: Explaining Reasons with "Because"',
        titleUz: '3-dars: "Chunki" (because) bilan sabab aytish',
        lessonNumber: 3,
        category: 'sentences',
        description: 'Connecting how you feel with why you feel that way.',
        descriptionUz: 'Tuyg‘uni uning sababi bilan bog‘lab aytish qoliplari.',
        items: [
          'I am happy because I passed my topic test. — Xursandman, chunki mavzu testimdan o‘tdim.',
          'I feel relaxed because I listened to peaceful music. — O‘zimni xotirjam his qilyapman, chunki osoyishta musiqa tingladim.',
          'He is tired because he worked all day. — U charchagan, chunki kun bo‘yi ishladi.',
          'We are proud because we speak English! — Biz faxrlanamiz, chunki inglizcha gapiryapmiz!'
        ],
        itemsUz: [
          'Xursandman, chunki testimdan o‘tdim.',
          'Xotirjamman, chunki musiqa tingladim.',
          'U charchagan, chunki kun bo‘yi ishladi.',
          'Biz faxrlanamiz, chunki inglizcha gapiryapmiz!'
        ],
        sentences: [
          {
            english: 'I am happy because I passed my test.',
            uzbek: 'Men xursandman, chunki testimdan o‘tdim.',
            patternRule: 'I am [Emotion] because + [Reason]',
            substitutions: {
              slotName: 'Emotion & Reason',
              options: [
                { en: 'happy because I passed my test', uz: 'testdan o‘tganim uchun xursandman' },
                { en: 'excited because my friend called', uz: 'do‘stim qo‘ng‘iroq qilgani uchun hayajondaman' },
                { en: 'grateful because my teacher helped me', uz: 'ustozim yordam bergani uchun minnatdorman' },
                { en: 'calm because I am at home', uz: 'uyda bo‘lganim uchun xotirjamman' }
              ]
            }
          },
          {
            english: 'How do you feel today?',
            uzbek: 'Bugun o‘zingizni qanday his qilyapsiz?'
          }
        ]
      },
      {
        id: 'feel-l4',
        title: 'Lesson 4: Listening and Speaking Practice',
        titleUz: '4-dars: Tinglash va gapirish amaliyoti',
        lessonNumber: 4,
        category: 'practice',
        description: 'Warm dialog checking on a friend and showing empathy.',
        descriptionUz: 'Do‘stining ko‘nglini so‘rash va dalda berish suhbati.',
        items: [
          'A: How are you feeling today, David? — Bugun o‘zingizni qanday his qilyapsiz, David?',
          'B: I feel very cheerful and excited today! — Bugun o‘zimni juda quvnoq va ko‘tarinki his qilyapman!',
          'A: That is wonderful to hear! Why are you so cheerful? — Buni eshitish ajoyib! Nega bunchalik quvnoqsiz?',
          'B: Because I practiced speaking English with my partner! — Chunki sherigim bilan inglizcha gapirishni mashq qildim!'
        ],
        itemsUz: [
          'A: Bugun o‘zingizni qanday his qilyapsiz?',
          'B: Juda quvnoq va ko‘tarinkiman!',
          'A: Buni eshitish ajoyib! Sababi nima?',
          'B: Chunki sherigim bilan inglizcha mashq qildim!'
        ],
        dialogue: [
          { speaker: 'Anna', text: 'How are you feeling today, David?' },
          { speaker: 'David', text: 'I am feeling happy and calm today. How about you?' },
          { speaker: 'Anna', text: 'I was a bit tired this morning, but our conversation makes me feel cheerful!' },
          { speaker: 'David', text: 'I am so glad to hear that. Friendly conversations always help.' }
        ]
      }
    ],
    dialogue: [
      { speaker: 'Anna', text: 'How are you feeling today, David?' },
      { speaker: 'David', text: 'I am feeling happy and calm today. How about you?' },
      { speaker: 'Anna', text: 'I was a bit tired this morning, but our conversation makes me feel cheerful!' },
      { speaker: 'David', text: 'I am so glad to hear that. Friendly conversations always help.' }
    ],
    speakingActivities: [
      'Name 3 positive feelings in English.',
      'Explain how you feel right now using "I feel...".',
      'Give a reason for your feeling using "because...".',
      'Ask your partner: "How are you feeling today?".',
      'Record an audio journal entry about your emotions.'
    ],
    prompts: [
      {
        id: 'feel-q1',
        question: 'How do you feel today and what made you feel that way?',
        questionUz: 'Bugun o‘zingizni qanday his qilyapsiz va nima sababdan bunday kayfiyatdasiz?',
        sentenceStarters: ['Today I feel...', 'I feel happy because...', 'When I learn English, I feel...'],
        exampleAnswer: 'Today I feel calm and grateful because the weather is warm and I am learning new English words.',
        teacherTip: 'Be honest and authentic. All feelings are natural and valid.'
      }
    ],
    completionMessage: 'Well done! You finished Topic 14: Feelings and Emotions. You can now express your inner world with words.',
    completionMessageUz: 'Barakalla! Siz 14-mavzuni tugatdingiz. O‘z his-tuyg‘ularingizni ingliz tilida erkin aytib bera olasiz.',
    listenAndChoose: [
      {
        id: 'feel-lc1',
        audioPrompt: 'I feel very proud and happy today because I completed all my beginner English lessons!',
        question: 'Why does the speaker feel proud and happy?',
        options: [
          { id: 'opt-1', text: 'Completed all English lessons', isCorrect: true },
          { id: 'opt-2', text: 'Lost a wallet', isCorrect: false },
          { id: 'opt-3', text: 'Missed the train', isCorrect: false }
        ],
        explanation: 'The speaker said: "because I completed all my beginner English lessons".'
      }
    ],
    vocabularyChallenge: [
      {
        id: 'vocab-grateful',
        word: 'Grateful',
        phonetic: '/ˈɡreɪt.fəl/',
        definition: 'Feeling or showing an appreciation of kindness; thankful.',
        exampleSentence: 'I am grateful for my friends.',
        audioHint: 'Grate-ful.'
      }
    ],
    sentenceBuilder: [
      {
        id: 'sb-feel-1',
        instruction: 'Assemble this feelings sentence:',
        targetSentence: 'I am happy because I learn English',
        scrambledWords: ['English', 'because', 'happy', 'am', 'I', 'learn', 'I'],
        hint: 'Start with "I am happy".'
      }
    ],
    aiRoleplayScenario: {
      id: 'ai-roleplay-feelings',
      scenarioTitle: 'Sharing Daily Moods with a Buddy',
      aiRole: 'Aria, an empathetic conversation friend',
      contextDescription: 'Aria checks in with you to see how your day is going.',
      initialAIGreeting: 'Hi friend! How is your heart and mind feeling today?',
      suggestedStudentStarters: [
        'I feel cheerful and ready to speak English.',
        'I am grateful for a peaceful day.',
        'I was a bit tired, but talking with you helps.'
      ]
    },
    speakingMission: {
      id: 'mission-feelings',
      missionTitle: 'Express Your Current Mood',
      promptQuestion: 'Share how you are feeling right now, give one reason why, and share a positive wish for your partner.',
      sampleGoodAnswer: 'Today I feel confident and happy because I am speaking English with you. I hope you have a wonderful and peaceful day!',
      teacherEncouragement: 'Sharing feelings creates real human connection across languages.'
    }
  },

  // ==============================================================================
  // TOPIC 15: SHOPPING AND MONEY
  // ==============================================================================
  {
    id: 'shopping-money',
    title: 'Shopping and Money',
    titleUz: 'Xaridlar va pul muomalasi',
    subtitle: 'Learn types of shops, money, asking prices, and shopping conversations.',
    subtitleUz: 'Do‘kon turlari, narx so‘rash, savdolashish va xarid suhbatlari.',
    level: 'A1-A2',
    levelGroup: 'Level 3',
    learningObjective: 'Learn store types and money words first, then practice asking prices and making purchases politely.',
    learningObjectiveUz: 'Do‘konlar va pul so‘zlarini o‘rganib, xushmuomala narx so‘rash va xarid qilishni mashq qilish.',
    iconName: 'shopping-bag',
    color: 'emerald',
    audioInstruction: 'Welcome to Topic 15: Shopping and Money. Learn words for markets, prices, cash, card, and how to ask "How much is this?".',
    audioInstructionUz: '15-mavzuga xush kelibsiz: Xaridlar va pul. Bozorlar, narxlar, naqd pul, karta va "Bu qancha turadi?" deb so‘rashni o‘rganasiz.',
    lessons: [
      {
        id: 'shop-l1',
        title: 'Lesson 1: Types of Stores and Markets',
        titleUz: '1-dars: Do‘konlar va bozor turlari',
        lessonNumber: 1,
        category: 'vocabulary',
        description: 'Where people buy groceries, clothes, and everyday essentials.',
        descriptionUz: 'Oziq-ovqat, kiyim va boshqa buyumlar sotiladigan joylar.',
        items: [
          'Shop / Store — Do‘kon',
          'Market / Bazaar — Bozor',
          'Supermarket — Supermarket',
          'Bakery — Nonvoyxona',
          'Pharmacy / Chemist — Dorixona',
          'Clothes shop — Kiyim do‘koni',
          'Bookshop — Kitob do‘koni',
          'Customer — Xaridor / Mijoz',
          'Cashier — Kassir',
          'Cart / Basket — Arava / Savatcha',
          'Receipt — Chek / Kvitansiya',
          'Bag — Xarid xaltasi / Paket'
        ],
        itemsUz: [
          'Do‘kon',
          'Bozor',
          'Supermarket',
          'Nonvoyxona',
          'Dorixona',
          'Kiyim do‘koni',
          'Kitob do‘koni',
          'Xaridor',
          'Kassir',
          'Arava / Savat',
          'Chek',
          'Paket / Sumka'
        ],
        vocabulary: [
          { english: 'Market', uzbek: 'Bozor', phonetic: '/ˈmɑːr.kɪt/', exampleSentence: 'The Chorsu Bazaar is colorful and lively.', exampleSentenceUz: 'Chorsu bozori rang-barang va gavjum.' },
          { english: 'Bakery', uzbek: 'Nonvoyxona', phonetic: '/ˈbeɪ.kɚ.i/', exampleSentence: 'Warm fresh bread from the bakery.', exampleSentenceUz: 'Nonvoyxonadan issiq yangi non.' }
        ]
      },
      {
        id: 'shop-l2',
        title: 'Lesson 2: Money, Currency and Payments',
        titleUz: '2-dars: Pul va to‘lov usullari',
        lessonNumber: 2,
        category: 'vocabulary',
        description: 'Financial words, prices, discounts, and payment methods.',
        descriptionUz: 'Narx-navo, to‘lov turlari va pul atamalari.',
        items: [
          'Money — Pul',
          'Cash — Naqd pul',
          'Card / Bank card — Bank kartasi',
          'Price — Narx',
          'Expensive — Qimmat',
          'Cheap — Arzon',
          'Free — Bepul',
          'Discount — Chegirma',
          'Pay — To‘lash',
          'Change — Qaytim (qoldiq pul)'
        ],
        itemsUz: [
          'Pul',
          'Naqd pul',
          'Bank kartasi',
          'Narx',
          'Qimmat',
          'Arzon',
          'Bepul',
          'Chegirma',
          'To‘lash',
          'Qaytim'
        ],
        vocabulary: [
          { english: 'Price', uzbek: 'Narx', phonetic: '/praɪs/', exampleSentence: 'The price is very fair.', exampleSentenceUz: 'Narxi juda maqbul.' },
          { english: 'Cash', uzbek: 'Naqd pul', phonetic: '/kæʃ/', exampleSentence: 'Do you pay with cash or card?', exampleSentenceUz: 'Naqd pulda to‘laysizmi yoki kartadami?' }
        ]
      },
      {
        id: 'shop-l3',
        title: 'Lesson 3: Asking Prices and Shopping Phrases',
        titleUz: '3-dars: Narx so‘rash va xarid qilish qoliplari',
        lessonNumber: 3,
        category: 'sentences',
        description: 'How to ask "How much is this?" and buy items politely.',
        descriptionUz: '"Bu qancha turadi?" deb so‘rash va muloyim xarid qilish.',
        items: [
          'How much is this? — Bu qancha turadi?',
          'How much are these apples? — Bu olmalar qancha turadi?',
          'I would like to buy this, please. — Iltimos, men shuni sotib olmoqchiman.',
          'Can I pay by card? — Karta orqali to‘lasam bo‘ladimi?',
          'Here is your change and receipt. — Mana qaytim va chekingiz.'
        ],
        itemsUz: [
          'Bu qancha turadi?',
          'Bu olmalar qancha turadi?',
          'Shuni sotib olmoqchiman.',
          'Karta orqali to‘lasam bo‘ladimi?',
          'Mana qaytim va chekingiz.'
        ],
        sentences: [
          {
            english: 'How much is this apple?',
            uzbek: 'Bu olma qancha turadi?',
            patternRule: 'How much is this + [Item]?',
            substitutions: {
              slotName: 'Item',
              options: [
                { en: 'apple', uz: 'olma' },
                { en: 'bread', uz: 'non' },
                { en: 'book', uz: 'kitob' },
                { en: 'shirt', uz: 'ko‘ylak' }
              ]
            }
          },
          {
            english: 'Can I pay by card?',
            uzbek: 'Karta orqali to‘lasam bo‘ladimi?'
          }
        ]
      },
      {
        id: 'shop-l4',
        title: 'Lesson 4: Listening and Speaking Practice',
        titleUz: '4-dars: Tinglash va gapirish amaliyoti',
        lessonNumber: 4,
        category: 'practice',
        description: 'Realistic market dialogue between customer and seller.',
        descriptionUz: 'Xaridor va sotuvchi o‘rtasidagi bozor suhbati.',
        items: [
          'Seller: Hello! Can I help you with fresh fruits? — Salom! Yangi mevalar kerakmi?',
          'Customer: Yes please! How much are these sweet grapes? — Ha iltimos! Bu shirin uzumlar qancha turadi?',
          'Seller: They are two dollars per kilo. Very fresh! — Kilosi ikki dollar. Juda barra!',
          'Customer: Wonderful. I will take two kilos, please. — Ajoyib. Iltimos, ikki kilo bering.'
        ],
        itemsUz: [
          'Sotuvchi: Salom! Yangi mevalar kerakmi?',
          'Xaridor: Bu shirin uzumlar qancha?',
          'Sotuvchi: Kilosi 2 dollar. Juda barra!',
          'Xaridor: Ikki kilo bering, iltimos.'
        ],
        dialogue: [
          { speaker: 'Seller', text: 'Good morning! Welcome to the market. What can I get for you?' },
          { speaker: 'David', text: 'Good morning! How much are the red apples?' },
          { speaker: 'Seller', text: 'They are one dollar per kilogram.' },
          { speaker: 'David', text: 'Great! I will take three kilograms, please. Can I pay by card?' },
          { speaker: 'Seller', text: 'Yes, of course. Tap your card right here. Thank you!' }
        ]
      }
    ],
    dialogue: [
      { speaker: 'Seller', text: 'Good morning! Welcome to the market. What can I get for you?' },
      { speaker: 'David', text: 'Good morning! How much are the red apples?' },
      { speaker: 'Seller', text: 'They are one dollar per kilogram.' },
      { speaker: 'David', text: 'Great! I will take three kilograms, please. Can I pay by card?' },
      { speaker: 'Seller', text: 'Yes, of course. Tap your card right here. Thank you!' }
    ],
    speakingActivities: [
      'Name 3 types of shops in English.',
      'Practice asking: "How much is this?" clearly.',
      'Politely order an item using: "I will take two..., please".',
      'Ask if you can pay by card or cash.',
      'Record an audio roleplay buying fruit at a bazaar.'
    ],
    prompts: [
      {
        id: 'shop-q1',
        question: 'What do you usually shop for at the market, and how do you ask for the price?',
        questionUz: 'Bozorda odatda nimalar xarid qilasiz va narxini qanday so‘raysiz?',
        sentenceStarters: ['At the market, I buy...', 'I ask: "How much is...",', 'I prefer paying with...'],
        exampleAnswer: 'At the market, I usually buy fresh bread, sweet apples, and tea. I ask: "Excuse me, how much are these apples?" and I pay with cash.',
        teacherTip: 'Use "How much is..." for singular items and "How much are..." for plurals.'
      }
    ],
    completionMessage: 'Congratulations! You completed Topic 15: Shopping and Money. You have completed Level 3!',
    completionMessageUz: 'Tabriklaymiz! Siz 15-mavzuni tugatdingiz va 3-bosqichni muvaffaqiyatli yakunladingiz!',
    listenAndChoose: [
      {
        id: 'shop-lc1',
        audioPrompt: 'The red apples are one dollar per kilogram, and the customer bought three kilograms.',
        question: 'How much do the apples cost per kilogram?',
        options: [
          { id: 'opt-1', text: 'One dollar', isCorrect: true },
          { id: 'opt-2', text: 'Fifty dollars', isCorrect: false },
          { id: 'opt-3', text: 'Free of charge', isCorrect: false }
        ],
        explanation: 'The speaker stated: "The red apples are one dollar per kilogram".'
      }
    ],
    vocabularyChallenge: [
      {
        id: 'vocab-market',
        word: 'Market',
        phonetic: '/ˈmɑːr.kɪt/',
        definition: 'A regular gathering of people for the purchase and sale of provisions.',
        exampleSentence: 'Fresh fruits at the market.',
        audioHint: 'Mar-ket.'
      }
    ],
    sentenceBuilder: [
      {
        id: 'sb-shop-1',
        instruction: 'Assemble this price question:',
        targetSentence: 'How much are these red apples',
        scrambledWords: ['red', 'apples', 'are', 'How', 'much', 'these'],
        hint: 'Start with "How much are".'
      }
    ],
    aiRoleplayScenario: {
      id: 'ai-roleplay-shopping',
      scenarioTitle: 'Buying Fresh Produce at the Market',
      aiRole: 'Rustam, a friendly bazaar trader',
      contextDescription: 'You visit a vibrant fruit and bread stall at the bazaar.',
      initialAIGreeting: 'Assalomu alaykum! Welcome to our stall. We have the sweetest melons and fresh bread today. What can I get you?',
      suggestedStudentStarters: [
        'How much is the sweet melon?',
        'I would like two warm breads, please.',
        'Can I pay with my card?'
      ]
    },
    speakingMission: {
      id: 'mission-shopping',
      missionTitle: 'Market Shopping Simulation',
      promptQuestion: 'Roleplay a market purchase: greet the seller, ask the price of two items, and complete the order politely.',
      sampleGoodAnswer: 'Good morning! How much are these sweet oranges? I would like two kilos, please. And can I pay by card? Thank you very much!',
      teacherEncouragement: 'Polite words like "please" and "thank you" make shopping conversations a joy.'
    }
  }
];
