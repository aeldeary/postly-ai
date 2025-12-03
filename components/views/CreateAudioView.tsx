

import React, { useState, useContext, useEffect, useMemo } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import Button from '../Button';
import { SpeakerWaveIcon, Loader, SparklesIcon } from '../Icons';
import * as geminiService from '../../services/geminiService';
import { setItem, getItem } from '../../utils/localStorage';
import { ARCHIVE_STORAGE_KEY, VOICE_OPTIONS, LANGUAGES_GROUPED, ARABIC_DIALECTS_GROUPED, TONES_GROUPED } from '../../constants';
import VoiceInput from '../VoiceInput';
import AccordionSelect from '../AccordionSelect';

const CreateAudioView: React.FC = () => {
    const { appLanguage, language, updateProjectState } = useContext(ProjectContext);
    const isAr = appLanguage === 'ar';

    const [text, setText] = useState('');
    const [selectedVoiceId, setSelectedVoiceId] = useState(VOICE_OPTIONS[0].id);
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // New State for Dialect and Tone
    const [dialect, setDialect] = useState('');
    const [tone, setTone] = useState('');
    const [previewLoading, setPreviewLoading] = useState<string | null>(null); // Stores voice ID being previewed

    // Translation & Optimization State
    const [targetLang, setTargetLang] = useState(language);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [enableTashkeel, setEnableTashkeel] = useState(true);

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

    const handleOptimizeText = async () => {
        if (!text.trim()) {
            (window as any).toast?.(isAr ? 'يرجى كتابة نص أولاً' : 'Please enter text first', 'error');
            return;
        }
        setIsOptimizing(true);
        try {
            const effectiveLang = targetLang || language;
            const effectiveDialect = dialect || (isAr ? "Standard" : "Neutral");
            const effectiveTone = tone || (isAr ? "Natural" : "Natural");
            
            // Detect if a child voice is selected
            const isChildVoice = selectedVoiceId.startsWith('boy_') || selectedVoiceId.startsWith('girl_');

            const optimized = await geminiService.optimizeTextForAudio(
                text, 
                effectiveLang, 
                effectiveDialect, 
                effectiveTone, 
                enableTashkeel, 
                isChildVoice
            );
            setText(optimized);
            
            (window as any).toast?.(isAr ? 'تم تحسين النص ومحاكاة اللهجة بنجاح' : 'Text optimized for dialect and tone', 'success');
        } catch (error) {
            console.error(error);
            (window as any).toast?.(isAr ? 'فشل تحسين النص' : 'Optimization failed', 'error');
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleGenerate = async () => {
        if (!text.trim()) {
            (window as any).toast?.(isAr ? 'يرجى كتابة نص أولاً' : 'Please enter text first', 'error');
            return;
        }

        setIsLoading(true);
        setAudioSrc(null);

        try {
            // Map common dialects to language codes if possible (basic mapping)
            let langCode = targetLang || language; 
            
            // Note: While Gemini TTS is multilingual, hinting the language code helps.
            if (dialect.includes('Egyptian')) langCode = 'ar-EG';
            else if (dialect.includes('Saudi') || dialect.includes('Najdi') || dialect.includes('Hijazi')) langCode = 'ar-SA';
            else if (dialect.includes('Moroccan')) langCode = 'ar-MA';
            
            const selectedVoice = VOICE_OPTIONS.find(v => v.id === selectedVoiceId)?.name || 'Charon';
            
            const base64Audio = await geminiService.generateSpeech(text, selectedVoice, langCode);
            const wavBlob = pcmToWav(base64Audio);
            const url = URL.createObjectURL(wavBlob);
            setAudioSrc(url);

            const archive = getItem(ARCHIVE_STORAGE_KEY, []);
            archive.unshift({ 
                id: Date.now().toString(), 
                type: 'Audio', 
                content: { text, voice: selectedVoice, url }, 
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

    const handlePreviewVoice = async (e: React.MouseEvent, voiceId: string, voiceName: string) => {
        e.stopPropagation();
        setPreviewLoading(voiceId);
        try {
            const isChild = voiceId.startsWith('boy_') || voiceId.startsWith('girl_');
            let sampleText = isAr ? "مرحباً، هذا نموذج لصوتي." : "Hello, this is a preview of my voice.";
            
            if (isChild) {
                 sampleText = isAr ? "أهلاً! أنا عمري عشر سنوات، وهذا صوتي!" : "Hi! I am ten years old, and this is my voice!";
            }

            const base64Audio = await geminiService.generateSpeech(sampleText, voiceName, language);
            const wavBlob = pcmToWav(base64Audio);
            const url = URL.createObjectURL(wavBlob);
            const audio = new Audio(url);
            audio.play();
        } catch (error) {
            console.error("Preview failed", error);
        } finally {
            setPreviewLoading(null);
        }
    };

    // Helper to convert PCM to WAV for browser playback
    const pcmToWav = (base64: string) => {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        const wavHeader = new ArrayBuffer(44);
        const view = new DataView(wavHeader);
        const sampleRate = 24000; // Gemini default
        const numChannels = 1;
        const bitsPerSample = 16;

        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + len, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true); // PCM
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
                        ? 'حول نصوصك إلى كلام واقعي جداً باستخدام أحدث تقنيات Gemini الصوتية.' 
                        : 'Turn your text into ultra-realistic speech using the latest Gemini audio models.'}
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

                            <label className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5 hover:border-[#bf8339]/30 transition cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={enableTashkeel} 
                                    onChange={(e) => setEnableTashkeel(e.target.checked)} 
                                    className="w-5 h-5 accent-[#bf8339]" 
                                />
                                <span className="text-sm font-bold text-white">{isAr ? 'تشكيل وتدقيق لغوي احترافي' : 'Professional Tashkeel & Proofreading'}</span>
                            </label>
                        </div>

                        {/* Voice Selector */}
                        <label className="block text-xs text-white/60 mb-2 mt-6">{isAr ? 'اختر المعلق الصوتي' : 'Select Voice Artist'}</label>
                        <div className="grid grid-cols-1 gap-2">
                            {VOICE_OPTIONS.map((voice) => {
                                const displayName = isAr ? voice.persona.ar : voice.persona.en;
                                return (
                                <button
                                    key={voice.id}
                                    onClick={() => setSelectedVoiceId(voice.id)}
                                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all relative group ${
                                        selectedVoiceId === voice.id 
                                            ? 'bg-[#bf8339] border-[#bf8339] text-[#0a1e3c] shadow-md' 
                                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                                    }`}
                                >
                                    <span className="text-2xl">{voice.icon}</span>
                                    <div className="text-start flex-1">
                                        <div className="font-bold text-sm flex items-center gap-2">
                                            {displayName}
                                            {/* Preview Button */}
                                            <div 
                                                onClick={(e) => handlePreviewVoice(e, voice.id, voice.name)}
                                                className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${
                                                    selectedVoiceId === voice.id ? 'bg-[#0a1e3c]/20 text-[#0a1e3c]' : 'bg-white/10 text-white'
                                                }`}
                                                title={isAr ? "معاينة الصوت" : "Preview Voice"}
                                            >
                                                {previewLoading === voice.id ? (
                                                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-xs opacity-70">{isAr ? voice.label.ar : voice.label.en}</div>
                                    </div>
                                    {selectedVoiceId === voice.id && (
                                        <span className={`ml-auto font-bold ${isAr ? 'mr-auto ml-0' : 'ml-auto'}`}>✓</span>
                                    )}
                                </button>
                            )})}
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
                            {/* Optimize Button (The Magic Fix) */}
                            <button
                                onClick={handleOptimizeText}
                                disabled={isOptimizing || !text}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition border ${
                                    isOptimizing 
                                        ? 'bg-white/10 text-white/50 cursor-wait border-transparent' 
                                        : 'bg-[#bf8339] text-white border-[#bf8339] hover:bg-[#a66e2c]'
                                }`}
                            >
                                {isOptimizing ? (
                                    <>
                                        <Loader /> {isAr ? 'جاري المعالجة...' : 'Processing...'}
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-4 h-4" /> 
                                        {isAr ? 'تحسين، تشكيل، وترجمة' : 'Optimize, Style & Translate'}
                                    </>
                                )}
                            </button>

                            {/* Generate Button */}
                            <Button 
                                onClick={handleGenerate} 
                                isLoading={isLoading} 
                                className="flex-1 py-3 text-lg font-bold shadow-xl shadow-[#bf8339]/20"
                            >
                                {isLoading ? (isAr ? 'جاري التوليد...' : 'Generating Audio...') : (isAr ? 'إنشاء المقطع الصوتي' : 'Generate Audio')}
                            </Button>
                        </div>
                        
                        <p className="text-[10px] text-white/40 mt-2 text-center">
                            {isAr 
                                ? 'نصيحة: استخدم زر التحسين لضمان نطق الكلمات باللهجة العامية الصحيحة مع التشكيل المناسب.' 
                                : 'Tip: Use optimize button before generating to ensure correct dialect and pronunciation.'}
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