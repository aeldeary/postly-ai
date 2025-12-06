
import React, { useState, useContext, useMemo, useRef, useEffect } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import Button from '../Button';
import { ImageIcon, SparklesIcon, BlenderIcon, TrashIcon, AdjustmentsIcon, ScaleIcon, RefreshIcon, ArrowsRightLeftIcon } from '../Icons';
import * as geminiService from '../../services/geminiService';
import { setItem, getItem } from '../../utils/localStorage';
import { ARCHIVE_STORAGE_KEY, ASPECT_RATIOS_GROUPED, UNIFIED_IMAGE_STYLES, CAMERA_ANGLES, LIGHTING_STYLES, PRODUCT_SCENES_GROUPED, UI_TRANSLATIONS } from '../../constants';
import CustomGroupedSelect from '../CustomGroupedSelect';
import ExportMenu from '../ExportMenu';
import ImageBlenderView from './ImageBlenderView';
import ImageCropperModal from '../ImageCropperModal';

type SubTab = 'create' | 'color' | 'upscale' | 'restore' | 'blend';

const AIImagesView: React.FC = () => {
    const { appLanguage, topic, updateProjectState } = useContext(ProjectContext);
    const isAr = appLanguage === 'ar';
    const t = UI_TRANSLATIONS;

    const [activeSubTab, setActiveSubTab] = useState<SubTab>('create');

    // Create Tab State
    const [prompt, setPrompt] = useState(topic || '');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [style, setStyle] = useState('Photorealistic');
    const [cameraAngle, setCameraAngle] = useState('');
    const [lighting, setLighting] = useState('');
    const [productScene, setProductScene] = useState('');
    const [isHD, setIsHD] = useState(false);
    
    // New Feature States
    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [sourceMime, setSourceMime] = useState('image/jpeg');
    const [resultImage, setResultImage] = useState<string | null>(null);
    
    // Color Correction State
    const [brightness, setBrightness] = useState(0);
    const [contrast, setContrast] = useState(0);
    const [saturation, setSaturation] = useState(0);
    const [colorPreset, setColorPreset] = useState('');
    
    // Upscale State
    const [upscaleLevel, setUpscaleLevel] = useState<'2x' | '4x' | '8x'>('4x');
    
    // Common State
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null); // For Create Tab

    // Compare Slider
    const [compareSlider, setCompareSlider] = useState(50);
    const [isDraggingSlider, setIsDraggingSlider] = useState(false);
    const compareContainerRef = useRef<HTMLDivElement>(null);

    // Reference Images State (Create Tab)
    const [referenceImages, setReferenceImages] = useState<{ id: string, data: string, mimeType: string }[]>([]);
    
    // Crop & Upload
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const referenceFileRef = useRef<HTMLInputElement>(null);
    const featureFileRef = useRef<HTMLInputElement>(null); // For Color, Upscale, Restore

    // Memos for Selects
    const styleGroups = useMemo(() => UNIFIED_IMAGE_STYLES.map(g => ({
        label: isAr ? g.label.ar : g.label.en,
        options: g.options.map(o => ({ label: isAr ? o.label.ar : o.label.en, value: o.value }))
    })), [isAr]);

    const aspectRatioGroups = useMemo(() => ASPECT_RATIOS_GROUPED.map(g => ({
        label: isAr ? g.label.ar : g.label.en,
        options: g.options.map(o => ({ label: isAr ? o.label.ar : o.label.en, value: o.value, description: o.description }))
    })), [isAr]);

    const cameraAngleGroups = useMemo(() => [{
        label: isAr ? 'زوايا التصوير' : 'Camera Angles',
        options: CAMERA_ANGLES.map(a => ({ label: `${a.icon} ${isAr ? a.label.ar : a.label.en}`, value: a.value }))
    }], [isAr]);

    const lightingGroups = useMemo(() => [{
        label: isAr ? 'أنماط الإضاءة' : 'Lighting Styles',
        options: LIGHTING_STYLES.map(l => ({ label: `${l.icon} ${isAr ? l.label.ar : l.label.en}`, value: l.value }))
    }], [isAr]);

    const productSceneGroups = useMemo(() => PRODUCT_SCENES_GROUPED.map(g => ({
        label: isAr ? g.label.ar : g.label.en,
        options: g.options.map(o => ({ label: isAr ? o.label.ar : o.label.en, value: o.value }))
    })), [isAr]);

    // Handle Upload for Features
    const handleFeatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            setSourceImage(`data:${file.type};base64,${base64}`);
            setSourceMime(file.type);
            setResultImage(null); // Reset result on new upload
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleGenerate = async () => {
        if (!prompt) return alert(isAr ? 'يرجى كتابة وصف للصورة' : 'Please enter a prompt');
        setIsLoading(true);
        setGeneratedImage(null);
        
        try {
            updateProjectState({ topic: prompt });
            const refs = referenceImages.length > 0 
                ? referenceImages.map(img => ({ data: img.data, mimeType: img.mimeType })) 
                : undefined;

            const result = await geminiService.generateImage(
                prompt,
                isHD ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image',
                aspectRatio,
                style,
                refs,
                undefined,
                isHD,
                { angle: cameraAngle, lighting, scene: productScene }
            );
            const fullImg = `data:image/jpeg;base64,${result}`;
            setGeneratedImage(fullImg);
            saveToArchive(fullImg);
        } catch (e: any) {
            alert(e.message || (isAr ? "فشل التوليد" : "Generation Failed"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleProcessImage = async () => {
        if (!sourceImage) return alert(isAr ? 'يرجى رفع صورة' : 'Please upload an image');
        setIsLoading(true);
        try {
            let instructions = "";
            let modelPrompt = "";

            const rawData = sourceImage.split(',')[1];

            if (activeSubTab === 'color') {
                instructions = `Color Correction Mode. Apply the following adjustments: Brightness: ${brightness > 0 ? '+' : ''}${brightness}%, Contrast: ${contrast > 0 ? '+' : ''}${contrast}%, Saturation: ${saturation > 0 ? '+' : ''}${saturation}%. `;
                if (colorPreset) instructions += `Apply preset style: ${colorPreset}. `;
                instructions += "Ensure natural, balanced lighting and white balance. Keep content identical.";
                modelPrompt = instructions;
            } 
            else if (activeSubTab === 'upscale') {
                instructions = `Upscale this image to ${upscaleLevel} resolution (simulated). Super resolution mode. Enhance micro-details, remove noise, sharpen edges while preserving facial features 100%. Quality: 8K Ultra-HD.`;
                modelPrompt = instructions;
            }
            else if (activeSubTab === 'restore') {
                modelPrompt = `Enhance the attached image to ultra-realistic quality with 1000% preservation of the original facial features, proportions, and expressions — identical to the reference face in every micro-detail.
Do not crop, cut, or remove anything from the frame. Maintain the exact composition, pose, body position, camera angle, lighting, and background.
Perform a full 8K Ultra-HD upscale with micro-texture enhancement (fine pores, realistic skin depth, hair strand definition, natural reflections).
Sharpen the eyes, lashes, and lips with perfect clarity while keeping skin texture natural — no plastic effect at all.
Balance highlights and shadows for true-to-life lighting, correct color tones with neutral white balance, and eliminate noise or compression artifacts.
Do not modify or replace any visual element. Only enhance realism, depth, and fine details.
The final image should look photographically perfect, extremely sharp yet natural, lifelike and clean — suitable for professional commercial use and close-up inspection.`;
            }

            // Using the editing service wrapper
            const res = await geminiService.processImageEdit(rawData, sourceMime, modelPrompt);
            const fullRes = `data:image/jpeg;base64,${res}`;
            setResultImage(fullRes);
            saveToArchive(fullRes);

        } catch (e: any) {
            alert(e.message || (isAr ? "فشل المعالجة" : "Processing Failed"));
        } finally {
            setIsLoading(false);
        }
    };

    const saveToArchive = (content: string) => {
        const archive = getItem(ARCHIVE_STORAGE_KEY, []);
        archive.unshift({ 
            id: Date.now().toString(), 
            type: activeSubTab === 'create' ? 'Image' : 'EditedImage', 
            content: content, 
            timestamp: new Date().toISOString() 
        });
        setItem(ARCHIVE_STORAGE_KEY, archive);
    };

    // --- Slider Logic ---
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

    // --- Helper Component for Comparison ---
    const CompareView = () => (
        <div className="bg-black/40 border border-[#bf8339]/30 rounded-2xl min-h-[500px] flex flex-col items-center justify-center p-6 relative group h-full">
            {resultImage ? (
                <>
                    <div 
                        ref={compareContainerRef} 
                        className="relative max-w-full cursor-col-resize select-none shadow-2xl rounded-lg overflow-hidden"
                        onMouseDown={() => setIsDraggingSlider(true)}
                        onTouchStart={() => setIsDraggingSlider(true)}
                        style={{ maxHeight: '600px' }}
                    >
                        {/* Result Image (Bottom Layer - Full) */}
                        <img src={resultImage} className="max-w-full max-h-[600px] block mx-auto" alt="Result" />
                        
                        {/* Source Image (Top Layer - Clipped) */}
                        <div 
                            className="absolute top-0 left-0 bottom-0 overflow-hidden border-r-2 border-white shadow-[2px_0_10px_rgba(0,0,0,0.5)] bg-black/10"
                            style={{ width: `${compareSlider}%` }}
                        >
                            <img 
                                src={sourceImage || ''} 
                                className="max-w-none h-full object-contain bg-black" 
                                style={{ width: compareContainerRef.current?.getBoundingClientRect().width }} 
                                alt="Original" 
                            />
                        </div>
                        
                        {/* Handle */}
                        <div 
                            className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg -ml-4 z-10" 
                            style={{ left: `${compareSlider}%` }}
                        >
                            <ArrowsRightLeftIcon className="w-4 h-4 text-black" />
                        </div>

                        {/* Labels */}
                        <div className="absolute top-4 left-4 bg-black/60 px-2 py-1 rounded text-xs text-white pointer-events-none">{isAr ? 'قبل' : 'Before'}</div>
                        <div className="absolute top-4 right-4 bg-[#bf8339] px-2 py-1 rounded text-xs text-[#0a1e3c] font-bold pointer-events-none">{isAr ? 'بعد' : 'After'}</div>
                    </div>
                    
                    <div className="mt-6 flex gap-4">
                        <ExportMenu content={resultImage} type="image" filename={`edited-${Date.now()}`} label={isAr ? "تحميل" : "Download"} />
                    </div>
                </>
            ) : sourceImage ? (
                <div className="relative max-h-[500px]">
                    <img src={sourceImage} className="max-h-[400px] rounded shadow-lg opacity-80" />
                    <p className="mt-4 text-center text-white/50 text-sm">{isAr ? 'اضغط زر المعالجة لبدء التحسين' : 'Click process to start'}</p>
                </div>
            ) : (
                <div 
                    onClick={() => featureFileRef.current?.click()}
                    className="text-center text-white/20 cursor-pointer hover:text-white/40 transition"
                >
                    <ImageIcon className="w-24 h-24 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">{isAr ? 'اضغط لرفع صورة' : 'Click to Upload Image'}</p>
                </div>
            )}
        </div>
    );

    // --- Sub-Components for Reference Image logic in Create tab ---
    const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (referenceImages.length >= 10) return alert(isAr ? "الحد الأقصى 10 صور" : "Max 10 images");
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => { setCropImageSrc(reader.result as string); };
        reader.readAsDataURL(file);
        e.target.value = '';
    };
    const handleCropConfirm = (croppedBase64: string) => {
        const base64Data = croppedBase64.split(',')[1];
        setReferenceImages([...referenceImages, { id: Date.now().toString(), data: base64Data, mimeType: 'image/jpeg' }]);
        setCropImageSrc(null);
    };
    const removeReferenceImage = (id: string) => {
        setReferenceImages(referenceImages.filter(img => img.id !== id));
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-4">
                <div>
                    <h2 className="text-3xl font-bold text-[#bf8339] flex items-center gap-2">
                        <ImageIcon className="w-8 h-8" /> 
                        {t.imageStudio[appLanguage]}
                    </h2>
                    <p className="text-white/60 mt-1">
                        {isAr ? 'منصة متكاملة لتوليد وتحرير ودمج الصور بالذكاء الاصطناعي.' : 'All-in-one platform for AI image generation, editing, and blending.'}
                    </p>
                </div>
                
                <div className="flex flex-wrap bg-[#0a1e3c] p-1 rounded-lg gap-1">
                    <button onClick={() => setActiveSubTab('create')} className={`flex items-center gap-2 px-4 py-2 rounded-md transition text-sm font-bold ${activeSubTab === 'create' ? 'bg-[#bf8339] text-[#0a1e3c]' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                        <SparklesIcon className="w-4 h-4"/> {t.tabCreate[appLanguage]}
                    </button>
                    <button onClick={() => setActiveSubTab('color')} className={`flex items-center gap-2 px-4 py-2 rounded-md transition text-sm font-bold ${activeSubTab === 'color' ? 'bg-[#bf8339] text-[#0a1e3c]' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                        <AdjustmentsIcon className="w-4 h-4"/> {t.tabColor[appLanguage]}
                    </button>
                    <button onClick={() => setActiveSubTab('upscale')} className={`flex items-center gap-2 px-4 py-2 rounded-md transition text-sm font-bold ${activeSubTab === 'upscale' ? 'bg-[#bf8339] text-[#0a1e3c]' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                        <ScaleIcon className="w-4 h-4"/> {t.tabUpscale[appLanguage]}
                    </button>
                    <button onClick={() => setActiveSubTab('restore')} className={`flex items-center gap-2 px-4 py-2 rounded-md transition text-sm font-bold ${activeSubTab === 'restore' ? 'bg-[#bf8339] text-[#0a1e3c]' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                        <RefreshIcon className="w-4 h-4"/> {t.tabRestore[appLanguage]}
                    </button>
                    <button onClick={() => setActiveSubTab('blend')} className={`flex items-center gap-2 px-4 py-2 rounded-md transition text-sm font-bold ${activeSubTab === 'blend' ? 'bg-[#bf8339] text-[#0a1e3c]' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                        <BlenderIcon className="w-4 h-4"/> {t.tabBlend[appLanguage]}
                    </button>
                </div>
            </div>

            {/* --- CREATE TAB --- */}
            {activeSubTab === 'create' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Controls */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg">
                            <textarea 
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-[#bf8339] h-24 text-sm mb-4 placeholder-white/30"
                                placeholder={isAr ? "صف الصورة التي تريد إنشاءها..." : "Describe the image you want to create..."}
                            />
                            <div className="space-y-4 mb-4">
                                <CustomGroupedSelect label={isAr ? "الأبعاد" : "Aspect Ratio"} value={aspectRatio} onChange={setAspectRatio} groups={aspectRatioGroups} placeholder="Select Ratio" />
                                <CustomGroupedSelect label={isAr ? "النمط" : "Style"} value={style} onChange={setStyle} groups={styleGroups} placeholder="Select Style" />
                            </div>
                            <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer border border-white/5 hover:border-[#bf8339]/30">
                                <span className="text-sm font-bold text-white flex items-center gap-2">
                                    <SparklesIcon className="w-4 h-4 text-[#bf8339]" />
                                    {isAr ? 'جودة عالية (HD Mode)' : 'HD Mode'}
                                </span>
                                <input type="checkbox" checked={isHD} onChange={e => setIsHD(e.target.checked)} className="accent-[#bf8339] w-5 h-5" />
                            </label>
                        </div>

                        {/* Reference Images */}
                        <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg">
                            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                                <h3 className="text-[#bf8339] font-bold text-sm">{isAr ? 'صور مرجعية (اختياري)' : 'Reference Images (Optional)'}</h3>
                                <span className="text-[10px] text-white/50">{referenceImages.length}/10</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {referenceImages.map((ref) => (
                                    <div key={ref.id} className="relative group aspect-square">
                                        <img src={`data:${ref.mimeType};base64,${ref.data}`} className="w-full h-full object-cover rounded border border-white/10" />
                                        <button onClick={() => removeReferenceImage(ref.id)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow-md z-10"><TrashIcon className="w-3 h-3 text-white" /></button>
                                    </div>
                                ))}
                                {referenceImages.length < 10 && (
                                    <div onClick={() => referenceFileRef.current?.click()} className="aspect-square border-2 border-dashed border-white/20 rounded flex items-center justify-center cursor-pointer hover:bg-white/5 hover:border-[#bf8339] text-xl text-white/30 hover:text-[#bf8339] transition">+</div>
                                )}
                            </div>
                            <input type="file" ref={referenceFileRef} onChange={handleReferenceUpload} className="hidden" accept="image/*" />
                        </div>

                        <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg">
                            <h3 className="text-[#bf8339] font-bold mb-4 text-xs uppercase tracking-widest">{isAr ? 'الإخراج البصري' : 'Visual Output'}</h3>
                            <div className="space-y-4">
                                <CustomGroupedSelect label={isAr ? 'زوايا التصوير' : 'Camera Angle'} value={cameraAngle} onChange={setCameraAngle} groups={cameraAngleGroups} placeholder={isAr ? "اختر الزاوية..." : "Select Angle..."} />
                                <CustomGroupedSelect label={isAr ? 'الإضاءة' : 'Lighting'} value={lighting} onChange={setLighting} groups={lightingGroups} placeholder={isAr ? "اختر الإضاءة..." : "Select Lighting..."} />
                                <CustomGroupedSelect label={isAr ? 'بيئة المنتج' : 'Product Scene'} value={productScene} onChange={setProductScene} groups={productSceneGroups} placeholder={isAr ? "اختر المشهد..." : "Select Scene..."} />
                            </div>
                        </div>
                        
                        <Button onClick={handleGenerate} isLoading={isLoading} className="w-full py-3 shadow-lg shadow-[#bf8339]/20">
                            {isAr ? (isHD ? 'توليد بجودة عالية (Pro)' : 'توليد الصورة') : (isHD ? 'Generate HD (Pro)' : 'Generate Image')}
                        </Button>
                    </div>

                    {/* Result */}
                    <div className="lg:col-span-7">
                        <div className="bg-black/40 border border-[#bf8339]/30 rounded-2xl min-h-[500px] flex flex-col items-center justify-center p-6 relative group h-full">
                            {generatedImage ? (
                                <>
                                    <img src={generatedImage} className="max-w-full max-h-[600px] rounded-lg shadow-2xl" alt="Generated" />
                                    <div className="absolute bottom-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <ExportMenu content={generatedImage} type="image" filename={`ai-image-${Date.now()}`} label={isAr ? "تحميل" : "Download"} />
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-white/20">
                                    <ImageIcon className="w-24 h-24 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg">{isAr ? 'مساحة العرض' : 'Preview Area'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- COLOR CORRECTION TAB --- */}
            {activeSubTab === 'color' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-5">
                            <h3 className="text-[#bf8339] font-bold mb-4 flex items-center gap-2">{isAr ? 'تعديل الألوان' : 'Color Correction'}</h3>
                            
                            <div onClick={() => featureFileRef.current?.click()} className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center cursor-pointer hover:border-[#bf8339] mb-6">
                                <p className="text-xs text-white/70">{sourceImage ? (isAr ? 'تغيير الصورة' : 'Change Image') : (isAr ? 'ارفع صورة للتعديل' : 'Upload Image')}</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-white/60 mb-1 flex justify-between"><span>{isAr ? 'الإضاءة' : 'Brightness'}</span> <span>{brightness > 0 ? '+' : ''}{brightness}</span></label>
                                    <input type="range" min="-50" max="50" value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full accent-[#bf8339]" />
                                </div>
                                <div>
                                    <label className="text-xs text-white/60 mb-1 flex justify-between"><span>{isAr ? 'التباين' : 'Contrast'}</span> <span>{contrast > 0 ? '+' : ''}{contrast}</span></label>
                                    <input type="range" min="-50" max="50" value={contrast} onChange={e => setContrast(Number(e.target.value))} className="w-full accent-[#bf8339]" />
                                </div>
                                <div>
                                    <label className="text-xs text-white/60 mb-1 flex justify-between"><span>{isAr ? 'التشبع' : 'Saturation'}</span> <span>{saturation > 0 ? '+' : ''}{saturation}</span></label>
                                    <input type="range" min="-50" max="50" value={saturation} onChange={e => setSaturation(Number(e.target.value))} className="w-full accent-[#bf8339]" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-6">
                                {['Natural', 'Warm', 'Cold', 'Cinematic', 'Product'].map(p => (
                                    <button 
                                        key={p} 
                                        onClick={() => setColorPreset(p)}
                                        className={`text-[10px] py-1 rounded border ${colorPreset === p ? 'bg-[#bf8339] text-[#0a1e3c] border-[#bf8339]' : 'border-white/10 hover:bg-white/10'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>

                            <Button onClick={handleProcessImage} isLoading={isLoading} className="w-full mt-6">
                                {isAr ? 'تطبيق التعديلات' : 'Apply Auto Color Fix'}
                            </Button>
                        </div>
                    </div>
                    <div className="lg:col-span-8 h-[600px]"><CompareView /></div>
                </div>
            )}

            {/* --- UPSCALE TAB --- */}
            {activeSubTab === 'upscale' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-5">
                            <h3 className="text-[#bf8339] font-bold mb-4 flex items-center gap-2">{isAr ? 'رفع الجودة (Super Resolution)' : 'Upscale'}</h3>
                            
                            <div onClick={() => featureFileRef.current?.click()} className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center cursor-pointer hover:border-[#bf8339] mb-6">
                                <p className="text-xs text-white/70">{sourceImage ? (isAr ? 'تغيير الصورة' : 'Change Image') : (isAr ? 'ارفع صورة للتحسين' : 'Upload Image')}</p>
                            </div>

                            <div className="flex gap-2 mb-6">
                                {['2x', '4x', '8x'].map((level) => (
                                    <button 
                                        key={level}
                                        onClick={() => setUpscaleLevel(level as any)}
                                        className={`flex-1 py-2 rounded border transition ${upscaleLevel === level ? 'bg-[#bf8339] text-[#0a1e3c] border-[#bf8339] font-bold' : 'border-white/10 hover:bg-white/10'}`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-white/5 p-3 rounded text-xs text-white/60 mb-6">
                                <p>✨ {isAr ? 'تحسين التفاصيل الدقيقة' : 'Micro-Detail Enhancement'}</p>
                                <p>🔇 {isAr ? 'إزالة التشويش والضوضاء' : 'AI Noise Reduction'}</p>
                                <p>🧠 {isAr ? 'الحفاظ على الملامح' : 'Facial Detail Preservation'}</p>
                            </div>

                            <Button onClick={handleProcessImage} isLoading={isLoading} className="w-full">
                                {isAr ? 'تحسين فائق الدقة (AI Ultra Enhance)' : 'AI Ultra Enhance'}
                            </Button>
                        </div>
                    </div>
                    <div className="lg:col-span-8 h-[600px]"><CompareView /></div>
                </div>
            )}

            {/* --- RESTORE TAB --- */}
            {activeSubTab === 'restore' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-5">
                            <h3 className="text-[#bf8339] font-bold mb-4 flex items-center gap-2">{isAr ? 'استعادة الصور' : 'Image Restoration'}</h3>
                            
                            <div onClick={() => featureFileRef.current?.click()} className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center cursor-pointer hover:border-[#bf8339] mb-6">
                                <p className="text-xs text-white/70">{sourceImage ? (isAr ? 'تغيير الصورة' : 'Change Image') : (isAr ? 'ارفع صورة قديمة/تالفة' : 'Upload Old/Damaged Photo')}</p>
                            </div>

                            <div className="text-xs text-white/60 space-y-2 mb-6">
                                <p>💎 {isAr ? 'جودة 8K Ultra-HD' : '8K Ultra-HD Quality'}</p>
                                <p>👤 {isAr ? 'الحفاظ على الملامح بنسبة 1000%' : '1000% Face Preservation'}</p>
                                <p>🚫 {isAr ? 'بدون تغيير في الخلفية أو الألوان' : 'No Background/Color Shift'}</p>
                            </div>

                            <Button onClick={handleProcessImage} isLoading={isLoading} className="w-full bg-gradient-to-r from-[#bf8339] to-[#d69545]">
                                {isAr ? 'تحسين الصورة (Enhance)' : 'Enhance Image'}
                            </Button>
                        </div>
                    </div>
                    <div className="lg:col-span-8 h-[600px]"><CompareView /></div>
                </div>
            )}

            {activeSubTab === 'blend' && <ImageBlenderView />}

            <input type="file" ref={featureFileRef} onChange={handleFeatureUpload} className="hidden" accept="image/*" />

            {/* CROPPER MODAL */}
            {cropImageSrc && (
                <ImageCropperModal
                    imageSrc={cropImageSrc}
                    onCrop={handleCropConfirm}
                    onCancel={() => setCropImageSrc(null)}
                    isAr={isAr}
                />
            )}
        </div>
    );
};

export default AIImagesView;
