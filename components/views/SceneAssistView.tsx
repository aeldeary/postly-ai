
import React, { useState, useRef, useContext } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import * as geminiService from '../../services/geminiService';
import Button from '../Button';
import { Loader } from '../Icons';

const SceneAssistView: React.FC = () => {
  const { appLanguage } = useContext(ProjectContext);
  const isAr = appLanguage === 'ar';
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          setImage(`data:${file.type};base64,${base64}`);
          analyze(base64, file.type);
      };
      reader.readAsDataURL(file);
  };

  const analyze = async (base64: string, mime: string) => {
      setIsLoading(true);
      try {
          // Pass current language to service
          const res = await geminiService.analyzeScene(base64, mime, isAr ? 'Arabic' : 'English');
          setAnalysis(res);
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="space-y-8 animate-fade-in">
        <div>
            <h2 className="text-3xl font-bold text-[#bf8339]">{isAr ? 'المساعد البصري الذكي' : 'AI Scene Assist'}</h2>
            <p className="text-white/60">{isAr ? 'ارفع صورة لتحليل الإضاءة، الزوايا، والتكوين والحصول على اقتراحات للتحسين.' : 'Upload an image to analyze lighting, angles, and composition for enhancement.'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-white/20 rounded-xl min-h-[300px] flex items-center justify-center cursor-pointer hover:bg-white/5 transition">
                {image ? <img src={image} className="max-h-[400px] rounded" /> : <div className="text-white/40 text-center p-4">{isAr ? 'اضغط لرفع صورة' : 'Click to upload image'}</div>}
                <input type="file" ref={fileRef} onChange={handleUpload} className="hidden" />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
                <h3 className="text-xl font-bold text-white mb-4">{isAr ? 'تقرير التحليل' : 'Analysis Report'}</h3>
                {isLoading ? (
                    <div className="flex justify-center py-10"><Loader /></div>
                ) : analysis ? (
                    <div className="whitespace-pre-wrap text-white/80 leading-relaxed">{analysis}</div>
                ) : (
                    <p className="text-white/40 text-sm italic">{isAr ? 'بانتظار الصورة...' : 'Waiting for image...'}</p>
                )}
            </div>
        </div>
    </div>
  );
};

export default SceneAssistView;
