
import React, { useState, useRef, useContext, useMemo, useEffect } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import Button from '../Button';
import { ShoppingBagIcon, PhotoIcon, SparklesIcon, ArrowsRightLeftIcon, Loader, MagicWandIcon } from '../Icons';
import * as geminiService from '../../services/geminiService';
import CustomGroupedSelect from '../CustomGroupedSelect';
import { setItem, getItem } from '../../utils/localStorage';
import { ARCHIVE_STORAGE_KEY, INDUSTRIES_GROUPED, CAMERA_ANGLES, LIGHTING_STYLES, ASPECT_RATIOS_GROUPED } from '../../constants';
import ExportMenu from '../ExportMenu';
import ImageCropperModal from '../ImageCropperModal';

const ProfessionalProductView: React.FC = () => {
    const { appLanguage, industry, updateProjectState } = useContext(ProjectContext);
    const isAr = appLanguage === 'ar';

    // Form State
    const [projectType, setProjectType] = useState(industry || '');
    const [storeName, setStoreName] = useState('');
    const [customPrompt, setCustomPrompt] = useState('');
    const [sourceImage, setSourceImage] = useState<{data: string, mimeType: string} | null>(null);
    const [sourceImagePreview, setSourceImagePreview] = useState<string | null>(null);
    
    // Scene Settings
    const [sceneStyle, setSceneStyle] = useState('Cinematic');
    const [cameraAngle, setCameraAngle] = useState(CAMERA_ANGLES[0].value);
    const [lighting, setLighting] = useState(LIGHTING_STYLES[0].value);
    const [realism, setRealism] = useState('Ultra');
    const [removeBg, setRemoveBg] = useState(true);
    const [effects, setEffects] = useState<string[]>([]);
    const [aspectRatio, setAspectRatio] = useState('1:1');

    // Output State
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    // Compare Slider State
    const [compareSlider, setCompareSlider] = useState(50);
    const [isDraggingSlider, setIsDraggingSlider] = useState(false);
    const compareContainerRef = useRef<HTMLDivElement>(null);

    // CROPPER STATE
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const [pendingFileType, setPendingFileType] = useState('image/jpeg');

    // --- Unified Data Sources ---

    // 1. Industries (Same as Content Studio)
    const industryGroups = useMemo(() => INDUSTRIES_GROUPED.map(g => ({
        label: isAr ? g.label.ar : g.label.en,
        options: g.options.map(o => ({ label: isAr ? o.label.ar : o.label.en, value: o.value }))
    })), [isAr]);

    // 2. Camera Angles (Same as Image Studio)
    const cameraAngleGroups = useMemo(() => [{
        label: isAr ? 'زوايا التصوير' : 'Camera Angles',
        options: CAMERA_ANGLES.map(a => ({
            label: `${a.icon} ${isAr ? a.label.ar : a.label.en}`,
            value: a.value
        }))
    }], [isAr]);

    // 3. Lighting (Same as Image Studio)
    const lightingGroups = useMemo(() => [{
        label: isAr ? 'أنماط الإضاءة' : 'Lighting Styles',
        options: LIGHTING_STYLES.map(l => ({
            label: `${l.icon} ${isAr ? l.label.ar : l.label.en}`,
            value: l.value
        }))
    }], [isAr]);

    // 4. Aspect Ratios
    const aspectRatioGroups = useMemo(() => ASPECT_RATIOS_GROUPED.map(g => ({
        label: isAr ? g.label.ar : g.label.en,
        options: g.options.map(o => ({ 
            label: isAr ? o.label.ar : o.label.en, 
            value: o.value,
            description: o.desc 
        }))
    })), [isAr]);

    // Local Constants
    const SCENE_STYLES = useMemo(() => [
        { label: { ar: 'سينمائي', en: 'Cinematic' }, value: 'Cinematic' },
        { label: { ar: 'استوديو', en: 'Studio' }, value: 'Studio' },
        { label: { ar: 'منتج عائم', en: 'Floating Product' }, value: 'Floating Product' },
        { label: { ar: 'في بيئة طبيعية', en: 'Natural Light' }, value: 'Natural Light' },
        { label: { ar: 'خلفية تجارية', en: 'Retail Scene' }, value: 'Retail Scene' }
    ].map(item => ({ label: isAr ? item.label.ar : item.label.en, value: item.value })), [isAr]);

    const REALISM = useMemo(() => [
        'Medium', 'High', 'Ultra'
    ].map(v => ({ label: v, value: v })), []);

    // Effects List with Bilingual Labels
    const EFFECTS_LIST = useMemo(() => [
        { id: 'Mist', ar: 'ضباب (Mist)', en: 'Mist' },
        { id: 'Glow', ar: 'توهج (Glow)', en: 'Glow' },
        { id: 'Reflection', ar: 'انعكاس (Reflection)', en: 'Reflection' },
        { id: 'Spark', ar: 'بريق (Spark)', en: 'Spark' },
        { id: '3D Depth Pop', ar: 'عمق 3D', en: '3D Depth Pop' },
        { id: 'Glossy Finish', ar: 'لمسة لامعة', en: 'Glossy Finish' },
        { id: 'Soft Shadow Cast', ar: 'ظل ناعم', en: 'Soft Shadow Cast' },
        { id: 'Metallic Shine', ar: 'لمعان معدني', en: 'Metallic Shine' },
        { id: 'Product Halo', ar: 'هالة المنتج', en: 'Product Halo' },
        { id: 'Pearl Glow', ar: 'توهج لؤلؤي', en: 'Pearl Glow' },
    ], []);

    const toggleEffect = (eff: string) => {
        if (effects.includes(eff)) setEffects(effects.filter(e => e !== eff));
        else setEffects([...effects, eff]);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) return alert(isAr ? 'حجم الملف كبير جداً' : 'File too large (>10MB)');
        
        const reader = new FileReader();
        reader.onloadend = () => {
            setCropImageSrc(reader.result as string);
            setPendingFileType(file.type);
        };
        reader.readAsDataURL(file);
        // Reset
        e.target.value = '';
    };

    const handleCropConfirm = (croppedBase64: string) => {
        const base64Data = croppedBase64.split(',')[1];
        setSourceImage({ data: base64Data, mimeType: 'image/jpeg' }); // Canvas output is jpeg
        setSourceImagePreview(croppedBase64);
        setCropImageSrc(null);
    };

    const handleEnhancePrompt = async () => {
        if (!customPrompt) return;
        setIsEnhancingPrompt(true);
        try {
            const context = `Product Photography. Industry: ${projectType}. Style: ${sceneStyle}.`;
            const enhanced = await geminiService.enhancePrompt(customPrompt, context);
            setCustomPrompt(enhanced);
        } catch(e) { console.error(e); }
        finally { setIsEnhancingPrompt(false); }
    };

    const handleGenerate = async () => {
        if (!sourceImage) return alert(isAr ? 'يرجى رفع صورة المنتج' : 'Please upload product image');
        
        // Pro Key Check
        if ((window as any).aistudio) {
            try {
               const hasKey = await (window as any).aistudio.hasSelectedApiKey();
               if (!hasKey) {
                   await (window as any).aistudio.openSelectKey();
               }
            } catch (e) { console.warn("Key check failed", e); }
        }

        setIsLoading(true);
        setGeneratedImage(null);

        try {
            const result = await geminiService.generateProductScene(
                sourceImage.data,
                sourceImage.mimeType,
                {
                    projectType,
                    storeName,
                    sceneStyle,
                    angle: cameraAngle,
                    lighting,
                    realism,
                    removeBg,
                    effects,
                    customPrompt,
                    aspectRatio
                }
            );
            
            const fullImg = `data:image/jpeg;base64,${result}`;
            setGeneratedImage(fullImg);

            // Archive
            const archive = getItem(ARCHIVE_STORAGE_KEY, []);
            archive.unshift({ 
                id: Date.now().toString(), 
                type: 'ProductPhoto', 
                content: fullImg, 
                timestamp: new Date().toISOString() 
            });
            setItem(ARCHIVE_STORAGE_KEY, archive);

        } catch (e: any) {
            console.error(e);
            alert(e.message || (isAr ? "فشل التحويل" : "Transformation Failed"));
            if (e.message?.includes("Requested entity was not found") && (window as any).aistudio) {
                await (window as any).aistudio.openSelectKey();
            }
        } finally {
            setIsLoading(false);
        }
    };

    // --- Slider Interaction ---
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

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-[#bf8339] flex items-center gap-3">
                        <ShoppingBagIcon className="w-10 h-10" /> 
                        {isAr ? 'تحويل المنتج إلى صورة احترافية' : 'Professional Product Transform'}
                    </h2>
                    <p className="text-white/70 mt-2 text-lg">
                        {isAr 
                            ? 'حوِّل صور منتجاتك العادية إلى صور سينمائية دعائية جاهزة للنشر.' 
                            : 'Transform standard product photos into cinematic, publish-ready assets.'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT: CONTROLS */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-lg">
                        <h3 className="text-[#bf8339] font-bold mb-6 text-sm uppercase tracking-wider border-b border-white/10 pb-3 flex items-center gap-2">
                            <span className="bg-[#bf8339]/20 p-1 rounded">1</span> {isAr ? 'بيانات المنتج' : 'Product Details'}
                        </h3>
                        
                        <div className="space-y-5">
                            <CustomGroupedSelect 
                                label={isAr ? "نوع المشروع" : "Project Type"}
                                value={projectType}
                                onChange={(val) => { setProjectType(val); updateProjectState({ industry: val }); }}
                                groups={industryGroups}
                                placeholder={isAr ? "اختر القطاع" : "Select Sector"}
                            />

                            <div>
                                <label className="block text-xs text-white/60 mb-1">{isAr ? 'اسم المتجر (اختياري)' : 'Store Name (Optional)'}</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-black/20 border border-white/20 rounded-lg p-3 text-white focus:border-[#bf8339]"
                                    placeholder={isAr ? "اكتب اسم متجرك..." : "Enter store name..."}
                                    value={storeName}
                                    onChange={e => setStoreName(e.target.value)}
                                />
                                <p className="text-[10px] text-white/40 mt-1">{isAr ? 'يظهر الاسم في زاوية الصورة (RB Regular).' : 'Appears in corner (RB Regular font).'}</p>
                            </div>

                            {/* Image Upload */}
                            <div 
                                onClick={() => fileRef.current?.click()}
                                className="border-2 border-dashed border-[#bf8339]/40 bg-[#bf8339]/5 hover:bg-[#bf8339]/10 rounded-xl p-6 text-center cursor-pointer group transition-all"
                            >
                                {sourceImage ? (
                                    <div className="relative h-40">
                                        <img src={`data:${sourceImage.mimeType};base64,${sourceImage.data}`} className="h-full mx-auto rounded shadow-md object-contain" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition rounded text-white text-xs">
                                            {isAr ? 'تغيير الصورة' : 'Change Image'}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-[#bf8339]/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                                            <PhotoIcon className="w-6 h-6 text-[#bf8339]" />
                                        </div>
                                        <p className="text-[#bf8339] font-bold text-sm">{isAr ? 'اضغط لرفع صورة المنتج' : 'Click to Upload Product'}</p>
                                        <p className="text-[10px] text-white/50 mt-1">JPG, PNG (Max 10MB)</p>
                                    </>
                                )}
                                <input type="file" ref={fileRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-lg">
                        <h3 className="text-[#bf8339] font-bold mb-6 text-sm uppercase tracking-wider border-b border-white/10 pb-3 flex items-center gap-2">
                            <span className="bg-[#bf8339]/20 p-1 rounded">2</span> {isAr ? 'إعدادات المشهد' : 'Scene Settings'}
                        </h3>

                        <div className="space-y-4">
                            {/* CUSTOM PROMPT AREA */}
                            <div className="relative">
                                <label className="block text-xs text-white/60 mb-1">{isAr ? 'وصف إضافي (Prompt)' : 'Additional Prompt'}</label>
                                <textarea 
                                    className="w-full bg-black/20 border border-white/20 rounded-lg p-3 text-white focus:border-[#bf8339] h-20 text-sm"
                                    placeholder={isAr ? "مثال: ضع المنتج على صخرة سوداء وسط الماء..." : "e.g. Place product on a black rock in water..."}
                                    value={customPrompt}
                                    onChange={e => setCustomPrompt(e.target.value)}
                                />
                                {customPrompt && (
                                    <button 
                                        onClick={handleEnhancePrompt} 
                                        disabled={isEnhancingPrompt}
                                        className="absolute bottom-2 right-2 bg-white/10 hover:bg-[#bf8339] text-white p-1.5 rounded transition backdrop-blur-md"
                                        title={isAr ? "تحسين الوصف" : "Enhance Prompt"}
                                    >
                                        {isEnhancingPrompt ? <Loader /> : <MagicWandIcon className="w-4 h-4" />}
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <CustomGroupedSelect label={isAr ? "نمط المشهد" : "Style"} value={sceneStyle} onChange={setSceneStyle} groups={[{ label: '', options: SCENE_STYLES }]} placeholder="Select" />
                                <CustomGroupedSelect label={isAr ? "الأبعاد" : "Aspect Ratio"} value={aspectRatio} onChange={setAspectRatio} groups={aspectRatioGroups} placeholder="Select" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <CustomGroupedSelect label={isAr ? "زاوية الكاميرا" : "Angle"} value={cameraAngle} onChange={setCameraAngle} groups={cameraAngleGroups} placeholder="Select" />
                                <CustomGroupedSelect label={isAr ? "الإضاءة" : "Lighting"} value={lighting} onChange={setLighting} groups={lightingGroups} placeholder="Select" />
                            </div>

                            <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition border border-white/5 hover:border-[#bf8339]/30">
                                <span className="text-sm font-bold text-white">{isAr ? 'إزالة الخلفية الأصلية' : 'Remove Original Background'}</span>
                                <input type="checkbox" checked={removeBg} onChange={e => setRemoveBg(e.target.checked)} className="accent-[#bf8339] w-5 h-5" />
                            </label>

                            <div>
                                <label className="block text-xs text-white/60 mb-2">{isAr ? 'تأثيرات إضافية' : 'Extra Effects'}</label>
                                <div className="flex flex-wrap gap-2">
                                    {EFFECTS_LIST.map(eff => (
                                        <button
                                            key={eff.id}
                                            onClick={() => toggleEffect(eff.id)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition border ${
                                                effects.includes(eff.id) 
                                                ? 'bg-[#bf8339] text-[#0a1e3c] border-[#bf8339]' 
                                                : 'bg-transparent text-white/60 border-white/20 hover:border-white hover:text-white'
                                            }`}
                                        >
                                            {isAr ? eff.ar : eff.en}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button 
                        onClick={handleGenerate} 
                        isLoading={isLoading}
                        className="w-full py-4 text-lg font-bold shadow-xl shadow-[#bf8339]/20"
                    >
                        {isAr ? 'حوّل صورة المنتج 🔁' : 'Transform Product 🔁'}
                    </Button>
                </div>

                {/* RIGHT: PREVIEW */}
                <div className="lg:col-span-7">
                    <div className="bg-black/40 border border-[#bf8339]/30 rounded-2xl min-h-[600px] flex flex-col items-center justify-center p-6 relative group">
                        
                        {generatedImage ? (
                            <>
                                {/* COMPARE SLIDER CONTAINER */}
                                <div 
                                    ref={compareContainerRef} 
                                    className="relative max-w-full cursor-col-resize select-none shadow-2xl rounded-lg overflow-hidden"
                                    onMouseDown={() => setIsDraggingSlider(true)}
                                    onTouchStart={() => setIsDraggingSlider(true)}
                                >
                                    {/* After Image (Full visibility) */}
                                    <img src={generatedImage} className="max-w-full max-h-[700px] block" alt="Generated Product Scene" />
                                    
                                    {/* Before Image (Revealed by slider) */}
                                    {sourceImagePreview && (
                                        <div 
                                            className="absolute top-0 left-0 bottom-0 overflow-hidden border-r-2 border-white shadow-[2px_0_10px_rgba(0,0,0,0.5)] bg-black/10"
                                            style={{ width: `${compareSlider}%` }}
                                        >
                                            <img 
                                                src={sourceImagePreview} 
                                                className="max-w-none h-full object-contain bg-black" 
                                                style={{ width: compareContainerRef.current?.getBoundingClientRect().width }} 
                                                alt="Source" 
                                            />
                                        </div>
                                    )}
                                    
                                    {/* Slider Handle */}
                                    {sourceImagePreview && (
                                        <div 
                                            className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg -ml-4 z-10" 
                                            style={{ left: `${compareSlider}%` }}
                                        >
                                            <ArrowsRightLeftIcon className="w-4 h-4 text-black" />
                                        </div>
                                    )}

                                    {/* Labels */}
                                    {sourceImagePreview && (
                                        <>
                                            <div className="absolute top-4 left-4 bg-black/60 px-2 py-1 rounded text-xs text-white pointer-events-none">{isAr ? 'الأصل' : 'Original'}</div>
                                            <div className="absolute top-4 right-4 bg-[#bf8339] px-2 py-1 rounded text-xs text-[#0a1e3c] font-bold pointer-events-none">{isAr ? 'النتيجة' : 'Result'}</div>
                                        </>
                                    )}
                                </div>

                                {/* Action Buttons BELOW Image */}
                                <div className="mt-6 flex flex-wrap justify-center gap-4 w-full">
                                    <ExportMenu content={generatedImage} type="image" filename={`pro-product-${Date.now()}`} label={isAr ? "تحميل الصورة" : "Download"} className="!py-3 !px-6" />
                                    <Button variant="secondary" onClick={handleGenerate} className="!py-3 !px-6 !text-sm backdrop-blur-md bg-black/50 border-white/20 text-white hover:bg-black/70">
                                        {isAr ? '🔄 إعادة توليد' : '🔄 Regenerate'}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-10">
                                {sourceImage ? (
                                    <div className="relative w-64 h-64 mx-auto mb-6 opacity-50 grayscale">
                                        <img src={`data:${sourceImage.mimeType};base64,${sourceImage.data}`} className="w-full h-full object-contain" />
                                        <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white">{isAr ? 'قبل' : 'Before'}</div>
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <SparklesIcon className="w-10 h-10 text-white/20" />
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-white/40">{isAr ? 'مساحة العرض' : 'Preview Area'}</h3>
                                <p className="text-white/30 text-sm mt-2">{isAr ? 'النتيجة النهائية ستظهر هنا بدقة عالية.' : 'High fidelity result will appear here.'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CROPPER MODAL */}
            {cropImageSrc && (
                <ImageCropperModal
                    imageSrc={cropImageSrc}
                    onCrop={handleCropConfirm}
                    onCancel={() => setCropImageSrc(null)}
                    isAr={isAr}
                    // For products, usually square or 4:5 is best, defaulting to 1:1 visually but user can zoom
                    aspectRatio={aspectRatio === '1:1' ? 1 : aspectRatio === '9:16' ? 9/16 : aspectRatio === '16:9' ? 16/9 : aspectRatio === '3:4' ? 3/4 : 1}
                />
            )}
        </div>
    );
};

export default ProfessionalProductView;
