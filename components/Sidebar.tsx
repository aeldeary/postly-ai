
import React, { useContext } from 'react';
import { Tab } from '../types';
import { ProjectContext } from '../contexts/ProjectContext';
import { UI_TRANSLATIONS } from '../constants';
import { HomeIcon, CreatePostIcon, WebsiteIcon, ImageIcon, StyleIcon, ArchiveIcon, InfoIcon, MagicWandIcon, LightBulbIcon, VideoCameraIcon, SpeakerWaveIcon, DocumentTextIcon, CogIcon, PaintBrushIcon, ChartBarIcon, TemplateIcon, ShoppingBagIcon, PostlyLogo } from './Icons';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setOpen }) => {
  const { appLanguage } = useContext(ProjectContext);
  const t = UI_TRANSLATIONS;

  const navItems = [
    { tab: Tab.Home, icon: HomeIcon, label: t.dashboard }, // الرئيسية
    { tab: Tab.IdeaGenerator, icon: LightBulbIcon, label: t.ideaGenerator }, // مولد الأفكار
    { tab: Tab.InstantSummary, icon: DocumentTextIcon, label: t.instantSummary }, // الملخص الفوري
    { tab: Tab.CreatePost, icon: CreatePostIcon, label: t.contentStudio }, // استوديو المحتوى
    { tab: Tab.WebsiteContent, icon: WebsiteIcon, label: t.websiteContent }, // محتوى الموقع
    { tab: Tab.AIImages, icon: ImageIcon, label: t.imageStudio }, // استوديو الصور
    { tab: Tab.ProfessionalProduct, icon: ShoppingBagIcon, label: t.professionalProduct }, // منتج احترافي
    { tab: Tab.BrandKit, icon: MagicWandIcon, label: t.brandIdentity }, // هوية البراند
    { tab: Tab.GraphicDesigner, icon: PaintBrushIcon, label: t.graphicDesigner }, // مصمم الجرافيك
    { tab: Tab.Templates, icon: TemplateIcon, label: t.templates }, // القوالب
    { tab: Tab.InfographicDesigner, icon: ChartBarIcon, label: t.infographicDesigner }, // صانع الانفوجرافيك
    { tab: Tab.CreateVideo, icon: VideoCameraIcon, label: t.createVideo }, // إنشاء فيديو
    { tab: Tab.CreateAudio, icon: SpeakerWaveIcon, label: t.createAudio }, // إنشاء صوت
    { tab: Tab.StyleTraining, icon: StyleIcon, label: t.styleTrainer }, // مدرب الأسلوب
    { tab: Tab.Archive, icon: ArchiveIcon, label: t.archive }, // الأرشيف
    { tab: Tab.Settings, icon: CogIcon, label: t.settings }, // الإعدادات
    { tab: Tab.About, icon: InfoIcon, label: t.about }, // عن التطبيق
  ];

  const sidebarPositionClass = appLanguage === 'ar' ? 'right-0 border-l' : 'left-0 border-r';
  const translateClass = appLanguage === 'ar' 
      ? (isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0") 
      : (isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0");

  return (
    <>
    <aside className={`fixed top-0 ${sidebarPositionClass} z-40 w-64 h-[100dvh] max-h-[100dvh] flex flex-col bg-[#0a1e3c]/60 backdrop-blur-xl border-white/10 transition-transform duration-300 ${translateClass}`}>
        <div className="flex flex-col items-center mt-8 mb-6 shrink-0 px-4 text-center">
            <PostlyLogo className="w-12 h-12 mb-3 drop-shadow-lg" />
            <h1 className="text-xl font-bold text-white tracking-wide">Postly-AI</h1>
            <div className="h-0.5 w-12 bg-[#bf8339] rounded-full mt-2 opacity-50"></div>
        </div>

        <div className="flex-1 px-3 overflow-y-auto custom-scrollbar pb-40">
            <nav className="space-y-1">
                {navItems.map((item) => (
                    <button
                      key={item.tab}
                      onClick={() => { setActiveTab(item.tab); setOpen(false); }}
                      className={`flex items-center w-full p-3 my-1.5 rounded-lg transition-all duration-200 group ${
                        activeTab === item.tab
                          ? 'bg-[#bf8339] text-[#0a1e3c] shadow-lg shadow-[#bf8339]/20 hover:text-white'
                          : 'text-white hover:bg-white/5'
                      }`}
                    >
                      <item.icon className={`w-6 h-6 shrink-0 transition-colors ${activeTab === item.tab ? "text-[#0a1e3c] group-hover:text-white" : "text-[#bf8339] group-hover:text-white"}`} />
                      <span className={`mx-4 font-medium text-sm md:text-base ${appLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                          {typeof item.label === 'string' ? item.label : item.label[appLanguage]}
                      </span>
                    </button>
                ))}
            </nav>
        </div>
    </aside>
    {isOpen && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"></div>}
    </>
  );
};

export default Sidebar;
