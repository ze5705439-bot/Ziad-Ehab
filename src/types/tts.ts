export type StudioMode = 'single' | 'multi' | 'persona' | 'browser';

export interface TTSVoice {
  name: string;
  gender: 'Female' | 'Male' | 'Androgynous';
  tone: string;
  toneAr: string;
  description: string;
  descriptionAr: string;
  recommendedStyle: string;
  recommendedStyleAr: string;
}

export interface SpeakerTurn {
  id: string;
  speaker: string;
  text: string;
  style?: string;
  voice?: string;
}

export interface SpeakerConfig {
  name: string;
  voice: string;
  roleDescription?: string;
}

export interface SessionTake {
  id: string;
  title: string;
  timestamp: number;
  durationSeconds: number;
  mode: StudioMode;
  model: string;
  voiceName: string;
  textSnippet: string;
  audioWavBase64: string;
  style?: string;
}

export interface PresetScript {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  categoryAr: string;
  mode: StudioMode;
  voice?: string;
  style?: string;
  styleAr?: string;
  text?: string;
  textAr?: string;
  speakers?: SpeakerConfig[];
  turns?: SpeakerTurn[];
  turnsAr?: SpeakerTurn[];
  description: string;
  descriptionAr: string;
}

export const PREBUILT_VOICES: TTSVoice[] = [
  {
    name: 'Kore',
    gender: 'Female',
    tone: 'Warm, natural & clear',
    toneAr: 'دافئ، طبيعي، وناصع الوضوح',
    description: 'Versatile, articulate voice ideal for storytelling, news reading, and guided tutorials.',
    descriptionAr: 'صوت نسائي متعدد الاستخدامات، فصيح ومخارج حروف متقنة، مثالي للرواية والنشرات الإخبارية.',
    recommendedStyle: 'Warm, engaging, and clear',
    recommendedStyleAr: 'نبرة دافئة، تفاعلية، وواضحة جداً'
  },
  {
    name: 'Puck',
    gender: 'Male',
    tone: 'Youthful, energetic & approachable',
    toneAr: 'شبابي، مفعم بالحيوية، وودود',
    description: 'Dynamic and lively tone perfect for podcasts, tech demos, and conversational apps.',
    descriptionAr: 'صوت رجالي حيوي ومرن، رائع لتقديم البودكاست والعروض الترويجية والتقنية الحديثة.',
    recommendedStyle: 'Enthusiastic and conversational',
    recommendedStyleAr: 'نبرة حماسية، عفوية، وإلقاء سريع ومتصل'
  },
  {
    name: 'Charon',
    gender: 'Male',
    tone: 'Deep, resonant & authoritative',
    toneAr: 'رخيم، عميق، وذو هيبة ووقار',
    description: 'Rich low timbre suitable for cinematic trailers, solemn announcements, and dramatic narration.',
    descriptionAr: 'صوت رجالي جهوري ذو طبقة منخفضة فخمة، ممتاز للإعلانات السينمائية والأفلام الوثائقية الجادة.',
    recommendedStyle: 'Deep, confident, and measured',
    recommendedStyleAr: 'نبرة عميقة، واثقة، وإيقاع هادئ رصين'
  },
  {
    name: 'Fenrir',
    gender: 'Male',
    tone: 'Bold, intense & cinematic',
    toneAr: 'قوي، درامي، وشديد التأثير',
    description: 'High-impact voice crafted for game characters, dramatic intros, and urgent broadcasts.',
    descriptionAr: 'صوت ملحمي قوي مخصص للأداء الدرامي المشحون وألعاب الفيديو والمشاهد المشوقة.',
    recommendedStyle: 'Bold, commanding, and epic',
    recommendedStyleAr: 'نبرة آمرة، حاسمة، وأداء ملحمي قوي'
  },
  {
    name: 'Zephyr',
    gender: 'Androgynous',
    tone: 'Crisp, contemporary & precise',
    toneAr: 'معاصر، دقيق، ونبرة عصرية واضحة',
    description: 'Clean modern cadence tailored for AI assistants, navigation systems, and technical explainers.',
    descriptionAr: 'أداء صوتي معاصر شديد الدقة، مثالي لمساعدات الذكاء الاصطناعي وأنظمة الملاحة والشروحات.',
    recommendedStyle: 'Precise, calm, and analytical',
    recommendedStyleAr: 'نبرة دقيقة، هادئة، وتحليلية منضبطة'
  },
  {
    name: 'Aoede',
    gender: 'Female',
    tone: 'Melodic, poetic & expressive',
    toneAr: 'شاعري، عذب، ومفعم بالإحساس',
    description: 'Lyrical and gentle voice designed for audiobooks, poetry, and mindfulness journeys.',
    descriptionAr: 'صوت نسائي ندي ورقيق، ممتاز للكتب الصوتية والقصائد الشعرية وجلسات التأمل والاسترخاء.',
    recommendedStyle: 'Lyrical, soothing, and soft',
    recommendedStyleAr: 'نبرة شجية، هادئة، ومريحة للأعصاب'
  },
  {
    name: 'Leto',
    gender: 'Female',
    tone: 'Gentle, soothing & empathetic',
    toneAr: 'هادئ، مطمئن، ومتعاطف',
    description: 'Soft and patient delivery optimal for meditation, customer support, and children stories.',
    descriptionAr: 'نبرة بالغة الحنان والهدوء، ممتازة لقصص الأطفال وخدمة العملاء الراقية والتهدئة النفسية.',
    recommendedStyle: 'Gentle, serene, and reassuring',
    recommendedStyleAr: 'نبرة مطمئنة، لطيفة، ومفعمة بالراحة'
  }
];

