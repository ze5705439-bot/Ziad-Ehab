export type Language = 'ar' | 'en';

export interface TranslationDictionary {
  appName: string;
  appVersion: string;
  appBadge: string;
  appSubtitle: string;
  audioSpecBadge: string;
  localModeBadge: string;
  guideTitle: string;
  switchLanguage: string;
  langArabic: string;
  langEnglish: string;

  // Tabs
  tabSingle: string;
  tabSingleBadge: string;
  tabSingleDesc: string;
  tabMulti: string;
  tabMultiBadge: string;
  tabMultiDesc: string;
  tabPersona: string;
  tabPersonaBadge: string;
  tabPersonaDesc: string;
  tabBrowser: string;
  tabBrowserBadge: string;
  tabBrowserDesc: string;

  // Master Deck
  masterDeckStandbyTitle: string;
  masterDeckStandbyDesc: string;
  masterDeckPlaying: string;
  masterDeckPaused: string;
  masterDeckStudioFX: string;
  masterDeckCopyLink: string;
  masterDeckCopied: string;
  masterDeckDownloadWav: string;
  masterDeckSpectrum: string;
  masterDeckWaveform: string;
  masterDeckLoop: string;
  masterDeckRewind5: string;
  masterDeckForward5: string;
  masterDeckSpeed: string;
  masterDeckGain: string;
  masterDeckResetFX: string;
  fxPresetFlat: string;
  fxPresetFlatDesc: string;
  fxPresetWarm: string;
  fxPresetWarmDesc: string;
  fxPresetPodcast: string;
  fxPresetPodcastDesc: string;
  fxPresetRadio: string;
  fxPresetRadioDesc: string;
  fxPresetReverb: string;
  fxPresetReverbDesc: string;

  // Single Speaker
  singleTitle: string;
  singleSubtitle: string;
  singleVoiceLabel: string;
  singleModelLabel: string;
  modelFlashLiteTitle: string;
  modelFlashLiteDesc: string;
  modelFlashFlagshipTitle: string;
  modelFlashFlagshipDesc: string;
  singleStylePresetLabel: string;
  singleStyleCustomLabel: string;
  singleStyleCustomPlaceholder: string;
  singleVocalBurstsLabel: string;
  singleVocalBurstsDesc: string;
  singleSampleScriptsLabel: string;
  singleSampleScriptsPrompt: string;
  singleScriptLabel: string;
  singleScriptPlaceholder: string;
  singleCharCount: string;
  singleWordCount: string;
  singleEstDuration: string;
  singleSecs: string;
  singleGenerateBtn: string;
  singleGeneratingBtn: string;
  tashkeelBarTitle: string;
  tashkeelBarTip: string;

  // Multi Speaker
  multiTitle: string;
  multiSubtitle: string;
  multiSpeakerConfigTitle: string;
  speakerAName: string;
  speakerBName: string;
  speakerVoice: string;
  speakerRolePlaceholder: string;
  dialogueScriptTitle: string;
  addTurnBtn: string;
  turnSpeakerLabel: string;
  turnTextPlaceholder: string;
  turnStylePlaceholder: string;
  deleteTurnTitle: string;
  swapSpeakerTitle: string;
  multiGenerateBtn: string;
  multiGeneratingBtn: string;
  multiSampleDialoguesLabel: string;

  // Voice Persona Designer
  personaTitle: string;
  personaSubtitle: string;
  personaArchetypesTitle: string;
  personaWarmthLabel: string;
  personaWarmthDesc: string;
  personaEnergyLabel: string;
  personaEnergyDesc: string;
  personaGravitasLabel: string;
  personaGravitasDesc: string;
  personaFormalityLabel: string;
  personaFormalityDesc: string;
  personaBaseVoiceLabel: string;
  personaAuditionTextLabel: string;
  personaAuditionBtn: string;
  personaApplyBtn: string;
  personaAppliedMessage: string;
  personaAuditioningBtn: string;

  // Browser Engine
  browserTitle: string;
  browserSubtitle: string;
  browserVoiceSelectLabel: string;
  browserNoVoices: string;
  browserPitch: string;
  browserRate: string;
  browserVolume: string;
  browserTextLabel: string;
  browserSpeakBtn: string;
  browserStopBtn: string;
  browserSpeaking: string;
  browserArabicVoiceDetected: string;

