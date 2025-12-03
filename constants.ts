
export const ARCHIVE_STORAGE_KEY = 'postly_archive';

export const UI_TRANSLATIONS = {
  dashboard: { ar: 'الرئيسية', en: 'Dashboard' },
  ideaGenerator: { ar: 'مولد الأفكار', en: 'Idea Generator' },
  instantSummary: { ar: 'الملخص الفوري', en: 'Instant Summary' },
  contentStudio: { ar: 'استوديو المحتوى', en: 'Content Studio' },
  imageStudio: { ar: 'استوديو الصور', en: 'Image Studio' },
  createVideo: { ar: 'إنشاء فيديو', en: 'Create Video' },
  createAudio: { ar: 'إنشاء صوت', en: 'Create Audio' },
  brandIdentity: { ar: 'هوية البراند', en: 'Brand Identity' },
  websiteContent: { ar: 'محتوى الموقع', en: 'Web Content' },
  styleTrainer: { ar: 'مدرب الأسلوب', en: 'Style Trainer' },
  archive: { ar: 'الأرشيف', en: 'Archive' },
  settings: { ar: 'الإعدادات', en: 'Settings' },
  about: { ar: 'عن الموقع', en: 'About' },
  roleNotUsed: { ar: 'غير مستخدم', en: 'Not Used' },
  roleSubject: { ar: 'العنصر الأساسي', en: 'Subject' },
  roleBackground: { ar: 'الخلفية', en: 'Background' },
  roleStyle: { ar: 'الستايل الفني', en: 'Style Reference' },
  rolePalette: { ar: 'لوحة الألوان', en: 'Color Palette' },
  roleLighting: { ar: 'الإضاءة', en: 'Lighting Reference' },
  blenderDescPlaceholder: { ar: 'صف المشهد النهائي الذي تريد تكوينه من هذه العناصر...', en: 'Describe the final scene you want to synthesize from these elements...' },
  synthesizeImage: { ar: 'دمج الصور (Synthesis)', en: 'Synthesize Image' },
  imageBlender: { ar: 'خلاط الصور (Image Blender)', en: 'Image Blender' },
  graphicDesigner: { ar: 'مصمم الجرافيك', en: 'Graphic Designer' },
  infographicDesigner: { ar: 'صانع الانفوجرافيك', en: 'Infographic Designer' },
  templates: { ar: 'القوالب', en: 'Templates' },
  
  // Image Studio Tabs
  tabCreate: { ar: 'توليد (Create)', en: 'Create' },
  tabEnhance: { ar: 'تحسين (Enhance)', en: 'Enhance' },
  tabSmartEdit: { ar: 'تعديل ذكي (Smart Edit)', en: 'Smart Edit' },
  tabColor: { ar: 'ألوان (Color)', en: 'Color' },
  tabBlend: { ar: 'دمج (Blend)', en: 'Blend' },
  
  // Tools
  enhanceTitle: { ar: 'محسن الصور بالذكاء الاصطناعي', en: 'AI Image Enhancer' },
  enhanceDesc: { ar: 'رفع الدقة، إزالة التشويش، وتصحيح التفاصيل بلمسة واحدة.', en: 'Upscale, denoise, and fix details with one click.' },
  smartEditTitle: { ar: 'المحرر الذكي السحري', en: 'Magic Smart Editor' },
  smartEditDesc: { ar: 'استبدل، احذف، أو أضف عناصر داخل الصورة باستخدام الوصف النصي.', en: 'Replace, remove, or add elements using text prompts.' },
  colorTitle: { ar: 'تصحيح الألوان والإضاءة', en: 'Color & Lighting Control' },
  colorDesc: { ar: 'تحكم احترافي في توازن الألوان مع فلاتر جاهزة وتصحيح تلقائي.', en: 'Professional grade color control with presets and auto-fix.' },

  // Enhance Modes
  enhanceModeGeneral: { ar: 'تحسين عام (General)', en: 'General Enhance' },
  enhanceModeDeblur: { ar: 'إزالة الضبابية والتركيز (Fix Blur)', en: 'Deblur & Focus' },
  enhanceModeRestore: { ar: 'ترميم الصور القديمة (Restore)', en: 'Old Photo Restore' },
};

// Expanded Voice Options with Unique IDs
export const VOICE_OPTIONS = [
    // --- MEN (5) ---
    { 
        id: 'male_deep_tariq',
        name: 'Charon', 
        label: { ar: 'نبرة عميقة - وقور', en: 'Deep - Dignified' }, 
        persona: { ar: 'طارق (رجل)', en: 'Tariq (Male)' },
        icon: '🧔' 
    },
    { 
        id: 'male_firm_fahad',
        name: 'Fenrir', 
        label: { ar: 'نبرة قوية - حازم', en: 'Strong - Firm' }, 
        persona: { ar: 'فهد (رجل)', en: 'Fahad (Male)' },
        icon: '👨‍✈️' 
    },
    { 
        id: 'male_calm_majed',
        name: 'Puck', 
        label: { ar: 'نبرة متوسطة - متزن', en: 'Balanced - Calm' }, 
        persona: { ar: 'ماجد (رجل)', en: 'Majed (Male)' },
        icon: '👨' 
    },
    { 
        id: 'male_docu_omar',
        name: 'Charon', 
        label: { ar: 'نبرة رخيمة - وثائقي', en: 'Resonant - Documentary' }, 
        persona: { ar: 'عمر (رجل)', en: 'Omar (Male)' },
        icon: '🎙️' 
    },
    { 
        id: 'male_promo_yasser',
        name: 'Fenrir', 
        label: { ar: 'نبرة حماسية - إعلاني', en: 'Energetic - Promo' }, 
        persona: { ar: 'ياسر (رجل)', en: 'Yasser (Male)' },
        icon: '📢' 
    },

    // --- WOMEN (5) ---
    { 
        id: 'female_soft_laila',
        name: 'Kore', 
        label: { ar: 'نبرة هادئة - مريح', en: 'Soft - Relaxing' }, 
        persona: { ar: 'ليلى (امرأة)', en: 'Laila (Female)' },
        icon: '👩' 
    },
    { 
        id: 'female_fast_zeina',
        name: 'Zephyr', 
        label: { ar: 'نبرة حيوية - سريع', en: 'Energetic - Fast' }, 
        persona: { ar: 'زينة (امرأة)', en: 'Zeina (Female)' },
        icon: '👱‍♀️' 
    },
    { 
        id: 'female_story_sarah',
        name: 'Kore', 
        label: { ar: 'نبرة دافئة - قصصي', en: 'Warm - Storytelling' }, 
        persona: { ar: 'سارة (امرأة)', en: 'Sarah (Female)' },
        icon: '📚' 
    },
    { 
        id: 'female_news_nour',
        name: 'Zephyr', 
        label: { ar: 'نبرة رسمية - إخباري', en: 'Formal - News' }, 
        persona: { ar: 'نور (امرأة)', en: 'Nour (Female)' },
        icon: '👩‍💼' 
    },
    { 
        id: 'female_support_mariam',
        name: 'Kore', 
        label: { ar: 'نبرة ودودة - خدمة عملاء', en: 'Friendly - Support' }, 
        persona: { ar: 'مريم (امرأة)', en: 'Mariam (Female)' },
        icon: '🎧' 
    },

    // --- BOYS (3) ---
    { 
        id: 'boy_hamza',
        name: 'Puck', 
        label: { ar: 'نبرة طفولية - مرح (6-10 سنوات)', en: 'Playful - Child (6-10y)' }, 
        persona: { ar: 'حمزة (طفل)', en: 'Hamza (Child)' },
        icon: '👦' 
    },
    { 
        id: 'boy_anas',
        name: 'Zephyr', 
        label: { ar: 'نبرة هادئة - تساؤل (6-10 سنوات)', en: 'Curious - Child (6-10y)' }, 
        persona: { ar: 'أنس (طفل)', en: 'Anas (Child)' },
        icon: '🎒' 
    },
    { 
        id: 'boy_sami',
        name: 'Puck', 
        label: { ar: 'نبرة نشيطة - مغامرة (6-10 سنوات)', en: 'Active - Adventure (6-10y)' }, 
        persona: { ar: 'سامي (طفل)', en: 'Sami (Child)' },
        icon: '🧢' 
    },

    // --- GIRLS (3) ---
    { 
        id: 'girl_linda',
        name: 'Kore', 
        label: { ar: 'نبرة رقيقة - هادئة (6-10 سنوات)', en: 'Soft - Child (6-10y)' }, 
        persona: { ar: 'ليندا (طفلة)', en: 'Linda (Child)' },
        icon: '👧' 
    },
    { 
        id: 'girl_tala',
        name: 'Zephyr', 
        label: { ar: 'نبرة حيوية - مرحة (6-10 سنوات)', en: 'Lively - Child (6-10y)' }, 
        persona: { ar: 'تالا (طفلة)', en: 'Tala (Child)' },
        icon: '🎀' 
    },
    { 
        id: 'girl_rema',
        name: 'Kore', 
        label: { ar: 'نبرة قصصية - حالمة (6-10 سنوات)', en: 'Story - Child (6-10y)' }, 
        persona: { ar: 'ريما (طفلة)', en: 'Rema (Child)' },
        icon: '🦄' 
    },
];

