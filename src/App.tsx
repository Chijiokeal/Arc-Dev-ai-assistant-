import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send as SendIcon, 
  Zap, 
  BookOpen, 
  ExternalLink, 
  Shield, 
  Coins,
  Cpu,
  Menu,
  X,
  Globe,
  ChevronRight,
  Plus,
  Sun,
  Moon
} from 'lucide-react';
import Chat from './components/Chat';
import SendReceiveDemo from './components/SendReceiveDemo';
import Sidebar from './components/Sidebar';
import { ARC_KNOWLEDGE } from './constants';
import { Conversation, Message } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'demo'>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('arc_theme');
    return saved ? saved === 'dark' : true;
  });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('arc_conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversations(parsed);
      } catch (e) {
        console.error('Failed to parse conversations', e);
      }
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('arc_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('arc_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleNewChat = () => {
    setCurrentId(null);
    setActiveTab('chat');
    setIsSidebarOpen(window.innerWidth > 1024);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentId(id);
    setActiveTab('chat');
    setIsSidebarOpen(window.innerWidth > 1024);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentId === id) {
      setCurrentId(null);
    }
  };

  const handleUpdateConversation = (id: string, messages: Message[]) => {
    setConversations(prev => {
      const existing = prev.find(c => c.id === id);
      if (existing) {
        return prev.map(c => c.id === id ? { ...c, messages } : c);
      } else {
        const firstUserMessage = messages.find(m => m.role === 'user')?.content || 'New Conversation';
        const newConv: Conversation = {
          id,
          title: firstUserMessage.length > 30 ? firstUserMessage.substring(0, 30) + '...' : firstUserMessage,
          date: Date.now(),
          messages
        };
        return [newConv, ...prev];
      }
    });
    setCurrentId(id);
  };

  return (
    <div className="flex h-screen bg-arc-light dark:bg-arc-dark text-arc-dark dark:text-arc-light overflow-hidden arc-grid relative">
      <div className="glow-point w-[500px] h-[500px] bg-arc-blue -top-24 -left-24" />
      <div className="glow-point w-[400px] h-[400px] bg-circle-blue bottom-0 right-0" />
      <div className="glow-point w-[300px] h-[300px] bg-purple-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div 
        animate={{ 
          width: isSidebarOpen ? 288 : 0,
          opacity: isSidebarOpen ? 1 : 0,
          x: isSidebarOpen ? 0 : -288
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="fixed inset-y-0 left-0 z-50 lg:relative lg:block overflow-hidden h-full"
      >
        <div className="w-72 h-full">
          <Sidebar 
            onClose={() => setIsSidebarOpen(false)} 
            conversations={conversations}
            currentId={currentId}
            onSelectChat={handleSelectConversation}
            onNewChat={handleNewChat}
            onDeleteChat={handleDeleteConversation}
          />
        </div>
      </motion.div>

      <main className="flex-1 flex flex-col min-w-0 relative h-full glass-panel border-none rounded-none m-0">
        <header className="h-20 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-4 sm:px-8 glass-panel !shadow-none !bg-white/10 dark:!bg-white/[0.01] z-30">
          <div className="flex items-center gap-3 sm:gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-current transition-colors"
            >
              <Menu size={20} />
            </button>
            <a 
              href={ARC_KNOWLEDGE.links.docs} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 sm:gap-3 group"
            >
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRK7hI3RnFgCHTiQzT7GUaSB48ZpcFTi7m7Gt_qO7umf4EVvULAkPswZtf&s=10" 
                alt="Arc Network" 
                className="h-8 sm:h-10 w-auto rounded-lg group-hover:scale-110 transition-all object-contain shadow-sm"
              />
              <div className="block">
                <h1 className="font-display font-bold text-[10px] min-[320px]:text-xs sm:text-lg tracking-tight whitespace-nowrap">ArcDev <span className="text-arc-blue">Assistant</span></h1>
              </div>
            </a>
          </div>

          <div className="hidden md:flex gap-1 p-1.5 bg-black/5 dark:bg-black/40 backdrop-blur-3xl rounded-xl border border-black/10 dark:border-white/10 h-11 items-center">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'chat' 
                  ? 'bg-arc-blue text-arc-dark shadow-lg shadow-arc-blue/30' 
                  : 'text-current/50 hover:text-current hover:bg-white/5'
              }`}
            >
              Assistant
            </button>
            <button
              onClick={() => setActiveTab('demo')}
              className={`px-5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'demo' 
                  ? 'bg-arc-blue text-arc-dark shadow-lg shadow-arc-blue/30' 
                  : 'text-current/50 hover:text-current hover:bg-white/5'
              }`}
            >
              App Kit
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-current hover:scale-110 transition-all shadow-sm"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Moon size={16} className="sm:w-[18px] sm:h-[18px]" />}
            </button>
            <a 
              href={ARC_KNOWLEDGE.links.faucet} 
              target="_blank" 
              className="px-3 sm:px-4 py-2 bg-arc-blue text-arc-dark rounded-xl text-[10px] sm:text-xs font-bold hover:scale-105 transition-all flex items-center gap-1 sm:gap-2 shadow-lg shadow-arc-blue/20"
            >
              <Coins size={14} /> <span className="hidden min-[380px]:inline">Faucet</span>
            </a>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === 'chat' ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex flex-col"
              >
                <Chat 
                  conversationId={currentId} 
                  initialMessages={conversations.find(c => c.id === currentId)?.messages}
                  onUpdate={handleUpdateConversation}
                />
              </motion.div>
            ) : (
              <motion.div
                key="demo"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 overflow-y-auto"
              >
                <SendReceiveDemo />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