  // Takes Drawer
  takesDrawerTitle: string;
  takesClearAll: string;
  takesEmptyTitle: string;
  takesEmptyDesc: string;
  takesDuration: string;
  takesDelete: string;
  takesDownload: string;

  // Cheatsheet Card
  cheatsheetTitle: string;
  cheatsheetDesc: string;
  breathDesc: string;
  laughDesc: string;
  gaspDesc: string;
  sighDesc: string;
  yeahDesc: string;
  mhmDesc: string;

  // Modal Guide
  modalTitle: string;
  modalClose: string;
  modalSection1Title: string;
  modalSection1Desc: string;
  modalSection2Title: string;
  modalSection2Desc: string;
  modalSection3Title: string;
  modalSection3Desc: string;
  modalSection4Title: string;
  modalSection4Desc: string;
  modalArabicTipsTitle: string;
  modalArabicTipsDesc: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  ar: {
    appName: 'استوديو فوكس الصوتي',
    appVersion: 'إصدار 2.5',
    appBadge: 'محرك جيميناي الصوتي العصبي',
    appSubtitle: 'منصة احترافية متكاملة لتوليد الصوت البشري فائق الدقة، وتوجيه السيناريو والحوارات الدرامية بالذكاء الاصطناعي',
    audioSpecBadge: 'جودة البث: 24 كيلوهرتز • 16-بت PCM WAV',
    localModeBadge: 'الوضع المحلي المتصفح',
    guideTitle: 'دليل الاستوديو وتعبيرات الأداء الصوتي',
    switchLanguage: 'تغيير اللغة',
    langArabic: 'العربية',
    langEnglish: 'English',

    tabSingle: 'استوديو الصوت الفردي',
    tabSingleBadge: 'Flash Lite TTS',
    tabSingleDesc: 'توليد صوتي فائق السرعة مع التوجيه النبري',
    tabMulti: 'استوديو الحوار والسيناريو',
    tabMultiBadge: 'Flash TTS الرائد',
    tabMultiDesc: 'حوارات درامية وبودكاست ثنائي تفاعلي',
    tabPersona: 'مصمم نبرة الصوت والشخصيات',
    tabPersonaBadge: 'نحت الخصائص الصوتية',
    tabPersonaDesc: 'تعديل المعايير السمعية والأنماط الصوتية',
    tabBrowser: 'المحرك المحلي المدمج',
    tabBrowserBadge: 'Web Speech',
    tabBrowserDesc: 'توليد صوتي فوري داخل المتصفح بدون إنترنت',

    masterDeckStandbyTitle: 'منصة التحكم الرئيسية في وضع الاستعداد',
    masterDeckStandbyDesc: 'اختر نبرة الصوت المناسبة، واكتب النص، ثم اضغط على "توليد الصوت" لتشغيل منصة التحكم والمؤثرات الصوتية والمحلل الطيفي المباشر.',
    masterDeckPlaying: 'جارٍ التشغيل الآن',
    masterDeckPaused: 'متوقف مؤقتاً',
    masterDeckStudioFX: 'مؤثرات الاستوديو (DSP)',
    masterDeckCopyLink: 'نسخ رابط الصوت المباشر',
    masterDeckCopied: 'تم النسخ بنجاح!',
    masterDeckDownloadWav: 'تحميل ملف WAV فائق النقاوة',
    masterDeckSpectrum: 'محلل طيف الترددات',
    masterDeckWaveform: 'موجات الذبذبة الصوتية',
    masterDeckLoop: 'تكرار مستمر',
    masterDeckRewind5: 'إرجاع 5 ثوانٍ',
    masterDeckForward5: 'تقديم 5 ثوانٍ',
    masterDeckSpeed: 'سرعة القراءة',
    masterDeckGain: 'مستوى الصوت الرئيسي',
    masterDeckResetFX: 'إعادة ضبط المؤثرات',
    fxPresetFlat: 'صوت نقي (Flat Studio)',
    fxPresetFlatDesc: 'الصوت الأصلي دون أي تعديل أو فلاتر ترددية.',
    fxPresetWarm: 'دفء البث الإذاعي (Broadcast Warmth)',
    fxPresetWarmDesc: 'تعزيز الترددات الدافئة المنخفضة وصوت الميكروفون الاحترافي.',
    fxPresetPodcast: 'حضور البودكاست (Podcast Punch)',
    fxPresetPodcastDesc: 'إبراز نبرة الصوت ومخارج الحروف مع إزالة الترددات العشوائية.',
    fxPresetRadio: 'راديو كلاسيكي (Vintage Radio)',
    fxPresetRadioDesc: 'محاكاة نبرة البث الإذاعي التناظري الكلاسيكي.',
    fxPresetReverb: 'صدى المكان (Room Ambience)',
    fxPresetReverbDesc: 'إضافة إحساس بالعمق المكاني والحيز الصوتي الطبيعي.',

    singleTitle: 'استوديو الصوت الفردي',
    singleSubtitle: 'تحويل النصوص إلى نطق بشري طبيعي ومعبر باستخدام نماذج Gemini TTS العصبية المتطورة',
    singleVoiceLabel: 'اختيار نبرة الصوت',
    singleModelLabel: 'نموذج التوليد الصوتي',
    modelFlashLiteTitle: 'Gemini 3.8 Flash Lite TTS',
    modelFlashLiteDesc: 'فائق السرعة والانسيابية، مثالي لقراءة المقالات والشاشات ونصوص المساعد الذكي.',
    modelFlashFlagshipTitle: 'Gemini 3.8 Flash TTS الرائد',
    modelFlashFlagshipDesc: 'يدعم التعبيرات الصوتية المتقدمة والتنفس والضحك والهمس والنبرات المتغيرة.',
    singleStylePresetLabel: 'أنماط الأداء المسبقة',
    singleStyleCustomLabel: 'توجيهات المشاعر والنبرة (Speech Direction)',
    singleStyleCustomPlaceholder: 'مثال: نبرة إخبارية فصيحة، أو إلقاء وثائقي هادئ مع وقفات تأملية، أو حوار ودي دافئ...',
    singleVocalBurstsLabel: 'التعبيرات الصوتية والوقفات الطبيعية (Vocal Bursts)',
    singleVocalBurstsDesc: 'انقر لإدراج التعبير في موضع المؤشر لتوجيه الموديل بنطق تنهيدة أو ضحكة أو شهقة عفوية:',
    singleSampleScriptsLabel: 'نماذج نصوص عربية جاهزة',
    singleSampleScriptsPrompt: 'اختر نصاً للتجربة الفورية...',
    singleScriptLabel: 'النص المراد تحويله إلى صوت',
    singleScriptPlaceholder: 'اكتب أو الصق النص العربي هنا... استخدم التشكيل لضمان أعلى دقة في الفصاحة ومخارج الحروف.',
    singleCharCount: 'حرف',
    singleWordCount: 'كلمة',
    singleEstDuration: 'المدة المقدرة',
    singleSecs: 'ثانية',
    singleGenerateBtn: 'توليد الصوت العصبي الآن',
    singleGeneratingBtn: 'جارٍ توليد الصوت بالذكاء الاصطناعي...',
    tashkeelBarTitle: 'شريط التشكيل العربي السريع',
    tashkeelBarTip: 'يساعد التشكيل في ضبط إعراب الكلمات ومخارج الحروف للحصول على أفصح نطق عربي بدون أي خطأ.',

    multiTitle: 'استوديو الحوار والسيناريو الثنائي',
    multiSubtitle: 'تأليف وإنتاج حوارات كاملة بين متحدثين اثنين مع تبادل الأدوار والتفاعل العفوي والتعبيرات الطبيعية',
    multiSpeakerConfigTitle: 'طاقم المتحدثين والشخصيات',
    speakerAName: 'المتحدث الأول (الرئيسي)',
    speakerBName: 'المتحدث الثاني (المشارك)',
    speakerVoice: 'نبرة الصوت',
    speakerRolePlaceholder: 'وصف الشخصية وطابعها الصوتي...',
    dialogueScriptTitle: 'سيناريو الحوار (المقاطع المتتابعة)',
    addTurnBtn: 'إضافة جملة حوارية جديدة',
    turnSpeakerLabel: 'المتحدث:',
    turnTextPlaceholder: 'اكتب نص الجملة الحوارية هنا...',
    turnStylePlaceholder: 'توجيه الأداء الخاص بهذه الجملة (مثال: نبرة ساخرة، تعجب، تساؤل متحمس...)',
    deleteTurnTitle: 'حذف الجملة',
    swapSpeakerTitle: 'تبديل المتحدث',
    multiGenerateBtn: 'توليد السيناريو الحواري الكامل',
    multiGeneratingBtn: 'جارٍ إنتاج الحوار الصوتي المزدوج...',
    multiSampleDialoguesLabel: 'نماذج حوارية وسيناريوهات عربية جاهزة',

    personaTitle: 'مختبر نحت وتصميم نبرة الصوت',
    personaSubtitle: 'صمم شخصيات صوتية فريدة من خلال ضبط المعايير السمعية والترددية الدقيقة',
    personaArchetypesTitle: 'القوالب والشخصيات النموذجية الجاهزة',
    personaWarmthLabel: 'الدفء والتعاطف الإنساني',
    personaWarmthDesc: 'يزيد من نعومة النبرة وقربها العاطفي وحميميتها.',
    personaEnergyLabel: 'الحماس والطاقة الحركية',
    personaEnergyDesc: 'يتحكم في إيقاع التنفس وسرعة تدفق الكلمات وحيويتها.',
    personaGravitasLabel: 'الوقار والهيبة الدرامية',
    personaGravitasDesc: 'يضفي عمقاً ورصانة وثقلاً مسرحياً على الكلمات.',
    personaFormalityLabel: 'الفصاحة ودقة مخارج الحروف',
    personaFormalityDesc: 'يضبط درجة الرسمية والوضوح الأكاديمي والنطق المعياري.',
    personaBaseVoiceLabel: 'الصوت الأساسي للنحت',
    personaAuditionTextLabel: 'نص تجربة واختبار النبرة المصممة',
    personaAuditionBtn: 'تجربة واستماع للنبرة',
    personaApplyBtn: 'اعتماد النبرة في استوديو التسجيل',
    personaAppliedMessage: 'تم تطبيق النبرة المصممة بنجاح في استوديو التسجيل!',
    personaAuditioningBtn: 'جارٍ اختبار النبرة...',

    browserTitle: 'المحرك المحلي المدمج في المتصفح',
    browserSubtitle: 'توليد فوري ومجاني بدون استهلاك واجهات خارجية، مع الاستفادة من أصوات جهازك ونظام التشغيل',
    browserVoiceSelectLabel: 'اختر الصوت المتاح في جهازك',
    browserNoVoices: 'جارٍ تحميل أصوات المتصفح المتاحة...',
    browserPitch: 'طبقة الصوت (Pitch)',
    browserRate: 'السرعة (Rate)',
    browserVolume: 'مستوى الصوت (Volume)',
    browserTextLabel: 'النص المطلوب قراءته محلياً',
    browserSpeakBtn: 'بدء القراءة الصوتية الفورية',
    browserStopBtn: 'إيقاف القراءة',
    browserSpeaking: 'المتصفح يقرأ النص الآن...',
    browserArabicVoiceDetected: 'تم العثور على أصوات عربية متوافقة في جهازك!',

    takesDrawerTitle: 'سجل التسجيلات والمقاطع المنتجة',
    takesClearAll: 'تفريغ السجل',
    takesEmptyTitle: 'لا توجد تسجيلات بعد',
    takesEmptyDesc: 'أي مقطع صوتي تقوم بتوليده سيظهر هنا تلقائياً للاستماع الفوري، والمقارنة، وتحميل ملفات WAV عالية الجودة.',
    takesDuration: 'المدة:',
    takesDelete: 'حذف المقطع',
    takesDownload: 'تحميل WAV',

    cheatsheetTitle: 'دليل التعبيرات الصوتية الواقعية (Vocal Bursts)',
    cheatsheetDesc: 'تدعم نماذج Gemini TTS إدراج تعبيرات صوتية داخل النص لتوليد مشاعر حقيقية بدون اصطناع:',
    breathDesc: 'شهيق وتنفس طبيعي بين الجمل',
    laughDesc: 'ضحكة خفيفة أو قهقهة مرحة',
    gaspDesc: 'شهقة مفاجأة أو صدمة درامية',
    sighDesc: 'تنهيدة راحة أو تأمل عميق',
    yeahDesc: 'تفاعل حواري عفوي بالموافقة',
    mhmDesc: 'إيماءة صوتية للتأكيد والاستماع',

    modalTitle: 'دليل استخدام استوديو فوكس الصوتي',
    modalClose: 'إغلاق الدليل',
    modalSection1Title: '1. قوة نماذج Gemini TTS العصبية',
    modalSection1Desc: 'تستخدم المنصة أحدث نماذج الصوت من جوجل: نموذج Flash Lite فائق السرعة والمثالي للمقالات وتطبيقات المساعد الشخصي، ونموذج Flash TTS الرائد المتخصص في المحاكاة الدرامية وتغيير المشاعر والسيناريوهات الثنائية.',
    modalSection2Title: '2. إرشادات للحصول على أفصح نطق باللغة العربية',
    modalSection2Desc: '• التشكيل هو سر النطق العربي المثالي: تشكيل أواخر الكلمات والكلمات الملتبسة (مثل: عِلم / عَلَم / عُلِم) يمنحك نطقاً عربياً فصيحاً لا تشوبه شائبة.\n• استخدم شريط التشكيل السريع المتوفر أسفل صندوق الكتابة لإضافة الحركات بسهولة.\n• يمكنك كتابة التوجيهات باللغة العربية الفصحى في حقل "توجيهات الأداء" (مثال: نبرة فصيحة هادئة، أو إلقاء حماسي مع تفخيم الحروف وترقيقها حسب قواعد التجويد).',
    modalSection3Title: '3. التعبيرات الصوتية التفاعلية',
    modalSection3Desc: 'أدخل رموز التعبيرات مثل <breath> للتنفس و <laugh> للضحك و <sigh> للتنهد مباشرة داخل نص السيناريو لتوليد أداء تمثيلي حي وواقعي.',
    modalSection4Title: '4. جودة البث والتصدير الاحترافي',
    modalSection4Desc: 'يتم تشفير وتصدير الصوت بدقة 24,000 هرتز 16-بت PCM Linear WAV بدون ضغط، جاهز تماماً للاستخدام في المونتاج وصناعة الفيديو والألعاب والبودكاست.',
    modalArabicTipsTitle: 'نصيحة ذهبية للفصاحة العربية',
    modalArabicTipsDesc: 'تتميز نماذج Gemini بقدرتها العالية على فهم سياق الجمل العربية، وإذا قمت بتشكيل النص جزئياً فإن الأداء الصوتي يقترب تماماً من أداء كبار المذيعين والإذاعيين العرب.',
  },
  en: {
    appName: 'VoxStudio',
    appVersion: 'v2.5',
    appBadge: 'Gemini Neural TTS Engine',
    appSubtitle: 'Professional Neural Text-to-Speech Console & Screenplay Studio with Lifelike Inflections and Multi-Speaker Dialogue',
    audioSpecBadge: 'Broadcast Quality: 24kHz • 16-Bit PCM WAV',
    localModeBadge: 'Browser Web Speech Mode',
    guideTitle: 'Studio Guide & Vocal Burst Syntax',
    switchLanguage: 'Switch Language',
    langArabic: 'العربية',
    langEnglish: 'English',

    tabSingle: 'Single Speaker Studio',
    tabSingleBadge: 'Flash Lite TTS',
    tabSingleDesc: 'High-speed neural voices with style guidance',
    tabMulti: 'Dual Screenplay Studio',
    tabMultiBadge: 'Flash TTS Flagship',
    tabMultiDesc: 'Multi-speaker podcast & drama dialogue',
    tabPersona: 'Voice Persona Designer',
    tabPersonaBadge: 'Acoustic Tuning',
    tabPersonaDesc: 'Custom archetype & parameter sculpting',
    tabBrowser: 'Browser Offline Engine',
    tabBrowserBadge: 'Web Speech',
    tabBrowserDesc: 'Instant zero-latency client synthesis',

    masterDeckStandbyTitle: 'Master Audio Deck Standby',
    masterDeckStandbyDesc: 'Select a voice, enter your text, and click "Synthesize Speech" to activate the master playback deck, real-time DSP rack, and live frequency visualizer.',
    masterDeckPlaying: 'Now Playing',
    masterDeckPaused: 'Paused',
    masterDeckStudioFX: 'Studio FX (DSP)',
    masterDeckCopyLink: 'Copy Audio Data URI',
    masterDeckCopied: 'Copied Successfully!',
    masterDeckDownloadWav: 'Download Broadcast WAV',
    masterDeckSpectrum: 'Frequency Spectrum',
    masterDeckWaveform: 'Oscilloscope Waveform',
    masterDeckLoop: 'Loop Playback',
    masterDeckRewind5: 'Rewind 5s',
    masterDeckForward5: 'Forward 5s',
    masterDeckSpeed: 'Speed',
    masterDeckGain: 'Master Level',
    masterDeckResetFX: 'Reset FX',
    fxPresetFlat: 'Flat / Studio Pure',
    fxPresetFlatDesc: 'Unaltered studio master output with neutral frequency curve.',
    fxPresetWarm: 'Broadcast Warmth',
    fxPresetWarmDesc: 'Subtle low-end body lift for radio and podcast presence.',
    fxPresetPodcast: 'Podcast Punch',
    fxPresetPodcastDesc: 'Vocal presence clarity boost with gentle sub-bass rumble cutoff.',
    fxPresetRadio: 'Vintage AM Radio',
    fxPresetRadioDesc: 'Bandpass resonant character recreating historic mid-century radio.',
    fxPresetReverb: 'Room Ambience',
    fxPresetReverbDesc: 'Spatial air and natural acoustic room presence.',

    singleTitle: 'Single Speaker Studio',
    singleSubtitle: 'Transform written text into lifelike neural speech with fine-grained style direction and vocal nuance',
    singleVoiceLabel: 'Select Prebuilt Voice',
    singleModelLabel: 'Neural Speech Model',
    modelFlashLiteTitle: 'Gemini 3.8 Flash Lite TTS',
    modelFlashLiteDesc: 'Optimized for low-latency generation, articles, notifications, and screen reading.',
    modelFlashFlagshipTitle: 'Gemini 3.8 Flash TTS Flagship',
    modelFlashFlagshipDesc: 'Flagship model supporting emotional direction, vocal bursts, sighs, and multi-speaker screenplays.',
    singleStylePresetLabel: 'Speech Style Presets',
    singleStyleCustomLabel: 'Custom Speech Direction & Emotion Notes',
    singleStyleCustomPlaceholder: 'e.g., Authoritative, fast-paced news anchor or gentle, whispered meditation guide...',
    singleVocalBurstsLabel: 'Expressive Vocal Bursts & Backchannels',
    singleVocalBurstsDesc: 'Click to insert natural breathing pauses, laughter, or conversational backchannels at cursor:',
    singleSampleScriptsLabel: 'Curated Sample Scripts',
    singleSampleScriptsPrompt: 'Load a sample script...',
    singleScriptLabel: 'Script to Synthesize',
    singleScriptPlaceholder: 'Enter or paste your text here... Add vocal burst tags to direct emotional pauses.',
    singleCharCount: 'chars',
    singleWordCount: 'words',
    singleEstDuration: 'Est. duration',
    singleSecs: 'sec',
    singleGenerateBtn: 'Synthesize Speech Now',
    singleGeneratingBtn: 'Synthesizing Neural Audio...',
    tashkeelBarTitle: 'Arabic Diacritics Helper',
    tashkeelBarTip: 'Diacritics clarify grammatical inflection and pronunciation for pristine Arabic speech.',

    multiTitle: 'Dual Screenplay & Podcast Studio',
    multiSubtitle: 'Direct realistic multi-speaker dialogues with custom speaker personas, turn-by-turn styles, and natural backchanneling',
    multiSpeakerConfigTitle: 'Cast & Speaker Setup',
    speakerAName: 'Speaker A (Lead)',
    speakerBName: 'Speaker B (Co-star)',
    speakerVoice: 'Assigned Voice',
    speakerRolePlaceholder: 'Character persona or role description...',
    dialogueScriptTitle: 'Dialogue Turns & Screenplay Lines',
    addTurnBtn: 'Add Dialogue Line',
    turnSpeakerLabel: 'Speaker:',
    turnTextPlaceholder: 'Enter dialogue line here...',
    turnStylePlaceholder: 'Line style & emotion note (e.g. sarcastic chuckle, curious whisper...)',
    deleteTurnTitle: 'Delete turn',
    swapSpeakerTitle: 'Swap speaker',
    multiGenerateBtn: 'Synthesize Full Screenplay',
    multiGeneratingBtn: 'Generating Multi-Speaker Audio...',
    multiSampleDialoguesLabel: 'Curated Screenplay & Podcast Samples',

    personaTitle: 'Voice Persona Designer',
    personaSubtitle: 'Sculpt unique acoustic personalities through intuitive multi-axis sliders and archetypes',
    personaArchetypesTitle: 'Archetype Presets',
    personaWarmthLabel: 'Warmth & Empathy',
    personaWarmthDesc: 'Softens timbre and enhances conversational emotional closeness.',
    personaEnergyLabel: 'Energy & Tempo',
    personaEnergyDesc: 'Governs breathing cadence, excitement, and speaking tempo.',
    personaGravitasLabel: 'Gravitas & Dramatic Weight',
    personaGravitasDesc: 'Adds cinematic depth, authority, and resonant weight.',
    personaFormalityLabel: 'Formality & Articulation',
    personaFormalityDesc: 'Fine-tunes precision of consonant delivery and cadence.',
    personaBaseVoiceLabel: 'Base Timbre Voice',
    personaAuditionTextLabel: 'Persona Audition Text',
    personaAuditionBtn: 'Audition Persona',
    personaApplyBtn: 'Apply to Studio Console',
    personaAppliedMessage: 'Persona applied to Single Speaker Studio successfully!',
    personaAuditioningBtn: 'Auditioning...',

    browserTitle: 'Browser Offline Speech Engine',
    browserSubtitle: 'Zero-latency local speech synthesis utilizing your operating system and web browser voices',
    browserVoiceSelectLabel: 'Detected System Voice',
    browserNoVoices: 'Loading browser voices...',
    browserPitch: 'Pitch',
    browserRate: 'Rate / Speed',
    browserVolume: 'Volume',
    browserTextLabel: 'Text to Speak Locally',
    browserSpeakBtn: 'Speak Now',
    browserStopBtn: 'Stop Speech',
    browserSpeaking: 'Speaking through browser speech engine...',
    browserArabicVoiceDetected: 'Arabic voices detected on your system!',

    takesDrawerTitle: 'Session Takes Library',
    takesClearAll: 'Clear History',
    takesEmptyTitle: 'No voice takes recorded yet',
    takesEmptyDesc: 'Generated audio clips will be recorded here for instant replay, master monitoring, and .WAV export.',
    takesDuration: 'Duration:',
    takesDelete: 'Delete Take',
    takesDownload: 'Download WAV',

    cheatsheetTitle: 'Vocal Burst Quick Cheat Sheet',
    cheatsheetDesc: 'Gemini TTS models natively parse embedded expressive tokens to produce lifelike human speech:',
    breathDesc: 'Natural breathing pause between phrases',
    laughDesc: 'Chuckle or warm laugh',
    gaspDesc: 'Sharp intake of breath or shock',
    sighDesc: 'Relief or contemplative exhale',
    yeahDesc: 'Casual conversation backchannel',
    mhmDesc: 'Agreement nod or affirmative',

    modalTitle: 'VoxStudio Console Guide',
    modalClose: 'Close Guide',
    modalSection1Title: '1. Dual Gemini Neural TTS Models',
    modalSection1Desc: 'VoxStudio utilizes Gemini 3.8 Flash Lite TTS for ultra-fast, clean article and notification reading, and Gemini 3.8 Flash TTS Flagship for multi-speaker screenplays, emotional direction, and vocal burst nuances.',
    modalSection2Title: '2. Arabic Language & Perfect Pronunciation',
    modalSection2Desc: '• Arabic is fully supported with native phonetic understanding across all voices.\n• Adding vowel diacritics (Tashkeel) ensures 100% accurate pronunciation for classical Arabic (Fusha).\n• Use the quick diacritics toolbar in the script editor to vowelize key words effortlessly.\n• Write directional notes in Arabic or English to shape emotion, gravitas, and pacing.',
    modalSection3Title: '3. Expressive Vocal Bursts & Direction',
    modalSection3Desc: 'Insert tags like <breath>, <laugh>, <sigh>, or backchannels like |yeah| and |mhm| to create conversational dialogue that never feels synthetic or robotic.',
    modalSection4Title: '4. Broadcast-Standard WAV Export',
    modalSection4Desc: 'Audio is decoded into studio-grade 24kHz 16-Bit uncompressed PCM WAV format, ready for video editing, podcasts, game development, and high-end multimedia production.',
    modalArabicTipsTitle: 'Pro Arabic Voice Tip',
    modalArabicTipsDesc: 'Gemini models excel at context-aware Arabic intonation. Providing a style note like "نبرة وثائقية وقورة وهادئة" immediately shapes the resonance and cadence.',
  },
};
