
import React, { useState, useContext, useRef, useMemo, useEffect } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import Button from '../Button';
import { Loader, ImageIcon, TrashIcon, AdjustmentsHorizontalIcon, FingerPrintIcon, BlenderIcon, SparklesIcon, ArrowsRightLeftIcon, PhotoIcon, MagicWandIcon, SwatchIcon, EyeIcon } from '../Icons';
import * as geminiService from '../../services/geminiService';
import { setItem, getItem, removeItem } from '../../utils/localStorage';
import { IMAGE_MODELS, UNIFIED_IMAGE_STYLES, ARCHIVE_STORAGE_KEY, UI_TRANSLATIONS, ASPECT_RATIOS_GROUPED, CAMERA_ANGLES, LIGHTING_STYLES, PRODUCT_SCENES_GROUPED } from '../../constants';
import CustomGroupedSelect from '../CustomGroupedSelect';
import ImageBlenderView from './ImageBlenderView';
import CopyButton from '../CopyButton';
import ExportMenu from '../ExportMenu';
import { ArchivedItem } from '../../types';

type SubTab = 'create' | 'enhance' | 'smart_edit' | 'color' | 'blend';
type EnhancementMode = 'General' | 'Deblur' | 'Restore';

const AIImagesView: React.FC = () => {
  const { topic, appLanguage, theme } = useContext(ProjectContext);
  const isAr = appLanguage === 'ar';
  const t = UI_TRANSLATIONS;
  const isComfort = theme === 'comfort';
  
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('create');

  // --- CREATION STATE ---
  const [creationTopic, setCreationTopic] = useState(topic);
  const savedSettings = getItem<{ imageModel: string; aspectRatio: string; style: string }>('aiImagesSettings');
  const [aspectRatio, setAspectRatio] = useState(savedSettings?.aspectRatio || '1:1');
  const [style, setStyle] = useState(savedSettings?.style || UNIFIED_IMAGE_STYLES?.[0]?.options[0]?.value);
  const [cameraAngle, setCameraAngle] = useState('');
  const [lighting, setLighting] = useState('');
  const [productScene, setProductScene] = useState('');
  const [isHD, setIsHD] = useState(false); // Quality toggle
  
  // Prompt Generator
  const [promptVariations, setPromptVariations] = useState<string[]>([]);
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);

  const [referenceImages, setReferenceImages] = useState<{ id: string, data: string, mimeType: string }[]>([]);
  const referenceFileRef = useRef<HTMLInputElement>(null);
  
  // --- EDITING STATES ---
  const [currentImage, setCurrentImage] = useState<string | null>(null); // Main image being worked on
  const [originalImage, setOriginalImage] = useState<string | null>(null); // For compare
  const [detectedRatio, setDetectedRatio] = useState<string>('1:1'); // Aspect Ratio Detection for Edits

  const [enhancementMode, setEnhancementMode] = useState<EnhancementMode>('General');
  const [enhanceLevel, setEnhanceLevel] = useState('Medium');
  const [editPrompt, setEditPrompt] = useState('');
  const [filters, setFilters] = useState({ brightness: 100, contrast: 100, saturate: 100, hue: 0, blur: 0, sepia: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Compare Slider State
  const [compareSlider, setCompareSlider] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const compareContainerRef = useRef<HTMLDivElement>(null);

  const uploadFileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check for restored draft
  useEffect(() => {
      const draft = getItem<ArchivedItem>('editDraft');
      if (draft && draft.type === 'Image') {
          setCurrentImage(draft.content);
          setOriginalImage(draft.content);
          removeItem('editDraft');
      }
  }, []);

  // Group Memos
  const styleGroups = useMemo(() => UNIFIED_IMAGE_STYLES.map(g => ({
      label: isAr ? g.label.ar : g.label.en,
      options: g.options.map(o => ({ label: isAr ? o.label.ar : o.label.en, value: o.value }))
  })), [isAr]);

  const aspectRatioGroups = useMemo(() => ASPECT_RATIOS_GROUPED.map(g => ({
        label: isAr ? g.label.ar : g.label.en,
        options: g.options.map(o => ({ 
            label: isAr ? o.label.ar : o.label.en, 
            value: o.value,
            description: o.desc 
        }))
  })), [isAr]);

  const productSceneGroups = useMemo(() => PRODUCT_SCENES_GROUPED.map(g => ({
      label: isAr ? g.label.ar : g.label.en,
      options: g.options.map(o => ({
          label: `${o.icon} ${isAr ? o.label.ar : o.label.en}`,
          value: o.value
      }))
  })), [isAr]);

  // Helper for ratio detection - Snaps to supported API ratios
  const getClosestAspectRatio = (width: number, height: number): string => {
    const ratio = width / height;
    const supported = [
        { r: 1, val: '1:1' },
        { r: 0.75, val: '3:4' },
        { r: 1.333, val: '4:3' },
        { r: 0.5625, val: '9:16' },
        { r: 1.777, val: '16:9' }
    ];
    // Find closest
    let closest = supported[0];
    let minDiff = Math.abs(ratio - closest.r);
    for (let i = 1; i < supported.length; i++) {
        const diff = Math.abs(ratio - supported[i].r);
        if (diff < minDiff) {
            minDiff = diff;
            closest = supported[i];
        }
    }
    return closest.val;
  };

  // --- HANDLERS ---

  const handleGlobalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
          const res = reader.result as string;
          setCurrentImage(res);
          setOriginalImage(res); // Set base
          
          // Auto Detect Aspect Ratio strictly for API compatibility
          const img = new Image();
          img.src = res;
          img.onload = () => {
              const r = getClosestAspectRatio(img.width, img.height);
              setDetectedRatio(r);
          };

          // Reset filters
          setFilters({ brightness: 100, contrast: 100, saturate: 100, hue: 0, blur: 0, sepia: 0 });
      };
      reader.readAsDataURL(file);
  };

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (referenceImages.length >= 10) return alert(isAr ? "الحد الأقصى 10 صور" : "Max 10 images");
      const reader = new FileReader();
      reader.onloadend = () => {
          setReferenceImages([...referenceImages, { id: Date.now().toString(), data: (reader.result as string).split(',')[1], mimeType: file.type }]);
          if(referenceFileRef.current) referenceFileRef.current.value = '';
      };
      reader.readAsDataURL(file);
  };

  const removeReference = (id: string) => {
      setReferenceImages(prev => prev.filter(img => img.id !== id));
  };

  const handleGeneratePrompts = async () => {
      if (!creationTopic) return alert(isAr ? "يرجى كتابة فكرة أولاً لتوليد المقترحات" : "Please enter a concept first to generate suggestions");
      setIsGeneratingPrompts(true);
      try {
          const variations = await geminiService.generateImagePromptVariations(creationTopic);
          setPromptVariations(variations);
      } catch(e) {
          console.error(e);
      } finally {
          setIsGeneratingPrompts(false);
      }
  };

  const handleGenerate = async () => {
      setError(null);
      // Allow generation if text exists OR if visual inputs (Ref Image / Scene) are present
      const hasText = creationTopic && creationTopic.trim().length > 0;
      const hasVisuals = referenceImages.length > 0 || !!productScene || !!cameraAngle || !!lighting;

      if (!hasText && !hasVisuals) {
          return alert(isAr ? "يرجى كتابة وصف أو رفع صورة مرجعية أو اختيار إعدادات بصرية" : "Please enter a prompt, upload a reference image, or select visual settings.");
      }

      setIsLoading(true);
      setCurrentImage(null);
      
      try {
          // KEY CHECK FOR PRO/HD MODEL
          if (isHD && (window as any).aistudio) {
              try {
                 const hasKey = await (window as any).aistudio.hasSelectedApiKey();
                 if (!hasKey) {
                     await (window as any).aistudio.openSelectKey();
                 }
              } catch (e) {
                  console.warn("AI Studio Key Check failed", e);
              }
          }

          const modelName = isHD ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

          // Determine Effective Prompt
          let effectivePrompt = creationTopic;
          if (!hasText) {
              // Automatically construct prompt if user didn't type one but has visual inputs
              if (referenceImages.length > 0) {
                  effectivePrompt = "A high-quality visual representation based on the provided reference image";
              } else if (productScene) {
                  effectivePrompt = `Professional product photography in a ${productScene} environment`;
              } else {
                  effectivePrompt = "High quality professional photography";
              }
          }

          const base64 = await geminiService.generateImage(
              effectivePrompt, 
              modelName, 
              aspectRatio, 
              style, 
              referenceImages.map(i => ({data: i.data, mimeType: i.mimeType})),
              undefined,
              isHD, // Activate Realism/HD enhancers
              { 
                  angle: cameraAngle || undefined, 
                  lighting: lighting || undefined, 
                  scene: productScene || undefined
              }
          );
          const fullImg = `data:image/jpeg;base64,${base64}`;
          setCurrentImage(fullImg);
          setOriginalImage(fullImg);
          
          const archive = getItem(ARCHIVE_STORAGE_KEY, []);
          archive.unshift({ id: Date.now().toString(), type: 'Image', content: fullImg, timestamp: new Date().toISOString() });
          setItem(ARCHIVE_STORAGE_KEY, archive);

      } catch (e: any) { 
          if (e.message?.includes("Requested entity was not found") && (window as any).aistudio) {
              await (window as any).aistudio.openSelectKey();
          }
          setError(e.message);
      } finally { setIsLoading(false); }
  };

  const executeEnhance = async () => {
      if(!currentImage) return;
      setIsLoading(true);
      setError(null);
      try {
          // Pass the specific enhancement type
          const res = await geminiService.enhanceImage(currentImage.split(',')[1], 'image/jpeg', enhancementMode, enhanceLevel, detectedRatio);
          setCurrentImage(`data:image/jpeg;base64,${res}`);
      } catch(e: any) { setError(e.message); } finally { setIsLoading(false); }
  };

  const executeSmartEdit = async () => {
      if(!currentImage || !editPrompt) return;
      setIsLoading(true);
      setError(null);
      try {
          // Pass the detected aspect ratio
          const res = await geminiService.smartEditImage(currentImage.split(',')[1], 'image/jpeg', editPrompt, detectedRatio);
          setCurrentImage(`data:image/jpeg;base64,${res}`);
          setEditPrompt('');
      } catch(e: any) { setError(e.message); } finally { setIsLoading(false); }
  };

  const applyAutoColor = async () => {
      if(!currentImage) return;
      setIsLoading(true);
      try {
          const settings = await geminiService.analyzeForFilters(currentImage.split(',')[1], 'image/jpeg');
          setFilters(prev => ({ ...prev, ...settings }));
      } catch(e) { console.error(e); } finally { setIsLoading(false); }
  };

  const getFilterString = () => `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) hue-rotate(${filters.hue}deg) blur(${filters.blur}px) sepia(${filters.sepia}%)`;

  const handleRetry = () => {
      if (activeSubTab === 'create') {
          handleGenerate();
      } else if (originalImage) {
          // For editing modes, "Try Again" essentially means revert to original
          setCurrentImage(originalImage);
          if (activeSubTab === 'color') {
              setFilters({ brightness: 100, contrast: 100, saturate: 100, hue: 0, blur: 0, sepia: 0 });
          }
      }
  };

  // Compare Slider Interaction
  const handleSliderMove = (e: any) => {
      if (!isDraggingSlider || !compareContainerRef.current) return;
      const rect = compareContainerRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setCompareSlider(percentage);
  };

  useEffect(() => {
      const stopDrag = () => setIsDraggingSlider(false);
      window.addEventListener('mouseup', stopDrag);
      window.addEventListener('touchend', stopDrag);
      window.addEventListener('mousemove', handleSliderMove);
      window.addEventListener('touchmove', handleSliderMove);
      return () => {
          window.removeEventListener('mouseup', stopDrag);
          window.removeEventListener('touchend', stopDrag);
          window.removeEventListener('mousemove', handleSliderMove);
          window.removeEventListener('touchmove', handleSliderMove);
      };
  }, [isDraggingSlider]);

  // Determine Comparison Images based on active tab
  const getComparisonImages = () => {
      if (activeSubTab === 'color') {
          return {
              beforeSrc: currentImage,
              beforeStyle: { filter: 'none' },
              afterSrc: currentImage,
              afterStyle: { filter: getFilterString() }
          };
      } else {
          return {
              beforeSrc: originalImage,
              beforeStyle: {},
              afterSrc: currentImage,
              afterStyle: {}
          };
      }
  };

  const { beforeSrc, beforeStyle, afterSrc, afterStyle } = getComparisonImages();
  const showCompare = ['enhance', 'smart_edit', 'color'].includes(activeSubTab) && currentImage && (activeSubTab === 'color' ? true : originalImage);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-4 gap-4">
            <div>
                <h2 className="text-3xl font-bold text-[#bf8339] flex items-center gap-2">
                    <PhotoIcon className="w-8 h-8" /> {isAr ? 'استوديو الصور الاحترافي' : 'Image Studio Pro'}
                </h2>
                <p className="text-white/60 mt-1">{isAr ? 'منصة الإنتاج البصري المتكاملة' : 'Integrated Visual Production Platform'}</p>
            </div>
            {/* Tabs */}
            <div className={`flex flex-wrap justify-center md:justify-end gap-2 p-1 rounded-xl ${isComfort ? 'bg-[#D7CCC8]/30' : 'bg-[#0a1e3c]'}`}>
                {[
                    { id: 'create', label: t.tabCreate[appLanguage], icon: <ImageIcon className="w-4 h-4"/> },
                    { id: 'enhance', label: t.tabEnhance[appLanguage], icon: <FingerPrintIcon className="w-4 h-4"/> },
                    { id: 'smart_edit', label: t.tabSmartEdit[appLanguage], icon: <MagicWandIcon className="w-4 h-4"/> },
                    { id: 'color', label: t.tabColor[appLanguage], icon: <AdjustmentsHorizontalIcon className="w-4 h-4"/> },
                    { id: 'blend', label: t.tabBlend[appLanguage], icon: <BlenderIcon className="w-4 h-4"/> }
                ].map((tab) => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id as SubTab)} 
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-bold flex-grow md:flex-grow-0 justify-center ${
                            activeSubTab === tab.id 
                            ? 'bg-[#bf8339] text-[#0a1e3c] shadow-lg' 
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        {activeSubTab === 'blend' ? (
            /* FULL WIDTH LAYOUT FOR BLEND */
            <div className="animate-slide-up">
                <ImageBlenderView />
            </div>
        ) : (
            /* SPLIT LAYOUT FOR OTHER TABS */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT PANEL: CONTROLS */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* 1. CREATE CONTROLS */}
                    {activeSubTab === 'create' && (
                        <div className="space-y-4">
                            {/* 1.1 Prompt Area & Generator */}
                            <div className="relative">
                                <textarea 
                                    value={creationTopic} 
                                    onChange={e => setCreationTopic(e.target.value)} 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 h-32 focus:border-[#bf8339] text-white placeholder-white/30 text-sm" 
                                    placeholder={isAr ? "صف الصورة... (اختياري في حال رفع صورة مرجعية أو اختيار بيئة)" : "Describe the image... (Optional if using reference/scene)"} 
                                />
                                {/* Magic Button: Only active if text is present */}
                                {creationTopic && (
                                    <div className="absolute bottom-3 right-3 flex gap-2">
                                        <button 
                                            onClick={handleGeneratePrompts}
                                            disabled={isGeneratingPrompts}
                                            className="bg-white/10 hover:bg-[#bf8339] text-white p-2 rounded-lg transition flex items-center gap-2 text-xs backdrop-blur-md"
                                            title={isAr ? "توليد وصف احترافي" : "Generate Prompts"}
                                        >
                                            {isGeneratingPrompts ? <Loader /> : <SparklesIcon className="w-4 h-4" />}
                                            {isAr ? 'تحسين' : 'Magic'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Generated Prompts List */}
                            {promptVariations.length > 0 && (
                                <div className="bg-[#0a1e3c]/80 border border-[#bf8339]/30 rounded-xl p-3 animate-fade-in">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-[#bf8339] font-bold">{isAr ? 'مقترحات الذكاء الاصطناعي' : 'AI Suggestions'}</span>
                                        <button onClick={() => setPromptVariations([])} className="text-white/40 hover:text-white">×</button>
                                    </div>
                                    <div className="space-y-2">
                                        {promptVariations.map((p, idx) => (
                                            <div key={idx} className="text-[10px] bg-white/5 p-2 rounded border border-white/5 flex gap-2 items-start group">
                                                <p className="flex-1 text-white/80 line-clamp-2 hover:line-clamp-none transition-all cursor-pointer" onClick={() => setCreationTopic(p)}>{p}</p>
                                                <CopyButton text={p} className="opacity-0 group-hover:opacity-100" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reference Image */}
                            <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-[#bf8339] font-bold text-xs uppercase tracking-widest">{isAr ? 'صور مرجعية' : 'Reference Images'}</h3>
                                    <span className="text-[10px] text-white/50">{referenceImages.length}/10</span>
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                    {referenceImages.map((ref) => (
                                        <div key={ref.id} className="aspect-square relative group">
                                            <img src={`data:${ref.mimeType};base64,${ref.data}`} className="w-full h-full object-cover rounded border border-white/10" />
                                            <button onClick={() => removeReference(ref.id)} className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs shadow-md">×</button>
                                        </div>
                                    ))}
                                    {referenceImages.length < 10 && (
                                        <div onClick={() => referenceFileRef.current?.click()} className="aspect-square border-2 border-dashed border-white/20 rounded flex items-center justify-center cursor-pointer hover:border-[#bf8339] text-white/30 hover:text-[#bf8339] text-xl transition">+</div>
                                    )}
                                </div>
                                <input type="file" ref={referenceFileRef} onChange={handleReferenceUpload} className="hidden" accept="image/*" />
                            </div>

                            <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg">
                                <h3 className="text-[#bf8339] font-bold mb-4 text-xs uppercase tracking-widest">{isAr ? 'إعدادات التوليد' : 'Generation Settings'}</h3>
                                <div className="space-y-3">
                                    {/* Quality Toggle */}
                                    <div className="flex bg-white/5 rounded-lg p-1">
                                        <button 
                                            onClick={() => setIsHD(false)} 
                                            className={`flex-1 py-1.5 rounded text-xs font-bold transition ${!isHD ? 'bg-[#bf8339] text-[#0a1e3c]' : 'text-white/60 hover:text-white'}`}
                                        >
                                            {isAr ? 'قياسي (سريع)' : 'Standard (Fast)'}
                                        </button>
                                        <button 
                                            onClick={() => setIsHD(true)} 
                                            className={`flex-1 py-1.5 rounded text-xs font-bold transition ${isHD ? 'bg-[#bf8339] text-[#0a1e3c]' : 'text-white/60 hover:text-white'}`}
                                        >
                                            {isAr ? 'دقة عالية (2K HD)' : 'Pro HD (2K)'}
                                        </button>
                                    </div>
                                    <CustomGroupedSelect label={isAr ? "الأبعاد" : "Aspect Ratio"} value={aspectRatio} onChange={setAspectRatio} groups={aspectRatioGroups} placeholder="Select Ratio" />
                                    <CustomGroupedSelect label={isAr ? "النمط الفني" : "Art Style"} value={style} onChange={setStyle} groups={styleGroups} placeholder="Select Style" />
                                </div>
                            </div>

                            {/* Visual Presets */}
                            <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg">
                                <h3 className="text-[#bf8339] font-bold mb-4 text-xs uppercase tracking-widest flex justify-between">
                                    {isAr ? 'الإخراج البصري' : 'Visual Output'}
                                    <span className="text-[9px] text-white/40 font-normal">{isAr ? 'اضغط للإلغاء' : 'Click to deselect'}</span>
                                </h3>
                                
                                {/* Angles Grid */}
                                <div className="mb-4">
                                    <label className="text-[10px] text-white/50 block mb-2">{isAr ? 'زاوية التصوير' : 'Camera Angle'}</label>
                                    <div className="flex flex-wrap gap-2">
                                        {CAMERA_ANGLES.map((a, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => setCameraAngle(prev => prev === a.value ? '' : a.value)} 
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition flex items-center gap-1.5 ${cameraAngle === a.value ? 'bg-[#bf8339] border-[#bf8339] text-[#0a1e3c]' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30'}`}
                                            >
                                                <span>{a.icon}</span>
                                                <span>{isAr ? a.label.ar : a.label.en}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Lighting Grid */}
                                <div className="mb-4">
                                    <label className="text-[10px] text-white/50 block mb-2">{isAr ? 'الإضاءة' : 'Lighting'}</label>
                                    <div className="flex flex-wrap gap-2">
                                        {LIGHTING_STYLES.map((l, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => setLighting(prev => prev === l.value ? '' : l.value)} 
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition flex items-center gap-1.5 ${lighting === l.value ? 'bg-[#bf8339] border-[#bf8339] text-[#0a1e3c]' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30'}`}
                                            >
                                                <span>{l.icon}</span>
                                                <span>{isAr ? l.label.ar : l.label.en}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Scenes */}
                                <div>
                                    <CustomGroupedSelect
                                        label={isAr ? 'بيئة عرض المنتج (Product Scene)' : 'Product Scene Library'}
                                        value={productScene}
                                        onChange={setProductScene}
                                        groups={productSceneGroups}
                                        placeholder={isAr ? "اختر المشهد..." : "Select Scene..."}
                                    />
                                </div>
                            </div>
                            
                            <Button onClick={handleGenerate} isLoading={isLoading} className="w-full py-3 shadow-lg shadow-[#bf8339]/20">
                                {isAr ? (isHD ? 'توليد بجودة عالية (Pro)' : 'توليد الصورة') : (isHD ? 'Generate HD (Pro)' : 'Generate Image')}
                            </Button>
                        </div>
                    )}

                    {/* 2. ENHANCE CONTROLS */}
                    {activeSubTab === 'enhance' && (
                        <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg h-fit">
                            <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-[#bf8339] mb-6" onClick={() => uploadFileRef.current?.click()}>
                                <FingerPrintIcon className="w-8 h-8 text-white/30 mx-auto mb-2" />
                                <p className="text-xs text-white/50">{isAr ? 'رفع صورة للتحسين' : 'Upload to Enhance'}</p>
                                <input type="file" ref={uploadFileRef} onChange={handleGlobalUpload} className="hidden" />
                            </div>
                            
                            {/* Auto-detected ratio display */}
                            {currentImage && (
                                <div className="mb-4 text-center">
                                    <span className="text-[10px] text-white/40 bg-white/5 px-2 py-1 rounded">
                                        {isAr ? `الأبعاد المكتشفة: ${detectedRatio}` : `Detected Ratio: ${detectedRatio}`}
                                    </span>
                                </div>
                            )}

                            {/* Enhancement Mode Selection */}
                            <div className="mb-4 space-y-2">
                                <label className="text-xs text-white/60">{isAr ? 'نوع التحسين' : 'Enhancement Mode'}</label>
                                <div className="grid grid-cols-1 gap-2">
                                    <button 
                                        onClick={() => setEnhancementMode('General')} 
                                        className={`p-3 rounded-lg flex items-center gap-3 transition border ${enhancementMode === 'General' ? 'bg-[#bf8339] border-[#bf8339] text-[#0a1e3c]' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
                                    >
                                        <SparklesIcon className="w-5 h-5" />
                                        <div className="text-left">
                                            <div className="text-sm font-bold">{t.enhanceModeGeneral[appLanguage]}</div>
                                        </div>
                                    </button>
                                    <button 
                                        onClick={() => setEnhancementMode('Deblur')} 
                                        className={`p-3 rounded-lg flex items-center gap-3 transition border ${enhancementMode === 'Deblur' ? 'bg-[#bf8339] border-[#bf8339] text-[#0a1e3c]' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
                                    >
                                        <EyeIcon className="w-5 h-5" />
                                        <div className="text-left">
                                            <div className="text-sm font-bold">{t.enhanceModeDeblur[appLanguage]}</div>
                                        </div>
                                    </button>
                                    <button 
                                        onClick={() => setEnhancementMode('Restore')} 
                                        className={`p-3 rounded-lg flex items-center gap-3 transition border ${enhancementMode === 'Restore' ? 'bg-[#bf8339] border-[#bf8339] text-[#0a1e3c]' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
                                    >
                                        <MagicWandIcon className="w-5 h-5" />
                                        <div className="text-left">
                                            <div className="text-sm font-bold">{t.enhanceModeRestore[appLanguage]}</div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {enhancementMode === 'General' && (
                                <div className="flex bg-black/20 p-1 rounded-lg mb-6">
                                    {['Soft', 'Medium', 'Strong'].map((lvl) => (
                                        <button key={lvl} onClick={() => setEnhanceLevel(lvl)} className={`flex-1 py-2 rounded text-xs font-bold transition ${enhanceLevel === lvl ? 'bg-[#bf8339] text-[#0a1e3c]' : 'text-white/50'}`}>{lvl}</button>
                                    ))}
                                </div>
                            )}

                            <Button onClick={executeEnhance} isLoading={isLoading} disabled={!currentImage} className="w-full">
                                {isAr ? 'بدء المعالجة' : 'Start Processing'}
                            </Button>
                        </div>
                    )}

                    {/* 3. SMART EDIT CONTROLS */}
                    {activeSubTab === 'smart_edit' && (
                        <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg h-fit">
                            <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-[#bf8339] mb-4" onClick={() => uploadFileRef.current?.click()}>
                                {currentImage ? <img src={currentImage} className="h-16 mx-auto rounded object-cover" /> : <p className="text-xs text-white/50">{isAr ? 'رفع صورة' : 'Upload'}</p>}
                                <input type="file" ref={uploadFileRef} onChange={handleGlobalUpload} className="hidden" />
                            </div>
                            
                            {currentImage && (
                                <div className="mb-4 text-center">
                                    <span className="text-[10px] text-white/40 bg-white/5 px-2 py-1 rounded">
                                        {isAr ? `الأبعاد المكتشفة: ${detectedRatio}` : `Detected Ratio: ${detectedRatio}`}
                                    </span>
                                </div>
                            )}

                            <textarea value={editPrompt} onChange={e => setEditPrompt(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 h-24 text-sm text-white mb-4 placeholder-white/30" placeholder={isAr ? "مثال: غير الخلفية إلى أحمر..." : "e.g., Change background to red..."} />
                            <Button onClick={executeSmartEdit} isLoading={isLoading} disabled={!currentImage} className="w-full">{isAr ? 'تطبيق التعديل' : 'Apply Edit'}</Button>
                        </div>
                    )}

                    {/* 4. COLOR CONTROLS */}
                    {activeSubTab === 'color' && (
                        <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg h-fit">
                            <div className="space-y-4 mb-6">
                                {['brightness', 'contrast', 'saturate', 'sepia', 'blur'].map(k => (
                                    <div key={k}>
                                        <div className="flex justify-between text-xs text-white/70 mb-1">
                                            <span className="capitalize">{k}</span>
                                            <span>{(filters as any)[k]}</span>
                                        </div>
                                        <input type="range" min="0" max={k === 'blur' ? 10 : 200} value={(filters as any)[k]} onChange={e => setFilters({...filters, [k]: Number(e.target.value)})} className="w-full accent-[#bf8339]" />
                                    </div>
                                ))}
                            </div>
                            <Button onClick={applyAutoColor} isLoading={isLoading} variant="secondary" className="w-full mb-2 text-xs"><SparklesIcon className="w-3 h-3 mr-1"/> {isAr ? 'تصحيح تلقائي' : 'Auto Fix'}</Button>
                        </div>
                    )}
                </div>

                {/* RIGHT PANEL: PREVIEW & EXPORT */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Canvas / Preview */}
                    <div className="bg-black/40 rounded-xl border border-white/10 flex items-center justify-center p-6 min-h-[500px] relative group overflow-hidden">
                        {showCompare && afterSrc ? (
                            /* BEFORE / AFTER COMPARE SLIDER */
                            <div 
                                ref={compareContainerRef} 
                                className="relative max-w-full max-h-[600px] cursor-col-resize select-none shadow-2xl rounded-lg overflow-hidden"
                                onMouseDown={() => setIsDraggingSlider(true)}
                                onTouchStart={() => setIsDraggingSlider(true)}
                            >
                                {/* After Image (Right/Bottom) */}
                                <img src={afterSrc} className="max-w-full max-h-[600px] block" style={afterStyle} alt="After" />
                                
                                {/* Before Image (Left/Top Overlay) */}
                                <div 
                                    className="absolute top-0 left-0 bottom-0 overflow-hidden border-r-2 border-white shadow-[2px_0_10px_rgba(0,0,0,0.5)] bg-black/10"
                                    style={{ width: `${compareSlider}%` }}
                                >
                                    <img 
                                        src={beforeSrc || afterSrc} 
                                        className="max-w-none h-full" 
                                        style={{ width: compareContainerRef.current?.getBoundingClientRect().width, ...beforeStyle }} 
                                        alt="Before" 
                                    />
                                </div>
                                
                                <div className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg -ml-4 z-10" style={{ left: `${compareSlider}%` }}>
                                    <ArrowsRightLeftIcon className="w-4 h-4 text-black" />
                                </div>
                                <div className="absolute top-4 left-4 bg-black/60 px-2 py-1 rounded text-xs text-white">{isAr ? 'قبل' : 'Before'}</div>
                                <div className="absolute top-4 right-4 bg-[#bf8339] px-2 py-1 rounded text-xs text-[#0a1e3c] font-bold">{isAr ? 'بعد' : 'After'}</div>
                            </div>
                        ) : (
                            currentImage ? (
                                <>
                                    <img 
                                        src={currentImage} 
                                        className="max-w-full max-h-[600px] rounded-lg shadow-2xl transition-all duration-200" 
                                        style={activeSubTab === 'color' ? { filter: getFilterString() } : {}}
                                    />
                                </>
                            ) : error ? (
                                <div className="text-center p-6 bg-red-500/10 border border-red-500/50 rounded-xl max-w-md mx-auto animate-fade-in">
                                    <div className="text-4xl mb-4">🚫</div>
                                    <p className="text-red-400 font-bold mb-2">{isAr ? 'عذراً' : 'Error'}</p>
                                    <p className="text-white/80 text-sm">{error}</p>
                                </div>
                            ) : (
                                <div className="text-center text-white/30">
                                    <PhotoIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>{isAr ? 'منطقة المعاينة' : 'Preview Area'}</p>
                                </div>
                            )
                        )}
                        
                        {/* Hidden Canvas for Processing */}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    {/* Export Panel (Only if image exists and not in blend mode) */}
                    {currentImage && (
                        <div className="bg-[#0a1e3c]/80 backdrop-blur border border-[#bf8339]/30 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl animate-slide-up">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#bf8339]/20 p-2 rounded-lg"><PhotoIcon className="w-5 h-5 text-[#bf8339]" /></div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{isAr ? 'النتيجة النهائية' : 'Final Result'}</h4>
                                    <p className="text-[10px] text-white/50">{isAr ? 'تم المعالجة بنجاح' : 'Processed Successfully'}</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 justify-center">
                                {/* Export Button */}
                                <ExportMenu content={currentImage} type="image" filename={`ai-image-${Date.now()}`} label={isAr ? "تحميل الصورة" : "Download Image"} />

                                {/* Try Again Button */}
                                <button 
                                    onClick={handleRetry}
                                    className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-lg text-sm font-bold transition flex items-center gap-2"
                                >
                                    <ArrowsRightLeftIcon className="w-4 h-4" />
                                    {isAr ? 'محاولة أخرى' : 'Try Again'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default AIImagesView;
