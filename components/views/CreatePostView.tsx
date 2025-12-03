
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import Button from '../Button';
import { Loader, ImageIcon, SparklesIcon, MagicWandIcon, ArrowsRightLeftIcon, VideoCameraIcon } from '../Icons';
import { ARABIC_DIALECTS_GROUPED, INDUSTRIES_GROUPED, LANGUAGES_GROUPED, TONES_GROUPED, AD_PLATFORMS, ARCHIVE_STORAGE_KEY, REEL_MODES, REEL_PLATFORMS, REEL_DURATIONS } from '../../constants';
import { PostGeneration, ReelResponse, AdGeneration, ArchivedItem } from '../../types';
import * as geminiService from '../../services/geminiService';
import { setItem, getItem, removeItem } from '../../utils/localStorage';
import AccordionSelect from '../AccordionSelect';
import CustomGroupedSelect from '../CustomGroupedSelect';
import CopyButton from '../CopyButton';
import ExportMenu from '../ExportMenu';

const CreatePostView: React.FC = () => {
  const { topic, tone, language, dialect, industry, styleProfile, updateProjectState, appLanguage } = useContext(ProjectContext);
  const isAr = appLanguage === 'ar';
  
  const [localTopic, setLocalTopic] = useState(topic);
  const [mode, setMode] = useState<'Post' | 'Reel' | 'Ad'>('Post');
  const [useUserStyle, setUseUserStyle] = useState(!!styleProfile);
  const [adPlatform, setAdPlatform] = useState(AD_PLATFORMS[0].value);
  
  // New Reel States
  const [reelMode, setReelMode] = useState('');
  const [reelPlatform, setReelPlatform] = useState('');
  const [reelDuration, setReelDuration] = useState('');
  const [isVoiceoverOnly, setIsVoiceoverOnly] = useState(false);
  const [activeReelVersion, setActiveReelVersion] = useState<number>(0); 
  const [generatingSceneImages, setGeneratingSceneImages] = useState(false);

  const [postGenerations, setPostGenerations] = useState<PostGeneration[]>([]);
  const [reelResponse, setReelResponse] = useState<ReelResponse | null>(null);
  const [adGenerations, setAdGenerations] = useState<AdGeneration[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // For Smart Edit
  const [editedText, setEditedText] = useState<string>('');

  // Translation State
  const [translatedPrompts, setTranslatedPrompts] = useState<Record<number, string>>({});
  const [isTranslating, setIsTranslating] = useState<Record<number, boolean>>({});
  const [isRegeneratingPrompt, setIsRegeneratingPrompt] = useState<Record<number, boolean>>({});

  // Check for restored draft
  useEffect(() => {
      const draft = getItem<ArchivedItem>('editDraft');
      if (draft) {
          if (draft.type === 'Post') {
              setMode('Post');
              setPostGenerations(draft.content);
          } else if (draft.type === 'Reel') {
              setMode('Reel');
              setReelResponse(draft.content);
          } else if (draft.type === 'Ad') {
              setMode('Ad');
              setAdGenerations(draft.content);
          }
          removeItem('editDraft');
      }
  }, []);

  const AD_PLATFORM_GROUPS = useMemo(() => [{ 
      label: isAr ? 'المنصات الإعلانية' : 'Ad Platforms', 
      options: AD_PLATFORMS.map(p => ({ label: isAr ? p.label.ar : p.label.en, value: p.value })) 
  }], [isAr]);

  const REEL_MODE_GROUPS = useMemo(() => REEL_MODES.map(g => ({
      label: isAr ? g.label.ar : g.label.en,
      options: g.options.map(o => ({ label: isAr ? o.label.ar : o.label.en, value: o.value }))
  })), [isAr]);

  const REEL_PLATFORM_GROUPS = useMemo(() => [{
      label: isAr ? 'المنصة المستهدفة' : 'Target Platform',
      options: REEL_PLATFORMS.map(p => ({ label: isAr ? p.label.ar : p.label.en, value: p.value }))
  }], [isAr]);

  const REEL_DURATION_GROUPS = useMemo(() => [{
      label: isAr ? 'المدة الزمنية' : 'Duration',
      options: REEL_DURATIONS.map(d => ({ label: isAr ? d.label.ar : d.label.en, value: d.value }))
  }], [isAr]);

  // Memoized localized options
  const localizedLanguages = useMemo(() => LANGUAGES_GROUPED.map(g => ({
      label: isAr ? g.label.ar : g.label.en,
      options: g.options.map(o => ({ label: isAr ? o.label.ar : o.label.en, value: o.value }))
  })), [isAr]);

  const localizedDialects = useMemo(() => ARABIC_DIALECTS_GROUPED.map(g => ({
      label: isAr ? g.label.ar : g.label.en,
      options: g.options.map(o => ({ label: isAr ? o.label.ar : o.label.en, value: o.value }))
  })), [isAr]);

  const localizedIndustries = useMemo(() => INDUSTRIES_GROUPED.map(g => ({
      label: isAr ? g.label.ar : g.label.en,
      options: g.options.map(o => ({ label: isAr ? o.label.ar : o.label.en, value: o.value }))
  })), [isAr]);

  const localizedTones = useMemo(() => TONES_GROUPED.map(g => ({
      label: isAr ? g.label.ar : g.label.en,
      options: g.options.map(o => ({ label: isAr ? o.label.ar : o.label.en, value: o.value }))
  })), [isAr]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setPostGenerations([]);
    setReelResponse(null);
    setAdGenerations([]);
    setTranslatedPrompts({});
    setIsRegeneratingPrompt({});
    
    try {
        updateProjectState({ topic: localTopic });
        const archive = getItem(ARCHIVE_STORAGE_KEY, []);
        const timestamp = new Date().toISOString();
        const id = Date.now().toString();

        if (mode === 'Post') {
            const res = await geminiService.generatePost(localTopic, dialect, language, industry, tone, useUserStyle);
            setPostGenerations(res || []);
            archive.unshift({ id, type: 'Post', content: res, timestamp });
        } else if (mode === 'Reel') {
            const effectiveReelMode = reelMode || "Quick Reel (30s)";
            const res = await geminiService.generateAdvancedReelScript(localTopic, language, dialect, industry, effectiveReelMode, isVoiceoverOnly, reelPlatform, reelDuration);
            setReelResponse(res);
            archive.unshift({ id, type: 'Reel', content: res, timestamp });
        } else if (mode === 'Ad') {
            const res = await geminiService.generateAd(localTopic, adPlatform, tone, language, dialect);
            setAdGenerations(res || []);
            archive.unshift({ id, type: 'Ad', content: res, timestamp });
        }
        
        setItem(ARCHIVE_STORAGE_KEY, archive);
    } catch (err: any) {
        alert(err.message || (isAr ? 'حدث خطأ أثناء الإنشاء. حاول مرة أخرى.' : 'Error generating content. Please try again.'));
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSmartEdit = async (text: string, action: 'shorten' | 'expand' | 'fix' | 'translate' | 'rewrite') => {
    if (!text) return;
    setIsLoading(true);
    try {
        const res = await geminiService.smartEdit(text, action);
        setEditedText(res);
        setEditingId('result'); 
    } catch(err: any) { alert(err.message || (isAr ? 'حدث خطأ في التعديل' : 'Edit failed')); }
    finally { setIsLoading(false); }
  };

  const handleTranslatePrompt = async (index: number, text: string) => {
      // Toggle translation: If translated exists, clear it to revert to original
      if (translatedPrompts[index]) {
          const newPrompts = {...translatedPrompts};
          delete newPrompts[index];
          setTranslatedPrompts(newPrompts);
          return;
      }

      setIsTranslating(prev => ({...prev, [index]: true}));
      try {
          const result = await geminiService.translateToEnglish(text);
          setTranslatedPrompts(prev => ({...prev, [index]: result}));
      } catch (e) {
          console.error("Translation failed", e);
      } finally {
          setIsTranslating(prev => ({...prev, [index]: false}));
      }
  };

  const handleRegeneratePrompt = async (index: number, currentTopic: string) => {
      setIsRegeneratingPrompt(prev => ({...prev, [index]: true}));
      try {
          // Generate a completely new prompt in ARABIC (if app is Ar) or ENGLISH
          const newPrompt = await geminiService.generateSingleImagePrompt(currentTopic || localTopic, isAr ? 'Arabic' : 'English');
          
          // Update the state
          const newGenerations = [...postGenerations];
          if (newGenerations[index]) {
              newGenerations[index].imagePrompt = newPrompt;
              setPostGenerations(newGenerations);
              
              // Clear previous translation for this index as it's a new prompt
              if (translatedPrompts[index]) {
                  const newTrans = {...translatedPrompts};
                  delete newTrans[index];
                  setTranslatedPrompts(newTrans);
              }
          }
      } catch (e) {
          console.error("Prompt regeneration failed", e);
      } finally {
          setIsRegeneratingPrompt(prev => ({...prev, [index]: false}));
      }
  };
  
  const handleGenerateSceneImages = async () => {
      if (!reelResponse || !reelResponse.versions[activeReelVersion]) return;
      
      setGeneratingSceneImages(true);
      try {
          const currentScript = reelResponse.versions[activeReelVersion];
          const updatedScenes = await Promise.all(currentScript.scenes.map(async (scene) => {
              if (scene.imageUrl) return scene; // Already generated

              // Construct a specific prompt for the scene
              const prompt = `${scene.visual}, ${scene.camera} angle, vertical 9:16, photorealistic, cinematic lighting, clean composition, 4k resolution`;
              
              try {
                  // Use Flash Image for speed as we are generating multiple images
                  const base64Img = await geminiService.generateImage(prompt, 'gemini-2.5-flash-image', '9:16', 'Cinematic');
                  return { 
                      ...scene, 
                      imageUrl: `data:image/jpeg;base64,${base64Img}`,
                      imagePrompt: prompt
                  };
              } catch (e) {
                  console.error("Failed to generate scene image", e);
                  return scene;
              }
          }));

          // Update state deeply
          const newResponse = { ...reelResponse };
          newResponse.versions[activeReelVersion].scenes = updatedScenes;
          setReelResponse(newResponse);
          
          // Update archive
          const archive = getItem(ARCHIVE_STORAGE_KEY, []);
          if (archive.length > 0 && archive[0].type === 'Reel') {
             archive[0].content = newResponse;
             setItem(ARCHIVE_STORAGE_KEY, archive);
          }

      } catch (err: any) {
          alert(err.message || (isAr ? "حدث خطأ أثناء توليد الصور." : "Error generating scene images."));
      } finally {
          setGeneratingSceneImages(false);
      }
  };

  const activeReelScript = reelResponse?.versions?.[activeReelVersion];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
            <h2 className="text-3xl font-bold text-[#bf8339]">{isAr ? 'استوديو المحتوى' : 'Content Studio'}</h2>
            <p className="text-white/70 mt-1">{isAr ? 'مساحة عمل شاملة للمنشورات، الريلز، والإعلانات.' : 'Comprehensive workspace for Posts, Reels, and Ads.'}</p>
        </div>
        <div className="bg-white/10 p-1 rounded-lg flex gap-1 overflow-x-auto">
            {['Post', 'Reel', 'Ad'].map((m) => (
                <button key={m} onClick={() => setMode(m as any)} className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${mode === m ? 'bg-[#bf8339] text-[#0a1e3c] hover:text-white' : 'text-white hover:bg-white/10'}`}>
                    {m === 'Post' ? (isAr ? 'منشور' : 'Post') : m === 'Reel' ? (isAr ? 'ريلز/تيك توك' : 'Reel/TikTok') : (isAr ? 'إعلان ممول' : 'Paid Ad')}
                </button>
            ))}
        </div>
      </div>

      <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-5">
        <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
                {mode === 'Post' ? (isAr ? 'فكرة المنشور' : 'Post Idea') : mode === 'Reel' ? (isAr ? 'فكرة الفيديو' : 'Video Concept') : (isAr ? 'المنتج/الخدمة' : 'Product/Service')}
            </label>
            <textarea
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 focus:ring-[#bf8339] focus:border-[#bf8339] transition h-24 text-white placeholder-white/30"
                placeholder={mode === 'Ad' ? (isAr ? "صف المنتج والعرض..." : "Describe product & offer...") : (isAr ? "عن ماذا تريد أن تتحدث اليوم؟" : "What do you want to talk about?")}
                value={localTopic}
                onChange={(e) => setLocalTopic(e.target.value)}
            />
        </div>

        {mode === 'Reel' ? (
            /* REEL SPECIFIC INPUTS */
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <CustomGroupedSelect
                        label={isAr ? "المنصة المستهدفة" : "Target Platform"}
                        value={reelPlatform}
                        onChange={setReelPlatform}
                        groups={REEL_PLATFORM_GROUPS}
                        placeholder={isAr ? "اختر المنصة" : "Select Platform"}
                    />
                    <CustomGroupedSelect
                        label={isAr ? "المدة الزمنية" : "Duration"}
                        value={reelDuration}
                        onChange={setReelDuration}
                        groups={REEL_DURATION_GROUPS}
                        placeholder={isAr ? "اختر المدة" : "Select Duration"}
                    />
                    <CustomGroupedSelect
                        label={isAr ? "نوع المحتوى" : "Content Type"}
                        value={reelMode}
                        onChange={setReelMode}
                        groups={REEL_MODE_GROUPS}
                        placeholder={isAr ? "اختر النوع" : "Select Type"}
                    />
                    <div className="flex items-end">
                        <div className="flex items-center gap-2 bg-[#0a1e3c]/50 p-3 rounded-lg border border-white/10 w-full h-[42px]">
                            <input 
                                type="checkbox" 
                                checked={isVoiceoverOnly} 
                                onChange={e => setIsVoiceoverOnly(e.target.checked)} 
                                className="w-4 h-4 accent-[#bf8339]" 
                            />
                            <span className="text-sm text-white/90">{isAr ? 'تعليق صوتي فقط' : 'Voiceover Only'}</span>
                        </div>
                    </div>
                </div>
                
                {/* Advanced Context for Reel */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-white/10">
                     <AccordionSelect
                        label={isAr ? "اللغة" : "Language"}
                        value={language}
                        onChange={(val) => updateProjectState({language: val})}
                        groups={localizedLanguages}
                        placeholder={isAr ? "اختر اللغة" : "Select Language"}
                     />
                    <AccordionSelect 
                        label={isAr ? "اللهجة" : "Dialect"}
                        value={dialect}
                        onChange={(val) => updateProjectState({ dialect: val })}
                        groups={localizedDialects}
                        placeholder={isAr ? "اختر اللهجة" : "Select Dialect"}
                    />
                    <AccordionSelect 
                        label={isAr ? "القطاع" : "Industry"}
                        value={industry}
                        onChange={(val) => updateProjectState({ industry: val })}
                        groups={localizedIndustries}
                        placeholder={isAr ? "اختر المجال" : "Select Industry"}
                    />
                    <AccordionSelect
                        label={isAr ? "النبرة" : "Tone"}
                        value={tone}
                        onChange={(val) => updateProjectState({tone: val})}
                        groups={localizedTones}
                        placeholder={isAr ? "اختر النبرة" : "Select Tone"}
                    />
                </div>
            </div>
        ) : (
            /* STANDARD INPUTS FOR POST/AD */
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 <AccordionSelect
                    label={isAr ? "اللغة" : "Language"}
                    value={language}
                    onChange={(val) => updateProjectState({language: val})}
                    groups={localizedLanguages}
                    placeholder={isAr ? "اختر اللغة" : "Select Language"}
                 />
                <AccordionSelect 
                    label={isAr ? "اللهجة" : "Dialect"}
                    value={dialect}
                    onChange={(val) => updateProjectState({ dialect: val })}
                    groups={localizedDialects}
                    placeholder={isAr ? "اختر اللهجة" : "Select Dialect"}
                />
                <AccordionSelect 
                    label={isAr ? "القطاع" : "Industry"}
                    value={industry}
                    onChange={(val) => updateProjectState({ industry: val })}
                    groups={localizedIndustries}
                    placeholder={isAr ? "اختر المجال" : "Select Industry"}
                />
                {mode === 'Ad' ? (
                    <AccordionSelect 
                        label={isAr ? "المنصة" : "Platform"}
                        value={adPlatform}
                        onChange={(val) => setAdPlatform(val)}
                        groups={AD_PLATFORM_GROUPS}
                        placeholder={isAr ? "اختر المنصة" : "Select Platform"}
                    />
                ) : (
                    <AccordionSelect
                        label={isAr ? "النبرة" : "Tone"}
                        value={tone}
                        onChange={(val) => updateProjectState({tone: val})}
                        groups={localizedTones}
                        placeholder={isAr ? "اختر النبرة" : "Select Tone"}
                    />
                )}
            </div>
        )}

        {styleProfile && mode === 'Post' && (
            <div className="flex items-center gap-2 bg-[#bf8339]/10 p-3 rounded-lg border border-[#bf8339]/30">
                <input type="checkbox" checked={useUserStyle} onChange={e => setUseUserStyle(e.target.checked)} className="w-4 h-4 accent-[#bf8339]" />
                <span className="text-sm text-[#bf8339]">{isAr ? 'الكتابة بأسلوبي الخاص (Style Match)' : 'Use my writing style'}</span>
            </div>
        )}

        <Button onClick={handleGenerate} isLoading={isLoading} className="w-full md:w-auto">
            {mode === 'Post' ? (isAr ? 'توليد المنشور' : 'Generate Post') : mode === 'Reel' ? (isAr ? 'كتابة السيناريو الاحترافي' : 'Write Pro Script') : (isAr ? 'إنشاء الإعلان' : 'Generate Ad')}
        </Button>
      </div>

      {/* Results Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* POSTS */}
        {mode === 'Post' && postGenerations?.map((gen, idx) => (
            <div key={idx} className="bg-white/5 p-5 rounded-xl border border-white/10 hover:border-[#bf8339]/50 transition-all flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-[#bf8339]">{isAr ? 'الخيار' : 'Option'} {idx + 1}</h3>
                    <div className="flex gap-1 items-center">
                        <CopyButton text={gen.post} label={isAr ? 'نسخ' : 'Copy'} />
                        <ExportMenu content={gen.post} type="text" filename={`post-option-${idx+1}`} label={isAr ? "تصدير" : "Export"} />
                        <button onClick={() => handleSmartEdit(gen.post, 'rewrite')} className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20">{isAr ? 'إعادة صياغة' : 'Rewrite'}</button>
                    </div>
                </div>
                <p className="whitespace-pre-wrap text-sm text-white/90 leading-relaxed">{gen.post}</p>
                
                {gen.hooks && gen.hooks.length > 0 && (
                    <div className="bg-black/20 p-2 rounded">
                        <span className="text-xs text-white/50 block mb-1">{isAr ? 'خطافات بديلة (Hooks):' : 'Alternative Hooks:'}</span>
                        <ul className="list-disc list-inside text-xs text-white/80">
                            {gen.hooks.map((h, i) => <li key={i} className="flex justify-between group">
                                <span>{h}</span>
                                <CopyButton text={h} className="opacity-0 group-hover:opacity-100" label={isAr ? "نسخ" : "Copy"} />
                            </li>)}
                        </ul>
                    </div>
                )}

                <div className="flex flex-wrap gap-2 items-center">
                    {gen.hashtags?.map((h, i) => <span key={i} className="text-xs bg-[#2e4f8a] px-2 py-1 rounded text-blue-200">{h}</span>)}
                    <CopyButton text={gen.hashtags?.join(' ') || ''} className="!p-1 !bg-white/5" label="" />
                </div>
                {gen.imagePrompt && (
                    <div className="bg-[#bf8339]/10 p-3 rounded-lg text-xs text-[#bf8339] space-y-2 border border-[#bf8339]/20">
                        <div className="font-bold flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ImageIcon className="w-4 h-4"/>
                                {isAr ? 'اقتراح للصورة:' : 'Image Prompt:'}
                            </div>
                            {isAr && (
                                <div className="flex gap-1">
                                    <button 
                                        onClick={() => handleTranslatePrompt(idx, gen.imagePrompt || '')}
                                        disabled={isTranslating[idx]}
                                        className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded flex items-center gap-1 transition"
                                        title="Translate to English"
                                    >
                                        {isTranslating[idx] ? <Loader /> : <ArrowsRightLeftIcon className="w-3 h-3" />}
                                        {translatedPrompts[idx] ? 'عربي' : 'English'}
                                    </button>
                                    <button
                                        onClick={() => handleRegeneratePrompt(idx, gen.post)}
                                        disabled={isRegeneratingPrompt[idx]}
                                        className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded flex items-center gap-1 transition"
                                        title="Generate another image prompt"
                                    >
                                        {isRegeneratingPrompt[idx] ? <Loader /> : <SparklesIcon className="w-3 h-3" />}
                                        {isAr ? 'مقترح آخر' : 'Suggest Another'}
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="leading-relaxed text-white/90">
                            {translatedPrompts[idx] || gen.imagePrompt}
                        </p>
                        <div className="flex justify-end">
                             <CopyButton text={translatedPrompts[idx] || gen.imagePrompt} className="shrink-0" label={isAr ? "نسخ" : "Copy"} />
                        </div>
                    </div>
                )}
            </div>
        ))}

        {/* REELS & TIKTOK (ENHANCED UI) */}
        {mode === 'Reel' && reelResponse && activeReelScript && (
            <div className="col-span-1 md:col-span-2 bg-[#0a1e3c]/40 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                {/* 1. Version Tabs */}
                <div className="flex border-b border-white/10 bg-[#0a1e3c]/50">
                    {reelResponse.versions.map((ver, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveReelVersion(i)}
                            className={`flex-1 py-3 text-sm font-bold transition-colors ${activeReelVersion === i ? 'bg-[#bf8339] text-[#0a1e3c] hover:text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                        >
                            {ver.style === 'Energetic' ? (isAr ? '⚡ حيوي (Energetic)' : '⚡ Energetic') : ver.style === 'Storytelling' ? (isAr ? '📖 قصصي (Story)' : '📖 Storytelling') : ver.style}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* 2. Header Info */}
                    <div className="flex justify-between items-start mb-6 flex-wrap gap-4 border-b border-white/5 pb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30 uppercase tracking-wider font-bold">
                                    {activeReelScript.platform || "Reel/TikTok"}
                                </span>
                                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 uppercase tracking-wider font-bold">
                                    {activeReelScript.estimatedDuration || "30s"}
                                </span>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-2 leading-tight">{activeReelScript.title}</h3>
                        </div>
                        
                        <div className="flex gap-2 flex-wrap">
                            <Button 
                                variant="secondary" 
                                className="!py-1.5 !px-3 !text-xs !flex !items-center !gap-2 !rounded-full" 
                                onClick={handleGenerateSceneImages} 
                                isLoading={generatingSceneImages}
                            >
                                <VideoCameraIcon className="w-4 h-4" />
                                {isAr ? 'توليد ستوري بورد (Storyboard)' : 'Generate Storyboard'}
                            </Button>
                            <CopyButton 
                                text={`Title: ${activeReelScript.title}\n\n${activeReelScript.scenes.map(s => `[${s.time}] ${s.audio}`).join('\n')}`} 
                                label={isAr ? "نسخ النص" : "Copy Script"} 
                                className="!bg-[#bf8339] !text-white !rounded-full" 
                            />
                            <ExportMenu 
                                content={`Title: ${activeReelScript.title}\n\nHook: ${activeReelScript.hook}\n\nScenes:\n${activeReelScript.scenes.map(s => `[${s.time}] Visual: ${s.visual} | Audio: ${s.audio}`).join('\n')}`} 
                                type="text" 
                                filename="reel-script" 
                            />
                        </div>
                    </div>

                    {/* 3. THE HOOK (Highlighted) */}
                    <div className="mb-8 relative overflow-hidden rounded-xl border border-red-500/30 bg-gradient-to-r from-red-900/20 to-transparent p-6 group">
                        <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-br-lg uppercase tracking-widest shadow-lg">
                            The Hook (0:00 - 0:03)
                        </div>
                        <div className="mt-4 flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <p className="text-xl md:text-2xl text-white font-black leading-snug drop-shadow-md">"{activeReelScript.hook}"</p>
                            </div>
                            <div className="md:w-1/3 border-l border-white/10 pl-6 flex flex-col justify-center">
                                <span className="text-[10px] text-white/40 uppercase mb-1 block">{isAr ? 'الصوت المقترح' : 'Suggested Audio'}</span>
                                <p className="text-sm text-red-200">{activeReelScript.musicSuggestion || (isAr ? "موسيقى ترند حماسية" : "Trending energetic audio")}</p>
                            </div>
                        </div>
                        <CopyButton text={activeReelScript.hook} label={isAr ? "نسخ الخُطّاف" : "Copy Hook"} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition" />
                    </div>

                    {/* 4. SCENES TIMELINE */}
                    <div className="space-y-6 mb-8 relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10 hidden md:block"></div>
                        
                        {activeReelScript.scenes?.map((scene, i) => (
                            <div key={i} className="relative pl-0 md:pl-12">
                                {/* Timeline Dot */}
                                <div className="absolute left-1.5 top-6 w-5 h-5 bg-[#0a1e3c] border-2 border-[#bf8339] rounded-full z-10 hidden md:flex items-center justify-center text-[8px] font-bold text-[#bf8339]">
                                    {i+1}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-white/10 rounded-xl overflow-hidden bg-[#0a1e3c]/40 hover:border-[#bf8339]/50 transition-all">
                                    {/* Time Column */}
                                    <div className="md:col-span-1 bg-black/20 flex items-center justify-center p-2 border-b md:border-b-0 md:border-r border-white/10 text-xs font-mono text-[#bf8339]">
                                        {scene.time}
                                    </div>

                                    {/* Visual Column */}
                                    <div className="md:col-span-4 p-4 border-b md:border-b-0 md:border-r border-white/10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] text-purple-300 bg-purple-900/20 px-2 py-0.5 rounded border border-purple-500/20">{scene.camera}</span>
                                            {scene.ost && <span className="text-[10px] text-blue-300 bg-blue-900/20 px-2 py-0.5 rounded border border-blue-500/20">{isAr ? 'نص على الشاشة' : 'Overlay Text'}</span>}
                                        </div>
                                        <p className="text-sm text-white/90 leading-relaxed mb-3">{scene.visual}</p>
                                        
                                        {/* Generated Image */}
                                        {scene.imageUrl ? (
                                            <div className="relative group/img rounded-lg overflow-hidden border border-white/10 shadow-lg">
                                                <img src={scene.imageUrl} className="w-full aspect-video object-cover" alt="Scene" />
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-[8px] text-white/70 truncate">{scene.imagePrompt}</div>
                                            </div>
                                        ) : (
                                            <div className="h-24 bg-black/20 rounded-lg border border-dashed border-white/10 flex items-center justify-center">
                                                <span className="text-xs text-white/20">{isAr ? 'لا توجد صورة' : 'No Image'}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Audio Column */}
                                    <div className="md:col-span-7 p-4 bg-gradient-to-r from-[#bf8339]/5 to-transparent flex flex-col justify-center relative group/audio">
                                        <span className="text-[10px] text-white/40 uppercase mb-1 block">{isAr ? 'السيناريو الصوتي (Script)' : 'Audio Script'}</span>
                                        <p className="text-base text-white font-medium leading-relaxed">"{scene.audio}"</p>
                                        <CopyButton text={scene.audio} className="absolute top-2 right-2 opacity-0 group-hover/audio:opacity-100" label="" />
                                        
                                        {scene.ost && (
                                            <div className="mt-4 pt-3 border-t border-white/5">
                                                <span className="text-[10px] text-white/40 uppercase mb-1 block">{isAr ? 'نص يظهر على الشاشة' : 'On-Screen Text'}</span>
                                                <div className="bg-black/30 px-3 py-2 rounded text-sm text-blue-200 border-l-2 border-blue-400 font-bold">
                                                    {scene.ost}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 5. Footer Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 rounded-xl p-6 border border-white/10">
                        <div>
                            <h4 className="text-sm font-bold mb-3 text-white flex items-center gap-2">
                                <SparklesIcon className="w-4 h-4 text-[#bf8339]" />
                                {isAr ? 'نصيحة إضافية (B-Roll)' : 'B-Roll & Tips'}
                            </h4>
                            <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
                                {activeReelScript.bRoll?.map((b, i) => <li key={i}>{b}</li>)}
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs font-bold text-[#bf8339] uppercase tracking-wider mb-1">{isAr ? 'الختام (Outro)' : 'Outro'}</h4>
                                <p className="text-white/90 text-sm">"{activeReelScript.closingLine}"</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-[#bf8339] uppercase tracking-wider mb-1">{isAr ? 'الدعوة للفعل (CTA)' : 'CTA'}</h4>
                                <div className="flex items-center gap-2">
                                    <p className="text-white/90 text-sm font-bold bg-white/10 px-2 py-1 rounded">{activeReelScript.cta}</p>
                                    <CopyButton text={activeReelScript.cta} label="" className="!p-1" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Caption Block */}
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm text-white/50 font-bold uppercase tracking-wider">{isAr ? 'الكابشن المقترح' : 'Caption & Hashtags'}</h4>
                            <CopyButton text={`${activeReelScript.caption}\n\n${activeReelScript.hashtags?.join(' ')}`} label={isAr ? "نسخ الكل" : "Copy All"} />
                        </div>
                        <div className="bg-black/20 p-4 rounded-xl border border-white/10 text-sm text-white/80 whitespace-pre-wrap">
                            {activeReelScript.caption}
                            <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-2">
                                {activeReelScript.hashtags?.map((h, i) => (
                                    <span key={i} className="text-blue-400 hover:text-blue-300 cursor-pointer">#{h.replace('#', '')}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* ADS */}
        {mode === 'Ad' && adGenerations?.map((ad, idx) => (
            <div key={idx} className="bg-white/5 p-5 rounded-xl border border-white/10">
                <div className="mb-3">
                    <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded uppercase">{ad.platform}</span>
                </div>
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">{ad.headline}</h4>
                    <div className="flex gap-1">
                        <CopyButton text={ad.headline} label={isAr ? "نسخ" : "Copy"} />
                        <ExportMenu content={`Headline: ${ad.headline}\nText: ${ad.primaryText}\nCTA: ${ad.cta}`} type="text" filename={`ad-${idx}`} label={isAr ? "تصدير" : "Export"} />
                    </div>
                </div>
                <div className="relative group/text mb-4">
                     <p className="text-sm text-white/80 whitespace-pre-wrap">{ad.primaryText}</p>
                     <CopyButton text={ad.primaryText} className="absolute top-0 left-0 opacity-0 group-hover/text:opacity-100" label={isAr ? "نسخ" : "Copy"} />
                </div>
                
                {ad.description && <p className="text-xs text-white/60 mb-2 border-r-2 border-white/20 pr-2">{ad.description}</p>}
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                    <span className="font-bold text-[#bf8339]">{ad.cta}</span>
                    <div className="text-xs text-white/50 max-w-[50%] text-left flex items-center gap-2">
                        {ad.targeting}
                        <CopyButton text={ad.targeting} className="!p-0.5" label="" />
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Smart Edit Result Overlay */}
      {editingId && editedText && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-[#0a1e3c] p-6 rounded-xl border border-[#bf8339] max-w-lg w-full">
                  <h3 className="font-bold text-[#bf8339] mb-4">{isAr ? 'نتيجة التعديل الذكي' : 'Smart Edit Result'}</h3>
                  <textarea readOnly className="w-full bg-black/20 p-3 rounded text-white h-48 mb-4" value={editedText} />
                  <div className="flex gap-2">
                      <Button onClick={() => {navigator.clipboard.writeText(editedText); setEditingId(null);}}>{isAr ? 'نسخ وإغلاق' : 'Copy & Close'}</Button>
                      <ExportMenu content={editedText} type="text" filename="edited-text" />
                      <Button variant="secondary" onClick={() => setEditingId(null)}>{isAr ? 'إلغاء' : 'Cancel'}</Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default CreatePostView;