export const LANGUAGES_GROUPED = [
    { label: { ar: 'الأكثر استخداماً', en: 'Most Popular' }, options: [
        { label: { ar: 'العربية (الفصحى)', en: 'Arabic (Modern Standard)' }, value: 'Arabic (Modern Standard)' },
        { label: { ar: 'الإنجليزية (EN)', en: 'English (EN)' }, value: 'English (EN)' },
        { label: { ar: 'الإنجليزية (UK)', en: 'English (UK)' }, value: 'English (UK)' },
    ]},
    { label: { ar: 'اللغات الأوروبية', en: 'European Languages' }, options: [
        { label: { ar: 'الفرنسية', en: 'French' }, value: 'French' },
        { label: { ar: 'الإسبانية', en: 'Spanish' }, value: 'Spanish' },
        { label: { ar: 'الألمانية', en: 'German' }, value: 'German' },
        { label: { ar: 'الإيطالية', en: 'Italian' }, value: 'Italian' },
        { label: { ar: 'البرتغالية (برازيل)', en: 'Portuguese (Brazil)' }, value: 'Portuguese (Brazil)' },
        { label: { ar: 'الروسية', en: 'Russian' }, value: 'Russian' },
        { label: { ar: 'الهولندية', en: 'Dutch' }, value: 'Dutch' },
        { label: { ar: 'السويدية', en: 'Swedish' }, value: 'Swedish' },
        { label: { ar: 'اليونانية', en: 'Greek' }, value: 'Greek' },
        { label: { ar: 'التركية', en: 'Turkish' }, value: 'Turkish' },
    ]},
    { label: { ar: 'اللغات الآسيوية', en: 'Asian Languages' }, options: [
        { label: { ar: 'الصينية (المبسطة)', en: 'Chinese (Simplified)' }, value: 'Chinese (Simplified)' },
        { label: { ar: 'اليابانية', en: 'Japanese' }, value: 'Japanese' },
        { label: { ar: 'الكورية', en: 'Korean' }, value: 'Korean' },
        { label: { ar: 'الهندية', en: 'Hindi' }, value: 'Hindi' },
        { label: { ar: 'الأردية', en: 'Urdu' }, value: 'Urdu' },
        { label: { ar: 'الإندونيسية', en: 'Indonesian' }, value: 'Indonesian' },
        { label: { ar: 'الفلبينية (تاغالوغ)', en: 'Filipino (Tagalog)' }, value: 'Filipino' },
        { label: { ar: 'التايلاندية', en: 'Thai' }, value: 'Thai' },
        { label: { ar: 'الفيتنامية', en: 'Vietnamese' }, value: 'Vietnamese' },
        { label: { ar: 'الفارسية', en: 'Persian' }, value: 'Persian' },
    ]},
    { label: { ar: 'لغات أخرى', en: 'Other Languages' }, options: [
        { label: { ar: 'السواحلية', en: 'Swahili' }, value: 'Swahili' },
        { label: { ar: 'الأمهرية', en: 'Amharic' }, value: 'Amharic' },
    ]}
];

