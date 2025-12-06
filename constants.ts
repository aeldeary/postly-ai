
export const ARCHIVE_STORAGE_KEY = 'postly_archive_v1';

export const UI_TRANSLATIONS = {
  dashboard: { ar: 'الرئيسية', en: 'Dashboard' },
  ideaGenerator: { ar: 'مولد الأفكار', en: 'Idea Generator' },
  instantSummary: { ar: 'الملخص الفوري', en: 'Instant Summary' },
  contentStudio: { ar: 'استوديو المحتوى', en: 'Content Studio' },
  websiteContent: { ar: 'محتوى الموقع', en: 'Website Content' },
  imageStudio: { ar: 'استوديو الصور', en: 'Image Studio' },
  professionalProduct: { ar: 'منتج احترافي', en: 'Professional Product' },
  postlySpaces: { ar: 'مساحات العمل', en: 'Postly Spaces' },
  createVideo: { ar: 'إنشاء فيديو', en: 'Create Video' },
  createAudio: { ar: 'إنشاء صوت', en: 'Create Audio' },
  brandKit: { ar: 'هوية البراند', en: 'Brand Kit' },
  styleTraining: { ar: 'مدرب الأسلوب', en: 'Style Training' },
  archive: { ar: 'الأرشيف', en: 'Archive' },
  settings: { ar: 'الإعدادات', en: 'Settings' },
  about: { ar: 'عن التطبيق', en: 'About' },
  graphicDesigner: { ar: 'مصمم الجرافيك', en: 'Graphic Designer' },
  infographicDesigner: { ar: 'صانع الانفوجرافيك', en: 'Infographic Designer' },
  templates: { ar: 'القوالب', en: 'Templates' },
  brandIdentity: { ar: 'هوية البراند', en: 'Brand Identity' },
  styleTrainer: { ar: 'مدرب الأسلوب', en: 'Style Trainer' },
  tabCreate: { ar: 'إنشاء', en: 'Create' },
  tabBlend: { ar: 'دمج', en: 'Blend' },
  tabColor: { ar: 'تعديل الألوان', en: 'Color Correction' },
  tabUpscale: { ar: 'رفع الجودة', en: 'Upscale' },
  tabRestore: { ar: 'استعادة', en: 'Restore' },
  imageBlender: { ar: 'دمج الصور', en: 'Image Blender' },
  roleNotUsed: { ar: 'غير مستخدم', en: 'Not Used' },
  roleSubject: { ar: 'العنصر الأساسي', en: 'Subject' },
  roleBackground: { ar: 'الخلفية', en: 'Background' },
  roleStyle: { ar: 'مرجع النمط', en: 'Style Reference' },
  rolePalette: { ar: 'لوحة الألوان', en: 'Color Palette' },
  roleLighting: { ar: 'الإضاءة', en: 'Lighting Reference' },
  blenderDescPlaceholder: { ar: 'صف المشهد النهائي الذي تريده...', en: 'Describe the final scene you want...' },
  synthesizeImage: { ar: 'توليد الصورة المدمجة', en: 'Synthesize Blended Image' }
};

export const LANGUAGES_GROUPED = [
// ... existing constants ...
  {
    label: { ar: 'اللغات الأكثر استخدامًا', en: 'Most Used Languages' },
    options: [
      { label: { ar: 'الإنجليزية', en: 'English' }, value: 'English' },
      { label: { ar: 'العربية', en: 'Arabic' }, value: 'Arabic' },
      { label: { ar: 'الإسبانية', en: 'Spanish' }, value: 'Spanish' },
      { label: { ar: 'الفرنسية', en: 'French' }, value: 'French' },
      { label: { ar: 'الصينية (ماندرين)', en: 'Chinese (Mandarin)' }, value: 'Chinese (Mandarin)' },
      { label: { ar: 'الهندية', en: 'Hindi' }, value: 'Hindi' },
      { label: { ar: 'البرتغالية', en: 'Portuguese' }, value: 'Portuguese' },
      { label: { ar: 'الروسية', en: 'Russian' }, value: 'Russian' },
    ]
  },
// ... remaining existing constants ...
  {
    label: { ar: 'لغات آسيا', en: 'Asian Languages' },
    options: [
      { label: { ar: 'الصينية', en: 'Chinese' }, value: 'Chinese' },
      { label: { ar: 'اليابانية', en: 'Japanese' }, value: 'Japanese' },
      { label: { ar: 'الكورية', en: 'Korean' }, value: 'Korean' },
      { label: { ar: 'الهندية', en: 'Hindi' }, value: 'Hindi' },
      { label: { ar: 'الأوردو', en: 'Urdu' }, value: 'Urdu' },
      { label: { ar: 'البنغالية', en: 'Bengali' }, value: 'Bengali' },
      { label: { ar: 'التاميلية', en: 'Tamil' }, value: 'Tamil' },
      { label: { ar: 'التيلوجو', en: 'Telugu' }, value: 'Telugu' },
      { label: { ar: 'السنهالية', en: 'Sinhala' }, value: 'Sinhala' },
      { label: { ar: 'التايلاندية', en: 'Thai' }, value: 'Thai' },
      { label: { ar: 'الفلبينية / التاغالوغ', en: 'Filipino / Tagalog' }, value: 'Filipino' },
      { label: { ar: 'الإندونيسية', en: 'Indonesian' }, value: 'Indonesian' },
      { label: { ar: 'الماليزية', en: 'Malay' }, value: 'Malay' },
      { label: { ar: 'الفيتنامية', en: 'Vietnamese' }, value: 'Vietnamese' },
      { label: { ar: 'الخمير', en: 'Khmer' }, value: 'Khmer' },
      { label: { ar: 'البورمية', en: 'Burmese' }, value: 'Burmese' },
      { label: { ar: 'العربية', en: 'Arabic' }, value: 'Arabic' },
      { label: { ar: 'الفارسية', en: 'Persian' }, value: 'Persian' },
      { label: { ar: 'التركية', en: 'Turkish' }, value: 'Turkish' },
      { label: { ar: 'الكردية', en: 'Kurdish' }, value: 'Kurdish' },
    ]
  },
  {
    label: { ar: 'لغات أوروبا', en: 'European Languages' },
    options: [
      { label: { ar: 'الإنجليزية', en: 'English' }, value: 'English' },
      { label: { ar: 'الفرنسية', en: 'French' }, value: 'French' },
      { label: { ar: 'الألمانية', en: 'German' }, value: 'German' },
      { label: { ar: 'الهولندية', en: 'Dutch' }, value: 'Dutch' },
      { label: { ar: 'الإسبانية', en: 'Spanish' }, value: 'Spanish' },
      { label: { ar: 'البرتغالية', en: 'Portuguese' }, value: 'Portuguese' },
      { label: { ar: 'الإيطالية', en: 'Italian' }, value: 'Italian' },
      { label: { ar: 'اليونانية', en: 'Greek' }, value: 'Greek' },
      { label: { ar: 'الروسية', en: 'Russian' }, value: 'Russian' },
      { label: { ar: 'البولندية', en: 'Polish' }, value: 'Polish' },
      { label: { ar: 'الأوكرانية', en: 'Ukrainian' }, value: 'Ukrainian' },
      { label: { ar: 'التشيكية', en: 'Czech' }, value: 'Czech' },
      { label: { ar: 'السلوفاكية', en: 'Slovak' }, value: 'Slovak' },
      { label: { ar: 'الهنغارية', en: 'Hungarian' }, value: 'Hungarian' },
      { label: { ar: 'الرومانية', en: 'Romanian' }, value: 'Romanian' },
      { label: { ar: 'السويدية', en: 'Swedish' }, value: 'Swedish' },
      { label: { ar: 'النرويجية', en: 'Norwegian' }, value: 'Norwegian' },
      { label: { ar: 'الدنماركية', en: 'Danish' }, value: 'Danish' },
      { label: { ar: 'الفنلندية', en: 'Finnish' }, value: 'Finnish' },
      { label: { ar: 'الأيسلندية', en: 'Icelandic' }, value: 'Icelandic' },
      { label: { ar: 'الصربية', en: 'Serbian' }, value: 'Serbian' },
      { label: { ar: 'الكرواتية', en: 'Croatian' }, value: 'Croatian' },
      { label: { ar: 'الألبانية', en: 'Albanian' }, value: 'Albanian' },
    ]
  },
  {
    label: { ar: 'لغات أفريقيا', en: 'African Languages' },
    options: [
      { label: { ar: 'العربية', en: 'Arabic' }, value: 'Arabic' },
      { label: { ar: 'الأمازيغية', en: 'Amazigh / Berber' }, value: 'Amazigh' },
      { label: { ar: 'السواحيلية', en: 'Swahili' }, value: 'Swahili' },
      { label: { ar: 'الأمهرية', en: 'Amharic' }, value: 'Amharic' },
      { label: { ar: 'التيجرينية', en: 'Tigrinya' }, value: 'Tigrinya' },
      { label: { ar: 'الصومالية', en: 'Somali' }, value: 'Somali' },
      { label: { ar: 'الزولو', en: 'Zulu' }, value: 'Zulu' },
      { label: { ar: 'الخوسا', en: 'Xhosa' }, value: 'Xhosa' },
      { label: { ar: 'الأفريقانية', en: 'Afrikaans' }, value: 'Afrikaans' },
      { label: { ar: 'الهوسا', en: 'Hausa' }, value: 'Hausa' },
      { label: { ar: 'اليوروبا', en: 'Yoruba' }, value: 'Yoruba' },
      { label: { ar: 'الإيغبو', en: 'Igbo' }, value: 'Igbo' },
      { label: { ar: 'الفولاني', en: 'Fula' }, value: 'Fula' },
      { label: { ar: 'اللينجالا', en: 'Lingala' }, value: 'Lingala' },
      { label: { ar: 'الكيكونغو', en: 'Kikongo' }, value: 'Kikongo' },
    ]
  }
];

