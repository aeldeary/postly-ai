
import React, { useContext } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import { Tab } from '../../types';
import { UI_TRANSLATIONS } from '../../constants';
import { 
  HomeIcon, CreatePostIcon, WebsiteIcon, ImageIcon, StyleIcon, ArchiveIcon, 
  LightBulbIcon, DocumentTextIcon, MagicWandIcon, PaintBrushIcon, 
  TemplateIcon, ChartBarIcon, VideoCameraIcon, SpeakerWaveIcon, 
  SparklesIcon, BoltIcon, FingerPrintIcon, SwatchIcon, ShoppingBagIcon, CogIcon, InfoIcon, PostlyLogo
} from '../Icons';

interface AboutViewProps {
  setActiveTab: (tab: Tab) => void;
}

const AboutView: React.FC<AboutViewProps> = ({ setActiveTab }) => {
  const { appLanguage, theme } = useContext(ProjectContext);
  const isAr = appLanguage === 'ar';
  const isLight = theme === 'light';
  const isComfort = theme === 'comfort';
  const t = UI_TRANSLATIONS;

  // Dynamic Styles based on theme
  const cardClass = isLight 
    ? 'bg-white border-gray-200 shadow-sm' 
    : isComfort 
    ? 'bg-[#FFFCF8] border-[#D7CCC8] shadow-sm'
    : 'bg-white/5 border-white/10 hover:bg-white/10';

  const textHeadClass = isLight || isComfort ? 'text-[#3E2723]' : 'text-white';
  const textBodyClass = isLight || isComfort ? 'text-[#5D4037]' : 'text-white/70';

  // Exact same list as Sidebar
  const toolsList = [
    { tab: Tab.Home, icon: <HomeIcon className="w-5 h-5" />, label: t.dashboard },
    { tab: Tab.IdeaGenerator, icon: <LightBulbIcon className="w-5 h-5" />, label: t.ideaGenerator },
    { tab: Tab.InstantSummary, icon: <DocumentTextIcon className="w-5 h-5" />, label: t.instantSummary },
    { tab: Tab.CreatePost, icon: <CreatePostIcon className="w-5 h-5" />, label: t.contentStudio },
    { tab: Tab.WebsiteContent, icon: <WebsiteIcon className="w-5 h-5" />, label: t.websiteContent },
    { tab: Tab.AIImages, icon: <ImageIcon className="w-5 h-5" />, label: t.imageStudio },
    { tab: Tab.ProfessionalProduct, icon: <ShoppingBagIcon className="w-5 h-5" />, label: t.professionalProduct },
    { tab: Tab.BrandKit, icon: <MagicWandIcon className="w-5 h-5" />, label: t.brandIdentity },
    { tab: Tab.GraphicDesigner, icon: <PaintBrushIcon className="w-5 h-5" />, label: t.graphicDesigner },
    { tab: Tab.Templates, icon: <TemplateIcon className="w-5 h-5" />, label: t.templates },
    { tab: Tab.InfographicDesigner, icon: <ChartBarIcon className="w-5 h-5" />, label: t.infographicDesigner },
    { tab: Tab.CreateVideo, icon: <VideoCameraIcon className="w-5 h-5" />, label: t.createVideo },
    { tab: Tab.CreateAudio, icon: <SpeakerWaveIcon className="w-5 h-5" />, label: t.createAudio },
    { tab: Tab.StyleTraining, icon: <StyleIcon className="w-5 h-5" />, label: t.styleTrainer },
    { tab: Tab.Archive, icon: <ArchiveIcon className="w-5 h-5" />, label: t.archive },
    { tab: Tab.Settings, icon: <CogIcon className="w-5 h-5" />, label: t.settings },
    { tab: Tab.About, icon: <InfoIcon className="w-5 h-5" />, label: t.about },
  ];

  const sections = [
    {
      titleAr: 'صناعة المحتوى النصي',
      titleEn: 'Text Content Creation',
      descAr: 'اكتب منشورات، مقالات، سيناريوهات فيديو، وإعلانات بأي لهجة عربية أو لغة عالمية.',
      descEn: 'Write posts, articles, scripts, and ads in any Arabic dialect or global language.',
      icon: <CreatePostIcon className="w-6 h-6 text-[#bf8339]" />
    },
    {
      titleAr: 'الإنتاج البصري (صور وفيديو)',
      titleEn: 'Visual Production',
      descAr: 'حوّل خيالك إلى صور واقعية، تصاميم جرافيك، انفوجرافيك، وحتى مقاطع فيديو سينمائية.',
      descEn: 'Turn imagination into realistic photos, graphic designs, infographics, and cinematic videos.',
      icon: <ImageIcon className="w-6 h-6 text-[#bf8339]" />
    },
    {
      titleAr: 'الاستوديو الصوتي',
      titleEn: 'Audio Studio',
      descAr: 'حول النصوص إلى تعليق صوتي احترافي بنبرات بشرية واقعية ولهجات متعددة.',
      descEn: 'Convert text to professional voiceovers with realistic human tones and dialects.',
      icon: <SpeakerWaveIcon className="w-6 h-6 text-[#bf8339]" />
    },
    {
      titleAr: 'التخصيص والهوية',
      titleEn: 'Personalization & Brand',
      descAr: 'درب الذكاء الاصطناعي على أسلوبك الخاص وابنِ هوية بصرية كاملة لعلامتك التجارية.',
      descEn: 'Train AI on your unique style and build a full visual identity for your brand.',
      icon: <FingerPrintIcon className="w-6 h-6 text-[#bf8339]" />
    }
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      
      {/* 1. Hero / Intro Section */}
      <div className={`text-center py-12 px-6 rounded-3xl relative overflow-hidden border ${isLight ? 'bg-white border-gray-200' : isComfort ? 'bg-[#F9F7F2] border-[#D7CCC8]' : 'bg-[#0a1e3c]/60 border-white/10'}`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#bf8339]/10 rounded-full blur-[100px] -z-10"></div>
        
        <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
             <PostlyLogo className="w-full h-full drop-shadow-xl" />
        </div>
        
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${textHeadClass}`}>
          Postly-AI
        </h1>
        <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${textBodyClass}`}>
          {isAr 
            ? 'منصتك الشاملة للإبداع الرقمي. نجمع بين قوة الذكاء الاصطناعي وفهم اللغة العربية واللهجات المحلية لمساعدتك في إنشاء محتوى احترافي متكامل في ثوانٍ.' 
            : 'Your comprehensive platform for digital creativity. Combining AI power with deep understanding of Arabic language and dialects to help you create professional content in seconds.'}
        </p>
      </div>

      {/* 2. Why Postly? (Value Proposition) */}
      <div>
        <h3 className={`text-2xl font-bold mb-6 px-2 flex items-center gap-2 ${textHeadClass}`}>
            <BoltIcon className="w-6 h-6 text-[#bf8339]" />
            {isAr ? 'ماذا يمكنك أن تفعل؟' : 'What can you do?'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((sec, idx) => (
                <div key={idx} className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${cardClass}`}>
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${isLight || isComfort ? 'bg-[#bf8339]/10' : 'bg-white/10'}`}>
                            {sec.icon}
                        </div>
                        <div>
                            <h4 className={`text-lg font-bold mb-2 ${textHeadClass}`}>
                                {isAr ? sec.titleAr : sec.titleEn}
                            </h4>
                            <p className={`text-sm leading-relaxed ${textBodyClass}`}>
                                {isAr ? sec.descAr : sec.descEn}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* 3. Unique Selling Points */}
      <div className={`p-8 rounded-3xl border ${isLight ? 'bg-orange-50 border-orange-100' : isComfort ? 'bg-[#EFEBE0] border-[#D7CCC8]' : 'bg-[#bf8339]/10 border-[#bf8339]/20'}`}>
          <h3 className={`text-xl font-bold mb-4 ${textHeadClass}`}>
              {isAr ? 'لماذا Postly-AI مختلف؟' : 'Why Postly-AI is different?'}
          </h3>
          <ul className={`space-y-3 ${textBodyClass}`}>
              <li className="flex items-start gap-3">
                  <span className="text-[#bf8339] mt-1">✓</span>
                  <span>
                      {isAr ? 'دعم كامل للهجات العربية (السعودية، المصرية، الخليجية، وغيرها) في الكتابة والصوت.' : 'Full support for Arabic dialects (Saudi, Egyptian, Gulf, etc.) in writing and voice.'}
                  </span>
              </li>
              <li className="flex items-start gap-3">
                  <span className="text-[#bf8339] mt-1">✓</span>
                  <span>
                      {isAr ? 'خاصية "تدريب الأسلوب" تجعل الذكاء الاصطناعي يكتب بنفس طريقتك وشخصيتك.' : '"Style Training" feature makes AI write exactly in your tone and persona.'}
                  </span>
              </li>
              <li className="flex items-start gap-3">
                  <span className="text-[#bf8339] mt-1">✓</span>
                  <span>
                      {isAr ? 'أدوات متخصصة للسوق المحلي: تحويل صور المنتجات، تصميم البوسترات، وتحليل الجمهور.' : 'Specialized tools for local market: Product photo transformation, poster design, and audience analysis.'}
                  </span>
              </li>
              <li className="flex items-start gap-3">
                  <span className="text-[#bf8339] mt-1">✓</span>
                  <span>
                      {isAr ? 'الكل في واحد: لا داعي للتنقل بين تطبيقات مختلفة للنصوص والصور والفيديو.' : 'All-in-One: No need to switch between different apps for text, images, and video.'}
                  </span>
              </li>
          </ul>
      </div>

      {/* 4. Tools Catalog Grid */}
      <div>
        <h3 className={`text-2xl font-bold mb-6 px-2 flex items-center gap-2 ${textHeadClass}`}>
            <SwatchIcon className="w-6 h-6 text-[#bf8339]" />
            {isAr ? 'كتالوج الأدوات' : 'Tools Catalog'}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {toolsList.map((tool, idx) => (
            <button 
              key={idx} 
              onClick={() => setActiveTab(tool.tab)}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-3 transition-all hover:border-[#bf8339] hover:scale-105 group ${cardClass}`}
            >
              <div className={`p-2 rounded-full transition-colors ${isLight || isComfort ? 'bg-[#bf8339]/10 text-[#bf8339]' : 'bg-[#bf8339]/20 text-[#bf8339]'}`}>
                {tool.icon}
              </div>
              <span className={`text-xs font-bold transition-colors group-hover:text-[#bf8339] ${textHeadClass}`}>
                  {typeof tool.label === 'string' ? tool.label : tool.label[appLanguage]}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AboutView;