export const STYLE_PRESETS = [
  {
    label: 'Breaking News Anchor',
    labelAr: 'مذيع نشرة أخبار عاجلة',
    value: 'Authoritative, fast-paced, professional prime-time news broadcast in clear standard language',
    valueAr: 'نبرة مذيع أخبار محترف، سريعة ورصينة ومخارج حروف فصيحة وحازمة'
  },
  {
    label: 'Conversational & Friendly',
    labelAr: 'حوار ودي وعفوي',
    value: 'Casual, friendly, upbeat conversation with natural inflections and warm pauses',
    valueAr: 'نبرة ودية وعفوية، دافئة وبسيطة وتصل إلى القلب مباشرة'
  },
  {
    label: 'Dramatic Cinema',
    labelAr: 'إلقاء سينمائي درامي مشوق',
    value: 'Intense, cinematic movie trailer voice with suspense, deep pauses, and gravitas',
    valueAr: 'إلقاء سينمائي درامي عميق مليء بالتشويق والهيبة والوقفات التأثيرية'
  },
  {
    label: 'Mindful Meditation',
    labelAr: 'جلسة تأمل وسكينة عميقة',
    value: 'Soft, gentle, calm whisper-like pace with deep relaxing pauses and smooth breath',
    valueAr: 'نبرة همس هادئة جداً، بطيئة ورقيقة تبعث على الاسترخاء والسكينة التامة'
  },
  {
    label: 'Nature & Science Documentary',
    labelAr: 'وثائقي علمي وطبيعي استكشافي',
    value: 'Curious, poetic, awe-inspired wildlife and science documentary narrator',
    valueAr: 'نبرة معلق وثائقي فصيح، متأمل ومبهور بعظمة الطبيعة والكون'
  },
  {
    label: 'Corporate Keynote',
    labelAr: 'خطاب تقني ملهم وفصيح',
    value: 'Inspiring, clear, poised tech executive keynote address',
    valueAr: 'نبرة قائد ملهم، تجمع بين الثقة والوضوح والحماس الإيجابي'
  },
  {
    label: 'Vintage Radio',
    labelAr: 'بث إذاعي كلاسيكي عتيق',
    value: 'Classic vintage dramatic mystery radio play presenter with rhythmic delivery',
    valueAr: 'إلقاء إذاعي كلاسيكي بنكهة العصر الذهبي للإذاعة والتسجيلات النادرة'
  },
  {
    label: 'Fast Commercial Pitch',
    labelAr: 'إعلان تجاري حماسي سريع',
    value: 'High energy, vibrant, sales promotion announcer with lively excitement',
    valueAr: 'نبرة إعلانية حيوية وجذابة، تنبض بالحماس وتحفز على التفاعل الفوري'
  },
];

