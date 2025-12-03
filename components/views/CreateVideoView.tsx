
import React, { useState, useContext, useRef, useMemo, useEffect } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import Button from '../Button';
import { VideoCameraIcon, Loader, ImageIcon, MagicWandIcon } from '../Icons';
import * as geminiService from '../../services/geminiService';
import { setItem, getItem, removeItem } from '../../utils/localStorage';
import { ARCHIVE_STORAGE_KEY, VIDEO_ASPECT_RATIOS, VIDEO_RESOLUTIONS, INDUSTRIES_GROUPED, LANGUAGES_GROUPED } from '../../constants';
import AccordionSelect from '../AccordionSelect';
import CustomGroupedSelect from '../CustomGroupedSelect';
import VoiceInput from '../VoiceInput';
import { ArchivedItem } from '../../types';

type VideoMode = 'TextToVideo' | 'ImageToVideo';

const CreateVideoView: React.FC = () => {
  const { topic, industry, language, appLanguage } = useContext(ProjectContext);
  const isAr = appLanguage === 'ar';
  
  const [mode, setMode] = useState<VideoMode>('TextToVideo');
  const [prompt, setPrompt] = useState(topic);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [resolution, setResolution] = useState('720p');
  
  // Advanced Context
  const [localIndustry, setLocalIndustry] = useState(industry);
  const [localLanguage, setLocalLanguage] = useState(language);

  // New Features: Audio/Text Preferences
  const [hasMusic, setHasMusic] = useState(false);
  const [hasVoiceover, setHasVoiceover] = useState(false);
  const [overlayText, setOverlayText] = useState('');

  // Image Upload
  const [sourceImage, setSourceImage] = useState<{data: string, mimeType: string} | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Output
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for restored draft
  useEffect(() => {
      const draft = getItem<ArchivedItem>('editDraft');
      if (draft && draft.type === 'Video') {
          setGeneratedVideo(draft.content.url);
          setPrompt(draft.content.prompt);
          if (draft.content.mode) setMode(draft.content.mode);
          removeItem('editDraft');
      }
  }, []);

  const ASPECT_RATIO_GROUPS = useMemo(() => [{
      label: isAr ? 'الأبعاد' : 'Aspect Ratios',
      options: VIDEO_ASPECT_RATIOS.map(r => ({ label: isAr ? r.label.ar : r.label.en, value: r.value }))
  }], [isAr]);

  const RESOLUTION_GROUPS = useMemo(() => [{
      label: isAr ? 'الجودة' : 'Resolution',
      options: VIDEO_RESOLUTIONS.map(r => ({ label: isAr ? r.label.ar : r.label.en, value: r.value }))
  }], [isAr]);

  // Memoized localized options
  const localizedLanguages = useMemo(() => LANGUAGES_GROUPED.map(g => ({
      label: isAr ? g.label.ar : g.label.en,
      options: g.options.map(o => ({ label: isAr ? o.label.ar : o.label.en, value: o.value }))
  })), [isAr]);

  const localizedIndustries = useMemo(() => INDUSTRIES_GROUPED.map(g => ({
      label: isAr ? g.label.ar : g.label.en,
      options: g.options.map(o => ({ label: isAr ? o.label.ar : o.label.en, value: o.value }))
  })), [isAr]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          setSourceImage({ data: base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
  };

  const handleEnhancePrompt = async () => {
      if (!prompt) return;
      setIsEnhancing(true);
      try {
          const context = `Industry: ${localIndustry}, Style: Cinematic, HasMusic: ${hasMusic}, HasVoice: ${hasVoiceover}`;
          const enhanced = await geminiService.enhancePrompt(prompt, context);
          setPrompt(enhanced);
          (window as any).toast?.(isAr ? 'تم تحسين الوصف بنجاح' : 'Prompt Enhanced!', 'success');
      } catch (e) {
          console.error(e);
      } finally {
          setIsEnhancing(false);
      }
  };

  const handleGenerate = async () => {
      setError(null);
      setGeneratedVideo(null);
      
      // Check API Key Selection
      if ((window as any).aistudio) {
          try {
             const hasKey = await (window as any).aistudio.hasSelectedApiKey();
             if (!hasKey) {
                 await (window as any).aistudio.openSelectKey();
             }
          } catch (e) {
              console.warn("AI Studio Key Check failed", e);
          }
      }

      if (mode === 'TextToVideo' && !prompt) {
          (window as any).toast?.(isAr ? "يرجى كتابة وصف للفيديو" : "Please enter a video description", 'error');
          return;
      }
      if (mode === 'ImageToVideo' && !sourceImage) {
          (window as any).toast?.(isAr ? "يرجى رفع صورة" : "Please upload an image", 'error');
          return;
      }

      setIsLoading(true);

      try {
          // --- PROMPT ENGINEERING ---
          let finalPrompt = prompt;
          
          // 1. Context Injection
          if (localIndustry) finalPrompt += `, Context: ${localIndustry}`;
          
          // 2. Audio/Pacing Cues (Visual Instructions)
          if (hasMusic) {
              finalPrompt += ". [Pacing]: Rhythmic editing, fast-paced cuts, dynamic camera movement matching energetic music.";
          }
          if (hasVoiceover) {
              finalPrompt += ". [Pacing]: Slow and steady camera movement, minimal cuts, pauses suitable for voiceover narration.";
          }

          // 3. Text Overlay & Arabic Optimization
          const isArabicContext = localLanguage.includes('Arabic') || localLanguage.includes('العربية');
          
          if (overlayText) {
              finalPrompt += `. [Text Overlay]: Display the text "${overlayText}" clearly on screen.`;
              
              // Detect Arabic characters
              const hasArabicChar = /[\u0600-\u06FF]/.test(overlayText);
              
              if (hasArabicChar || isArabicContext) {
                  finalPrompt += " [Typography]: Use bold Arabic Calligraphy style. Ensure letters are connected correctly (cursive). Right-to-left orientation. High contrast text.";
              } else {
                  finalPrompt += " [Typography]: Clear bold modern typography, professional titling.";
              }
          }

          // 4. Cultural/Visual Nuance
          if (isArabicContext) {
               finalPrompt += " [Atmosphere]: Middle Eastern aesthetics, authentic details, warm lighting.";
          }

          // 5. Visual Quality Base
          finalPrompt += ". [Quality]: Professional cinematography, high production value, smooth motion, 4k render style.";

          const videoUrl = await geminiService.generateVideo(
              finalPrompt,
              resolution as '720p' | '1080p',
              aspectRatio as '16:9' | '9:16',
              mode === 'ImageToVideo' && sourceImage ? sourceImage : undefined
          );

          setGeneratedVideo(videoUrl);
          (window as any).toast?.(isAr ? 'تم إنشاء الفيديو بنجاح!' : 'Video Generated!', 'success');

          const archive = getItem(ARCHIVE_STORAGE_KEY, []);
          archive.unshift({ 
              id: Date.now().toString(), 
              type: 'Video', 
              content: { url: videoUrl, prompt: finalPrompt, mode }, 
              timestamp: new Date().toISOString() 
          });
          setItem(ARCHIVE_STORAGE_KEY, archive);

      } catch (err: any) {
          // Filter out the specific message user wanted removed if it appears in error
          let msg = err.message || (isAr ? "فشل إنشاء الفيديو" : "Video generation failed");
          if (msg.includes("paid API key")) {
              msg = isAr ? "يرجى التحقق من مفتاح API الخاص بك." : "Please check your API key.";
          }
          setError(msg);
          (window as any).toast?.(msg, 'error');

          if (err.message?.includes("Requested entity was not found") && (window as any).aistudio) {
              await (window as any).aistudio.openSelectKey();
          }
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-end border-b border-white/10 pb-4">
          <div>
              <h2 className="text-3xl font-bold text-[#bf8339] flex items-center gap-2">
                 <VideoCameraIcon className="w-8 h-8"/> {isAr ? 'إنشاء الفيديو الاحترافي (Veo)' : 'Pro Video Creator (Veo)'}
              </h2>
              <p className="text-white/60 mt-1">
                  {isAr 
                    ? 'أنشئ مشاهد سينمائية مذهلة مع دعم النصوص العربية وضبط الإيقاع البصري.' 
                    : 'Create stunning cinematic scenes with text support and visual pacing control.'}
              </p>
          </div>
          <div className="flex bg-[#0a1e3c] p-1 rounded-lg">
              <button 
                onClick={() => setMode('TextToVideo')} 
                className={`px-4 py-2 rounded-md transition text-sm font-bold ${mode === 'TextToVideo' ? 'bg-[#bf8339] text-[#0a1e3c] hover:text-white' : 'text-white/70 hover:bg-white/5'}`}
              >
                  {isAr ? 'نص إلى فيديو' : 'Text to Video'}
              </button>
              <button 
                onClick={() => setMode('ImageToVideo')} 
                className={`px-4 py-2 rounded-md transition text-sm font-bold ${mode === 'ImageToVideo' ? 'bg-[#bf8339] text-[#0a1e3c] hover:text-white' : 'text-white/70 hover:bg-white/5'}`}
              >
                  {isAr ? 'تحريك صورة' : 'Image to Video'}
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-6">
               <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg">
                   <h3 className="text-[#bf8339] font-bold mb-4 text-sm uppercase tracking-wider border-b border-white/10 pb-2">
                       {isAr ? 'إعدادات الفيديو' : 'Video Settings'}
                   </h3>
                   
                   <div className="space-y-4">
                       <CustomGroupedSelect 
                           label={isAr ? "أبعاد الفيديو" : "Aspect Ratio"} 
                           value={aspectRatio} 
                           onChange={setAspectRatio} 
                           groups={ASPECT_RATIO_GROUPS} 
                           placeholder="Select Ratio" 
                       />
                       <CustomGroupedSelect 
                           label={isAr ? "الدقة" : "Resolution"} 
                           value={resolution} 
                           onChange={setResolution} 
                           groups={RESOLUTION_GROUPS} 
                           placeholder="Select Resolution" 
                       />
                   </div>
               </div>

               {/* Audio Visual Pacing Controls */}
               <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg">
                   <h3 className="text-[#bf8339] font-bold mb-4 text-sm uppercase tracking-wider border-b border-white/10 pb-2">
                       {isAr ? 'الصوت والإيقاع البصري' : 'Audio & Visual Pacing'}
                   </h3>
                   <div className="space-y-4">
                        <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition border border-white/5 hover:border-[#bf8339]/30">
                            <input 
                                type="checkbox" 
                                checked={hasMusic} 
                                onChange={(e) => {
                                    setHasMusic(e.target.checked);
                                    if(e.target.checked) setHasVoiceover(false);
                                }} 
                                className="w-5 h-5 accent-[#bf8339]" 
                            />
                            <div>
                                <span className="block text-sm font-bold text-white">{isAr ? 'إيقاع موسيقي (Music Pacing)' : 'Music Pacing'}</span>
                                <span className="block text-[10px] text-white/50">{isAr ? 'مونتاج سريع وحيوي يناسب الموسيقى.' : 'Fast cuts and dynamic motion.'}</span>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition border border-white/5 hover:border-[#bf8339]/30">
                            <input 
                                type="checkbox" 
                                checked={hasVoiceover} 
                                onChange={(e) => {
                                    setHasVoiceover(e.target.checked);
                                    if(e.target.checked) setHasMusic(false);
                                }} 
                                className="w-5 h-5 accent-[#bf8339]" 
                            />
                            <div>
                                <span className="block text-sm font-bold text-white">{isAr ? 'إيقاع تعليق صوتي (Voiceover Pacing)' : 'Voiceover Pacing'}</span>
                                <span className="block text-[10px] text-white/50">{isAr ? 'حركة بطيئة وسلسة تناسب السرد.' : 'Slow, steady motion for narration.'}</span>
                            </div>
                        </label>
                   </div>
               </div>

               <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg">
                   <h3 className="text-[#bf8339] font-bold mb-4 text-sm uppercase tracking-wider border-b border-white/10 pb-2">
                       {isAr ? 'السياق المهني' : 'Professional Context'}
                   </h3>
                   <div className="space-y-4">
                       <AccordionSelect 
                           label={isAr ? "القطاع" : "Industry"}
                           value={localIndustry}
                           onChange={setLocalIndustry}
                           groups={localizedIndustries}
                           placeholder={isAr ? "اختر القطاع" : "Select Industry"}
                       />
                       <AccordionSelect 
                           label={isAr ? "اللغة/الثقافة" : "Language/Culture"}
                           value={localLanguage}
                           onChange={setLocalLanguage}
                           groups={localizedLanguages}
                           placeholder={isAr ? "اختر اللغة" : "Select Language"}
                       />
                   </div>
               </div>
          </div>

          {/* Workspace */}
          <div className="lg:col-span-8 space-y-6">
               {mode === 'ImageToVideo' && (
                   <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                       <div 
                           onClick={() => fileRef.current?.click()}
                           className="border-2 border-dashed border-white/20 rounded-xl min-h-[200px] flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-[#bf8339] transition group"
                       >
                           {sourceImage ? (
                               <img src={`data:${sourceImage.mimeType};base64,${sourceImage.data}`} className="max-h-[300px] rounded shadow-lg" />
                           ) : (
                               <>
                                   <ImageIcon className="w-12 h-12 text-white/30 group-hover:text-[#bf8339] mb-3 transition" />
                                   <p className="text-white/50">{isAr ? 'اضغط لرفع صورة' : 'Click to upload image to animate'}</p>
                                </>
                           )}
                       </div>
                       <input type="file" ref={fileRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                   </div>
               )}

               <div className="bg-white/5 border border-white/10 rounded-xl p-5 relative">
                   <div className="flex justify-between items-center mb-2">
                       <label className="block text-sm text-[#bf8339] font-bold">
                           {mode === 'TextToVideo' ? (isAr ? 'وصف المشهد' : 'Scene Description') : (isAr ? 'توجيهات التحريك (اختياري)' : 'Motion Prompt (Optional)')}
                       </label>
                       <div className="flex gap-2">
                           <VoiceInput onTranscript={setPrompt} />
                           {prompt && (
                            <button 
                                onClick={handleEnhancePrompt} 
                                disabled={isEnhancing}
                                className="text-xs flex items-center gap-1 text-white/70 hover:text-[#bf8339] transition bg-white/5 px-2 py-1 rounded border border-white/10"
                            >
                                {isEnhancing ? <Loader /> : <MagicWandIcon className="w-3 h-3" />}
                                {isAr ? 'تحسين الوصف (AI)' : 'Enhance Prompt'}
                            </button>
                           )}
                       </div>
                   </div>
                   <textarea 
                       className="w-full bg-black/20 border border-white/20 rounded-lg p-4 h-32 text-white focus:border-[#bf8339] transition placeholder-white/30 leading-relaxed"
                       placeholder={isAr 
                           ? (mode === 'TextToVideo' ? "مثال: لقطة سينمائية بطيئة لسيارة رياضية تسير تحت المطر في مدينة سايبربانك..." : "مثال: حركة كاميرا بطيئة تقترب من الهدف مع تطاير الشعر...") 
                           : "e.g. Cinematic slow motion shot..."}
                       value={prompt}
                       onChange={e => setPrompt(e.target.value)}
                   />

                   {/* Text Overlay Input */}
                   <div className="mt-4 pt-4 border-t border-white/5">
                        <label className="block text-xs font-bold text-white/70 mb-2">
                            {isAr ? 'نص يظهر في الفيديو (Text Overlay)' : 'Text to appear in video'}
                        </label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="text" 
                                value={overlayText}
                                onChange={(e) => setOverlayText(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-[#bf8339] placeholder-white/20"
                                placeholder={isAr ? "مثال: قهوة الصباح - يفضل نصوص قصيرة" : "e.g. Morning Coffee"}
                            />
                            <VoiceInput onTranscript={setOverlayText} className="!p-1.5" />
                        </div>
                        <p className="text-[10px] text-white/40 mt-1">
                            {isAr 
                                ? 'ملاحظة: الذكاء الاصطناعي سيحاول كتابة النص بدقة، لكن النصوص العربية قد تحتاج لمحاولات متعددة.' 
                                : 'Note: Text rendering is best effort.'}
                        </p>
                   </div>
                   
                   <Button onClick={handleGenerate} isLoading={isLoading} className="w-full mt-6 py-4 text-lg font-bold shadow-xl shadow-[#bf8339]/20">
                       {isLoading ? (isAr ? 'جاري المعالجة (1-2 دقيقة)...' : 'Processing (1-2 min)...') : (isAr ? 'إنشاء الفيديو' : 'Generate Video')}
                   </Button>
               </div>

               {error && (
                   <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center">
                       {error}
                   </div>
               )}

               {generatedVideo && (
                   <div className="bg-black/40 border border-[#bf8339]/30 rounded-xl p-6 text-center animate-fade-in">
                       <h3 className="text-[#bf8339] font-bold mb-4">{isAr ? 'تم إنشاء الفيديو بنجاح!' : 'Video Generated Successfully!'}</h3>
                       <video controls className="w-full rounded-lg shadow-2xl mb-6 max-h-[600px] bg-black">
                           <source src={generatedVideo} type="video/mp4" />
                           Your browser does not support the video tag.
                       </video>
                       <a 
                           href={generatedVideo} 
                           download="generated-video.mp4" 
                           className="inline-block bg-[#bf8339] text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-[#bf8339] transition"
                       >
                           {isAr ? 'تحميل الفيديو' : 'Download Video'}
                       </a>
                   </div>
               )}
          </div>
      </div>
    </div>
  );
};

export default CreateVideoView;
