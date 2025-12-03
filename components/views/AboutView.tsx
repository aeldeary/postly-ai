
import React, { useContext } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import { 
  CreatePostIcon, WebsiteIcon, ImageIcon, StyleIcon, ArchiveIcon, 
  LightBulbIcon, DocumentTextIcon, MagicWandIcon, PaintBrushIcon, 
  TemplateIcon, ChartBarIcon, VideoCameraIcon, SpeakerWaveIcon, 
  ChatBubbleIcon 
} from '../Icons';

const AboutView: React.FC = () => {
  const { appLanguage, theme } = useContext(ProjectContext);
  const isAr = appLanguage === 'ar';
  const isLight = theme === 'light';

  const features = [
    {
      icon: <LightBulbIcon className="w-8 h-8" />,
      titleAr: 'مولد الأفكار',
      titleEn: 'Idea Generator',
      descAr: 'توليد أفكار فيرال، استراتيجيات تسويقية، وتحليل للجمهور المستهدف.',
      descEn: 'Generate viral ideas, marketing strategies, and target audience analysis.'
    },
    {
      icon: <DocumentTextIcon className="w-8 h-8" />,
      titleAr: 'الملخص الفوري',
      titleEn: 'Instant Summary',
      descAr: 'تلخيص الفيديوهات والمقالات الطويلة وإعادة تدويرها لمنصات التواصل.',
      descEn: 'Summarize long videos and articles and repurpose them for social media.'
    },
    {
      icon: <CreatePostIcon className="w-8 h-8" />,
      titleAr: 'استوديو المحتوى',
      titleEn: 'Content Studio',
      descAr: 'كتابة منشورات، سيناريوهات ريلز، وإعلانات احترافية بضغطة زر.',
      descEn: 'Write posts, reels scripts, and professional ads with one click.'
    },
    {
      icon: <WebsiteIcon className="w-8 h-8" />,
      titleAr: 'محتوى المواقع (SEO)',
      titleEn: 'Web Content SEO',
      descAr: 'إنشاء مقالات وصفحات هبوط متوافقة مع محركات البحث (SEO).',
      descEn: 'Create SEO-optimized articles and landing pages.'
    },
    {
      icon: <ImageIcon className="w-8 h-8" />,
      titleAr: 'استوديو الصور',
      titleEn: 'Image Studio',
      descAr: 'توليد صور بالذكاء الاصطناعي، تعديل ذكي، ودمج الصور.',
      descEn: 'AI image generation, smart editing, and image blending.'
    },
    {
      icon: <VideoCameraIcon className="w-8 h-8" />,
      titleAr: 'صانع الفيديو (Veo)',
      titleEn: 'Video Creator (Veo)',
      descAr: 'تحويل النصوص والصور إلى مقاطع فيديو سينمائية عالية الدقة.',
      descEn: 'Turn text and images into high-definition cinematic videos.'
    },
    {
      icon: <SpeakerWaveIcon className="w-8 h-8" />,
      titleAr: 'استوديو الصوت',
      titleEn: 'Audio Studio',
      descAr: 'تحويل النص إلى كلام (TTS) بنبرات ولهجات عربية واقعية.',
      descEn: 'Text-to-Speech (TTS) with realistic Arabic tones and dialects.'
    },
    {
      icon: <PaintBrushIcon className="w-8 h-8" />,
      titleAr: 'مصمم الجرافيك',
      titleEn: 'Graphic Designer',
      descAr: 'تصميم بوسترات إعلانية وموك أب (Mockups) للمنتجات.',
      descEn: 'Design advertising posters and product mockups.'
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      titleAr: 'صانع الانفوجرافيك',
      titleEn: 'Infographic Maker',
      descAr: 'تحويل البيانات المعقدة إلى تصاميم بصرية سهلة الفهم.',
      descEn: 'Turn complex data into easy-to-understand visual designs.'
    },
    {
      icon: <MagicWandIcon className="w-8 h-8" />,
      titleAr: 'هوية البراند',
      titleEn: 'Brand Kit',
      descAr: 'بناء هوية كاملة: شعارات، ألوان، ونبرة صوت للعلامة التجارية.',
      descEn: 'Build a full identity: logos, colors, and brand voice.'
    },
    {
      icon: <TemplateIcon className="w-8 h-8" />,
      titleAr: 'مكتبة القوالب',
      titleEn: 'Templates',
      descAr: 'قوالب جاهزة لجميع المجالات مع إمكانية إعادة الصياغة.',
      descEn: 'Ready-to-use templates for all industries with remixing capabilities.'
    },
    {
      icon: <StyleIcon className="w-8 h-8" />,
      titleAr: 'مدرب الأسلوب',
      titleEn: 'Style Trainer',
      descAr: 'تدريب الذكاء الاصطناعي ليقلد أسلوبك الخاص في الكتابة.',
      descEn: 'Train AI to mimic your unique writing style.'
    },
    {
      icon: <ChatBubbleIcon className="w-8 h-8" />,
      titleAr: 'المساعد الذكي',
      titleEn: 'Smart Assistant',
      descAr: 'بوت دردشة ذكي للمساعدة في العصف الذهني وحل المشكلات.',
      descEn: 'Smart chatbot to assist with brainstorming and problem solving.'
    },
    {
      icon: <ArchiveIcon className="w-8 h-8" />,
      titleAr: 'الأرشيف الشامل',
      titleEn: 'Comprehensive Archive',
      descAr: 'حفظ واسترجاع وتصدير جميع أعمالك السابقة بسهولة.',
      descEn: 'Save, retrieve, and export all your past work easily.'
    },
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-10 relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#bf8339]/10 to-transparent border border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#bf8339]/20 rounded-full blur-[100px] -z-10"></div>
        
        <h2 className="text-5xl md:text-6xl font-bold text-[#bf8339] mb-4 drop-shadow-sm">Postly-AI</h2>
        <p className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light ${isLight ? 'text-[#0a1e3c]' : 'text-white/90'}`}>
          {isAr ? 'منصتك الإبداعية المتكاملة' : 'The All-in-One AI Powered Creative Platform'}
          <br />
          <span className={`text-base mt-3 block ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
            {isAr ? 'كل الأدوات التي تحتاجها لإنشاء محتوى احترافي في مكان واحد.' : 'All the tools you need to create professional content in one place.'}
          </span>
        </p>
      </div>

      {/* Features Grid */}
      <div>
        <h3 className={`text-center text-2xl font-bold mb-10 ${isLight ? 'text-[#0a1e3c]' : 'text-white'}`}>
            {isAr ? 'اكتشف قوة Postly-AI' : 'Discover the Power of Postly-AI'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className={`p-6 rounded-2xl border transition-all duration-300 group hover:-translate-y-2 hover:shadow-xl relative overflow-hidden ${
                  isLight 
                  ? 'bg-white border-gray-200 hover:border-[#bf8339] shadow-sm' 
                  : 'bg-white/5 border-white/10 hover:border-[#bf8339] hover:bg-white/10'
              }`}
            >
              {/* Background Glow on Hover */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#bf8339]/10 rounded-full blur-2xl group-hover:bg-[#bf8339]/20 transition-colors"></div>

              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110 ${
                  isLight ? 'bg-[#bf8339]/10 text-[#bf8339]' : 'bg-[#bf8339]/20 text-[#bf8339]'
              }`}>
                {feature.icon}
              </div>
              
              <h3 className={`text-lg font-bold mb-3 ${isLight ? 'text-[#0a1e3c]' : 'text-white'}`}>
                  {isAr ? feature.titleAr : feature.titleEn}
              </h3>
              
              <p className={`text-sm leading-relaxed ${isLight ? 'text-gray-600' : 'text-white/60'}`}>
                {isAr ? feature.descAr : feature.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutView;
