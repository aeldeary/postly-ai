
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Tab } from '../types';
import { ProjectContext } from '../contexts/ProjectContext';
import {
  HomeIcon, CreatePostIcon, WebsiteIcon, ImageIcon, StyleIcon, ArchiveIcon,
  InfoIcon, MagicWandIcon, LightBulbIcon, VideoCameraIcon, SpeakerWaveIcon,
  DocumentTextIcon, CogIcon, PaintBrushIcon, ChartBarIcon, TemplateIcon,
  ShoppingBagIcon, CalendarIcon
} from './Icons';

interface SearchItem {
  tab: Tab;
  icon: React.ReactNode;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  tags: string[];
}

const SEARCH_ITEMS: SearchItem[] = [
  { tab: Tab.Home, icon: <HomeIcon className="w-5 h-5" />, titleAr: 'الرئيسية', titleEn: 'Dashboard', descAr: 'الصفحة الرئيسية', descEn: 'Main dashboard', tags: ['home', 'dashboard', 'main', 'رئيسية'] },
  { tab: Tab.IdeaGenerator, icon: <LightBulbIcon className="w-5 h-5" />, titleAr: 'مولد الأفكار', titleEn: 'Idea Generator', descAr: 'توليد أفكار فيرال واستراتيجيات تسويقية', descEn: 'Generate viral ideas and marketing strategies', tags: ['idea', 'viral', 'marketing', 'أفكار', 'تسويق'] },
  { tab: Tab.InstantSummary, icon: <DocumentTextIcon className="w-5 h-5" />, titleAr: 'الملخص الفوري', titleEn: 'Instant Summary', descAr: 'تلخيص المقالات والفيديوهات', descEn: 'Summarize articles and videos', tags: ['summary', 'article', 'video', 'ملخص', 'تلخيص'] },
  { tab: Tab.CreatePost, icon: <CreatePostIcon className="w-5 h-5" />, titleAr: 'استوديو المحتوى', titleEn: 'Content Studio', descAr: 'كتابة منشورات وسيناريوهات ريلز وإعلانات', descEn: 'Write posts, reels scripts, and ads', tags: ['post', 'reel', 'ad', 'content', 'منشور', 'إعلان', 'ريلز'] },
  { tab: Tab.WebsiteContent, icon: <WebsiteIcon className="w-5 h-5" />, titleAr: 'محتوى الموقع (SEO)', titleEn: 'Website Content (SEO)', descAr: 'مقالات وصفحات هبوط متوافقة مع SEO', descEn: 'SEO-optimized articles and landing pages', tags: ['seo', 'website', 'blog', 'article', 'موقع', 'مقال'] },
  { tab: Tab.AIImages, icon: <ImageIcon className="w-5 h-5" />, titleAr: 'استوديو الصور', titleEn: 'Image Studio', descAr: 'توليد وتعديل الصور بالذكاء الاصطناعي', descEn: 'AI image generation and editing', tags: ['image', 'photo', 'ai', 'generate', 'صور', 'تصوير'] },
  { tab: Tab.ProfessionalProduct, icon: <ShoppingBagIcon className="w-5 h-5" />, titleAr: 'منتج احترافي', titleEn: 'Professional Product', descAr: 'تحويل صور المنتجات إلى صور إعلانية', descEn: 'Transform product photos into commercial shots', tags: ['product', 'photo', 'commercial', 'منتج', 'تصوير'] },
  { tab: Tab.BrandKit, icon: <MagicWandIcon className="w-5 h-5" />, titleAr: 'هوية البراند', titleEn: 'Brand Kit', descAr: 'بناء هوية كاملة للعلامة التجارية', descEn: 'Build a full brand identity', tags: ['brand', 'logo', 'identity', 'هوية', 'براند', 'شعار'] },
  { tab: Tab.GraphicDesigner, icon: <PaintBrushIcon className="w-5 h-5" />, titleAr: 'مصمم الجرافيك', titleEn: 'Graphic Designer', descAr: 'تصميم بوسترات وموك أب', descEn: 'Design posters and mockups', tags: ['design', 'poster', 'mockup', 'graphic', 'تصميم', 'بوستر'] },
  { tab: Tab.Templates, icon: <TemplateIcon className="w-5 h-5" />, titleAr: 'مكتبة القوالب', titleEn: 'Templates', descAr: 'قوالب جاهزة لجميع المجالات', descEn: 'Ready-to-use templates for all industries', tags: ['template', 'ready', 'قوالب'] },
  { tab: Tab.InfographicDesigner, icon: <ChartBarIcon className="w-5 h-5" />, titleAr: 'صانع الانفوجرافيك', titleEn: 'Infographic Maker', descAr: 'تحويل البيانات إلى تصاميم بصرية', descEn: 'Turn data into visual designs', tags: ['infographic', 'chart', 'data', 'انفوجرافيك', 'بيانات'] },
  { tab: Tab.CreateVideo, icon: <VideoCameraIcon className="w-5 h-5" />, titleAr: 'صانع الفيديو', titleEn: 'Video Creator', descAr: 'تحويل النصوص والصور إلى فيديو', descEn: 'Turn text and images into videos', tags: ['video', 'veo', 'create', 'فيديو'] },
  { tab: Tab.CreateAudio, icon: <SpeakerWaveIcon className="w-5 h-5" />, titleAr: 'استوديو الصوت', titleEn: 'Audio Studio', descAr: 'تحويل النص إلى كلام', descEn: 'Text-to-Speech synthesis', tags: ['audio', 'speech', 'tts', 'voice', 'صوت'] },
  { tab: Tab.StyleTraining, icon: <StyleIcon className="w-5 h-5" />, titleAr: 'مدرب الأسلوب', titleEn: 'Style Trainer', descAr: 'تدريب الذكاء الاصطناعي على أسلوبك', descEn: 'Train AI to mimic your style', tags: ['style', 'train', 'أسلوب'] },
  { tab: Tab.Archive, icon: <ArchiveIcon className="w-5 h-5" />, titleAr: 'الأرشيف', titleEn: 'Archive', descAr: 'حفظ واسترجاع أعمالك', descEn: 'Save and retrieve your work', tags: ['archive', 'save', 'history', 'أرشيف', 'حفظ'] },
  { tab: Tab.Settings, icon: <CogIcon className="w-5 h-5" />, titleAr: 'الإعدادات', titleEn: 'Settings', descAr: 'تخصيص التطبيق', descEn: 'Customize the app', tags: ['settings', 'preferences', 'إعدادات'] },
  { tab: Tab.About, icon: <InfoIcon className="w-5 h-5" />, titleAr: 'عن التطبيق', titleEn: 'About', descAr: 'معلومات عن Postly-AI', descEn: 'About Postly-AI', tags: ['about', 'info', 'عن'] },
  { tab: Tab.ContentCalendar, icon: <CalendarIcon className="w-5 h-5" />, titleAr: 'تقويم المحتوى', titleEn: 'Content Calendar', descAr: 'تخطيط ونشر المحتوى الأسبوعي', descEn: 'Plan and schedule weekly content', tags: ['calendar', 'schedule', 'plan', 'تقويم', 'جدول', 'خطة'] },
];

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: Tab) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, onNavigate }) => {
  const { appLanguage, theme } = useContext(ProjectContext);
  const isAr = appLanguage === 'ar';
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? SEARCH_ITEMS.filter(item => {
        const q = query.toLowerCase();
        return (
          item.titleAr.toLowerCase().includes(q) ||
          item.titleEn.toLowerCase().includes(q) ||
          item.descAr.toLowerCase().includes(q) ||
          item.descEn.toLowerCase().includes(q) ||
          item.tags.some(t => t.toLowerCase().includes(q))
        );
      })
    : SEARCH_ITEMS;

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (filtered[selectedIndex]) {
        onNavigate(filtered[selectedIndex].tab);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const modalBg = isDark ? 'bg-[#0a1e3c]' : theme === 'light' ? 'bg-white' : 'bg-[#F9F7F2]';
  const inputBg = isDark ? 'bg-white/5 border-white/20 text-white placeholder-white/40' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400';
  const itemBg = (isSelected: boolean) => isSelected
    ? 'bg-[#bf8339]/20 border-[#bf8339]/40'
    : isDark ? 'hover:bg-white/5 border-transparent' : 'hover:bg-gray-100 border-transparent';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subTextColor = isDark ? 'text-white/50' : 'text-gray-500';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative w-full max-w-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-fade-in ${modalBg}`}
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: '70vh' }}
      >
        {/* Search Input */}
        <div className={`flex items-center gap-3 px-5 py-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <svg className={`w-5 h-5 shrink-0 ${isDark ? 'text-white/50' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isAr ? 'ابحث عن أي أداة...' : 'Search any tool...'}
            className={`flex-1 bg-transparent outline-none text-base ${textColor}`}
            dir={isAr ? 'rtl' : 'ltr'}
          />
          <kbd className={`hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs rounded border ${isDark ? 'border-white/20 text-white/40' : 'border-gray-300 text-gray-400'}`}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(70vh - 72px)' }}>
          {filtered.length === 0 ? (
            <div className={`py-16 text-center ${subTextColor}`}>
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{isAr ? 'لم يتم العثور على نتائج' : 'No results found'}</p>
            </div>
          ) : (
            <div className="p-2">
              {!query && (
                <p className={`text-xs px-3 py-2 font-semibold uppercase tracking-wider ${subTextColor}`}>
                  {isAr ? 'جميع الأدوات' : 'All Tools'}
                </p>
              )}
              {filtered.map((item, idx) => (
                <button
                  key={item.tab}
                  onClick={() => { onNavigate(item.tab); onClose(); }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border transition-all duration-150 mb-1 ${itemBg(idx === selectedIndex)}`}
                  dir={isAr ? 'rtl' : 'ltr'}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-[#bf8339]/20 text-[#bf8339]' : 'bg-amber-100 text-amber-600'}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 text-start">
                    <p className={`font-semibold text-sm ${textColor}`}>
                      {isAr ? item.titleAr : item.titleEn}
                    </p>
                    <p className={`text-xs mt-0.5 ${subTextColor}`}>
                      {isAr ? item.descAr : item.descEn}
                    </p>
                  </div>
                  {idx === selectedIndex && (
                    <kbd className={`hidden sm:inline-flex items-center px-2 py-1 text-xs rounded border ${isDark ? 'border-white/20 text-white/40' : 'border-gray-300 text-gray-400'}`}>
                      ↵
                    </kbd>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className={`px-5 py-2.5 border-t ${isDark ? 'border-white/10 text-white/30' : 'border-gray-200 text-gray-400'} text-xs flex justify-between items-center`}>
          <span>{isAr ? '↑↓ للتنقل · Enter للانتقال · Esc للإغلاق' : '↑↓ navigate · Enter to open · Esc to close'}</span>
          <span>{filtered.length} {isAr ? 'أداة' : 'tools'}</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
