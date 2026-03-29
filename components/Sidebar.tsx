
import React, { useContext, useState } from 'react';
import { Tab } from '../types';
import { ProjectContext } from '../contexts/ProjectContext';
import { UI_TRANSLATIONS } from '../constants';
import {
  HomeIcon, CreatePostIcon, WebsiteIcon, ImageIcon, StyleIcon, ArchiveIcon,
  InfoIcon, MagicWandIcon, LightBulbIcon, VideoCameraIcon, SpeakerWaveIcon,
  DocumentTextIcon, CogIcon, PaintBrushIcon, ChartBarIcon, TemplateIcon,
  ShoppingBagIcon, PostlyLogo, CalendarIcon
} from './Icons';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

interface NavItem {
  tab: Tab;
  icon: React.FC<{ className?: string }>;
  label: { ar: string; en: string };
  badge?: { ar: string; en: string };
}

interface NavGroup {
  labelAr: string;
  labelEn: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    labelAr: 'عام',
    labelEn: 'General',
    items: [
      { tab: Tab.Home, icon: HomeIcon, label: UI_TRANSLATIONS.dashboard },
      { tab: Tab.IdeaGenerator, icon: LightBulbIcon, label: UI_TRANSLATIONS.ideaGenerator },
      { tab: Tab.InstantSummary, icon: DocumentTextIcon, label: UI_TRANSLATIONS.instantSummary },
    ]
  },
  {
    labelAr: 'إنشاء المحتوى',
    labelEn: 'Content Creation',
    items: [
      { tab: Tab.CreatePost, icon: CreatePostIcon, label: UI_TRANSLATIONS.contentStudio },
      { tab: Tab.WebsiteContent, icon: WebsiteIcon, label: UI_TRANSLATIONS.websiteContent },
      { tab: Tab.Templates, icon: TemplateIcon, label: UI_TRANSLATIONS.templates, badge: { ar: 'جديد', en: 'New' } },
    ]
  },
  {
    labelAr: 'الصور والتصاميم',
    labelEn: 'Images & Design',
    items: [
      { tab: Tab.AIImages, icon: ImageIcon, label: UI_TRANSLATIONS.imageStudio },
      { tab: Tab.ProfessionalProduct, icon: ShoppingBagIcon, label: UI_TRANSLATIONS.professionalProduct },
      { tab: Tab.GraphicDesigner, icon: PaintBrushIcon, label: UI_TRANSLATIONS.graphicDesigner },
      { tab: Tab.InfographicDesigner, icon: ChartBarIcon, label: UI_TRANSLATIONS.infographicDesigner },
    ]
  },
  {
    labelAr: 'الفيديو والصوت',
    labelEn: 'Video & Audio',
    items: [
      { tab: Tab.CreateVideo, icon: VideoCameraIcon, label: UI_TRANSLATIONS.createVideo },
      { tab: Tab.CreateAudio, icon: SpeakerWaveIcon, label: UI_TRANSLATIONS.createAudio },
    ]
  },
  {
    labelAr: 'البراند والأسلوب',
    labelEn: 'Brand & Style',
    items: [
      { tab: Tab.BrandKit, icon: MagicWandIcon, label: UI_TRANSLATIONS.brandIdentity },
      { tab: Tab.StyleTraining, icon: StyleIcon, label: UI_TRANSLATIONS.styleTrainer },
    ]
  },
  {
    labelAr: 'الإدارة والتخطيط',
    labelEn: 'Management',
    items: [
      { tab: Tab.ContentCalendar, icon: CalendarIcon, label: UI_TRANSLATIONS.contentCalendar, badge: { ar: 'جديد', en: 'New' } },
      { tab: Tab.Archive, icon: ArchiveIcon, label: UI_TRANSLATIONS.archive },
      { tab: Tab.Settings, icon: CogIcon, label: UI_TRANSLATIONS.settings },
      { tab: Tab.About, icon: InfoIcon, label: UI_TRANSLATIONS.about },
    ]
  },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setOpen }) => {
  const { appLanguage, theme } = useContext(ProjectContext);
  const isAr = appLanguage === 'ar';
  const isLight = theme === 'light';
  const isDark = theme === 'dark';

  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    setCollapsedGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const sidebarPositionClass = isAr ? 'right-0 border-l' : 'left-0 border-r';
  const translateClass = isAr
    ? (isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0')
    : (isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0');

  const sidebarBg = isDark
    ? 'bg-[#060f1e]/95 border-white/8'
    : isLight
    ? 'bg-white border-gray-200 shadow-lg'
    : 'bg-[#F9F7F2] border-[#D7CCC8]';

  const activeItemBg = isDark
    ? 'bg-gradient-to-r from-[#bf8339] to-[#a66e2c] text-white shadow-lg shadow-[#bf8339]/30'
    : 'bg-[#bf8339] text-white shadow-md';

  const inactiveItemBg = isDark
    ? 'text-white/70 hover:bg-white/5 hover:text-white'
    : isLight
    ? 'text-gray-600 hover:bg-gray-100 hover:text-[#0a1e3c]'
    : 'text-[#5D4037] hover:bg-[#EFEBE0] hover:text-[#3E2723]';

  const groupLabelColor = isDark ? 'text-white/30' : isLight ? 'text-gray-400' : 'text-[#A1887F]';
  const groupDivider = isDark ? 'border-white/5' : isLight ? 'border-gray-100' : 'border-[#E0D4C5]';

  return (
    <>
      <aside
        className={`fixed top-0 ${sidebarPositionClass} z-40 w-64 h-[100dvh] max-h-[100dvh] flex flex-col backdrop-blur-xl border-r transition-transform duration-300 ${translateClass} ${sidebarBg}`}
        style={{ backdropFilter: 'blur(24px)' }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mt-7 mb-5 shrink-0 px-4 text-center">
          <PostlyLogo className="w-11 h-11 mb-2.5 drop-shadow-lg" />
          <h1 className={`text-lg font-black tracking-wide ${isDark ? 'text-white' : isLight ? 'text-[#0a1e3c]' : 'text-[#3E2723]'}`}>
            Postly-<span className="text-[#bf8339]">AI</span>
          </h1>
          <div className="h-0.5 w-10 bg-[#bf8339] rounded-full mt-1.5 opacity-60" />
        </div>

        {/* Nav Groups */}
        <div className="flex-1 px-3 overflow-y-auto custom-scrollbar pb-16">
          {NAV_GROUPS.map((group, gi) => {
            const groupKey = group.labelEn;
            const isCollapsed = collapsedGroups[groupKey];
            const hasActive = group.items.some(i => i.tab === activeTab);

            return (
              <div key={gi} className={`mb-1 ${gi > 0 ? `border-t pt-2 ${groupDivider}` : ''}`}>
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(groupKey)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 mb-1 rounded-md transition-colors group ${hasActive && isCollapsed ? 'text-[#bf8339]' : groupLabelColor} hover:opacity-80`}
                  dir={isAr ? 'rtl' : 'ltr'}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {isAr ? group.labelAr : group.labelEn}
                  </span>
                  <svg
                    className={`w-3 h-3 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Group Items */}
                {!isCollapsed && (
                  <div className="space-y-0.5">
                    {group.items.map(item => {
                      const isActive = activeTab === item.tab;
                      return (
                        <button
                          key={item.tab}
                          onClick={() => { setActiveTab(item.tab); setOpen(false); }}
                          className={`relative flex items-center w-full px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive ? activeItemBg : inactiveItemBg}`}
                          dir={isAr ? 'rtl' : 'ltr'}
                        >
                          <item.icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-white' : isDark ? 'text-[#bf8339]' : 'text-amber-500'}`} />
                          <span className={`mx-3 font-medium text-sm flex-1 ${isAr ? 'text-right' : 'text-left'}`}>
                            {typeof item.label === 'string' ? item.label : item.label[isAr ? 'ar' : 'en']}
                          </span>
                          {item.badge && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/30 text-white' : 'bg-[#bf8339] text-white'}`}>
                              {isAr ? item.badge.ar : item.badge.en}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom User Info */}
        <div className={`shrink-0 px-4 py-3 border-t ${groupDivider} ${isDark ? 'bg-black/20' : isLight ? 'bg-gray-50' : 'bg-[#EFEBE0]'}`}>
          <p className={`text-[10px] text-center ${groupLabelColor}`}>
            {isAr ? 'تطوير: أحمد الديري' : 'By Ahmed El-Dary'}
          </p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
