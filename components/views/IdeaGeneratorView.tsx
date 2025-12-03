
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import Button from '../Button';
import { Loader, LightBulbIcon, MagicWandIcon, CreatePostIcon, ImageIcon, SparklesIcon } from '../Icons';
import { INDUSTRIES_GROUPED, LANGUAGES_GROUPED, ARABIC_DIALECTS_GROUPED, IDEA_TYPES, ARCHIVE_STORAGE_KEY } from '../../constants';
import * as geminiService from '../../services/geminiService';
import { setItem, getItem, removeItem } from '../../utils/localStorage';
import { CreativeIdea, ArchivedItem } from '../../types';
import AccordionSelect from '../AccordionSelect';
import CustomGroupedSelect from '../CustomGroupedSelect';
import CopyButton from '../CopyButton';

const IdeaGeneratorView: React.FC = () => {
    const { topic, industry, language, dialect, updateProjectState, appLanguage } = useContext(ProjectContext);
    const isAr = appLanguage === 'ar';
    
    const [localTopic, setLocalTopic] = useState(topic);
    const [targetAudience, setTargetAudience] = useState('');
    const [ideaType, setIdeaType] = useState(IDEA_TYPES[0].options[0].value);
    
    const [ideas, setIdeas] = useState<CreativeIdea[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // UI State for Tab Selection per Idea
    const [activePromptTab, setActivePromptTab] = useState<Record<number, 'text' | 'image'>>({});

    // Execution State for individual ideas
    const [executionResults, setExecutionResults] = useState<Record<number, { type: 'text' | 'image', content: string, loading: boolean }>>({});

    // Translation State for Image Prompts
    const [translatedPrompts, setTranslatedPrompts] = useState<Record<string, string>>({}); // Key: ideaIndex-type
    const [isTranslating, setIsTranslating] = useState<Record<string, boolean>>({});

    // Check for restored draft
    useEffect(() => {
        const draft = getItem<ArchivedItem>('editDraft');
        if (draft && draft.type === 'Idea') {
            setIdeas(draft.content);
            removeItem('editDraft');
        }
    }, []);

    const localizedIdeaTypes = useMemo(() => IDEA_TYPES.map(g => ({
        label: isAr ? g.label.ar : g.label.en,
        options: g.options.map(o => ({ label: isAr ? o.label.ar : o.label.en, value: o.value }))
    })), [isAr]);

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

    const handleGenerate = async () => {
        setIsLoading(true);
        setIdeas([]);
        setExecutionResults({});
        setActivePromptTab({});
        setTranslatedPrompts({});
        try {
            updateProjectState({ topic: localTopic });
            const result = await geminiService.generateCreativeIdeas(localTopic, industry, language, dialect, targetAudience, ideaType);
            setIdeas(result);
            
            const archive = getItem(ARCHIVE_STORAGE_KEY, []);
            archive.unshift({ 
                id: Date.now().toString(), 
                type: 'Idea', 
                content: result, 
                timestamp: new Date().toISOString() 
            });
            setItem(ARCHIVE_STORAGE_KEY, archive);

        } catch (e: any) {
            console.error(e);
            alert(e.message || (isAr ? "حدث خطأ أثناء توليد الأفكار." : "Error generating ideas."));
        } finally {
            setIsLoading(false);
        }
    };

    const handleTranslatePrompt = async (index: number, type: 'text' | 'image', text: string) => {
        const key = `${index}-${type}`;
        if (translatedPrompts[key]) {
            const newPrompts = {...translatedPrompts};
            delete newPrompts[key];
            setTranslatedPrompts(newPrompts);
            return;
        }

        setIsTranslating(prev => ({...prev, [key]: true}));
        try {
            const result = await geminiService.translateToEnglish(text);
            setTranslatedPrompts(prev => ({...prev, [key]: result}));
        } catch (e) {
            console.error("Translation failed", e);
        } finally {
            setIsTranslating(prev => ({...prev, [key]: false}));
        }
    };

    const handleExecuteIdea = async (index: number, type: 'text' | 'image', idea: CreativeIdea) => {
        let promptToUse = '';

        if (type === 'text') {
            promptToUse = idea.textPrompt || idea.executionPrompt || `Write a creative ${idea.platform} post about ${idea.title}: ${idea.description}`;
        } else {
            if (idea.imagePrompt) {
                promptToUse = idea.imagePrompt;
            } else {
                promptToUse = `${idea.title}, ${idea.description.substring(0, 100)}`;
            }
        }

        if (!promptToUse) {
            alert(isAr ? "لا يوجد أمر تنفيذي متاح لهذا الخيار." : "No prompt available for this option.");
            return;
        }

        setExecutionResults(prev => ({ ...prev, [index]: { type, content: '', loading: true } }));
        try {
            let result = '';
            if (type === 'text') {
                result = await geminiService.generateRawContent(promptToUse);
            } else {
                const base64 = await geminiService.generateImage(promptToUse, 'gemini-2.5-flash-image', '1:1', 'Photorealistic');
                result = `data:image/jpeg;base64,${base64}`;
            }
            setExecutionResults(prev => ({ ...prev, [index]: { type, content: result, loading: false } }));
        } catch (e: any) {
            console.error(e);
            setExecutionResults(prev => ({ ...prev, [index]: { type, content: e.message || (isAr ? 'فشل التنفيذ. يرجى المحاولة مرة أخرى.' : 'Execution failed. Try again.'), loading: false } }));
        }
    };

    const togglePromptTab = (index: number, tab: 'text' | 'image') => {
        setActivePromptTab(prev => ({ ...prev, [index]: tab }));
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div>
                <h2 className="text-3xl font-bold text-[#bf8339] flex items-center gap-2">
                    <LightBulbIcon className="w-8 h-8" />
                    {isAr ? 'مولد الأفكار الإبداعي' : 'Creative Idea Generator'}
                </h2>
                <p className="text-white/70 mt-1">
                    {isAr ? 'أداة متقدمة للمسوقين، المصممين، وكتاب المحتوى لتوليد أفكار خارج الصندوق مع استراتيجيات تنفيذية.' : 'Advanced tool for marketers and creators to generate out-of-the-box ideas with execution strategies.'}
                </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                     <div>
                        <label className="block text-sm text-white/80 mb-1">{isAr ? 'المجال / الموضوع العام' : 'Topic / Niche'}</label>
                        <input 
                            type="text" 
                            value={localTopic} 
                            onChange={e => setLocalTopic(e.target.value)} 
                            className="w-full bg-black/20 border border-white/20 rounded-lg p-3 text-white focus:border-[#bf8339]"
                            placeholder={isAr ? "مثال: تسويق القهوة، تصميم داخلي..." : "e.g., Coffee Marketing, Interior Design..."}
                        />
                    </div>
                    <AccordionSelect 
                        label={isAr ? "القطاع" : "Industry"}
                        value={industry}
                        onChange={(val) => updateProjectState({ industry: val })}
                        groups={localizedIndustries}
                        placeholder={isAr ? "اختر القطاع" : "Select Industry"}
                    />
                    <CustomGroupedSelect 
                        label={isAr ? "نوع الأفكار المطلوبة" : "Idea Type"}
                        value={ideaType}
                        onChange={setIdeaType}
                        groups={localizedIdeaTypes}
                        placeholder={isAr ? "اختر النوع" : "Select Type"}
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-sm text-white/80 mb-1">{isAr ? 'الجمهور المستهدف' : 'Target Audience'}</label>
                        <input 
                            type="text" 
                            value={targetAudience} 
                            onChange={e => setTargetAudience(e.target.value)} 
                            className="w-full bg-black/20 border border-white/20 rounded-lg p-3 text-white focus:border-[#bf8339]"
                            placeholder={isAr ? "مثال: شباب 18-25، أصحاب شركات..." : "e.g., Youth 18-25, Business Owners..."}
                        />
                    </div>
                    <AccordionSelect 
                        label={isAr ? "اللغة" : "Language"}
                        value={language}
                        onChange={(val) => updateProjectState({ language: val })}
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
                </div>

                <Button onClick={handleGenerate} isLoading={isLoading} className="w-full py-4 text-lg font-bold shadow-xl shadow-[#bf8339]/10">
                    {isAr ? 'توليد 5 أفكار إبداعية + أوامر تنفيذ' : 'Generate 5 Creative Ideas + Execution Prompts'}
                </Button>
            </div>

            {isLoading && <div className="flex justify-center py-10"><Loader /></div>}

            {ideas.length > 0 && (
                <div className="space-y-8 animate-fade-in">
                    {ideas.map((idea, idx) => {
                        const currentTab = activePromptTab[idx] || 'text';
                        const currentPrompt = currentTab === 'text' 
                            ? (idea.textPrompt || idea.executionPrompt || (isAr ? 'لا يوجد نص' : 'No text prompt')) 
                            : (idea.imagePrompt || idea.executionPrompt || (isAr ? 'لا يوجد وصف بصري' : 'No visual prompt'));
                        
                        const translateKey = `${idx}-${currentTab}`;
                        const isTrans = isTranslating[translateKey];
                        const translatedText = translatedPrompts[translateKey];
                        const displayedPrompt = translatedText || currentPrompt;

                        return (
                        <div key={idx} className="bg-[#0a1e3c]/40 backdrop-blur border border-white/10 rounded-xl overflow-hidden hover:border-[#bf8339]/50 transition group shadow-lg">
                            {/* Header */}
                            <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="bg-[#bf8339] text-[#0a1e3c] w-8 h-8 rounded-full flex items-center justify-center font-bold">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{idea.title}</h3>
                                        <p className="text-xs text-white/50">{idea.platform} • {idea.difficulty}</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded text-xs border ${idea.difficulty === 'Easy' ? 'border-green-500/30 text-green-400 bg-green-500/10' : idea.difficulty === 'Medium' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'}`}>
                                    {idea.difficulty}
                                </div>
                            </div>

                            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* SECTION 1: THE IDEA & STRATEGY */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h4 className="text-[#bf8339] font-bold text-sm uppercase tracking-wider border-b border-[#bf8339]/20 pb-1">💡 {isAr ? 'الفكرة (Concept)' : 'Concept'}</h4>
                                        <p className="text-white/80 leading-relaxed text-sm">{idea.description}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-[#bf8339] font-bold text-sm uppercase tracking-wider border-b border-[#bf8339]/20 pb-1">🎯 {isAr ? 'لماذا ستنجح؟ (Strategy)' : 'Why it works (Strategy)'}</h4>
                                        <p className="text-white/80 leading-relaxed text-sm bg-[#2e4f8a]/20 p-3 rounded-lg border-r-2 border-[#2e4f8a]">
                                            {idea.targetAudienceAnalysis}
                                        </p>
                                    </div>
                                </div>

                                {/* SECTION 2: THE EXECUTION */}
                                <div className="space-y-6 flex flex-col h-full">
                                    <div className="space-y-2 flex-grow">
                                        <div className="flex justify-between items-center border-b border-[#bf8339]/20 pb-1">
                                             <div className="flex gap-2">
                                                 <button 
                                                    onClick={() => togglePromptTab(idx, 'text')}
                                                    className={`text-xs font-bold px-2 py-1 rounded transition ${currentTab === 'text' ? 'bg-[#bf8339] text-[#0a1e3c]' : 'text-white/50 hover:text-white'}`}
                                                 >
                                                    {isAr ? 'أمر النص (Text Prompt)' : 'Text Prompt'}
                                                 </button>
                                                 <button 
                                                    onClick={() => togglePromptTab(idx, 'image')}
                                                    className={`text-xs font-bold px-2 py-1 rounded transition ${currentTab === 'image' ? 'bg-[#bf8339] text-[#0a1e3c]' : 'text-white/50 hover:text-white'}`}
                                                 >
                                                    {isAr ? 'أمر الصورة (Image Prompt)' : 'Image Prompt'}
                                                 </button>
                                             </div>
                                             <div className="flex gap-1 items-center">
                                                 {isAr && currentTab === 'image' && (
                                                     <button 
                                                        onClick={() => handleTranslatePrompt(idx, 'image', currentPrompt)}
                                                        className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded flex items-center gap-1 transition"
                                                        disabled={isTrans}
                                                     >
                                                        {isTrans ? <Loader /> : <SparklesIcon className="w-3 h-3" />}
                                                        {translatedText ? 'الأصل (عربي)' : 'ترجمة EN'}
                                                     </button>
                                                 )}
                                                 <CopyButton text={displayedPrompt} label={isAr ? "نسخ" : "Copy"} className="!py-0.5 !px-2" />
                                             </div>
                                        </div>
                                        <div className="bg-black/30 p-4 rounded-lg border border-white/10 font-mono text-[11px] text-white/60 leading-normal max-h-32 overflow-y-auto custom-scrollbar">
                                            {displayedPrompt}
                                        </div>
                                    </div>

                                    {/* EXECUTION STUDIO */}
                                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 mt-auto">
                                        <h5 className="text-xs font-bold text-white/50 mb-3 uppercase text-center">🚀 {isAr ? 'استوديو التنفيذ الفوري' : 'Execution Studio'}</h5>
                                        
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <button 
                                                onClick={() => handleExecuteIdea(idx, 'text', idea)}
                                                className="bg-[#2e4f8a] hover:bg-[#3d63a8] text-white py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
                                            >
                                                <CreatePostIcon className="w-4 h-4" /> {isAr ? 'توليد نص' : 'Generate Text'}
                                            </button>
                                            <button 
                                                onClick={() => handleExecuteIdea(idx, 'image', idea)}
                                                className="bg-[#bf8339] hover:bg-[#d69545] text-[#0a1e3c] py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
                                            >
                                                <ImageIcon className="w-4 h-4" /> {isAr ? 'توليد صورة' : 'Generate Image'}
                                            </button>
                                        </div>

                                        {/* RESULT DISPLAY */}
                                        {executionResults[idx] && (
                                            <div className="animate-fade-in bg-black/40 rounded border border-white/10 p-3 relative">
                                                {executionResults[idx].loading ? (
                                                    <div className="flex justify-center py-4"><Loader /></div>
                                                ) : (
                                                    <>
                                                        <div className="absolute top-2 left-2 z-10">
                                                            {executionResults[idx].type === 'text' ? (
                                                                <CopyButton text={executionResults[idx].content} />
                                                            ) : (
                                                                <a href={executionResults[idx].content} download={`idea-${idx}.jpg`} className="bg-white/10 hover:bg-white/20 p-1 rounded text-white block"><ImageIcon className="w-4 h-4"/></a>
                                                            )}
                                                        </div>
                                                        
                                                        {executionResults[idx].type === 'text' ? (
                                                            <div className="prose prose-invert prose-sm max-h-60 overflow-y-auto text-xs whitespace-pre-wrap">
                                                                {executionResults[idx].content}
                                                            </div>
                                                        ) : (
                                                            <img src={executionResults[idx].content} alt="Generated Idea" className="w-full rounded h-auto" />
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );})}
                </div>
            )}
        </div>
    );
};

export default IdeaGeneratorView;