export const ARABIC_DIALECTS_GROUPED = [
// ... existing code ...
  {
    label: { ar: '🇪🇬 مصر', en: 'Egypt 🇪🇬' },
    options: [
      { label: { ar: 'اللهجة القاهرية (المصرية العامة)', en: 'Cairene (General Egyptian)' }, value: 'Egyptian Cairene Dialect' },
      { label: { ar: 'اللهجة الصعيدية', en: 'Sa\'idi Dialect' }, value: 'Egyptian Saidi Dialect' },
      { label: { ar: 'اللهجة الإسكندرانية', en: 'Alexandrian Dialect' }, value: 'Egyptian Alexandrian Dialect' }
    ]
  },
  {
    label: { ar: '🇸🇦 السعودية', en: 'Saudi Arabia 🇸🇦' },
    options: [
      { label: { ar: 'اللهجة النجدية (الرياض وما حولها)', en: 'Najdi (Riyadh)' }, value: 'Saudi Najdi Dialect' },
      { label: { ar: 'اللهجة الحجازية (مكة والمدينة)', en: 'Hijazi (Makkah & Madinah)' }, value: 'Saudi Hijazi Dialect' },
      { label: { ar: 'اللهجة الجنوبية (عسير وجازان)', en: 'Southern (Asir & Jazan)' }, value: 'Saudi Southern Dialect' }
    ]
  },
  {
    label: { ar: '🇰🇼 الكويت', en: 'Kuwait 🇰🇼' },
    options: [
      { label: { ar: 'اللهجة الكويتية العامة', en: 'General Kuwaiti' }, value: 'General Kuwaiti Dialect' },
      { label: { ar: 'اللهجة الكويتية البدوية', en: 'Kuwaiti Bedouin' }, value: 'Kuwaiti Bedouin Dialect' }
    ]
  },
  {
    label: { ar: '🇦🇪 الإمارات', en: 'UAE 🇦🇪' },
    options: [
      { label: { ar: 'اللهجة الإماراتية العامة', en: 'General Emirati' }, value: 'General Emirati Dialect' },
      { label: { ar: 'لهجة دبي وأبوظبي (الحضرية)', en: 'Dubai & Abu Dhabi (Urban)' }, value: 'Emirati Urban Dialect' }
    ]
  },
  {
    label: { ar: '🇶🇦 قطر', en: 'Qatar 🇶🇦' },
    options: [
      { label: { ar: 'اللهجة القطرية العامة', en: 'General Qatari' }, value: 'General Qatari Dialect' },
      { label: { ar: 'لهجة الدوحة', en: 'Doha Dialect' }, value: 'Qatari Doha Dialect' }
    ]
  },
  {
    label: { ar: '🇴🇲 سلطنة عُمان', en: 'Oman 🇴🇲' },
    options: [
      { label: { ar: 'اللهجة العُمانية العامة', en: 'General Omani' }, value: 'General Omani Dialect' },
      { label: { ar: 'لهجة ظفار (جنوبية)', en: 'Dhofari (Southern)' }, value: 'Omani Dhofari Dialect' }
    ]
  },
  {
    label: { ar: '🇧🇭 البحرين', en: 'Bahrain 🇧🇭' },
    options: [
      { label: { ar: 'اللهجة البحرينية العامة', en: 'General Bahraini' }, value: 'General Bahraini Dialect' },
      { label: { ar: 'لهجة المحرق', en: 'Muharraq Dialect' }, value: 'Bahraini Muharraq Dialect' }
    ]
  },
  {
    label: { ar: '🇯🇴 الأردن', en: 'Jordan 🇯🇴' },
    options: [
      { label: { ar: 'اللهجة الأردنية العامة', en: 'General Jordanian' }, value: 'General Jordanian Dialect' },
      { label: { ar: 'اللهجة البدوية الأردنية', en: 'Jordanian Bedouin' }, value: 'Jordanian Bedouin Dialect' }
    ]
  },
  {
    label: { ar: '🇱🇧 لبنان', en: 'Lebanon 🇱🇧' },
    options: [
      { label: { ar: 'اللهجة اللبنانية العامة', en: 'General Lebanese' }, value: 'General Lebanese Dialect' },
      { label: { ar: 'لهجة بيروت', en: 'Beirut Dialect' }, value: 'Lebanese Beirut Dialect' },
      { label: { ar: 'لهجة الجبل', en: 'Mountain (Jabal) Dialect' }, value: 'Lebanese Mountain Dialect' }
    ]
  },
  {
    label: { ar: '🇸🇾 سوريا', en: 'Syria 🇸🇾' },
    options: [
      { label: { ar: 'اللهجة السورية العامة', en: 'General Syrian' }, value: 'General Syrian Dialect' },
      { label: { ar: 'لهجة دمشق', en: 'Damascus Dialect' }, value: 'Syrian Damascus Dialect' },
      { label: { ar: 'لهجة حلب', en: 'Aleppo Dialect' }, value: 'Syrian Aleppo Dialect' }
    ]
  },
  {
    label: { ar: '🇵🇸 فلسطين', en: 'Palestine 🇵🇸' },
    options: [
      { label: { ar: 'اللهجة الفلسطينية العامة', en: 'General Palestinian' }, value: 'General Palestinian Dialect' },
      { label: { ar: 'لهجة القدس', en: 'Jerusalem Dialect' }, value: 'Palestinian Jerusalem Dialect' },
      { label: { ar: 'لهجة غزة', en: 'Gaza Dialect' }, value: 'Palestinian Gaza Dialect' }
    ]
  },
  {
    label: { ar: '🇮🇶 العراق', en: 'Iraq 🇮🇶' },
    options: [
      { label: { ar: 'اللهجة البغدادية', en: 'Baghdadi' }, value: 'Iraqi Baghdadi Dialect' },
      { label: { ar: 'اللهجة البصرية', en: 'Basrawi' }, value: 'Iraqi Basrawi Dialect' },
      { label: { ar: 'اللهجة الموصلية', en: 'Moslawi' }, value: 'Iraqi Moslawi Dialect' }
    ]
  },
  {
    label: { ar: '🇸🇩 السودان', en: 'Sudan 🇸🇩' },
    options: [
      { label: { ar: 'اللهجة السودانية العامة', en: 'General Sudanese' }, value: 'General Sudanese Dialect' },
      { label: { ar: 'لهجة الخرطوم', en: 'Khartoum Dialect' }, value: 'Sudanese Khartoum Dialect' }
    ]
  },
  {
    label: { ar: '🇾🇪 اليمن', en: 'Yemen 🇾🇪' },
    options: [
      { label: { ar: 'اللهجة اليمنية العامة', en: 'General Yemeni' }, value: 'General Yemeni Dialect' },
      { label: { ar: 'لهجة صنعاء', en: 'Sana\'ani' }, value: 'Yemeni Sanaani Dialect' },
      { label: { ar: 'لهجة تعز وعدن', en: 'Ta\'izzi & Adeni' }, value: 'Yemeni Taizzi Adeni Dialect' }
    ]
  },
  {
    label: { ar: '🇱🇾 ليبيا', en: 'Libya 🇱🇾' },
    options: [
      { label: { ar: 'اللهجة الليبية العامة', en: 'General Libyan' }, value: 'General Libyan Dialect' },
      { label: { ar: 'لهجة طرابلس', en: 'Tripoli Dialect' }, value: 'Libyan Tripoli Dialect' }
    ]
  },
  {
    label: { ar: '🇩🇿 الجزائر', en: 'Algeria 🇩🇿' },
    options: [
      { label: { ar: 'اللهجة الجزائرية العامة', en: 'General Algerian' }, value: 'General Algerian Dialect' },
      { label: { ar: 'لهجة وهران', en: 'Oran Dialect' }, value: 'Algerian Oran Dialect' },
      { label: { ar: 'لهجة قسنطينة', en: 'Constantine Dialect' }, value: 'Algerian Constantine Dialect' }
    ]
  },
  {
    label: { ar: '🇲🇦 المغرب', en: 'Morocco 🇲🇦' },
    options: [
      { label: { ar: 'اللهجة المغربية العامة', en: 'General Moroccan' }, value: 'General Moroccan Dialect' },
      { label: { ar: 'لهجة الدار البيضاء', en: 'Casablanca Dialect' }, value: 'Moroccan Casablanca Dialect' },
      { label: { ar: 'اللهجة الأمازيغية المغربية', en: 'Moroccan Amazigh' }, value: 'Moroccan Amazigh Dialect' }
    ]
  },
  {
    label: { ar: '🇹🇳 تونس', en: 'Tunisia 🇹🇳' },
    options: [
      { label: { ar: 'اللهجة التونسية العامة', en: 'General Tunisian' }, value: 'General Tunisian Dialect' },
      { label: { ar: 'لهجة العاصمة', en: 'Tunis (Capital) Dialect' }, value: 'Tunisian Capital Dialect' }
    ]
  }
];