export const ARABIC_DIALECTS_GROUPED = [
    { label: { ar: 'لهجات عامة', en: 'General Dialects' }, options: [
        { label: { ar: 'عربية بيضاء (مفهومة للكل)', en: 'White Arabic (Neutral)' }, value: 'White Arabic (Neutral)' },
        { label: { ar: 'فصحى مبسطة (للأخبار/الوثائقيات)', en: 'Simplified MSA' }, value: 'Simplified Modern Standard Arabic' },
    ]},
    { label: { ar: 'المملكة العربية السعودية', en: 'Saudi Arabia' }, options: [
        { label: { ar: 'نجدي (الرياض والوسطى)', en: 'Saudi (Najdi)' }, value: 'Saudi (Najdi - Riyadh)' },
        { label: { ar: 'حجازي (جدة ومكة)', en: 'Saudi (Hijazi)' }, value: 'Saudi (Hijazi - Jeddah)' },
        { label: { ar: 'جنوبي (عسير وجازان)', en: 'Saudi (Southern)' }, value: 'Saudi (Southern)' },
        { label: { ar: 'شرقاوي (الدمام والخبر)', en: 'Saudi (Eastern)' }, value: 'Saudi (Eastern)' },
        { label: { ar: 'شمالي (تبوك وحائل)', en: 'Saudi (Northern)' }, value: 'Saudi (Northern)' },
        { label: { ar: 'سعودية بيضاء (مكس)', en: 'Saudi (General White)' }, value: 'Saudi (White Dialect)' },
    ]},
    { label: { ar: 'جمهورية مصر العربية', en: 'Egypt' }, options: [
        { label: { ar: 'مصري قاهري (مودرن)', en: 'Egyptian (Cairene Modern)' }, value: 'Egyptian (Modern Cairene)' },
        { label: { ar: 'مصري شعبي', en: 'Egyptian (Sha\'abi)' }, value: 'Egyptian (Street/Sha\'abi)' },
        { label: { ar: 'إسكندراني', en: 'Egyptian (Alexandrian)' }, value: 'Egyptian (Alexandrian)' },
        { label: { ar: 'صعيدي', en: 'Egyptian (Sa\'idi)' }, value: 'Egyptian (Sa\'idi)' },
    ]},
    { label: { ar: 'الإمارات العربية المتحدة', en: 'UAE' }, options: [
        { label: { ar: 'إماراتي (عام)', en: 'Emirati (General)' }, value: 'Emirati (General)' },
        { label: { ar: 'إماراتي (أبوظبي)', en: 'Emirati (Abu Dhabi)' }, value: 'Emirati (Abu Dhabi)' },
        { label: { ar: 'إماراتي (دبي - شبابي)', en: 'Emirati (Dubai Youth)' }, value: 'Emirati (Dubai Trendy)' },
    ]},
    { label: { ar: 'دولة الكويت', en: 'Kuwait' }, options: [
        { label: { ar: 'كويتي (حضري)', en: 'Kuwaiti (Urban)' }, value: 'Kuwaiti (Urban)' },
        { label: { ar: 'كويتي (بدوي)', en: 'Kuwaiti (Bedouin)' }, value: 'Kuwaiti (Bedouin)' },
        { label: { ar: 'كويتي (شبابي/مودرن)', en: 'Kuwaiti (Modern Youth)' }, value: 'Kuwaiti (Modern)' },
    ]},
    { label: { ar: 'دولة قطر', en: 'Qatar' }, options: [
        { label: { ar: 'قطري', en: 'Qatari' }, value: 'Qatari' },
    ]},
    { label: { ar: 'مملكة البحرين', en: 'Bahrain' }, options: [
        { label: { ar: 'بحريني (عام)', en: 'Bahraini (General)' }, value: 'Bahraini' },
        { label: { ar: 'بحراني (قرى)', en: 'Bahraini (Bahrani)' }, value: 'Bahraini (Bahrani)' },
    ]},
    { label: { ar: 'سلطنة عمان', en: 'Oman' }, options: [
        { label: { ar: 'عماني (مسقط)', en: 'Omani (Muscat)' }, value: 'Omani (Muscat)' },
        { label: { ar: 'عماني (داخلي)', en: 'Omani (Interior)' }, value: 'Omani (Interior)' },
        { label: { ar: 'ظفاري', en: 'Omani (Dhofari)' }, value: 'Omani (Dhofari)' },
    ]},
    { label: { ar: 'العراق', en: 'Iraq' }, options: [
        { label: { ar: 'عراقي (بغدادي)', en: 'Iraqi (Baghdadi)' }, value: 'Iraqi (Baghdadi)' },
        { label: { ar: 'عراقي (بصراوي/جنوبي)', en: 'Iraqi (Southern)' }, value: 'Iraqi (Southern)' },
        { label: { ar: 'عراقي (موصلي)', en: 'Iraqi (Moslawi)' }, value: 'Iraqi (Moslawi)' },
    ]},
    { label: { ar: 'الأردن', en: 'Jordan' }, options: [
        { label: { ar: 'أردني (عماني/مدني)', en: 'Jordanian (Amman/Urban)' }, value: 'Jordanian (Urban)' },
        { label: { ar: 'أردني (فلاحي)', en: 'Jordanian (Rural)' }, value: 'Jordanian (Rural)' },
        { label: { ar: 'أردني (بدوي)', en: 'Jordanian (Bedouin)' }, value: 'Jordanian (Bedouin)' },
    ]},
    { label: { ar: 'فلسطين', en: 'Palestine' }, options: [
        { label: { ar: 'فلسطيني (مدني/قدس)', en: 'Palestinian (Urban/Jerusalem)' }, value: 'Palestinian (Urban)' },
        { label: { ar: 'فلسطيني (فلاحي)', en: 'Palestinian (Rural)' }, value: 'Palestinian (Rural)' },
        { label: { ar: 'غزاوي', en: 'Palestinian (Gazan)' }, value: 'Palestinian (Gazan)' },
    ]},
    { label: { ar: 'لبنان', en: 'Lebanon' }, options: [
        { label: { ar: 'لبناني (بيروتي)', en: 'Lebanese (Beiruti)' }, value: 'Lebanese (Beiruti)' },
        { label: { ar: 'لبناني (جبلي)', en: 'Lebanese (Mountain)' }, value: 'Lebanese (Mountain)' },
        { label: { ar: 'لبناني (جنوبي)', en: 'Lebanese (Southern)' }, value: 'Lebanese (Southern)' },
    ]},
    { label: { ar: 'سوريا', en: 'Syria' }, options: [
        { label: { ar: 'سوري (شامي/دمشق)', en: 'Syrian (Damascene)' }, value: 'Syrian (Damascene)' },
        { label: { ar: 'سوري (حلبي)', en: 'Syrian (Aleppo)' }, value: 'Syrian (Aleppo)' },
        { label: { ar: 'سوري (ساحلي)', en: 'Syrian (Coastal)' }, value: 'Syrian (Coastal)' },
    ]},
    { label: { ar: 'المغرب', en: 'Morocco' }, options: [
        { label: { ar: 'مغربية (دارجة)', en: 'Moroccan (Darija)' }, value: 'Moroccan (Darija)' },
        { label: { ar: 'مغربية (شمالية)', en: 'Moroccan (Northern)' }, value: 'Moroccan (Northern)' },
    ]},
    { label: { ar: 'الجزائر', en: 'Algeria' }, options: [
        { label: { ar: 'جزائري (عاصمي)', en: 'Algerian (Algiers)' }, value: 'Algerian (Algiers)' },
        { label: { ar: 'جزائري (وهراني)', en: 'Algerian (Oran)' }, value: 'Algerian (Oran)' },
    ]},
    { label: { ar: 'تونس', en: 'Tunisia' }, options: [
        { label: { ar: 'تونسي (عاصمي)', en: 'Tunisian (Tunis)' }, value: 'Tunisian (Tunis)' },
        { label: { ar: 'تونسي (ساحلي)', en: 'Tunisian (Coastal)' }, value: 'Tunisian (Coastal)' },
    ]},
    { label: { ar: 'ليبيا', en: 'Libya' }, options: [
        { label: { ar: 'ليبي (طرابلسي)', en: 'Libyan (Tripoli)' }, value: 'Libyan (Tripoli)' },
        { label: { ar: 'ليبي (برقاوي)', en: 'Libyan (Benghazi)' }, value: 'Libyan (Benghazi)' },
    ]},
    { label: { ar: 'السودان', en: 'Sudan' }, options: [
        { label: { ar: 'سوداني (خرطومي)', en: 'Sudanese (Khartoum)' }, value: 'Sudanese (Khartoum)' },
    ]},
    { label: { ar: 'اليمن', en: 'Yemen' }, options: [
        { label: { ar: 'يمني (صنعاني)', en: 'Yemeni (San\'ani)' }, value: 'Yemeni (San\'ani)' },
        { label: { ar: 'يمني (حضرمي)', en: 'Yemeni (Hadrami)' }, value: 'Yemeni (Hadrami)' },
        { label: { ar: 'يمني (عدني)', en: 'Yemeni (Adeni)' }, value: 'Yemeni (Adeni)' },
    ]},
];

