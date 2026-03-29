
import React, { useContext, useEffect, useState } from 'react';
import { Tab, ArchivedItem } from '../../types';
import { ProjectContext } from '../../contexts/ProjectContext';
import { getItem } from '../../utils/localStorage';
import { ARCHIVE_STORAGE_KEY } from '../../constants';
import {
  CreatePostIcon, WebsiteIcon, ImageIcon, StyleIcon, ArchiveIcon,
  LightBulbIcon, DocumentTextIcon, MagicWandIcon, PaintBrushIcon,
  TemplateIcon, ChartBarIcon, VideoCameraIcon, SpeakerWaveIcon,
  ShoppingBagIcon, CogIcon, InfoIcon, PostlyLogo, HomeIcon
} from '../Icons';

interface HomeViewProps {
  setActiveTab: (tab: Tab) => void;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  Post: <CreatePostIcon className="w-4 h-4" />,
  Website: <WebsiteIcon className="w-4 h-4" />,
  Image: <ImageIcon className="w-4 h-4" />,
  EditedImage: <ImageIcon className="w-4 h-4" />,
  Idea: <LightBulbIcon className="w-4 h-4" />,
  CreativeIdea: <LightBulbIcon className="w-4 h-4" />,
  Reel: <VideoCameraIcon className="w-4 h-4" />,
  Ad: <CreatePostIcon className="w-4 h-4" />,
  BrandKit: <MagicWandIcon className="w-4 h-4" />,
  Video: <VideoCameraIcon className="w-4 h-4" />,
  Summary: <DocumentTextIcon className="w-4 h-4" />,
  Audio: <SpeakerWaveIcon className="w-4 h-4" />,
  GraphicDesign: <PaintBrushIcon className="w-4 h-4" />,
  Infographic: <ChartBarIcon className="w-4 h-4" />,
  ProductPhoto: <ShoppingBagIcon className="w-4 h-4" />,
  PostlySpaces: <HomeIcon className="w-4 h-4" />,
};

