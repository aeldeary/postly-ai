
import React, { useState, useRef, useContext, useEffect } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import * as geminiService from '../../services/geminiService';
import Button from '../Button';
import { Loader, DocumentTextIcon, VideoCameraIcon, SparklesIcon, MagicWandIcon, ChartBarIcon } from '../Icons';
import CopyButton from '../CopyButton';
import { ARCHIVE_STORAGE_KEY } from '../../constants';
import { setItem, getItem, removeItem } from '../../utils/localStorage';
import { ArchivedItem } from '../../types';

const InstantSummaryView: React.FC = () => {
    const { appLanguage, theme } = useContext(ProjectContext);
    const isAr = appLanguage === 'ar';
    const isLight = theme === 'light';
    const isComfort = theme === 'comfort';

    const [inputType, setInputType] = useState<'text' | 'file'>('text');
    const [textInput, setTextInput] = useState('');
    const [fileData, setFileData] = useState<{name: string, data: string, mimeType: string} | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const [urlInput, setUrlInput] = useState('');
    const [titleInput, setTitleInput] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [summaryResult, setSummaryResult] = useState<string>('');
    
    // SEO Analysis State
    const [isAnalyzingSEO, setIsAnalyzingSEO] = useState(false);
    const [seoResult, setSeoResult] = useState<any>(null);

    // Repurposing
    const [isRepurposing, setIsRepurposing] = useState(false);
    const [repurposedContent, setRepurposedContent] = useState<string>('');
    const [currentPlatformId, setCurrentPlatformId] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'full_content' | 'social' | 'seo'>('full_content');

    // Check for restored draft
    useEffect(() => {
        const draft = getItem<ArchivedItem>('editDraft');
        if (draft && draft.type === 'Summary') {
            setSummaryResult(draft.content);
            removeItem('editDraft');
        }
    }, []);

    // --- SOCIAL PLATFORMS DATA ---
    const socialPlatforms = [
        { id: 'LinkedIn Post', label: isAr ? 'منشور لينكد إن' : 'LinkedIn Post', icon: '💼', color: 'hover:border-blue-600 hover:text-blue-600' },
        { id: 'Twitter Thread', label: isAr ? 'سلسلة تغريدات (X)' : 'Twitter/X Thread', icon: '🧵', color: 'hover:border-slate-400 hover:text-slate-400' },
        { id: 'Instagram Caption', label: isAr ? 'كابشن انستجرام' : 'Instagram Caption', icon: '📸', color: 'hover:border-pink-500 hover:text-pink-500' },
        { id: 'Facebook Post', label: isAr ? 'منشور فيسبوك' : 'Facebook Post', icon: '📘', color: 'hover:border-blue-500 hover:text-blue-500' },
        { id: 'TikTok Script', label: isAr ? 'سيناريو تيك توك' : 'TikTok Script', icon: '🎵', color: 'hover:border-cyan-400 hover:text-cyan-400' },
        { id: 'YouTube Script', label: isAr ? 'وصف/سكريبت يوتيوب' : 'YouTube Desc/Script', icon: '▶️', color: 'hover:border-red-500 hover:text-red-500' },
        { id: 'Blog Article', label: isAr ? 'مقال كامل' : 'Full Blog Article', icon: '📝', color: 'hover:border-orange-400 hover:text-orange-400' },
        { id: 'Email Newsletter', label: isAr ? 'نشرة بريدية' : 'Email Newsletter', icon: '📧', color: 'hover:border-purple-400 hover:text-purple-400' },
        { id: 'Snapchat Story', label: isAr ? 'ستوري سناب شات' : 'Snapchat Story', icon: '👻', color: 'hover:border-yellow-400 hover:text-yellow-400' },
        { id: 'Telegram Post', label: isAr ? 'منشور تليجرام' : 'Telegram Post', icon: '✈️', color: 'hover:border-sky-400 hover:text-sky-400' },
        { id: 'WhatsApp Message', label: isAr ? 'رسالة واتساب' : 'WhatsApp Message', icon: '💬', color: 'hover:border-green-500 hover:text-green-500' }
    ];

    // --- TEXT FORMATTING HELPER ---
    const formatSummary = (text: string) => {
        if (!text) return '';
        
        let formatted = text
            // Bold (**text**)
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#bf8339] font-bold">$1</strong>')
            // Bold (*text*) - sometimes used for emphasis in lists
            .replace(/(?<!\*)\*(.*?)\*(?!\*)/g, '<strong class="text-[#bf8339] font-bold">$1</strong>')
            
            // H3 (### text) -> Styled H3
            .replace(/^###\s+(.*$)/gm, `<h3 class="text-lg font-bold ${isLight || isComfort ? 'text-[#0a1e3c]' : 'text-white'} mt-4 mb-2 flex items-center gap-2"><span class="w-1.5 h-1.5 bg-[#bf8339] rounded-full"></span>$1</h3>`)
            
            // H2 (## text) -> Styled H2
            .replace(/^##\s+(.*$)/gm, `<h2 class="text-xl font-bold text-[#bf8339] mt-6 mb-3 border-b ${isLight || isComfort ? 'border-gray-300' : 'border-white/10'} pb-2">$1</h2>`)
            
            // H1 (# text) -> Styled H1
            .replace(/^#\s+(.*$)/gm, '<h1 class="text-2xl font-bold text-[#bf8339] mt-6 mb-4">$1</h1>')
            
            // List Items (* text or - text) -> Styled List (Remove the symbol)
            .replace(/^\s*[\-\*]\s+(.*$)/gm, `<div class="flex items-start gap-2 mb-1.5 ml-2"><span class="text-[#bf8339] mt-1.5 text-[10px]">●</span><span class="${isLight || isComfort ? 'text-gray-700' : 'text-white/90'} leading-relaxed">$1</span></div>`)
            
            // Handle Paragraph Spacing
            .replace(/(\r\n|\n|\r){2,}/g, '<div class="h-4"></div>')
            
            // Handle Single Newline
            .replace(/(\r\n|\n|\r)/g, '<br />');

        return formatted;
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) { 
            (window as any).toast?.(isAr ? "حجم الملف كبير جداً (الحد الأقصى 10 ميجا)" : "File too large (>10MB)", 'error');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            setFileData({
                name: file.name,
                data: base64,
                mimeType: file.type
            });
        };
        reader.readAsDataURL(file);
    };

    const validateInput = () => {
        if (inputType === 'text' && !textInput.trim() && !urlInput.trim()) {
            (window as any).toast?.(isAr ? "يرجى إدخال نص أو رابط." : "Please enter text or a URL.", 'error');
            return false;
        }
        if (inputType === 'file' && !fileData) {
            (window as any).toast?.(isAr ? "يرجى رفع ملف." : "Please upload a file.", 'error');
            return false;
        }
        return true;
    };

    const handleSummarize = async () => {
        if (!validateInput()) return;

        setIsLoading(true);
        setSummaryResult('');
        setRepurposedContent('');
        setCurrentPlatformId('');
        
        try {
            let contentToAnalyze = '';
            
            if (inputType === 'text') {
                if (urlInput.trim()) {
                    contentToAnalyze += `Source URL to Analyze: ${urlInput}\n\n`;
                }
                if (textInput.trim()) {
                    contentToAnalyze += `Additional Text/Context: ${textInput}`;
                }
            }

            const result = await geminiService.summarizeContent(
                contentToAnalyze,
                inputType === 'file' && fileData ? { data: fileData.data, mimeType: fileData.mimeType } : undefined,
                isAr ? 'Arabic' : 'English',
                titleInput
            );
            
            setSummaryResult(result);
            setActiveTab('full_content');
            
            const archive = getItem(ARCHIVE_STORAGE_KEY, []);
            archive.unshift({ 
                id: Date.now().toString(), 
                type: 'Summary', 
                content: result.substring(0, 200) + '...', 
                timestamp: new Date().toISOString() 
            });
            setItem(ARCHIVE_STORAGE_KEY, archive);

        } catch (e: any) {
            console.error(e);
            (window as any).toast?.(e.message || "Error summarizing", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyzeSEO = async () => {
        if (!validateInput()) return;

        setIsAnalyzingSEO(true);
        setSeoResult(null);
        
        try {
            let contentToAnalyze = '';
            if (inputType === 'text') {
                if (urlInput.trim()) contentToAnalyze += `Source URL: ${urlInput}\n\n`;
                if (textInput.trim()) contentToAnalyze += `Text: ${textInput}`;
            }

            const result = await geminiService.analyzeSEO(
                contentToAnalyze,
                inputType === 'file' && fileData ? { data: fileData.data, mimeType: fileData.mimeType } : undefined,
                isAr ? 'Arabic' : 'English'
            );
            
            setSeoResult(result);
            setActiveTab('seo');
            
        } catch (e: any) {
            console.error(e);
            (window as any).toast?.(e.message || "SEO Analysis failed", 'error');
        } finally {
            setIsAnalyzingSEO(false);
        }
    };

    const handleRepurpose = async (format: string) => {
        if (!summaryResult) return;
        
        setIsRepurposing(true);
        setCurrentPlatformId(format);
        
        try {
            const result = await geminiService.repurposeContent(summaryResult, format, isAr ? 'Arabic' : 'English');
            setRepurposedContent(result);
            setActiveTab('social');
        } catch (e) {
            console.error(e);
        } finally {
            setIsRepurposing(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className={`relative overflow-hidden p-8 rounded-3xl border shadow-2xl isolate ${
                isLight 
                ? 'bg-gradient-to-br from-[#bf8339]/10 via-white to-gray-50 border-gray-200' 
                : isComfort 
                ? 'bg-gradient-to-br from-[#C19A6B]/20 via-[#FFFCF8] to-[#F5F1E6] border-[#D7CCC8]'
                : 'bg-gradient-to-br from-[#bf8339]/20 via-[#0a1e3c] to-[#0a1e3c] border-white/10'
            }`}>
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                 <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#bf8339]/20 rounded-full blur-3xl -z-10"></div>
                 
                 <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#bf8339] to-[#d69545] rounded-2xl flex items-center justify-center shadow-lg shadow-[#bf8339]/20 transform rotate-3">
                        <DocumentTextIcon className="w-9 h-9 text-[#0a1e3c]" />
                    </div>
                    <div>
                        <h2 className={`text-4xl font-bold mb-2 flex items-center gap-3 ${isLight || isComfort ? 'text-[#3E2723]' : 'text-white'}`}>
                            {isAr ? 'الملخص الفوري & SEO' : 'Instant Summary & SEO'}
                            <span className="text-xs font-bold uppercase tracking-wider bg-white/10 border border-white/10 text-[#bf8339] px-3 py-1 rounded-full">AI 2.0</span>
                        </h2>
                        <p className={`text-lg max-w-2xl font-light ${isLight || isComfort ? 'text-[#5D4037]' : 'text-white/70'}`}>
                            {isAr 
                                ? 'حول النصوص الطويلة، الفيديوهات، والملفات إلى ملخصات دقيقة، محتوى جاهز، وتحليلات SEO.' 
                                : 'Transform long text, videos, and files into summaries, publish-ready content, and SEO insights.'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* LEFT: INPUT SECTION */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className={`backdrop-blur-xl border rounded-3xl p-6 shadow-xl ring-1 ring-white/5 ${isLight ? 'bg-white border-gray-200' : isComfort ? 'bg-[#FFFCF8] border-[#D7CCC8]' : 'bg-[#0a1e3c]/80 border-white/10'}`}>
                        
                        {/* Segmented Control */}
                        <div className={`relative p-1.5 rounded-xl mb-8 select-none ${isLight || isComfort ? 'bg-gray-100' : 'bg-black/40'}`}>
                             <div 
                                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-4px)] bg-[#bf8339] rounded-lg shadow-lg transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                                    inputType === 'text' 
                                        ? (isAr ? 'right-1.5' : 'left-1.5') 
                                        : (isAr ? 'right-[calc(50%+2px)]' : 'left-[calc(50%+2px)]')
                                }`}
                             ></div>
                             <div className="relative z-10 flex text-sm font-bold">
                                 <button 
                                    onClick={() => setInputType('text')}
                                    className={`flex-1 py-2.5 text-center transition-colors duration-300 ${inputType === 'text' ? 'text-[#0a1e3c] hover:text-[#0a1e3c]' : (isLight || isComfort ? 'text-gray-500 hover:text-gray-900' : 'text-white/60 hover:text-white')}`}
                                 >
                                    {isAr ? 'نص / رابط' : 'Text / URL'}
                                 </button>
                                 <button 
                                    onClick={() => setInputType('file')}
                                    className={`flex-1 py-2.5 text-center transition-colors duration-300 ${inputType === 'file' ? 'text-[#0a1e3c] hover:text-[#0a1e3c]' : (isLight || isComfort ? 'text-gray-500 hover:text-gray-900' : 'text-white/60 hover:text-white')}`}
                                 >
                                    {isAr ? 'رفع ملف' : 'Upload File'}
                                 </button>
                             </div>
                        </div>

                        {inputType === 'text' ? (
                            <div className="space-y-5 animate-fade-in">
                                <div className="space-y-1.5">
                                    <label className={`text-xs font-bold ml-1 ${isLight || isComfort ? 'text-[#5D4037]' : 'text-white/60'}`}>{isAr ? 'رابط (يوتيوب أو مقال)' : 'URL (YouTube or Article)'}</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-white/30">🔗</span>
                                        </div>
                                        <input 
                                            type="text" 
                                            className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:border-[#bf8339] focus:ring-1 focus:ring-[#bf8339]/50 transition-all text-sm ${isLight || isComfort ? 'bg-white border-gray-200 text-[#3E2723] placeholder-gray-400' : 'bg-black/20 border-white/10 text-white placeholder-white/20 hover:bg-black/30'}`}
                                            placeholder="https://..."
                                            value={urlInput}
                                            onChange={e => setUrlInput(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#bf8339] ml-1 flex justify-between">
                                        {isAr ? 'عنوان المحتوى' : 'Content Title'}
                                        <span className={`text-[10px] font-normal ${isLight || isComfort ? 'text-gray-400' : 'text-white/40'}`}>{isAr ? '(يساعد في الدقة)' : '(Helps accuracy)'}</span>
                                    </label>
                                    <div className="relative group">
                                        <input 
                                            type="text" 
                                            className={`w-full border rounded-xl px-4 py-3 focus:border-[#bf8339] focus:ring-1 focus:ring-[#bf8339]/50 transition-all text-sm ${isLight || isComfort ? 'bg-white border-gray-200 text-[#3E2723] placeholder-gray-400' : 'bg-black/20 border-white/10 text-white placeholder-white/20 hover:bg-black/30'}`}
                                            placeholder={isAr ? "مثال: الاتجاه المعاكس - هل أفل نجم أمريكا؟" : "e.g. Video Title or Topic"}
                                            value={titleInput}
                                            onChange={e => setTitleInput(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className={`text-xs font-bold ml-1 ${isLight || isComfort ? 'text-[#5D4037]' : 'text-white/60'}`}>{isAr ? 'النص المباشر (اختياري)' : 'Direct Text (Optional)'}</label>
                                    </div>
                                    <textarea 
                                        className={`w-full border rounded-xl p-4 h-48 focus:border-[#bf8339] focus:ring-1 focus:ring-[#bf8339]/50 transition-all leading-relaxed custom-scrollbar text-sm resize-none ${isLight || isComfort ? 'bg-white border-gray-200 text-[#3E2723] placeholder-gray-400' : 'bg-black/20 border-white/10 text-white/90 placeholder-white/20 hover:bg-black/30'}`}
                                        placeholder={isAr ? "الصق النص أو الترانزكريبت هنا..." : "Paste transcript or text here..."}
                                        value={textInput}
                                        onChange={e => setTextInput(e.target.value)}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div 
                                onClick={() => fileRef.current?.click()}
                                className={`border-2 border-dashed rounded-2xl h-[400px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group relative overflow-hidden ${isLight || isComfort ? 'border-[#D7CCC8] hover:border-[#bf8339] hover:bg-[#F5F1E6]' : 'border-white/10 hover:border-[#bf8339] hover:bg-[#bf8339]/5'}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#bf8339]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                {fileData ? (
                                    <div className="text-center animate-bounce-in relative z-10">
                                        <div className="w-20 h-20 bg-[#bf8339] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#bf8339]/30">
                                            <DocumentTextIcon className="w-10 h-10 text-[#0a1e3c]" />
                                        </div>
                                        <p className={`font-bold text-lg max-w-[200px] truncate mx-auto ${isLight || isComfort ? 'text-[#3E2723]' : 'text-white'}`}>{fileData.name}</p>
                                        <p className={`text-xs mt-1 uppercase tracking-widest ${isLight || isComfort ? 'text-[#8D6E63]' : 'text-white/50'}`}>{fileData.mimeType.split('/')[1] || 'FILE'}</p>
                                        <button className={`mt-4 text-xs px-4 py-2 rounded-full transition ${isLight || isComfort ? 'bg-[#E0D4C5] text-[#3E2723] hover:bg-[#D7CCC8]' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                                            {isAr ? 'تغيير الملف' : 'Change File'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center relative z-10 p-6">
                                        <div className={`w-20 h-20 rounded-full border flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:border-[#bf8339] transition-all duration-300 shadow-xl ${isLight || isComfort ? 'bg-white border-[#D7CCC8]' : 'bg-white/5 border-white/10'}`}>
                                            <VideoCameraIcon className={`w-10 h-10 transition-colors ${isLight || isComfort ? 'text-[#8D6E63] group-hover:text-[#bf8339]' : 'text-white/40 group-hover:text-[#bf8339]'}`} />
                                        </div>
                                        <h3 className={`text-xl font-bold mb-2 ${isLight || isComfort ? 'text-[#3E2723]' : 'text-white'}`}>{isAr ? 'ارفع ملفك هنا' : 'Upload File Here'}</h3>
                                        <p className={`text-sm ${isLight || isComfort ? 'text-[#8D6E63]' : 'text-white/50'}`}>{isAr ? 'يدعم الفيديو، الصوت، والنصوص' : 'Supports Video, Audio, Text'}</p>
                                    </div>
                                )}
                                <input type="file" ref={fileRef} onChange={handleFileUpload} className="hidden" accept="video/*,audio/*,text/*,.pdf,.doc,.docx" />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <Button 
                                onClick={handleSummarize} 
                                isLoading={isLoading} 
                                className={`w-full py-4 text-sm md:text-lg font-bold shadow-xl rounded-xl transition-all duration-300 ${isLight || isComfort ? 'bg-[#bf8339] text-white hover:bg-[#d69545] shadow-[#bf8339]/20' : 'bg-gradient-to-r from-[#bf8339] to-[#d69545] text-[#0a1e3c] shadow-[#bf8339]/20'}`}
                            >
                                {isLoading ? (isAr ? 'جاري التحليل...' : 'Analyzing...') : (isAr ? 'تلخيص المحتوى' : 'Summarize Content')}
                            </Button>
                            
                            <Button 
                                onClick={handleAnalyzeSEO} 
                                isLoading={isAnalyzingSEO}
                                variant="secondary" 
                                className={`w-full py-4 text-sm md:text-lg font-bold shadow-xl rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${isLight || isComfort ? 'border-[#bf8339] text-[#bf8339] hover:bg-[#bf8339]/10' : ''}`}
                            >
                                {isAnalyzingSEO ? (
                                    <Loader />
                                ) : (
                                    <>
                                        <ChartBarIcon className="w-5 h-5" />
                                        {isAr ? 'تحليل SEO' : 'Analyze SEO'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* RIGHT: RESULT SECTION */}
                <div className="lg:col-span-7">
                    {(summaryResult || seoResult) ? (
                        <div className={`backdrop-blur-xl border rounded-3xl p-8 shadow-2xl relative overflow-hidden animate-slide-up ${isLight ? 'bg-white border-gray-200' : isComfort ? 'bg-[#FFFCF8] border-[#D7CCC8]' : 'bg-[#0a1e3c]/80 border-white/10'}`}>
                            
                            {/* Tabs */}
                            <div className="flex border-b border-white/10 mb-6 relative z-10 overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab('full_content')}
                                    disabled={!summaryResult}
                                    className={`pb-3 px-4 text-sm font-bold transition-colors relative whitespace-nowrap ${activeTab === 'full_content' ? 'text-[#bf8339]' : (!summaryResult ? 'opacity-30 cursor-not-allowed' : (isLight || isComfort ? 'text-gray-500 hover:text-gray-900' : 'text-white/50 hover:text-white'))}`}
                                >
                                    {isAr ? 'الملخص الشامل' : 'Full Summary'}
                                    {activeTab === 'full_content' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#bf8339]"></div>}
                                </button>
                                <button
                                    onClick={() => setActiveTab('social')}
                                    disabled={!summaryResult}
                                    className={`pb-3 px-4 text-sm font-bold transition-colors relative whitespace-nowrap ${activeTab === 'social' ? 'text-[#bf8339]' : (!summaryResult ? 'opacity-30 cursor-not-allowed' : (isLight || isComfort ? 'text-gray-500 hover:text-gray-900' : 'text-white/50 hover:text-white'))}`}
                                >
                                    {isAr ? 'إعادة التدوير (Social)' : 'Repurpose (Social)'}
                                    {activeTab === 'social' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#bf8339]"></div>}
                                </button>
                                <button
                                    onClick={() => setActiveTab('seo')}
                                    disabled={!seoResult}
                                    className={`pb-3 px-4 text-sm font-bold transition-colors relative whitespace-nowrap ${activeTab === 'seo' ? 'text-[#bf8339]' : (!seoResult ? 'opacity-30 cursor-not-allowed' : (isLight || isComfort ? 'text-gray-500 hover:text-gray-900' : 'text-white/50 hover:text-white'))}`}
                                >
                                    {isAr ? 'تحليل SEO' : 'SEO Analysis'}
                                    {activeTab === 'seo' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#bf8339]"></div>}
                                </button>
                            </div>

                            {activeTab === 'full_content' && summaryResult && (
                                <div className="animate-fade-in relative z-10">
                                    <div className="flex justify-end mb-4">
                                        <CopyButton text={summaryResult} label={isAr ? "نسخ الملخص" : "Copy Summary"} />
                                    </div>
                                    <div 
                                        className={`prose prose-sm md:prose-base max-w-none leading-relaxed ${isLight || isComfort ? 'text-gray-800 prose-headings:text-[#3E2723] prose-strong:text-[#bf8339]' : 'text-white/90 prose-invert prose-headings:text-white prose-strong:text-[#bf8339]'}`}
                                        dangerouslySetInnerHTML={{ __html: formatSummary(summaryResult) }}
                                    ></div>
                                </div>
                            )}

                            {activeTab === 'social' && summaryResult && (
                                <div className="animate-fade-in relative z-10">
                                    <div className="mb-6">
                                        <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${isLight || isComfort ? 'text-[#5D4037]' : 'text-white/60'}`}>{isAr ? 'اختر منصة للتحويل إليها' : 'Choose Platform to Repurpose'}</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {socialPlatforms.map(platform => (
                                                <button
                                                    key={platform.id}
                                                    onClick={() => handleRepurpose(platform.id)}
                                                    disabled={isRepurposing}
                                                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left group ${
                                                        currentPlatformId === platform.id
                                                            ? 'bg-[#bf8339] border-[#bf8339] text-[#0a1e3c] shadow-lg'
                                                            : isLight || isComfort 
                                                                ? `bg-white border-gray-200 text-gray-700 hover:bg-gray-50 ${platform.color}`
                                                                : `bg-white/5 border-white/10 text-white/70 hover:bg-white/10 ${platform.color}`
                                                    }`}
                                                >
                                                    <span className="text-xl">{platform.icon}</span>
                                                    <span className="text-xs font-bold">{platform.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {isRepurposing ? (
                                        <div className="py-12 flex justify-center">
                                            <Loader />
                                        </div>
                                    ) : repurposedContent ? (
                                        <div className={`p-6 rounded-2xl border relative ${isLight || isComfort ? 'bg-white border-gray-200 text-gray-800' : 'bg-black/20 border-white/10 text-white/90'}`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-xs font-bold text-[#bf8339] uppercase tracking-wider">{currentPlatformId}</span>
                                                <CopyButton text={repurposedContent} />
                                            </div>
                                            <div className="whitespace-pre-wrap leading-relaxed text-sm">
                                                {repurposedContent}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`text-center py-12 border-2 border-dashed rounded-2xl ${isLight || isComfort ? 'border-gray-200 text-gray-400' : 'border-white/10 text-white/30'}`}>
                                            <MagicWandIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">{isAr ? 'اختر منصة أعلاه لتوليد المحتوى' : 'Select a platform above to generate content'}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'seo' && seoResult && (
                                <div className="animate-fade-in relative z-10 space-y-6">
                                    {/* Score & Readability */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className={`p-4 rounded-xl border text-center ${isLight || isComfort ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'}`}>
                                            <div className="text-xs text-[#bf8339] uppercase font-bold mb-2">{isAr ? 'نقاط SEO' : 'SEO Score'}</div>
                                            <div className={`text-4xl font-black ${seoResult.score >= 80 ? 'text-green-500' : seoResult.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                                {seoResult.score}/100
                                            </div>
                                        </div>
                                        <div className={`p-4 rounded-xl border text-center ${isLight || isComfort ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'}`}>
                                            <div className="text-xs text-[#bf8339] uppercase font-bold mb-2">{isAr ? 'قابلية القراءة' : 'Readability'}</div>
                                            <div className={`text-2xl font-bold ${isLight || isComfort ? 'text-gray-800' : 'text-white'}`}>
                                                {seoResult.readability}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Meta Tags */}
                                    <div className={`p-5 rounded-xl border ${isLight || isComfort ? 'bg-white border-gray-200' : 'bg-white/5 border-white/10'}`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className={`text-sm font-bold ${isLight || isComfort ? 'text-gray-800' : 'text-white'}`}>{isAr ? 'عنوان مقترح (Title Tag)' : 'Title Suggestion'}</h4>
                                            <CopyButton text={seoResult.titleSuggestion} />
                                        </div>
                                        <p className={`text-sm mb-4 pb-4 border-b ${isLight || isComfort ? 'text-gray-600 border-gray-100' : 'text-white/80 border-white/10'}`}>{seoResult.titleSuggestion}</p>
                                        
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className={`text-sm font-bold ${isLight || isComfort ? 'text-gray-800' : 'text-white'}`}>{isAr ? 'وصف الميتا (Meta Description)' : 'Meta Description'}</h4>
                                            <CopyButton text={seoResult.metaDescription} />
                                        </div>
                                        <p className={`text-sm ${isLight || isComfort ? 'text-gray-600' : 'text-white/80'}`}>{seoResult.metaDescription}</p>
                                    </div>

                                    {/* Keywords */}
                                    <div>
                                        <h4 className={`text-sm font-bold mb-3 uppercase tracking-wider ${isLight || isComfort ? 'text-gray-500' : 'text-white/50'}`}>{isAr ? 'الكلمات المفتاحية المستخرجة' : 'Keywords Detected'}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {seoResult.keywords?.map((kw: string, i: number) => (
                                                <span key={i} className="bg-[#bf8339]/10 text-[#bf8339] px-3 py-1 rounded-full text-xs font-bold border border-[#bf8339]/20">
                                                    #{kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Suggestions */}
                                    <div>
                                        <h4 className={`text-sm font-bold mb-3 uppercase tracking-wider ${isLight || isComfort ? 'text-gray-500' : 'text-white/50'}`}>{isAr ? 'توصيات التحسين' : 'Improvement Suggestions'}</h4>
                                        <ul className="space-y-2">
                                            {seoResult.suggestions?.map((s: string, i: number) => (
                                                <li key={i} className={`text-sm flex items-start gap-2 ${isLight || isComfort ? 'text-gray-700' : 'text-white/80'}`}>
                                                    <span className="text-[#bf8339] mt-1">✓</span>
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={`h-full min-h-[400px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center p-8 transition-colors ${isLight || isComfort ? 'border-gray-200 text-gray-400 bg-gray-50/50' : 'border-white/10 text-white/30 bg-white/5'}`}>
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${isLight || isComfort ? 'bg-white shadow-sm' : 'bg-white/5'}`}>
                                <SparklesIcon className="w-10 h-10 opacity-50" />
                            </div>
                            <h3 className={`text-xl font-bold mb-2 ${isLight || isComfort ? 'text-gray-500' : 'text-white/50'}`}>{isAr ? 'النتيجة ستظهر هنا' : 'Result will appear here'}</h3>
                            <p className="text-sm max-w-xs opacity-70">
                                {isAr 
                                    ? 'استخدم الأدوات على اليمين لتحليل المحتوى وتلخيصه.' 
                                    : 'Use the tools on the left to analyze and summarize content.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstantSummaryView;
