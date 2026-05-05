import React, { useState, useRef, useEffect } from 'react';
import { 
  Send as SendIcon, 
  User, 
  Bot, 
  Loader2, 
  Trash2, 
  Copy, 
  Check, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sendMessage } from '../services/geminiService';
import { ARC_KNOWLEDGE } from '../constants';
import { Message } from '../types';

interface ChatProps {
  conversationId: string | null;
  initialMessages?: Message[];
  onUpdate: (id: string, messages: Message[]) => void;
}

const DEFAULT_MESSAGE: Message = {
  role: 'model',
  content: "Hello! I'm your Arc Network developer assistant. I can help you understand Arc's L1 architecture, how to use USDC for gas, or how to integrate the Arc App Kit. What are you building today?"
};

export default function Chat({ conversationId, initialMessages, onUpdate }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || [DEFAULT_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentIdRef = useRef<string | null>(conversationId);

  useEffect(() => {
    if (conversationId !== currentIdRef.current) {
      setMessages(initialMessages || [DEFAULT_MESSAGE]);
      currentIdRef.current = conversationId;
    }
  }, [conversationId, initialMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }

    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role as 'user' | 'model',
      parts: [{ text: m.content }]
    }));

    try {
      const response = await sendMessage(userMessage, history);
      setIsLoading(false);

      let currentText = "";
      const typingSpeed = 5;
      const charArray = response.split("");
      
      const messagesWithPlaceholder = [...newMessages, { role: 'model', content: "" }];
      setMessages(messagesWithPlaceholder as Message[]);

      for (let i = 0; i < charArray.length; i++) {
        currentText += charArray[i];
        if (i % 2 === 0 || i === charArray.length - 1) {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'model', content: currentText };
            return updated;
          });
        }
        await new Promise(resolve => setTimeout(resolve, typingSpeed));
      }
      
      const finalMessages: Message[] = [...newMessages, { role: 'model', content: response }];
      const id = conversationId || Math.random().toString(36).substring(7);
      onUpdate(id, finalMessages);
    } catch (error: any) {
      console.error('Chat Error:', error);
      setIsLoading(false);
      
      let errorMessage = "Something went wrong. Please try again.";
      if (error && typeof error === 'object') {
        if (error.message && error.message.includes("xhr error")) {
          errorMessage = "The connection to Arc Assistant failed. This is likely a temporary network issue. Please try sending your message again.";
        } else if (error.message) {
          errorMessage = error.message;
        }
      }

      setMessages(prev => [...prev, { 
        role: 'model', 
        content: errorMessage,
        isError: true
      }]);
    }
  };

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear this conversation?")) {
      const clearedMessages = [DEFAULT_MESSAGE];
      setMessages(clearedMessages);
      if (conversationId) {
        onUpdate(conversationId, clearedMessages);
      }
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.01]">
        <SuggestionChip label="What is Arc?" onClick={() => setInput("What is Arc Network and who built it?")} />
        <SuggestionChip label="USDC as Gas" onClick={() => setInput("How does USDC as gas work on Arc?")} />
        <SuggestionChip label="Build a Payment App" onClick={() => setInput("How do I build a Peer-to-Peer payment app on Arc?")} />
        <SuggestionChip label="App Kit Setup" onClick={() => setInput("What is the Arc App Kit?")} />
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-6 no-scrollbar scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                max-w-[85%] lg:max-w-[70%] flex gap-4 
                ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}
              `}>
                <div className={`
                  w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm
                  ${message.role === 'user' ? 'bg-arc-blue text-arc-dark' : 'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10'}
                `}>
                  {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className={`
                    p-4 px-6 rounded-2xl relative group
                    ${message.role === 'user' 
                      ? 'bg-arc-blue text-arc-dark font-medium rounded-tr-none shadow-lg shadow-arc-blue/20' 
                      : 'glass-card !border-none !bg-black/5 dark:!bg-white/[0.04] !rounded-tl-none'}
                  `}>
                    <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                      {message.isError ? (
                        <span className="flex items-start gap-2 text-red-500 font-medium">
                          <AlertCircle size={14} className="mt-1 flex-shrink-0" /> {message.content}
                        </span>
                      ) : (
                        message.content.split(/(https?:\/\/[^\s]+)/gi).map((part, i) => (
                          part.match(/^https?:\/\//i) ? (
                            <a 
                              key={i} 
                              href={part} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-arc-blue hover:underline break-all inline-flex items-center gap-1 font-medium"
                            >
                              {part} <ExternalLink size={12} className="inline" />
                            </a>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        ))
                      )}
                    </div>

                    {message.role === 'model' && message.content.length > 0 && !isLoading && (
                      <button 
                        onClick={() => handleCopy(message.content, index)}
                        className="absolute -right-10 top-0 p-2 text-current/20 hover:text-arc-blue transition-all opacity-0 group-hover:opacity-100"
                        title="Copy to clipboard"
                      >
                        {copiedId === index ? (
                          <div className="flex items-center gap-1 text-green-500 text-[10px] font-bold">
                            <Check size={14} /> <span>Copied!</span>
                          </div>
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-current/30 uppercase tracking-widest px-2">
                    {message.role === 'user' ? 'Developer' : 'Arc Intelligence'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start gap-4"
            >
              <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="p-4 px-6 rounded-2xl glass-card !border-none !bg-black/5 dark:!bg-white/[0.04] rounded-tl-none flex items-center gap-1.5 h-12">
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-1.5 rounded-full bg-arc-blue" />
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-arc-blue" />
                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-arc-blue" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 md:p-8 pt-0">
        <div className="relative group glass-card !rounded-2xl border-black/5 dark:border-white/10 focus-within:border-arc-blue/30 transition-all p-1.5 flex gap-2 !bg-black/5 dark:!bg-white/[0.02]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask a question about Arc Network..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-4 px-6 resize-none h-[58px] max-h-32 placeholder:text-current/20 scrollbar-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`
              w-12 h-10 rounded-xl flex items-center justify-center transition-all
              ${input.trim() && !isLoading 
                ? 'bg-arc-blue text-arc-dark hover:scale-105 active:scale-95 shadow-lg shadow-arc-blue/30' 
                : 'bg-black/5 dark:bg-white/5 text-current/20 cursor-not-allowed opacity-50'}
            `}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <SendIcon size={18} />}
          </button>
        </div>
        <p className="mt-4 text-[10px] text-center text-current/30 font-medium tracking-tight">
          Arc Network uses USDC for gas. Refer to the <a href={ARC_KNOWLEDGE.links.docs} target="_blank" className="text-arc-blue hover:underline font-bold">Arc Documentation</a> for implementation details.
        </p>
      </div>
    </div>
  );
}

function SuggestionChip({ label, onClick }: { label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="whitespace-nowrap px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-current/60 hover:text-arc-blue hover:border-arc-blue/30 hover:bg-arc-blue/5 transition-all"
    >
      {label}
    </button>
  );
  }
