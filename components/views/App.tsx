import React, { useState, useCallback, useEffect, ErrorInfo, ReactNode } from 'react';
import { Tab, ProjectContextState, AppLanguage, Theme } from '../../types';
import Sidebar from '../Sidebar';
import HomeView from './HomeView';
import CreatePostView from './CreatePostView';
import WebsiteContentView from './WebsiteContentView';
import AIImagesView from './AIImagesView';
import ProfessionalProductView from './ProfessionalProductView';
import PostlySpacesView from './PostlySpacesView';
import CreateVideoView from './CreateVideoView';
import CreateAudioView from './CreateAudioView';
import StyleTrainingView from './StyleTrainingView';
import ArchiveView from './ArchiveView';
import BrandKitView from './BrandKitView';
import IdeaGeneratorView from './IdeaGeneratorView';
import ChatBotView from './ChatBotView';
import InstantSummaryView from './InstantSummaryView';
import SettingsView from './SettingsView';
import AboutView from './AboutView';
import InitialSetupView from './InitialSetupView';
import GraphicDesignerView from './GraphicDesignerView';
import InfographicDesignerView from './InfographicDesignerView';
import AdvancedTemplatesView from './AdvancedTemplatesView';
import ContentCalendarView from './ContentCalendarView';
import { ProjectContext } from '../../contexts/ProjectContext';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import AuthBar from '../AuthBar';
import { getItem, setItem } from '../../utils/localStorage';
import { ARCHIVE_STORAGE_KEY } from '../../constants';
import ProjectChoicePrompt from '../ProjectChoicePrompt';
import GlobalSearch from '../GlobalSearch';
import {
  ChatBubbleIcon, SunIcon, MoonIcon, CoffeeIcon,
  HomeIcon, CreatePostIcon, ImageIcon, LightBulbIcon, ArchiveIcon
} from '../Icons';
import ToastContainer, { ToastMessage, ToastType } from '../Toast';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#0a1e3c] text-white p-6 text-center">
          <h1 className="text-3xl font-bold text-[#bf8339] mb-4">Something went wrong.</h1>
          <p className="mb-4 text-white/70">An unexpected error occurred.</p>
          <pre className="bg-black/30 p-4 rounded text-xs text-left mb-6 overflow-auto max-w-lg">
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#bf8339] text-[#0a1e3c] rounded font-bold hover:bg-white transition"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Home);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showProjectPrompt, setShowProjectPrompt] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(() => !!getItem('postly_setup_done'));
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  useEffect(() => { (window as any).toast = addToast; }, [addToast]);

  const getInitialTheme = (): Theme => {
    const stored = getItem<string>('appTheme');
    if (stored === 'light' || stored === 'dark' || stored === 'comfort') return stored;
    return 'dark';
  };

  const [projectState, setProjectState] = useState<ProjectContextState>({
    topic: '', tone: '', language: 'English (EN)', dialect: '', industry: '',
    styleProfile: '', previousGenerations: [],
    appLanguage: getItem<AppLanguage>('appLanguage') || 'ar',
    theme: getInitialTheme(),
  });

  useEffect(() => {
    if (isSetupComplete) {
      const savedContext = getItem<ProjectContextState>('projectContext');
      if (savedContext) {
        const hasUserWork =
          (savedContext.topic && savedContext.topic.trim().length > 0) ||
          (savedContext.industry && savedContext.industry.trim().length > 0) ||
          (savedContext.styleProfile && savedContext.styleProfile.trim().length > 0);
        if (hasUserWork) setShowProjectPrompt(true);
      }
    }
  }, [isSetupComplete]);

  const updateProjectState = useCallback((updates: Partial<ProjectContextState>) => {
    setProjectState(prevState => {
      const newState = { ...prevState, ...updates };
      setItem('projectContext', newState);
      if (updates.appLanguage) setItem('appLanguage', updates.appLanguage);
      if (updates.theme) setItem('appTheme', updates.theme);
      return newState;
    });
  }, []);

  const [appliedTheme, setAppliedTheme] = useState<Theme>('dark');

  useEffect(() => {
    setAppliedTheme(projectState.theme);
    document.body.classList.remove('light-mode', 'dark-mode', 'comfort-mode');
    if (projectState.theme === 'light') document.body.classList.add('light-mode');
    if (projectState.theme === 'comfort') document.body.classList.add('comfort-mode');
  }, [projectState.theme]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K / Cmd+K → open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
        return;
      }
      // Escape → close search or chat
      if (e.key === 'Escape') {
        if (isSearchOpen) { setIsSearchOpen(false); return; }
        if (isChatOpen) { setIsChatOpen(false); return; }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, isChatOpen]);

  const handleProjectChoice = (choice: 'new' | 'continue') => {
    if (choice === 'new') {
      const newState: ProjectContextState = {
        topic: '', tone: '', language: 'English (EN)', dialect: '', industry: '',
        styleProfile: '', previousGenerations: [],
        appLanguage: projectState.appLanguage, theme: projectState.theme,
      };
      setProjectState(newState);
      setItem('projectContext', newState);
      setItem(ARCHIVE_STORAGE_KEY, []);
      setItem('styleProfile', '');
    } else {
      const savedContext = getItem<ProjectContextState>('projectContext');
      if (savedContext) setProjectState(prev => ({ ...savedContext, appLanguage: prev.appLanguage, theme: prev.theme }));
    }
    setShowProjectPrompt(false);
  };

  const handleSetupComplete = () => {
    setItem('postly_setup_done', 'true');
    setIsSetupComplete(true);
  };

  const handleNavigate = (tab: Tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.Home: return <HomeView setActiveTab={setActiveTab} />;
      case Tab.IdeaGenerator: return <IdeaGeneratorView />;
      case Tab.InstantSummary: return <InstantSummaryView />;
      case Tab.CreatePost: return <CreatePostView />;
      case Tab.WebsiteContent: return <WebsiteContentView />;
      case Tab.AIImages: return <AIImagesView />;
      case Tab.ProfessionalProduct: return <ProfessionalProductView />;
      case Tab.PostlySpaces: return <PostlySpacesView />;
      case Tab.CreateVideo: return <CreateVideoView />;
      case Tab.CreateAudio: return <CreateAudioView />;
      case Tab.BrandKit: return <BrandKitView />;
      case Tab.StyleTraining: return <StyleTrainingView />;
      case Tab.Archive: return <ArchiveView setActiveTab={setActiveTab} />;
      case Tab.Settings: return <SettingsView />;
      case Tab.About: return <AboutView setActiveTab={setActiveTab} />;
      case Tab.GraphicDesigner: return <GraphicDesignerView />;
      case Tab.InfographicDesigner: return <InfographicDesignerView />;
      case Tab.Templates: return <AdvancedTemplatesView setActiveTab={setActiveTab} />;
      case Tab.ContentCalendar: return <ContentCalendarView />;
      default: return <HomeView setActiveTab={setActiveTab} />;
    }
  };

  const toggleLanguage = () =>
    updateProjectState({ appLanguage: projectState.appLanguage === 'ar' ? 'en' : 'ar' });

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'comfort'];
    const idx = themes.indexOf(projectState.theme);
    updateProjectState({ theme: themes[(idx === -1 ? 0 : idx + 1) % themes.length] });
  };

  const getThemeIcon = () => {
    switch (projectState.theme) {
      case 'light': return <SunIcon className="w-5 h-5 text-yellow-500" />;
      case 'dark': return <MoonIcon className="w-5 h-5 text-white" />;
      case 'comfort': return <CoffeeIcon className="w-5 h-5 text-[#bf8339]" />;
      default: return <MoonIcon className="w-5 h-5 text-white" />;
    }
  };

  const isAr = projectState.appLanguage === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const mainMargin = isAr ? 'md:mr-64' : 'md:ml-64';
  const widgetPositionClass = isAr ? 'left-4' : 'right-4';

  let baseClasses = 'bg-[#0a1e3c] text-white';
  if (appliedTheme === 'light') baseClasses = 'bg-[#f3f6f8] text-[#111827]';
  if (appliedTheme === 'comfort') baseClasses = 'bg-[#F0EAD6] text-[#433e38]';

  // Mobile bottom nav items
  const mobileNavItems = [
    { tab: Tab.Home, icon: HomeIcon, labelAr: 'الرئيسية', labelEn: 'Home' },
    { tab: Tab.CreatePost, icon: CreatePostIcon, labelAr: 'محتوى', labelEn: 'Content' },
    { tab: Tab.AIImages, icon: ImageIcon, labelAr: 'صور', labelEn: 'Images' },
    { tab: Tab.IdeaGenerator, icon: LightBulbIcon, labelAr: 'أفكار', labelEn: 'Ideas' },
    { tab: Tab.Archive, icon: ArchiveIcon, labelAr: 'الأرشيف', labelEn: 'Archive' },
  ];

  return (
    <ErrorBoundary>
      <AuthProvider>
      <ProjectContext.Provider value={{ ...projectState, updateProjectState }}>
        <div className={`flex h-[100dvh] font-[Tajawal] transition-colors duration-500 ${baseClasses}`} dir={dir}>

          {/* Dark mode texture */}
          {appliedTheme === 'dark' && (
            <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-overlay" />
          )}

          {!isSetupComplete ? (
            <InitialSetupView onComplete={handleSetupComplete} />
          ) : (
            <>
              <ToastContainer toasts={toasts} removeToast={removeToast} />
              {showProjectPrompt && <ProjectChoicePrompt onChoice={handleProjectChoice} />}

              {/* Global Search Modal */}
              <GlobalSearch
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onNavigate={handleNavigate}
              />

              <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={isSidebarOpen}
                setOpen={setSidebarOpen}
              />

              <main className={`flex-1 overflow-y-auto transition-all duration-300 ${mainMargin}`}>
                {/* Top Bar */}
                <div className={`sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3 border-b backdrop-blur-xl transition-colors duration-300 ${
                  appliedTheme === 'light'
                    ? 'bg-white/90 border-gray-200'
                    : appliedTheme === 'comfort'
                    ? 'bg-[#F0EAD6]/90 border-[#D7CCC8]'
                    : 'bg-[#0a1e3c]/90 border-white/5'
                }`}>
                  {/* Mobile: Hamburger + Logo */}
                  <div className="flex items-center gap-3 md:hidden">
                    <button
                      onClick={() => setSidebarOpen(!isSidebarOpen)}
                      className={`p-2 rounded-xl transition ${appliedTheme === 'dark' ? 'text-[#bf8339] bg-white/5 hover:bg-white/10' : 'text-[#bf8339] bg-black/5 hover:bg-black/10'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                    <span className="font-black text-[#bf8339] text-lg">Postly-AI</span>
                  </div>

                  {/* Search Bar (desktop) */}
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className={`hidden md:flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-all hover:scale-[1.01] active:scale-[0.99] ${
                      appliedTheme === 'dark'
                        ? 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/8'
                        : appliedTheme === 'light'
                        ? 'bg-gray-100 border border-gray-200 text-gray-400 hover:bg-gray-200'
                        : 'bg-[#EFEBE0] border border-[#D7CCC8] text-[#A1887F]'
                    }`}
                    style={{ minWidth: 220 }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>{isAr ? 'ابحث عن أداة...' : 'Search a tool...'}</span>
                    <kbd className={`ms-auto text-[10px] px-1.5 py-0.5 rounded border ${
                      appliedTheme === 'dark' ? 'border-white/20 text-white/30' : 'border-gray-300 text-gray-400'
                    }`}>⌘K</kbd>
                  </button>

                  {/* Right Controls */}
                  <div className="flex items-center gap-2">
                    <AuthBar />
                    {/* Mobile Search */}
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className={`md:hidden p-2 rounded-xl transition ${appliedTheme === 'dark' ? 'text-white/60 bg-white/5 hover:bg-white/10' : 'text-gray-500 bg-black/5 hover:bg-black/10'}`}
                      title={isAr ? 'بحث' : 'Search'}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>

                    {/* Theme Toggle */}
                    <button
                      onClick={cycleTheme}
                      className={`flex items-center gap-2 p-2 rounded-xl transition border ${
                        appliedTheme === 'dark'
                          ? 'bg-white/5 hover:bg-white/10 border-white/5'
                          : 'bg-black/5 hover:bg-black/8 border-black/5'
                      }`}
                      title={isAr ? 'تغيير المظهر' : 'Switch Theme'}
                    >
                      {getThemeIcon()}
                    </button>

                    {/* Language Toggle */}
                    <button
                      onClick={toggleLanguage}
                      className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition border ${
                        appliedTheme === 'dark'
                          ? 'bg-white/5 hover:bg-white/10 border-white/5 text-white/70'
                          : 'bg-black/5 hover:bg-black/8 border-black/5 text-gray-600'
                      }`}
                    >
                      {isAr ? '🇺🇸 EN' : '🇸🇦 AR'}
                    </button>
                  </div>
                </div>

                {/* Main Content */}
                <div className="p-4 sm:p-6 pb-24 md:pb-10">
                  {renderContent()}
                </div>
              </main>

              {/* ── Floating AI Chat ── */}
              <div
                className={`fixed bottom-20 md:bottom-6 z-50 w-[calc(100vw-2rem)] md:w-96 h-[550px] max-h-[70dvh] border rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform ${
                  isChatOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
                } ${widgetPositionClass} ${
                  appliedTheme === 'light'
                    ? 'bg-white border-gray-200'
                    : appliedTheme === 'comfort'
                    ? 'bg-[#F9F7F2] border-[#D7CCC8]'
                    : 'bg-[#0a1e3c] border-white/20'
                }`}
              >
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-[#bf8339] to-[#a66e2c] p-3 flex justify-between items-center text-white shrink-0">
                  <h3 className="font-bold flex items-center gap-2 text-sm">
                    <ChatBubbleIcon className="w-5 h-5" />
                    {isAr ? 'المساعد الذكي' : 'AI Assistant'}
                    <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                  </h3>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="hover:bg-black/20 rounded-full p-1 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 overflow-hidden p-2 backdrop-blur">
                  <ChatBotView compact={true} />
                </div>
              </div>

              {/* Chat Toggle Button */}
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`fixed bottom-[4.5rem] md:bottom-6 z-50 w-14 h-14 bg-gradient-to-br from-[#bf8339] to-[#a66e2c] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-200 border-2 border-white/20 ${widgetPositionClass}`}
                title={isAr ? 'المساعد الذكي' : 'AI Assistant'}
              >
                {isChatOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                ) : (
                  <ChatBubbleIcon className="w-7 h-7" />
                )}
              </button>

              {/* ── Mobile Bottom Navigation ── */}
              <nav
                className={`fixed bottom-0 left-0 right-0 z-40 md:hidden border-t flex items-center justify-around px-2 py-2 ${
                  appliedTheme === 'light'
                    ? 'bg-white/95 border-gray-200'
                    : appliedTheme === 'comfort'
                    ? 'bg-[#F9F7F2]/95 border-[#D7CCC8]'
                    : 'bg-[#0a1e3c]/95 border-white/10'
                } backdrop-blur-xl`}
              >
                {mobileNavItems.map(item => {
                  const isActive = activeTab === item.tab;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => setActiveTab(item.tab)}
                      className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'text-[#bf8339] scale-110'
                          : appliedTheme === 'dark'
                          ? 'text-white/40 hover:text-white/70'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <item.icon className={`w-6 h-6 ${isActive ? 'drop-shadow-sm' : ''}`} />
                      <span className={`text-[9px] font-semibold ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                        {isAr ? item.labelAr : item.labelEn}
                      </span>
                      {isActive && <span className="w-1 h-1 rounded-full bg-[#bf8339]" />}
                    </button>
                  );
                })}
                {/* More / Sidebar Toggle */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                    appliedTheme === 'dark' ? 'text-white/40 hover:text-white/70' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="text-[9px] font-semibold opacity-60">{isAr ? 'المزيد' : 'More'}</span>
                </button>
              </nav>

              {/* Desktop Footer */}
              <footer className={`hidden md:block fixed bottom-0 left-0 right-0 ${
                appliedTheme === 'light'
                  ? 'bg-white/90 text-gray-500 border-gray-200'
                  : appliedTheme === 'comfort'
                  ? 'bg-[#F0EAD6]/90 text-[#795548] border-[#D7CCC8]'
                  : 'bg-[#0a1e3c]/95 text-white/40 border-[#bf8339]/15'
              } backdrop-blur border-t p-2 text-center text-xs z-30 ${mainMargin}`}>
                <span>{isAr ? 'تطوير: أحمد الديري · 0096597292897 · aeldary@gmail.com' : 'Developed by Ahmed El-Dary · 0096597292897 · aeldary@gmail.com'}</span>
              </footer>
            </>
          )}
        </div>
      </ProjectContext.Provider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