export const VOCAL_BURSTS = [
  { tag: '<breath>', label: 'تنفس <breath>', labelEn: 'Breath <breath>', desc: 'شهيق طبيعي مسموع' },
  { tag: '<laugh>', label: 'ضحك <laugh>', labelEn: 'Laugh <laugh>', desc: 'ضحكة خفيفة أو قهقهة' },
  { tag: '<gasp>', label: 'شهقة <gasp>', labelEn: 'Gasp <gasp>', desc: 'شهقة دهشة أو مفاجأة' },
  { tag: '<sigh>', label: 'تنهيدة <sigh>', labelEn: 'Sigh <sigh>', desc: 'تنهيدة راحة أو تأمل' },
  { tag: '<cough>', label: 'سعلة <cough>', labelEn: 'Cough <cough>', desc: 'تنحنح خفيف' },
  { tag: '|yeah|', label: 'تفاعل |yeah|', labelEn: 'Yeah |yeah|', desc: 'تفاعل حواري عفوي' },
  { tag: '|mhm|', label: 'إيماءة |mhm|', labelEn: 'Mhm |mhm|', desc: 'صوت تأكيد وموافقة' },
  { tag: '... ', label: 'سكتة (... )', labelEn: 'Pause (... )', desc: 'سكتة درامية بمقدار ثانية' },
];

export const TASHKEEL_MARKS = [
  { mark: '\u064E', name: 'فَتْحَة', symbol: 'ـَ' },
  { mark: '\u064F', name: 'ضَمَّة', symbol: 'ـُ' },
  { mark: '\u0650', name: 'كَسْرَة', symbol: 'ـِ' },
  { mark: '\u0652', name: 'سُكُون', symbol: 'ـْ' },
  { mark: '\u0651', name: 'شَدَّة', symbol: 'ـّ' },
  { mark: '\u064B', name: 'تَنْوِين فَتْح', symbol: 'ـً' },
  { mark: '\u064C', name: 'تَنْوِين ضَمّ', symbol: 'ـٌ' },
  { mark: '\u064D', name: 'تَنْوِين كَسْر', symbol: 'ـٍ' },
];

