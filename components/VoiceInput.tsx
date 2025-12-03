
import React, { useState, useEffect, useRef } from 'react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  lang?: string;
  className?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, lang = 'ar-SA', className }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  
  // Type definition for Web Speech API
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  useEffect(() => {
      if (!SpeechRecognition) {
          setIsSupported(false);
      }
      return () => {
          // Cleanup on unmount
          if (recognitionRef.current) {
              try {
                  recognitionRef.current.stop();
              } catch (e) {
                  // Ignore error if already stopped
              }
          }
      };
  }, []);

  const toggleListening = () => {
    if (!isSupported) {
        alert("متصفحك لا يدعم خاصية الإملاء الصوتي.");
        return;
    }

    if (isListening) {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
        return;
    }

    try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = lang;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
            
            if (event.error === 'not-allowed') {
                const msg = lang.includes('ar') 
                    ? 'تم رفض الوصول للميكروفون. يرجى السماح بصلاحية الميكروفون من إعدادات المتصفح (أيقونة القفل بجوار الرابط).' 
                    : 'Microphone access denied. Please allow microphone permissions in your browser settings.';
                
                // Try to use global toast if available, otherwise alert
                if ((window as any).toast) {
                    (window as any).toast(msg, 'error');
                } else {
                    alert(msg);
                }
            } else if (event.error === 'no-speech') {
                // Ignore, just stopped hearing
            } else {
                 // Generic error
            }
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            if (transcript) {
                onTranscript(transcript);
            }
        };

        recognition.start();
    } catch (e) {
        console.error("Failed to start speech recognition", e);
        setIsListening(false);
    }
  };

  if (!isSupported) return null;

  return (
    <button 
        onClick={toggleListening}
        className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-white/70 hover:bg-[#bf8339] hover:text-white'} ${className}`}
        title={lang.includes('ar') ? "إملاء صوتي" : "Voice Input"}
        type="button"
    >
        {isListening ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
        )}
    </button>
  );
};

export default VoiceInput;