export const INDUSTRIES_GROUPED = [
// ... existing code ...
  {
    label: { ar: '🏢 القطاعات التجارية', en: 'Business & Retail 🏢' },
    options: [
        { label: { ar: 'المتاجر الإلكترونية', en: 'E-Commerce Stores' }, value: 'E-Commerce Store' },
        { label: { ar: 'شركات التجارة العامة', en: 'General Trading Companies' }, value: 'General Trading Company' },
        { label: { ar: 'السوبرماركت والهايبر', en: 'Supermarkets & Hypermarkets' }, value: 'Supermarket' },
        { label: { ar: 'محلات الملابس والأزياء', en: 'Clothing & Fashion Stores' }, value: 'Clothing Store' },
        { label: { ar: 'محلات الأحذية والشنط', en: 'Shoes & Bags Stores' }, value: 'Shoes & Bags Store' },
        { label: { ar: 'محلات العطور والبخور', en: 'Perfumes & Incense Shops' }, value: 'Perfume & Incense Shop' },
        { label: { ar: 'متاجر الهدايا', en: 'Gift Shops' }, value: 'Gift Shop' },
        { label: { ar: 'متاجر الإكسسوارات', en: 'Accessories Stores' }, value: 'Accessories Store' },
        { label: { ar: 'متاجر الأجهزة المنزلية', en: 'Home Appliances Stores' }, value: 'Home Appliances Store' },
        { label: { ar: 'محلات الأثاث والديكور', en: 'Furniture & Decor Stores' }, value: 'Furniture Store' },
        { label: { ar: 'محلات الذهب والمجوهرات', en: 'Gold & Jewelry Stores' }, value: 'Jewelry Store' },
        { label: { ar: 'معارض السيارات', en: 'Car Showrooms' }, value: 'Car Showroom' },
        { label: { ar: 'شركات قطع غيار السيارات', en: 'Auto Parts Companies' }, value: 'Auto Parts Company' },
        { label: { ar: 'شركات لوجستيات وتوصيل', en: 'Logistics & Delivery Companies' }, value: 'Logistics Company' },
        { label: { ar: 'شركات الشحن الدولي', en: 'International Shipping Companies' }, value: 'International Shipping' },
        { label: { ar: 'شركات الطباعة والدعاية والإعلان', en: 'Printing & Advertising Agencies' }, value: 'Advertising & Printing Agency' },
        { label: { ar: 'شركات التسويق', en: 'Marketing Agencies' }, value: 'Marketing Agency' }
    ]
  },
  {
    label: { ar: '🍽️ قطاع الأغذية والمشروبات', en: 'Food & Beverage 🍽️' },
    options: [
        { label: { ar: 'المطاعم', en: 'Restaurants' }, value: 'Restaurants' },
        { label: { ar: 'الكافيهات', en: 'Cafes & Coffee Shops' }, value: 'Coffee Shops' },
        { label: { ar: 'المخابز والحلويات', en: 'Bakeries & Sweets' }, value: 'Bakeries & Sweets' },
        { label: { ar: 'متاجر العصائر', en: 'Juice Shops' }, value: 'Juice Shops' },
        { label: { ar: 'محلات الشوكولاتة', en: 'Chocolate Shops' }, value: 'Chocolate Shops' },
        { label: { ar: 'مطاعم الوجبات السريعة', en: 'Fast Food Restaurants' }, value: 'Fast Food' },
        { label: { ar: 'مطاعم صحية', en: 'Healthy Restaurants' }, value: 'Healthy Restaurants' },
        { label: { ar: 'فود ترك (Food Trucks)', en: 'Food Trucks' }, value: 'Food Trucks' },
        { label: { ar: 'شركات توريد الأغذية', en: 'Food Supply Companies' }, value: 'Food Supply Companies' }
    ]
  },
  {
    label: { ar: '🏥 القطاع الطبي', en: 'Medical & Healthcare 🏥' },
    options: [
        { label: { ar: 'العيادات', en: 'Clinics' }, value: 'Medical Clinics' },
        { label: { ar: 'المستشفيات', en: 'Hospitals' }, value: 'Hospitals' },
        { label: { ar: 'المختبرات', en: 'Laboratories' }, value: 'Medical Laboratories' },
        { label: { ar: 'الصيدليات', en: 'Pharmacies' }, value: 'Pharmacies' },
        { label: { ar: 'مراكز التجميل الطبي', en: 'Medical Beauty Centers' }, value: 'Medical Beauty Centers' },
        { label: { ar: 'مراكز العلاج الطبيعي', en: 'Physiotherapy Centers' }, value: 'Physiotherapy Centers' },
        { label: { ar: 'مراكز الأسنان', en: 'Dental Centers' }, value: 'Dental Centers' },
        { label: { ar: 'مراكز السمنة والتخسيس', en: 'Obesity & Slimming Centers' }, value: 'Obesity & Slimming Centers' },
        { label: { ar: 'مراكز التأهيل', en: 'Rehabilitation Centers' }, value: 'Rehabilitation Centers' },
        { label: { ar: 'مراكز الأشعة والتحاليل', en: 'Radiology & Analysis Centers' }, value: 'Radiology & Analysis Centers' },
        { label: { ar: 'أخصائيي التغذية', en: 'Nutritionists' }, value: 'Nutritionists' }
    ]
  },
  {
    label: { ar: '🎓 القطاع التعليمي', en: 'Education & Training 🎓' },
    options: [
        { label: { ar: 'المدارس', en: 'Schools' }, value: 'Schools' },
        { label: { ar: 'الجامعات', en: 'Universities' }, value: 'Universities' },
        { label: { ar: 'المعاهد', en: 'Institutes' }, value: 'Institutes' },
        { label: { ar: 'مراكز التدريب', en: 'Training Centers' }, value: 'Training Centers' },
        { label: { ar: 'كورسات أونلاين', en: 'Online Courses' }, value: 'Online Courses' },
        { label: { ar: 'أكاديميات الأطفال', en: 'Kids Academies' }, value: 'Kids Academies' },
        { label: { ar: 'مراكز اللغات', en: 'Language Centers' }, value: 'Language Centers' },
        { label: { ar: 'حضانات وروضات', en: 'Nurseries & Kindergartens' }, value: 'Kindergartens' },
        { label: { ar: 'مدربي تطوير الذات', en: 'Self-Development Coaches' }, value: 'Life Coaches' },
        { label: { ar: 'التدريب الوظيفي', en: 'Vocational Training' }, value: 'Career Training' },
        { label: { ar: 'التدريب التقني والذكاء الاصطناعي', en: 'Tech & AI Training' }, value: 'Tech & AI Training' }
    ]
  },
  {
    label: { ar: '🏘️ العقارات', en: 'Real Estate 🏘️' },
    options: [
        { label: { ar: 'شركات التطوير العقاري', en: 'Real Estate Developers' }, value: 'Real Estate Developers' },
        { label: { ar: 'مكاتب الوساطة العقارية', en: 'Real Estate Brokerage' }, value: 'Real Estate Brokerage' },
        { label: { ar: 'شركات المقاولات', en: 'Contracting Companies' }, value: 'Contracting Companies' },
        { label: { ar: 'شركات التصميم الداخلي', en: 'Interior Design Firms' }, value: 'Interior Design Firms' },
        { label: { ar: 'شركات الاستشارات الهندسية', en: 'Engineering Consultancies' }, value: 'Engineering Consultancies' },
        { label: { ar: 'مكاتب الديكور والبناء', en: 'Decor & Construction Offices' }, value: 'Decor & Construction' },
        { label: { ar: 'شركات الاستشارات العقارية', en: 'Real Estate Consultancies' }, value: 'Real Estate Consultancy' }
    ]
  },
  {
    label: { ar: '❤️ القطاع الخيري والإنساني', en: 'Charity & NGOs ❤️' },
    options: [
        { label: { ar: 'الجمعيات الخيرية', en: 'Charities' }, value: 'Charities' },
        { label: { ar: 'المنظمات غير الربحية', en: 'Non-Profit Organizations' }, value: 'Non-Profit Organizations' },
        { label: { ar: 'الحملات الموسمية', en: 'Seasonal Campaigns' }, value: 'Seasonal Campaigns' },
        { label: { ar: 'كفالة الأيتام', en: 'Orphan Sponsorship' }, value: 'Orphan Sponsorship' },
        { label: { ar: 'دعم الأسر المتعففة', en: 'Supporting Needy Families' }, value: 'Family Support' },
        { label: { ar: 'مشاريع الإغاثة', en: 'Relief Projects' }, value: 'Relief Projects' },
        { label: { ar: 'حملات التبرعات', en: 'Donation Campaigns' }, value: 'Donation Campaigns' },
        { label: { ar: 'فرق العمل التطوعي', en: 'Volunteer Teams' }, value: 'Volunteer Groups' },
        { label: { ar: 'مشاريع بناء الآبار', en: 'Water Well Projects' }, value: 'Water Well Projects' },
        { label: { ar: 'التعليم والمساعدات الطبية', en: 'Education & Medical Aid' }, value: 'Education & Medical Aid' }
    ]
  },
  {
    label: { ar: '🧾 قطاعات الخدمات', en: 'Services 🧾' },
    options: [
        { label: { ar: 'الاستشارات', en: 'Consulting' }, value: 'Consulting' },
        { label: { ar: 'المحاماة', en: 'Legal Services' }, value: 'Legal Services' },
        { label: { ar: 'مكاتب السفر والسياحة', en: 'Travel & Tourism Agencies' }, value: 'Travel Agencies' },
        { label: { ar: 'شركات إدارة الأملاك', en: 'Property Management' }, value: 'Property Management' },
        { label: { ar: 'مكاتب الترجمة', en: 'Translation Services' }, value: 'Translation Services' },
        { label: { ar: 'مكاتب المحاسبة', en: 'Accounting Firms' }, value: 'Accounting Firms' },
        { label: { ar: 'شركات التأمين', en: 'Insurance Companies' }, value: 'Insurance Companies' },
        { label: { ar: 'شركات تنظيم الفعاليات', en: 'Event Management' }, value: 'Event Management' },
        { label: { ar: 'شركات الإنتاج الإعلامي', en: 'Media Production' }, value: 'Media Production' },
        { label: { ar: 'شركات البرمجة والتقنية', en: 'Programming & Tech Companies' }, value: 'Tech & Programming' },
        { label: { ar: 'صانعي المحتوى المستقلين', en: 'Freelance Content Creators' }, value: 'Freelance Content Creators' },
        { label: { ar: 'المصورين', en: 'Photographers' }, value: 'Photographers' },
        { label: { ar: 'شركات التنظيف', en: 'Cleaning Companies' }, value: 'Cleaning Services' },
        { label: { ar: 'شركات مكافحة الحشرات', en: 'Pest Control Companies' }, value: 'Pest Control' },
        { label: { ar: 'شركات الأمن والحراسة', en: 'Security Services' }, value: 'Security Services' }
    ]
  },
  {
    label: { ar: '💅 العناية والجمال', en: 'Beauty & Wellness 💅' },
    options: [
        { label: { ar: 'صالونات التجميل', en: 'Beauty Salons' }, value: 'Beauty Salons' },
        { label: { ar: 'الحلاقين', en: 'Barbershops' }, value: 'Barbershops' },
        { label: { ar: 'مراكز السبا', en: 'Spas' }, value: 'Spa Centers' },
        { label: { ar: 'مراكز اللياقة البدنية', en: 'Fitness Centers' }, value: 'Fitness Centers' },
        { label: { ar: 'مراكز اليوغا', en: 'Yoga Centers' }, value: 'Yoga Centers' },
        { label: { ar: 'مدربي الرياضة', en: 'Sports Coaches' }, value: 'Fitness Coaches' },
        { label: { ar: 'منتجات العناية بالبشرة والشعر', en: 'Skin & Hair Care Products' }, value: 'Skin & Hair Care Products' }
    ]
  },
  {
    label: { ar: '🏖️ السياحة والضيافة', en: 'Hospitality & Tourism 🏖️' },
    options: [
        { label: { ar: 'الفنادق', en: 'Hotels' }, value: 'Hotels' },
        { label: { ar: 'المنتجعات', en: 'Resorts' }, value: 'Resorts' },
        { label: { ar: 'الشقق الفندقية', en: 'Hotel Apartments' }, value: 'Hotel Apartments' },
        { label: { ar: 'شركات السياحة', en: 'Tourism Companies' }, value: 'Tourism Companies' },
        { label: { ar: 'شركات الرحلات البحرية', en: 'Cruise Companies' }, value: 'Cruise & Boat Trips' },
        { label: { ar: 'النوادي الرياضية', en: 'Sports Clubs' }, value: 'Sports Clubs' },
        { label: { ar: 'الاستراحات والشاليهات', en: 'Rest Houses & Chalets' }, value: 'Chalets & Rest Houses' }
    ]
  },
  {
    label: { ar: '💻 قطاع التكنولوجيا', en: 'Tech & Digital 💻' },
    options: [
        { label: { ar: 'شركات البرمجة', en: 'Programming Companies' }, value: 'Software Development' },
        { label: { ar: 'شركات التطوير', en: 'Development Companies' }, value: 'Development Agencies' },
        { label: { ar: 'تطبيقات الجوال', en: 'Mobile Apps' }, value: 'Mobile Apps' },
        { label: { ar: 'شركات الأمن السيبراني', en: 'Cybersecurity Companies' }, value: 'Cyber Security' },
        { label: { ar: 'شركات SaaS', en: 'SaaS Companies' }, value: 'SaaS Companies' },
        { label: { ar: 'مواقع الخدمات الإلكترونية', en: 'E-Service Websites' }, value: 'Online Service Platforms' },
        { label: { ar: 'منصات التعليم', en: 'Education Platforms' }, value: 'EdTech Platforms' },
        { label: { ar: 'شركات الذكاء الاصطناعي', en: 'AI Companies' }, value: 'AI Companies' },
        { label: { ar: 'شركات الألعاب الإلكترونية', en: 'Gaming Companies' }, value: 'Gaming Companies' }
    ]
  },
  {
    label: { ar: '🎬 قطاع الإعلام والترفيه', en: 'Media & Entertainment 🎬' },
    options: [
        { label: { ar: 'صناع المحتوى', en: 'Content Creators' }, value: 'Content Creators' },
        { label: { ar: 'المؤثرين (Influencers)', en: 'Influencers' }, value: 'Influencers' },
        { label: { ar: 'قنوات اليوتيوب', en: 'YouTube Channels' }, value: 'YouTube Channels' },
        { label: { ar: 'بودكاست', en: 'Podcasts' }, value: 'Podcasts' },
        { label: { ar: 'شركات الإنتاج', en: 'Production Companies' }, value: 'Production Houses' },
        { label: { ar: 'استوديوهات التصوير', en: 'Photography Studios' }, value: 'Photography Studios' },
        { label: { ar: 'صفحات الأخبار', en: 'News Pages' }, value: 'News Pages' },
        { label: { ar: 'صفحات الترفيه', en: 'Entertainment Pages' }, value: 'Entertainment Pages' },
        { label: { ar: 'صفحات الأفلام والمسلسلات', en: 'Movies & Series Pages' }, value: 'Movies & Series Pages' }
    ]
  },
  {
    label: { ar: '🚗 قطاع السيارات', en: 'Automotive 🚗' },
    options: [
        { label: { ar: 'معارض السيارات', en: 'Car Showrooms' }, value: 'Car Dealerships' },
        { label: { ar: 'شركات تقسيط السيارات', en: 'Car Installment Companies' }, value: 'Car Financing' },
        { label: { ar: 'كاراجات ومراكز صيانة', en: 'Garages & Maintenance Centers' }, value: 'Garages & Maintenance' },
        { label: { ar: 'مراكز تلميع السيارات', en: 'Car Polishing Centers' }, value: 'Car Detailing' },
        { label: { ar: 'شركات غسيل متنقل', en: 'Mobile Car Wash' }, value: 'Mobile Car Wash' },
        { label: { ar: 'قطع الغيار والإكسسوارات', en: 'Spare Parts & Accessories' }, value: 'Spare Parts & Accessories' },
        { label: { ar: 'سيارات الليموزين', en: 'Limousine Services' }, value: 'Limousine Services' }
    ]
  },
  {
    label: { ar: '🧵 الأعمال اليدوية', en: 'Handmade Business 🧵' },
    options: [
        { label: { ar: 'الإكسسوارات اليدوية', en: 'Handmade Accessories' }, value: 'Handmade Accessories' },
        { label: { ar: 'الشمع اليدوي', en: 'Handmade Candles' }, value: 'Handmade Candles' },
        { label: { ar: 'الصابون الطبيعي', en: 'Natural Soap' }, value: 'Natural Soap' },
        { label: { ar: 'التطريز', en: 'Embroidery' }, value: 'Embroidery' },
        { label: { ar: 'التريكو والكروشيه', en: 'Knitting & Crochet' }, value: 'Knitting & Crochet' },
        { label: { ar: 'النحت الخشبي', en: 'Wood Carving' }, value: 'Wood Carving' },
        { label: { ar: 'رسومات اللوحات', en: 'Paintings' }, value: 'Painting' },
        { label: { ar: 'الصناديق الخشبية', en: 'Wooden Boxes' }, value: 'Wooden Boxes' },
        { label: { ar: 'الهدايا المخصصة', en: 'Customized Gifts' }, value: 'Customized Gifts' },
        { label: { ar: 'الفخار والسيراميك', en: 'Pottery & Ceramics' }, value: 'Pottery & Ceramics' },
        { label: { ar: 'صناعة الأقمشة اليدوية', en: 'Handmade Fabrics' }, value: 'Handmade Fabrics' },
        { label: { ar: 'فن الريزن', en: 'Resin Art' }, value: 'Resin Art' },
        { label: { ar: 'مكرمية', en: 'Macrame' }, value: 'Macrame' },
        { label: { ar: 'الحقائب اليدوية', en: 'Handmade Bags' }, value: 'Handmade Bags' },
        { label: { ar: 'منتجات الديكور اليدوية', en: 'Handmade Decor Products' }, value: 'Handmade Decor' },
        { label: { ar: 'إعادة التدوير', en: 'Recycling Crafts' }, value: 'Recycling Crafts' }
    ]
  },
  {
    label: { ar: '🔧 الأعمال الحرفية', en: 'Crafts & Trades 🔧' },
    options: [
        { label: { ar: 'النجارة', en: 'Carpentry' }, value: 'Carpentry' },
        { label: { ar: 'السباكة', en: 'Plumbing' }, value: 'Plumbing' },
        { label: { ar: 'الكهرباء', en: 'Electrical Services' }, value: 'Electrical Services' },
        { label: { ar: 'الحدادة', en: 'Blacksmithing' }, value: 'Blacksmithing' },
        { label: { ar: 'النقاشة والدهانات', en: 'Painting & Decorating' }, value: 'Painting & Decorating' },
        { label: { ar: 'الجبس والديكور', en: 'Gypsum & Decor' }, value: 'Gypsum & Decor' },
        { label: { ar: 'البلاط والسيراميك', en: 'Tiling & Ceramics' }, value: 'Tiling & Ceramics' },
        { label: { ar: 'التكييف', en: 'HVAC / Air Conditioning' }, value: 'HVAC / AC Services' },
        { label: { ar: 'التمديدات الصحية', en: 'Sanitary Installations' }, value: 'Sanitary Installations' },
        { label: { ar: 'اللحام', en: 'Welding' }, value: 'Welding' },
        { label: { ar: 'الميكانيكا', en: 'Mechanics' }, value: 'Mechanics' },
        { label: { ar: 'السمكرة', en: 'Auto Body Repair' }, value: 'Auto Body Repair' },
        { label: { ar: 'النجارة المعدنية (الألوميتال)', en: 'Metal Carpentry (Alumetal)' }, value: 'Aluminum Works' },
        { label: { ar: 'صيانة المنازل', en: 'Home Maintenance' }, value: 'Home Maintenance' },
        { label: { ar: 'المسّاحين والبنائين', en: 'Surveyors & Builders' }, value: 'Surveying & Building' },
        { label: { ar: 'الجرانيت والرخام', en: 'Granite & Marble' }, value: 'Granite & Marble' },
        { label: { ar: 'الحرفي متعدد المهام', en: 'Handyman' }, value: 'Handyman' },
        { label: { ar: 'صيانة الهواتف', en: 'Mobile Repair' }, value: 'Mobile Repair' },
        { label: { ar: 'صيانة الكمبيوتر', en: 'Computer Repair' }, value: 'Computer Repair' },
        { label: { ar: 'طباعة التيشيرتات', en: 'T-Shirt Printing' }, value: 'T-Shirt Printing' },
        { label: { ar: 'النقش بالليزر', en: 'Laser Engraving' }, value: 'Laser Engraving' },
        { label: { ar: 'الطباعة الحرارية', en: 'Thermal Printing' }, value: 'Thermal Printing' },
        { label: { ar: 'مكائن CNC', en: 'CNC Machining' }, value: 'CNC Machining' },
        { label: { ar: 'صانعي الدروع والهدايا الخشبية', en: 'Trophy & Wooden Gift Makers' }, value: 'Trophies & Wooden Gifts' }
    ]
  }
];

