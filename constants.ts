
// ... existing imports

export const ARCHIVE_STORAGE_KEY = 'postly_archive';

export const UI_TRANSLATIONS = {
  dashboard: { ar: 'الرئيسية', en: 'Dashboard' },
  ideaGenerator: { ar: 'مولد الأفكار', en: 'Idea Generator' },
  instantSummary: { ar: 'الملخص الفوري', en: 'Instant Summary' },
  contentStudio: { ar: 'استوديو المحتوى', en: 'Content Studio' },
  imageStudio: { ar: 'استوديو الصور', en: 'Image Studio' },
  professionalProduct: { ar: 'منتج احترافي', en: 'Professional Product' },
  createVideo: { ar: 'إنشاء فيديو', en: 'Create Video' },
  createAudio: { ar: 'إنشاء صوت', en: 'Create Audio' },
  brandIdentity: { ar: 'هوية البراند', en: 'Brand Identity' },
  websiteContent: { ar: 'محتوى الموقع', en: 'Web Content' },
  styleTrainer: { ar: 'مدرب الأسلوب', en: 'Style Trainer' },
  archive: { ar: 'الأرشيف', en: 'Archive' },
  settings: { ar: 'الإعدادات', en: 'Settings' },
  about: { ar: 'عن التطبيق', en: 'About App' },
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

// ... (Keep existing arrays: VOICE_OPTIONS, LANGUAGES_GROUPED, etc. - No changes needed below) ...
export const VOICE_OPTIONS = [
    // ... existing content ...
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
    { label: { ar: 'القطاعات التجارية', en: 'Business & Retail' }, options: [
        { label: { ar: 'المتاجر الإلكترونية', en: 'E-Commerce Store' }, value: 'E-Commerce Store' },
        { label: { ar: 'شركات التجارة العامة', en: 'General Trading Company' }, value: 'General Trading Company' },
        { label: { ar: 'السوبرماركت والهايبر', en: 'Supermarket' }, value: 'Supermarket' },
        { label: { ar: 'محلات الملابس والأزياء', en: 'Clothing Store' }, value: 'Clothing Store' },
        { label: { ar: 'محلات الأحذية والشنط', en: 'Shoes & Bags Store' }, value: 'Shoes & Bags Store' },
        { label: { ar: 'محلات العطور والبخور', en: 'Perfume & Incense Shop' }, value: 'Perfume & Incense Shop' },
        { label: { ar: 'متاجر الهدايا', en: 'Gift Shop' }, value: 'Gift Shop' },
        { label: { ar: 'متاجر الإكسسوارات', en: 'Accessories Store' }, value: 'Accessories Store' },
        { label: { ar: 'متاجر الأجهزة المنزلية', en: 'Home Appliances Store' }, value: 'Home Appliances Store' },
        { label: { ar: 'محلات الأثاث والديكور', en: 'Furniture Store' }, value: 'Furniture Store' },
        { label: { ar: 'محلات الذهب والمجوهرات', en: 'Jewelry Store' }, value: 'Jewelry Store' },
        { label: { ar: 'معارض السيارات', en: 'Car Showroom' }, value: 'Car Showroom' },
        { label: { ar: 'شركات قطع غيار السيارات', en: 'Auto Parts Company' }, value: 'Auto Parts Company' },
        { label: { ar: 'شركات لوجستيات وتوصيل', en: 'Logistics Company' }, value: 'Logistics Company' },
        { label: { ar: 'شركات الشحن الدولي', en: 'International Shipping' }, value: 'International Shipping' },
        { label: { ar: 'شركات الطباعة والدعاية والإعلان', en: 'Advertising & Printing Agency' }, value: 'Advertising Agency' },
        { label: { ar: 'شركات التسويق', en: 'Marketing Agency' }, value: 'Marketing Agency' },
    ]},
    { label: { ar: 'قطاع الأغذية والمشروبات', en: 'Food & Beverage' }, options: [
        { label: { ar: 'المطاعم', en: 'Restaurants' }, value: 'Restaurants' },
        { label: { ar: 'الكافيهات', en: 'Coffee Shops' }, value: 'Coffee Shops' },
        { label: { ar: 'المخابز والحلويات', en: 'Bakeries & Sweets' }, value: 'Bakeries & Sweets' },
        { label: { ar: 'متاجر العصائر', en: 'Juice Shops' }, value: 'Juice Shops' },
        { label: { ar: 'محلات الشوكولاتة', en: 'Chocolate Shops' }, value: 'Chocolate Shops' },
        { label: { ar: 'مطاعم الوجبات السريعة', en: 'Fast Food' }, value: 'Fast Food' },
        { label: { ar: 'مطاعم صحية', en: 'Healthy Restaurants' }, value: 'Healthy Restaurants' },
        { label: { ar: 'عربات الطعام', en: 'Food Trucks' }, value: 'Food Trucks' },
        { label: { ar: 'شركات توريد الأغذية', en: 'Food Supply Companies' }, value: 'Food Supply Companies' },
    ]},
    { label: { ar: 'القطاع الطبي', en: 'Medical & Healthcare' }, options: [
        { label: { ar: 'العيادات', en: 'Medical Clinics' }, value: 'Medical Clinics' },
        { label: { ar: 'المستشفيات', en: 'Hospitals' }, value: 'Hospitals' },
        { label: { ar: 'المختبرات', en: 'Medical Laboratories' }, value: 'Medical Laboratories' },
        { label: { ar: 'الصيدليات', en: 'Pharmacies' }, value: 'Pharmacies' },
        { label: { ar: 'مراكز التجميل الطبي', en: 'Medical Beauty Centers' }, value: 'Medical Beauty Centers' },
        { label: { ar: 'مراكز العلاج الطبيعي', en: 'Physiotherapy Centers' }, value: 'Physiotherapy Centers' },
        { label: { ar: 'مراكز الأسنان', en: 'Dental Centers' }, value: 'Dental Centers' },
        { label: { ar: 'مراكز السمنة والتخسيس', en: 'Obesity & Slimming Centers' }, value: 'Obesity & Slimming Centers' },
        { label: { ar: 'مراكز التأهيل', en: 'Rehabilitation Centers' }, value: 'Rehabilitation Centers' },
        { label: { ar: 'مراكز الأشعة والتحاليل', en: 'Radiology & Analysis Centers' }, value: 'Radiology & Analysis Centers' },
        { label: { ar: 'أخصائيي التغذية', en: 'Nutritionists' }, value: 'Nutritionists' },
    ]},
    { label: { ar: 'القطاع التعليمي', en: 'Education & Training' }, options: [
        { label: { ar: 'المدارس', en: 'Schools' }, value: 'Schools' },
        { label: { ar: 'الجامعات', en: 'Universities' }, value: 'Universities' },
        { label: { ar: 'المعاهد', en: 'Institutes' }, value: 'Institutes' },
        { label: { ar: 'مراكز التدريب', en: 'Training Centers' }, value: 'Training Centers' },
        { label: { ar: 'كورسات أونلاين', en: 'Online Courses' }, value: 'Online Courses' },
        { label: { ar: 'أكاديميات الأطفال', en: 'Kids Academies' }, value: 'Kids Academies' },
        { label: { ar: 'مراكز اللغات', en: 'Language Centers' }, value: 'Language Centers' },
        { label: { ar: 'حضانات وروضات', en: 'Kindergartens' }, value: 'Kindergartens' },
        { label: { ar: 'مدربي تطوير الذات', en: 'Life Coaches' }, value: 'Life Coaches' },
        { label: { ar: 'التدريب الوظيفي', en: 'Career Training' }, value: 'Career Training' },
        { label: { ar: 'التدريب التقني والذكاء الاصطناعي', en: 'Tech & AI Training' }, value: 'Tech & AI Training' },
    ]},
    { label: { ar: 'العقارات', en: 'Real Estate' }, options: [
        { label: { ar: 'شركات التطوير العقاري', en: 'Real Estate Developers' }, value: 'Real Estate Developers' },
        { label: { ar: 'مكاتب الوساطة العقارية', en: 'Real Estate Brokerage' }, value: 'Real Estate Brokerage' },
        { label: { ar: 'شركات المقاولات', en: 'Contracting Companies' }, value: 'Contracting Companies' },
        { label: { ar: 'شركات التصميم الداخلي', en: 'Interior Design Firms' }, value: 'Interior Design Firms' },
        { label: { ar: 'شركات الاستشارات الهندسية', en: 'Engineering Consultancies' }, value: 'Engineering Consultancies' },
        { label: { ar: 'مكاتب الديكور والبناء', en: 'Decor & Construction' }, value: 'Decor & Construction' },
        { label: { ar: 'شركات الاستشارات العقارية', en: 'Real Estate Consultancy' }, value: 'Real Estate Consultancy' },
    ]},
    { label: { ar: 'القطاع الخيري والإنساني', en: 'Charity & NGOs' }, options: [
        { label: { ar: 'الجمعيات الخيرية', en: 'Charities' }, value: 'Charities' },
        { label: { ar: 'المنظمات غير الربحية', en: 'Non-Profit Organizations' }, value: 'Non-Profit Organizations' },
        { label: { ar: 'الحملات الموسمية', en: 'Seasonal Campaigns' }, value: 'Seasonal Campaigns' },
        { label: { ar: 'كفالة الأيتام', en: 'Orphan Sponsorship' }, value: 'Orphan Sponsorship' },
        { label: { ar: 'دعم الأسر المتعففة', en: 'Family Support' }, value: 'Family Support' },
        { label: { ar: 'مشاريع الإغاثة', en: 'Relief Projects' }, value: 'Relief Projects' },
        { label: { ar: 'حملات التبرعات', en: 'Donation Campaigns' }, value: 'Donation Campaigns' },
        { label: { ar: 'فرق العمل التطوعي', en: 'Volunteer Groups' }, value: 'Volunteer Groups' },
        { label: { ar: 'مشاريع بناء الآبار', en: 'Water Well Projects' }, value: 'Water Well Projects' },
        { label: { ar: 'التعليم والمساعدات الطبية', en: 'Education & Medical Aid' }, value: 'Education & Medical Aid' },
    ]},
    { label: { ar: 'قطاعات الخدمات', en: 'Services' }, options: [
        { label: { ar: 'الاستشارات', en: 'Consulting' }, value: 'Consulting' },
        { label: { ar: 'المحاماة', en: 'Legal Services' }, value: 'Legal Services' },
        { label: { ar: 'مكاتب السفر والسياحة', en: 'Travel Agencies' }, value: 'Travel Agencies' },
        { label: { ar: 'شركات إدارة الأملاك', en: 'Property Management' }, value: 'Property Management' },
        { label: { ar: 'مكاتب الترجمة', en: 'Translation Services' }, value: 'Translation Services' },
        { label: { ar: 'مكاتب المحاسبة', en: 'Accounting Firms' }, value: 'Accounting Firms' },
        { label: { ar: 'شركات التأمين', en: 'Insurance Companies' }, value: 'Insurance Companies' },
        { label: { ar: 'شركات تنظيم الفعاليات', en: 'Event Management' }, value: 'Event Management' },
        { label: { ar: 'شركات الإنتاج الإعلامي', en: 'Media Production' }, value: 'Media Production' },
        { label: { ar: 'شركات البرمجة والتقنية', en: 'Tech & Programming' }, value: 'Tech & Programming' },
        { label: { ar: 'صانعي المحتوى المستقلين', en: 'Freelance Content Creators' }, value: 'Freelance Content Creators' },
        { label: { ar: 'المصورين', en: 'Photographers' }, value: 'Photographers' },
        { label: { ar: 'شركات التنظيف', en: 'Cleaning Services' }, value: 'Cleaning Services' },
        { label: { ar: 'شركات مكافحة الحشرات', en: 'Pest Control' }, value: 'Pest Control' },
        { label: { ar: 'شركات الأمن والحراسة', en: 'Security Services' }, value: 'Security Services' },
    ]},
    { label: { ar: 'العناية والجمال', en: 'Beauty & Wellness' }, options: [
        { label: { ar: 'صالونات التجميل', en: 'Beauty Salons' }, value: 'Beauty Salons' },
        { label: { ar: 'الحلاقين', en: 'Barbershops' }, value: 'Barbershops' },
        { label: { ar: 'مراكز السبا', en: 'Spa Centers' }, value: 'Spa Centers' },
        { label: { ar: 'مراكز اللياقة البدنية', en: 'Fitness Centers' }, value: 'Fitness Centers' },
        { label: { ar: 'مراكز اليوغا', en: 'Yoga Centers' }, value: 'Yoga Centers' },
        { label: { ar: 'مدربي الرياضة', en: 'Fitness Coaches' }, value: 'Fitness Coaches' },
        { label: { ar: 'منتجات العناية بالبشرة والشعر', en: 'Skin & Hair Care Products' }, value: 'Skin & Hair Care Products' },
    ]},
    { label: { ar: 'السياحة والضيافة', en: 'Hospitality & Tourism' }, options: [
        { label: { ar: 'الفنادق', en: 'Hotels' }, value: 'Hotels' },
        { label: { ar: 'المنتجعات', en: 'Resorts' }, value: 'Resorts' },
        { label: { ar: 'الشقق الفندقية', en: 'Hotel Apartments' }, value: 'Hotel Apartments' },
        { label: { ar: 'شركات السياحة', en: 'Tourism Companies' }, value: 'Tourism Companies' },
        { label: { ar: 'شركات الرحلات البحرية', en: 'Cruise & Boat Trips' }, value: 'Cruise & Boat Trips' },
        { label: { ar: 'النوادي الرياضية', en: 'Sports Clubs' }, value: 'Sports Clubs' },
        { label: { ar: 'الاستراحات والشاليهات', en: 'Chalets & Rest Houses' }, value: 'Chalets & Rest Houses' },
    ]},
    { label: { ar: 'قطاع التكنولوجيا', en: 'Tech & Digital' }, options: [
        { label: { ar: 'شركات البرمجة', en: 'Software Development' }, value: 'Software Development' },
        { label: { ar: 'شركات التطوير', en: 'Development Agencies' }, value: 'Development Agencies' },
        { label: { ar: 'تطبيقات الجوال', en: 'Mobile Apps' }, value: 'Mobile Apps' },
        { label: { ar: 'شركات الأمن السيبراني', en: 'Cyber Security' }, value: 'Cyber Security' },
        { label: { ar: 'شركات SaaS', en: 'SaaS Companies' }, value: 'SaaS Companies' },
        { label: { ar: 'مواقع الخدمات الإلكترونية', en: 'Online Service Platforms' }, value: 'Online Service Platforms' },
        { label: { ar: 'منصات التعليم', en: 'EdTech Platforms' }, value: 'EdTech Platforms' },
        { label: { ar: 'شركات الذكاء الاصطناعي', en: 'AI Companies' }, value: 'AI Companies' },
        { label: { ar: 'شركات الألعاب الإلكترونية', en: 'Gaming Companies' }, value: 'Gaming Companies' },
    ]},
    { label: { ar: 'قطاع الإعلام والترفيه', en: 'Media & Entertainment' }, options: [
        { label: { ar: 'صناع المحتوى', en: 'Content Creators' }, value: 'Content Creators' },
        { label: { ar: 'المؤثرين', en: 'Influencers' }, value: 'Influencers' },
        { label: { ar: 'قنوات اليوتيوب', en: 'YouTube Channels' }, value: 'YouTube Channels' },
        { label: { ar: 'بودكاست', en: 'Podcasts' }, value: 'Podcasts' },
        { label: { ar: 'شركات الإنتاج', en: 'Production Houses' }, value: 'Production Houses' },
        { label: { ar: 'استوديوهات التصوير', en: 'Photography Studios' }, value: 'Photography Studios' },
        { label: { ar: 'صفحات الأخبار', en: 'News Pages' }, value: 'News Pages' },
        { label: { ar: 'صفحات الترفيه', en: 'Entertainment Pages' }, value: 'Entertainment Pages' },
        { label: { ar: 'صفحات الأفلام والمسلسلات', en: 'Movies & Series Pages' }, value: 'Movies & Series Pages' },
    ]},
    { label: { ar: 'قطاع السيارات', en: 'Automotive' }, options: [
        { label: { ar: 'معارض السيارات', en: 'Car Dealerships' }, value: 'Car Dealerships' },
        { label: { ar: 'شركات تقسيط السيارات', en: 'Car Financing' }, value: 'Car Financing' },
        { label: { ar: 'كاراجات ومراكز صيانة', en: 'Garages & Maintenance' }, value: 'Garages & Maintenance' },
        { label: { ar: 'مراكز تلميع السيارات', en: 'Car Detailing' }, value: 'Car Detailing' },
        { label: { ar: 'شركات غسيل متنقل', en: 'Mobile Car Wash' }, value: 'Mobile Car Wash' },
        { label: { ar: 'قطع الغيار والإكسسوارات', en: 'Spare Parts & Accessories' }, value: 'Spare Parts & Accessories' },
        { label: { ar: 'سيارات الليموزين', en: 'Limousine Services' }, value: 'Limousine Services' },
    ]},
    { label: { ar: 'الأعمال اليدوية', en: 'Handmade Business' }, options: [
        { label: { ar: 'الإكسسوارات اليدوية', en: 'Handmade Accessories' }, value: 'Handmade Accessories' },
        { label: { ar: 'الشمع اليدوي', en: 'Handmade Candles' }, value: 'Handmade Candles' },
        { label: { ar: 'الصابون الطبيعي', en: 'Natural Soap' }, value: 'Natural Soap' },
        { label: { ar: 'التطريز', en: 'Embroidery' }, value: 'Embroidery' },
        { label: { ar: 'التريكو والكروشيه', en: 'Knitting & Crochet' }, value: 'Knitting & Crochet' },
        { label: { ar: 'النحت الخشبي', en: 'Wood Carving' }, value: 'Wood Carving' },
        { label: { ar: 'الرسم', en: 'Painting' }, value: 'Painting' },
        { label: { ar: 'الصناديق الخشبية', en: 'Wooden Boxes' }, value: 'Wooden Boxes' },
        { label: { ar: 'الهدايا المخصصة', en: 'Customized Gifts' }, value: 'Customized Gifts' },
        { label: { ar: 'الفخار والسيراميك', en: 'Pottery & Ceramics' }, value: 'Pottery & Ceramics' },
        { label: { ar: 'صناعة الأقمشة اليدوية', en: 'Handmade Fabrics' }, value: 'Handmade Fabrics' },
        { label: { ar: 'فن الريزن', en: 'Resin Art' }, value: 'Resin Art' },
        { label: { ar: 'مكرمية', en: 'Macrame' }, value: 'Macrame' },
        { label: { ar: 'الحقائب اليدوية', en: 'Handmade Bags' }, value: 'Handmade Bags' },
        { label: { ar: 'منتجات الديكور اليدوية', en: 'Handmade Decor' }, value: 'Handmade Decor' },
        { label: { ar: 'إعادة التدوير', en: 'Recycling Crafts' }, value: 'Recycling Crafts' },
    ]},
    { label: { ar: 'الأعمال الحرفية', en: 'Crafts & Trades' }, options: [
        { label: { ar: 'النجارة', en: 'Carpentry' }, value: 'Carpentry' },
        { label: { ar: 'السباكة', en: 'Plumbing' }, value: 'Plumbing' },
        { label: { ar: 'الكهرباء', en: 'Electrical Services' }, value: 'Electrical Services' },
        { label: { ar: 'الحدادة', en: 'Blacksmithing' }, value: 'Blacksmithing' },
        { label: { ar: 'النقاشة والدهانات', en: 'Painting & Decorating' }, value: 'Painting & Decorating' },
        { label: { ar: 'الجبس والديكور', en: 'Gypsum & Decor' }, value: 'Gypsum & Decor' },
        { label: { ar: 'البلاط والسيراميك', en: 'Tiling & Ceramics' }, value: 'Tiling & Ceramics' },
        { label: { ar: 'التكييف', en: 'HVAC / AC Services' }, value: 'HVAC / AC Services' },
        { label: { ar: 'التمديدات الصحية', en: 'Sanitary Installations' }, value: 'Sanitary Installations' },
        { label: { ar: 'اللحام', en: 'Welding' }, value: 'Welding' },
        { label: { ar: 'الميكانيكا', en: 'Mechanics' }, value: 'Mechanics' },
        { label: { ar: 'السمكرة', en: 'Auto Body Repair' }, value: 'Auto Body Repair' },
        { label: { ar: 'النجارة المعدنية (الألوميتال)', en: 'Aluminum Works' }, value: 'Aluminum Works' },
        { label: { ar: 'صيانة المنازل', en: 'Home Maintenance' }, value: 'Home Maintenance' },
        { label: { ar: 'المسّاحين والبنائين', en: 'Surveying & Building' }, value: 'Surveying & Building' },
        { label: { ar: 'الجرانيت والرخام', en: 'Granite & Marble' }, value: 'Granite & Marble' },
        { label: { ar: 'الحرفي متعدد المهام', en: 'Handyman' }, value: 'Handyman' },
        { label: { ar: 'صيانة الهواتف', en: 'Mobile Repair' }, value: 'Mobile Repair' },
        { label: { ar: 'صيانة الكمبيوتر', en: 'Computer Repair' }, value: 'Computer Repair' },
        { label: { ar: 'طباعة التيشيرتات', en: 'T-Shirt Printing' }, value: 'T-Shirt Printing' },
        { label: { ar: 'النقش بالليزر', en: 'Laser Engraving' }, value: 'Laser Engraving' },
        { label: { ar: 'الطباعة الحرارية', en: 'Thermal Printing' }, value: 'Thermal Printing' },
        { label: { ar: 'مكائن CNC', en: 'CNC Machining' }, value: 'CNC Machining' },
        { label: { ar: 'صانعي الدروع والهدايا الخشبية', en: 'Trophies & Wooden Gifts' }, value: 'Trophies & Wooden Gifts' },
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
    },
    {
        label: { ar: 'المطبوعات الورقية', en: 'Print & Documents' },
        options: [
            { label: { ar: 'A4 / A3 عمودي', en: 'A4/A3 Vertical' }, value: '3:4', desc: 'Standard Paper Vertical' },
            { label: { ar: 'A4 / A3 أفقي', en: 'A4/A3 Horizontal' }, value: '4:3', desc: 'Standard Paper Horizontal' },
            { label: { ar: 'بطاقة عمل (Business Card)', en: 'Business Card' }, value: '16:9', desc: 'Standard Business Card' },
        ]
    },
    {
        label: { ar: 'اللوحات والرول أب', en: 'Banners & Marketing' },
        options: [
            { label: { ar: 'رول أب (Roll-up Banner)', en: 'Roll-up Banner' }, value: '9:16', desc: 'Tall Vertical Banner' },
            { label: { ar: 'بانر موقع (Hero/Billboard)', en: 'Website Hero / Billboard' }, value: '16:9', desc: 'Wide Horizontal Banner' },
            { label: { ar: 'إعلان مستطيل (Leaderboard)', en: 'Leaderboard Ad' }, value: '16:9', desc: 'Standard Web Ad' },
        ]
    }
];

export const CAMERA_ANGLES = [
    { label: { ar: 'مستوى العين', en: 'Eye Level' }, value: 'Eye Level', icon: '👁️' },
    { label: { ar: 'زاوية منخفضة', en: 'Low Angle' }, value: 'Low Angle', icon: '⬇️' },
    { label: { ar: 'زاوية مرتفعة', en: 'High Angle' }, value: 'High Angle', icon: '⬆️' },
    { label: { ar: 'من الأعلى (Top Down)', en: 'Top Down' }, value: 'Top Down (Flat Lay)', icon: '🦅' },
    { label: { ar: 'الزاوية الألمانية (مائلة)', en: 'Dutch Angle' }, value: 'Dutch Angle', icon: '📐' },
    { label: { ar: 'ماكرو (قريب جداً)', en: 'Macro' }, value: 'Macro Close-up', icon: '🔍' },
    { label: { ar: 'زاوية عريضة', en: 'Wide Angle' }, value: 'Wide Angle', icon: '↔️' },
    { label: { ar: 'عين السمكة', en: 'Fisheye' }, value: 'Fisheye Lens', icon: '🐡' },
    { label: { ar: 'تصوير جوي (درون)', en: 'Drone Shot' }, value: 'Aerial Drone Shot', icon: '🚁' },
    { label: { ar: 'منظور الشخص الأول', en: 'POV' }, value: 'POV', icon: '🕶️' },
    { label: { ar: 'من فوق الكتف', en: 'Over Shoulder' }, value: 'Over-the-Shoulder', icon: '👥' },
];

export const LIGHTING_STYLES = [
    { label: { ar: 'طبيعي', en: 'Natural' }, value: 'Natural Lighting', icon: '☀️' },
    { label: { ar: 'سينمائي', en: 'Cinematic' }, value: 'Cinematic Lighting', icon: '🎬' },
    { label: { ar: 'ستوديو', en: 'Studio' }, value: 'Studio Lighting', icon: '💡' },
    { label: { ar: 'نيون', en: 'Neon' }, value: 'Neon Lighting', icon: '🟣' },
    { label: { ar: 'ساعة ذهبية', en: 'Golden Hour' }, value: 'Golden Hour', icon: '🌅' },
    { label: { ar: 'ساعة زرقاء', en: 'Blue Hour' }, value: 'Blue Hour', icon: '🌌' },
    { label: { ar: 'إضاءة رامبرانت', en: 'Rembrandt' }, value: 'Rembrandt Lighting', icon: '🎨' },
    { label: { ar: 'إضاءة خلفية (Rim)', en: 'Rim Lighting' }, value: 'Rim Lighting', icon: '🌑' },
    { label: { ar: 'إضاءة ضبابية (Volumetric)', en: 'Volumetric' }, value: 'Volumetric Lighting', icon: '🌫️' },
    { label: { ar: 'سوفت بوكس (ناعم)', en: 'Softbox' }, value: 'Softbox Lighting', icon: '☁️' },
    { label: { ar: 'ضوء حاد (Hard)', en: 'Hard Light' }, value: 'Hard Light', icon: '🔦' },
    { label: { ar: 'ضوء شموع', en: 'Candlelight' }, value: 'Candlelight', icon: '🕯️' },
    { label: { ar: 'مضيء حيوياً', en: 'Bioluminescent' }, value: 'Bioluminescent', icon: '🍄' },
    { label: { ar: 'رينج لايت', en: 'Ring Light' }, value: 'Ring Light', icon: '⭕' },
];

export const PRODUCT_SCENES_GROUPED = [
    {
        label: { ar: 'فاخر ومنصات العرض', en: 'Luxury & Podium' },
        options: [
            { label: { ar: 'منصة رخامية', en: 'Marble Podium' }, value: 'Marble Podium, Elegant', icon: '🏛️' },
            { label: { ar: 'لمسات ذهبية', en: 'Gold Accents' }, value: 'Gold Accent Minimal', icon: '✨' },
            { label: { ar: 'قماش مخملي', en: 'Velvet Fabric' }, value: 'Luxurious Velvet Fabric', icon: '🧶' },
            { label: { ar: 'مينيمال (أقل تفاصيل)', en: 'Minimalist' }, value: 'Clean Minimalist Stage', icon: '⚪' },
            { label: { ar: 'زجاج وماء', en: 'Glass & Water' }, value: 'Glass Surface with Water', icon: '💧' },
        ]
    },
    {
        label: { ar: 'الطبيعة والعناصر', en: 'Nature & Elements' },
        options: [
            { label: { ar: 'شاطئ استوائي', en: 'Tropical Beach' }, value: 'Tropical Beach Sand', icon: '🏖️' },
            { label: { ar: 'غابة خضراء', en: 'Green Forest' }, value: 'Mossy Green Forest', icon: '🌲' },
            { label: { ar: 'صحراء وكثبان', en: 'Desert Dunes' }, value: 'Golden Desert Dunes', icon: '🏜️' },
            { label: { ar: 'قمة جبل ثلجي', en: 'Snowy Mountain' }, value: 'Snowy Mountain Peak', icon: '🏔️' },
            { label: { ar: 'تحت الماء', en: 'Underwater' }, value: 'Deep Blue Underwater', icon: '🌊' },
            { label: { ar: 'سماء وغيوم', en: 'Sky & Clouds' }, value: 'Blue Sky Fluffy Clouds', icon: '☁️' },
            { label: { ar: 'زهور الربيع', en: 'Spring Flowers' }, value: 'Blooming Spring Flowers', icon: '🌸' },
            { label: { ar: 'أوراق الخريف', en: 'Autumn Leaves' }, value: 'Fallen Autumn Leaves', icon: '🍂' },
            { label: { ar: 'صخور طبيعية', en: 'Natural Rocks' }, value: 'Natural Stone Rocks', icon: '🪨' },
        ]
    },
    {
        label: { ar: 'مودرن وحياة يومية', en: 'Urban & Lifestyle' },
        options: [
            { label: { ar: 'مطبخ عصري', en: 'Modern Kitchen' }, value: 'Modern Kitchen Counter', icon: '🍳' },
            { label: { ar: 'غرفة معيشة', en: 'Living Room' }, value: 'Cozy Living Room', icon: '🛋️' },
            { label: { ar: 'مكتب عمل', en: 'Office Desk' }, value: 'Professional Office Desk', icon: '💼' },
            { label: { ar: 'طاولة مقهى', en: 'Cafe Table' }, value: 'Outdoor Cafe Table', icon: '☕' },
            { label: { ar: 'شارع مدينة ليلاً', en: 'City Night' }, value: 'City Street Night Bokeh', icon: '🌃' },
            { label: { ar: 'جدار جرافيتي', en: 'Graffiti Wall' }, value: 'Urban Graffiti Wall', icon: '🎨' },
            { label: { ar: 'سطح بناية', en: 'Rooftop View' }, value: 'Rooftop City View', icon: '🏙️' },
            { label: { ar: 'صالة جيم', en: 'Gym Interior' }, value: 'Modern Gym Background', icon: '🏋️' },
        ]
    },
    {
        label: { ar: 'صناعي ومهني', en: 'Industrial & Professional' },
        options: [
            { label: { ar: 'مستودع (Warehouse)', en: 'Warehouse' }, value: 'Industrial Warehouse', icon: '🏭' },
            { label: { ar: 'معدن خام', en: 'Raw Metal' }, value: 'Brushed Metal Surface', icon: '🔩' },
            { label: { ar: 'أنابيب صناعية', en: 'Industrial Pipes' }, value: 'Industrial Piping Background', icon: '🔧' },
            { label: { ar: 'ورشة عمل', en: 'Workshop' }, value: 'Craftsman Workshop', icon: '🛠️' },
        ]
    },
    {
        label: { ar: 'عمارة وديكور', en: 'Architecture & Decor' },
        options: [
            { label: { ar: 'فيلا مودرن', en: 'Modern Villa' }, value: 'Modern Minimalist Villa', icon: '🏡' },
            { label: { ar: 'قوس تاريخي', en: 'Historical Arch' }, value: 'Ancient Stone Archway', icon: '🏛️' },
            { label: { ar: 'خرسانة معمارية', en: 'Brutalist Concrete' }, value: 'Architectural Concrete Wall', icon: '🧱' },
            { label: { ar: 'حديقة زن', en: 'Zen Garden' }, value: 'Japanese Zen Garden', icon: '🎋' },
        ]
    },
    {
        label: { ar: 'خيال وفنتازيا', en: 'Fantasy & Sci-Fi' },
        options: [
            { label: { ar: 'غابة سحرية', en: 'Magical Forest' }, value: 'Glowing Magical Forest', icon: '🧚‍♀️' },
            { label: { ar: 'جزر عائمة', en: 'Floating Islands' }, value: 'Floating Islands in Sky', icon: '🏝️' },
            { label: { ar: 'بوابة زمنية', en: 'Portal' }, value: 'Sci-Fi Glowing Portal', icon: '🌀' },
            { label: { ar: 'كوكب فضائي', en: 'Alien Planet' }, value: 'Alien Landscape', icon: '🪐' },
        ]
    },
    {
        label: { ar: 'منزلي ودافئ', en: 'Domestic & Cozy' },
        options: [
            { label: { ar: 'طاولة طعام', en: 'Dining Table' }, value: 'Feast Dining Table', icon: '🍽️' },
            { label: { ar: 'حمام فاخر', en: 'Luxury Bathroom' }, value: 'Spa Bathroom Vanity', icon: '🛁' },
            { label: { ar: 'طاولة سرير', en: 'Bedside Table' }, value: 'Cozy Bedside Nightstand', icon: '🛏️' },
            { label: { ar: 'غرفة غسيل', en: 'Laundry Room' }, value: 'Bright Laundry Room', icon: '🧺' },
        ]
    },
    {
        label: { ar: 'مغامرة وخارجي', en: 'Adventure & Outdoors' },
        options: [
            { label: { ar: 'موقع تخييم', en: 'Camping Site' }, value: 'Camping Tent by Lake', icon: '⛺' },
            { label: { ar: 'حافة منحدر', en: 'Cliff Edge' }, value: 'Mountain Cliff Edge', icon: '🧗' },
            { label: { ar: 'حقل قمح', en: 'Wheat Field' }, value: 'Golden Wheat Field', icon: '🌾' },
            { label: { ar: 'شلال مياه', en: 'Waterfall' }, value: 'Tropical Waterfall', icon: '🌊' },
        ]
    },
    {
        label: { ar: 'فني وتجريدي', en: 'Abstract & Artistic' },
        options: [
            { label: { ar: 'سايبربانك نيون', en: 'Cyberpunk Neon' }, value: 'Cyberpunk Neon Lights', icon: '🟣' },
            { label: { ar: 'أشكال هندسية', en: 'Geometric Shapes' }, value: 'Abstract Geometric Shapes', icon: '🔺' },
            { label: { ar: 'دخان ملون', en: 'Colored Smoke' }, value: 'Swirling Colored Smoke', icon: '💨' },
            { label: { ar: 'سائل متدفق', en: 'Fluid Liquid' }, value: 'Abstract Fluid Art', icon: '🧪' },
            { label: { ar: 'فضاء ومجرات', en: 'Space Galaxy' }, value: 'Deep Space Galaxy', icon: '🌌' },
            { label: { ar: 'تدرج باستيل', en: 'Pastel Gradient' }, value: 'Soft Pastel Gradient', icon: '🌈' },
            { label: { ar: 'انعدام الجاذبية', en: 'Zero Gravity' }, value: 'Floating Zero Gravity', icon: '🛸' },
            { label: { ar: 'رشة طلاء', en: 'Paint Splash' }, value: 'Exploding Paint Splash', icon: '🎨' },
            { label: { ar: 'فن الورق', en: 'Paper Art' }, value: 'Layered Paper Cutout Art', icon: '✂️' },
        ]
    },
    {
        label: { ar: 'خامات وأقمشة', en: 'Materials & Textures' },
        options: [
            { label: { ar: 'حرير وستان', en: 'Silk & Satin' }, value: 'Flowing Silk Fabric', icon: '🧣' },
            { label: { ar: 'خشب ريفي', en: 'Rustic Wood' }, value: 'Aged Rustic Wood', icon: '🪵' },
            { label: { ar: 'خرسانة خام', en: 'Raw Concrete' }, value: 'Industrial Concrete Wall', icon: '🧱' },
            { label: { ar: 'جلد فاخر', en: 'Leather Texture' }, value: 'Premium Leather Texture', icon: '👜' },
            { label: { ar: 'سيراميك وبلاط', en: 'Ceramic Tiles' }, value: 'Clean Ceramic Tiles', icon: '🛁' },
        ]
    },
    {
        label: { ar: 'مواسم ومناسبات', en: 'Seasonal' },
        options: [
            { label: { ar: 'أجواء رمضانية', en: 'Ramadan Vibes' }, value: 'Ramadan Lanterns & Crescent', icon: '🌙' },
            { label: { ar: 'عيد واحتفال', en: 'Festive Party' }, value: 'Confetti & Party Balloons', icon: '🎉' },
            { label: { ar: 'شتاء وثلج', en: 'Winter Snow' }, value: 'Winter Snowflakes & Frost', icon: '❄️' },
            { label: { ar: 'صيف مشمس', en: 'Summer Sun' }, value: 'Bright Summer Sunlight', icon: '☀️' },
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
            { label: { ar: 'مربع (1:1) - انستجرام/فيسبوك', en: 'Square (1:1) - IG/FB' }, value: '1:1' },
            { label: { ar: 'بورتريه (4:5) - انستجرام', en: 'Portrait (4:5) - IG' }, value: '4:5' },
            { label: { ar: 'قصة/ريلز (9:16) - تيك توك/سناب', en: 'Story/Reels (9:16) - TikTok/Snap' }, value: '9:16' },
            { label: { ar: 'عرضي (16:9) - يوتيوب/تويتر', en: 'Landscape (16:9) - YouTube/X' }, value: '16:9' },
            { label: { ar: 'غلاف فيسبوك (عرضي)', en: 'Facebook Cover' }, value: 'FB_Cover' }, 
            { label: { ar: 'رأسية تويتر (3:1)', en: 'Twitter Header' }, value: 'Twitter_Header' }, 
            { label: { ar: 'منشور لينكد إن (4:3)', en: 'LinkedIn Post (4:3)' }, value: 'LinkedIn_Post' },
        ]
    },
    {
        label: { ar: 'المطبوعات الورقية', en: 'Print & Paper' },
        options: [
            { label: { ar: 'A4 عمودي (Vertical)', en: 'A4 Vertical' }, value: 'A4_V' },
            { label: { ar: 'A4 أفقي (Horizontal)', en: 'A4 Horizontal' }, value: 'A4_H' },
            { label: { ar: 'A3 عمودي (Vertical)', en: 'A3 Vertical' }, value: 'A3_V' },
            { label: { ar: 'A3 أفقي (Horizontal)', en: 'A3 Horizontal' }, value: 'A3_H' },
            { label: { ar: 'A5 عمودي (Vertical)', en: 'A5 Vertical' }, value: 'A5_V' },
            { label: { ar: 'A5 أفقي (Horizontal)', en: 'A5 Horizontal' }, value: 'A5_H' },
            { label: { ar: 'بطاقة عمل (Business Card)', en: 'Business Card' }, value: 'BizCard' },
            { label: { ar: 'فلاير (DL)', en: 'Flyer (DL)' }, value: 'Flyer_DL' },
        ]
    },
    {
        label: { ar: 'البنرات والرول أب', en: 'Banners & Displays' },
        options: [
            { label: { ar: 'رول أب (Roll-up 85x200)', en: 'Roll-up Banner' }, value: 'Rollup' }, 
            { label: { ar: 'اكس بانر (X-Banner)', en: 'X-Banner' }, value: 'X_Banner' }, 
            { label: { ar: 'لوحة إعلانية (Billboard)', en: 'Billboard' }, value: 'Billboard' }, 
            { label: { ar: 'بانر ويب عريض (Leaderboard)', en: 'Web Leaderboard' }, value: 'Web_Leaderboard' }, 
            { label: { ar: 'بانر جانبي (Skyscraper)', en: 'Web Skyscraper' }, value: 'Web_Skyscraper' },
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
