

import React, { useState, useContext, useCallback, useRef } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import Button from '../Button';
import { Loader } from '../Icons';
import * as geminiService from '../../services/geminiService';
import { setItem, getItem } from '../../utils/localStorage';
import CopyButton from '../CopyButton';

const StyleTrainingView: React.FC = () => {
  const { styleProfile, updateProjectState, appLanguage } = useContext(ProjectContext);
  const isAr = appLanguage === 'ar';
  
  const [textInput, setTextInput] = useState('');
  const [combinedText, setCombinedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCombinedText(prev => prev + '\n\n' + content);
      };
      reader.readAsText(file);
    } else {
        alert(isAr ? 'رجاءً قم برفع ملف بصيغة .txt' : 'Please upload a .txt file');
    }
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        setIsLoading(true);
        setError(null);
        try {
            const base64Image = await fileToBase64(file);
            const extractedText = await geminiService.extractTextFromImage(base64Image, file.type);
            setCombinedText(prev => prev + '\n\n' + extractedText);
        } catch (err) {
            setError(isAr ? 'فشل استخلاص النص من الصورة.' : 'Failed to extract text from image.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    } else {
      alert(isAr ? 'رجاءً قم برفع ملف صورة.' : 'Please upload an image file.');
    }
  };

  const analyzeStyle = async () => {
    const fullText = combinedText + '\n\n' + textInput;
    if (fullText.trim().length < 100) {
      setError(isAr ? 'يرجى تقديم 100 حرف على الأقل للتحليل.' : 'Please provide at least 100 characters for analysis.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const profile = await geminiService.analyzeStyle(fullText);
      updateProjectState({ styleProfile: profile });
      setItem('styleProfile', profile);
    } catch (err) {
      setError(isAr ? 'فشل تحليل الأسلوب.' : 'Failed to analyze style.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearStyle = () => {
    updateProjectState({ styleProfile: '' });
    setItem('styleProfile', '');
    setCombinedText('');
    setTextInput('');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-[#bf8339]">
            {isAr ? 'تدريب الأسلوب واستخلاص النص' : 'Style Training & Text Extraction'}
        </h2>
        <p className="text-white/70 mt-1">
            {isAr 
                ? 'علّم الذكاء الاصطناعي أسلوب كتابتك الفريد لمحتوى أكثر تخصيصًا، واستخرج النصوص من الصور بسهولة.' 
                : 'Teach AI your unique writing style for personalized content, and easily extract text from images.'}
        </p>
      </div>

      <div className="bg-white/5 p-6 rounded-lg border border-white/10 space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-white/90">
              {isAr ? 'قدّم عينات من كتاباتك' : 'Provide Writing Samples'}
          </h3>
          <p className="text-white/60 text-sm mt-1">
              {isAr 
                ? 'أضف نصوصًا من مصادر متنوعة. كلما زادت النصوص، تعلم الذكاء الاصطناعي أسلوبك بشكل أفضل.' 
                : 'Add texts from various sources. The more text provided, the better AI learns your style.'}
          </p>
        </div>
        
        <textarea
          className="w-full bg-white/5 border border-white/20 rounded-lg p-3 h-48 placeholder-white/30"
          placeholder={isAr ? "الصق نصوصك هنا..." : "Paste your text here..."}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />
        
        <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                {isAr ? 'رفع ملف .txt' : 'Upload .txt'}
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".txt" className="hidden" />
            
            <Button variant="secondary" onClick={() => imageInputRef.current?.click()}>
                {isAr ? 'رفع صورة (استخلاص النص)' : 'Upload Image (Extract Text)'}
            </Button>
            <input type="file" ref={imageInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
        </div>

        {combinedText && (
            <div className="bg-black/20 p-4 rounded-md relative group">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-white/80">
                        {isAr ? 'النص المجمع للتحليل:' : 'Combined Text for Analysis:'}
                    </h4>
                    <CopyButton text={combinedText} label={isAr ? "نسخ" : "Copy"} />
                </div>
                <p className="text-sm text-white/70 max-h-32 overflow-y-auto mt-2 whitespace-pre-wrap">{combinedText}</p>
            </div>
        )}

        <div className="flex items-center gap-4 pt-4">
            <Button onClick={analyzeStyle} isLoading={isLoading}>
                {isAr ? 'تحليل وحفظ الأسلوب' : 'Analyze & Save Style'}
            </Button>
            <Button onClick={clearStyle} variant="outline">
                {isAr ? 'مسح الأسلوب' : 'Clear Style'}
            </Button>
        </div>
      </div>
      
      {isLoading && <div className="flex justify-center"><Loader /></div>}
      {error && <p className="text-red-400 text-center">{error}</p>}

      {styleProfile && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-300 p-6 rounded-lg animate-fade-in relative">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">
                    {isAr ? 'ملف أسلوبك في الكتابة' : 'Your Writing Style Profile'}
                </h3>
                <CopyButton text={styleProfile} className="!bg-green-500/20 !text-green-300" label={isAr ? "نسخ" : "Copy"} />
            </div>
            <p className="mt-2">{styleProfile}</p>
        </div>
      )}
    </div>
  );
};

export default StyleTrainingView;