export const TONES_GROUPED = [
    { label: { ar: 'رسمي ومهني', en: 'Professional' }, options: [
        { label: { ar: 'احترافي', en: 'Professional' }, value: 'Professional' },
        { label: { ar: 'رسمي', en: 'Formal' }, value: 'Formal' },
        { label: { ar: 'موثوق/خبير', en: 'Authoritative' }, value: 'Authoritative' },
        { label: { ar: 'إخباري/صحفي', en: 'Journalistic' }, value: 'Journalistic' },
        { label: { ar: 'أكاديمي', en: 'Academic' }, value: 'Academic' },
        { label: { ar: 'فاخر/راقي', en: 'Luxury/High-end' }, value: 'Luxury' },
        { label: { ar: 'مباشر', en: 'Direct' }, value: 'Direct' },
    ]},
    { label: { ar: 'تسويقي وإقناعي', en: 'Marketing' }, options: [
        { label: { ar: 'بيعي/إعلاني', en: 'Sales-oriented' }, value: 'Sales-oriented' },
        { label: { ar: 'حماسي', en: 'Enthusiastic' }, value: 'Enthusiastic' },
        { label: { ar: 'مقنع', en: 'Persuasive' }, value: 'Persuasive' },
        { label: { ar: 'عاجل (FOMO)', en: 'Urgent' }, value: 'Urgent' },
        { label: { ar: 'تشويقي', en: 'Suspenseful' }, value: 'Suspenseful' },
        { label: { ar: 'طموح', en: 'Aspiring' }, value: 'Aspiring' },
    ]},
    { label: { ar: 'ودود وشخصي', en: 'Casual & Personal' }, options: [
        { label: { ar: 'ودود', en: 'Friendly' }, value: 'Friendly' },
        { label: { ar: 'مرح/فكاهي', en: 'Humorous' }, value: 'Humorous' },
        { label: { ar: 'عفوي/طبيعي', en: 'Casual/Natural' }, value: 'Casual' },
        { label: { ar: 'عاطفي/دافئ', en: 'Emotional/Warm' }, value: 'Emotional' },
        { label: { ar: 'ساخر (بذكاء)', en: 'Witty/Sarcastic' }, value: 'Witty' },
        { label: { ar: 'شبابي (ترندي)', en: 'Gen Z / Trendy' }, value: 'Trendy' },
        { label: { ar: 'قريب للقلب', en: 'Heartfelt' }, value: 'Heartfelt' },
    ]},
    { label: { ar: 'تعليمي وتوجيهي', en: 'Educational' }, options: [
        { label: { ar: 'تعليمي/شرح', en: 'Educational' }, value: 'Educational' },
        { label: { ar: 'ملهم', en: 'Inspirational' }, value: 'Inspirational' },
        { label: { ar: 'تحفيزي', en: 'Motivational' }, value: 'Motivational' },
        { label: { ar: 'ناصح/مرشد', en: 'Advisory' }, value: 'Advisory' },
        { label: { ar: 'مطمئن/هادئ', en: 'Reassuring' }, value: 'Reassuring' },
        { label: { ar: 'متعاطف', en: 'Empathetic' }, value: 'Empathetic' },
    ]}
];