export const TONES_GROUPED = [
// ... existing code ...
  {
    label: { ar: '🎯 النبرات العامة', en: '🎯 General Tones' },
    options: [
      { label: { ar: 'رسمي', en: 'Formal' }, value: 'Formal' },
      { label: { ar: 'غير رسمي', en: 'Casual' }, value: 'Casual' },
      { label: { ar: 'ودي / لطيف', en: 'Friendly' }, value: 'Friendly' },
      { label: { ar: 'محفّز', en: 'Motivational' }, value: 'Motivational' },
      { label: { ar: 'إخباري', en: 'Informative' }, value: 'Informative' },
      { label: { ar: 'إقناعي', en: 'Persuasive' }, value: 'Persuasive' },
      { label: { ar: 'ملهم', en: 'Inspirational' }, value: 'Inspirational' },
      { label: { ar: 'احترافي', en: 'Professional' }, value: 'Professional' },
      { label: { ar: 'حواري', en: 'Conversational' }, value: 'Conversational' },
      { label: { ar: 'مشوّق', en: 'Engaging' }, value: 'Engaging' }
    ]
  },
  {
    label: { ar: '💼 نبرات الأعمال والتسويق', en: '💼 Business & Marketing Tones' },
    options: [
      { label: { ar: 'تسويقي جذّاب', en: 'Salesy / Promotional' }, value: 'Promotional' },
      { label: { ar: 'علامة تجارية واثقة', en: 'Confident Brand' }, value: 'Confident Brand' },
      { label: { ar: 'إعلان احترافي', en: 'Advertising Style' }, value: 'Advertising Style' },
      { label: { ar: 'تركيز على القيمة', en: 'Value-Driven' }, value: 'Value-Driven' },
      { label: { ar: 'بناء ثقة', en: 'Trust-Building' }, value: 'Trust-Building' },
      { label: { ar: 'قصصي تسويقي', en: 'Storytelling Tone' }, value: 'Storytelling Tone' },
      { label: { ar: 'تشويقي دعائي', en: 'Teasing / Launch' }, value: 'Teasing' },
      { label: { ar: 'استشاري', en: 'Consultative' }, value: 'Consultative' },
      { label: { ar: 'رسمي إداري', en: 'Corporate Formal' }, value: 'Corporate Formal' },
      { label: { ar: 'بسيط وواضح', en: 'Simple & Clear' }, value: 'Simple & Clear' }
    ]
  },
  {
    label: { ar: '❤️ نبرات إنسانية وخيرية', en: '❤️ Humanitarian & Charity Tones' },
    options: [
      { label: { ar: 'إنساني مؤثر', en: 'Emotional / Humanitarian' }, value: 'Emotional Humanitarian' },
      { label: { ar: 'خيري داعم', en: 'Charitable / Supportive' }, value: 'Charitable' },
      { label: { ar: 'متعاطف', en: 'Empathetic' }, value: 'Empathetic' },
      { label: { ar: 'دعوة للعطاء', en: 'Call to Good / Giving' }, value: 'Call to Good' },
      { label: { ar: 'إيماني روحاني', en: 'Faith-Based' }, value: 'Faith-Based' },
      { label: { ar: 'تعبيري صادق', en: 'Heartfelt' }, value: 'Heartfelt' },
      { label: { ar: 'مطمئن ومواسي', en: 'Comforting / Reassuring' }, value: 'Comforting' },
      { label: { ar: 'مجتمعي متعاون', en: 'Community-Driven' }, value: 'Community-Driven' },
      { label: { ar: 'ملهم للخير', en: 'Inspirational Giving' }, value: 'Inspirational Giving' },
      { label: { ar: 'واقعي وصادق', en: 'Authentic / Genuine' }, value: 'Authentic' }
    ]
  },
  {
    label: { ar: '🎨 نبرات إبداعية وترفيهية', en: '🎨 Creative & Entertainment Tones' },
    options: [
      { label: { ar: 'مرح', en: 'Playful' }, value: 'Playful' },
      { label: { ar: 'ساخر خفيف', en: 'Humorous / Witty' }, value: 'Humorous' },
      { label: { ar: 'درامي', en: 'Dramatic' }, value: 'Dramatic' },
      { label: { ar: 'خيالي', en: 'Imaginative' }, value: 'Imaginative' },
      { label: { ar: 'حكاية قصيرة', en: 'Narrative' }, value: 'Narrative' },
      { label: { ar: 'مشهدي سينمائي', en: 'Cinematic' }, value: 'Cinematic' },
      { label: { ar: 'فني وأنيق', en: 'Artistic / Stylish' }, value: 'Artistic' },
      { label: { ar: 'عاطفي قوي', en: 'Emotive' }, value: 'Emotive' },
      { label: { ar: 'موسيقي إيقاعي', en: 'Rhythmic / Poetic' }, value: 'Poetic' },
      { label: { ar: 'كوميدي ذكي', en: 'Smart Humor' }, value: 'Smart Humor' }
    ]
  },
  {
    label: { ar: '🧠 نبرات تعليمية ومعرفية', en: '🧠 Educational & Informative Tones' },
    options: [
      { label: { ar: 'تعليمي مبسط', en: 'Educational / Simple' }, value: 'Educational' },
      { label: { ar: 'توعوي', en: 'Awareness Tone' }, value: 'Awareness' },
      { label: { ar: 'خبير / أكاديمي', en: 'Expert / Academic' }, value: 'Expert' },
      { label: { ar: 'إرشادي خطوة بخطوة', en: 'Guided / Step-by-Step' }, value: 'Guided' },
      { label: { ar: 'توضيحي', en: 'Explanatory' }, value: 'Explanatory' },
      { label: { ar: 'موجه للمبتدئين', en: 'Beginner-Friendly' }, value: 'Beginner-Friendly' },
      { label: { ar: 'تحليلي', en: 'Analytical' }, value: 'Analytical' },
      { label: { ar: 'منظم وواضح', en: 'Structured' }, value: 'Structured' },
      { label: { ar: 'استشاري معرفي', en: 'Advisory' }, value: 'Advisory' },
      { label: { ar: 'مدرّب محفّز', en: 'Coach-Style' }, value: 'Coach-Style' }
    ]
  },
  {
    label: { ar: '💬 نبرات للتواصل الاجتماعي', en: '💬 Social Media Tones' },
    options: [
      { label: { ar: 'ترند شبابي', en: 'Trendy / Youthful' }, value: 'Trendy' },
      { label: { ar: 'ساخر خفيف', en: 'Witty / Meme-Style' }, value: 'Meme-Style' },
      { label: { ar: 'عاطفي مؤثر', en: 'Relatable & Emotional' }, value: 'Relatable' },
      { label: { ar: 'قصير ومباشر', en: 'Short & Direct' }, value: 'Short & Direct' },
      { label: { ar: 'قصصي', en: 'Story-Style' }, value: 'Story-Style' },
      { label: { ar: 'تحفيزي إيجابي', en: 'Positive Vibe' }, value: 'Positive Vibe' },
      { label: { ar: 'توعوي مجتمعي', en: 'Social Awareness' }, value: 'Social Awareness' },
      { label: { ar: 'تسويقي ناعم', en: 'Soft Promotion' }, value: 'Soft Promotion' },
      { label: { ar: 'تساؤلي / تفاعلي', en: 'Engagement-Driven' }, value: 'Engagement-Driven' },
      { label: { ar: 'تحدي أو حملة', en: 'Challenge Tone' }, value: 'Challenge Tone' }
    ]
  },
  {
    label: { ar: '🏥 نبرات طبية وتعليمية وتقنية', en: '🏥 Sector-Specific Tones' },
    options: [
      { label: { ar: 'مطمئن (طبي)', en: 'Reassuring' }, value: 'Reassuring' },
      { label: { ar: 'موثوق (طبي)', en: 'Trustworthy' }, value: 'Trustworthy' },
      { label: { ar: 'توعوي صحي', en: 'Health-Awareness' }, value: 'Health-Awareness' },
      { label: { ar: 'إنساني (رعاية)', en: 'Human Care' }, value: 'Human Care' },
      { label: { ar: 'ملهِم للتعلم', en: 'Inspiring Learning' }, value: 'Inspiring Learning' },
      { label: { ar: 'عملي تطبيقي', en: 'Practical' }, value: 'Practical' },
      { label: { ar: 'تشجيعي', en: 'Encouraging' }, value: 'Encouraging' },
      { label: { ar: 'حديث مبتكر (تقني)', en: 'Innovative' }, value: 'Innovative' },
      { label: { ar: 'تقني محترف', en: 'Tech-Professional' }, value: 'Tech-Professional' },
      { label: { ar: 'ذكي سريع', en: 'Smart & Dynamic' }, value: 'Smart & Dynamic' },
      { label: { ar: 'إخباري تحليلي', en: 'Tech-News / Analytical' }, value: 'Analytical News' }
    ]
  },
  {
    label: { ar: '🕊️ نبرات عاطفية ومزاجية', en: '🕊️ Emotional & Mood Tones' },
    options: [
      { label: { ar: 'حنين', en: 'Nostalgic' }, value: 'Nostalgic' },
      { label: { ar: 'حماسي', en: 'Energetic' }, value: 'Energetic' },
      { label: { ar: 'هادئ', en: 'Calm' }, value: 'Calm' },
      { label: { ar: 'دافئ', en: 'Warm' }, value: 'Warm' },
      { label: { ar: 'متفائل', en: 'Optimistic' }, value: 'Optimistic' },
      { label: { ar: 'جاد', en: 'Serious' }, value: 'Serious' },
      { label: { ar: 'حساس', en: 'Sensitive' }, value: 'Sensitive' },
      { label: { ar: 'مطمئن', en: 'Peaceful' }, value: 'Peaceful' },
      { label: { ar: 'متأمل', en: 'Reflective' }, value: 'Reflective' },
      { label: { ar: 'ممتن', en: 'Grateful' }, value: 'Grateful' }
    ]
  }
];