const HomeView: React.FC<HomeViewProps> = ({ setActiveTab }) => {
  const { appLanguage, theme, topic, industry } = useContext(ProjectContext);
  const isAr = appLanguage === 'ar';
  const isLight = theme === 'light';
  const isDark = theme === 'dark';

  const [archiveItems, setArchiveItems] = useState<ArchivedItem[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const items = getItem<ArchivedItem[]>(ARCHIVE_STORAGE_KEY) || [];
    setArchiveItems(items);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const h = currentTime.getHours();
    if (isAr) {
      if (h < 12) return 'صباح الخير';
      if (h < 17) return 'مساء الخير';
      return 'مساء النور';
    }
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Stats
  const totalItems = archiveItems.length;
  const typeCount = archiveItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});
  const recentItems = [...archiveItems].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

  const stats = [
    { labelAr: 'إجمالي المحتوى', labelEn: 'Total Content', value: totalItems, icon: <ArchiveIcon className="w-5 h-5" />, color: 'from-blue-500 to-blue-700' },
    { labelAr: 'منشورات', labelEn: 'Posts', value: (typeCount['Post'] || 0) + (typeCount['Reel'] || 0) + (typeCount['Ad'] || 0), icon: <CreatePostIcon className="w-5 h-5" />, color: 'from-purple-500 to-purple-700' },
    { labelAr: 'صور وتصاميم', labelEn: 'Images & Designs', value: (typeCount['Image'] || 0) + (typeCount['EditedImage'] || 0) + (typeCount['GraphicDesign'] || 0) + (typeCount['ProductPhoto'] || 0), icon: <ImageIcon className="w-5 h-5" />, color: 'from-pink-500 to-pink-700' },
    { labelAr: 'فيديو وصوت', labelEn: 'Video & Audio', value: (typeCount['Video'] || 0) + (typeCount['Audio'] || 0), icon: <VideoCameraIcon className="w-5 h-5" />, color: 'from-[#bf8339] to-amber-600' },
  ];

  const quickActions = [
    { tab: Tab.CreatePost, icon: <CreatePostIcon className="w-6 h-6" />, labelAr: 'منشور جديد', labelEn: 'New Post', color: 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' },
    { tab: Tab.AIImages, icon: <ImageIcon className="w-6 h-6" />, labelAr: 'توليد صورة', labelEn: 'Generate Image', color: 'bg-pink-500/20 text-pink-300 hover:bg-pink-500/30' },
    { tab: Tab.IdeaGenerator, icon: <LightBulbIcon className="w-6 h-6" />, labelAr: 'فكرة جديدة', labelEn: 'New Idea', color: 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30' },
    { tab: Tab.CreateVideo, icon: <VideoCameraIcon className="w-6 h-6" />, labelAr: 'فيديو', labelEn: 'Video', color: 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' },
    { tab: Tab.BrandKit, icon: <MagicWandIcon className="w-6 h-6" />, labelAr: 'هوية براند', labelEn: 'Brand Kit', color: 'bg-green-500/20 text-green-300 hover:bg-green-500/30' },
    { tab: Tab.WebsiteContent, icon: <WebsiteIcon className="w-6 h-6" />, labelAr: 'محتوى SEO', labelEn: 'SEO Content', color: 'bg-teal-500/20 text-teal-300 hover:bg-teal-500/30' },
  ];

  const features = [
    { tab: Tab.IdeaGenerator, icon: <LightBulbIcon className="w-7 h-7" />, titleAr: 'مولد الأفكار', titleEn: 'Idea Generator', descAr: 'أفكار فيرال وتحليل للجمهور', descEn: 'Viral ideas & audience analysis', badge: null },
    { tab: Tab.InstantSummary, icon: <DocumentTextIcon className="w-7 h-7" />, titleAr: 'الملخص الفوري', titleEn: 'Instant Summary', descAr: 'تلخيص فيديوهات ومقالات', descEn: 'Summarize videos & articles', badge: null },
    { tab: Tab.CreatePost, icon: <CreatePostIcon className="w-7 h-7" />, titleAr: 'استوديو المحتوى', titleEn: 'Content Studio', descAr: 'منشورات، ريلز، وإعلانات', descEn: 'Posts, reels & ads', badge: { ar: 'الأكثر استخداماً', en: 'Most Used' } },
    { tab: Tab.WebsiteContent, icon: <WebsiteIcon className="w-7 h-7" />, titleAr: 'محتوى الموقع (SEO)', titleEn: 'Website Content (SEO)', descAr: 'مقالات وصفحات هبوط', descEn: 'Articles & landing pages', badge: null },
    { tab: Tab.AIImages, icon: <ImageIcon className="w-7 h-7" />, titleAr: 'استوديو الصور', titleEn: 'Image Studio', descAr: 'توليد وتعديل صور بالذكاء الاصطناعي', descEn: 'AI image generation & editing', badge: { ar: 'مميز', en: 'Featured' } },
    { tab: Tab.ProfessionalProduct, icon: <ShoppingBagIcon className="w-7 h-7" />, titleAr: 'منتج احترافي', titleEn: 'Professional Product', descAr: 'صور إعلانية سينمائية', descEn: 'Cinematic commercial shots', badge: null },
    { tab: Tab.BrandKit, icon: <MagicWandIcon className="w-7 h-7" />, titleAr: 'هوية البراند', titleEn: 'Brand Kit', descAr: 'شعارات، ألوان، ونبرة صوت', descEn: 'Logos, colors & brand voice', badge: null },
    { tab: Tab.GraphicDesigner, icon: <PaintBrushIcon className="w-7 h-7" />, titleAr: 'مصمم الجرافيك', titleEn: 'Graphic Designer', descAr: 'بوسترات وموك أب', descEn: 'Posters & mockups', badge: null },
    { tab: Tab.Templates, icon: <TemplateIcon className="w-7 h-7" />, titleAr: 'مكتبة القوالب', titleEn: 'Templates', descAr: 'قوالب جاهزة للجميع', descEn: 'Ready templates for all', badge: { ar: 'جديد', en: 'New' } },
    { tab: Tab.InfographicDesigner, icon: <ChartBarIcon className="w-7 h-7" />, titleAr: 'صانع الانفوجرافيك', titleEn: 'Infographic Maker', descAr: 'بيانات إلى تصاميم بصرية', descEn: 'Data into visual designs', badge: null },
    { tab: Tab.CreateVideo, icon: <VideoCameraIcon className="w-7 h-7" />, titleAr: 'صانع الفيديو (Veo)', titleEn: 'Video Creator (Veo)', descAr: 'نصوص وصور إلى فيديو', descEn: 'Text & images to video', badge: { ar: 'AI', en: 'AI' } },
    { tab: Tab.CreateAudio, icon: <SpeakerWaveIcon className="w-7 h-7" />, titleAr: 'استوديو الصوت', titleEn: 'Audio Studio', descAr: 'تحويل النص إلى كلام', descEn: 'Text-to-Speech synthesis', badge: null },
    { tab: Tab.StyleTraining, icon: <StyleIcon className="w-7 h-7" />, titleAr: 'مدرب الأسلوب', titleEn: 'Style Trainer', descAr: 'الذكاء يقلد أسلوبك', descEn: 'AI mimics your style', badge: null },
    { tab: Tab.Archive, icon: <ArchiveIcon className="w-7 h-7" />, titleAr: 'الأرشيف الشامل', titleEn: 'Comprehensive Archive', descAr: 'حفظ وتصدير أعمالك', descEn: 'Save & export your work', badge: null },
    { tab: Tab.Settings, icon: <CogIcon className="w-7 h-7" />, titleAr: 'الإعدادات', titleEn: 'Settings', descAr: 'تخصيص التطبيق', descEn: 'Customize the app', badge: null },
    { tab: Tab.About, icon: <InfoIcon className="w-7 h-7" />, titleAr: 'عن التطبيق', titleEn: 'About', descAr: 'معلومات عن Postly-AI', descEn: 'About Postly-AI', badge: null },
  ];

  const cardBase = isLight
    ? 'bg-white border-gray-200 hover:border-[#bf8339] shadow-sm hover:shadow-md'
    : isDark
    ? 'bg-white/5 border-white/10 hover:border-[#bf8339] hover:bg-white/8'
    : 'bg-[#FFFCF8] border-[#D7CCC8] hover:border-[#C19A6B]';

  const textPrimary = isLight ? 'text-[#0a1e3c]' : isDark ? 'text-white' : 'text-[#3E2723]';
  const textSecondary = isLight ? 'text-gray-500' : isDark ? 'text-white/60' : 'text-[#795548]';

  return (
    <div className="space-y-10 animate-fade-in pb-24">

      {/* ── Hero Section ── */}
      <div className={`relative rounded-3xl overflow-hidden border ${isLight ? 'bg-gradient-to-br from-[#0a1e3c]/5 to-[#bf8339]/5 border-gray-200' : isDark ? 'bg-gradient-to-br from-[#bf8339]/10 via-[#0a1e3c] to-[#0a2050] border-white/5' : 'bg-[#F0EAD6] border-[#D7CCC8]'}`}>
        {/* Animated Background Blobs */}
        {isDark && (
          <>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#bf8339]/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
          </>
        )}

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 px-8 py-12">
          <div className="flex-1 text-center md:text-start">
            <p className={`text-sm font-medium mb-2 ${isDark ? 'text-[#bf8339]' : 'text-amber-600'}`}>
              {getGreeting()} 👋
            </p>
            <h1 className={`text-4xl md:text-5xl font-black mb-4 leading-tight ${textPrimary}`}>
              Postly-<span className="text-[#bf8339]">AI</span>
            </h1>
            <p className={`text-base md:text-lg max-w-lg leading-relaxed ${textSecondary}`}>
              {isAr
                ? 'منصتك الإبداعية المتكاملة بالذكاء الاصطناعي — كل الأدوات في مكان واحد.'
                : 'Your all-in-one AI-powered creative platform — every tool in one place.'}
            </p>
            {topic && (
              <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${isDark ? 'bg-white/10 text-white/70' : 'bg-[#0a1e3c]/10 text-[#0a1e3c]/70'}`}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {isAr ? `المشروع الحالي: ${topic}` : `Current project: ${topic}`}
              </div>
            )}
          </div>
          <div className="shrink-0">
            <PostlyLogo className="w-28 h-28 drop-shadow-2xl" />
          </div>
        </div>

        {/* Quick Actions Strip */}
        <div className={`relative z-10 px-8 pb-8`}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
            {isAr ? 'إجراءات سريعة' : 'Quick Actions'}
          </p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map(action => (
              <button
                key={action.tab}
                onClick={() => setActiveTab(action.tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${action.color}`}
              >
                {action.icon}
                <span>{isAr ? action.labelAr : action.labelEn}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      {totalItems > 0 && (
        <div>
          <h2 className={`text-lg font-bold mb-4 ${textPrimary}`}>
            {isAr ? 'إحصائياتك' : 'Your Stats'}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1 ${cardBase}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 pointer-events-none`} />
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br ${stat.color} text-white`}>
                  {stat.icon}
                </div>
                <p className={`text-3xl font-black ${textPrimary}`}>{stat.value}</p>
                <p className={`text-xs mt-1 ${textSecondary}`}>{isAr ? stat.labelAr : stat.labelEn}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Recent Activity ── */}
      {recentItems.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-bold ${textPrimary}`}>
              {isAr ? 'آخر الأعمال' : 'Recent Work'}
            </h2>
            <button
              onClick={() => setActiveTab(Tab.Archive)}
              className="text-sm text-[#bf8339] hover:underline transition"
            >
              {isAr ? 'عرض الكل ←' : 'View all →'}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {recentItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(Tab.Archive)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-start transition-all duration-200 hover:-translate-y-1 hover:shadow-md group ${cardBase}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-[#bf8339]/20 text-[#bf8339]' : 'bg-amber-100 text-amber-600'}`}>
                  {TYPE_ICONS[item.type] || <ArchiveIcon className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold truncate ${textPrimary}`}>{item.type}</p>
                  <p className={`text-xs truncate ${textSecondary}`}>
                    {new Date(item.timestamp).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── All Features Grid ── */}
      <div>
        <h2 className={`text-lg font-bold mb-5 ${textPrimary}`}>
          {isAr ? 'جميع الأدوات' : 'All Tools'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map((feature, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(feature.tab)}
              className={`relative p-5 rounded-2xl border transition-all duration-300 group hover:-translate-y-2 hover:shadow-xl text-start flex flex-col overflow-hidden ${cardBase}`}
            >
              {/* Hover Glow */}
              <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#bf8339]/10 rounded-full blur-2xl group-hover:bg-[#bf8339]/25 transition-all duration-500" />

              {/* Badge */}
              {feature.badge && (
                <span className="absolute top-3 end-3 px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#bf8339] text-white shadow">
                  {isAr ? feature.badge.ar : feature.badge.en}
                </span>
              )}

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md transition-transform group-hover:scale-110 ${isDark ? 'bg-[#bf8339]/20 text-[#bf8339]' : 'bg-amber-100 text-amber-600'}`}>
                {feature.icon}
              </div>

              <h3 className={`text-sm font-bold mb-1.5 ${textPrimary}`}>
                {isAr ? feature.titleAr : feature.titleEn}
              </h3>
              <p className={`text-xs leading-relaxed ${textSecondary}`}>
                {isAr ? feature.descAr : feature.descEn}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Getting Started (only for empty archive) ── */}
      {totalItems === 0 && (
        <div className={`rounded-2xl p-8 border text-center ${isDark ? 'bg-[#bf8339]/5 border-[#bf8339]/20' : 'bg-amber-50 border-amber-200'}`}>
          <div className="text-4xl mb-3">🚀</div>
          <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>
            {isAr ? 'ابدأ رحلتك الإبداعية!' : 'Start your creative journey!'}
          </h3>
          <p className={`text-sm mb-6 ${textSecondary}`}>
            {isAr
              ? 'أنشئ أول محتوى لك بالذكاء الاصطناعي. اختر أي أداة من الأعلى وابدأ.'
              : 'Create your first AI-powered content. Pick any tool above and get started.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveTab(Tab.CreatePost)}
              className="px-5 py-2.5 bg-[#bf8339] text-white rounded-xl text-sm font-bold hover:bg-[#a66e2c] transition hover:scale-105 active:scale-95"
            >
              {isAr ? '✍️ اكتب أول منشور' : '✍️ Write your first post'}
            </button>
            <button
              onClick={() => setActiveTab(Tab.IdeaGenerator)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105 active:scale-95 ${isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-white text-[#0a1e3c] hover:bg-gray-50 border border-gray-200'}`}
            >
              {isAr ? '💡 ولّد أفكاراً' : '💡 Generate ideas'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomeView;
