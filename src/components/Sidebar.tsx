import { BookOpen, ExternalLink, Shield, Coins, Cpu, Globe, MessageSquare, Zap, Twitter, Github, Plus, Clock, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useRef, useEffect } from 'react';
import { ARC_KNOWLEDGE } from '../constants';
import { Conversation } from '../types';

interface SidebarProps {
  onClose?: () => void;
  conversations: Conversation[];
  currentId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
}

export default function Sidebar({ onClose, conversations, currentId, onSelectChat, onNewChat, onDeleteChat }: SidebarProps) {
  return (
    <aside className="h-full bg-black/[0.02] dark:bg-white/[0.02] border-r border-black/5 dark:border-white/10 flex flex-col backdrop-blur-2xl overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-arc-blue flex items-center justify-center shadow-lg shadow-arc-blue/20">
              <Zap className="text-arc-dark" size={18} fill="currentColor" />
            </div>
            <span className="font-display font-bold text-xl tracking-tighter uppercase">ARC <span className="text-arc-blue">NETWORK</span></span>
          </div>

          <button 
            onClick={onNewChat}
            className="w-full h-12 glass-card !rounded-xl flex items-center gap-3 px-4 hover:bg-black/5 dark:hover:bg-white/10 transition-all border-dashed border-black/10 dark:border-white/20 mb-8"
          >
            <Plus size={18} className="text-arc-blue" />
            <span className="text-sm font-medium text-current">New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6">
          {conversations.length > 0 && (
            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-current/40 mb-3 px-2 flex items-center gap-2">
                <Clock size={10} /> Chat History
              </h3>
              <ul className="space-y-1">
                <AnimatePresence initial={false}>
                  {conversations.map(conv => (
                    <ChatHistoryItem 
                      key={conv.id}
                      conversation={conv}
                      isActive={currentId === conv.id}
                      onClick={() => onSelectChat(conv.id)}
                      onDelete={() => onDeleteChat(conv.id)}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-current/40 mb-3 px-2">Developer Resources</h3>
            <ul className="space-y-1">
              <SidebarLink icon={<BookOpen size={16} />} label="Documentation" href={ARC_KNOWLEDGE.links.docs} />
              <SidebarLink icon={<Globe size={16} />} label="RPC / Connect" href={ARC_KNOWLEDGE.networkDetails.rpc} />
              <SidebarLink icon={<Shield size={16} />} label="Contract Addresses" href={ARC_KNOWLEDGE.links.docs} />
              <SidebarLink icon={<Coins size={16} />} label="Testnet Faucet" href={ARC_KNOWLEDGE.links.faucet} />
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-current/40 mb-3 px-2">Ecosystem</h3>
            <ul className="space-y-1">
              <SidebarLink icon={<Cpu size={16} />} label="MCP / AI Agents" href={ARC_KNOWLEDGE.tools.aa} />
              <SidebarLink icon={<ExternalLink size={16} />} label="ArcScan Explorer" href={ARC_KNOWLEDGE.links.explorer} />
              <SidebarLink icon={<MessageSquare size={16} />} label="Community" href={ARC_KNOWLEDGE.links.community} />
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-black/5 dark:border-white/5 space-y-4">
        <div className="bg-arc-blue/10 p-4 rounded-xl border border-arc-blue/20">
          <p className="text-[11px] text-arc-blue font-medium mb-1 flex items-center gap-2">
            <Zap size={12} /> Testnet Phase
          </p>
          <p className="text-[10px] text-current/60 leading-relaxed font-mono">
            Arc is currently on Testnet. USDC is the native gas token.
          </p>
        </div>

        <div className="flex items-center justify-between px-2">
          <div className="flex gap-3">
            <a href="#" className="text-current/40 hover:text-arc-blue transition-colors">
              <Twitter size={18} />
            </a>
            <a href="#" className="text-current/40 hover:text-arc-blue transition-colors">
              <Github size={18} />
            </a>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-current/20 block">v0.1.0-alpha</span>
            <span className="text-[10px] font-mono text-arc-blue/40 font-bold block uppercase border-t border-black/5 dark:border-white/5 mt-1 pt-1 italic">BY DAWGPOOL</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

interface ChatHistoryItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

function ChatHistoryItem({ conversation, isActive, onClick, onDelete }: ChatHistoryItemProps) {
  const [showDelete, setShowDelete] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  const startPress = () => {
    const timer = setTimeout(() => setShowDelete(true), 600);
    setPressTimer(timer);
  };

  const endPress = () => {
    if (pressTimer) clearTimeout(pressTimer);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDelete(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
        setShowDelete(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.li
      ref={itemRef}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10, height: 0, marginBottom: 0 }}
      className="relative overflow-visible"
    >
      <button
        onClick={() => !showDelete && onClick()}
        onMouseDown={startPress}
        onMouseUp={endPress}
        onMouseLeave={endPress}
        onTouchStart={startPress}
        onTouchEnd={endPress}
        onContextMenu={handleContextMenu}
        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left rounded-xl transition-all group active:scale-[0.98] ${
          isActive 
            ? 'bg-arc-blue text-arc-dark font-medium shadow-lg shadow-arc-blue/20' 
            : 'text-current/70 hover:text-current hover:bg-black/5 dark:hover:bg-white/5'
        }`}
      >
        <MessageSquare size={14} className={isActive ? 'text-arc-dark' : 'text-arc-light/20 group-hover:text-arc-blue'} />
        <span className="truncate flex-1">{conversation.title}</span>
      </button>

      <AnimatePresence>
        {showDelete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute left-1/2 -top-12 -translate-x-1/2 z-[100] flex gap-1 p-1 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-lg shadow-2xl backdrop-blur-3xl"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                setShowDelete(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-md transition-colors text-xs font-bold"
            >
              <Trash2 size={12} /> Delete
            </button>
            <button
              onClick={() => setShowDelete(false)}
              className="px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-current/40 hover:text-current text-xs font-medium transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function SidebarLink({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
  return (
    <li>
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-3 py-2 text-sm text-current/70 hover:text-arc-blue hover:bg-arc-blue/5 rounded-lg transition-all group"
      >
        <span className="text-current/40 group-hover:text-arc-blue transition-colors">{icon}</span>
        {label}
      </a>
    </li>
  );
                      }