export const INDUSTRIES_GROUPED = [
    { label: { ar: 'الأعمال والتجارة', en: 'Business & Retail' }, options: [
        { label: { ar: 'متجر إلكتروني', en: 'E-Commerce Store' }, value: 'E-Commerce Store' },
        { label: { ar: 'شركة تجارة عامة', en: 'General Trading Company' }, value: 'General Trading Company' },
        { label: { ar: 'سوبرماركت / بقالة', en: 'Supermarket' }, value: 'Supermarket' },
        { label: { ar: 'محل ملابس', en: 'Clothing Store' }, value: 'Clothing Store' },
        { label: { ar: 'محل أحذية وحقائب', en: 'Shoes & Bags Store' }, value: 'Shoes & Bags Store' },
        { label: { ar: 'محل عطور وبخور', en: 'Perfume & Incense Shop' }, value: 'Perfume & Incense Shop' },
        { label: { ar: 'محل هدايا وتغليف', en: 'Gift Shop' }, value: 'Gift Shop' },
        { label: { ar: 'محل إكسسوارات', en: 'Accessories Store' }, value: 'Accessories Store' },
        { label: { ar: 'محل أجهزة منزلية', en: 'Home Appliances Store' }, value: 'Home Appliances Store' },
        { label: { ar: 'محل أثاث ومفروشات', en: 'Furniture Store' }, value: 'Furniture Store' },
        { label: { ar: 'محل مجوهرات وذهب', en: 'Jewelry Store' }, value: 'Jewelry Store' },
        { label: { ar: 'شركة لوجستية / توصيل', en: 'Logistics Company' }, value: 'Logistics Company' },
        { label: { ar: 'شحن وتخليص جمركي', en: 'International Shipping' }, value: 'International Shipping' },
        { label: { ar: 'وكالة دعاية وإعلان', en: 'Advertising Agency' }, value: 'Advertising Agency' },
        { label: { ar: 'شركة تسويق إلكتروني', en: 'Marketing Agency' }, value: 'Marketing Agency' },
        { label: { ar: 'شركة استيراد وتصدير', en: 'Import & Export' }, value: 'Import & Export' },
    ]},
    { label: { ar: 'المطاعم والأغذية', en: 'Food & Beverage' }, options: [
        { label: { ar: 'مطعم عام', en: 'Restaurants' }, value: 'Restaurants' },
        { label: { ar: 'كوفي شوب / مقهى', en: 'Coffee Shops' }, value: 'Coffee Shops' },
        { label: { ar: 'مخبز وحلويات', en: 'Bakeries & Sweets' }, value: 'Bakeries & Sweets' },
        { label: { ar: 'محل عصائر وآيس كريم', en: 'Juice Shops' }, value: 'Juice Shops' },
        { label: { ar: 'محل شوكولاتة وتمور', en: 'Chocolate Shops' }, value: 'Chocolate Shops' },
        { label: { ar: 'وجبات سريعة', en: 'Fast Food' }, value: 'Fast Food' },
        { label: { ar: 'مطعم صحي / دايت', en: 'Healthy Restaurants' }, value: 'Healthy Restaurants' },
        { label: { ar: 'فود ترك', en: 'Food Trucks' }, value: 'Food Trucks' },
        { label: { ar: 'شركة توريد مواد غذائية', en: 'Food Supply Companies' }, value: 'Food Supply Companies' },
        { label: { ar: 'خدمات التموين (Catering)', en: 'Catering Services' }, value: 'Catering Services' },
        { label: { ar: 'مطعم شعبي', en: 'Traditional Restaurant' }, value: 'Traditional Restaurant' },
    ]},
    { label: { ar: 'الطب والصحة', en: 'Medical & Healthcare' }, options: [
        { label: { ar: 'عيادة طبية', en: 'Medical Clinics' }, value: 'Medical Clinics' },
        { label: { ar: 'مستشفى', en: 'Hospitals' }, value: 'Hospitals' },
        { label: { ar: 'مختبر طبي', en: 'Medical Laboratories' }, value: 'Medical Laboratories' },
        { label: { ar: 'صيدلية', en: 'Pharmacies' }, value: 'Pharmacies' },
        { label: { ar: 'مركز تجميل طبي', en: 'Medical Beauty Centers' }, value: 'Medical Beauty Centers' },
        { label: { ar: 'مركز علاج طبيعي', en: 'Physiotherapy Centers' }, value: 'Physiotherapy Centers' },
        { label: { ar: 'عيادة أسنان', en: 'Dental Centers' }, value: 'Dental Centers' },
        { label: { ar: 'مركز سمنة ونحافة', en: 'Obesity & Slimming Centers' }, value: 'Obesity & Slimming Centers' },
        { label: { ar: 'مركز تأهيل', en: 'Rehabilitation Centers' }, value: 'Rehabilitation Centers' },
        { label: { ar: 'مركز أشعة وتحاليل', en: 'Radiology & Analysis Centers' }, value: 'Radiology & Analysis Centers' },
        { label: { ar: 'طبيب تغذية', en: 'Nutritionists' }, value: 'Nutritionists' },
        { label: { ar: 'طب بيطري', en: 'Veterinary Clinics' }, value: 'Veterinary Clinics' },
    ]},
    { label: { ar: 'التعليم والتدريب', en: 'Education & Training' }, options: [
        { label: { ar: 'مدرسة', en: 'Schools' }, value: 'Schools' },
        { label: { ar: 'جامعة', en: 'Universities' }, value: 'Universities' },
        { label: { ar: 'معهد تعليمي', en: 'Institutes' }, value: 'Institutes' },
        { label: { ar: 'مركز تدريب', en: 'Training Centers' }, value: 'Training Centers' },
        { label: { ar: 'دورات أونلاين', en: 'Online Courses' }, value: 'Online Courses' },
        { label: { ar: 'أكاديمية أطفال', en: 'Kids Academies' }, value: 'Kids Academies' },
        { label: { ar: 'مركز لغات', en: 'Language Centers' }, value: 'Language Centers' },
        { label: { ar: 'حضانة / روضة', en: 'Kindergartens' }, value: 'Kindergartens' },
        { label: { ar: 'لايف كوتش', en: 'Life Coaches' }, value: 'Life Coaches' },
        { label: { ar: 'مدرب وظيفي', en: 'Career Training' }, value: 'Career Training' },
        { label: { ar: 'تدريب تقني وذكاء اصطناعي', en: 'Tech & AI Training' }, value: 'Tech & AI Training' },
    ]},
    { label: { ar: 'العقارات والمقاولات', en: 'Real Estate' }, options: [
        { label: { ar: 'تطوير عقاري', en: 'Real Estate Developers' }, value: 'Real Estate Developers' },
        { label: { ar: 'وساطة عقارية', en: 'Real Estate Brokerage' }, value: 'Real Estate Brokerage' },
        { label: { ar: 'شركة مقاولات', en: 'Contracting Companies' }, value: 'Contracting Companies' },
        { label: { ar: 'تصميم داخلي وديكور', en: 'Interior Design Firms' }, value: 'Interior Design Firms' },
        { label: { ar: 'استشارات هندسية', en: 'Engineering Consultancies' }, value: 'Engineering Consultancies' },
        { label: { ar: 'تشطيبات وبناء', en: 'Decor & Construction' }, value: 'Decor & Construction' },
        { label: { ar: 'استشارات عقارية', en: 'Real Estate Consultancy' }, value: 'Real Estate Consultancy' },
        { label: { ar: 'هندسة معمارية', en: 'Architecture' }, value: 'Architecture' },
    ]},
    { label: { ar: 'الجمعيات والعمل الخيري', en: 'Charity & NGOs' }, options: [
        { label: { ar: 'جمعية خيرية', en: 'Charities' }, value: 'Charities' },
        { label: { ar: 'منظمة غير ربحية', en: 'Non-Profit Organizations' }, value: 'Non-Profit Organizations' },
        { label: { ar: 'حملات موسمية (رمضان/أعياد)', en: 'Seasonal Campaigns' }, value: 'Seasonal Campaigns' },
        { label: { ar: 'كفالة أيتام', en: 'Orphan Sponsorship' }, value: 'Orphan Sponsorship' },
        { label: { ar: 'دعم أسر متعففة', en: 'Family Support' }, value: 'Family Support' },
        { label: { ar: 'مشاريع إغاثية', en: 'Relief Projects' }, value: 'Relief Projects' },
        { label: { ar: 'حملات تبرع', en: 'Donation Campaigns' }, value: 'Donation Campaigns' },
        { label: { ar: 'فريق تطوعي', en: 'Volunteer Groups' }, value: 'Volunteer Groups' },
        { label: { ar: 'حفر آبار', en: 'Water Well Projects' }, value: 'Water Well Projects' },
        { label: { ar: 'مساعدات تعليمية وطبية', en: 'Education & Medical Aid' }, value: 'Education & Medical Aid' },
    ]},
    { label: { ar: 'الخدمات والاستشارات', en: 'Services' }, options: [
        { label: { ar: 'استشارات أعمال', en: 'Consulting' }, value: 'Consulting' },
        { label: { ar: 'مكتب محاماة', en: 'Legal Services' }, value: 'Legal Services' },
        { label: { ar: 'سياحة وسفر', en: 'Travel Agencies' }, value: 'Travel Agencies' },
        { label: { ar: 'إدارة أملاك', en: 'Property Management' }, value: 'Property Management' },
        { label: { ar: 'مكتب ترجمة', en: 'Translation Services' }, value: 'Translation Services' },
        { label: { ar: 'مكتب محاسبة', en: 'Accounting Firms' }, value: 'Accounting Firms' },
        { label: { ar: 'خدمات تأمين', en: 'Insurance Companies' }, value: 'Insurance Companies' },
        { label: { ar: 'تنظيم معارض ومؤتمرات', en: 'Event Management' }, value: 'Event Management' },
        { label: { ar: 'إنتاج إعلامي', en: 'Media Production' }, value: 'Media Production' },
        { label: { ar: 'حلول تقنية وبرمجة', en: 'Tech & Programming' }, value: 'Tech & Programming' },
        { label: { ar: 'صانع محتوى حر', en: 'Freelance Content Creators' }, value: 'Freelance Content Creators' },
        { label: { ar: 'مصور فوتوغرافي', en: 'Photographers' }, value: 'Photographers' },
        { label: { ar: 'خدمات تنظيف', en: 'Cleaning Services' }, value: 'Cleaning Services' },
        { label: { ar: 'مكافحة حشرات', en: 'Pest Control' }, value: 'Pest Control' },
        { label: { ar: 'خدمات أمنية', en: 'Security Services' }, value: 'Security Services' },
        { label: { ar: 'موارد بشرية', en: 'HR Services' }, value: 'HR Services' },
    ]},
    { label: { ar: 'التجميل والعناية', en: 'Beauty & Wellness' }, options: [
        { label: { ar: 'صالون تجميل (نسائي)', en: 'Beauty Salons' }, value: 'Beauty Salons' },
        { label: { ar: 'صالون حلاقة (رجالي)', en: 'Barbershops' }, value: 'Barbershops' },
        { label: { ar: 'سبا ومساج', en: 'Spa Centers' }, value: 'Spa Centers' },
        { label: { ar: 'نادي رياضي (جيم)', en: 'Fitness Centers' }, value: 'Fitness Centers' },
        { label: { ar: 'مركز يوغا', en: 'Yoga Centers' }, value: 'Yoga Centers' },
        { label: { ar: 'مدرب شخصي', en: 'Fitness Coaches' }, value: 'Fitness Coaches' },
        { label: { ar: 'منتجات عناية بالبشرة', en: 'Skin & Hair Care Products' }, value: 'Skin & Hair Care Products' },
        { label: { ar: 'مكياج وتجميل', en: 'Makeup Artist' }, value: 'Makeup Artist' },
    ]},
    { label: { ar: 'الضيافة والسياحة', en: 'Hospitality & Tourism' }, options: [
        { label: { ar: 'فندق', en: 'Hotels' }, value: 'Hotels' },
        { label: { ar: 'منتجع سياحي', en: 'Resorts' }, value: 'Resorts' },
        { label: { ar: 'شقق فندقية', en: 'Hotel Apartments' }, value: 'Hotel Apartments' },
        { label: { ar: 'شركة سياحة', en: 'Tourism Companies' }, value: 'Tourism Companies' },
        { label: { ar: 'رحلات بحرية', en: 'Cruise & Boat Trips' }, value: 'Cruise & Boat Trips' },
        { label: { ar: 'نادي رياضي واجتماعي', en: 'Sports Clubs' }, value: 'Sports Clubs' },
        { label: { ar: 'شاليهات واستراحات', en: 'Chalets & Rest Houses' }, value: 'Chalets & Rest Houses' },
    ]},
    { label: { ar: 'التقنية والرقمنة', en: 'Tech & Digital' }, options: [
        { label: { ar: 'تطوير برمجيات', en: 'Software Development' }, value: 'Software Development' },
        { label: { ar: 'وكالة برمجة', en: 'Development Agencies' }, value: 'Development Agencies' },
        { label: { ar: 'تطبيقات جوال', en: 'Mobile Apps' }, value: 'Mobile Apps' },
        { label: { ar: 'أمن سيبراني', en: 'Cyber Security' }, value: 'Cyber Security' },
        { label: { ar: 'خدمات سحابية (SaaS)', en: 'SaaS Companies' }, value: 'SaaS Companies' },
        { label: { ar: 'منصات خدمية', en: 'Online Service Platforms' }, value: 'Online Service Platforms' },
        { label: { ar: 'تكنولوجيا التعليم', en: 'EdTech Platforms' }, value: 'EdTech Platforms' },
        { label: { ar: 'شركات ذكاء اصطناعي', en: 'AI Companies' }, value: 'AI Companies' },
        { label: { ar: 'شركات ألعاب', en: 'Gaming Companies' }, value: 'Gaming Companies' },
        { label: { ar: 'تقنية مالية (FinTech)', en: 'FinTech' }, value: 'FinTech' },
        { label: { ar: 'عملات رقمية وكريبتو', en: 'Crypto & Blockchain' }, value: 'Crypto' },
    ]},
    { label: { ar: 'الإعلام والترفيه', en: 'Media & Entertainment' }, options: [
        { label: { ar: 'صانع محتوى', en: 'Content Creators' }, value: 'Content Creators' },
        { label: { ar: 'مؤثر (Influencer)', en: 'Influencers' }, value: 'Influencers' },
        { label: { ar: 'قناة يوتيوب', en: 'YouTube Channels' }, value: 'YouTube Channels' },
        { label: { ar: 'بودكاست', en: 'Podcasts' }, value: 'Podcasts' },
        { label: { ar: 'شركة إنتاج فني', en: 'Production Houses' }, value: 'Production Houses' },
        { label: { ar: 'ستوديو تصوير', en: 'Photography Studios' }, value: 'Photography Studios' },
        { label: { ar: 'منصة أخبار', en: 'News Pages' }, value: 'News Pages' },
        { label: { ar: 'صفحة ترفيهية', en: 'Entertainment Pages' }, value: 'Entertainment Pages' },
        { label: { ar: 'مراجعات أفلام', en: 'Movies & Series Pages' }, value: 'Movies & Series Pages' },
    ]},
    { label: { ar: 'السيارات والنقل', en: 'Automotive' }, options: [
        { label: { ar: 'معرض سيارات', en: 'Car Dealerships' }, value: 'Car Dealerships' },
        { label: { ar: 'تمويل سيارات', en: 'Car Financing' }, value: 'Car Financing' },
        { label: { ar: 'ورشة صيانة', en: 'Garages & Maintenance' }, value: 'Garages & Maintenance' },
        { label: { ar: 'تلميع وحماية (Detailing)', en: 'Car Detailing' }, value: 'Car Detailing' },
        { label: { ar: 'غسيل سيارات متنقل', en: 'Mobile Car Wash' }, value: 'Mobile Car Wash' },
        { label: { ar: 'قطع غيار واكسسوارات', en: 'Spare Parts & Accessories' }, value: 'Spare Parts & Accessories' },
        { label: { ar: 'تأجير سيارات فارهة', en: 'Limousine Services' }, value: 'Limousine Services' },
        { label: { ar: 'تأجير سيارات', en: 'Car Rental' }, value: 'Car Rental' },
    ]},
    { label: { ar: 'المشاريع اليدوية', en: 'Handmade Business' }, options: [
        { label: { ar: 'إكسسوارات يدوية', en: 'Handmade Accessories' }, value: 'Handmade Accessories' },
        { label: { ar: 'شموع وتوزيعات', en: 'Handmade Candles' }, value: 'Handmade Candles' },
        { label: { ar: 'صابون طبيعي', en: 'Natural Soap' }, value: 'Natural Soap' },
        { label: { ar: 'خياطة وتطريز', en: 'Embroidery' }, value: 'Embroidery' },
        { label: { ar: 'كروشيه وتريكو', en: 'Knitting & Crochet' }, value: 'Knitting & Crochet' },
        { label: { ar: 'نحت على الخشب', en: 'Wood Carving' }, value: 'Wood Carving' },
        { label: { ar: 'رسم وفنون', en: 'Painting' }, value: 'Painting' },
        { label: { ar: 'صناديق ومجسمات', en: 'Wooden Boxes' }, value: 'Wooden Boxes' },
        { label: { ar: 'هدايا مخصصة', en: 'Customized Gifts' }, value: 'Customized Gifts' },
        { label: { ar: 'خزف وفخار', en: 'Pottery & Ceramics' }, value: 'Pottery & Ceramics' },
        { label: { ar: 'أقمشة ومنسوجات', en: 'Handmade Fabrics' }, value: 'Handmade Fabrics' },
        { label: { ar: 'فن الريزن', en: 'Resin Art' }, value: 'Resin Art' },
        { label: { ar: 'مكرميات', en: 'Macrame' }, value: 'Macrame' },
        { label: { ar: 'حقائب يدوية', en: 'Handmade Bags' }, value: 'Handmade Bags' },
        { label: { ar: 'ديكورات منزلية', en: 'Handmade Decor' }, value: 'Handmade Decor' },
        { label: { ar: 'إعادة تدوير', en: 'Recycling Crafts' }, value: 'Recycling Crafts' },
    ]},
    { label: { ar: 'الحرف والمهن', en: 'Crafts & Trades' }, options: [
        { label: { ar: 'نجارة', en: 'Carpentry' }, value: 'Carpentry' },
        { label: { ar: 'سباكة', en: 'Plumbing' }, value: 'Plumbing' },
        { label: { ar: 'كهرباء منازل', en: 'Electrical Services' }, value: 'Electrical Services' },
        { label: { ar: 'حدادة', en: 'Blacksmithing' }, value: 'Blacksmithing' },
        { label: { ar: 'دهانات وصبغ', en: 'Painting & Decorating' }, value: 'Painting & Decorating' },
        { label: { ar: 'جبس وديكور', en: 'Gypsum & Decor' }, value: 'Gypsum & Decor' },
        { label: { ar: 'بلاط وسيراميك', en: 'Tiling & Ceramics' }, value: 'Tiling & Ceramics' },
        { label: { ar: 'تكييف وتبريد', en: 'HVAC / AC Services' }, value: 'HVAC / AC Services' },
        { label: { ar: 'تمديدات صحية', en: 'Sanitary Installations' }, value: 'Sanitary Installations' },
        { label: { ar: 'لحام وتصنيع معادن', en: 'Welding' }, value: 'Welding' },
        { label: { ar: 'ميكانيكا سيارات', en: 'Mechanics' }, value: 'Mechanics' },
        { label: { ar: 'سمكرة ودهان سيارات', en: 'Auto Body Repair' }, value: 'Auto Body Repair' },
        { label: { ar: 'ألمنيوم وشبابيك', en: 'Aluminum Works' }, value: 'Aluminum Works' },
        { label: { ar: 'صيانة عامة للمنازل', en: 'Home Maintenance' }, value: 'Home Maintenance' },
        { label: { ar: 'مسح وبناء', en: 'Surveying & Building' }, value: 'Surveying & Building' },
        { label: { ar: 'رخام وجرانيت', en: 'Granite & Marble' }, value: 'Granite & Marble' },
        { label: { ar: 'عامل متعدد المهارات', en: 'Handyman' }, value: 'Handyman' },
        { label: { ar: 'تصليح جوالات', en: 'Mobile Repair' }, value: 'Mobile Repair' },
        { label: { ar: 'صيانة كمبيوتر', en: 'Computer Repair' }, value: 'Computer Repair' },
        { label: { ar: 'طباعة على التيشرتات', en: 'T-Shirt Printing' }, value: 'T-Shirt Printing' },
        { label: { ar: 'حفر ليزر', en: 'Laser Engraving' }, value: 'Laser Engraving' },
        { label: { ar: 'طباعة حرارية', en: 'Thermal Printing' }, value: 'Thermal Printing' },
        { label: { ar: 'خراطة (CNC)', en: 'CNC Machining' }, value: 'CNC Machining' },
        { label: { ar: 'دروع وهدايا خشبية', en: 'Trophies & Wooden Gifts' }, value: 'Trophies & Wooden Gifts' },
    ]}
];