export const AD_PLATFORMS = [
    { label: { ar: 'فيسبوك', en: 'Facebook' }, value: 'Facebook' },
    { label: { ar: 'انستجرام', en: 'Instagram' }, value: 'Instagram' },
    { label: { ar: 'تويتر (X)', en: 'Twitter (X)' }, value: 'Twitter' },
    { label: { ar: 'لينكد إن', en: 'LinkedIn' }, value: 'LinkedIn' },
    { label: { ar: 'سناب شات', en: 'Snapchat' }, value: 'Snapchat' },
    { label: { ar: 'تيك توك', en: 'TikTok' }, value: 'TikTok' },
    { label: { ar: 'جوجل', en: 'Google Ads' }, value: 'Google Ads' }
];

export const REEL_MODES = [
// ... existing code ...
    {
        label: { ar: 'الأنماط', en: 'Styles' },
        options: [
            { label: { ar: 'تعليمي', en: 'Educational' }, value: 'Educational' },
            { label: { ar: 'ترفيهي', en: 'Entertainment' }, value: 'Entertainment' },
            { label: { ar: 'ترويجي', en: 'Promotional' }, value: 'Promotional' },
            { label: { ar: 'قصصي', en: 'Storytelling' }, value: 'Storytelling' },
            { label: { ar: 'خلف الكواليس', en: 'Behind the Scenes' }, value: 'Behind the Scenes' }
        ]
    }
];

