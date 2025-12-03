
import React, { useContext } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import { Theme, AppLanguage } from '../../types';
import Button from '../Button';
import { SparklesIcon, SunIcon, MoonIcon, CoffeeIcon } from '../Icons';

interface InitialSetupViewProps {
  onComplete: () => void;
}

const InitialSetupView: React.FC<InitialSetupViewProps> = ({ onComplete }) => {
  const { appLanguage, theme, updateProjectState } = useContext(ProjectContext);
  const isAr = appLanguage === 'ar';
  const isLight = theme === 'light';

  const handleLanguageChange = (lang: AppLanguage) => {
    updateProjectState({ appLanguage: lang });
  };

  const handleThemeChange = (newTheme: Theme) => {
    updateProjectState({ theme: newTheme });
  };

  const themes = [
    { id: 'light', labelAr: 'فاتح', labelEn: 'Light', icon: <SunIcon className={`w-6 h-6 ${isLight ? 'text-orange-500' : 'text-[#0a1e3c]'}`} /> },
    { id: 'dark', labelAr: 'داكن', labelEn: 'Dark', icon: <MoonIcon className={`w-6 h-6 ${isLight ? 'text-gray-600' : 'text-white'}`} /> },
    { id: 'comfort', labelAr: 'مريح', labelEn: 'Comfort', icon: <CoffeeIcon className={`w-6 h-6 ${isLight ? 'text-gray-600' : 'text-[#8895A7]'}`} /> }
  ];

  // Dynamic overlay style
  const overlayStyle = isLight
      ? 'bg-white text-gray-800 border-gray-200' 
      : theme === 'comfort'
      ? 'bg-[#F3F0E6] text-[#4A3B32] border-[#E0DCD0] shadow-xl' // Warm beige card
      : 'bg-[#0a1e3c]/90 text-white border-white/20';

  const cardBgClass = isLight 
      ? 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-orange-200' 
      : theme === 'comfort'
      ? 'bg-[#EBE8E0] border-[#D6D2C4] hover:bg-[#F9F8F4] hover:border-[#bf8339]'
      : 'bg-black/20 border-white/10 hover:bg-white/5 hover:border-white/30';
      
  const activeCardBgClass = isLight 
      ? 'bg-white border-[#bf8339] text-[#0a1e3c] shadow-xl ring-1 ring-[#bf8339]' 
      : theme === 'comfort'
      ? 'bg-[#ffffff] border-[#bf8339] text-[#A67C00] shadow-xl ring-1 ring-[#bf8339]'
      : 'bg-[#bf8339] border-[#bf8339] text-[#0a1e3c] shadow-xl';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className={`absolute inset-0 backdrop-blur-sm transition-colors duration-500 ${isLight ? 'bg-black/5' : 'bg-black/40'}`}></div>

      <div className={`relative z-10 w-full max-w-2xl backdrop-blur-xl border rounded-3xl shadow-2xl p-8 md:p-12 animate-fade-in transition-all duration-500 ${overlayStyle}`}>
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#bf8339] to-[#d69545] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#bf8339]/20 rotate-3">
             <SparklesIcon className="w-10 h-10 text-[#0a1e3c]" />
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isLight ? 'text-[#0a1e3c]' : theme === 'comfort' ? 'text-[#2B2622]' : 'text-white'}`}>Postly-AI</h1>
          <p className={`text-xl font-light ${isLight ? 'text-gray-500' : theme === 'comfort' ? 'text-[#5C554E]' : 'opacity-70'}`}>
            {isAr ? 'مرحباً بك! لنقم بإعداد مساحة عملك.' : 'Welcome! Let\'s set up your workspace.'}
          </p>
        </div>

        {/* Step 1: Language */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-[#bf8339] mb-4 uppercase tracking-wider text-center">
            {isAr ? '1. اختر اللغة / Select Language' : '1. Select Language'}
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleLanguageChange('ar')}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 group ${
                appLanguage === 'ar'
                  ? activeCardBgClass
                  : `${cardBgClass} opacity-70 hover:opacity-100`
              }`}
            >
              <span className="text-xl font-bold bg-black/10 dark:bg-white/10 px-3 py-1 rounded">AR</span>
              <span className="font-bold text-lg hover:text-[#bf8339] dark:hover:text-white">العربية</span>
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 group ${
                appLanguage === 'en'
                  ? activeCardBgClass
                  : `${cardBgClass} opacity-70 hover:opacity-100`
              }`}
            >
              <span className="text-xl font-bold bg-black/10 dark:bg-white/10 px-3 py-1 rounded">EN</span>
              <span className="font-bold text-lg hover:text-[#bf8339] dark:hover:text-white">English</span>
            </button>
          </div>
          <p className={`text-center text-xs mt-3 ${isLight ? 'text-gray-400' : theme === 'comfort' ? 'text-[#857D75]' : 'opacity-40'}`}>
            {isAr 
              ? 'سيتم عرض جميع النصوص والملاحظات باللغة المختارة.' 
              : 'All texts and hints will appear in your selected language.'}
          </p>
        </div>

        {/* Step 2: Theme */}
        <div className="mb-10">
          <label className="block text-sm font-bold text-[#bf8339] mb-4 uppercase tracking-wider text-center">
            {isAr ? '2. مظهر الواجهة / Appearance' : '2. Appearance'}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id as Theme)}
                className={`p-3 py-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 group ${
                  theme === t.id
                    ? isLight ? 'bg-white border-[#bf8339] text-[#bf8339] shadow-md transform scale-105' 
                    : theme === 'comfort' ? 'bg-[#ffffff] border-[#bf8339] text-[#A67C00] shadow-md transform scale-105'
                    : 'bg-white text-[#0a1e3c] border-white shadow-lg transform scale-105'
                    : `${cardBgClass} opacity-70 hover:opacity-100`
                }`}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{t.icon}</span>
                <span className={`font-medium text-sm group-hover:text-[#bf8339] transition-colors hover:text-white ${theme === t.id ? '' : (isLight ? 'text-gray-600' : '')}`}>{isAr ? t.labelAr : t.labelEn}</span>
              </button>
            ))}
          </div>
          <p className={`text-center text-xs mt-3 px-4 transition-all duration-300 ${isLight ? 'text-gray-400' : theme === 'comfort' ? 'text-[#857D75]' : 'opacity-40'}`}>
             {isAr 
                ? theme === 'light' ? 'مثالي للأماكن الساطعة.' : theme === 'dark' ? 'مريح للعين في الليل.' : 'ألوان هادئة للعمل الطويل.'
                : theme === 'light' ? 'Best for bright environments.' : theme === 'dark' ? 'Reduces eye strain at night.' : 'Soft colors for long sessions.'
             }
          </p>
        </div>

        {/* Action */}
        <Button 
          onClick={onComplete}
          className="w-full py-4 text-lg font-bold shadow-2xl shadow-[#bf8339]/30 rounded-xl bg-gradient-to-r from-[#bf8339] to-[#d69545] hover:scale-[1.02] transition-transform text-[#0a1e3c]"
        >
          {isAr ? 'ابدأ الاستخدام 🚀' : 'Get Started 🚀'}
        </Button>

      </div>
    </div>
  );
};

export default InitialSetupView;