export const SAMPLE_SCRIPTS: PresetScript[] = [
  {
    id: 'arabic-news',
    title: 'Breaking Tech & AI News',
    titleAr: 'نشرة الأخبار التقنية العاجلة',
    category: 'News & Media',
    categoryAr: 'نشرات إخبارية وإعلام',
    mode: 'single',
    voice: 'Charon',
    style: 'Authoritative, fast-paced, professional prime-time news broadcast in clear standard language',
    styleAr: 'نبرة مذيع أخبار فصيح، رصينة ومتقنة مخارج الحروف وبإيقاع واثق',
    description: 'Authoritative prime time Arabic news broadcast.',
    descriptionAr: 'نشرة إخبارية فصيحة ومشكولة تبرز قدرة النموذج على الإلقاء الإخباري الرصين.',
    text: `نُحَيِّيكُم فِي هَذِهِ النَّشْرَةِ العَاجِلَةِ مِنْ اسْتُودْيُو فُوكس. <breath> نُعْلِنُ اليَوْمَ عَنْ إِطْلَاقِ الجِيلِ الجَدِيدِ كُلِّيَّاً مِنْ أَنْظِمَةِ الصَّوْتِ العَصَبِيِّ الذَّكِيّ، حَيْثُ تَمْتَزِجُ الفَصَاحَةُ العَرَبِيَّةُ الأَصِيلَةُ بِدِقَّةِ النَّمَاذِجِ اللُّغَوِيَّةِ الفَائِقَة، لِتَمْنَحَكُمْ أَدَاءً بَشَرِيَّاً كَامِلَ المَشَاعِرِ وَالانْفِعَالَات.`,
    textAr: `نُحَيِّيكُم فِي هَذِهِ النَّشْرَةِ العَاجِلَةِ مِنْ اسْتُودْيُو فُوكس. <breath> نُعْلِنُ اليَوْمَ عَنْ إِطْلَاقِ الجِيلِ الجَدِيدِ كُلِّيَّاً مِنْ أَنْظِمَةِ الصَّوْتِ العَصَبِيِّ الذَّكِيّ، حَيْثُ تَمْتَزِجُ الفَصَاحَةُ العَرَبِيَّةُ الأَصِيلَةُ بِدِقَّةِ النَّمَاذِجِ اللُّغَوِيَّةِ الفَائِقَة، لِتَمْنَحَكُمْ أَدَاءً بَشَرِيَّاً كَامِلَ المَشَاعِرِ وَالانْفِعَالَات.`
  },
  {
    id: 'nature-arabic',
    title: 'The Oceanic Cosmos',
    titleAr: 'عجائب أعماق المحيطات',
    category: 'Documentary',
    categoryAr: 'أفلام وثائقية',
    mode: 'single',
    voice: 'Kore',
    style: 'Curious, poetic, awe-inspired wildlife documentary narrator',
    styleAr: 'نبرة معلقة وثائقية شجية، هادئة ومفعمة بالانبهار والجمال الأدبي',
    description: 'Poetic marine wildlife documentary in standard Arabic.',
    descriptionAr: 'إلقاء وثائقي راقٍ يصف عالم الكائنات المضيئة في أعماق البحار.',
    text: `فِي أَعْمَاقِ المُحِيطَاتِ السَّحِيقَة، حَيْثُ لَمْ تَطَأْ قَدَمُ الشَّمْسِ ظُلْمَاتِ القَاع، <breath> يَبْدَأُ عَالَمٌ آخَرُ فِي الاسْتِيقَاظ. انْظُرْ هُنَاك، كَيْفَ تَتَوَهَّجُ الكَائِنَاتُ المُضِيئَةُ بِبَرِيقٍ فَيْرُوزِيٍّ آسِر. كُلُّ وَمْضَةٍ فِي هَذَا السُّكُونِ العَمِيق، هِيَ مَلْحَمَةُ حَيَاةٍ خَالِدَة.`,
    textAr: `فِي أَعْمَاقِ المُحِيطَاتِ السَّحِيقَة، حَيْثُ لَمْ تَطَأْ قَدَمُ الشَّمْسِ ظُلْمَاتِ القَاع، <breath> يَبْدَأُ عَالَمٌ آخَرُ فِي الاسْتِيقَاظ. انْظُرْ هُنَاك، كَيْفَ تَتَوَهَّجُ الكَائِنَاتُ المُضِيئَةُ بِبَرِيقٍ فَيْرُوزِيٍّ آسِر. كُلُّ وَمْضَةٍ فِي هَذَا السُّكُونِ العَمِيق، هِيَ مَلْحَمَةُ حَيَاةٍ خَالِدَة.`
  },
  {
    id: 'arabic-meditation',
    title: 'Inner Sanctuary Meditation',
    titleAr: 'واحة السكينة والتأمل',
    category: 'Wellness',
    categoryAr: 'تأمل واسترخاء',
    mode: 'single',
    voice: 'Aoede',
    style: 'Soft, gentle, whisper-like pace with deep relaxing pauses and smooth breath',
    styleAr: 'نبرة همس رقيقة جداً، ناعمة ومطمئنة لتهدئة الأنفاس وتفريغ التوتر',
    description: 'Mindful breathing session with calm pauses.',
    descriptionAr: 'جلسة تنفس عميق وتأمل مريح تزيل الإجهاد اليومي.',
    text: `أَغْمِضْ عَيْنَيْكَ بِهُدُوء، وَدَعْ عِظَامَ كَتِفَيْكَ تَرْتَخِي تَمَامَاً. <breath> خُذْ نَفَسَاً عَمِيقَاً وَبَطِيئَاً مِنَ الأَنْف ... احْتَفِظْ بِهِ لِثَلَاثِ ثَوَانٍ ... <sigh> ثُمَّ أَطْلِقِ الزَّفِيرَ بِسَلَام. لَيْسَ عَلَيْكَ أَنْ تَقْلَقَ بِشَأْنِ شَيْءٍ الآن، أَنْتَ فِي أَمَانٍ وَسَكِينَة.`,
    textAr: `أَغْمِضْ عَيْنَيْكَ بِهُدُوء، وَدَعْ عِظَامَ كَتِفَيْكَ تَرْتَخِي تَمَامَاً. <breath> خُذْ نَفَسَاً عَمِيقَاً وَبَطِيئَاً مِنَ الأَنْف ... احْتَفِظْ بِهِ لِثَلَاثِ ثَوَانٍ ... <sigh> ثُمَّ أَطْلِقِ الزَّفِيرَ بِسَلَام. لَيْسَ عَلَيْكَ أَنْ تَقْلَقَ بِشَأْنِ شَيْءٍ الآن، أَنْتَ فِي أَمَانٍ وَسَكِينَة.`
  },
  {
    id: 'arabic-promo',
    title: 'Luxury Brand Commercial',
    titleAr: 'إعلان تجاري فخم وحماسي',
    category: 'Commercial',
    categoryAr: 'إعلانات وترويج',
    mode: 'single',
    voice: 'Fenrir',
    style: 'Deep, inspiring, luxurious commercial voiceover with premium cadence',
    styleAr: 'نبرة إعلانية فخمة تجمع بين القوة والوقار وتأسر المستمع من اللحظة الأولى',
    description: 'Punchy premium commercial promo.',
    descriptionAr: 'نص إعلاني أنيق يبرز القوة والجاذبية في الأداء الصوتي الفخم.',
    text: `الفَخَامَةُ لَيْسَتْ مُجَرَّدَ تَفَاصِيلَ ظَاهِرِيَّة، بَلْ هِيَ شُعُورٌ يَتَجَاوَزُ حُدُودَ المَأْلُوف. <breath> عِنْدَمَا يَلْتَقِي الإِبْدَاعُ بِالإِتْقَانِ الخَالِص، تُولَدُ تَجْرِبَةٌ لَا تُنْسَى. انْطَلِقْ نَحْوَ المُسْتَقْبَل، بِثِقَةٍ لَا تَعْرِفُ التَّرَدُّد.`,
    textAr: `الفَخَامَةُ لَيْسَتْ مُجَرَّدَ تَفَاصِيلَ ظَاهِرِيَّة، بَلْ هِيَ شُعُورٌ يَتَجَاوَزُ حُدُودَ المَأْلُوف. <breath> عِنْدَمَا يَلْتَقِي الإِبْدَاعُ بِالإِتْقَانِ الخَالِص، تُولَدُ تَجْرِبَةٌ لَا تُنْسَى. انْطَلِقْ نَحْوَ المُسْتَقْبَل، بِثِقَةٍ لَا تَعْرِفُ التَّرَدُّد.`
  },
  {
    id: 'arabic-podcast-debate',
    title: 'Tech Horizons Podcast',
    titleAr: 'بودكاست: آفاق الذكاء الصوتي',
    category: 'Dual Dialogue',
    categoryAr: 'حوارات وبودكاست ثنائي',
    mode: 'multi',
    description: 'Enthusiastic podcast discussion in Arabic with authentic conversational reactions.',
    descriptionAr: 'حوار بودكاست ثنائي تفاعلي مشوق ومفعم بالتنفس والضحك والردود العفوية باللغة العربية.',
    speakers: [
      { name: 'طارق', voice: 'Puck', roleDescription: 'مقدم البودكاست المتفائل والحيوي' },
      { name: 'سارة', voice: 'Kore', roleDescription: 'باحثة صوتيات وخبيرة ذكاء اصطناعي' }
    ],
    turns: [
      {
        id: 'ar1',
        speaker: 'طارق',
        text: 'أهلاً بكم يا أصدقائي في حلقة جديدة من بودكاست آفاق! <breath> سارة، هل كنتِ تتوقعين يوماً أن نسمع أصواتاً اصطناعية تتحدث العربية بهذه الفصاحة والواقعية؟',
        style: 'نبرة مقدم بودكاست حماسي وسريع الإيقاع'
      },
      {
        id: 'ar2',
        speaker: 'سارة',
        text: 'بصراحة يا طارق، |yeah| التطور الأخير في نماذج التوليد الصوتي مذهل بحق. التشكيل التلقائي وفهم السياق جعل النطق شديد الشبه بالأداء الإذاعي البشري.',
        style: 'نبرة خبيرة واثقة، هادئة ومبتسمة'
      },
      {
        id: 'ar3',
        speaker: 'طارق',
        text: 'بل وأجمل ما في الأمر! <laugh> هو تلك الوقفات الطبيعية والتنفس العفوي، لم يعد هناك ذلك الطنين الآلي القديم.',
        style: 'ضحكة خفيفة ونبرة معجبة'
      },
      {
        id: 'ar4',
        speaker: 'سارة',
        text: '|mhm| بالضبط! نحن أمام حقبة جديدة كلياً في إنتاج الكتب الصوتية والبودكاست والمحتوى المرئي.',
        style: 'إيماءة تأكيد ختامية مريحة'
      }
    ]
  },
  {
    id: 'arabic-screenplay-drama',
    title: 'Midnight Mystery Investigation',
    titleAr: 'سيناريو درامي: سر الخزينة المفقودة',
    category: 'Screenplay Drama',
    categoryAr: 'سيناريو ودراما تمثيلية',
    mode: 'multi',
    description: 'Tense Arabic dramatic detective screenplay with suspense.',
    descriptionAr: 'مشهد تحقيق درامي مشحون بالتوتر والوقفات المتقطعة والهمس.',
    speakers: [
      { name: 'المحقق كمال', voice: 'Charon', roleDescription: 'محقق مخضرم حازم ومتحفظ' },
      { name: 'ندى', voice: 'Leto', roleDescription: 'شاهدة عيان غامضة ومتوترة' }
    ],
    turns: [
      {
        id: 'dr1',
        speaker: 'المحقق كمال',
        text: 'أغلقي الباب يا ندى، واجلسي. <breath> الوقت يمضي بسرعة، وأريد الحقيقة كاملة حول ما حدث ليلة أمس.',
        style: 'نبرة محقق خشنة وهادئة وجادة'
      },
      {
        id: 'dr2',
        speaker: 'ندى',
        text: 'لقد أخبرتك بكل شيء يا سيادة المحقق! <sigh> لم أكن أعلم أن تلك الوثيقة تحمل مثل هذه الخطورة.',
        style: 'تنهيدة توتر وتردد'
      },
      {
        id: 'dr3',
        speaker: 'المحقق كمال',
        text: 'لا تكذبي عليّ! مَن سلّمكِ المفتاح السري؟ ولماذا رأيتُ ظلكِ يقترب من مبنى الأرشيف؟',
        style: 'نبرة آمرة حازمة وحاسمة'
      },
      {
        id: 'dr4',
        speaker: 'ندى',
        text: 'لأنني ... <gasp> رأيتُ شخصاً آخر بالداخل! شخصاً تعرفه أنت جيداً يا كمال!',
        style: 'شهقة مفاجأة وهمس مشحون بالخوف'
      }
    ]
  }
];