export const AD_PLATFORMS = [
    { label: { ar: 'فيسبوك', en: 'Facebook' }, value: 'Facebook' },
    { label: { ar: 'انستجرام', en: 'Instagram' }, value: 'Instagram' },
    { label: { ar: 'تويتر (X)', en: 'Twitter (X)' }, value: 'Twitter' },
    { label: { ar: 'لينكد إن', en: 'LinkedIn' }, value: 'LinkedIn' },
    { label: { ar: 'سناب شات', en: 'Snapchat' }, value: 'Snapchat' },
    { label: { ar: 'تيك توك', en: 'TikTok' }, value: 'TikTok' },
    { label: { ar: 'جوجل (Search)', en: 'Google Search' }, value: 'Google Search' },
    { label: { ar: 'يوتيوب', en: 'YouTube' }, value: 'YouTube' },
];

export const REEL_MODES = [
    { label: { ar: 'ريل سريع (30 ثانية)', en: 'Quick Reel (30s)' }, value: 'Quick Reel (30s)', options: [] },
    { label: { ar: 'قصة كاملة (60 ثانية)', en: 'Full Story (60s)' }, value: 'Full Story (60s)', options: [] },
    { label: { ar: 'تعليمي (How-To)', en: 'Educational (How-To)' }, value: 'Educational (How-To)', options: [] },
    { label: { ar: 'خلف الكواليس', en: 'Behind the Scenes' }, value: 'Behind the Scenes', options: [] },
    { label: { ar: 'عرض منتج', en: 'Product Showcase' }, value: 'Product Showcase', options: [] },
    { label: { ar: 'ترند / فيرال', en: 'Trend / Viral' }, value: 'Trend / Viral', options: [] },
];

