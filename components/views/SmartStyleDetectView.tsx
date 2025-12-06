
import React, { useState, useRef, useContext } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import * as geminiService from '../../services/geminiService';
import { Loader } from '../Icons';

const SmartStyleDetectView: React.FC = () => {
  const { appLanguage } = useContext(ProjectContext);
  const isAr = appLanguage === 'ar';
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onloadend = async () => {
          const b64 = (reader.result as string).split(',')[1];
          setLoading(true);
          // Pass the current language to get localized results
          const res = await geminiService.detectStyle(b64, file.type, isAr ? 'Arabic' : 'English');
          setResult(res);
          setLoading(false);
      };
      reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-[#bf8339]">{isAr ? 'اكتشاف الأسلوب الذكي' : 'Smart Style Detect'}</h2>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center cursor-pointer hover:bg-white/10 transition" onClick={() => fileRef.current?.click()}>
            <p className="text-white/50 text-xl">{isAr ? 'ارفع صورة لاكتشاف ستايلها' : 'Upload image to detect style'}</p>
            <input type="file" ref={fileRef} className="hidden" />
        </div>

        {loading && <div className="flex justify-center"><Loader /></div>}

        {result && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#2e4f8a]/50 p-6 rounded-xl border border-[#bf8339]/30">
                    <h3 className="text-[#bf8339] font-bold mb-2">{isAr ? 'المزاج العام' : 'Mood'}</h3>
                    <p className="text-2xl text-white">{result.mood}</p>
                </div>
                <div className="bg-[#2e4f8a]/50 p-6 rounded-xl border border-[#bf8339]/30">
                    <h3 className="text-[#bf8339] font-bold mb-2">{isAr ? 'الإضاءة' : 'Lighting'}</h3>
                    <p className="text-2xl text-white">{result.lighting}</p>
                </div>
                <div className="bg-[#2e4f8a]/50 p-6 rounded-xl border border-[#bf8339]/30">
                    <h3 className="text-[#bf8339] font-bold mb-2">{isAr ? 'كلمات مفتاحية' : 'Keywords'}</h3>
                    <div className="flex flex-wrap gap-2">
                        {result.keywords?.map((k: string, i: number) => <span key={i} className="bg-white/10 px-2 py-1 rounded text-sm">{k}</span>)}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default SmartStyleDetectView;
