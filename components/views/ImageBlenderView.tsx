
import React, { useState, useRef, useContext, useMemo } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import { UI_TRANSLATIONS, ASPECT_RATIOS_GROUPED } from '../../constants';
import * as geminiService from '../../services/geminiService';
import Button from '../Button';
import { Loader, MagicWandIcon } from '../Icons';
import AccordionSelect from '../AccordionSelect';
import CustomGroupedSelect from '../CustomGroupedSelect';

interface BlenderImage {
    id: string;
    data: string;
    mime: string;
    role: string;
}

const ROLES = ['Not Used', 'Subject', 'Background', 'Style Reference', 'Color Palette', 'Lighting Reference'];

const ImageBlenderView: React.FC = () => {
    const { appLanguage } = useContext(ProjectContext);
    const t = UI_TRANSLATIONS;
    const isAr = appLanguage === 'ar';
    
    const [images, setImages] = useState<BlenderImage[]>([]);
    const [description, setDescription] = useState('');
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [aspectRatio, setAspectRatio] = useState('1:1');
    
    const fileRef = useRef<HTMLInputElement>(null);

    // Helper to get translated role label
    const getRoleLabel = (roleEn: string) => {
        if (roleEn === 'Not Used') return t.roleNotUsed[appLanguage];
        if (roleEn === 'Subject') return t.roleSubject[appLanguage];
        if (roleEn === 'Background') return t.roleBackground[appLanguage];
        if (roleEn === 'Style Reference') return t.roleStyle[appLanguage];
        if (roleEn === 'Color Palette') return t.rolePalette[appLanguage];
        if (roleEn === 'Lighting Reference') return t.roleLighting[appLanguage];
        return roleEn;
    };

    const ROLE_GROUPS = [
        { 
            label: isAr ? 'تحديد الدور' : 'Select Role', 
            options: ROLES.map(r => ({ label: getRoleLabel(r), value: r })) 
        }
    ];

    const aspectRatioGroups = useMemo(() => ASPECT_RATIOS_GROUPED.map(g => ({
        label: isAr ? g.label.ar : g.label.en,
        options: g.options.map(o => ({ 
            label: isAr ? o.label.ar : o.label.en, 
            value: o.value,
            description: o.desc 
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

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (images.length >= 10) return alert(isAr ? "الحد الأقصى 10 صور" : "Max 10 images");
        const file = e.target.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            
            // Auto detect aspect ratio if this is the first image
            if (images.length === 0) {
                const img = new Image();
                img.src = reader.result as string;
                img.onload = () => {
                    const r = getClosestAspectRatio(img.width, img.height);
                    setAspectRatio(r);
                };
            }

            setImages([...images, {
                id: Date.now().toString(),
                data: base64,
                mime: file.type,
                role: images.length === 0 ? 'Subject' : 'Not Used' // Default first to Subject
            }]);
        };
        reader.readAsDataURL(file);
    };

    const updateRole = (id: string, newRole: string) => {
        setImages(images.map(img => img.id === id ? { ...img, role: newRole } : img));
    };

    const removeImage = (id: string) => {
        setImages(images.filter(img => img.id !== id));
    };

    const handleSuggestDescription = async () => {
        if (images.length === 0) return;
        setIsSuggesting(true);
        try {
            // Pass true if description exists (to request a DIFFERENT one)
            const suggestion = await geminiService.suggestBlenderDescription(images, !!description);
            setDescription(suggestion);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSuggesting(false);
        }
    };

    const handleBlend = async () => {
        if (images.length === 0) return alert(isAr ? "يجب رفع صورة واحدة على الأقل" : "Upload at least one image");
        setIsLoading(true);
        setResultImage(null);
        try {
            // Pass the selected aspect ratio to the service
            const res = await geminiService.blendImages(images, description, aspectRatio);
            setResultImage(`data:image/jpeg;base64,${res}`);
        } catch (e: any) {
            alert(e.message || (isAr ? "حدث خطأ أثناء الدمج" : "Blending failed"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="border-b border-white/10 pb-4">
                <h2 className="text-3xl font-bold text-[#bf8339]">{t.imageBlender[appLanguage]}</h2>
                <p className="text-white/60 mt-2">{isAr ? 'ادمج عدة صور ومفاهيم لإنشاء مشهد جديد كلياً باستخدام Gemini 3 Pro' : 'Combine multiple images and concepts to synthesize a completely new creation.'}</p>
            </div>

            {/* SECTION 1: UPLOAD & ROLES */}
            <div className="bg-[#0a1e3c]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">{isAr ? '1. رفع الصور وتحديد الأدوار' : '1. Upload Images & Assign Roles'}</h3>
                    <span className="text-xs text-white/50">{images.length}/10</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((img) => (
                        <div key={img.id} className="relative bg-white/5 rounded-lg p-2 border border-white/10 group hover:border-[#bf8339] transition flex flex-col gap-2">
                            <div className="aspect-square rounded overflow-hidden relative">
                                <img src={`data:${img.mime};base64,${img.data}`} className="w-full h-full object-cover" />
                                <button onClick={() => removeImage(img.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition">×</button>
                            </div>
                            <div className="w-full">
                                <AccordionSelect 
                                    label=""
                                    value={img.role} 
                                    onChange={(val) => updateRole(img.id, val)}
                                    groups={ROLE_GROUPS}
                                    placeholder={getRoleLabel('Not Used')}
                                />
                            </div>
                        </div>
                    ))}
                    
                    {images.length < 10 && (
                        <div onClick={() => fileRef.current?.click()} className="aspect-square border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-[#bf8339] transition text-white/40 hover:text-[#bf8339]">
                            <span className="text-3xl mb-1">+</span>
                            <span className="text-xs">{isAr ? 'رفع صورة' : 'Upload'}</span>
                        </div>
                    )}
                </div>
                <input type="file" ref={fileRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            </div>

            {/* SECTION 2: DESCRIPTION & RATIO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0a1e3c]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">{isAr ? '2. الوصف النصي (اختياري)' : '2. Scene Description (Optional)'}</h3>
                        <Button variant="secondary" onClick={handleSuggestDescription} isLoading={isSuggesting} className="!py-1 !px-3 !text-xs flex items-center gap-2">
                            <MagicWandIcon className="w-4 h-4" />
                            {description ? (isAr ? 'اقتراح آخر ↻' : 'Suggest Another ↻') : (isAr ? 'اقتراح وصف' : 'Auto Describe')}
                        </Button>
                    </div>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-4 h-32 focus:border-[#bf8339] transition text-white placeholder-white/30"
                        placeholder={t.blenderDescPlaceholder[appLanguage]}
                    />
                </div>

                <div className="bg-[#0a1e3c]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-lg flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-4">{isAr ? '3. أبعاد النتيجة' : '3. Output Ratio'}</h3>
                    <div className="flex-1 flex flex-col justify-center">
                        <CustomGroupedSelect 
                            label="" 
                            value={aspectRatio} 
                            onChange={setAspectRatio} 
                            groups={aspectRatioGroups} 
                            placeholder="Select Ratio" 
                        />
                        <p className="text-[10px] text-white/40 mt-3 text-center">
                            {isAr ? 'سيتم توليد الصورة بالأبعاد المختارة.' : 'Image will be generated in the selected ratio.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* SECTION 3: ACTION & RESULT */}
            <div className="space-y-6">
                <Button onClick={handleBlend} isLoading={isLoading} className="w-full py-4 text-lg font-bold shadow-xl shadow-[#bf8339]/20">
                    {t.synthesizeImage[appLanguage]}
                </Button>

                {resultImage && (
                    <div className="bg-black/40 p-6 rounded-xl border border-[#bf8339]/30 text-center animate-fade-in">
                        <img src={resultImage} className="max-h-[600px] mx-auto rounded-lg shadow-2xl mb-6" />
                        <div className="flex justify-center gap-4">
                            <a href={resultImage} download="blended-scene.jpg" className="bg-[#bf8339] text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-[#bf8339] transition">
                                {isAr ? 'تحميل الصورة' : 'Download Image'}
                            </a>
                            <Button variant="secondary" onClick={handleBlend}>
                                {isAr ? 'إعادة الدمج' : 'Re-blend'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageBlenderView;