export const REEL_PLATFORMS = [
    { label: { ar: 'تيك توك', en: 'TikTok' }, value: 'TikTok' },
    { label: { ar: 'انستقرام ريلز', en: 'Instagram Reels' }, value: 'Instagram Reels' },
    { label: { ar: 'يوتيوب شورتس', en: 'YouTube Shorts' }, value: 'YouTube Shorts' },
    { label: { ar: 'سناب شات', en: 'Snapchat' }, value: 'Snapchat' },
];

export const REEL_DURATIONS = [
    { label: { ar: '15 ثانية', en: '15s' }, value: '15 seconds' },
    { label: { ar: '30 ثانية', en: '30s' }, value: '30 seconds' },
    { label: { ar: '60 ثانية', en: '60s' }, value: '60 seconds' },
];

export const IMAGE_MODELS = [
    { label: { ar: 'فلاش (سريع)', en: 'Flash (Fast)' }, value: 'gemini-2.5-flash-image' },
    { label: { ar: 'برو (دقيق)', en: 'Pro (High Quality)' }, value: 'gemini-3-pro-image-preview' },
];

export const UNIFIED_IMAGE_STYLES = [
    {
        label: { ar: 'واقعي', en: 'Realistic' },
        options: [
            { label: { ar: 'فوتوغرافي', en: 'Photorealistic' }, value: 'Photorealistic' },
            { label: { ar: 'سينمائي', en: 'Cinematic' }, value: 'Cinematic' },
            { label: { ar: 'ماكرو', en: 'Macro Photography' }, value: 'Macro Photography' },
        ]
    },
    {
        label: { ar: 'فني', en: 'Artistic' },
        options: [
            { label: { ar: 'رسم زيتي', en: 'Oil Painting' }, value: 'Oil Painting' },
            { label: { ar: 'ألوان مائية', en: 'Watercolor' }, value: 'Watercolor' },
            { label: { ar: 'رسم رقمي', en: 'Digital Art' }, value: 'Digital Art' },
            { label: { ar: 'أنمي', en: 'Anime' }, value: 'Anime' },
            { label: { ar: 'ثلاثي الأبعاد', en: '3D Render' }, value: '3D Render' },
        ]
    }
];

export const ASPECT_RATIOS_GROUPED = [
    {
        label: { ar: 'وسائل التواصل', en: 'Social Media' },
        options: [
            { label: { ar: 'مربع (1:1)', en: 'Square (1:1)' }, value: '1:1', desc: 'Instagram Post' },
            { label: { ar: 'طولي (9:16)', en: 'Portrait (9:16)' }, value: '9:16', desc: 'Stories / Reels / TikTok' },
            { label: { ar: 'عريض (16:9)', en: 'Landscape (16:9)' }, value: '16:9', desc: 'YouTube / Twitter' },
            { label: { ar: 'بورتريه (3:4)', en: 'Portrait (3:4)' }, value: '3:4', desc: 'Pinterest / Instagram Portrait' },
            { label: { ar: 'لاندسكيب (4:3)', en: 'Landscape (4:3)' }, value: '4:3', desc: 'Standard Photo' },
        ]
    }
];

export const CAMERA_ANGLES = [
    { label: { ar: 'مستوى العين', en: 'Eye Level' }, value: 'Eye Level', icon: '👁️' },
    { label: { ar: 'زاوية منخفضة', en: 'Low Angle' }, value: 'Low Angle', icon: '⬇️' },
    { label: { ar: 'زاوية مرتفعة', en: 'High Angle' }, value: 'High Angle', icon: '⬆️' },
    { label: { ar: 'من الأعلى (Top Down)', en: 'Top Down' }, value: 'Top Down (Flat Lay)', icon: '🦅' },
    { label: { ar: 'ماكرو (قريب جداً)', en: 'Macro' }, value: 'Macro Close-up', icon: '🔍' },
];

export const LIGHTING_STYLES = [
    { label: { ar: 'طبيعي', en: 'Natural' }, value: 'Natural Lighting', icon: '☀️' },
    { label: { ar: 'سينمائي', en: 'Cinematic' }, value: 'Cinematic Lighting', icon: '🎬' },
    { label: { ar: 'ستوديو', en: 'Studio' }, value: 'Studio Lighting', icon: '💡' },
    { label: { ar: 'نيون', en: 'Neon' }, value: 'Neon Lighting', icon: '🟣' },
    { label: { ar: 'ذهبي (غروب)', en: 'Golden Hour' }, value: 'Golden Hour', icon: '🌅' },
];

