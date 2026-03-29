
import React, { useContext, useState, useEffect } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import { Theme, AppLanguage } from '../../types';
import { CogIcon } from '../Icons';
import { getStoredApiKey, setStoredApiKey, removeStoredApiKey } from '../../utils/apiKey';

const SettingsView: React.FC = () => {
  const { appLanguage, theme, updateProjectState } = useContext(ProjectContext);
  const isAr = appLanguage === 'ar';
  const isComfort = theme === 'comfort';

  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const stored = getStoredApiKey();
    if (stored) setApiKeyInput(stored);
  }, []);

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim().length < 10) return;
    setStoredApiKey(apiKeyInput.trim());
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 2500);
  };

  const handleRemoveApiKey = () => {
    removeStoredApiKey();
    setApiKeyInput('');
  };

  const handleLanguageChange = (lang: AppLanguage) => {
    updateProjectState({ appLanguage: lang });
  };

  const handleThemeChange = (newTheme: Theme) => {
    updateProjectState({ theme: newTheme });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex items-center gap-3 border-b border-white/10 pb-6">
        <div className="p-3 bg-[#bf8339]/20 rounded-xl">
          <CogIcon className="w-8 h-8 text-[#bf8339]" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-[#bf8339]">
            {isAr ? 'الإعدادات' : 'Settings'}
          </h2>
          <p className="text-white/60 mt-1">
            {isAr 
              ? 'تخصيص تجربة الاستخدام لتناسب احتياجاتك.' 
              : 'Customize your experience to suit your needs.'}
          </p>
        </div>
      </div>

      {/* API Key Section */}
      <div className="bg-[#0a1e3c]/40 backdrop-blur border border-[#bf8339]/30 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-2xl">🔑</span>
          {isAr ? 'مفتاح Gemini API' : 'Gemini API Key'}
        </h3>
        <p className="text-white/50 text-sm mb-5">
          {isAr
            ? 'المفتاح محفوظ في متصفحك فقط ولا يُرسل لأي مكان. احصل عليه من aistudio.google.com'
            : 'Key is saved only in your browser and never sent anywhere. Get it from aistudio.google.com'}
        </p>
        <div className="flex gap-3 mb-3">
          <div className="relative flex-1">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              placeholder={isAr ? 'الصق مفتاح API هنا...' : 'Paste your API key here...'}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#bf8339]/60 pr-12 font-mono text-sm"
              dir="ltr"
            />
            <button
              onClick={() => setShowKey(v => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-white/40 hover:text-white/80"
              tabIndex={-1}
            >
              {showKey ? '🙈' : '👁️'}
            </button>
          </div>
          <button
            onClick={handleSaveApiKey}
            className="px-5 py-3 bg-[#bf8339] hover:bg-[#d4944a] text-[#0a1e3c] font-bold rounded-xl transition-all"
          >
            {apiKeySaved ? (isAr ? '✓ تم الحفظ' : '✓ Saved') : (isAr ? 'حفظ' : 'Save')}
          </button>
          {apiKeyInput && (
            <button
              onClick={handleRemoveApiKey}
              className="px-4 py-3 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-xl transition-all text-sm"
            >
              {isAr ? 'حذف' : 'Remove'}
            </button>
          )}
        </div>
        <div className="bg-black/20 p-3 rounded-xl border-l-4 border-[#bf8339]/40">
          <p className="text-white/60 text-xs leading-relaxed">
            {isAr
              ? '⚠️ المفتاح لا يُحفظ في الكود ولا على أي سيرفر - يبقى في متصفحك فقط. إذا فتحت التطبيق من متصفح جديد ستحتاج لإضافته مرة أخرى.'
              : '⚠️ The key is NOT stored in code or any server — it stays only in your browser. Opening the app in a new browser will require re-entering it.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Language Selection */}
        <div className="bg-[#0a1e3c]/40 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-lg hover:border-[#bf8339]/30 transition-all">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-2xl">🌐</span>
            {isAr ? 'اختيار اللغة / Language Selection' : 'Language Selection'}
          </h3>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => handleLanguageChange('ar')}
              className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all duration-300 border flex items-center justify-center gap-2 hover:text-white ${
                appLanguage === 'ar'
                  ? 'bg-[#bf8339] text-[#0a1e3c] border-[#bf8339] shadow-lg shadow-[#bf8339]/20 transform scale-105 hover:text-white'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <span className="text-xl font-bold bg-white/10 px-3 py-1 rounded">AR</span> العربية
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all duration-300 border flex items-center justify-center gap-2 hover:text-white ${
                appLanguage === 'en'
                  ? 'bg-[#bf8339] text-[#0a1e3c] border-[#bf8339] shadow-lg shadow-[#bf8339]/20 transform scale-105 hover:text-white'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <span className="text-xl font-bold bg-white/10 px-3 py-1 rounded">EN</span> English
            </button>
          </div>

          <div className="bg-black/20 p-4 rounded-xl border-l-4 border-[#bf8339]">
            <p className="text-white/80 text-sm leading-relaxed">
              {isAr 
                ? "اختر اللغة التي تفضلها لاستخدام التطبيق، وسيتم عرض جميع النصوص والملاحظات باللغة المختارة تلقائيًا."
                : "Choose your preferred language for using the app. All texts and hints will automatically appear in your selected language."}
            </p>
          </div>
        </div>

        {/* Theme Mode */}
        <div className="bg-[#0a1e3c]/40 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-lg hover:border-[#bf8339]/30 transition-all">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            {isAr ? 'نمط الواجهة' : 'Theme Mode'}
          </h3>

          <div className="flex flex-col gap-3 mb-6">
            {[
              { id: 'light', labelAr: 'الوضع الفاتح (Light Mode)', labelEn: 'Light Mode', descAr: 'لإضاءة ساطعة', descEn: 'For bright environments' },
              { id: 'dark', labelAr: 'الوضع الداكن (Dark Mode)', labelEn: 'Dark Mode', descAr: 'لإضاءة منخفضة', descEn: 'For low light' },
              { id: 'comfort', labelAr: 'الوضع المريح (Comfort Mode)', labelEn: 'Comfort Mode', descAr: 'مريح للعين', descEn: 'Easy on the eyes' }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => handleThemeChange(option.id as Theme)}
                className={`w-full py-3 px-4 rounded-xl font-medium text-start transition-all flex items-center justify-between group ${
                  theme === option.id
                    ? 'bg-gradient-to-r from-[#bf8339]/20 to-transparent border border-[#bf8339]/50 text-[#bf8339] shadow-inner hover:text-white'
                    : 'bg-white/5 border border-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div>
                    <span className="block font-bold">{isAr ? option.labelAr : option.labelEn}</span>
                    <span className="text-xs opacity-60 font-normal">{isAr ? option.descAr : option.descEn}</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${theme === option.id ? 'border-[#bf8339]' : 'border-white/20 group-hover:border-white/40'}`}>
                  {theme === option.id && <div className="w-2.5 h-2.5 bg-[#bf8339] rounded-full" />}
                </div>
              </button>
            ))}
          </div>

          <div className="bg-black/20 p-4 rounded-xl border-l-4 border-blue-500/50">
            <p className="text-white/80 text-xs leading-relaxed">
              {isAr 
                ? "لتحسين راحتك أثناء العمل، اختر النمط الأنسب حسب الإضاءة من حولك. إذا كنت تعمل في مكان بإضاءة طبيعية أو ساطعة، يُنصح باستخدام الوضع الفاتح لزيادة وضوح النص والعناصر. أما إذا كنت تعمل في بيئة ذات إضاءة منخفضة أو خلال الليل، يُفضَّل الوضع الداكن لتقليل إجهاد العين. يمكنك أيضًا اختيار الوضع المريح (Comfort Mode) بدرجات ألوان بيج دافئة وتباين عالي للعين."
                : "To enhance your comfort, choose the theme that best matches your lighting. If you work in bright light, use Light Mode for readability. In low light or at night, use Dark Mode to reduce eye strain. You can also choose Comfort Mode for warm beige tones and high contrast text ideal for long work sessions."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsView;
