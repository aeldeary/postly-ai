
import React, { useState, useContext } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import * as geminiService from '../../services/geminiService';
import Button from '../Button';
import { REALISM_ENGINE_PROMPTS } from '../../constants';

const RealismEngineView: React.FC = () => {
  const { appLanguage } = useContext(ProjectContext);
  const isAr = appLanguage === 'ar';
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
      setLoading(true);
      try {
          // Use realism engine flag
          const res = await geminiService.generateImage(prompt, 'gemini-2.5-flash-image', '1:1', 'Photorealistic', undefined, undefined, true);
          setImage(`data:image/jpeg;base64,${res}`);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="space-y-8 animate-fade-in">
        <div>
            <h2 className="text-3xl font-bold text-[#bf8339] flex items-center gap-2">
                <span className="text-4xl">⚡</span> {isAr ? 'محرك الواقعية الفائقة' : 'Realism Engine'}
            </h2>
            <p className="text-white/60">{isAr ? 'توليد صور بجودة فوتوغرافية لا يمكن تمييزها عن الحقيقة.' : 'Generate hyper-realistic photos indistinguishable from reality.'}</p>
        </div>

        <div className="bg-[#0a1e3c]/60 backdrop-blur-xl border border-[#bf8339]/30 rounded-xl p-8 shadow-2xl">
            <div className="mb-6 p-4 bg-[#bf8339]/10 border border-[#bf8339]/20 rounded text-xs text-[#bf8339]">
                {isAr ? 'تم تفعيل: ABSOLUTE_REALISM_ENGINE + HYPER_STYLED_3D_MANDATE' : 'Active: ABSOLUTE_REALISM_ENGINE + HYPER_STYLED_3D_MANDATE'}
            </div>
            
            <textarea 
                value={prompt} 
                onChange={e => setPrompt(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg p-4 h-32 text-white focus:border-[#bf8339]"
                placeholder={isAr ? "صف المشهد بتفاصيل دقيقة..." : "Describe the scene in detail..."}
            />
            
            <div className="mt-4 flex justify-end">
                <Button onClick={generate} isLoading={loading} className="!px-10 !py-3 !text-lg">{isAr ? 'توليد واقعي' : 'Generate Realistic'}</Button>
            </div>
        </div>

        {image && (
            <div className="text-center bg-black/40 p-4 rounded-xl border border-white/10">
                <img src={image} className="rounded shadow-2xl max-h-[600px] mx-auto" />
                <a href={image} download="realism.jpg" className="inline-block mt-4 text-[#bf8339] hover:text-white underline transition">
                    {isAr ? 'تحميل بجودة عالية' : 'Download High Res'}
                </a>
            </div>
        )}
    </div>
  );
};

export default RealismEngineView;
