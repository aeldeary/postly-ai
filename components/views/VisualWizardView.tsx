
import React, { useState, useRef, useContext } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import * as geminiService from '../../services/geminiService';
import { Loader, MagicWandIcon } from '../Icons';

const VisualWizardView: React.FC = () => {
  const { appLanguage } = useContext(ProjectContext);
  const isAr = appLanguage === 'ar';
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onloadend = async () => {
          const b64 = (reader.result as string).split(',')[1];
          setLoading(true);
          const res = await geminiService.visualWizardAnalysis(b64, file.type);
          setAdvice(res);
          setLoading(false);
      };
      reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-[#bf8339] rounded-xl"><MagicWandIcon className="w-8 h-8 text-[#0a1e3c]" /></div>
            <div>
                <h2 className="text-3xl font-bold text-white">{isAr ? 'الساحر البصري' : 'Visual Wizard'}</h2>
                <p className="text-white/60">{isAr ? 'خبيرك الشخصي لتكوين المشهد المثالي.' : 'Your personal expert for perfect scene composition.'}</p>
            </div>
        </div>

        <div className="bg-[#0a1e3c]/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 flex flex-col items-center">
            <button onClick={() => fileRef.current?.click()} className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl transition mb-8">
                {isAr ? 'ارفع صورة للتحليل' : 'Upload Image for Analysis'}
            </button>
            <input type="file" ref={fileRef} className="hidden" />

            {loading && <Loader />}

            {advice && (
                <div className="w-full bg-white/5 p-6 rounded-xl border-l-4 border-[#bf8339]">
                    <h3 className="text-[#bf8339] font-bold mb-4 text-lg">{isAr ? 'توصيات الساحر:' : 'Wizard Recommendations:'}</h3>
                    <p className="whitespace-pre-wrap text-white/90 leading-loose">{advice}</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default VisualWizardView;