export const REEL_PLATFORMS = [
    { label: { ar: 'انستجرام ريلز', en: 'Instagram Reels' }, value: 'Instagram Reels' },
    { label: { ar: 'تيك توك', en: 'TikTok' }, value: 'TikTok' },
    { label: { ar: 'يوتيوب شورتس', en: 'YouTube Shorts' }, value: 'YouTube Shorts' },
    { label: { ar: 'سناب شات', en: 'Snapchat Spotlight' }, value: 'Snapchat Spotlight' }
];

export const REEL_DURATIONS = [
    { label: { ar: '15 ثانية', en: '15 Seconds' }, value: '15s' },
    { label: { ar: '30 ثانية', en: '30 Seconds' }, value: '30s' },
    { label: { ar: '60 ثانية', en: '60 Seconds' }, value: '60s' }
];

export const ASPECT_RATIOS_GROUPED = [
// ... existing code ...
  {
    label: { ar: '📱 سوشيال ميديا', en: '📱 Social Media' },
    options: [
      { label: { ar: 'منشور مربع (1080x1080)', en: 'Square Post (1080x1080)' }, value: '1:1', description: 'Instagram / Facebook' },
      { label: { ar: 'منشور طولي (1080x1440)', en: 'Portrait Post (1080x1440)' }, value: '3:4', description: 'Instagram / Facebook' },
      { label: { ar: 'منشور أفقي (1080x566)', en: 'Landscape Post (1080x566)' }, value: '16:9', description: 'Twitter / Web' },
      { label: { ar: 'ستوري / ريلز (1080x1920)', en: 'Story / Reels (1080x1920)' }, value: '9:16', description: 'TikTok / IG / Snapchat' },
      { label: { ar: 'يوتيوب / فيديو عرضي (1920x1080)', en: 'YouTube / Landscape (1920x1080)' }, value: '16:9', description: 'Full HD Video' },
      { label: { ar: 'صورة مصغّرة (1280x720)', en: 'Thumbnail (1280x720)' }, value: '16:9', description: 'YouTube' },
      { label: { ar: 'غلاف صفحة (2560x1440)', en: 'Page Cover (2560x1440)' }, value: '16:9', description: 'Channel Art / Banner' },
    ]
  },
  {
    label: { ar: '📄 مطبوعات ورقية', en: '📄 Print' },
    options: [
      { label: { ar: 'A4 طولي (210x297mm)', en: 'A4 Portrait' }, value: 'A4_V', description: 'Standard Document' },
      { label: { ar: 'A4 عرضي (297x210mm)', en: 'A4 Landscape' }, value: 'A4_H', description: 'Standard Landscape' },
      { label: { ar: 'A3 طولي (297x420mm)', en: 'A3 Portrait' }, value: 'A3_V', description: 'Poster Small' },
      { label: { ar: 'A3 عرضي (420x297mm)', en: 'A3 Landscape' }, value: 'A3_H', description: 'Poster Landscape' },
      { label: { ar: 'A5 طولي (148x210mm)', en: 'A5 Portrait' }, value: 'A5_V', description: 'Flyer / Notebook' },
      { label: { ar: 'A5 عرضي (210x148mm)', en: 'A5 Landscape' }, value: 'A5_H', description: 'Flyer Landscape' },
      { label: { ar: 'كارت شخصي (90x50mm)', en: 'Business Card (9x5cm)' }, value: 'BizCard', description: 'Standard Card' },
    ]
  },
  {
    label: { ar: '🏢 بنرات ورولات', en: '🏢 Banners & Rollups' },
    options: [
      { label: { ar: 'رول أب صغير (80x200cm)', en: 'Rollup Small (80x200)' }, value: 'Rollup_S', description: 'Vertical Stand' },
      { label: { ar: 'رول أب متوسط (85x200cm)', en: 'Rollup Medium (85x200)' }, value: 'Rollup_M', description: 'Vertical Stand' },
      { label: { ar: 'رول أب عريض (100x200cm)', en: 'Rollup Wide (100x200)' }, value: 'Rollup_L', description: 'Vertical Stand' },
      { label: { ar: 'بانر جداري (300x100cm)', en: 'Wall Banner (300x100)' }, value: 'Banner_H', description: 'Horizontal' },
      { label: { ar: 'بانر طريق (400x150cm)', en: 'Road Banner (400x150)' }, value: 'Banner_H', description: 'Horizontal' },
      { label: { ar: 'بانر واجهة (500x200cm)', en: 'Store Banner (500x200)' }, value: 'Banner_H', description: 'Horizontal' },
      { label: { ar: 'ستاند خلفي (300x240cm)', en: 'Backdrop (300x240)' }, value: 'Backdrop', description: 'Event Backdrop (4:3)' },
    ]
  }
];

