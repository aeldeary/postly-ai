import React, { useState, useRef, useEffect, useContext } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import { ChatMessage } from '../../types';
import * as geminiService from '../../services/geminiService';
import Button from '../Button';
import CopyButton from '../CopyButton';
import { TrashIcon } from '../Icons';

interface ChatBotViewProps {
  compact?: boolean;
}

const QUICK_PROMPTS_AR = [
  'كيف أكتب منشوراً جذاباً؟',
  'أنشئ لي فكرة محتوى لريل',
  'ما الفرق بين Reel و Story؟',
  'نصائح لزيادة التفاعل',
  'كيف أبني هوية براند قوية؟',
];

const QUICK_PROMPTS_EN = [
  'How do I write an engaging post?',
  'Give me a reel content idea',
  'Best time to post on Instagram?',
  'Tips to grow my audience',
  'How to build a strong brand identity?',
];

const ChatBotView: React.FC<ChatBotViewProps> = ({ compact = false }) => {
  const { appLanguage, theme } = useContext(ProjectContext);
  const isAr = appLanguage === 'ar';
  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  const initialMessage: ChatMessage = {
    role: 'model',
    text: isAr
      ? 'مرحباً بك! 👋 أنا مساعد Postly-AI الذكي. يمكنني مساعدتك في:\n• كتابة المحتوى وصياغة المنشورات\n• أفكار الريلز والفيديو\n• بناء هوية البراند\n• تحسين محركات البحث (SEO)\n• وأي سؤال آخر عن التسويق الرقمي!'
      : "Hello! 👋 I'm the Postly-AI Smart Assistant. I can help you with:\n• Content writing & post creation\n• Reel & video ideas\n• Brand identity building\n• SEO optimization\n• Any digital marketing question!",
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msgText = (text || input).trim();
    if (!msgText) return;
    setShowQuickPrompts(false);

    const userMsg: ChatMessage = { role: 'user', text: msgText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await geminiService.sendChatMessage(messages, msgText);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'model',
        text: isAr ? 'عذراً، حدث خطأ في الاتصال. حاول مرة أخرى.' : 'Sorry, connection error. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([initialMessage]);
    setShowQuickPrompts(true);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = isAr ? QUICK_PROMPTS_AR : QUICK_PROMPTS_EN;

  // Theme colors
  const userBubble = 'bg-gradient-to-br from-[#bf8339] to-[#a66e2c] text-white';
  const botBubble = isDark
    ? 'bg-white/10 text-white border border-white/8'
    : isLight
    ? 'bg-gray-100 text-gray-900 border border-gray-200'
    : 'bg-[#EFEBE0] text-[#3E2723] border border-[#D7CCC8]';
  const inputStyle = isDark
    ? 'bg-black/30 border-white/15 text-white placeholder-white/30 focus:border-[#bf8339]'
    : isLight
    ? 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#bf8339]'
    : 'bg-[#FFFCF8] border-[#BCAAA4] text-[#3E2723] placeholder-[#A1887F] focus:border-[#bf8339]';
  const timeColor = isDark ? 'text-white/30' : 'text-gray-400';

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full relative" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header Controls */}
      {messages.length > 1 && (
        <div className={`shrink-0 flex items-center justify-${isAr ? 'start' : 'end'} mb-2`}>
          <button
            onClick={handleReset}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition ${
              isDark ? 'bg-white/5 text-white/50 hover:bg-red-500/20 hover:text-red-400' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <TrashIcon className="w-3 h-3" />
            {isAr ? 'محادثة جديدة' : 'New chat'}
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 min-h-0 pb-2">

        {/* Quick Prompts (shown at start) */}
        {showQuickPrompts && messages.length === 1 && !compact && (
          <div className="mt-2 mb-1">
            <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
              {isAr ? 'أسئلة سريعة:' : 'Quick prompts:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition hover:scale-[1.02] active:scale-[0.98] ${
                    isDark
                      ? 'border-[#bf8339]/30 text-[#bf8339]/80 hover:bg-[#bf8339]/10'
                      : 'border-amber-300 text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {/* Bot Avatar */}
            {msg.role === 'model' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#bf8339] to-[#a66e2c] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1 mx-2">
                AI
              </div>
            )}

            <div className={`max-w-[80%] group`}>
              <div className={`rounded-2xl px-4 py-3 text-sm relative shadow-sm ${
                msg.role === 'user'
                  ? `${userBubble} rounded-ee-sm`
                  : `${botBubble} rounded-es-sm`
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>

                {/* Copy for bot messages */}
                {msg.role === 'model' && (
                  <div className={`absolute top-1 ${isAr ? 'left-1' : 'right-1'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <CopyButton text={msg.text} label="" className="!bg-black/10 !p-1 !text-inherit" />
                  </div>
                )}
              </div>
              <p className={`text-[9px] mt-1 px-1 ${timeColor} ${msg.role === 'user' ? 'text-end' : 'text-start'}`}>
                {formatTime()}
              </p>
            </div>

            {/* User Avatar */}
            {msg.role === 'user' && (
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1 mx-2 ${isDark ? 'bg-white/10 text-white' : 'bg-gray-200 text-gray-600'}`}>
                👤
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex justify-start items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#bf8339] to-[#a66e2c] flex items-center justify-center text-white text-xs font-bold shrink-0 mx-2">
              AI
            </div>
            <div className={`rounded-2xl rounded-es-sm px-4 py-3 flex gap-1 items-center ${botBubble}`}>
              {[0, 0.15, 0.3].map((delay, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? 'bg-white/50' : 'bg-gray-400'}`}
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts (compact mode) */}
      {compact && showQuickPrompts && messages.length === 1 && (
        <div className="shrink-0 mb-2 flex flex-wrap gap-1">
          {quickPrompts.slice(0, 3).map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className={`text-[10px] px-2 py-1 rounded-lg border transition ${
                isDark ? 'border-[#bf8339]/30 text-[#bf8339]/70 hover:bg-[#bf8339]/10' : 'border-amber-300 text-amber-600 hover:bg-amber-50'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 mt-2 flex gap-2 items-end">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isAr ? 'اكتب رسالتك... (Enter للإرسال)' : 'Type a message... (Enter to send)'}
          rows={1}
          className={`flex-1 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#bf8339] resize-none py-2.5 px-3 max-h-24 min-h-[42px] text-sm custom-scrollbar transition ${inputStyle}`}
          dir={isAr ? 'rtl' : 'ltr'}
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className="h-[42px] w-[42px] shrink-0 bg-gradient-to-br from-[#bf8339] to-[#a66e2c] hover:from-[#a66e2c] hover:to-[#8d5c1e] text-white rounded-xl flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`}>
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatBotView;
