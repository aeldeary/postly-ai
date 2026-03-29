import React, { useState } from 'react';
import { setStoredApiKey } from '../utils/apiKey';

interface Props {
  onSave: () => void;
  isAr: boolean;
}

const ApiKeySetupModal: React.FC<Props> = ({ onSave, isAr }) => {
  const [key, setKey] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  const handleSave = () => {
    if (key.trim().length < 20) {
      setError(true);
      return;
    }
    setStoredApiKey(key.trim());
    onSave();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0a1e3c] border border-[#bf8339]/40 rounded-2xl shadow-2xl w-full max-w-md p-7 text-white">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 bg-[#bf8339]/20 rounded-xl flex items-center justify-center text-2xl">🔑</div>
          <div>
            <h2 className="text-xl font-bold text-[#bf8339]">
              {isAr ? 'مفتاح Gemini API مطلوب' : 'Gemini API Key Required'}
            </h2>
            <p className="text-white/50 text-sm">
              {isAr ? 'مجاني من Google' : 'Free from Google'}
            </p>
          </div>
        </div>

        <p className="text-white/70 text-sm leading-relaxed mb-5">
          {isAr
            ? 'لاستخدام ميزات الذكاء الاصطناعي، تحتاج مفتاح API مجاني من Google. المفتاح يُحفظ في متصفحك فقط ولا يُرسل لأي مكان آخر.'
            : 'To use AI features, you need a free API key from Google. The key is saved only in your browser and never sent anywhere.'}
        </p>

        <div className="bg-[#bf8339]/10 border border-[#bf8339]/20 rounded-xl p-4 mb-5 text-sm">
          <p className="font-bold text-[#bf8339] mb-2">
            {isAr ? 'كيف تحصل على المفتاح:' : 'How to get the key:'}
          </p>
          <ol className="text-white/70 space-y-1 list-decimal list-inside">
            <li>{isAr ? 'افتح' : 'Open'} <span className="text-[#bf8339] font-mono text-xs">aistudio.google.com/apikey</span></li>
            <li>{isAr ? 'اضغط "Create API key"' : 'Click "Create API key"'}</li>
            <li>{isAr ? 'انسخ المفتاح والصقه هنا' : 'Copy and paste the key below'}</li>
          </ol>
        </div>

        <div className="relative mb-3">
          <input
            type={show ? 'text' : 'password'}
            value={key}
            onChange={e => { setKey(e.target.value); setError(false); }}
            placeholder={isAr ? 'AIzaSy...' : 'AIzaSy...'}
            className={`w-full bg-black/30 border rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none font-mono text-sm pr-12 ${
              error ? 'border-red-500/60' : 'border-white/10 focus:border-[#bf8339]/60'
            }`}
            dir="ltr"
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
          <button
            onClick={() => setShow(v => !v)}
            className="absolute inset-y-0 right-3 flex items-center text-white/40 hover:text-white/80"
            tabIndex={-1}
          >
            {show ? '🙈' : '👁️'}
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-xs mb-3">
            {isAr ? 'المفتاح غير صحيح - تأكد من نسخه كاملًا' : 'Invalid key — make sure you copied it fully'}
          </p>
        )}

        <button
          onClick={handleSave}
          className="w-full py-3 bg-[#bf8339] hover:bg-[#d4944a] text-[#0a1e3c] font-bold rounded-xl transition-all text-base"
        >
          {isAr ? 'حفظ وبدء الاستخدام' : 'Save & Start Using'}
        </button>
      </div>
    </div>
  );
};

export default ApiKeySetupModal;