export const UNIFIED_IMAGE_STYLES = [
    {
        label: { ar: 'الأنماط', en: 'Styles' },
        options: [
            { label: { ar: 'واقعي', en: 'Photorealistic' }, value: 'Photorealistic' },
            { label: { ar: 'سينمائي', en: 'Cinematic' }, value: 'Cinematic' },
            { label: { ar: 'أنمي', en: 'Anime' }, value: 'Anime' },
            { label: { ar: 'رقمي', en: 'Digital Art' }, value: 'Digital Art' },
            { label: { ar: 'زيتي', en: 'Oil Painting' }, value: 'Oil Painting' },
            { label: { ar: 'ثلاثي الأبعاد', en: '3D Render' }, value: '3D Render' }
        ]
    }
];

export const CAMERA_ANGLES = [
// ... existing code ...
    { icon: '📸', label: { ar: 'مستوى العين', en: 'Eye Level' }, value: 'Eye Level' },
    { icon: '🚁', label: { ar: 'من الأعلى', en: 'Overhead' }, value: 'Overhead' },
    { icon: '🐜', label: { ar: 'من الأسفل', en: 'Low Angle' }, value: 'Low Angle' },
    { icon: '🦅', label: { ar: 'طائر', en: 'Bird Eye' }, value: 'Bird Eye View' },
    { icon: '🔭', label: { ar: 'قريب', en: 'Close Up' }, value: 'Close Up' }
];

export const LIGHTING_STYLES = [
// ... existing code ...
    { icon: '☀️', label: { ar: 'طبيعي', en: 'Natural' }, value: 'Natural Lighting' },
    { icon: '💡', label: { ar: 'استوديو', en: 'Studio' }, value: 'Studio Lighting' },
    { icon: '🕯️', label: { ar: 'دافئ', en: 'Warm' }, value: 'Warm Lighting' },
    { icon: '❄️', label: { ar: 'بارد', en: 'Cool' }, value: 'Cool Lighting' },
    { icon: '🎬', label: { ar: 'درامي', en: 'Dramatic' }, value: 'Dramatic Lighting' },
    { icon: '🌃', label: { ar: 'نيون', en: 'Neon' }, value: 'Neon Lighting' }
];

export const GRAPHIC_DESIGN_STYLES = [
// ... existing code ...
    {
        label: { ar: 'الأنماط', en: 'Styles' },
        options: [
            { label: { ar: 'حديث', en: 'Modern' }, value: 'Modern' },
            { label: { ar: 'كلاسيكي', en: 'Classic' }, value: 'Classic' },
            { label: { ar: 'مبسط', en: 'Minimalist' }, value: 'Minimalist' },
            { label: { ar: 'جريء', en: 'Bold' }, value: 'Bold' },
            { label: { ar: 'فاخر', en: 'Luxury' }, value: 'Luxury' }
        ]
    }
];

export const GRAPHIC_DESIGN_SIZES = ASPECT_RATIOS_GROUPED;

export const MOCKUP_TYPES_GROUPED = [
// ... existing code ...
    {
        label: { ar: 'أنواع الموك أب', en: 'Mockup Types' },
        options: [
            { label: { ar: 'علبة منتج', en: 'Product Box' }, value: 'Product Box' },
            { label: { ar: 'شاشة هاتف', en: 'Phone Screen' }, value: 'Phone Screen' },
            { label: { ar: 'لابتوب', en: 'Laptop Screen' }, value: 'Laptop Screen' },
            { label: { ar: 'تي شيرت', en: 'T-Shirt' }, value: 'T-Shirt' },
            { label: { ar: 'كوب', en: 'Mug' }, value: 'Mug' },
            { label: { ar: 'بطاقة عمل', en: 'Business Card' }, value: 'Business Card' }
        ]
    }
];

export const IDEA_TYPES = [
// ... existing code ...
    {
        label: { ar: 'أنواع الأفكار', en: 'Idea Types' },
        options: [
            { label: { ar: 'فيرال', en: 'Viral' }, value: 'Viral Content' },
            { label: { ar: 'تعليمي', en: 'Educational' }, value: 'Educational' },
            { label: { ar: 'ترويجي', en: 'Promotional' }, value: 'Promotional' },
            { label: { ar: 'تفاعلي', en: 'Interactive' }, value: 'Interactive' }
        ]
    }
];

export const VIDEO_ASPECT_RATIOS = [
    { label: { ar: 'أفقي 16:9', en: 'Landscape 16:9' }, value: '16:9' },
    { label: { ar: 'عمودي 9:16', en: 'Portrait 9:16' }, value: '9:16' }
];

export const VIDEO_RESOLUTIONS = [
    { label: { ar: '720p', en: '720p' }, value: '720p' },
    { label: { ar: '1080p', en: '1080p' }, value: '1080p' }
];

export const TEMPLATES_DB = [
    { id: '1', title: { ar: 'عرض منتج بسيط', en: 'Simple Product Showcase' }, category: 'Business', tags: ['product', 'business'], prompt: 'Minimalist product showcase with clean background', icon: '📦' },
    { id: '2', title: { ar: 'إعلان قهوة', en: 'Coffee Ad' }, category: 'Food & Beverage', tags: ['coffee', 'drink'], prompt: 'Cinematic coffee cup on wooden table with steam', icon: '☕' }
];

export const VOICE_OPTIONS = [
// ... existing code ...
    { id: 'Puck', name: 'Puck', persona: { ar: 'Puck (ذكر - هادئ)', en: 'Puck (Male - Calm)' }, label: { ar: 'مناسب للسرد', en: 'Suitable for narration' }, icon: '👨' },
    { id: 'Charon', name: 'Charon', persona: { ar: 'Charon (ذكر - عميق)', en: 'Charon (Male - Deep)' }, label: { ar: 'مناسب للوثائقيات', en: 'Suitable for documentaries' }, icon: '👨' },
    { id: 'Kore', name: 'Kore', persona: { ar: 'Kore (أنثى - هادئة)', en: 'Kore (Female - Calm)' }, label: { ar: 'مناسب للإعلانات', en: 'Suitable for ads' }, icon: '👩' },
    { id: 'Fenrir', name: 'Fenrir', persona: { ar: 'Fenrir (ذكر - قوي)', en: 'Fenrir (Male - Strong)' }, label: { ar: 'مناسب للحماس', en: 'Suitable for energy' }, icon: '👨' },
    { id: 'Aoede', name: 'Aoede', persona: { ar: 'Aoede (أنثى - ناعمة)', en: 'Aoede (Female - Soft)' }, label: { ar: 'مناسب للقصص', en: 'Suitable for stories' }, icon: '👩' }
];

export const INFOGRAPHIC_LAYOUTS = [
    { icon: '📊', label: { ar: 'قائمة', en: 'List' }, value: 'List' },
    { icon: '🔄', label: { ar: 'دورة', en: 'Cycle' }, value: 'Cycle' },
    { icon: '⏱️', label: { ar: 'خط زمني', en: 'Timeline' }, value: 'Timeline' },
    { icon: '🆚', label: { ar: 'مقارنة', en: 'Comparison' }, value: 'Comparison' }
];

export const INFOGRAPHIC_STYLES = [
    { label: { ar: 'مسطح (Flat)', en: 'Flat Vector' }, value: 'Flat Vector' },
    { label: { ar: 'ثلاثي الأبعاد (3D)', en: '3D Isometric' }, value: '3D Isometric' },
    { label: { ar: 'رسم يدوي', en: 'Hand Drawn' }, value: 'Hand Drawn' },
    { label: { ar: 'تكنولوجي', en: 'Tech/Futuristic' }, value: 'Tech/Futuristic' }
];

