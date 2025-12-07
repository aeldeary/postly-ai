
import React, { useState, useContext, useEffect, useMemo, useRef } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import Button from '../Button';
import { SpeakerWaveIcon, Loader, SparklesIcon, ArrowsRightLeftIcon, DocumentTextIcon } from '../Icons';
import * as geminiService from '../../services/geminiService';
import { setItem, getItem } from '../../utils/localStorage';
import { ARCHIVE_STORAGE_KEY, VOICE_LIBRARY, LANGUAGES_GROUPED, ARABIC_DIALECTS_GROUPED, TONES_GROUPED } from '../../constants';
import VoiceInput from '../VoiceInput';
import AccordionSelect from '../AccordionSelect';

const CreateAudioView: React.FC = () => {
    const { appLanguage, language, activeDraft, updateProjectState } = useContext(ProjectContext);
    const isAr = appLanguage === 'ar';

    const [text, setText] = useState('');
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Voice Selection State
    const [voiceCategory, setVoiceCategory] = useState<'male' | 'female' | 'kids'>('male');
    const [selectedVoiceId, setSelectedVoiceId] = useState<string>(''); // Will init in useEffect

    // New State for Dialect and Tone
    const [dialect, setDialect] = useState('');
    const [tone, setTone] = useState('');
    const [previewLoading, setPreviewLoading] = useState<string | null>(null);

    // Translation & Optimization State
    const [targetLang, setTargetLang] = useState(language || (isAr ? 'Arabic' : 'English'));
    const [processingAction, setProcessingAction] = useState<string | null>(null); // 'improve' | 'tashkeel' | 'translate' | null
    const [enableTashkeel, setEnableTashkeel] = useState(true);

    // Refs for Audio Management (Prevent Overlap & Race Conditions)
    const currentAudioRef = useRef<HTMLAudioElement | null>(null);
    const activePreviewIdRef = useRef<string | null>(null);

    // Determine current voice list based on target language
    const currentVoiceLibrary = useMemo(() => {
        const langCode = targetLang.toLowerCase();
        if (langCode.includes('arabic') || langCode.includes('ar')) {
            return VOICE_LIBRARY.ar;
        } else {
            return VOICE_LIBRARY.en;
        }
    }, [targetLang]);

    // Initial Selection & Reset when Library Changes
    useEffect(() => {
        if (currentVoiceLibrary && currentVoiceLibrary[voiceCategory] && currentVoiceLibrary[voiceCategory].length > 0) {
            const firstVoice = currentVoiceLibrary[voiceCategory][0];
            // Only reset if current selection is invalid for new library
            const currentVoiceExists = Object.values(currentVoiceLibrary).flat().some((v: any) => v.id === selectedVoiceId);
            if (!selectedVoiceId || !currentVoiceExists) {
                setSelectedVoiceId(firstVoice.id);
            }
        }
    }, [currentVoiceLibrary, voiceCategory]);

    // Check for restored draft from Context
    useEffect(() => {
        if (activeDraft && activeDraft.type === 'Audio') {
            setText(activeDraft.content.text);
            // Try to restore voice by name if possible, though ID structure changed
            // This is best effort
            if (activeDraft.content.voice) {
                 // Logic to find voice by name if needed, skipped for simplicity as draft format might differ
            }
            // Clean up context
            updateProjectState({ activeDraft: null });
        }
    }, [activeDraft]);

    // Cleanup Blob URL & Stop Audio on Unmount
    useEffect(() => {
        return () => {
            if (audioSrc) {
                URL.revokeObjectURL(audioSrc);
            }
            if (currentAudioRef.current) {
                currentAudioRef.current.pause();
                currentAudioRef.current = null;
            }
        };
    }, [audioSrc]);

    const localizedLanguages = useMemo(() => LANGUAGES_GROUPED.map(g => ({
        label: isAr ? g.label.ar : g.label.en,
        options: g.options.map(o => ({ label: isAr ? o.label.ar : o.label.en, value: o.value }))
    })), [isAr]);

    const localizedDialects = useMemo(() => ARABIC_DIALECTS_GROUPED.map(g => ({
        label: isAr ? g.label.ar : g.label.en,
        options: g.options.map(o => ({ label: isAr ? o.label.ar : o.label.en, value: o.value }))
    })), [isAr]);

    const localizedTones = useMemo(() => TONES_GROUPED.map(g => ({
        label: isAr ? g.label.ar : g.label.en,
        options: g.options.map(o => ({ label: isAr ? o.label.ar : o.label.en, value: o.value }))
    })), [isAr]);

    // Helper to get selected voice object
    const getSelectedVoice = () => {
        const allVoices = [
            ...currentVoiceLibrary.male, 
            ...currentVoiceLibrary.female, 
            ...currentVoiceLibrary.kids
        ];
        return allVoices.find(v => v.id === selectedVoiceId);
    };

    // --- Action Handlers ---

    const handleImproveText = async () => {
        if (!text.trim()) return (window as any).toast?.(isAr ? 'يرجى كتابة نص' : 'Enter text first', 'error');
        setProcessingAction('improve');
        try {
            const effectiveDialect = dialect || (isAr ? "Standard" : "Neutral");
            const effectiveTone = tone || (isAr ? "Natural" : "Natural");
            const isChildVoice = voiceCategory === 'kids';

            const improved = await geminiService.improveTextForAudio(
                text, 
                targetLang, 
                effectiveDialect, 
                effectiveTone, 
                isChildVoice
            );
            setText(improved);
            (window as any).toast?.(isAr ? 'تم تحسين النص' : 'Text Improved', 'success');
        } catch (e) {
            console.error(e);
        } finally {
            setProcessingAction(null);
        }
    };

    const handleAddTashkeel = async () => {
        if (!text.trim()) return (window as any).toast?.(isAr ? 'يرجى كتابة نص' : 'Enter text first', 'error');
        setProcessingAction('tashkeel');
        try {
            const vocalized = await geminiService.addTashkeel(text);
            setText(vocalized);
            (window as any).toast?.(isAr ? 'تم إضافة التشكيل' : 'Tashkeel Added', 'success');
        } catch (e) {
            console.error(e);
        } finally {
            setProcessingAction(null);
        }
    };

    const handleTranslate = async () => {
        if (!text.trim()) return (window as any).toast?.(isAr ? 'يرجى كتابة نص' : 'Enter text first', 'error');
        setProcessingAction('translate');
        try {
            const translated = await geminiService.translateText(text, targetLang);
            setText(translated);
            (window as any).toast?.(isAr ? 'تمت الترجمة' : 'Translated', 'success');
        } catch (e) {
            console.error(e);
        } finally {
            setProcessingAction(null);
        }
    };

    const handleGenerate = async () => {
        if (!text.trim()) {
            (window as any).toast?.(isAr ? 'يرجى كتابة نص أولاً' : 'Please enter text first', 'error');
            return;
        }

        const voiceObj = getSelectedVoice();
        if (!voiceObj) return;

        // Stop any preview audio if playing
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current = null;
        }

        setIsLoading(true);
        if (audioSrc) URL.revokeObjectURL(audioSrc);
        setAudioSrc(null);

        try {
            let langCode = targetLang;
            // Hint for API language code if Arabic dialect selected
            if (targetLang.toLowerCase().includes('arabic') || targetLang.toLowerCase().includes('ar')) {
                 if (dialect.includes('Egyptian')) langCode = 'ar-EG';
                 else if (dialect.includes('Saudi') || dialect.includes('Najdi')) langCode = 'ar-SA';
                 else if (dialect.includes('Moroccan')) langCode = 'ar-MA';
                 else langCode = 'ar-SA'; // Default
            }

            // Use the mapped Gemini voice name
            const base64Audio = await geminiService.generateSpeech(text, voiceObj.gemini, langCode);
            const wavBlob = pcmToWav(base64Audio);
            const url = URL.createObjectURL(wavBlob);
            setAudioSrc(url);

            const archive = getItem(ARCHIVE_STORAGE_KEY, []);
            archive.unshift({ 
                id: Date.now().toString(), 
                type: 'Audio', 
                content: { text, voice: voiceObj.name, url }, 
                timestamp: new Date().toISOString() 
            });
            setItem(ARCHIVE_STORAGE_KEY, archive);

        } catch (error: any) {
            console.error(error);
            (window as any).toast?.(error.message || 'Generation failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePreviewVoice = async (e: React.MouseEvent, voice: any) => {
        e.stopPropagation();
        
        // 1. Stop any existing audio immediately
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
            currentAudioRef.current = null;
        }

        const previewId = voice.id;
        activePreviewIdRef.current = previewId;
        setPreviewLoading(previewId);

        try {
            const isChild = voiceCategory === 'kids';
            let sampleText = isAr ? "مرحباً، هذا نموذج لصوتي." : "Hello, this is a preview of my voice.";
            
            if (isChild) {
                 sampleText = isAr ? "أهلاً! أنا عمري سبع سنوات، وهذا صوتي!" : "Hi! I am seven years old, and this is my voice!";
            }

            const base64Audio = await geminiService.generateSpeech(sampleText, voice.gemini, targetLang);
            
            // 2. Race Condition Check: If user clicked another voice while waiting
            if (activePreviewIdRef.current !== previewId) {
                return; // Discard this result, it's stale
            }

            const wavBlob = pcmToWav(base64Audio);
            const url = URL.createObjectURL(wavBlob);
            const audio = new Audio(url);
            
            currentAudioRef.current = audio;
            
            audio.onended = () => {
                URL.revokeObjectURL(url);
                if (activePreviewIdRef.current === previewId) {
                    setPreviewLoading(null);
                }
            };
            
            audio.onerror = () => {
                URL.revokeObjectURL(url);
                if (activePreviewIdRef.current === previewId) {
                    setPreviewLoading(null);
                }
            };

            await audio.play();
        } catch (error) {
            console.error("Preview failed", error);
            if (activePreviewIdRef.current === previewId) {
                setPreviewLoading(null);
            }
        }
        // Note: We don't clear previewLoading in 'finally' generically because
        // we want the spinner to persist until play starts or error, which is handled above.
        // If we clear it here, it might flash before playing starts in some browsers.
        // However, if the promise rejects, we handled it in catch.
    };

    const pcmToWav = (base64: string) => {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        const wavHeader = new ArrayBuffer(44);
        const view = new DataView(wavHeader);
        const sampleRate = 24000;
        const numChannels = 1;
        const bitsPerSample = 16;

        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + len, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numChannels * bitsPerSample / 8, true);
        view.setUint16(32, numChannels * bitsPerSample / 8, true);
        view.setUint16(34, bitsPerSample, true);
        writeString(view, 36, 'data');
        view.setUint32(40, len, true);

        return new Blob([wavHeader, bytes], { type: 'audio/wav' });
    };

    const writeString = (view: DataView, offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="border-b border-white/10 pb-4">
                <h2 className="text-3xl font-bold text-[#bf8339] flex items-center gap-2">
                    <SpeakerWaveIcon className="w-8 h-8" />
                    {isAr ? 'إنشاء صوت' : 'AI Voice Generator'}
                </h2>
                <p className="text-white/60 mt-1">
                    {isAr 
                        ? 'حول نصوصك إلى كلام واقعي جداً باستخدام شخصيات صوتية متنوعة (ذكر، أنثى، أطفال).' 
                        : 'Turn your text into ultra-realistic speech with diverse voice personas (Male, Female, Kids).'}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Panel: Settings */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-5 shadow-lg">
                        <h3 className="text-[#bf8339] font-bold mb-4 text-sm uppercase tracking-wider border-b border-white/10 pb-2">
                            {isAr ? 'إعدادات الصوت واللغة' : 'Voice & Language Settings'}
                        </h3>
                        
                        <div className="space-y-4">
                            <AccordionSelect 
                                label={isAr ? "اللغة المستهدفة" : "Target Language"}
                                value={targetLang}
                                onChange={setTargetLang}
                                groups={localizedLanguages}
                                placeholder={isAr ? "اختر اللغة" : "Select Language"}
                            />

                            <AccordionSelect 
                                label={isAr ? "اللهجة (للتحويل العامي)" : "Dialect (For Slang)"}
                                value={dialect}
                                onChange={(val) => setDialect(val)}
                                groups={localizedDialects}
                                placeholder={isAr ? "اختر اللهجة" : "Select Dialect"}
                            />

                            <AccordionSelect
                                label={isAr ? "النبرة (عاطفة الكلام)" : "Tone (Emotion)"}
                                value={tone}
                                onChange={(val) => setTone(val)}
                                groups={localizedTones}
                                placeholder={isAr ? "اختر النبرة" : "Select Tone"}
                            />
                        </div>

                        {/* Voice Selector */}
                        <div className="mt-6">
                            <label className="block text-xs text-white/60 mb-2">{isAr ? 'اختر الصوت' : 'Select Voice'}</label>
                            
                            {/* Category Tabs - High Specificity Colors for Dark/Light consistency */}
                            <div className="flex !bg-[#000000]/20 p-1 rounded-lg mb-3">
                                <button 
                                    onClick={() => setVoiceCategory('male')} 
                                    className={`flex-1 py-1.5 text-xs rounded transition font-bold ${
                                        voiceCategory === 'male' 
                                        ? '!bg-[#bf8339] !text-[#0a1e3c]' 
                                        : '!text-[#ffffff]/60 hover:!text-[#ffffff]'
                                    }`}
                                >
                                    {isAr ? 'ذكور' : 'Male'}
                                </button>
                                <button 
                                    onClick={() => setVoiceCategory('female')} 
                                    className={`flex-1 py-1.5 text-xs rounded transition font-bold ${
                                        voiceCategory === 'female' 
                                        ? '!bg-[#bf8339] !text-[#0a1e3c]' 
                                        : '!text-[#ffffff]/60 hover:!text-[#ffffff]'
                                    }`}
                                >
                                    {isAr ? 'إناث' : 'Female'}
                                </button>
                                <button 
                                    onClick={() => setVoiceCategory('kids')} 
                                    className={`flex-1 py-1.5 text-xs rounded transition font-bold ${
                                        voiceCategory === 'kids' 
                                        ? '!bg-[#bf8339] !text-[#0a1e3c]' 
                                        : '!text-[#ffffff]/60 hover:!text-[#ffffff]'
                                    }`}
                                >
                                    {isAr ? 'أطفال' : 'Kids'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                                {currentVoiceLibrary[voiceCategory].map((voice: any) => (
                                    <button
                                        key={voice.id}
                                        onClick={() => setSelectedVoiceId(voice.id)}
                                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all relative group text-start ${
                                            selectedVoiceId === voice.id 
                                                ? 'bg-[#bf8339]/10 border-[#bf8339] shadow-md' 
                                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${selectedVoiceId === voice.id ? 'bg-[#bf8339] text-[#0a1e3c]' : 'bg-white/10 text-white'}`}>
                                            {voiceCategory === 'male' ? '👨' : voiceCategory === 'female' ? '👩' : '👶'}
                                        </div>
                                        <div className="flex-1">
                                            <div className={`font-bold text-sm flex items-center gap-2 ${selectedVoiceId === voice.id ? 'text-[#bf8339]' : 'text-white'}`}>
                                                {voice.name}
                                            </div>
                                            <div className="text-xs opacity-60 flex gap-1 items-center">
                                                {voice.label}
                                                <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                                                <span className="italic">{voice.desc}</span>
                                            </div>
                                        </div>
                                        
                                        {/* Preview Button (Always visible on selected, hover otherwise) */}
                                        <div 
                                            onClick={(e) => handlePreviewVoice(e, voice)}
                                            className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${
                                                selectedVoiceId === voice.id ? 'bg-[#bf8339] text-[#0a1e3c]' : 'bg-white/20 text-white opacity-0 group-hover:opacity-100'
                                            }`}
                                            title={isAr ? "معاينة" : "Preview"}
                                        >
                                            {previewLoading === voice.id ? (
                                                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Input & Output */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 relative">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm text-[#bf8339] font-bold">
                                {isAr ? 'النص المراد تحويله' : 'Script to Speak'}
                            </label>
                            <VoiceInput onTranscript={setText} />
                        </div>
                        
                        <textarea 
                            className="w-full bg-black/20 border border-white/20 rounded-lg p-4 h-64 text-white focus:border-[#bf8339] transition placeholder-white/30 leading-relaxed resize-none"
                            placeholder={isAr ? "اكتب النص هنا... (سيتم تحويله للهجة المختارة عند الضغط على زر التحسين)" : "Type your script here..."}
                            value={text}
                            onChange={e => setText(e.target.value)}
                        />

                        <div className="mt-4 flex gap-3 flex-wrap">
                            {/* Improve Button */}
                            <button
                                onClick={handleImproveText}
                                disabled={!!processingAction || !text}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-xs transition border ${
                                    processingAction === 'improve'
                                        ? 'bg-white/10 text-white/50 cursor-wait border-transparent'
                                        : 'bg-white/5 text-white/90 border-white/10 hover:bg-[#bf8339] hover:text-[#0a1e3c] hover:border-[#bf8339]'
                                }`}
                            >
                                {processingAction === 'improve' ? <Loader /> : <SparklesIcon className="w-4 h-4" />}
                                {isAr ? 'تحسين الصياغة' : 'Improve Text'}
                            </button>

                            {/* Tashkeel Button */}
                            <button
                                onClick={handleAddTashkeel}
                                disabled={!!processingAction || !text}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-xs transition border ${
                                    processingAction === 'tashkeel'
                                        ? 'bg-white/10 text-white/50 cursor-wait border-transparent'
                                        : 'bg-white/5 text-white/90 border-white/10 hover:bg-[#bf8339] hover:text-[#0a1e3c] hover:border-[#bf8339]'
                                }`}
                            >
                                {processingAction === 'tashkeel' ? <Loader /> : <DocumentTextIcon className="w-4 h-4" />}
                                {isAr ? 'إضافة تشكيل' : 'Add Tashkeel'}
                            </button>

                            {/* Translate Button */}
                            <button
                                onClick={handleTranslate}
                                disabled={!!processingAction || !text}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-xs transition border ${
                                    processingAction === 'translate'
                                        ? 'bg-white/10 text-white/50 cursor-wait border-transparent'
                                        : 'bg-white/5 text-white/90 border-white/10 hover:bg-[#bf8339] hover:text-[#0a1e3c] hover:border-[#bf8339]'
                                }`}
                            >
                                {processingAction === 'translate' ? <Loader /> : <ArrowsRightLeftIcon className="w-4 h-4" />}
                                {isAr ? 'ترجمة' : 'Translate'}
                            </button>
                        </div>

                        <div className="mt-3">
                            <Button 
                                onClick={handleGenerate} 
                                isLoading={isLoading} 
                                className="w-full py-3 text-lg font-bold shadow-xl shadow-[#bf8339]/20"
                            >
                                {isLoading ? (isAr ? 'جاري التوليد...' : 'Generating Audio...') : (isAr ? 'إنشاء المقطع الصوتي' : 'Generate Audio')}
                            </Button>
                        </div>
                        
                        <p className="text-[10px] text-white/40 mt-2 text-center">
                            {isAr 
                                ? 'نصيحة: استخدم أدوات التحسين والتشكيل لضمان أفضل نطق قبل التوليد.' 
                                : 'Tip: Use Improve and Tashkeel tools for best pronunciation results.'}
                        </p>
                    </div>

                    {/* Result Player */}
                    {audioSrc && (
                        <div className="bg-[#0a1e3c]/80 border border-[#bf8339]/30 rounded-xl p-6 text-center animate-fade-in shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#bf8339] to-transparent opacity-50"></div>
                            <h3 className="text-[#bf8339] font-bold mb-6 flex items-center justify-center gap-2">
                                <SpeakerWaveIcon className="w-5 h-5" />
                                {isAr ? 'تم الإنشاء بنجاح' : 'Audio Ready'}
                            </h3>
                            
                            <audio controls className="w-full mb-6" src={audioSrc}>
                                Your browser does not support the audio element.
                            </audio>

                            <a 
                                href={audioSrc} 
                                download={`postly-voice-${Date.now()}.wav`} 
                                className="inline-flex items-center gap-2 bg-[#bf8339] text-[#0a1e3c] px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-[#bf8339] transition shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                {isAr ? 'تحميل الملف' : 'Download File'}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateAudioView;
