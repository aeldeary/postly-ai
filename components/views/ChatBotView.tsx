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

const ChatBotView: React.FC<ChatBotViewProps> = ({ compact = false }) => {
    const { appLanguage } = useContext(ProjectContext);
    const isAr = appLanguage === 'ar';
    
    // Initial greeting message
    const initialMessage: ChatMessage = {
        role: 'model',
        text: isAr 
            ? "مرحباً بك! أنا مساعد Postly-AI الذكي. كيف يمكنني مساعدتك اليوم في صناعة المحتوى أو استخدام التطبيق؟" 
            : "Hello! I am the Postly-AI Smart Assistant. How can I help you with content creation or using the app today?"
    };

    const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const historyForApi = messages; 
            const responseText = await geminiService.sendChatMessage(historyForApi, userMsg.text);
            
            const botMsg: ChatMessage = { role: 'model', text: responseText };
            setMessages(prev => [...prev, botMsg]);

        } catch (error) {
            setMessages(prev => [...prev, { 
                role: 'model', 
                text: isAr ? "عذراً، حدث خطأ في الاتصال. حاول مرة أخرى." : "Sorry, connection error. Please try again." 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setMessages([initialMessage]);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* Conversation Options Header */}
            {messages.length > 1 && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
                    <button 
                        onClick={handleReset}
                        className="bg-[#bf8339]/90 backdrop-blur text-[#0a1e3c] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg hover:bg-white hover:text-[#bf8339] transition-all flex items-center gap-2 border border-white/20"
                    >
                        <TrashIcon className="w-3 h-3" />
                        {isAr ? 'بدء محادثة جديدة' : 'Start New Conversation'}
                    </button>
                </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 bg-[#0a1e3c]/20 rounded-xl p-3 pt-8 overflow-y-auto custom-scrollbar flex flex-col gap-3 min-h-0">
                {messages.map((msg, idx) => (
                    <div 
                        key={idx} 
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div 
                            className={`max-w-[85%] rounded-2xl p-3 relative group text-sm ${
                                msg.role === 'user' 
                                    ? 'bg-[#bf8339] text-[#0a1e3c] rounded-br-none shadow-md' 
                                    : 'bg-white/10 text-white rounded-bl-none border border-white/5'
                            }`}
                        >
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                            {msg.role === 'model' && (
                                <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CopyButton text={msg.text} label="" className="!bg-black/20 !text-white/60 !p-1" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="bg-white/10 text-white rounded-2xl rounded-bl-none p-3 flex gap-1 items-center">
                             <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                             <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                             <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="mt-2 flex gap-2 items-end">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isAr ? (messages.length > 1 ? "استكمال المحادثة..." : "اكتب رسالتك...") : (messages.length > 1 ? "Continue conversation..." : "Type message...")}
                    className="flex-1 bg-[#0a1e3c]/60 border border-white/10 rounded-lg focus:ring-1 focus:ring-[#bf8339] text-white placeholder-white/30 resize-none py-2 px-3 max-h-24 min-h-[44px] custom-scrollbar text-sm"
                    rows={1}
                />
                <Button 
                    onClick={handleSend} 
                    disabled={isLoading || !input.trim()}
                    className="!rounded-lg !px-3 !h-[44px] !mb-0 flex items-center justify-center bg-gradient-to-r from-[#bf8339] to-[#d69545]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`}>
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </Button>
            </div>
        </div>
    );
};

export default ChatBotView;