export const PRODUCT_SCENES_GROUPED = [
    {
        label: { ar: 'خلفيات بسيطة', en: 'Simple Backgrounds' },
        options: [
            { label: { ar: 'استوديو أبيض', en: 'White Studio' }, value: 'Clean White Studio Background', icon: '⚪' },
            { label: { ar: 'استوديو أسود', en: 'Dark Studio' }, value: 'Dark Elegant Studio Background', icon: '⚫' },
            { label: { ar: 'خلفية ملونة (باستيل)', en: 'Pastel Color' }, value: 'Soft Pastel Background', icon: '🎨' },
        ]
    },
    {
        label: { ar: 'بيئات واقعية', en: 'Realistic Environments' },
        options: [
            { label: { ar: 'على طاولة خشبية', en: 'Wooden Table' }, value: 'Rustic Wooden Table', icon: '🪵' },
            { label: { ar: 'مطبخ عصري', en: 'Modern Kitchen' }, value: 'Modern Kitchen Counter', icon: '🍳' },
            { label: { ar: 'طبيعة خارجية', en: 'Nature/Outdoor' }, value: 'Outdoor Nature Bokeh', icon: '🌿' },
            { label: { ar: 'مكتب فاخر', en: 'Luxury Office' }, value: 'Luxury Office Desk', icon: '💼' },
        ]
    }
];

export const REALISM_ENGINE_PROMPTS = [
    // This seems unused in the provided code for RealismEngineView but imported. I'll add an empty array or basic prompts.
    "Hyper-realistic 8k photo of...",
];

export const GRAPHIC_DESIGN_STYLES = [
    {
        label: { ar: 'أنماط التصميم', en: 'Design Styles' },
        options: [
            { label: { ar: 'مينيمال (بسيط)', en: 'Minimalist' }, value: 'Minimalist Clean Design' },
            { label: { ar: 'عصري (Modern)', en: 'Modern Corporate' }, value: 'Modern Corporate Style' },
            { label: { ar: 'جريء (Bold)', en: 'Bold Typography' }, value: 'Bold Typography Style' },
            { label: { ar: 'فاخر (Luxury)', en: 'Luxury Elegant' }, value: 'Luxury Elegant Style' },
            { label: { ar: 'ريترو (Retro)', en: 'Retro Vintage' }, value: 'Retro Vintage Style' },
        ]
    }
];

export const GRAPHIC_DESIGN_SIZES = [
    {
        label: { ar: 'السوشيال ميديا', en: 'Social Media' },
        options: [
            { label: { ar: 'بوست انستجرام (1:1)', en: 'Instagram Post (1:1)' }, value: '1:1' },
            { label: { ar: 'ستوري / ريلز (9:16)', en: 'Story/Reels (9:16)' }, value: '9:16' },
            { label: { ar: 'يوتيوب / تويتر (16:9)', en: 'YouTube/Twitter (16:9)' }, value: '16:9' },
            { label: { ar: 'بورتريه (4:5)', en: 'Portrait (4:5)' }, value: '4:5' },
        ]
    },
    {
        label: { ar: 'طباعة ومستندات', en: 'Print & Docs' },
        options: [
            { label: { ar: 'ورقة A4', en: 'A4 Paper' }, value: 'A4_V' },
            { label: { ar: 'بوستر', en: 'Poster' }, value: 'Poster_50x70' },
            { label: { ar: 'كارت شخصي', en: 'Business Card' }, value: 'BizCard' },
        ]
    }
];

export const MOCKUP_TYPES_GROUPED = [
    {
        label: { ar: 'الأجهزة', en: 'Devices' },
        options: [
            { label: { ar: 'ايفون', en: 'iPhone' }, value: 'iPhone Mockup' },
            { label: { ar: 'لابتوب', en: 'Laptop' }, value: 'MacBook Mockup' },
        ]
    },
    {
        label: { ar: 'منتجات', en: 'Products' },
        options: [
            { label: { ar: 'علبة منتج', en: 'Product Box' }, value: 'Product Box Packaging' },
            { label: { ar: 'كيس قهوة', en: 'Coffee Bag' }, value: 'Coffee Bag Mockup' },
            { label: { ar: 'تيشرت', en: 'T-Shirt' }, value: 'T-Shirt Mockup' },
            { label: { ar: 'كوب', en: 'Mug' }, value: 'Mug Mockup' },
        ]
    }
];

export const IDEA_TYPES = [
    {
        label: { ar: 'أنواع الأفكار', en: 'Idea Types' },
        options: [
            { label: { ar: 'فيرال (انتشار واسع)', en: 'Viral Content' }, value: 'Viral Content' },
            { label: { ar: 'تعليمي', en: 'Educational' }, value: 'Educational' },
            { label: { ar: 'ترويجي', en: 'Promotional' }, value: 'Promotional' },
            { label: { ar: 'تفاعلي', en: 'Interactive' }, value: 'Interactive' },
            { label: { ar: 'قصصي', en: 'Storytelling' }, value: 'Storytelling' },
        ]
    }
];

export const VIDEO_ASPECT_RATIOS = [
    { label: { ar: 'عرضي (16:9)', en: 'Landscape (16:9)' }, value: '16:9' },
    { label: { ar: 'طولي (9:16)', en: 'Portrait (9:16)' }, value: '9:16' },
];

export const VIDEO_RESOLUTIONS = [
    { label: { ar: 'عالية (1080p)', en: 'HD (1080p)' }, value: '1080p' },
    { label: { ar: 'قياسية (720p)', en: 'Standard (720p)' }, value: '720p' },
];

export const TEMPLATES_DB = [
    {
        id: 'coffee_ad_1',
        title: { ar: 'إعلان قهوة صباحية', en: 'Morning Coffee Ad' },
        category: 'Food & Beverage',
        tags: ['Coffee', 'Morning', 'Drink'],
        prompt: 'Professional advertisement for morning coffee, steam rising, warm lighting, cozy atmosphere, cinematic shot, 8k resolution.',
        icon: '☕'
    },
    {
        id: 'tech_minimal',
        title: { ar: 'غلاف تقني بسيط', en: 'Minimal Tech Cover' },
        category: 'Tech & Digital',
        tags: ['Tech', 'Minimal', 'Blue'],
        prompt: 'Minimalist technology background, abstract blue circuits, clean layout, futuristic vibe, 8k render.',
        icon: '💻'
    },
    // ... add more if needed
];

export const INFOGRAPHIC_LAYOUTS = [
    { label: { ar: 'خط زمني', en: 'Timeline' }, value: 'Timeline', icon: '⏱️' },
    { label: { ar: 'قائمة', en: 'List' }, value: 'List', icon: '📝' },
    { label: { ar: 'مقارنة', en: 'Comparison' }, value: 'Comparison', icon: '⚖️' },
    { label: { ar: 'عملية (Steps)', en: 'Process' }, value: 'Process Steps', icon: '➡️' },
    { label: { ar: 'هرمي', en: 'Pyramid' }, value: 'Pyramid', icon: '🔺' },
];

export const INFOGRAPHIC_STYLES = [
    { label: { ar: 'فلات (مسطح)', en: 'Flat Vector' }, value: 'Flat Vector Art' },
    { label: { ar: 'ثلاثي الأبعاد', en: '3D Isometric' }, value: '3D Isometric' },
    { label: { ar: 'مرسوم باليد', en: 'Hand Drawn' }, value: 'Hand Drawn Sketch' },
    { label: { ar: 'نيون', en: 'Neon Dark' }, value: 'Neon Dark Mode' },
    { label: { ar: 'احترافي', en: 'Corporate Clean' }, value: 'Corporate Clean' },
];
