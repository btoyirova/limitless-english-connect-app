import { ConversationTopic } from '../types';

export const LEVEL_4_TOPICS: ConversationTopic[] = [
  // ==============================================================================
  // TOPIC 16: TRAVEL AND HOLIDAYS
  // ==============================================================================
  {
    id: 'travel-holidays',
    title: 'Travel and Holidays',
    titleUz: 'Sayohat va ta’tillar',
    subtitle: 'Learn luggage, airports, historical travel, and holiday conversations.',
    subtitleUz: 'Sayohat anjomlari, aeroport, poyezdlar, tarixiy shaharlar va ta’til haqida gapiring.',
    level: 'A2',
    levelGroup: 'Level 4',
    learningObjective: 'Learn travel essentials and transit words first, then plan and describe holiday trips.',
    learningObjectiveUz: 'Sayohat so‘zlari va transport atamalarini o‘rganib, ta’til rejalari haqida gapirish.',
    iconName: 'compass',
    color: 'blue',
    audioInstruction: 'Welcome to Topic 16: Travel and Holidays. Learn words for passports, tickets, flights, Samarkand, Bukhara, and planning a dream trip.',
    audioInstructionUz: '16-mavzuga xush kelibsiz: Sayohat va ta’tillar. Pasport, chipta, samolyot, Samarqand, Buxoro va orzudagi sayohatni rejalashtirishni o‘rganasiz.',
    lessons: [
      {
        id: 'travel-l1',
        title: 'Lesson 1: Travel Essentials and Luggage',
        titleUz: '1-dars: Sayohat anjomlari va yuklar',
        lessonNumber: 1,
        category: 'vocabulary',
        description: 'Crucial items you pack and prepare for any journey.',
        descriptionUz: 'Har bir sayohatga tayyorlanadigan va olinadigan zarur buyumlar.',
        items: [
          'Passport — Xorijga chiqish pasporti',
          'Ticket — Chipta',
          'Suitcase / Luggage — Chamadon / Yuk',
          'Backpack — Ryukzak',
          'Hotel — Mehmonxona',
          'Reservation — Band qilish / Bron',
          'Tourist — Sayyoh',
          'Map — Xarita',
          'Camera — Fotoapparat',
          'Souvenir — Esdalik sovg‘asi',
          'Guide — Gid / Yo‘lboshlovchi',
          'Journey / Trip — Sayohat'
        ],
        itemsUz: [
          'Pasport',
          'Chipta',
          'Chamadon / Yuk',
          'Ryukzak',
          'Mehmonxona',
          'Band qilish',
          'Sayyoh',
          'Xarita',
          'Fotoapparat',
          'Esdalik sovg‘asi',
          'Gid',
          'Sayohat'
        ],
        vocabulary: [
          { english: 'Passport', uzbek: 'Pasport', phonetic: '/ˈpæs.pɔːrt/', exampleSentence: 'Keep your passport in a safe pocket.', exampleSentenceUz: 'Pasportingizni xavfsiz cho‘ntakda saqlang.' },
          { english: 'Ticket', uzbek: 'Chipta', phonetic: '/ˈtɪk.ɪt/', exampleSentence: 'I have my train ticket on my phone.', exampleSentenceUz: 'Poyezd chiptam telefonimda bor.' },
          { english: 'Suitcase', uzbek: 'Chamadon', phonetic: '/ˈsuːt.keɪs/', exampleSentence: 'Pack your clothes in the suitcase.', exampleSentenceUz: 'Kiyimlaringizni chamadonga joylang.' }
        ]
      },
      {
        id: 'travel-l2',
        title: 'Lesson 2: Transit, Stations and Airports',
        titleUz: '2-dars: Aeroport, vokzal va poyezdlar',
        lessonNumber: 2,
        category: 'vocabulary',
        description: 'Words used at airports, high-speed rail stations, and terminals.',
        descriptionUz: 'Aeroportlar, tezyurar poyezd bekatlari va vokzallarda ishlatiladigan so‘zlar.',
        items: [
          'Airport — Aeroport',
          'Flight — Parvoz / Reys',
          'Gate — Chiqish darvozasi / Geyt',
          'Boarding pass — Samolyotga chiqish taloni',
          'Train station — Temir yo‘l vokzali',
          'Platform — Peron / Platforma',
          'Fast train / Afrosiyob — Tezyurar poyezd',
          'Departure — Jo‘nab ketish',
          'Arrival — Yetib kelish',
          'Delay — Kechikish'
        ],
        itemsUz: [
          'Aeroport',
          'Parvoz / Reys',
          'Chiqish darvozasi',
          'Chiqish taloni',
          'Temir yo‘l vokzali',
          'Platforma',
          'Tezyurar poyezd',
          'Jo‘nab ketish',
          'Yetib kelish',
          'Kechikish'
        ],
        vocabulary: [
          { english: 'Flight', uzbek: 'Parvoz', phonetic: '/flaɪt/', exampleSentence: 'Our flight departs at two o\'clock.', exampleSentenceUz: 'Parvozimiz soat ikkida jo‘naydi.' },
          { english: 'Fast train', uzbek: 'Tezyurar poyezd', phonetic: '/fæst treɪn/', exampleSentence: 'The Afrosiyob fast train travels to Samarkand.', exampleSentenceUz: 'Afrosiyob tezyurar poyezdi Samarqandga boradi.' }
        ]
      },
      {
        id: 'travel-l3',
        title: 'Lesson 3: Holiday Activities and Sightseeing',
        titleUz: '3-dars: Sayyohlik va ta’til mashg‘ulotlari',
        lessonNumber: 3,
        category: 'vocabulary',
        description: 'Enjoyable activities while exploring new cities and monuments.',
        descriptionUz: 'Yangi shaharlar va tarixiy obidalarni tomosha qilish.',
        items: [
          'Sightseeing — Diqqatga sazovor joylarni tomosha qilish',
          'Visiting monuments — Tarixiy obidalarni ziyorat qilish',
          'Taking photos — Suratga olish',
          'Relaxing — Hordiq chiqarish',
          'Trying local food — Mahalliy taomlarni tatib ko‘rish',
          'Walking in the old city — Qadimiy ko‘chalarda sayr qilish',
          'Buying souvenirs — Esdalik sovg‘alari xarid qilish'
        ],
        itemsUz: [
          'Tarixiy joylarni tomosha qilish',
          'Obidalarni ziyorat qilish',
          'Suratga olish',
          'Hordiq chiqarish',
          'Mahalliy taomlarni tatib ko‘rish',
          'Qadimiy ko‘chalarda sayr qilish',
          'Esdalik sovg‘alari xarid qilish'
        ],
        vocabulary: [
          { english: 'Sightseeing', uzbek: 'Tarixiy joylarni tomosha qilish', phonetic: '/ˈsaɪtˌsiː.ɪŋ/', exampleSentence: 'We love sightseeing in Bukhara.', exampleSentenceUz: 'Biz Buxoroda tarixiy joylarni tomosha qilishni sevamiz.' }
        ]
      },
      {
        id: 'travel-l4',
        title: 'Lesson 4: Planning and Talking About Trips',
        titleUz: '4-dars: Sayohatni rejalashtirish qoliplari',
        lessonNumber: 4,
        category: 'sentences',
        description: 'Sentence structures: "I am traveling to...", "We will visit...".',
        descriptionUz: 'Sayohat rejalari haqida gapirish qoliplari.',
        items: [
          'I am traveling to Samarkand next week. — Men keyingi hafta Samarqandga sayohat qilyapman.',
          'We will visit ancient monuments and historic squares. — Biz qadimiy obidalar va tarixiy maydonlarni ziyorat qilamiz.',
          'I have my ticket and suitcase ready. — Chiptam va chamadonim tayyor.',
          'Have a safe and pleasant journey! — Oq yo‘l, sayohatingiz maroqli o‘tsin!'
        ],
        itemsUz: [
          'Keyingi hafta Samarqandga sayohat qilyapman.',
          'Qadimiy obidalarni ziyorat qilamiz.',
          'Chiptam va chamadonim tayyor.',
          'Oq yo‘l, sayohatingiz maroqli o‘tsin!'
        ],
        sentences: [
          {
            english: 'I am traveling to Samarkand.',
            uzbek: 'Men Samarqandga sayohat qilyapman.',
            patternRule: 'I am traveling to + [Destination]',
            substitutions: {
              slotName: 'City',
              options: [
                { en: 'Samarkand', uz: 'Samarqandga' },
                { en: 'Bukhara', uz: 'Buxoroga' },
                { en: 'Khiva', uz: 'Xivaga' },
                { en: 'London', uz: 'Londonga' }
              ]
            }
          },
          {
            english: 'Have a safe journey!',
            uzbek: 'Oq yo‘l, sog‘-omon boring!'
          }
        ]
      },
      {
        id: 'travel-l5',
        title: 'Lesson 5: Listening and Speaking Practice',
        titleUz: '5-dars: Tinglash va gapirish amaliyoti',
        lessonNumber: 5,
        category: 'practice',
        description: 'Dialogue between two friends planning a weekend vacation.',
        descriptionUz: 'Dam olish kunlari sayohatini rejalashtirayotgan do‘stlar suhbati.',
        items: [
          'A: Where are you planning to go for your holiday? — Ta’tilda qayerga borishni rejalashtiryapsiz?',
          'B: I am taking the fast train to Samarkand to see the Registan! — Registonni ko‘rish uchun tezyurar poyezdda Samarqandga boryapman!',
          'A: That is wonderful! Have you booked your hotel? — Ajoyib-ku! Mehmonxonani band qildingizmi?',
          'B: Yes, everything is ready. I will bring back nice souvenirs! — Ha, hammasi tayyor. Ajoyib esdalik sovg‘alari olib kelaman!'
        ],
        itemsUz: [
          'A: Ta’tilda qayerga borishni rejalashtiryapsiz?',
          'B: Tezyurar poyezdda Samarqandga boryapman!',
          'A: Mehmonxona band qildingizmi?',
          'B: Ha, esdalik sovg‘alari olib kelaman!'
        ],
        dialogue: [
          { speaker: 'Anna', text: 'Where are you going for your holiday, David?' },
          { speaker: 'David', text: 'I am traveling to Bukhara by train. I want to see the historic minarets.' },
          { speaker: 'Anna', text: 'How long will you stay there?' },
          { speaker: 'David', text: 'I will stay for three days and enjoy local food and crafts.' }
        ]
      }
    ],
    dialogue: [
      { speaker: 'Anna', text: 'Where are you going for your holiday, David?' },
      { speaker: 'David', text: 'I am traveling to Bukhara by train. I want to see the historic minarets.' },
      { speaker: 'Anna', text: 'How long will you stay there?' },
      { speaker: 'David', text: 'I will stay for three days and enjoy local food and crafts.' }
    ],
    speakingActivities: [
      'Name 3 travel essentials in English (e.g. passport, ticket).',
      'Name a historical city you want to visit.',
      'Practice saying: "I am traveling to... next month".',
      'Wish your partner: "Have a safe journey!".',
      'Record an audio story about your favorite trip.'
    ],
    prompts: [
      {
        id: 'travel-q1',
        question: 'Where would you love to travel for a dream holiday and what will you do there?',
        questionUz: 'Orzuyingizdagi ta’tilda qayerga sayohat qilishni xohlardingiz va u yerda nimalar qilasiz?',
        sentenceStarters: ['For my dream holiday, I would travel to...', 'I want to see...', 'I will travel by...'],
        exampleAnswer: 'For my dream holiday, I would travel to ancient Samarkand by fast train. I want to visit Registan Square and try delicious traditional bread.',
        teacherTip: 'Describe how you travel (by train, by plane) and what sights you will see.'
      }
    ],
    completionMessage: 'Well done! You finished Topic 16: Travel and Holidays. You can now plan and discuss travel in English.',
    completionMessageUz: 'Barakalla! Siz 16-mavzuni tugatdingiz. Sayohat va ta’tillar haqida chiroyli gapira olasiz.',
    listenAndChoose: [
      {
        id: 'travel-lc1',
        audioPrompt: 'David is taking the Afrosiyob fast train from Tashkent to Samarkand on Friday morning.',
        question: 'How is David traveling to Samarkand?',
        options: [
          { id: 'opt-1', text: 'By fast train', isCorrect: true },
          { id: 'opt-2', text: 'On a bicycle only', isCorrect: false },
          { id: 'opt-3', text: 'On foot through mountains', isCorrect: false }
        ],
        explanation: 'David is taking the "Afrosiyob fast train".'
      }
    ],
    vocabularyChallenge: [
      {
        id: 'vocab-passport',
        word: 'Passport',
        phonetic: '/ˈpæs.pɔːrt/',
        definition: 'An official document issued by a government certifying identity for travel.',
        exampleSentence: 'Show your passport at the gate.',
        audioHint: 'Pass-port.'
      }
    ],
    sentenceBuilder: [
      {
        id: 'sb-travel-1',
        instruction: 'Assemble this travel sentence:',
        targetSentence: 'I am traveling to Samarkand by train',
        scrambledWords: ['Samarkand', 'train', 'to', 'traveling', 'am', 'by', 'I'],
        hint: 'Start with "I am traveling".'
      }
    ],
    aiRoleplayScenario: {
      id: 'ai-roleplay-travel',
      scenarioTitle: 'Booking a Historical Train Excursion',
      aiRole: 'Dilshod, a tourism desk agent',
      contextDescription: 'You are asking Dilshod about train times to Samarkand or Bukhara.',
      initialAIGreeting: 'Good day! Welcome to Uzbekistan Railway Tours. Which historic city would you like to explore?',
      suggestedStudentStarters: [
        'I would like to travel to Samarkand, please.',
        'What time does the fast train leave?',
        'I have my ticket and passport ready.'
      ]
    },
    speakingMission: {
      id: 'mission-travel',
      missionTitle: 'Plan a Dream Vacation',
      promptQuestion: 'Describe your dream trip: name the city, the transport, who you will travel with, and one thing you want to see.',
      sampleGoodAnswer: 'My dream trip is traveling to historic Khiva by train with my family. I want to walk through the ancient fortress streets and take beautiful photographs.',
      teacherEncouragement: 'Travel opens our eyes and connects us with people of all backgrounds!'
    }
  },

  // ==============================================================================
  // TOPIC 17: TECHNOLOGY AND DIGITAL WORLD
  // ==============================================================================
  {
    id: 'technology-digital',
    title: 'Technology and Digital World',
    titleUz: 'Texnologiya va raqamli olam',
    subtitle: 'Learn devices, internet tools, voice tech, accessibility, and digital life.',
    subtitleUz: 'Qurilmalar, internet, ovozli texnologiyalar, qulaylik va raqamli hayot.',
    level: 'A2',
    levelGroup: 'Level 4',
    learningObjective: 'Learn digital and assistive technology words, then express how tech empowers communication and learning.',
    learningObjectiveUz: 'Raqamli va ovozli texnologiya so‘zlarini o‘rganib, ularning ta’limdagi ahamiyati haqida gapirish.',
    iconName: 'sparkles',
    color: 'blue',
    audioInstruction: 'Welcome to Topic 17: Technology and Digital World. Learn words for smartphones, computers, voice apps, accessibility, and online practice.',
    audioInstructionUz: '17-mavzuga xush kelibsiz: Texnologiya va raqamli olam. Smartfon, kompyuter, ovozli dasturlar va qulay texnologiyalarni o‘rganasiz.',
    lessons: [
      {
        id: 'tech-l1',
        title: 'Lesson 1: Everyday Digital Devices',
        titleUz: '1-dars: Kundalik raqamli qurilmalar',
        lessonNumber: 1,
        category: 'vocabulary',
        description: 'Hardware tools we touch and listen to every single day.',
        descriptionUz: 'Har kuni foydalaniladigan asosiy texnik qurilmalar.',
        items: [
          'Computer — Kompyuter',
          'Laptop — Noutbuk',
          'Smartphone / Mobile phone — Smartfon / Telefon',
          'Tablet — Planshet',
          'Headphones / Earphones — Quloqchin / Naushnik',
          'Screen — Ekran',
          'Keyboard — Klaviatura',
          'Charger — Zaryadlovchi qurilma',
          'Battery — Batareya / Akkumulyator',
          'Microphone — Mikrofon',
          'Speaker — Karnay / Kolonka',
          'Volume — Ovoz balandligi'
        ],
        itemsUz: [
          'Kompyuter',
          'Noutbuk',
          'Smartfon / Telefon',
          'Planshet',
          'Quloqchin',
          'Ekran',
          'Klaviatura',
          'Zaryadlovchi',
          'Batareya',
          'Mikrofon',
          'Karnay',
          'Ovoz balandligi'
        ],
        vocabulary: [
          { english: 'Headphones', uzbek: 'Quloqchin', phonetic: '/ˈhed.foʊnz/', exampleSentence: 'Put on your headphones for clear audio.', exampleSentenceUz: 'Ovozni tiniq eshitish uchun quloqchin taqing.' },
          { english: 'Microphone', uzbek: 'Mikrofon', phonetic: '/ˈmaɪ.krə.foʊn/', exampleSentence: 'Speak into the microphone to record.', exampleSentenceUz: 'Yozib olish uchun mikrofonga gapiring.' }
        ]
      },
      {
        id: 'tech-l2',
        title: 'Lesson 2: Internet, Apps and Actions',
        titleUz: '2-dars: Internet, ilovalar va harakatlar',
        lessonNumber: 2,
        category: 'vocabulary',
        description: 'Online services, messages, and digital actions.',
        descriptionUz: 'Onlayn xizmatlar, xabarlar va raqamli harakatlar.',
        items: [
          'Internet — Internet tarmog‘i',
          'Website — Veb-sayt',
          'Application / App — Ilova / Dastur',
          'Voice message — Ovozli xabar',
          'Audio call — Ovozli qo‘ng‘iroq',
          'Send — Yuborish / Jo‘natish',
          'Receive — Qabul qilish',
          'Download — Yuklab olish',
          'Online — Tarmoqda / Onlayn',
          'Search — Qidirish'
        ],
        itemsUz: [
          'Internet',
          'Veb-sayt',
          'Ilova',
          'Ovozli xabar',
          'Ovozli qo‘ng‘iroq',
          'Yuborish',
          'Qabul qilish',
          'Yuklab olish',
          'Onlayn',
          'Qidirish'
        ],
        vocabulary: [
          { english: 'Voice message', uzbek: 'Ovozli xabar', phonetic: '/vɔɪs ˈmes.ɪdʒ/', exampleSentence: 'I sent an audio message to my speaking partner.', exampleSentenceUz: 'Muloqot sherigimga ovozli xabar yubordim.' }
        ]
      },
      {
        id: 'tech-l3',
        title: 'Lesson 3: Accessible Technology and Voice Tools',
        titleUz: '3-dars: Qulay va ovozli texnologiyalar',
        lessonNumber: 3,
        category: 'vocabulary',
        description: 'Assistive audio tools for blind and low-vision learners.',
        descriptionUz: 'Ko‘zi ojiz va zaif ko‘ruvchi talabalar uchun qulay ovozli vositalar.',
        items: [
          'Screen reader — Ekran o‘quvchi dastur',
          'Voice assistant — Ovozli yordamchi',
          'Audio narration — Ovozli bayon',
          'Large text — Katta shrift',
          'High contrast — Yuqori kontrast',
          'Accessibility — Qulaylik / Maxsus imkoniyat',
          'Speech — Nutq / Ovoz',
          'Sound effect — Ovoz effekti'
        ],
        itemsUz: [
          'Ekran o‘quvchi dastur',
          'Ovozli yordamchi',
          'Ovozli bayon',
          'Katta shrift',
          'Yuqori kontrast',
          'Maxsus qulaylik',
          'Nutq',
          'Ovoz effekti'
        ],
        vocabulary: [
          { english: 'Screen reader', uzbek: 'Ekran o‘quvchi', phonetic: '/skriːn ˈriː.dɚ/', exampleSentence: 'A screen reader reads text aloud.', exampleSentenceUz: 'Ekran o‘quvchi matnni ovoz chiqarib o‘qiydi.' }
        ]
      },
      {
        id: 'tech-l4',
        title: 'Lesson 4: Talking About Everyday Technology',
        titleUz: '4-dars: Texnologiyadan foydalanish qoliplari',
        lessonNumber: 4,
        category: 'sentences',
        description: 'Expressing how technology helps you study and communicate.',
        descriptionUz: 'Texnologiyaning o‘rganish va muloqotdagi foydasi haqida gapirish.',
        items: [
          'I use my smartphone to learn English. — Men ingliz tilini o‘rganish uchun smartfonimdan foydalanaman.',
          'Audio lessons help me practice listening. — Ovozli darslar tinglab tushunishni mashq qilishimga yordam beradi.',
          'Can you send me a voice message? — Menga ovozli xabar yubora olasizmi?'
        ],
        itemsUz: [
          'Ingliz tilini o‘rganish uchun smartfondan foydalanaman.',
          'Ovozli darslar tinglashni mashq qilishga yordam beradi.',
          'Menga ovozli xabar yubora olasizmi?'
        ],
        sentences: [
          {
            english: 'I use my smartphone to study English.',
            uzbek: 'Men ingliz tilini o‘rganish uchun smartfonimdan foydalanaman.',
            patternRule: 'I use my [Device] to [Action]',
            substitutions: {
              slotName: 'Device & Purpose',
              options: [
                { en: 'smartphone to study English', uz: 'ingliz tilini o‘rganish uchun smartfondan' },
                { en: 'headphones to listen to audio', uz: 'ovoz eshitish uchun quloqchindan' },
                { en: 'computer to practice typing', uz: 'yozishni mashq qilish uchun kompyuterdan' }
              ]
            }
          }
        ]
      },
      {
        id: 'tech-l5',
        title: 'Lesson 5: Listening and Speaking Practice',
        titleUz: '5-dars: Tinglash va gapirish amaliyoti',
        lessonNumber: 5,
        category: 'practice',
        description: 'Dialogue about connecting with a study partner using voice technology.',
        descriptionUz: 'Ovozli dasturlar orqali sherik bilan bog‘lanish suhbati.',
        items: [
          'A: How do you practice English on your phone? — Telefoningizda ingliz tilini qanday mashq qilasiz?',
          'B: I listen to Limitless English audio lessons and record voice messages for my partner! — Limitless English ovozli darslarini tinglayman va sherigimga xabar yuboraman!',
          'A: That is brilliant! Technology makes learning accessible for everyone. — Juda ajoyib! Texnologiya ta’limni hamma uchun qulay qiladi.'
        ],
        itemsUz: [
          'A: Telefondan qanday mashq qilasiz?',
          'B: Ovozli darslarni tinglayman va sherigimga xabar yuboraman!',
          'A: Texnologiya ta’limni hamma uchun qulay qiladi.'
        ],
        dialogue: [
          { speaker: 'Anna', text: 'What digital device do you use most often, David?' },
          { speaker: 'David', text: 'I use my smartphone with headphones. It reads lessons aloud to me.' },
          { speaker: 'Anna', text: 'Accessible technology is truly empowering!' },
          { speaker: 'David', text: 'Yes, it allows blind and low-vision learners to study with joy and independence.' }
        ]
      }
    ],
    dialogue: [
      { speaker: 'Anna', text: 'What digital device do you use most often, David?' },
      { speaker: 'David', text: 'I use my smartphone with headphones. It reads lessons aloud to me.' },
      { speaker: 'Anna', text: 'Accessible technology is truly empowering!' },
      { speaker: 'David', text: 'Yes, it allows blind and low-vision learners to study with joy and independence.' }
    ],
    speakingActivities: [
      'Name 3 digital devices you use in English.',
      'Explain how you use headphones or your phone for learning.',
      'Practice saying: "I send voice messages to my partner".',
      'Describe one accessible tool that helps you.',
      'Record an audio reflection on how technology helps you learn.'
    ],
    prompts: [
      {
        id: 'tech-q1',
        question: 'How does technology and audio learning help you study English every day?',
        questionUz: 'Texnologiya va ovozli ta’lim har kuni ingliz tilini o‘rganishingizga qanday yordam beradi?',
        sentenceStarters: ['Technology helps me by...', 'I use my headphones to...', 'Audio lessons are great because...'],
        exampleAnswer: 'Technology helps me learn independently. I use my smartphone and headphones to listen to clear English audio and record my answers.',
        teacherTip: 'Mention devices you actually use: phone, headphones, microphone.'
      }
    ],
    completionMessage: 'Well done! You finished Topic 17: Technology and Digital World. You can now talk about tech tools and accessibility.',
    completionMessageUz: 'Barakalla! Siz 17-mavzuni tugatdingiz. Raqamli qurilmalar va qulayliklar haqida erkin gapira olasiz.',
    listenAndChoose: [
      {
        id: 'tech-lc1',
        audioPrompt: 'The student uses headphones and a screen reader to listen to English audio lessons every morning.',
        question: 'What does the student use to listen to lessons?',
        options: [
          { id: 'opt-1', text: 'Headphones and a screen reader', isCorrect: true },
          { id: 'opt-2', text: 'A paper dictionary only', isCorrect: false },
          { id: 'opt-3', text: 'A silent chalkboard', isCorrect: false }
        ],
        explanation: 'The speaker stated: "The student uses headphones and a screen reader".'
      }
    ],
    vocabularyChallenge: [
      {
        id: 'vocab-headphones',
        word: 'Headphones',
        phonetic: '/ˈhed.foʊnz/',
        definition: 'A pair of earphones joined by a band placed over the head.',
        exampleSentence: 'I listen with headphones.',
        audioHint: 'Head-phones.'
      }
    ],
    sentenceBuilder: [
      {
        id: 'sb-tech-1',
        instruction: 'Assemble this technology sentence:',
        targetSentence: 'I use my smartphone to learn English',
        scrambledWords: ['smartphone', 'English', 'my', 'learn', 'I', 'to', 'use'],
        hint: 'Start with "I use my smartphone".'
      }
    ],
    aiRoleplayScenario: {
      id: 'ai-roleplay-tech',
      scenarioTitle: 'Audio Technology Exchange',
      aiRole: 'Zoe, an accessibility specialist',
      contextDescription: 'Zoe is asking how you customize your audio settings for the best learning experience.',
      initialAIGreeting: 'Hi! I am working on making digital tools accessible. How do you prefer listening to English?',
      suggestedStudentStarters: [
        'I use headphones and clear audio speech.',
        'Audio narration helps me understand pronunciation.',
        'I like repeating sentences into the microphone.'
      ]
    },
    speakingMission: {
      id: 'mission-tech',
      missionTitle: 'My Technology Learning Story',
      promptQuestion: 'Share your technology routine: describe your device, what audio apps you use, and how you practice speaking.',
      sampleGoodAnswer: 'Every morning, I use my smartphone and headphones to open Limitless English. I listen to new words, repeat them aloud, and record voice messages for my speaking partner.',
      teacherEncouragement: 'You are using modern technology to achieve educational greatness. Be proud!'
    }
  },

  // ==============================================================================
  // TOPIC 18: CELEBRATING HOLIDAYS AND TRADITIONS
  // ==============================================================================
  {
    id: 'holidays-traditions',
    title: 'Celebrating Holidays and Traditions',
    titleUz: 'Bayramlar va milliy an’analar',
    subtitle: 'Learn Navruz, New Year, celebrations, festive dishes, and warm wishes.',
    subtitleUz: 'Navro‘z, Yangi yil, milliy taomlar, an’analar va samimiy tilaklar.',
    level: 'A2',
    levelGroup: 'Level 4',
    learningObjective: 'Learn holiday names and festive traditions first, then practice greeting and wishing well in English.',
    learningObjectiveUz: 'Bayramlar va an’ana so‘zlarini o‘rganib, inglizcha tabrik va ezgu tilaklar bildirish.',
    iconName: 'sparkles',
    color: 'amber',
    audioInstruction: 'Welcome to Topic 18: Celebrating Holidays and Traditions. Learn words for Navruz, New Year, Eid, cooking sumalak, and festive wishes.',
    audioInstructionUz: '18-mavzuga xush kelibsiz: Bayramlar va an’analar. Navro‘z, Yangi yil, sumalak pishirish va bayram tabriklarini o‘rganasiz.',
    lessons: [
      {
        id: 'holiday-l1',
        title: 'Lesson 1: Major Holidays and Festivities',
        titleUz: '1-dars: Asosiy bayramlar va tantanalar',
        lessonNumber: 1,
        category: 'vocabulary',
        description: 'Important holidays celebrated with family and friends.',
        descriptionUz: 'Oila va do‘stlar davrasida nishonlanadigan asosiy bayramlar.',
        items: [
          'Holiday — Bayram',
          'Navruz — Navro‘z (bahoriy tengkunlik bayrami)',
          'New Year — Yangi yil',
          'Eid / Hayit — Hayit ayyomi',
          'Independence Day — Mustaqillik kuni',
          'Teachers\' Day — O‘qituvchilar kuni',
          'Birthday — Tug‘ilgan kun',
          'Festival — Sayil / Festival',
          'Celebration — Tantanali nishonlash',
          'Tradition — Milliy an’ana'
        ],
        itemsUz: [
          'Bayram',
          'Navro‘z',
          'Yangi yil',
          'Hayit ayyomi',
          'Mustaqillik kuni',
          'O‘qituvchilar kuni',
          'Tug‘ilgan kun',
          'Sayil / Festival',
          'Tantanali nishonlash',
          'Milliy an’ana'
        ],
        vocabulary: [
          { english: 'Navruz', uzbek: 'Navro‘z', phonetic: '/nævˈruːz/', exampleSentence: 'Navruz celebrates the coming of spring.', exampleSentenceUz: 'Navro‘z bahor fasli kirib kelishini nishonlaydi.' },
          { english: 'Celebration', uzbek: 'Tantana', phonetic: '/ˌsel.əˈbreɪ.ʃən/', exampleSentence: 'A joyful family celebration.', exampleSentenceUz: 'Quvnoq oilaviy tantana.' }
        ]
      },
      {
        id: 'holiday-l2',
        title: 'Lesson 2: Customs, Guests and Festive Foods',
        titleUz: '2-dars: Urf-odatlar, mehmondo‘stlik va bayram taomlari',
        lessonNumber: 2,
        category: 'vocabulary',
        description: 'Hospitality customs, preparing sumalak, and gifts.',
        descriptionUz: 'Mehmondo‘stlik odatlari, sumalak pishirish va sovg‘alar.',
        items: [
          'Guest — Mehmon',
          'Host — Mezbon',
          'Hospitality — Mehmondo‘stlik',
          'Gift / Present — Sovg‘a',
          'Sumalak — Sumalak (bahoriy shirin taom)',
          'Festive pilaf — To‘y oshi / Bayramona palov',
          'Sweets / Halva — Shirinliklar / Holva',
          'Music and dance — Musiqa va raqs',
          'Family gathering — Oilaviy jam bo‘lish',
          'Blessing — Duo / Oq fotiha'
        ],
        itemsUz: [
          'Mehmon',
          'Mezbon',
          'Mehmondo‘stlik',
          'Sovg‘a',
          'Sumalak',
          'Bayramona palov',
          'Shirinliklar',
          'Musiqa va raqs',
          'Oilaviy jam bo‘lish',
          'Oq fotiha'
        ],
        vocabulary: [
          { english: 'Sumalak', uzbek: 'Sumalak', phonetic: '/suː.məˈlɑːk/', exampleSentence: 'Neighbors cook sumalak together all night.', exampleSentenceUz: 'Qo‘shnilar tun bo‘yi birgalikda sumalak pishirishadi.' },
          { english: 'Hospitality', uzbek: 'Mehmondo‘stlik', phonetic: '/ˌhɑː.spɪˈtæl.ə.t̬i/', exampleSentence: 'Uzbek hospitality is legendary worldwide.', exampleSentenceUz: 'O‘zbek mehmondo‘stligi butun dunyoda mashhur.' }
        ]
      },
      {
        id: 'holiday-l3',
        title: 'Lesson 3: Holiday Wishes and Greetings',
        titleUz: '3-dars: Bayram tabriklari va ezgu tilaklar',
        lessonNumber: 3,
        category: 'sentences',
        description: 'How to greet people and wish joy on special occasions.',
        descriptionUz: 'Ayyomlarda odamlarni tabriklash va ezgu tilaklar aytish.',
        items: [
          'Happy Navruz! — Navro‘z bayramingiz muborak bo‘lsin!',
          'Happy New Year! — Yangi yilingiz bilan!',
          'Happy Birthday! — Tug‘ilgan kuningiz muborak!',
          'I wish you good health and joy. — Sizga sihat-salomatlik va quvonch tilayman.',
          'May peace and happiness fill your home! — Uyingiz tinchlik va baxtga to‘lsin!'
        ],
        itemsUz: [
          'Navro‘z bayramingiz muborak bo‘lsin!',
          'Yangi yilingiz bilan!',
          'Tug‘ilgan kuningiz muborak!',
          'Sizga salomatlik va quvonch tilayman.',
          'Uyingiz tinchlik va baxtga to‘lsin!'
        ],
        sentences: [
          {
            english: 'Happy Navruz to you and your family!',
            uzbek: 'Siz va oilangizga Navro‘z muborak bo‘lsin!',
            patternRule: 'Happy [Holiday] to you and your family!',
            substitutions: {
              slotName: 'Holiday',
              options: [
                { en: 'Navruz', uz: 'Navro‘z' },
                { en: 'New Year', uz: 'Yangi yil' },
                { en: 'Eid', uz: 'Hayit' }
              ]
            }
          },
          {
            english: 'I wish you happiness and health.',
            uzbek: 'Sizga baxt va mustahkam sog‘lik tilayman.'
          }
        ]
      },
      {
        id: 'holiday-l4',
        title: 'Lesson 4: Listening and Speaking Practice',
        titleUz: '4-dars: Tinglash va gapirish amaliyoti',
        lessonNumber: 4,
        category: 'practice',
        description: 'Celebratory holiday conversation and exchange of greetings.',
        descriptionUz: 'Bayramona suhbat va o‘zaro tabriklar almashish.',
        items: [
          'A: Happy Navruz, David! How does your family celebrate? — Navro‘z muborak, David! Oilangiz qanday nishonlaydi?',
          'B: Happy Navruz, Anna! We cook sumalak, welcome guests, and eat festive pilaf! — Navro‘z muborak, Anna! Sumalak pishiramiz, mehmon kutamiz va palov yeymiz!',
          'A: That sounds so delicious and warm. I wish you wonderful happiness! — Juda mazali va iliq eshitilyapti. Sizga katta baxt tilayman!'
        ],
        itemsUz: [
          'A: Navro‘z muborak! Qanday nishonlaysiz?',
          'B: Sumalak pishiramiz, mehmon kutamiz!',
          'A: Sizga katta baxt tilayman!'
        ],
        dialogue: [
          { speaker: 'Anna', text: 'Happy Navruz, David! What is your favorite holiday tradition?' },
          { speaker: 'David', text: 'Happy Navruz, Anna! My favorite tradition is gathering with our relatives to stir the sumalak pot.' },
          { speaker: 'Anna', text: 'Traditions like that keep families close and joyful.' }
        ]
      }
    ],
    dialogue: [
      { speaker: 'Anna', text: 'Happy Navruz, David! What is your favorite holiday tradition?' },
      { speaker: 'David', text: 'Happy Navruz, Anna! My favorite tradition is gathering with our relatives to stir the sumalak pot.' },
      { speaker: 'Anna', text: 'Traditions like that keep families close and joyful.' }
    ],
    speakingActivities: [
      'Name 3 major holidays in Uzbekistan in English.',
      'Wish someone a happy holiday: "Happy Navruz to you!".',
      'Describe your favorite festive food.',
      'Say one positive wish: "I wish you good health and peace".',
      'Record an audio greeting wishing your speaking partner well.'
    ],
    prompts: [
      {
        id: 'holiday-q1',
        question: 'What is your favorite holiday of the year, and how does your family celebrate it?',
        questionUz: 'Yilning eng sevimli bayrami qaysi va oilangiz uni qanday nishonlaydi?',
        sentenceStarters: ['My favorite holiday is...', 'We celebrate by...', 'We prepare delicious...'],
        exampleAnswer: 'My favorite holiday is Navruz. We celebrate by making sweet sumalak, welcoming relatives, and wishing each other peace and health.',
        teacherTip: 'Describe traditions, foods, and festive feelings.'
      }
    ],
    completionMessage: 'Well done! You finished Topic 18: Celebrating Holidays and Traditions. You can now share festive greetings in English.',
    completionMessageUz: 'Barakalla! Siz 18-mavzuni tugatdingiz. Bayramlar va ezgu tilaklarni inglizcha ayta olasiz.',
    listenAndChoose: [
      {
        id: 'holiday-lc1',
        audioPrompt: 'On Navruz morning, all neighbors gather in the courtyard to cook sweet sumalak and share warm holiday wishes.',
        question: 'What do neighbors cook together on Navruz morning?',
        options: [
          { id: 'opt-1', text: 'Sweet sumalak', isCorrect: true },
          { id: 'opt-2', text: 'Ice cream only', isCorrect: false },
          { id: 'opt-3', text: 'Fast food burgers', isCorrect: false }
        ],
        explanation: 'The speaker said: "cook sweet sumalak and share warm holiday wishes".'
      }
    ],
    vocabularyChallenge: [
      {
        id: 'vocab-navruz',
        word: 'Navruz',
        phonetic: '/nævˈruːz/',
        definition: 'The Persian and Central Asian new year celebration of the spring equinox.',
        exampleSentence: 'Happy Navruz to all!',
        audioHint: 'Nav-ruz.'
      }
    ],
    sentenceBuilder: [
      {
        id: 'sb-holiday-1',
        instruction: 'Assemble this holiday greeting:',
        targetSentence: 'Happy Navruz to you and your family',
        scrambledWords: ['family', 'to', 'your', 'Navruz', 'Happy', 'you', 'and'],
        hint: 'Start with "Happy Navruz".'
      }
    ],
    aiRoleplayScenario: {
      id: 'ai-roleplay-holidays',
      scenarioTitle: 'Sharing Spring Festival Traditions',
      aiRole: 'Sofia, an international student exchange host',
      contextDescription: 'Sofia is fascinated by cultural spring festivals and asks about Navruz.',
      initialAIGreeting: 'Hello! I heard spring is a magical celebration time in your country. What holiday do you celebrate?',
      suggestedStudentStarters: [
        'We celebrate Navruz, the festival of spring and renewal.',
        'We prepare sumalak and invite all our relatives.',
        'Happy Navruz to you from Uzbekistan!'
      ]
    },
    speakingMission: {
      id: 'mission-holidays',
      missionTitle: 'Holiday Celebration Greeting',
      promptQuestion: 'Share a holiday greeting: explain the holiday, what foods you eat, and express three warm wishes.',
      sampleGoodAnswer: 'Happy Navruz! In Uzbekistan, we celebrate spring with delicious sumalak and fragrant pilaf. I wish you peace, good health, and abundant joy!',
      teacherEncouragement: 'Sharing cultural traditions with pride builds bridges of international friendship.'
    }
  },

  // ==============================================================================
  // TOPIC 19: ENVIRONMENT AND NATURE CARE
  // ==============================================================================
  {
    id: 'environment-nature',
    title: 'Environment and Protecting Our Planet',
    titleUz: 'Atrof-muhit va tabiatni asrash',
    subtitle: 'Learn natural resources, clean air, green habits, and protecting nature.',
    subtitleUz: 'Tabiiy boyliklar, toza havo, suvni tejash va tabiatni muhofaza qilish.',
    level: 'A2',
    levelGroup: 'Level 4',
    learningObjective: 'Learn environmental vocabulary and green actions, then express eco-friendly tips with "We should...".',
    learningObjectiveUz: 'Tabiatni muhofaza qilish so‘zlarini o‘rganib, "Biz ... qilishimiz kerak" qolipida ekologik maslahat berish.',
    iconName: 'heart',
    color: 'emerald',
    audioInstruction: 'Welcome to Topic 19: Environment and Protecting Our Planet. Learn words for clean water, planting trees, saving energy, and caring for nature.',
    audioInstructionUz: '19-mavzuga xush kelibsiz: Atrof-muhitni asrash. Toza suv, daraxt ekish, energiyani tejash va tabiatga g‘amxo‘rlik qilishni o‘rganasiz.',
    lessons: [
      {
        id: 'env-l1',
        title: 'Lesson 1: Natural Resources and Earth Elements',
        titleUz: '1-dars: Tabiiy boyliklar va Yer elementlari',
        lessonNumber: 1,
        category: 'vocabulary',
        description: 'Core natural resources that sustain life on Earth.',
        descriptionUz: 'Yer yuzida hayotni ta’minlaydigan asosiy tabiiy manbalar.',
        items: [
          'Earth / Planet — Yer sayyorasi',
          'Nature — Tabiat',
          'Clean air — Toza havo',
          'Fresh water — Chuchuk / Toza suv',
          'Soil / Land — Tuproq / Yer',
          'Plant — O‘simlik',
          'Tree — Daraxt',
          'Forest — O‘rmon',
          'Sunlight — Quyosh nuri',
          'Energy — Energiya / Quvvat'
        ],
        itemsUz: [
          'Yer sayyorasi',
          'Tabiat',
          'Toza havo',
          'Toza suv',
          'Tuproq',
          'O‘simlik',
          'Daraxt',
          'O‘rmon',
          'Quyosh nuri',
          'Energiya'
        ],
        vocabulary: [
          { english: 'Clean air', uzbek: 'Toza havo', phonetic: '/kliːn er/', exampleSentence: 'Trees produce clean air.', exampleSentenceUz: 'Daraxtlar toza havo ishlab chiqaradi.' },
          { english: 'Plant', uzbek: 'O‘simlik / Ekmoq', phonetic: '/plænt/', exampleSentence: 'We plant young trees in spring.', exampleSentenceUz: 'Bahorda yosh ko‘chatlar ekamiz.' }
        ]
      },
      {
        id: 'env-l2',
        title: 'Lesson 2: Green Habits and Environmental Care',
        titleUz: '2-dars: Yashil odatlar va g‘amxo‘rlik',
        lessonNumber: 2,
        category: 'vocabulary',
        description: 'Everyday actions that protect our soil, water, and communities.',
        descriptionUz: 'Suv, havo va mahallamizni toza saqlashdagi odatlar.',
        items: [
          'Protect — Asrash / Himoya qilish',
          'Plant trees — Daraxtlar ekish',
          'Save water — Suvni tejash',
          'Turn off lights — Chiroqni o‘chirish',
          'Recycle — Qayta ishlash',
          'Reuse — Qayta foydalanish',
          'Clean up — Tozalash',
          'Eco-friendly — Ekologik toza',
          'Trash / Litter — Chiqindi / Axlat',
          'Care for nature — Tabiatga g‘amxo‘rlik qilish'
        ],
        itemsUz: [
          'Asrash',
          'Daraxt ekish',
          'Suvni tejash',
          'Chiroqni o‘chirish',
          'Qayta ishlash',
          'Qayta foydalanish',
          'Tozalash',
          'Ekologik toza',
          'Chiqindi',
          'Tabiatga g‘amxo‘rlik'
        ],
        vocabulary: [
          { english: 'Protect', uzbek: 'Himoya qilish', phonetic: '/prəˈtekt/', exampleSentence: 'We must protect our planet.', exampleSentenceUz: 'Biz sayyoramizni asrashimiz zarur.' },
          { english: 'Save water', uzbek: 'Suvni tejash', phonetic: '/seɪv ˈwɑː.t̬ɚ/', exampleSentence: 'Save water when washing.', exampleSentenceUz: 'Yuvinayotganda suvni tejang.' }
        ]
      },
      {
        id: 'env-l3',
        title: 'Lesson 3: Giving Advice with "We Should..."',
        titleUz: '3-dars: "Biz ... qilishimiz kerak" qolipida maslahat berish',
        lessonNumber: 3,
        category: 'sentences',
        description: 'Constructing eco-friendly guidance sentences for our community.',
        descriptionUz: 'Atrof-muhitni asrash bo‘yicha ijobiy maslahatlar berish.',
        items: [
          'We should plant more green trees. — Biz ko‘proq yashil daraxtlar ekishimiz kerak.',
          'We should save fresh water every day. — Biz har kuni toza suvni tejashimiz kerak.',
          'Please do not throw litter on the ground. — Iltimos, yerga chiqindi tashlamang.',
          'Keeping our city clean brings health and happiness. — Shahrimizni toza saqlash salomatlik va quvonch keltiradi.'
        ],
        itemsUz: [
          'Ko‘proq daraxtlar ekishimiz kerak.',
          'Har kuni toza suvni tejashimiz kerak.',
          'Yerga chiqindi tashlamang.',
          'Shaharni toza saqlash salomatlik keltiradi.'
        ],
        sentences: [
          {
            english: 'We should plant more trees.',
            uzbek: 'Biz ko‘proq daraxtlar ekishimiz kerak.',
            patternRule: 'We should + [Green Action]',
            substitutions: {
              slotName: 'Green Action',
              options: [
                { en: 'plant more trees', uz: 'ko‘proq daraxtlar ekish' },
                { en: 'save clean water', uz: 'toza suvni tejash' },
                { en: 'keep our parks clean', uz: 'bog‘larimizni toza saqlash' },
                { en: 'turn off unneeded lights', uz: 'ortiqcha chiroqlarni o‘chirish' }
              ]
            }
          }
        ]
      },
      {
        id: 'env-l4',
        title: 'Lesson 4: Listening and Speaking Practice',
        titleUz: '4-dars: Tinglash va gapirish amaliyoti',
        lessonNumber: 4,
        category: 'practice',
        description: 'Dialogue about community tree planting and keeping parks clean.',
        descriptionUz: 'Ko‘chat ekish va mahallani obodonlashtirish suhbati.',
        items: [
          'A: What can we do to help our environment? — Atrof-muhitga yordam berish uchun nima qila olamiz?',
          'B: We can plant new trees and always save water at home! — Yangi daraxtlar ekishimiz va uyda doimo suvni tejashimiz mumkin!',
          'A: That is wonderful. In spring, our whole neighborhood plants flowers and trees together. — Juda ajoyib. Bahorda butun mahallamiz birgalikda daraxt va gul ekadi.'
        ],
        itemsUz: [
          'A: Atrof-muhitga qanday yordam bera olamiz?',
          'B: Yangi daraxtlar ekishimiz va suvni tejashimiz mumkin!',
          'A: Bahorda mahallamiz birgalikda daraxt ekadi.'
        ],
        dialogue: [
          { speaker: 'Anna', text: 'How do you care for nature in your neighborhood, David?' },
          { speaker: 'David', text: 'Every spring, we plant fruit trees and clean our local parks.' },
          { speaker: 'Anna', text: 'That is inspiring! Small positive actions make a huge difference.' }
        ]
      }
    ],
    dialogue: [
      { speaker: 'Anna', text: 'How do you care for nature in your neighborhood, David?' },
      { speaker: 'David', text: 'Every spring, we plant fruit trees and clean our local parks.' },
      { speaker: 'Anna', text: 'That is inspiring! Small positive actions make a huge difference.' }
    ],
    speakingActivities: [
      'Name 3 ways people can protect nature in English.',
      'Use the phrase "We should..." to give an eco-friendly tip.',
      'Explain why clean water and trees are important.',
      'Practice saying: "Keep our planet green and clean".',
      'Record an audio tip about protecting the environment.'
    ],
    prompts: [
      {
        id: 'env-q1',
        question: 'What simple daily habits can you and your family practice to care for the environment?',
        questionUz: 'Tabiatni asrash uchun siz va oilangiz qanday oddiy kundalik odatlarga amal qilasiz?',
        sentenceStarters: ['To protect nature, we should...', 'At home, I save...', 'Planting trees helps...'],
        exampleAnswer: 'To protect nature, we should save clean water, turn off lights when leaving the room, and plant green trees in spring.',
        teacherTip: 'Use simple positive action verbs: save, plant, protect, clean.'
      }
    ],
    completionMessage: 'Well done! You finished Topic 19: Environment and Protecting Our Planet. You can now advocate for a clean Earth in English.',
    completionMessageUz: 'Barakalla! Siz 19-mavzuni tugatdingiz. Tabiatni asrash bo‘yicha inglizcha maslahatlar bera olasiz.',
    listenAndChoose: [
      {
        id: 'env-lc1',
        audioPrompt: 'Every spring, students and teachers plant fruit trees in the school garden to create clean air and shade.',
        question: 'What do students and teachers plant in the school garden?',
        options: [
          { id: 'opt-1', text: 'Fruit trees', isCorrect: true },
          { id: 'opt-2', text: 'Plastic bags', isCorrect: false },
          { id: 'opt-3', text: 'Computers only', isCorrect: false }
        ],
        explanation: 'The speaker stated: "plant fruit trees in the school garden".'
      }
    ],
    vocabularyChallenge: [
      {
        id: 'vocab-nature',
        word: 'Nature',
        phonetic: '/ˈneɪ.tʃɚ/',
        definition: 'The phenomena of the physical world collectively, including plants and animals.',
        exampleSentence: 'Care for green nature.',
        audioHint: 'Na-ture.'
      }
    ],
    sentenceBuilder: [
      {
        id: 'sb-env-1',
        instruction: 'Assemble this eco-friendly advice:',
        targetSentence: 'We should plant more green trees',
        scrambledWords: ['plant', 'should', 'green', 'trees', 'We', 'more'],
        hint: 'Start with "We should".'
      }
    ],
    aiRoleplayScenario: {
      id: 'ai-roleplay-environment',
      scenarioTitle: 'Community Tree Planting Day',
      aiRole: 'Nodira, a green neighborhood organizer',
      contextDescription: 'Nodira is welcoming volunteers to plant green seedlings in the neighborhood park.',
      initialAIGreeting: 'Welcome to Tree Planting Saturday! Are you ready to make our neighborhood greener?',
      suggestedStudentStarters: [
        'Yes! We should plant fruit trees and flowers.',
        'I want to help water the new seedlings.',
        'Protecting nature makes our city beautiful.'
      ]
    },
    speakingMission: {
      id: 'mission-environment',
      missionTitle: 'Eco-Hero Speech',
      promptQuestion: 'Deliver a short motivational speech about taking care of nature: share two simple green tips everyone can do.',
      sampleGoodAnswer: 'Nature is our shared home! We should save fresh water every day and plant trees in our gardens. When we care for the Earth, our future becomes bright and healthy!',
      teacherEncouragement: 'Caring for our planet is caring for all humanity. Your words carry real hope!'
    }
  },

  // ==============================================================================
  // TOPIC 20: DREAMS, FUTURE GOALS AND LIFE PLANS
  // ==============================================================================
  {
    id: 'dreams-future-goals',
    title: 'Dreams, Future Goals and Life Plans',
    titleUz: 'Orzular, maqsadlar va kelajak rejalari',
    subtitle: 'Learn goal-setting, future plans, "I will", and delivering your graduation vision.',
    subtitleUz: 'Maqsad qo‘yish, "Men ... qilaman" qoliplari va yakuniy bitiruv nutqi.',
    level: 'A2 (Course Milestone)',
    levelGroup: 'Level 4',
    learningObjective: 'Learn ambition and future words first, then construct "I will" and "I want to" vision statements for your graduation.',
    learningObjectiveUz: 'Orzu va maqsad so‘zlarini o‘rganib, "Men ... qilaman" va "Men ... xohlayman" qoliplarida kelajak rejalari haqida gapirish.',
    iconName: 'star',
    color: 'amber',
    audioInstruction: 'Welcome to Topic 20: Dreams, Future Goals and Life Plans. The milestone graduation topic of Limitless English Connect! Learn to speak about your ambitions, plans, and vision for the future.',
    audioInstructionUz: '20-mavzuga xush kelibsiz: Orzular va kelajak maqsadlari. Kursimizning yakuniy bitiruv mavzusi! Kelajak rejalaringiz va orzularingizni inglizcha bayon qilishni o‘rganasiz.',
    lessons: [
      {
        id: 'goals-l1',
        title: 'Lesson 1: Ambitions and Dream Vocabulary',
        titleUz: '1-dars: Orzular va maqsadlar lug‘ati',
        lessonNumber: 1,
        category: 'vocabulary',
        description: 'Inspiring words for ambitions, goals, and personal growth.',
        descriptionUz: 'Orzu, maqsad va shaxsiy rivojlanish uchun ilhomlantiruvchi so‘zlar.',
        items: [
          'Dream — Orzu',
          'Goal — Maqsad',
          'Future — Kelajak',
          'Plan — Reja',
          'Success — Muvaffaqiyat / Zafar',
          'Education — Ta’lim',
          'University — Universitet',
          'Career — Kasbiy faoliyat / Karyera',
          'Confidence — Ishonch',
          'Hope — Umid',
          'Hard work — Mashaqqatli mehnat',
          'Achieve — Erishmoq / Qo‘lga kiritmoq'
        ],
        itemsUz: [
          'Orzu',
          'Maqsad',
          'Kelajak',
          'Reja',
          'Muvaffaqiyat',
          'Ta’lim',
          'Universitet',
          'Kasbiy faoliyat',
          'Ishonch',
          'Umid',
          'Mashaqqatli mehnat',
          'Erishmoq'
        ],
        vocabulary: [
          { english: 'Dream', uzbek: 'Orzu', phonetic: '/driːm/', exampleSentence: 'Follow your dream with courage.', exampleSentenceUz: 'Orzuingiz sari jasorat bilan intiling.' },
          { english: 'Goal', uzbek: 'Maqsad', phonetic: '/ɡoʊl/', exampleSentence: 'My goal is to speak fluent English.', exampleSentenceUz: 'Mening maqsadim ravon inglizcha gapirish.' },
          { english: 'Achieve', uzbek: 'Erishmoq', phonetic: '/əˈtʃiːv/', exampleSentence: 'With practice, you will achieve success.', exampleSentenceUz: 'Mashq bilan siz muvaffaqiyatga erishasiz.' }
        ]
      },
      {
        id: 'goals-l2',
        title: 'Lesson 2: Action Verbs for Personal Growth',
        titleUz: '2-dars: Maqsadga erishish harakat fe’llari',
        lessonNumber: 2,
        category: 'vocabulary',
        description: 'Dynamic verbs that describe working toward your future.',
        descriptionUz: 'Kelajak sari qadam qo‘yishda ishlatiladigan harakat fe’llari.',
        items: [
          'Learn — O‘rganmoq',
          'Study — O‘qimoq / Tahsil olmoq',
          'Practice — Mashq qilmoq',
          'Speak fluently — Ravon gapirmoq',
          'Help others — Boshqalarga yordam bermoq',
          'Build — Qurmoq / Yaratmoq',
          'Inspire — Ilhomlantirmoq',
          'Grow — O‘smoq / Rivojlanmoq',
          'Travel the world — Dunyo bo‘ylab sayohat qilmoq'
        ],
        itemsUz: [
          'O‘rganmoq',
          'O‘qimoq',
          'Mashq qilmoq',
          'Ravon gapirmoq',
          'Boshqalarga yordam bermoq',
          'Qurmoq',
          'Ilhomlantirmoq',
          'Rivojlanmoq',
          'Dunyo bo‘ylab sayohat qilmoq'
        ],
        vocabulary: [
          { english: 'Speak fluently', uzbek: 'Ravon gapirmoq', phonetic: '/spiːk ˈfluː.ənt.li/', exampleSentence: 'I will speak English fluently.', exampleSentenceUz: 'Men ingliz tilida ravon gapiraman.' }
        ]
      },
      {
        id: 'goals-l3',
        title: 'Lesson 3: Future Statements with "I Will" and "I Want To"',
        titleUz: '3-dars: Kelajak gaplari ("I will" va "I want to")',
        lessonNumber: 3,
        category: 'sentences',
        description: 'Constructing confident future declarations and goals.',
        descriptionUz: 'Kelajakdagi maqsadlarni ishonch bilan aytish qoliplari.',
        items: [
          'In the future, I will speak fluent English. — Kelajakda men ravon inglizcha gapiraman.',
          'I want to travel around the world. — Men butun dunyo bo‘ylab sayohat qilishni xohlayman.',
          'My goal is to help other students learn. — Mening maqsadim boshqa talabalarga o‘rganishda yordam berish.',
          'Hard work brings great success! — Mashaqqatli mehnat katta muvaffaqiyat keltiradi!'
        ],
        itemsUz: [
          'Kelajakda ravon inglizcha gapiraman.',
          'Dunyo bo‘ylab sayohat qilishni xohlayman.',
          'Maqsadim boshqalarga yordam berish.',
          'Mehnat katta muvaffaqiyat keltiradi!'
        ],
        sentences: [
          {
            english: 'In the future, I will speak fluent English.',
            uzbek: 'Kelajakda men ravon inglizcha gapiraman.',
            patternRule: 'In the future, I will + [Action]',
            substitutions: {
              slotName: 'Future Action',
              options: [
                { en: 'speak fluent English', uz: 'ravon inglizcha gapirish' },
                { en: 'travel to London', uz: 'Londonga sayohat qilish' },
                { en: 'help beginner learners', uz: 'boshlang‘ich o‘quvchilarga yordam berish' },
                { en: 'enter a great university', uz: 'katta universitetga kirish' }
              ]
            }
          },
          {
            english: 'I want to achieve my dreams.',
            uzbek: 'Men o‘z orzularimga erishmoqchiman.'
          }
        ]
      },
      {
        id: 'goals-l4',
        title: 'Lesson 4: Final Graduation Vision and Speaking Practice',
        titleUz: '4-dars: Yakuniy bitiruv nutqi va suhbat amaliyoti',
        lessonNumber: 4,
        category: 'practice',
        description: 'Celebrate completing all 20 curriculum topics with an inspiring dialogue.',
        descriptionUz: 'Barcha 20 ta mavzuni tugatganingizni nishonlovchi ilhomlantiruvchi suhbat.',
        items: [
          'Teacher Bahora: Congratulations on reaching Topic 20! What is your biggest future goal? — 20-mavzuga yetib kelganingiz bilan tabriklayman! Eng katta maqsadingiz nima?',
          'Student: Thank you Teacher Bahora! My goal is to speak English with friends worldwide and help my community. — Rahmat ustoz Bahora! Maqsadim butun dunyodagi do‘stlar bilan inglizcha gaplashish va jamiyatimga yordam berish.',
          'Teacher Bahora: You have worked with such courage and heart. Limitless English is so proud of you! — Siz katta jasorat va mehr bilan o‘rgandingiz. Biz siz bilan cheksiz faxrlanamiz!'
        ],
        itemsUz: [
          'Ustoz: 20-mavzu bilan tabriklayman! Maqsadingiz nima?',
          'Talaba: Maqsadim dunyo bo‘ylab do‘stlar bilan gaplashish!',
          'Ustoz: Biz siz bilan cheksiz faxrlanamiz!'
        ],
        dialogue: [
          { speaker: 'Teacher Bahora', text: 'Congratulations on finishing all 20 topics in Limitless English Connect!' },
          { speaker: 'David', text: 'Thank you Teacher Bahora! I learned so many words, from greetings to food, health, and dreams.' },
          { speaker: 'Teacher Bahora', text: 'What will you do with your English speaking skills now?' },
          { speaker: 'David', text: 'I will speak with international partners, help new learners, and keep growing every single day!' }
        ]
      }
    ],
    dialogue: [
      { speaker: 'Teacher Bahora', text: 'Congratulations on finishing all 20 topics in Limitless English Connect!' },
      { speaker: 'David', text: 'Thank you Teacher Bahora! I learned so many words, from greetings to food, health, and dreams.' },
      { speaker: 'Teacher Bahora', text: 'What will you do with your English speaking skills now?' },
      { speaker: 'David', text: 'I will speak with international partners, help new learners, and keep growing every single day!' }
    ],
    speakingActivities: [
      'Name 3 of your biggest life goals in English.',
      'Practice saying: "In the future, I will speak fluent English".',
      'Share one person you want to help with your English skills.',
      'Say a heartfelt thank you to your teachers and speaking partners.',
      'Record your grand final graduation speech!'
    ],
    prompts: [
      {
        id: 'goals-q1',
        question: 'What are your future goals and dreams, and how will you use English in your life?',
        questionUz: 'Kelajakdagi orzu va maqsadlaringiz nima va ingliz tilidan hayotingizda qanday foydalanasiz?',
        sentenceStarters: ['My biggest dream is to...', 'In the future, I will...', 'English will help me to...'],
        exampleAnswer: 'My biggest dream is to become an educator and travel the world. In the future, I will speak fluent English and inspire other blind and low-vision learners to achieve their goals.',
        teacherTip: 'Speak with confidence and conviction. Your voice matters to the world!'
      }
    ],
    completionMessage: 'CONGRATULATIONS! You have completed all 20 Topics in Limitless English Connect! You are a Limitless English Champion!',
    completionMessageUz: 'TABRIKLAYMIZ! Siz Limitless English Connect dasturining barcha 20 ta mavzusini to‘liq yakunladingiz! Siz cheksiz imkoniyatlar egasisiz!',
    listenAndChoose: [
      {
        id: 'goals-lc1',
        audioPrompt: 'With hard work and daily practice, the student completed all 20 English topics and will now speak fluently with partners worldwide.',
        question: 'What made the student achieve success across all 20 topics?',
        options: [
          { id: 'opt-1', text: 'Hard work and daily practice', isCorrect: true },
          { id: 'opt-2', text: 'Giving up early', isCorrect: false },
          { id: 'opt-3', text: 'Never listening to audio', isCorrect: false }
        ],
        explanation: 'The speaker said: "With hard work and daily practice, the student completed all 20 English topics".'
      }
    ],
    vocabularyChallenge: [
      {
        id: 'vocab-dream',
        word: 'Dream',
        phonetic: '/driːm/',
        definition: 'A cherished ambition or aspiration.',
        exampleSentence: 'Achieve your dream.',
        audioHint: 'Long "ee" sound.'
      }
    ],
    sentenceBuilder: [
      {
        id: 'sb-goals-1',
        instruction: 'Assemble this milestone future statement:',
        targetSentence: 'In the future I will speak fluent English',
        scrambledWords: ['fluent', 'will', 'future', 'I', 'English', 'In', 'the', 'speak'],
        hint: 'Start with "In the future".'
      }
    ],
    aiRoleplayScenario: {
      id: 'ai-roleplay-graduation',
      scenarioTitle: 'Limitless English Graduation Interview',
      aiRole: 'Dean Eleanor, Global Accessibility Director',
      contextDescription: 'Dean Eleanor congratulates you on graduating through all 20 curriculum topics.',
      initialAIGreeting: 'Congratulations on reaching the final milestone! Looking back across all 20 topics, what are you most proud of?',
      suggestedStudentStarters: [
        'I am proud of speaking English aloud every day.',
        'I learned fruits, family, hobbies, and my future goals.',
        'In the future, I will continue speaking and helping others.'
      ]
    },
    speakingMission: {
      id: 'mission-graduation',
      missionTitle: 'Milestone Graduation Speech',
      promptQuestion: 'Deliver your complete graduation vision speech: celebrate what you have learned, declare your future goals, and send a message of hope to fellow learners.',
      sampleGoodAnswer: 'Hello everyone! Today I celebrate completing all 20 topics in Limitless English Connect. I started with greetings, and now I can talk about my family, my favorite foods, my hobbies, and my dreams. In the future, I will speak fluent English and inspire learners everywhere. Thank you, Teacher Bahora and all my partners! Limitless English is truly for everyone!',
      teacherEncouragement: 'You are our pride and inspiration. May your future be bright, limitless, and full of joy!'
    }
  }
];
