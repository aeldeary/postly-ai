
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import Button from '../Button';
import { Loader } from '../Icons';
import { WebsiteGeneration, ArchivedItem } from '../../types';
import * as geminiService from '../../services/geminiService';
import { setItem, getItem, removeItem } from '../../utils/localStorage';
import { ARCHIVE_STORAGE_KEY, INDUSTRIES_GROUPED, LANGUAGES_GROUPED, TONES_GROUPED } from '../../constants';
import AccordionSelect from '../AccordionSelect';
import CopyButton from '../CopyButton';
import ExportMenu from '../ExportMenu';

const WebsiteContentView: React.FC = () => {
  const { topic, tone, language, industry, updateProjectState, appLanguage } = useContext(ProjectContext);
  const isAr = appLanguage === 'ar';

  const [localTopic, setLocalTopic] = useState(topic);
  const [generations, setGenerations] = useState<WebsiteGeneration[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for restored draft
  useEffect(() => {
      const draft = getItem<ArchivedItem>('editDraft');
      if (draft && draft.type === 'Website') {
          setGenerations(draft.content);
          removeItem('editDraft');
      }
  }, []);

  // Memoized localized options
  const localizedIndustries = useMemo(() => INDUSTRIES_GROUPED.map(g => ({
      label: isAr ? g.label.ar : g.label.en,
      options: g.options.map(o => ({ label: isAr ? o.label.ar : o.label.en, value: o.value }))
  })), [isAr]);

  const localizedLanguages = useMemo(() => LANGUAGES_GROUPED.map(g => ({
      label: isAr ? g.label.ar : g.label.en,
      options: g.options.map(o => ({ label: isAr ? o.label.ar : o.label.en, value: o.value }))
  })), [isAr]);

  const localizedTones = useMemo(() => TONES_GROUPED.map(g => ({
      label: isAr ? g.label.ar : g.label.en,
      options: g.options.map(o => ({ label: isAr ? o.label.ar : o.label.en, value: o.value }))
  })), [isAr]);

  const handleGenerate = async () => {
    if (!localTopic) {
        alert(isAr ? 'يرجى كتابة موضوع الموقع' : 'Please enter website topic');
        return;
    }
    setIsLoading(true);
    setError(null);
    setGenerations(null);
    try {
      updateProjectState({ topic: localTopic });
      const response = await geminiService.generateWebsiteContent(localTopic, language, industry, tone);
      setGenerations(response);
      
      const archive = getItem(ARCHIVE_STORAGE_KEY, []);
      archive.unshift({ id: Date.now().toString(), type: 'Website', content: response, timestamp: new Date().toISOString() });
      setItem(ARCHIVE_STORAGE_KEY, archive);

    } catch (err: any) {
      setError(err.message || (isAr ? 'فشل إنشاء محتوى الموقع.' : 'Failed to generate content.'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getKeywordsString = (keywords: string[] | undefined): string => {
      if (Array.isArray(keywords)) return keywords.join(', ');
      if (typeof keywords === 'string') return keywords;
      return '';
  };

  const copyAll = (generation: WebsiteGeneration) => {
    const keywords = getKeywordsString(generation.seoKeywords);
    
    // Improved Text Cleanup Logic:
    // 1. Replace block-level tags (h1-h6, p, div, li) with newline patterns to preserve structure
    // 2. Replace <br> with newlines
    // 3. Strip all remaining tags
    // 4. Decode HTML entities if any (basic ones)
    // 5. Trim excessive whitespace
    
    let contentText = generation.pageContent
        .replace(/<h[1-6]>(.*?)<\/h[1-6]>/gi, '\n\n$1\n') // Headers get double spacing before, single after
        .replace(/<p>(.*?)<\/p>/gi, '$1\n\n') // Paragraphs get double spacing after
        .replace(/<br\s*\/?>/gi, '\n') // Line breaks
        .replace(/<li[^>]*>(.*?)<\/li>/gi, '• $1\n') // List items get bullets
        .replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n') // Divs generally get a newline
        .replace(/<[^>]+>/g, '') // Strip any remaining HTML tags
        .replace(/&nbsp;/g, ' ') // Clean non-breaking spaces
        .replace(/\n\s*\n\s*\n/g, '\n\n') // Collapse triple newlines to double
        .trim();

    const textToCopy = `--- Meta Description ---\n${generation.metaDescription}\n\n--- SEO Keywords ---\n${keywords}\n\n--- Page Content ---\n${contentText}`; 
    return textToCopy;
  };

  // Determine direction based on selected content language, not app language
  const contentDir = (language && (language.includes('Arabic') || language.includes('العربية'))) ? 'rtl' : 'ltr';
  const contentAlignClass = contentDir === 'rtl' ? 'text-right' : 'text-left';

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div>
        <h2 className="text-3xl font-bold text-[#bf8339]">{isAr ? 'مولد محتوى المواقع' : 'Website Content Generator'}</h2>
        <p className="text-white/70 mt-1">{isAr ? 'أنشئ محتوى كاملاً لصفحة ويب (نسختان مختلفتان)، محسن لمحركات البحث.' : 'Generate full webpage content (2 variations), SEO optimized.'}</p>
      </div>

      <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-5 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
             <label className="block text-sm font-medium text-white/80 mb-2">{isAr ? 'موضوع أو غرض الموقع' : 'Website Topic/Purpose'}</label>
             <textarea
               className="w-full bg-black/20 border border-white/20 rounded-lg p-3 focus:ring-[#bf8339] focus:border-[#bf8339] transition text-white"
               rows={3}
               placeholder={isAr ? "مثال: صفحة هبوط لتطبيق إنتاجي جديد يساعد الشركات على تنظيم المهام..." : "e.g., Landing page for a new productivity app..."}
               value={localTopic}
               onChange={(e) => setLocalTopic(e.target.value)}
             />
          </div>
          
          <AccordionSelect
              label={isAr ? "لغة المحتوى" : "Content Language"}
              value={language}
              onChange={(val) => updateProjectState({ language: val })}
              groups={localizedLanguages}
              placeholder={isAr ? "اختر اللغة" : "Select Language"}
          />

          <AccordionSelect 
              label={isAr ? "القطاع" : "Industry"}
              value={industry}
              onChange={(val) => updateProjectState({ industry: val })}
              groups={localizedIndustries}
              placeholder={isAr ? "اختر المجال" : "Select Industry"}
          />

          <AccordionSelect
              label={isAr ? "نبرة الصوت" : "Tone"}
              value={tone}
              onChange={(val) => updateProjectState({ tone: val })}
              groups={localizedTones}
              placeholder={isAr ? "اختر النبرة" : "Select Tone"}
          />
        </div>

        <div className="pt-2">
          <Button onClick={handleGenerate} isLoading={isLoading} className="w-full md:w-auto">
              {isAr ? 'إنشاء نسختين للمحتوى' : 'Generate 2 Versions'}
          </Button>
        </div>
      </div>
      
      {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg text-center">
              {error}
          </div>
      )}
      
      {isLoading && <div className="flex justify-center py-8"><Loader /></div>}

      {generations && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" dir={contentDir}>
          {generations?.map((gen, idx) => (
            <div key={idx} className={`bg-white/5 p-6 rounded-xl border border-white/10 space-y-6 flex flex-col hover:border-[#bf8339]/30 transition-all ${contentAlignClass}`}>
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h3 className="text-2xl font-bold text-[#bf8339]">
                      {isAr 
                        ? (gen.version === 1 ? 'النسخة 1 (الخبير الموثوق)' : 'النسخة 2 (الرؤية الملهمة)') 
                        : (gen.version === 1 ? 'Version 1 (The Authority)' : 'Version 2 (The Visionary)')}
                  </h3>
                  <ExportMenu content={copyAll(gen)} type="text" filename={`website-content-v${gen.version || idx+1}`} label={isAr ? "تصدير" : "Export"} />
              </div>
              
              {/* Meta Description */}
              <div>
                <div className="flex justify-between items-center mb-2">
                   <h4 className="text-sm font-bold text-white/90 uppercase tracking-wider">{isAr ? 'الوصف التعريفي (Meta)' : 'Meta Description'}</h4>
                   <CopyButton text={gen.metaDescription} />
                </div>
                <p className="text-white/80 bg-black/20 p-3 rounded-lg text-sm leading-relaxed border border-white/5">{gen.metaDescription}</p>
              </div>

              {/* Keywords */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-white/90 uppercase tracking-wider">{isAr ? 'الكلمات المفتاحية (SEO)' : 'SEO Keywords'}</h4>
                  <CopyButton text={getKeywordsString(gen.seoKeywords)} />
                </div>
                <div className="flex flex-wrap gap-2 bg-black/20 p-3 rounded-lg border border-white/5">
                  {Array.isArray(gen.seoKeywords) ? gen.seoKeywords.map((kw, i) => (
                    <span key={i} className="text-xs bg-[#bf8339]/10 text-[#bf8339] px-2 py-1 rounded border border-[#bf8339]/20">{kw}</span>
                  )) : (
                    <span className="text-xs text-white/60">{String(gen.seoKeywords)}</span>
                  )}
                </div>
              </div>

              {/* Page Content */}
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-2">
                   <h4 className="text-sm font-bold text-white/90 uppercase tracking-wider">{isAr ? 'محتوى الصفحة' : 'Page Content'}</h4>
                   <CopyButton text={copyAll(gen)} label={isAr ? "نسخ (نص فقط)" : "Copy (Plain Text)"} />
                </div>
                <div 
                    className="text-white/80 bg-black/20 p-5 rounded-lg border border-white/5 prose prose-invert prose-sm max-w-none prose-headings:text-[#bf8339] prose-a:text-blue-400 prose-strong:text-white"
                    dangerouslySetInnerHTML={{ __html: gen.pageContent }}
                ></div>
              </div>
              
              <div className="pt-4 border-t border-white/10 mt-auto">
                <CopyButton text={copyAll(gen)} label={isAr ? "نسخ المحتوى كاملاً (بدون رموز)" : "Copy Full Content (Plain Text)"} className="!w-full !justify-center !py-3 !text-sm !bg-[#bf8339]/10 !text-[#bf8339] hover:!bg-[#bf8339] hover:!text-[#0a1e3c] !font-bold" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WebsiteContentView;
