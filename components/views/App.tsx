
import React, { useState, useCallback, useEffect, ErrorInfo, ReactNode } from 'react';
import { Tab, ProjectContextState, AppLanguage, Theme } from './types';
import Sidebar from './components/Sidebar';
import HomeView from './components/views/HomeView';
import CreatePostView from './components/views/CreatePostView';
import WebsiteContentView from './components/views/WebsiteContentView';
import AIImagesView from './components/views/AIImagesView';
import ProfessionalProductView from './components/views/ProfessionalProductView';
import PostlySpacesView from './components/views/PostlySpacesView';
import CreateVideoView from './components/views/CreateVideoView';
import CreateAudioView from './components/views/CreateAudioView'; 
import StyleTrainingView from './components/views/StyleTrainingView';
import ArchiveView from './components/views/ArchiveView';
import BrandKitView from './components/views/BrandKitView';
import IdeaGeneratorView from './components/views/IdeaGeneratorView'; 
import ChatBotView from './components/views/ChatBotView'; 
import InstantSummaryView from './components/views/InstantSummaryView';
import SettingsView from './components/views/SettingsView';
import AboutView from './components/views/AboutView';
import InitialSetupView from './components/views/InitialSetupView';
import GraphicDesignerView from './components/views/GraphicDesignerView';
import InfographicDesignerView from './components/views/InfographicDesignerView';
import AdvancedTemplatesView from './components/views/AdvancedTemplatesView';
import { ProjectContext } from './contexts/ProjectContext';
import { getItem, setItem } from './utils/localStorage';
import { ARCHIVE_STORAGE_KEY } from './constants';
import ProjectChoicePrompt from './components/ProjectChoicePrompt';
import { ChatBubbleIcon, SunIcon, MoonIcon, CoffeeIcon } from './components/Icons';
import ToastContainer, { ToastMessage, ToastType } from './components/Toast';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
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
  
  // Setup State
  const [isSetupComplete, setIsSetupComplete] = useState(() => !!getItem('postly_setup_done'));

  // Persistent Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Stable Toast Function
  const addToast = useCallback((message: string, type: ToastType = 'info') => {
      const id = Date.now().toString();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
  }, []);

  const removeToast = (id: string) => {
      setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Expose toast to window for global access
  useEffect(() => {
      (window as any).toast = addToast;
  }, [addToast]);

  // Safe theme retrieval
  const getInitialTheme = (): Theme => {
      const stored = getItem<string>('appTheme');
      if (stored === 'light' || stored === 'dark' || stored === 'comfort') {
          return stored;
      }
      return 'dark';
  };

  const [projectState, setProjectState] = useState<ProjectContextState>({
    topic: '',
    tone: '',
    language: 'English (EN)',
    dialect: '',
    industry: '',
    styleProfile: '',
    previousGenerations: [],
    appLanguage: getItem<AppLanguage>('appLanguage') || 'ar', 
    theme: getInitialTheme(),
  });

  useEffect(() => {
    // Only show project prompt if setup is complete
    if (isSetupComplete) {
        const savedContext = getItem<ProjectContextState>('projectContext');
        
        // Strict check: Only prompt if meaningful user data exists
        if (savedContext) {
            const hasUserWork = 
                (savedContext.topic && savedContext.topic.trim().length > 0) ||
                (savedContext.industry && savedContext.industry.trim().length > 0) ||
                (savedContext.styleProfile && savedContext.styleProfile.trim().length > 0);
            
            if (hasUserWork) {
                setShowProjectPrompt(true);
            }
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
  
  // Theme Application Logic
  const [appliedTheme, setAppliedTheme] = useState<Theme>('dark');

  useEffect(() => {
      const applyTheme = () => {
          const targetTheme = projectState.theme;
          setAppliedTheme(targetTheme);
          
          document.body.classList.remove('light-mode', 'dark-mode', 'comfort-mode');
          if (targetTheme === 'light') document.body.classList.add('light-mode');
          if (targetTheme === 'comfort') document.body.classList.add('comfort-mode');
      };

      applyTheme();
  }, [projectState.theme]);

  const handleProjectChoice = (choice: 'new' | 'continue') => {
    if (choice === 'new') {
      const newState: ProjectContextState = {
        topic: '', tone: '', language: 'English (EN)', dialect: '', industry: '', styleProfile: '', previousGenerations: [],
        appLanguage: projectState.appLanguage,
        theme: projectState.theme
      };
      setProjectState(newState);
      setItem('projectContext', newState);
      setItem(ARCHIVE_STORAGE_KEY, []);
      setItem('styleProfile', '');
    } else {
      const savedContext = getItem<ProjectContextState>('projectContext');
      if (savedContext) setProjectState(prev => ({ 
          ...savedContext, 
          appLanguage: prev.appLanguage,
          theme: prev.theme
      }));
    }
    setShowProjectPrompt(false);
  };

  const handleSetupComplete = () => {
      setItem('postly_setup_done', 'true');
      setIsSetupComplete(true);
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
      default: return <HomeView setActiveTab={setActiveTab} />;
    }
  };

  const toggleLanguage = () => {
      updateProjectState({ appLanguage: projectState.appLanguage === 'ar' ? 'en' : 'ar' });
  };

  const cycleTheme = () => {
      const themes: Theme[] = ['light', 'dark', 'comfort'];
      const currentIndex = themes.indexOf(projectState.theme);
      const validIndex = currentIndex === -1 ? 0 : currentIndex;
      const nextTheme = themes[(validIndex + 1) % themes.length];
      updateProjectState({ theme: nextTheme });
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
  if (appliedTheme === 'light') baseClasses = 'bg-[#f3f4f6] text-[#111827]';
  if (appliedTheme === 'comfort') baseClasses = 'bg-[#F3F0E6] text-[#433e38]';

  return (
    <ErrorBoundary>
        <ProjectContext.Provider value={{ ...projectState, updateProjectState }}>
            <div className={`flex h-[100dvh] font-[Tajawal] transition-colors duration-500 ${baseClasses}`} dir={dir}>
              
              {(appliedTheme === 'dark') && (
                 <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
              )}
              
              {!isSetupComplete ? (
                  <InitialSetupView onComplete={handleSetupComplete} />
              ) : (
                  <>
                      <ToastContainer toasts={toasts} removeToast={removeToast} />
                      {showProjectPrompt && <ProjectChoicePrompt onChoice={handleProjectChoice} />}
                      
                      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
                      
                      <main className={`flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto transition-all duration-300 ${mainMargin}`}>
                        <div className="flex justify-between items-center mb-6 md:hidden">
                            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md text-[#bf8339] bg-white/10">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                            <h1 className="text-xl font-bold text-[#bf8339]">Postly-AI</h1>
                        </div>

                        <div className="flex justify-end mb-4 gap-2">
                            <button 
                                onClick={cycleTheme} 
                                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 p-2 rounded-full transition border border-white/5"
                                title={isAr ? 'تغيير المظهر' : 'Switch Theme'}
                            >
                                {getThemeIcon()}
                            </button>

                            <button onClick={toggleLanguage} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-sm transition border border-white/5">
                                <span>{isAr ? 'EN English' : 'AR العربية'}</span>
                            </button>
                        </div>

                        {renderContent()}
                      </main>
                      
                      <div className={`fixed bottom-20 z-50 w-[calc(100vw-2rem)] md:w-96 h-[550px] max-h-[70dvh] bg-[#0a1e3c] border border-white/20 rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform ${isChatOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'} ${widgetPositionClass}`}>
                            <div className="bg-[#bf8339] p-3 flex justify-between items-center text-[#0a1e3c] shrink-0">
                                <h3 className="font-bold flex items-center gap-2 text-sm">
                                    <ChatBubbleIcon className="w-5 h-5" /> 
                                    {isAr ? 'المساعد الذكي' : 'AI Assistant'}
                                </h3>
                                <button onClick={() => setIsChatOpen(false)} className="hover:bg-black/10 rounded-full p-1 transition">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1 overflow-hidden p-2 bg-[#0a1e3c]/90 backdrop-blur">
                                 <ChatBotView compact={true} />
                            </div>
                      </div>

                      <button 
                         onClick={() => setIsChatOpen(!isChatOpen)}
                         className={`fixed bottom-6 z-50 w-14 h-14 bg-[#bf8339] text-[#0a1e3c] rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-200 border-2 border-white/20 ${widgetPositionClass}`}
                         title={isAr ? 'المساعد الذكي' : 'AI Assistant'}
                      >
                          {isChatOpen ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                          ) : (
                              <ChatBubbleIcon className="w-8 h-8" />
                          )}
                      </button>

                      <footer className={`fixed bottom-0 left-0 right-0 ${appliedTheme === 'light' ? 'bg-white/90 text-gray-500 border-gray-200' : 'bg-[#0a1e3c]/95 text-white/50 border-[#bf8339]/20'} backdrop-blur border-t p-2 text-center text-xs z-40 ${mainMargin}`}>
                        <div className="flex flex-col gap-1">
                          <span>{isAr ? 'تم تطوير هذا البرنامج بواسطة: أحمد الديري' : 'Developed by Ahmed El-Dary'}</span>
                          <span>{isAr ? 'للتواصل والاقتراحات: 0096597292897 | aeldary@gmail.com' : 'Contact & Suggestions: 0096597292897 | aeldary@gmail.com'}</span>
                        </div>
                      </footer>
                  </>
              )}
            </div>
        </ProjectContext.Provider>
    </ErrorBoundary>
  );
};

export default App;