export const PRODUCT_SCENES_GROUPED = [
// ... existing code ...
  { 
    label: { ar: '🏠 مشاهد داخلية', en: '🏠 Indoor Scenes' }, 
    options: [
      { label: { ar: 'غرفة معيشة', en: 'Living Room' }, value: 'Modern Living Room Background' },
      { label: { ar: 'مكتب عمل', en: 'Home Office' }, value: 'Home Office Desk' },
      { label: { ar: 'مطبخ', en: 'Kitchen' }, value: 'Modern Kitchen Counter' },
      { label: { ar: 'طاولة خشب', en: 'Wooden Table' }, value: 'Wooden Table Surface' },
      { label: { ar: 'سطح رخامي', en: 'Marble Surface' }, value: 'Marble Countertop' },
      { label: { ar: 'غرفة نوم', en: 'Bedroom' }, value: 'Cozy Bedroom Scene' },
      { label: { ar: 'متجر / رف عرض منتجات', en: 'Store Shelf / Display' }, value: 'Retail Store Shelf' },
      { label: { ar: 'ستوديو تصوير', en: 'Photo Studio' }, value: 'Professional Photo Studio' },
      { label: { ar: 'خلفية جدارية بلون موحد', en: 'Solid Wall Background' }, value: 'Solid Wall Background' },
      { label: { ar: 'رف كتب', en: 'Bookshelf' }, value: 'Bookshelf Background' },
      { label: { ar: 'مجلس عربي', en: 'Arabic Majlis' }, value: 'Traditional Arabic Majlis' },
      { label: { ar: 'صالة استقبال', en: 'Reception Lounge' }, value: 'Reception Lounge' },
    ]
  },
  { 
    label: { ar: '🌿 مشاهد طبيعية', en: '🌿 Natural Scenes' }, 
    options: [
      { label: { ar: 'طبيعة خضراء', en: 'Green Nature' }, value: 'Green Nature Landscape' },
      { label: { ar: 'خلفية جبلية', en: 'Mountain Background' }, value: 'Mountain Landscape' },
      { label: { ar: 'بحر وشاطئ', en: 'Sea and Beach' }, value: 'Beach and Sea Background' },
      { label: { ar: 'صحراء ورمال', en: 'Desert and Sand' }, value: 'Desert Sand Dunes' },
      { label: { ar: 'غروب الشمس', en: 'Sunset' }, value: 'Sunset Horizon' },
      { label: { ar: 'سماء زرقاء وسحب', en: 'Blue Sky and Clouds' }, value: 'Blue Sky with Clouds' },
      { label: { ar: 'نباتات وزهور', en: 'Plants and Flowers' }, value: 'Garden with Flowers' },
      { label: { ar: 'طريق مفتوح', en: 'Open Road' }, value: 'Open Road Scenic View' },
      { label: { ar: 'خلفية مائية أو نهرية', en: 'Water or River Background' }, value: 'Water Surface Background' },
    ]
  },
  { 
    label: { ar: '🪵 خامات ومواد', en: '🪵 Textures & Materials' }, 
    options: [
      { label: { ar: 'خشبي', en: 'Wooden Texture' }, value: 'Wood Texture Background' },
      { label: { ar: 'رخامي', en: 'Marble Texture' }, value: 'Marble Texture Background' },
      { label: { ar: 'حجري', en: 'Stone Texture' }, value: 'Stone Texture Background' },
      { label: { ar: 'رملي', en: 'Sandy Texture' }, value: 'Sand Texture Background' },
      { label: { ar: 'قماشي', en: 'Fabric Texture' }, value: 'Fabric Texture Background' },
      { label: { ar: 'معدني', en: 'Metallic Texture' }, value: 'Brushed Metal Texture' },
      { label: { ar: 'بلاستيكي', en: 'Plastic Texture' }, value: 'Plastic Texture Background' },
      { label: { ar: 'زجاجي', en: 'Glass Texture' }, value: 'Glass Texture Background' },
      { label: { ar: 'إسمنتي', en: 'Concrete Texture' }, value: 'Concrete Texture Background' },
    ]
  },
  { 
    label: { ar: '🎨 خلفيات موحدة', en: '🎨 Plain Backgrounds' }, 
    options: [
      { label: { ar: 'لون موحد أبيض', en: 'Solid White' }, value: 'Solid White Background' },
      { label: { ar: 'لون موحد أسود', en: 'Solid Black' }, value: 'Solid Black Background' },
      { label: { ar: 'لون موحد رمادي', en: 'Solid Grey' }, value: 'Solid Grey Background' },
      { label: { ar: 'لون موحد ذهبي', en: 'Solid Gold' }, value: 'Solid Gold Background' },
      { label: { ar: 'لون موحد بيج', en: 'Solid Beige' }, value: 'Solid Beige Background' },
      { label: { ar: 'خلفية متدرجة الألوان (Gradient)', en: 'Gradient Background' }, value: 'Smooth Gradient Background' },
    ]
  },
  { 
    label: { ar: '🛍️ منصات عرض', en: '🛍️ Display Platforms' }, 
    options: [
      { label: { ar: 'منصة عرض بيضاء', en: 'White Podium' }, value: 'Minimal White Podium' },
      { label: { ar: 'قاعدة رخامية', en: 'Marble Base' }, value: 'Marble Podium Base' },
      { label: { ar: 'صندوق خشبي', en: 'Wooden Box' }, value: 'Wooden Box Display' },
      { label: { ar: 'قاعدة دائرية', en: 'Circular Base' }, value: 'Circular Display Base' },
      { label: { ar: 'قاعدة زجاجية', en: 'Glass Base' }, value: 'Glass Display Podium' },
      { label: { ar: 'خلفية هندسية ثلاثية الأبعاد', en: '3D Geometric Background' }, value: '3D Geometric Shapes Background' },
      { label: { ar: 'منصة إضاءة خافتة', en: 'Dimly Lit Platform' }, value: 'Dimly Lit Display Platform' },
    ]
  },
  { 
    label: { ar: '🌆 مشاهد خارجية', en: '🌆 Outdoor / Urban' }, 
    options: [
      { label: { ar: 'شارع المدينة', en: 'City Street' }, value: 'Urban City Street' },
      { label: { ar: 'واجهة متجر', en: 'Storefront' }, value: 'Shop Storefront' },
      { label: { ar: 'جدار طوبي', en: 'Brick Wall' }, value: 'Brick Wall Background' },
      { label: { ar: 'خلفية ليلية بإضاءة نيون', en: 'Neon Night Background' }, value: 'Neon Night City Background' },
      { label: { ar: 'ممر زجاجي', en: 'Glass Walkway' }, value: 'Glass Walkway' },
      { label: { ar: 'مبنى حديث', en: 'Modern Building' }, value: 'Modern Architecture Building' },
      { label: { ar: 'جراج سيارات', en: 'Parking Garage' }, value: 'Parking Garage' },
      { label: { ar: 'خلفية سوق شعبي', en: 'Traditional Market Background' }, value: 'Traditional Market Background' },
    ]
  },
  { 
    label: { ar: '🌙 مشاهد موسمية', en: '🌙 Seasonal Scenes' }, 
    options: [
      { label: { ar: 'أجواء رمضانية (فوانيس، هلال)', en: 'Ramadan Atmosphere' }, value: 'Ramadan Atmosphere, Lanterns, Crescent, Warm Lighting' },
      { label: { ar: 'خيام رمضانية تقليدية', en: 'Traditional Ramadan Tents' }, value: 'Traditional Ramadan Tent Interior' },
      { label: { ar: 'مشهد عيد الفطر', en: 'Eid Al-Fitr Scene' }, value: 'Eid Al-Fitr Atmosphere, Sweets, Joyful' },
      { label: { ar: 'مشهد عيد الأضحى', en: 'Eid Al-Adha Scene' }, value: 'Eid Al-Adha Atmosphere, Festive' },
      { label: { ar: 'أجواء شتوية (برد، دفء)', en: 'Winter Atmosphere' }, value: 'Winter Atmosphere, Cold, Steam, Cozy' },
      { label: { ar: 'أجواء صيفية (بحر، شمس)', en: 'Summer Atmosphere' }, value: 'Summer Atmosphere, Bright Sun, Beach' },
      { label: { ar: 'أجواء الخريف', en: 'Autumn Atmosphere' }, value: 'Autumn Atmosphere, Fallen Leaves' },
      { label: { ar: 'أجواء الربيع', en: 'Spring Atmosphere' }, value: 'Spring Atmosphere, Flowers, Greenery' },
      { label: { ar: 'مشاهد وطنية', en: 'National Day Scene' }, value: 'National Day Celebration, Flags' },
      { label: { ar: 'مشهد موسم الحج والعمرة', en: 'Hajj & Umrah Season' }, value: 'Hajj Umrah Season, Mecca, White Robes, Spiritual' },
    ]
  }
];

export const REALISM_ENGINE_PROMPTS = {
    // Hidden config for realism engine
    base: "hyper-realistic, 8k resolution, highly detailed, photorealistic",
};
