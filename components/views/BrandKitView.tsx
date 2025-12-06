
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import Button from '../Button';
import { Loader, MagicWandIcon, ImageIcon } from '../Icons';
import { INDUSTRIES_GROUPED, ARCHIVE_STORAGE_KEY } from '../../constants';
import { BrandKit, ArchivedItem } from '../../types';
import * as geminiService from '../../services/geminiService';
import { setItem, getItem } from '../../utils/localStorage';
import AccordionSelect from '../AccordionSelect';
import CopyButton from '../CopyButton';

const BrandKitView: React.FC = () => {
  const { industry, appLanguage, activeDraft, updateProjectState } = useContext(ProjectContext);
  const isAr = appLanguage === 'ar';

  const [brandName, setBrandName] = useState('');
  const [brandDesc, setBrandDesc] = useState('');
  const [localIndustry, setLocalIndustry] = useState(industry);
  const [kit, setKit] = useState<BrandKit | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Logo Studio State
  const [logoPrompt, setLogoPrompt] = useState('');
  const [rawLogoImages, setRawLogoImages] = useState<string[]>([]); // Images from AI (Icon only)
  const [processedLogos, setProcessedLogos] = useState<string[]>([]); // Images with Text Overlay
  const [isSuggestingLogo, setIsSuggestingLogo] = useState(false);
  const [isGeneratingLogos, setIsGeneratingLogos] = useState(false);

  // Helper to safely extract string content from potential objects (Legacy Support)
  const getSafeText = (content: any): string => {
      if (!content) return '';
      if (typeof content === 'string') return content;
      if (typeof content === 'object') {
          // Handle legacy structure { headings, body } or any object mistakenly returned
          const parts = [];
          if (content.headings) parts.push(content.headings);
          if (content.title) parts.push(content.title);
          if (content.body) parts.push(content.body);
          if (content.content) parts.push(content.content);
          
          if (parts.length > 0) return parts.join('\n\n');
          // Fallback for unknown objects
          return JSON.stringify(content);
      }
      return String(content);
  };

  // Check for restored draft from Context
  useEffect(() => {
      if (activeDraft && activeDraft.type === 'BrandKit') {
          setKit(activeDraft.content);
          // Safely handle brandName if it's an object in draft
          setBrandName(getSafeText(activeDraft.content.brandName));
          // Clean up context
          updateProjectState({ activeDraft: null });
      }
  }, [activeDraft]);

  // Memoized localized options
  const localizedIndustries = useMemo(() => INDUSTRIES_GROUPED.map(g => ({
      label: isAr ? g.label.ar : g.label.en,
      options: g.options.map(o => ({ label: isAr ? o.label.ar : o.label.en, value: o.value }))
  })), [isAr]);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
        const res = await geminiService.generateBrandKit(brandName, localIndustry, brandDesc);
        setKit(res);
        const archive = getItem(ARCHIVE_STORAGE_KEY, []);
        archive.unshift({ id: Date.now().toString(), type: 'BrandKit', content: res, timestamp: new Date().toISOString() });
        setItem(ARCHIVE_STORAGE_KEY, archive);
    } catch (e) {
        console.error(e);
        alert("فشل توليد الهوية.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleSuggestLogoPrompt = async () => {
      if (!brandName) return alert('يرجى كتابة اسم البراند أولاً');
      setIsSuggestingLogo(true);
      try {
          const suggestion = await geminiService.suggestLogoPrompt(brandName, localIndustry, brandDesc);
          setLogoPrompt(suggestion);
      } catch (e) {
          console.error(e);
      } finally {
          setIsSuggestingLogo(false);
      }
  };

  // Apply Arabic Text Overlay locally using Canvas
  const applyTextToLogo = async (imageUrl: string, name: string): Promise<string> => {
      return new Promise((resolve) => {
          const img = new Image();
          img.src = imageUrl;
          img.crossOrigin = "anonymous";
          img.onload = () => {
              const canvas = document.createElement('canvas');
              const size = 1024; // Standardize high res
              canvas.width = size;
              canvas.height = size;
              const ctx = canvas.getContext('2d');
              if (!ctx) { resolve(imageUrl); return; }

              // Draw Background (White) to ensure clean look
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, size, size);

              // Draw Icon (centered, slightly moved up)
              // Assuming AI returns a square image, draw it slightly smaller to leave room for text
              const iconSize = size * 0.75; // 75% of canvas
              const iconX = (size - iconSize) / 2;
              const iconY = (size - iconSize) / 2 - 50; // Move up by 50px
              ctx.drawImage(img, 0, 0, img.width, img.height, iconX, iconY, iconSize, iconSize);

              // Draw Brand Name
              if (name) {
                  ctx.font = "bold 90px 'Cairo', 'Tajawal', sans-serif";
                  ctx.fillStyle = "#000000"; // Black text
                  ctx.textAlign = "center";
                  ctx.textBaseline = "middle";
                  
                  // Text Shadow for contrast just in case
                  ctx.shadowColor = "rgba(0,0,0,0.1)";
                  ctx.shadowBlur = 10;
                  
                  // Draw Text at bottom
                  ctx.fillText(name, size / 2, size - 120);
              }

              resolve(canvas.toDataURL('image/jpeg', 0.9));
          };
          img.onerror = () => resolve(imageUrl);
      });
  };

  const handleGenerateLogos = async () => {
      if (!logoPrompt) return alert('يرجى كتابة وصف الشعار أو اقتراحه أولاً');
      if (!brandName) return alert('يرجى كتابة اسم البراند لاستخدامه في الشعار');

      setIsGeneratingLogos(true);
      setRawLogoImages([]);
      setProcessedLogos([]);
      
      try {
          // 1. Generate clean icons via AI (No text)
          const rawImages = await geminiService.generateLogoConcepts(logoPrompt);
          setRawLogoImages(rawImages);

          // 2. Process images to add Arabic text locally
          const processed = await Promise.all(
              rawImages.map(img => applyTextToLogo(img, brandName))
          );
          setProcessedLogos(processed);

      } catch (e) {
          console.error(e);
          alert('فشل توليد الشعارات');
      } finally {
          setIsGeneratingLogos(false);
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div>
        <h2 className="text-3xl font-bold text-[#bf8339]">{isAr ? 'مولد هوية البراند' : 'Brand Kit Generator'}</h2>
        <p className="text-white/70 mt-1">{isAr ? 'ابنِ هوية متكاملة لعلامتك التجارية: ألوان، شعارات، ونبرة صوت.' : 'Build a complete brand identity: colors, logos, and tone of voice.'}</p>
      </div>

      <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm text-white/80 mb-1">{isAr ? 'اسم البراند' : 'Brand Name'}</label>
                <input type="text" className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white" value={brandName} onChange={e => setBrandName(e.target.value)} placeholder={isAr ? "مثال: قهوة الصباح" : "e.g., Morning Coffee"} />
            </div>
            
            <AccordionSelect 
                label={isAr ? "المجال" : "Industry"}
                value={localIndustry}
                onChange={(val) => setLocalIndustry(val)}
                groups={localizedIndustries}
                placeholder={isAr ? "اختر المجال" : "Select Industry"}
            />
        </div>
        <div>
            <label className="block text-sm text-white/80 mb-1">{isAr ? 'وصف المشروع ورؤيتك' : 'Project Description & Vision'}</label>
            <textarea className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white" rows={3} value={brandDesc} onChange={e => setBrandDesc(e.target.value)} placeholder={isAr ? "ماذا تقدم؟ ومن هم عملاؤك؟" : "What do you offer? Who are your customers?"} />
        </div>
        <Button onClick={handleGenerate} isLoading={isLoading}>{isAr ? 'توليد الهوية الكاملة' : 'Generate Full Brand Kit'}</Button>
      </div>

      {isLoading && <div className="flex justify-center"><Loader /></div>}

      {kit && (
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden animate-fade-in">
              <div className="bg-[#bf8339] p-6 text-[#0a1e3c]">
                  <h2 className="text-4xl font-bold mb-2">{getSafeText(kit.brandName)}</h2>
                  <p className="text-xl font-medium opacity-80">{getSafeText(kit.slogan)}</p>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                      <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-bold text-[#bf8339]">{isAr ? 'الرسالة والمهمة' : 'Mission Statement'}</h3>
                          <CopyButton text={getSafeText(kit.mission)} />
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed mb-6 bg-black/20 p-3 rounded whitespace-pre-line">
                          {getSafeText(kit.mission)}
                      </p>
                      
                      <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-bold text-[#bf8339]">{isAr ? 'نبرة الصوت (Tone of Voice)' : 'Tone of Voice'}</h3>
                          <CopyButton text={getSafeText(kit.toneOfVoice)} />
                      </div>
                      <p className="text-white/80 text-sm mb-6 bg-black/20 p-3 rounded whitespace-pre-line">
                          {getSafeText(kit.toneOfVoice)}
                      </p>

                      <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-bold text-[#bf8339]">{isAr ? 'البايو المقترح (Bio)' : 'Suggested Bio'}</h3>
                          <CopyButton text={getSafeText(kit.socialBio)} />
                      </div>
                      <div className="bg-black/20 p-3 rounded text-sm font-mono whitespace-pre-line">
                          {getSafeText(kit.socialBio)}
                      </div>
                  </div>
                  
                  <div>
                       <h3 className="text-lg font-bold text-[#bf8339] mb-3">{isAr ? 'لوحة الألوان (Color Palette)' : 'Color Palette'}</h3>
                       <div className="space-y-2 mb-6">
                           {Array.isArray(kit.colors) && kit.colors.map((c, i) => (
                               <div key={i} className="flex items-center gap-3 bg-white/5 p-2 rounded">
                                   <div className="w-12 h-12 rounded-lg shadow-lg border border-white/10" style={{backgroundColor: c.hex}}></div>
                                   <div className="flex-1">
                                       <p className="font-bold text-sm">{getSafeText(c.name)}</p>
                                       <p className="text-xs text-white/50">{getSafeText(c.hex)}</p>
                                   </div>
                                   <CopyButton text={c.hex} label={c.hex} />
                               </div>
                           ))}
                       </div>

                       <div className="flex justify-between items-center mb-3">
                           <h3 className="text-lg font-bold text-[#bf8339]">{isAr ? 'الخطوط المقترحة' : 'Typography'}</h3>
                           <CopyButton text={getSafeText(kit.fontPairing)} />
                       </div>
                       <p className="text-white/80 border-r-4 border-[#bf8339] pr-3 bg-black/20 p-3 rounded whitespace-pre-line">
                           {getSafeText(kit.fontPairing)}
                       </p>
                  </div>
              </div>
          </div>
      )}

      {/* --- LOGO STUDIO SECTION --- */}
      <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-6 shadow-lg mt-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
              <div className="bg-[#bf8339]/20 p-2 rounded-lg">
                  <ImageIcon className="w-6 h-6 text-[#bf8339]" />
              </div>
              <div>
                  <h3 className="text-xl font-bold text-white">{isAr ? 'استوديو الشعارات (Logo Studio)' : 'Logo Studio'}</h3>
                  <p className="text-xs text-white/60">{isAr ? 'حوّل هوية علامتك التجارية إلى شعار مرئي.' : 'Visualize your brand identity into a logo.'}</p>
              </div>
          </div>

          <div className="space-y-4">
              <div>
                  <div className="flex justify-between items-center mb-2">
                       <label className="text-sm text-white/80">{isAr ? 'وصف الشعار (Prompt)' : 'Logo Prompt'}</label>
                       <Button 
                           variant="secondary" 
                           onClick={handleSuggestLogoPrompt} 
                           isLoading={isSuggestingLogo} 
                           className="!py-1 !px-3 !text-xs flex items-center gap-2"
                        >
                           <MagicWandIcon className="w-3 h-3" /> {isAr ? 'اقتراح وصف للشعار' : 'Suggest Prompt'}
                       </Button>
                  </div>
                  <textarea 
                      className="w-full bg-black/20 border border-white/20 rounded-lg p-3 text-white h-24 focus:border-[#bf8339]"
                      placeholder={isAr ? "اكتب وصفاً للشعار أو اضغط على اقتراح..." : "Describe the logo or click suggest..."}
                      value={logoPrompt}
                      onChange={e => setLogoPrompt(e.target.value)}
                  />
                  <p className="text-[10px] text-white/40 mt-1">
                      {isAr ? 'ملاحظة: سيتم توليد الرمز فقط عبر الذكاء الاصطناعي، وستتم إضافة النص العربي الصحيح برمجياً لضمان الدقة.' : 'Note: AI generates the icon; text is applied programmatically to ensure correct Arabic rendering.'}
                  </p>
              </div>
              
              <Button onClick={handleGenerateLogos} isLoading={isGeneratingLogos} className="w-full py-3 shadow-lg shadow-[#bf8339]/10">
                  {isAr ? 'توليد 3 أفكار للشعار' : 'Generate 3 Logo Concepts'}
              </Button>
          </div>

          {processedLogos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 animate-fade-in">
                  {processedLogos.map((img, idx) => (
                      <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10 text-center group hover:border-[#bf8339] transition">
                          <p className="text-xs text-white/40 mb-2 text-left">{isAr ? 'فكرة' : 'Concept'} {idx + 1}</p>
                          <div className="bg-white rounded-lg overflow-hidden mb-4 shadow-inner">
                              <img src={img} alt={`Logo Concept ${idx + 1}`} className="w-full aspect-square object-contain p-2" />
                          </div>
                          <a 
                              href={img} 
                              download={`logo-concept-${idx+1}.jpg`} 
                              className="inline-block w-full bg-[#bf8339]/10 text-[#bf8339] border border-[#bf8339]/30 py-2 rounded-lg text-sm font-bold hover:bg-[#bf8339] hover:text-white transition"
                          >
                              {isAr ? 'تحميل الشعار' : 'Download Logo'}
                          </a>
                      </div>
                  ))}
              </div>
          )}
          
          {processedLogos.length > 0 && !isGeneratingLogos && (
              <div className="text-center mt-6">
                  <Button variant="secondary" onClick={handleGenerateLogos} className="text-sm">
                      {isAr ? 'توليد أفكار أخرى ↻' : 'Generate More ↻'}
                  </Button>
              </div>
          )}
      </div>
    </div>
  );
};

export default BrandKitView;
