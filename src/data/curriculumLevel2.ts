import { ConversationTopic } from '../types';

export const LEVEL_2_TOPICS: ConversationTopic[] = [
  // ==============================================================================
  // TOPIC 6: MY HOME AND ROOMS
  // ==============================================================================
  {
    id: 'my-home-rooms',
    title: 'My Home and Rooms',
    titleUz: 'Mening uyim va xonalarim',
    subtitle: 'Learn rooms of the house, furniture, appliances, and home descriptions.',
    subtitleUz: 'Uy xonalari, mebellar, jihozlar va uy haqida gapirishni o‘rganing.',
    level: 'A1',
    levelGroup: 'Level 2',
    learningObjective: 'Learn rooms, furniture, and household items first, then describe locations with prepositions and simple sentences.',
    learningObjectiveUz: 'Avval xonalar va mebel so‘zlarini o‘rganib, so‘ng predloglar yordamida uy haqida gapirishni o‘rganish.',
    iconName: 'home',
    color: 'teal',
    audioInstruction: 'Welcome to Topic 6: My Home and Rooms. Learn the rooms of a home, furniture, everyday items, and how to describe where things are.',
    audioInstructionUz: '6-mavzuga xush kelibsiz: Mening uyim va xonalarim. Xonalar, mebellar va buyumlar qayerda joylashganini inglizcha tasvirlashni o‘rganasiz.',
    lessons: [
      {
        id: 'home-l1',
        title: 'Lesson 1: Rooms of the House',
        titleUz: '1-dars: Uy xonalari',
        lessonNumber: 1,
        category: 'vocabulary',
        description: 'Names of the different rooms and areas in a home.',
        descriptionUz: 'Uydagi turli xonalar va maydonlar nomlari.',
        items: [
          'House / Home — Uy',
          'Living room — Mehmonxona',
          'Bedroom — Yotoqxona',
          'Kitchen — Oshxona',
          'Bathroom — Vanna xonasi / Hammom',
          'Dining room — Oshxona (ovqatlanish xonasi)',
          'Hallway / Corridor — Dahliz / Yo‘lak',
          'Balcony — Bolxon / Balkon',
          'Garden — Bog‘ / Tomorqa',
          'Yard — Hovli',
          'Door — Eshik',
          'Window — Deraza / Oyna'
        ],
        itemsUz: [
          'Uy',
          'Mehmonxona',
          'Yotoqxona',
          'Oshxona',
          'Vanna xonasi / Hammom',
          'Ovqatlanish xonasi',
          'Dahliz / Yo‘lak',
          'Bolxon / Balkon',
          'Bog‘ / Tomorqa',
          'Hovli',
          'Eshik',
          'Deraza / Oyna'
        ],
        vocabulary: [
          { english: 'Living room', uzbek: 'Mehmonxona', phonetic: '/ˈlɪv.ɪŋ ˌruːm/', exampleSentence: 'The family sits in the living room.', exampleSentenceUz: 'Oila mehmonxonada o‘tiradi.' },
          { english: 'Bedroom', uzbek: 'Yotoqxona', phonetic: '/ˈbed.ruːm/', exampleSentence: 'My bedroom is quiet and comfortable.', exampleSentenceUz: 'Yotoqxonam tinch va qulay.' },
          { english: 'Kitchen', uzbek: 'Oshxona', phonetic: '/ˈkɪtʃ.ən/', exampleSentence: 'Mom is cooking dinner in the kitchen.', exampleSentenceUz: 'Onam oshxonada kechki ovqat pishiryapti.' },
          { english: 'Bathroom', uzbek: 'Hammom', phonetic: '/ˈbæθ.ruːm/', exampleSentence: 'The bathroom has a clean shower.', exampleSentenceUz: 'Hammomda toza dush bor.' },
          { english: 'Yard', uzbek: 'Hovli', phonetic: '/jɑːrd/', exampleSentence: 'Children play outside in the yard.', exampleSentenceUz: 'Bolalar hovlida o‘ynashadi.' }
        ]
      },
      {
        id: 'home-l2',
        title: 'Lesson 2: Furniture and Household Items',
        titleUz: '2-dars: Mebellar va uy jihozlari',
        lessonNumber: 2,
        category: 'vocabulary',
        description: 'Common furniture found in bedrooms and living rooms.',
        descriptionUz: 'Yotoqxona va mehmonxonadagi asosiy mebellar.',
        items: [
          'Sofa / Couch — Divan',
          'Table — Stol',
          'Chair — Stul',
          'Bed — Karavot',
          'Wardrobe / Closet — Kiyim shkafi',
          'Desk — Yozuv stoli',
          'Bookshelf — Kitob javoni',
          'Mirror — Oyna / Ko‘zgu',
          'Lamp — Chiroq / Lampa',
          'Pillow — Yostiq',
          'Blanket — Ko‘rpa / Pled',
          'Carpet / Rug — Gilam'
        ],
        itemsUz: [
          'Divan',
          'Stol',
          'Stul',
          'Karavot',
          'Kiyim shkafi',
          'Yozuv stoli',
          'Kitob javoni',
          'Oyna / Ko‘zgu',
          'Chiroq / Lampa',
          'Yostiq',
          'Ko‘rpa / Pled',
          'Gilam'
        ],
        vocabulary: [
          { english: 'Sofa', uzbek: 'Divan', phonetic: '/ˈsoʊ.fə/', exampleSentence: 'A comfortable sofa is in the living room.', exampleSentenceUz: 'Mehmonxonada qulay divan bor.' },
          { english: 'Bed', uzbek: 'Karavot', phonetic: '/bed/', exampleSentence: 'My bed is soft with a warm blanket.', exampleSentenceUz: 'Karavotim yumshoq, ustida issiq ko‘rpa bor.' },
          { english: 'Table', uzbek: 'Stol', phonetic: '/ˈteɪ.bəl/', exampleSentence: 'We put books on the table.', exampleSentenceUz: 'Biz kitoblarni stolga qo‘yamiz.' },
          { english: 'Carpet', uzbek: 'Gilam', phonetic: '/ˈkɑːr.pɪt/', exampleSentence: 'A traditional carpet is on the floor.', exampleSentenceUz: 'Pol ustida an’anaviy gilam to‘shalgan.' }
        ]
      },
      {
        id: 'home-l3',
        title: 'Lesson 3: Kitchen and Everyday Objects',
        titleUz: '3-dars: Oshxona buyumlari',
        lessonNumber: 3,
        category: 'vocabulary',
        description: 'Everyday tools, dishes, and kitchen appliances.',
        descriptionUz: 'Idish-tovoqlar va oshxona anjomlari.',
        items: [
          'Refrigerator / Fridge — Muzlatgich',
          'Stove — Gaz plitasi',
          'Kettle — Choynak',
          'Cup / Mug — Finjon / Krujka',
          'Plate — Likopcha / Tarelka',
          'Bowl — Kosa / Piyola',
          'Spoon — Qoshiq',
          'Fork — Sanchqi / Vilka',
          'Knife — Pichoq',
          'Sink — Rakovina / Chanoq',
          'Towel — Sochiq',
          'Clock — Soat'
        ],
        itemsUz: [
          'Muzlatgich',
          'Gaz plitasi',
          'Choynak',
          'Finjon / Krujka',
          'Likopcha',
          'Kosa / Piyola',
          'Qoshiq',
          'Sanchqi',
          'Pichoq',
          'Rakovina',
          'Sochiq',
          'Soat'
        ],
        vocabulary: [
          { english: 'Kettle', uzbek: 'Choynak', phonetic: '/ˈket̬.əl/', exampleSentence: 'The water boils in the kettle.', exampleSentenceUz: 'Choynakda suv qaynamoqda.' },
          { english: 'Bowl', uzbek: 'Kosa / Piyola', phonetic: '/boʊl/', exampleSentence: 'We drink hot green tea from a bowl.', exampleSentenceUz: 'Piyolada issiq ko‘k choy ichamiz.' },
          { english: 'Fridge', uzbek: 'Muzlatgich', phonetic: '/frɪdʒ/', exampleSentence: 'Fresh fruits and milk are in the fridge.', exampleSentenceUz: 'Yangi mevalar va sut muzlatgichda.' }
        ]
      },
      {
        id: 'home-l4',
        title: 'Lesson 4: Describing Your Home with Sentence Patterns',
        titleUz: '4-dars: Uyni tasvirlash gap qoliplari',
        lessonNumber: 4,
        category: 'sentences',
        description: 'Sentences using "There is", "There are", and prepositions.',
        descriptionUz: '"There is/are" va o‘rin-joy predloglari bilan tuziladigan gaplar.',
        items: [
          'There is a big sofa in the living room. — Mehmonxonada katta divan bor.',
          'There are three rooms in our apartment. — Xonadonimizda uchta xona bor.',
          'The book is on the table. — Kitob stol ustida.',
          'My home is warm and peaceful. — Mening uyim iliq va tinch.'
        ],
        itemsUz: [
          'Mehmonxonada katta divan bor.',
          'Xonadonimizda uchta xona bor.',
          'Kitob stol ustida.',
          'Mening uyim iliq va tinch.'
        ],
        sentences: [
          {
            english: 'There is a sofa in the living room.',
            uzbek: 'Mehmonxonada divan bor.',
            patternRule: 'There is a + [Item] in the + [Room]',
            substitutions: {
              slotName: 'Furniture & Room',
              options: [
                { en: 'sofa in the living room', uz: 'mehmonxonada divan' },
                { en: 'bed in the bedroom', uz: 'yotoqxonada karavot' },
                { en: 'table in the kitchen', uz: 'oshxonada stol' },
                { en: 'kettle on the stove', uz: 'plitada choynak' }
              ]
            }
          },
          {
            english: 'There are two windows in my room.',
            uzbek: 'Xonamda ikkita deraza bor.',
            patternRule: 'There are + [Number] [Items] in + [Place]',
            substitutions: {
              slotName: 'Items',
              options: [
                { en: 'two windows', uz: 'ikkita deraza' },
                { en: 'three chairs', uz: 'uchta stul' },
                { en: 'many books', uz: 'ko‘plab kitoblar' }
              ]
            }
          },
          {
            english: 'My home is warm and peaceful.',
            uzbek: 'Mening uyim iliq va tinch.'
          }
        ]
      },
      {
        id: 'home-l5',
        title: 'Lesson 5: Listening and Speaking Practice',
        titleUz: '5-dars: Tinglash va gapirish amaliyoti',
        lessonNumber: 5,
        category: 'practice',
        description: 'Conversation about homes and speaking about where you live.',
        descriptionUz: 'Uylar haqidagi suhbat va o‘z uyingizni tasvirlash mashqi.',
        items: [
          'A: Do you live in a house or an apartment? — Siz hovli uyda yashaysizmi yoki ko‘p qavatli xonadondami?',
          'B: I live in a house with a beautiful green yard. — Men go‘zal yashil hovlisi bor uyda yashayman.',
          'A: How many rooms are there in your home? — Uyingizda nechta xona bor?',
          'B: There are four rooms: a living room, two bedrooms, and a bright kitchen. — To‘rtta xona bor: mehmonxona, ikkita yotoqxona va yorug‘ oshxona.'
        ],
        itemsUz: [
          'A: Hovli uydami yoki xonadondami yashaysiz?',
          'B: Yashil hovlisi bor uyda yashayman.',
          'A: Uyingizda nechta xona bor?',
          'B: To‘rtta xona bor: mehmonxona, 2 ta yotoqxona va yorug‘ oshxona.'
        ],
        dialogue: [
          { speaker: 'Anna', text: 'Where do you live, David? In a house or an apartment?' },
          { speaker: 'David', text: 'I live in a comfortable house with my family. We have four rooms.' },
          { speaker: 'Anna', text: 'What is your favorite room?' },
          { speaker: 'David', text: 'My favorite room is the living room because we all sit together on the sofa.' }
        ]
      }
    ],
    dialogue: [
      { speaker: 'Anna', text: 'Where do you live, David? In a house or an apartment?' },
      { speaker: 'David', text: 'I live in a comfortable house with my family. We have four rooms.' },
      { speaker: 'Anna', text: 'What is your favorite room?' },
      { speaker: 'David', text: 'My favorite room is the living room because we all sit together on the sofa.' }
    ],
    speakingActivities: [
      'Name 3 rooms in your house in English.',
      'Name 3 pieces of furniture in your bedroom.',
      'Use "There is a..." to describe one item in your home.',
      'Tell your partner which room is your favorite.',
      'Record an audio tour describing your room.'
    ],
    prompts: [
      {
        id: 'home-q1',
        question: 'Describe your home: how many rooms are there and what is your favorite room?',
        questionUz: 'Uyingizni tasvirlang: nechta xona bor va sevimli xonangiz qaysi?',
        sentenceStarters: ['I live in a...', 'There are ... rooms in my home.', 'My favorite room is the...'],
        exampleAnswer: 'I live in a cozy house with four rooms. My favorite room is the bedroom because it is quiet and comfortable.',
        teacherTip: 'Use words like "living room", "kitchen", and "sofa".'
      }
    ],
    completionMessage: 'Well done! You finished Topic 6: My Home and Rooms. You can now describe rooms and furniture.',
    completionMessageUz: 'Barakalla! Siz 6-mavzuni tugatdingiz. Xonalar va mebellarni bemalol tasvirlay olasiz.',
    listenAndChoose: [
      {
        id: 'home-lc1',
        audioPrompt: 'In our living room, there is a large soft sofa, a wooden table, and a colorful carpet on the floor.',
        question: 'What is on the floor in the living room?',
        options: [
          { id: 'opt-1', text: 'A colorful carpet', isCorrect: true },
          { id: 'opt-2', text: 'A stove and kettle', isCorrect: false },
          { id: 'opt-3', text: 'Cold water only', isCorrect: false }
        ],
        explanation: 'The speaker said: "a colorful carpet on the floor".'
      }
    ],
    vocabularyChallenge: [
      {
        id: 'vocab-kitchen',
        word: 'Kitchen',
        phonetic: '/ˈkɪtʃ.ən/',
        definition: 'A room where food is prepared and cooked.',
        exampleSentence: 'We cook dinner in the kitchen.',
        audioHint: 'Kitch-en.'
      }
    ],
    sentenceBuilder: [
      {
        id: 'sb-home-1',
        instruction: 'Assemble this room description:',
        targetSentence: 'There is a sofa in the living room',
        scrambledWords: ['sofa', 'There', 'room', 'is', 'living', 'a', 'in', 'the'],
        hint: 'Start with "There is".'
      }
    ],
    aiRoleplayScenario: {
      id: 'ai-roleplay-home',
      scenarioTitle: 'Inviting a Friend to Your Home',
      aiRole: 'Maya, an English speaking friend',
      contextDescription: 'Maya visits your city and asks what your home is like.',
      initialAIGreeting: 'Hi! I would love to hear about where you live. Do you have a cozy room?',
      suggestedStudentStarters: [
        'Yes, I live in a warm house with my family.',
        'My room has a comfortable bed and a desk.',
        'There is a peaceful garden in our yard.'
      ]
    },
    speakingMission: {
      id: 'mission-home',
      missionTitle: 'Describe Your Home',
      promptQuestion: 'Talk about your house or apartment and name three things inside your favorite room.',
      sampleGoodAnswer: 'I live in a comfortable house. My favorite room is my bedroom. Inside, there is a bed, a desk for studying, and a warm lamp.',
      teacherEncouragement: 'Describe things you use every day. Your home vocabulary is very practical!'
    }
  },

  // ==============================================================================
  // TOPIC 7: WEATHER AND SEASONS
  // ==============================================================================
  {
    id: 'weather-seasons',
    title: 'Weather and Seasons',
    titleUz: 'Ob-havo va fasllar',
    subtitle: 'Learn the four seasons, weather adjectives, and talking about forecasts.',
    subtitleUz: 'To‘rt fasl, ob-havo sifatlari va ob-havoni tasvirlashni o‘rganing.',
    level: 'A1',
    levelGroup: 'Level 2',
    learningObjective: 'Learn seasons, weather words, and clothes for weather, then describe daily weather conditions.',
    learningObjectiveUz: 'Fasllar, ob-havo va kiyim so‘zlarini o‘rganib, kundalik ob-havoni tasvirlash.',
    iconName: 'compass',
    color: 'teal',
    audioInstruction: 'Welcome to Topic 7: Weather and Seasons. Learn words for spring, summer, autumn, winter, sunny days, rain, and snow.',
    audioInstructionUz: '7-mavzuga xush kelibsiz: Ob-havo va fasllar. Bahor, yoz, kuz, qish, oftobli kunlar, yomg‘ir va qorni tasvirlashni o‘rganasiz.',
    lessons: [
      {
        id: 'weather-l1',
        title: 'Lesson 1: The Four Seasons',
        titleUz: '1-dars: To‘rt fasl',
        lessonNumber: 1,
        category: 'vocabulary',
        description: 'Names of the seasons and natural seasonal elements.',
        descriptionUz: 'To‘rt fasl va tabiat hodisalari nomlari.',
        items: [
          'Season — Fasl',
          'Spring — Bahor',
          'Summer — Yoz',
          'Autumn / Fall — Kuz',
          'Winter — Qish',
          'Sun — Quyosh',
          'Rain — Yomg‘ir',
          'Snow — Qor',
          'Wind — Shamol',
          'Cloud — Bulut',
          'Sky — Osmon',
          'Temperature — Harorat'
        ],
        itemsUz: [
          'Fasl',
          'Bahor',
          'Yoz',
          'Kuz',
          'Qish',
          'Quyosh',
          'Yomg‘ir',
          'Qor',
          'Shamol',
          'Bulut',
          'Osmon',
          'Harorat'
        ],
        vocabulary: [
          { english: 'Spring', uzbek: 'Bahor', phonetic: '/sprɪŋ/', exampleSentence: 'Flowers bloom in spring.', exampleSentenceUz: 'Bahorda gullar ochiladi.' },
          { english: 'Summer', uzbek: 'Yoz', phonetic: '/ˈsʌm.ɚ/', exampleSentence: 'Summer in Uzbekistan is sunny and warm.', exampleSentenceUz: 'O‘zbekistonda yoz oftobli va issiq.' },
          { english: 'Autumn', uzbek: 'Kuz', phonetic: '/ˈɑː.t̬əm/', exampleSentence: 'In autumn, the leaves turn gold.', exampleSentenceUz: 'Kuzda barglar sarg‘ayadi.' },
          { english: 'Winter', uzbek: 'Qish', phonetic: '/ˈwɪn.t̬ɚ/', exampleSentence: 'Winter brings white snow and cool air.', exampleSentenceUz: 'Qish oq qor va salqin havo keltiradi.' }
        ]
      },
      {
        id: 'weather-l2',
        title: 'Lesson 2: Weather Describing Adjectives',
        titleUz: '2-dars: Ob-havo sifatlari',
        lessonNumber: 2,
        category: 'vocabulary',
        description: 'Words used to describe the weather outside today.',
        descriptionUz: 'Bugungi ob-havoni tasvirlash uchun sifatlar.',
        items: [
          'Sunny — Oftobli / Quyoshli',
          'Rainy — Yomg‘irli',
          'Windy — Shamolli',
          'Snowy — Qorli',
          'Cloudy — Bulutli',
          'Warm — Iliq',
          'Hot — Issiq',
          'Cold — Sovuq',
          'Cool — Salqin',
          'Freezing — Juda sovuq / Qahraton',
          'Dry — Quruq',
          'Clear sky — Ochiq osmon'
        ],
        itemsUz: [
          'Oftobli / Quyoshli',
          'Yomg‘irli',
          'Shamolli',
          'Qorli',
          'Bulutli',
          'Iliq',
          'Issiq',
          'Sovuq',
          'Salqin',
          'Juda sovuq / Qahraton',
          'Quruq',
          'Ochiq osmon'
        ],
        vocabulary: [
          { english: 'Sunny', uzbek: 'Oftobli', phonetic: '/ˈsʌn.i/', exampleSentence: 'Today is a bright, sunny day.', exampleSentenceUz: 'Bugun yorug‘, oftobli kun.' },
          { english: 'Rainy', uzbek: 'Yomg‘irli', phonetic: '/ˈreɪ.ni/', exampleSentence: 'Take an umbrella on a rainy day.', exampleSentenceUz: 'Yomg‘irli kunda soyabon oling.' },
          { english: 'Cold', uzbek: 'Sovuq', phonetic: '/koʊld/', exampleSentence: 'It is very cold outside in winter.', exampleSentenceUz: 'Qishda tashqarida juda sovuq bo‘ladi.' },
          { english: 'Warm', uzbek: 'Iliq', phonetic: '/wɔːrm/', exampleSentence: 'The spring breeze is gentle and warm.', exampleSentenceUz: 'Bahor shabadası mayin va iliq.' }
        ]
      },
      {
        id: 'weather-l3',
        title: 'Lesson 3: Weather Gear and Clothing',
        titleUz: '3-dars: Ob-havoga mos kiyimlar va buyumlar',
        lessonNumber: 3,
        category: 'vocabulary',
        description: 'Things you carry or wear depending on the weather.',
        descriptionUz: 'Ob-havoga qarab kiyiladigan yoki olinadigan buyumlar.',
        items: [
          'Umbrella — Soyabon',
          'Raincoat — Yomg‘irpo‘sh',
          'Sunglasses — Quyoshdan saqlovchi ko‘zoynak',
          'Winter coat — Qishki palto',
          'Scarf — Sharf',
          'Gloves — Qo‘lqop',
          'Warm boots — Issiq etiklar',
          'Sun hat — Oftobdan saqlovchi shlyapa',
          'Jacket — Kurtka'
        ],
        itemsUz: [
          'Soyabon',
          'Yomg‘irpo‘sh',
          'Quyoshdan saqlovchi ko‘zoynak',
          'Qishki palto',
          'Sharf',
          'Qo‘lqop',
          'Issiq etiklar',
          'Oftobdan saqlovchi shlyapa',
          'Kurtka'
        ],
        vocabulary: [
          { english: 'Umbrella', uzbek: 'Soyabon', phonetic: '/ʌmˈbrel.ə/', exampleSentence: 'Open your umbrella in the rain.', exampleSentenceUz: 'Yomg‘irda soyaboningizni oching.' },
          { english: 'Scarf', uzbek: 'Sharf', phonetic: '/skɑːrf/', exampleSentence: 'A warm woolen scarf protects your neck.', exampleSentenceUz: 'Issiq jun sharf bo‘yningizni sovuqdan asraydi.' }
        ]
      },
      {
        id: 'weather-l4',
        title: 'Lesson 4: Talking About Weather Forecasts',
        titleUz: '4-dars: Ob-havo haqida gapirish qoliplari',
        lessonNumber: 4,
        category: 'sentences',
        description: 'Simple patterns to ask about and describe the weather.',
        descriptionUz: 'Ob-havoni so‘rash va aytish uchun sodda qoliplar.',
        items: [
          'How is the weather today? — Bugun ob-havo qanday?',
          'It is sunny and warm. — Havo oftobli va iliq.',
          'It is raining outside. — Tashqarida yomg‘ir yog‘yapti.',
          'My favorite season is spring. — Mening sevimli faslim bahor.',
          'In summer, it is very hot. — Yozda havo juda issiq bo‘ladi.'
        ],
        itemsUz: [
          'Bugun ob-havo qanday?',
          'Havo oftobli va iliq.',
          'Tashqarida yomg‘ir yog‘yapti.',
          'Mening sevimli faslim bahor.',
          'Yozda havo juda issiq bo‘ladi.'
        ],
        sentences: [
          {
            english: 'Today the weather is sunny.',
            uzbek: 'Bugun havo oftobli.',
            patternRule: 'Today the weather is + [Adjective]',
            substitutions: {
              slotName: 'Weather Condition',
              options: [
                { en: 'sunny', uz: 'oftobli' },
                { en: 'rainy', uz: 'yomg‘irli' },
                { en: 'windy', uz: 'shamolli' },
                { en: 'cold', uz: 'sovuq' },
                { en: 'cloudy', uz: 'bulutli' }
              ]
            }
          },
          {
            english: 'My favorite season is spring.',
            uzbek: 'Mening sevimli faslim bahor.',
            patternRule: 'My favorite season is + [Season]',
            substitutions: {
              slotName: 'Season',
              options: [
                { en: 'spring', uz: 'bahor' },
                { en: 'summer', uz: 'yoz' },
                { en: 'autumn', uz: 'kuz' },
                { en: 'winter', uz: 'qish' }
              ]
            }
          }
        ]
      },
      {
        id: 'weather-l5',
        title: 'Lesson 5: Listening and Speaking Practice',
        titleUz: '5-dars: Tinglash va gapirish amaliyoti',
        lessonNumber: 5,
        category: 'practice',
        description: 'Conversation checking today’s weather and giving advice.',
        descriptionUz: 'Bugungi ob-havoni tekshirish va maslahat berish suhbati.',
        items: [
          'A: How is the weather today in Tashkent? — Bugun Toshkentda ob-havo qanday?',
          'B: It is sunny and warm! The sky is blue. — Havo oftobli va iliq! Osmon musaffo.',
          'A: Wonderful! Should I wear a jacket? — Ajoyib! Kurtka kiyishim kerakmi?',
          'B: No, a light sweater or shirt is enough. — Yo‘q, yengil kiyim yoki ko‘ylak yetarli.'
        ],
        itemsUz: [
          'A: Toshkentda ob-havo qanday?',
          'B: Havo oftobli va iliq! Osmon musaffo.',
          'A: Kurtka kiyishim kerakmi?',
          'B: Yo‘q, yengil ko‘ylak yetarli.'
        ],
        dialogue: [
          { speaker: 'Anna', text: 'How is the weather outside today, David?' },
          { speaker: 'David', text: 'It is sunny and warm today. There are no clouds in the sky.' },
          { speaker: 'Anna', text: 'That is great! What is your favorite season?' },
          { speaker: 'David', text: 'My favorite season is spring because flowers bloom everywhere.' }
        ]
      }
    ],
    dialogue: [
      { speaker: 'Anna', text: 'How is the weather outside today, David?' },
      { speaker: 'David', text: 'It is sunny and warm today. There are no clouds in the sky.' },
      { speaker: 'Anna', text: 'That is great! What is your favorite season?' },
      { speaker: 'David', text: 'My favorite season is spring because flowers bloom everywhere.' }
    ],
    speakingActivities: [
      'Name the four seasons in English.',
      'Describe today’s weather using two adjectives.',
      'Say what your favorite season is and why.',
      'Practice asking someone: "How is the weather today?".',
      'Record an audio weather forecast for your city.'
    ],
    prompts: [
      {
        id: 'weather-q1',
        question: 'What is the weather like today in your city, and what season do you love most?',
        questionUz: 'Bugun shahringizda ob-havo qanday va qaysi faslni ko‘proq yoqtirasiz?',
        sentenceStarters: ['Today the weather is...', 'It is warm and...', 'My favorite season is...'],
        exampleAnswer: 'Today the weather is sunny and warm in Tashkent. My favorite season is spring because everything turns green.',
        teacherTip: 'Combine two adjectives: sunny and warm, or rainy and cool.'
      }
    ],
    completionMessage: 'Great work! You finished Topic 7: Weather and Seasons. You can now talk about the forecast.',
    completionMessageUz: 'Barakalla! Siz 7-mavzuni tugatdingiz. Endi ob-havo va fasllar haqida erkin gaplasha olasiz.',
    listenAndChoose: [
      {
        id: 'weather-lc1',
        audioPrompt: 'It is raining outside today. Please do not forget to take your umbrella before you leave!',
        question: 'What should the listener take because of the weather?',
        options: [
          { id: 'opt-1', text: 'An umbrella', isCorrect: true },
          { id: 'opt-2', text: 'Sunglasses only', isCorrect: false },
          { id: 'opt-3', text: 'Ice cream', isCorrect: false }
        ],
        explanation: 'The speaker said: "Please do not forget to take your umbrella".'
      }
    ],
    vocabularyChallenge: [
      {
        id: 'vocab-sunny',
        word: 'Sunny',
        phonetic: '/ˈsʌn.i/',
        definition: 'Bright with sunlight.',
        exampleSentence: 'A sunny day in spring.',
        audioHint: 'Sun-ny.'
      }
    ],
    sentenceBuilder: [
      {
        id: 'sb-weather-1',
        instruction: 'Assemble this weather description:',
        targetSentence: 'Today the weather is sunny and warm',
        scrambledWords: ['is', 'Today', 'warm', 'and', 'weather', 'the', 'sunny'],
        hint: 'Start with "Today the weather".'
      }
    ],
    aiRoleplayScenario: {
      id: 'ai-roleplay-weather',
      scenarioTitle: 'Planning a Walk in the Park',
      aiRole: 'Liam, a walking buddy',
      contextDescription: 'Liam wants to know if you should go walking outside today.',
      initialAIGreeting: 'Hi! I want to go for a walk. How is the weather outside right now?',
      suggestedStudentStarters: [
        'It is sunny and pleasant today.',
        'It is a bit windy, so take a jacket.',
        'The sky is clear and warm.'
      ]
    },
    speakingMission: {
      id: 'mission-weather',
      missionTitle: 'Daily Weather Report',
      promptQuestion: 'Give a short weather report for today: state the temperature feel, sky condition, and your favorite season.',
      sampleGoodAnswer: 'Good morning! Today the weather in Samarkand is sunny and warm with blue skies. My favorite season is autumn because of delicious fruits.',
      teacherEncouragement: 'Speak clearly like a friendly morning radio presenter!'
    }
  },

  // ==============================================================================
  // TOPIC 8: COLORS AND CLOTHING
  // ==============================================================================
  {
    id: 'colors-clothing',
    title: 'Colors and Clothing',
    titleUz: 'Ranglar va kiyim-kechaklar',
    subtitle: 'Learn colors, everyday clothes, accessories, and describing outfits.',
    subtitleUz: 'Ranglar, kiyimlar, aksessuarlar va kiyinishni tasvirlashni o‘rganing.',
    level: 'A1',
    levelGroup: 'Level 2',
    learningObjective: 'Learn colors and clothing items first, then describe what someone is wearing.',
    learningObjectiveUz: 'Avval ranglar va kiyim nomlarini o‘rganib, so‘ng kim nima kiyganini aytishni mashq qilish.',
    iconName: 'sparkles',
    color: 'teal',
    audioInstruction: 'Welcome to Topic 8: Colors and Clothing. Learn color names, shirts, shoes, dresses, and how to say what you are wearing today.',
    audioInstructionUz: '8-mavzuga xush kelibsiz: Ranglar va kiyimlar. Ranglar, ko‘ylak, poyabzal va bugun nima kiyganingizni aytishni o‘rganasiz.',
    lessons: [
      {
        id: 'clothes-l1',
        title: 'Lesson 1: Colors and Shades',
        titleUz: '1-dars: Ranglar va tuslar',
        lessonNumber: 1,
        category: 'vocabulary',
        description: 'Names of essential colors in English with clear translations.',
        descriptionUz: 'Ingliz tilidagi asosiy ranglar nomlari.',
        items: [
          'Red — Qizil',
          'Blue — Moviy / Ko‘k',
          'Green — Yashil',
          'Yellow — Sariq',
          'Orange — To‘q sariq / Sabzirang',
          'Purple — Binafsharang',
          'Pink — Pushti',
          'Black — Qora',
          'White — Oq',
          'Brown — Jigarrang',
          'Gray / Grey — Kulrang',
          'Light blue — Och ko‘k',
          'Dark blue — To‘q ko‘k',
          'Bright — Yorqin'
        ],
        itemsUz: [
          'Qizil',
          'Moviy / Ko‘k',
          'Yashil',
          'Sariq',
          'To‘q sariq',
          'Binafsharang',
          'Pushti',
          'Qora',
          'Oq',
          'Jigarrang',
          'Kulrang',
          'Och ko‘k',
          'To‘q ko‘k',
          'Yorqin'
        ],
        vocabulary: [
          { english: 'Blue', uzbek: 'Moviy / Ko‘k', phonetic: '/bluː/', exampleSentence: 'The blue sky is clear.', exampleSentenceUz: 'Moviy osmon musaffo.' },
          { english: 'Green', uzbek: 'Yashil', phonetic: '/ɡriːn/', exampleSentence: 'Fresh green leaves grow in spring.', exampleSentenceUz: 'Bahorda yangi yashil barglar o‘sadi.' },
          { english: 'White', uzbek: 'Oq', phonetic: '/waɪt/', exampleSentence: 'A clean white shirt.', exampleSentenceUz: 'Toza oq ko‘ylak.' },
          { english: 'Black', uzbek: 'Qora', phonetic: '/blæk/', exampleSentence: 'Classic black shoes.', exampleSentenceUz: 'Klassik qora tufli.' }
        ]
      },
      {
        id: 'clothes-l2',
        title: 'Lesson 2: Everyday Clothes and Footwear',
        titleUz: '2-dars: Kundalik kiyimlar va poyabzallar',
        lessonNumber: 2,
        category: 'vocabulary',
        description: 'Common clothes worn at school, work, and home.',
        descriptionUz: 'Maktabda, ishda va uyda kiyiladigan odatiy kiyimlar.',
        items: [
          'Shirt — Ko‘ylak (tugmali erkaklar ko‘ylagi)',
          'T-shirt — Futbolka',
          'Pants / Trousers — Shim',
          'Jeans — Jinsi shim',
          'Dress — Ayollar ko‘ylagi',
          'Skirt — Yubka',
          'Sweater / Jumper — Sviter / Jemper',
          'Jacket — Kurtka / Pidjak',
          'Shoes — Poyabzal / Tufli',
          'Sneakers / Trainers — Krossovka',
          'Boots — Etik',
          'Socks — Paypoq'
        ],
        itemsUz: [
          'Ko‘ylak (tugmali)',
          'Futbolka',
          'Shim',
          'Jinsi shim',
          'Ayollar ko‘ylagi',
          'Yubka',
          'Sviter',
          'Kurtka',
          'Poyabzal / Tufli',
          'Krossovka',
          'Etik',
          'Paypoq'
        ],
        vocabulary: [
          { english: 'Shirt', uzbek: 'Ko‘ylak', phonetic: '/ʃɝːt/', exampleSentence: 'He wears a white shirt to work.', exampleSentenceUz: 'U ishga oq ko‘ylak kiyadi.' },
          { english: 'Dress', uzbek: 'Ko‘ylak (ayollar)', phonetic: '/dres/', exampleSentence: 'She wears a graceful traditional dress.', exampleSentenceUz: 'U chiroyli milliy ko‘ylak kiygan.' },
          { english: 'Shoes', uzbek: 'Poyabzal', phonetic: '/ʃuːz/', exampleSentence: 'Comfortable shoes for walking.', exampleSentenceUz: 'Sayr qilish uchun qulay poyabzal.' }
        ]
      },
      {
        id: 'clothes-l3',
        title: 'Lesson 3: Accessories and Headwear',
        titleUz: '3-dars: Bosh kiyimlar va aksessuarlar',
        lessonNumber: 3,
        category: 'vocabulary',
        description: 'Accessories, hats, bags, and traditional headwear.',
        descriptionUz: 'Aksessuarlar, bosh kiyimlar va sumkalar.',
        items: [
          'Hat / Cap — Shlyapa / Kepka',
          'Doppa — Do‘ppi (an’anaviy bosh kiyim)',
          'Coat — Palto',
          'Belt — Kamar',
          'Watch — Qo‘l soati',
          'Glasses — Ko‘zoynak',
          'Scarf — Sharf / Ro‘mol',
          'Gloves — Qo‘lqop',
          'Backpack / Bag — Ryukzak / Sumka',
          'Suit — Kostyum-shim'
        ],
        itemsUz: [
          'Shlyapa / Kepka',
          'Do‘ppi',
          'Palto',
          'Kamar',
          'Qo‘l soati',
          'Ko‘zoynak',
          'Sharf / Ro‘mol',
          'Qo‘lqop',
          'Ryukzak / Sumka',
          'Kostyum-shim'
        ],
        vocabulary: [
          { english: 'Glasses', uzbek: 'Ko‘zoynak', phonetic: '/ˈɡlæs.ɪz/', exampleSentence: 'He reads with glasses.', exampleSentenceUz: 'U ko‘zoynak bilan o‘qiydi.' },
          { english: 'Backpack', uzbek: 'Ryukzak / Sumka', phonetic: '/ˈbæk.pæk/', exampleSentence: 'Books are in my backpack.', exampleSentenceUz: 'Kitoblar ryukzagimda.' }
        ]
      },
      {
        id: 'clothes-l4',
        title: 'Lesson 4: Describing What You Wear',
        titleUz: '4-dars: Nima kiyganini aytish qoliplari',
        lessonNumber: 4,
        category: 'sentences',
        description: 'Combine colors and clothing items with "I am wearing...".',
        descriptionUz: '"I am wearing..." iborasi bilan rang va kiyimlarni tasvirlash.',
        items: [
          'I am wearing a blue shirt. — Men ko‘k ko‘ylak kiyganman.',
          'She is wearing a white dress. — U oq ko‘ylak kiygan.',
          'My favorite color is green. — Mening sevimli rangim yashil.',
          'He has comfortable black shoes. — Unda qulay qora poyabzal bor.'
        ],
        itemsUz: [
          'Men ko‘k ko‘ylak kiyganman.',
          'U oq ko‘ylak kiygan.',
          'Mening sevimli rangim yashil.',
          'Unda qulay qora poyabzal bor.'
        ],
        sentences: [
          {
            english: 'I am wearing a blue shirt.',
            uzbek: 'Men ko‘k ko‘ylak kiyganman.',
            patternRule: 'I am wearing a + [Color] [Item]',
            substitutions: {
              slotName: 'Color & Item',
              options: [
                { en: 'blue shirt', uz: 'ko‘k ko‘ylak' },
                { en: 'white T-shirt', uz: 'oq futbolka' },
                { en: 'warm jacket', uz: 'issiq kurtka' },
                { en: 'black coat', uz: 'qora palto' }
              ]
            }
          },
          {
            english: 'My favorite color is green.',
            uzbek: 'Mening sevimli rangim yashil.',
            substitutions: {
              slotName: 'Color',
              options: [
                { en: 'green', uz: 'yashil' },
                { en: 'blue', uz: 'moviy' },
                { en: 'white', uz: 'oq' },
                { en: 'red', uz: 'qizil' }
              ]
            }
          }
        ]
      },
      {
        id: 'clothes-l5',
        title: 'Lesson 5: Listening and Speaking Practice',
        titleUz: '5-dars: Tinglash va gapirish amaliyoti',
        lessonNumber: 5,
        category: 'practice',
        description: 'Practice describing your clothes and asking a friend what they like to wear.',
        descriptionUz: 'Kiyimlarni tasvirlash va do‘stingizga kiyimlari haqida savol berish.',
        items: [
          'A: What are you wearing today? — Bugun nima kiygansiz?',
          'B: I am wearing a comfortable blue sweater and black pants. — Men qulay ko‘k sviter va qora shim kiyganman.',
          'A: What is your favorite color for clothes? — Kiyimda sevimli rangingiz qaysi?',
          'B: I love wearing white and dark blue. — Men oq va to‘q ko‘k rang kiyishni yaxshi ko‘raman.'
        ],
        itemsUz: [
          'A: Bugun nima kiygansiz?',
          'B: Ko‘k sviter va qora shim kiyganman.',
          'A: Kiyimda sevimli rangingiz qaysi?',
          'B: Oq va to‘q ko‘k rangni yaxshi ko‘raman.'
        ],
        dialogue: [
          { speaker: 'Anna', text: 'You look very smart today, David! What are you wearing?' },
          { speaker: 'David', text: 'Thank you, Anna! I am wearing a white shirt, blue jeans, and brown shoes.' },
          { speaker: 'Anna', text: 'Blue is a great color on you.' },
          { speaker: 'David', text: 'Thanks! What is your favorite color?' }
        ]
      }
    ],
    dialogue: [
      { speaker: 'Anna', text: 'You look very smart today, David! What are you wearing?' },
      { speaker: 'David', text: 'Thank you, Anna! I am wearing a white shirt, blue jeans, and brown shoes.' },
      { speaker: 'Anna', text: 'Blue is a great color on you.' },
      { speaker: 'David', text: 'Thanks! What is your favorite color?' }
    ],
    speakingActivities: [
      'Name 5 colors in English clearly.',
      'Name 4 items of clothing you are wearing right now.',
      'Describe your outfit using the sentence: "I am wearing a...".',
      'Tell your speaking partner your favorite color.',
      'Record an audio description of your outfit.'
    ],
    prompts: [
      {
        id: 'clothes-q1',
        question: 'What are you wearing today and what is your favorite color?',
        questionUz: 'Bugun nima kiygansiz va sevimli rangingiz qaysi?',
        sentenceStarters: ['Today I am wearing a...', 'My shoes are...', 'My favorite color is...'],
        exampleAnswer: 'Today I am wearing a comfortable white shirt and blue trousers. My favorite color is blue.',
        teacherTip: 'Put the color before the noun: "blue shirt", not "shirt blue".'
      }
    ],
    completionMessage: 'Well done! You finished Topic 8: Colors and Clothing. You can now describe outfits and styles.',
    completionMessageUz: 'Barakalla! Siz 8-mavzuni tugatdingiz. Endi kiyimlar va ranglarni to‘g‘ri tasvirlay olasiz.',
    listenAndChoose: [
      {
        id: 'clothes-lc1',
        audioPrompt: 'Sarah is wearing a warm red coat, a woolen scarf, and black boots.',
        question: 'What color is Sarah’s coat?',
        options: [
          { id: 'opt-1', text: 'Red', isCorrect: true },
          { id: 'opt-2', text: 'Green', isCorrect: false },
          { id: 'opt-3', text: 'White', isCorrect: false }
        ],
        explanation: 'Sarah is wearing a "warm red coat".'
      }
    ],
    vocabularyChallenge: [
      {
        id: 'vocab-shirt',
        word: 'Shirt',
        phonetic: '/ʃɝːt/',
        definition: 'A piece of clothing for the upper body with collar and buttons.',
        exampleSentence: 'A clean white shirt.',
        audioHint: 'Begins with "sh".'
      }
    ],
    sentenceBuilder: [
      {
        id: 'sb-clothes-1',
        instruction: 'Assemble this clothing sentence:',
        targetSentence: 'I am wearing a blue shirt',
        scrambledWords: ['wearing', 'blue', 'am', 'a', 'I', 'shirt'],
        hint: 'Start with "I am wearing".'
      }
    ],
    aiRoleplayScenario: {
      id: 'ai-roleplay-clothes',
      scenarioTitle: 'Shopping for a Friendly Outfit',
      aiRole: 'Clara, a helpful clothes assistant',
      contextDescription: 'Clara asks what color and type of shirt you are looking for.',
      initialAIGreeting: 'Hello! Welcome to our shop. What color shirt would you like to see?',
      suggestedStudentStarters: [
        'I would like a white or blue shirt, please.',
        'My favorite color is dark blue.',
        'Do you have a comfortable warm jacket?'
      ]
    },
    speakingMission: {
      id: 'mission-clothes',
      missionTitle: 'Describe Your Clothes',
      promptQuestion: 'Describe your outfit today: state the colors and names of at least three items you are wearing.',
      sampleGoodAnswer: 'Today I am wearing a light blue shirt, black pants, and comfortable sneakers. My favorite color is blue.',
      teacherEncouragement: 'Speak with confidence! Mention the color first, then the item.'
    }
  },

  // ==============================================================================
  // TOPIC 9: SCHOOL, EDUCATION AND CLASSROOM
  // ==============================================================================
  {
    id: 'school-classroom',
    title: 'School, Education and Classroom',
    titleUz: 'Maktab, ta’lim va darsxona',
    subtitle: 'Learn classroom objects, subjects, study verbs, and talking about learning.',
    subtitleUz: 'Darsxona buyumlari, fanlar, o‘rganish fe’llari va ta’lim haqida gapirishni o‘rganing.',
    level: 'A1',
    levelGroup: 'Level 2',
    learningObjective: 'Learn stationery, school subjects, and classroom actions, then talk about your learning routine.',
    learningObjectiveUz: 'O‘quv qurollari, fanlar va darsdagi harakatlarni o‘rganib, ta’lim olish haqida gapirish.',
    iconName: 'book-open',
    color: 'teal',
    audioInstruction: 'Welcome to Topic 9: School, Education and Classroom. Learn words for books, pens, subjects like English and Math, and how you study.',
    audioInstructionUz: '9-mavzuga xush kelibsiz: Maktab va ta’lim. Kitoblar, qalamlar, ingliz tili, matematika kabi fanlar va o‘qish jarayonini o‘rganasiz.',
    lessons: [
      {
        id: 'school-l1',
        title: 'Lesson 1: Classroom Objects and Stationery',
        titleUz: '1-dars: O‘quv qurollari va sinf buyumlari',
        lessonNumber: 1,
        category: 'vocabulary',
        description: 'Tools and supplies used by students every day.',
        descriptionUz: 'Talabalar har kuni ishlatadigan o‘quv qurollari.',
        items: [
          'Book — Kitob',
          'Notebook — Daftar',
          'Pen — Ruchka',
          'Pencil — Qalam',
          'Eraser / Rubber — O‘chirg‘ich',
          'Ruler — Chizg‘ich',
          'Backpack — Ryukzak / O‘quvchi sumkasi',
          'Desk — Parta / Stol',
          'Chair — Stul',
          'Whiteboard — Doska',
          'Marker — Marker',
          'Scissors — Qaychi'
        ],
        itemsUz: [
          'Kitob',
          'Daftar',
          'Ruchka',
          'Qalam',
          'O‘chirg‘ich',
          'Chizg‘ich',
          'Ryukzak',
          'Parta',
          'Stul',
          'Doska',
          'Marker',
          'Qaychi'
        ],
        vocabulary: [
          { english: 'Book', uzbek: 'Kitob', phonetic: '/bʊk/', exampleSentence: 'Open your English book.', exampleSentenceUz: 'Ingliz tili kitobingizni oching.' },
          { english: 'Notebook', uzbek: 'Daftar', phonetic: '/ˈnoʊt.bʊk/', exampleSentence: 'Write notes in your notebook.', exampleSentenceUz: 'Daftaringizga qaydlar yozing.' },
          { english: 'Pen', uzbek: 'Ruchka', phonetic: '/pen/', exampleSentence: 'A blue pen is on the desk.', exampleSentenceUz: 'Stol ustida ko‘k ruchka turibdi.' }
        ]
      },
      {
        id: 'school-l2',
        title: 'Lesson 2: School Subjects',
        titleUz: '2-dars: Maktab fanlari',
        lessonNumber: 2,
        category: 'vocabulary',
        description: 'Names of subjects taught in schools and universities.',
        descriptionUz: 'Maktab va universitetlarda o‘qitiladigan asosiy fanlar.',
        items: [
          'English — Ingliz tili',
          'Mathematics / Math — Matematika',
          'History — Tarix',
          'Geography — Geografiya',
          'Science — Tabiiy fanlar',
          'Art — Tasviriy san’at',
          'Music — Musiqa',
          'Physical Education / PE — Jismoniy tarbiya',
          'Literature — Adabiyot',
          'Biology — Biologiya'
        ],
        itemsUz: [
          'Ingliz tili',
          'Matematika',
          'Tarix',
          'Geografiya',
          'Tabiiy fanlar',
          'Tasviriy san’at',
          'Musiqa',
          'Jismoniy tarbiya',
          'Adabiyot',
          'Biologiya'
        ],
        vocabulary: [
          { english: 'English', uzbek: 'Ingliz tili', phonetic: '/ˈɪŋ.ɡlɪʃ/', exampleSentence: 'I study English every day.', exampleSentenceUz: 'Men har kuni ingliz tilini o‘rganaman.' },
          { english: 'Math', uzbek: 'Matematika', phonetic: '/mæθ/', exampleSentence: 'Math solves interesting problems.', exampleSentenceUz: 'Matematika qiziqarli masalalarni yechadi.' }
        ]
      },
      {
        id: 'school-l3',
        title: 'Lesson 3: Classroom Study Actions',
        titleUz: '3-dars: Darsdagi harakat fe’llari',
        lessonNumber: 3,
        category: 'vocabulary',
        description: 'Action verbs used in classroom activities and learning.',
        descriptionUz: 'Dars paytida bajariladigan asosiy fe’llar.',
        items: [
          'Read — O‘qish',
          'Write — Yozish',
          'Listen — Tinglash',
          'Speak — Gapirish',
          'Repeat — Qaytarish',
          'Learn — O‘rganish',
          'Practice — Mashq qilish',
          'Ask — So‘rash',
          'Answer — Javob berish',
          'Study — O‘qish / Tahsil olish'
        ],
        itemsUz: [
          'O‘qish',
          'Yozish',
          'Tinglash',
          'Gapirish',
          'Qaytarish',
          'O‘rganish',
          'Mashq qilish',
          'So‘rash',
          'Javob berish',
          'Tahsil olish'
        ],
        vocabulary: [
          { english: 'Listen', uzbek: 'Tinglash', phonetic: '/ˈlɪs.ən/', exampleSentence: 'Listen carefully to the teacher.', exampleSentenceUz: 'O‘qituvchini diqqat bilan tinglang.' },
          { english: 'Speak', uzbek: 'Gapirish', phonetic: '/spiːk/', exampleSentence: 'Speak English with confidence.', exampleSentenceUz: 'Ingliz tilida ishonch bilan gapiring.' }
        ]
      },
      {
        id: 'school-l4',
        title: 'Lesson 4: Talking About Your Studies',
        titleUz: '4-dars: O‘qish haqida gapirish qoliplari',
        lessonNumber: 4,
        category: 'sentences',
        description: 'Sentence structures to discuss learning and favorite subjects.',
        descriptionUz: 'Sevimli fan va o‘qish odatlari haqida gapirish.',
        items: [
          'My favorite subject is English. — Mening sevimli fanim ingliz tili.',
          'I practice speaking English every day. — Men har kuni inglizcha gapirishni mashq qilaman.',
          'The teacher is very helpful. — Ustoz juda yordamchi va mehribon.'
        ],
        itemsUz: [
          'Mening sevimli fanim ingliz tili.',
          'Men har kuni inglizcha gapirishni mashq qilaman.',
          'Ustoz juda mehribon.'
        ],
        sentences: [
          {
            english: 'My favorite subject is English.',
            uzbek: 'Mening sevimli fanim ingliz tili.',
            substitutions: {
              slotName: 'Subject',
              options: [
                { en: 'English', uz: 'ingliz tili' },
                { en: 'Math', uz: 'matematika' },
                { en: 'History', uz: 'tarix' },
                { en: 'Music', uz: 'musiqa' }
              ]
            }
          },
          {
            english: 'I study every morning.',
            uzbek: 'Men har kuni ertalab dars qilaman.'
          }
        ]
      },
      {
        id: 'school-l5',
        title: 'Lesson 5: Listening and Speaking Practice',
        titleUz: '5-dars: Tinglash va gapirish amaliyoti',
        lessonNumber: 5,
        category: 'practice',
        description: 'Classroom interaction and dialog practice.',
        descriptionUz: 'Darsxonadagi suhbat va nutq amaliyoti.',
        items: [
          'Teacher: Welcome to English class! Please open your books. — Ingliz tili darsiga xush kelibsiz! Kitoblaringizni oching.',
          'Student: Good morning teacher! What page are we on? — Xayrli tong ustoz! Qaysi sahifadamiz?',
          'Teacher: Page fifteen. Listen and repeat after me. — O‘n beshinchi sahifa. Tinglang va orqamdan takrorlang.'
        ],
        itemsUz: [
          'Ustoz: Darsga xush kelibsiz! Kitoblaringizni oching.',
          'O‘quvchi: Xayrli tong ustoz! Qaysi betdamiz?',
          'Ustoz: 15-bet. Tinglang va takrorlang.'
        ],
        dialogue: [
          { speaker: 'Teacher', text: 'Good morning, class! Today we learn new English words.' },
          { speaker: 'David', text: 'Good morning, teacher! I have my notebook and pen ready.' },
          { speaker: 'Teacher', text: 'Excellent, David. Let’s read the first sentence together.' }
        ]
      }
    ],
    dialogue: [
      { speaker: 'Teacher', text: 'Good morning, class! Today we learn new English words.' },
      { speaker: 'David', text: 'Good morning, teacher! I have my notebook and pen ready.' },
      { speaker: 'Teacher', text: 'Excellent, David. Let’s read the first sentence together.' }
    ],
    speakingActivities: [
      'Name 4 items in your backpack in English.',
      'Tell your partner your favorite school subject.',
      'Practice saying: "I practice English every day".',
      'Ask someone: "What is your favorite subject?".',
      'Record an audio answer about what you like learning.'
    ],
    prompts: [
      {
        id: 'school-q1',
        question: 'What is your favorite subject in school, and how do you practice English?',
        questionUz: 'Maktabda sevimli faningiz qaysi va ingliz tilini qanday mashq qilasiz?',
        sentenceStarters: ['My favorite subject is...', 'I practice English by...', 'In class, I like...'],
        exampleAnswer: 'My favorite subject is English. I practice English every day by listening to audio lessons and repeating sentences aloud.',
        teacherTip: 'Mention how often you practice: every day, in the morning, or with a partner.'
      }
    ],
    completionMessage: 'Well done! You finished Topic 9: School and Education. You now know essential classroom terms.',
    completionMessageUz: 'Barakalla! Siz 9-mavzuni tugatdingiz. O‘quv qurollari va fanlarni o‘rganib oldingiz.',
    listenAndChoose: [
      {
        id: 'school-lc1',
        audioPrompt: 'Please open your notebooks, take your blue pen, and write down the vocabulary words.',
        question: 'What tool should students use to write?',
        options: [
          { id: 'opt-1', text: 'A blue pen', isCorrect: true },
          { id: 'opt-2', text: 'Scissors', isCorrect: false },
          { id: 'opt-3', text: 'A calculator only', isCorrect: false }
        ],
        explanation: 'The teacher said: "take your blue pen, and write down".'
      }
    ],
    vocabularyChallenge: [
      {
        id: 'vocab-book',
        word: 'Book',
        phonetic: '/bʊk/',
        definition: 'A written or printed work consisting of pages.',
        exampleSentence: 'I read an English book.',
        audioHint: 'Rhymes with "look".'
      }
    ],
    sentenceBuilder: [
      {
        id: 'sb-school-1',
        instruction: 'Assemble this school sentence:',
        targetSentence: 'My favorite subject is English',
        scrambledWords: ['is', 'English', 'favorite', 'subject', 'My'],
        hint: 'Start with "My favorite".'
      }
    ],
    aiRoleplayScenario: {
      id: 'ai-roleplay-school',
      scenarioTitle: 'First Day of Language Class',
      aiRole: 'Mr. Harrison, an encouraging English teacher',
      contextDescription: 'Mr. Harrison welcomes you to the language lab and asks what you hope to learn.',
      initialAIGreeting: 'Welcome to our English class! I am delighted to meet you. What is your favorite thing to learn?',
      suggestedStudentStarters: [
        'I love practicing speaking and listening.',
        'My favorite subject is English.',
        'I want to speak with international friends.'
      ]
    },
    speakingMission: {
      id: 'mission-school',
      missionTitle: 'Share Your Learning Goals',
      promptQuestion: 'Talk about what you study, your favorite subject, and why learning English is important to you.',
      sampleGoodAnswer: 'My favorite subject is English. I practice speaking every day because I want to communicate with people all around the world.',
      teacherEncouragement: 'Learning a language is an adventure. Be proud of every new word you learn!'
    }
  },

  // ==============================================================================
  // TOPIC 10: JOBS AND OCCUPATIONS
  // ==============================================================================
  {
    id: 'jobs-occupations',
    title: 'Jobs and Occupations',
    titleUz: 'Kasblar va mutaxassisliklar',
    subtitle: 'Learn common professions, workplaces, and talking about dream careers.',
    subtitleUz: 'Kasblar, ish joylari va kelajakdagi orzu qilingan kasblar haqida gapirishni o‘rganing.',
    level: 'A1',
    levelGroup: 'Level 2',
    learningObjective: 'Learn profession vocabulary, workplaces, and express what job you do or want to do.',
    learningObjectiveUz: 'Kasb nomlari va ish joylarini o‘rganib, kim bo‘lib ishlash yoki ishlashni orzu qilishni aytish.',
    iconName: 'user',
    color: 'teal',
    audioInstruction: 'Welcome to Topic 10: Jobs and Occupations. Learn words for doctors, teachers, engineers, chefs, and workplaces.',
    audioInstructionUz: '10-mavzuga xush kelibsiz: Kasblar va mutaxassisliklar. Shifokor, o‘qituvchi, muhandis, oshpaz va ish joylarini o‘rganasiz.',
    lessons: [
      {
        id: 'jobs-l1',
        title: 'Lesson 1: Everyday Professions',
        titleUz: '1-dars: Kundalik kasblar',
        lessonNumber: 1,
        category: 'vocabulary',
        description: 'Well-known jobs in healthcare, education, and services.',
        descriptionUz: 'Ta’lim, tibbiyot va xizmat ko‘rsatish sohasidagi asosiy kasblar.',
        items: [
          'Teacher — O‘qituvchi / Ustoz',
          'Doctor — Shifokor / Vrach',
          'Nurse — Hamshira',
          'Engineer — Muhandis',
          'Builder — Quruvchi',
          'Driver — Haydovchi',
          'Chef / Cook — Oshpaz',
          'Farmer — Fermer / Dehqon',
          'Police officer — Politsiya xodimi',
          'Firefighter — O‘t o‘chiruvchi',
          'Pilot — Uchuvchi',
          'Lawyer — Huquqshunos / Advokat'
        ],
        itemsUz: [
          'O‘qituvchi',
          'Shifokor',
          'Hamshira',
          'Muhandis',
          'Quruvchi',
          'Haydovchi',
          'Oshpaz',
          'Fermer',
          'Politsiya xodimi',
          'O‘t o‘chiruvchi',
          'Uchuvchi',
          'Huquqshunos'
        ],
        vocabulary: [
          { english: 'Teacher', uzbek: 'O‘qituvchi', phonetic: '/ˈtiː.tʃɚ/', exampleSentence: 'A teacher helps students learn.', exampleSentenceUz: 'O‘qituvchi o‘quvchilarga o‘rganishda yordam beradi.' },
          { english: 'Doctor', uzbek: 'Shifokor', phonetic: '/ˈdɑːk.tɚ/', exampleSentence: 'The doctor cares for sick people.', exampleSentenceUz: 'Shifokor bemorlarni davolaydi.' },
          { english: 'Engineer', uzbek: 'Muhandis', phonetic: '/ˌen.dʒɪˈnɪr/', exampleSentence: 'An engineer designs modern bridges.', exampleSentenceUz: 'Muhandis zamonaviy ko‘priklarni loyihalashtiradi.' },
          { english: 'Chef', uzbek: 'Oshpaz', phonetic: '/ʃef/', exampleSentence: 'The chef cooks tasty food.', exampleSentenceUz: 'Oshpaz mazali taomlar pishiradi.' }
        ]
      },
      {
        id: 'jobs-l2',
        title: 'Lesson 2: Workplaces and Tools',
        titleUz: '2-dars: Ish joylari va asboblar',
        lessonNumber: 2,
        category: 'vocabulary',
        description: 'Where different professionals work and tools they use.',
        descriptionUz: 'Har xil kasb egalari ishlaydigan joylar va vositalar.',
        items: [
          'Hospital — Shifoxona / Kasalxona',
          'School — Maktab',
          'Office — Idora / Ofis',
          'Restaurant — Restoran',
          'Farm — Fermer xo‘jaligi / Dala',
          'Airport — Aeroport',
          'Bank — Bank',
          'Library — Kutubxona',
          'Factory — Zavod / Fabrika',
          'Computer — Kompyuter',
          'Uniform — Maxsus forma'
        ],
        itemsUz: [
          'Shifoxona',
          'Maktab',
          'Idora / Ofis',
          'Restoran',
          'Dala / Ferma',
          'Aeroport',
          'Bank',
          'Kutubxona',
          'Zavod',
          'Kompyuter',
          'Maxsus forma'
        ],
        vocabulary: [
          { english: 'Hospital', uzbek: 'Shifoxona', phonetic: '/ˈhɑː.spɪ.t̬əl/', exampleSentence: 'Doctors work at the hospital.', exampleSentenceUz: 'Shifokorlar shifoxonada ishlaydi.' },
          { english: 'Office', uzbek: 'Ofis', phonetic: '/ˈɑː.fɪs/', exampleSentence: 'She works in a quiet office.', exampleSentenceUz: 'U tinch ofisda ishlaydi.' }
        ]
      },
      {
        id: 'jobs-l3',
        title: 'Lesson 3: Talking About Jobs and Careers',
        titleUz: '3-dars: Kasblar haqida gapirish qoliplari',
        lessonNumber: 3,
        category: 'sentences',
        description: 'Sentences: "I am a...", "I work at...", "I want to be a...".',
        descriptionUz: '"Men ... bo‘lib ishlayman", "Men kelajakda ... bo‘lmoqchiman" qoliplari.',
        items: [
          'I am a teacher. — Men o‘qituvchiman.',
          'She works at a hospital. — U kasalxonada ishlaydi.',
          'I want to be an engineer. — Men muhandis bo‘lishni xohlayman.',
          'My father is a doctor. — Otam shifokor.'
        ],
        itemsUz: [
          'Men o‘qituvchiman.',
          'U kasalxonada ishlaydi.',
          'Men muhandis bo‘lmoqchiman.',
          'Otam shifokor.'
        ],
        sentences: [
          {
            english: 'I want to be a teacher.',
            uzbek: 'Men o‘qituvchi bo‘lishni xohlayman.',
            patternRule: 'I want to be a/an + [Profession]',
            substitutions: {
              slotName: 'Profession',
              options: [
                { en: 'teacher', uz: 'o‘qituvchi' },
                { en: 'doctor', uz: 'shifokor' },
                { en: 'engineer', uz: 'muhandis' },
                { en: 'chef', uz: 'oshpaz' },
                { en: 'pilot', uz: 'uchuvchi' }
              ]
            }
          },
          {
            english: 'She works at a school.',
            uzbek: 'U maktabda ishlaydi.',
            patternRule: 'He/She works at a + [Place]',
            substitutions: {
              slotName: 'Workplace',
              options: [
                { en: 'school', uz: 'maktabda' },
                { en: 'hospital', uz: 'shifoxonada' },
                { en: 'restaurant', uz: 'restoranda' },
                { en: 'bank', uz: 'bankda' }
              ]
            }
          }
        ]
      },
      {
        id: 'jobs-l4',
        title: 'Lesson 4: Listening and Speaking Practice',
        titleUz: '4-dars: Tinglash va gapirish amaliyoti',
        lessonNumber: 4,
        category: 'practice',
        description: 'Conversation asking what someone does for work.',
        descriptionUz: 'Kasb haqida savol-javob suhbati.',
        items: [
          'A: What do you do for work? — Nima kasb bilan shug‘ullanasiz?',
          'B: I am a teacher. I teach English to students. — Men o‘qituvchiman. Talabalarga ingliz tilidan dars beraman.',
          'A: That is wonderful! Where do you teach? — Ajoyib! Qayerda dars berasiz?',
          'B: I teach at a friendly school in Tashkent. — Toshkentdagi maktabda dars beraman.'
        ],
        itemsUz: [
          'A: Nima kasb bilan shug‘ullanasiz?',
          'B: O‘qituvchiman, ingliz tilidan dars beraman.',
          'A: Ajoyib! Qayerda dars berasiz?',
          'B: Toshkentdagi maktabda dars beraman.'
        ],
        dialogue: [
          { speaker: 'Anna', text: 'What is your dream job, David?' },
          { speaker: 'David', text: 'I want to be an engineer and work with modern technology.' },
          { speaker: 'Anna', text: 'That sounds exciting! My mother is a doctor at a hospital.' },
          { speaker: 'David', text: 'Doctors do noble work helping people.' }
        ]
      }
    ],
    dialogue: [
      { speaker: 'Anna', text: 'What is your dream job, David?' },
      { speaker: 'David', text: 'I want to be an engineer and work with modern technology.' },
      { speaker: 'Anna', text: 'That sounds exciting! My mother is a doctor at a hospital.' },
      { speaker: 'David', text: 'Doctors do noble work helping people.' }
    ],
    speakingActivities: [
      'Name 4 different jobs in English.',
      'State what job you do or what you want to be.',
      'Tell where a doctor or teacher works.',
      'Practice asking someone: "What do you do?".',
      'Record an audio story about your dream career.'
    ],
    prompts: [
      {
        id: 'jobs-q1',
        question: 'What is your job, or what job do you want to have in the future?',
        questionUz: 'Kasbingiz nima yoki kelajakda qaysi kasb egasi bo‘lishni xohlaysiz?',
        sentenceStarters: ['I am a...', 'In the future, I want to be a...', 'I work at a...'],
        exampleAnswer: 'In the future, I want to be a teacher because I love helping beginner students learn English.',
        teacherTip: 'Remember: use "a" before consonant sounds ("a doctor") and "an" before vowel sounds ("an engineer").'
      }
    ],
    completionMessage: 'Congratulations! You completed Topic 10: Jobs and Occupations. You have completed Level 2!',
    completionMessageUz: 'Tabriklaymiz! Siz 10-mavzuni tugatdingiz va 2-bosqichni muvaffaqiyatli yakunladingiz!',
    listenAndChoose: [
      {
        id: 'jobs-lc1',
        audioPrompt: 'Farrukh works at a large hospital in Samarkand. He is a doctor and helps patients feel better.',
        question: 'What is Farrukh’s profession?',
        options: [
          { id: 'opt-1', text: 'A doctor', isCorrect: true },
          { id: 'opt-2', text: 'A pilot', isCorrect: false },
          { id: 'opt-3', text: 'A chef only', isCorrect: false }
        ],
        explanation: 'Farrukh works at a hospital and is a doctor.'
      }
    ],
    vocabularyChallenge: [
      {
        id: 'vocab-doctor',
        word: 'Doctor',
        phonetic: '/ˈdɑːk.tɚ/',
        definition: 'A person qualified to treat people who are ill.',
        exampleSentence: 'The doctor is helpful.',
        audioHint: 'Doc-tor.'
      }
    ],
    sentenceBuilder: [
      {
        id: 'sb-jobs-1',
        instruction: 'Assemble this job sentence:',
        targetSentence: 'I want to be an engineer',
        scrambledWords: ['engineer', 'be', 'want', 'I', 'an', 'to'],
        hint: 'Start with "I want to be".'
      }
    ],
    aiRoleplayScenario: {
      id: 'ai-roleplay-jobs',
      scenarioTitle: 'Career Day Discussion',
      aiRole: 'Victor, a career counselor',
      contextDescription: 'Victor asks about your skills and career interests.',
      initialAIGreeting: 'Hello! What field or job are you most passionate about?',
      suggestedStudentStarters: [
        'I am interested in teaching English.',
        'I want to be an engineer working with computers.',
        'I want to help people as a healthcare professional.'
      ]
    },
    speakingMission: {
      id: 'mission-jobs',
      missionTitle: 'My Dream Career',
      promptQuestion: 'Talk about your dream job: say what profession you want, where you want to work, and why.',
      sampleGoodAnswer: 'My dream is to be an English teacher. I want to work at a school and help blind and low-vision learners speak English with confidence.',
      teacherEncouragement: 'Speak with passion! Your goals and dreams inspire others.'
    }
  }
];
