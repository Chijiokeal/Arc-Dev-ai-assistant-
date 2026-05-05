import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  Zap, 
  Shield, 
  Wallet, 
  CheckCircle2, 
  Copy,
  Info,
  ChevronRight,
  Loader2,
  Lock
} from 'lucide-react';

export default function SendReceiveDemo() {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [balance, setBalance] = useState('1,250.40');

  const handleSend = () => {
    if (!amount || !address) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSuccess(true);
      setBalance((prev) => (parseFloat(prev.replace(',', '')) - parseFloat(amount)).toLocaleString());
      setTimeout(() => setSuccess(false), 5000);
      setAmount('');
      setAddress('');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-12">
      <section className="space-y-4 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-arc-blue/10 text-arc-blue rounded-full border border-arc-blue/20 text-[10px] font-mono tracking-widest uppercase">
          <Zap size={12} fill="currentColor" /> App Kit Integration
        </div>
        <h2 className="text-3xl font-display font-bold">Programmable <span className="text-arc-blue">Payments</span></h2>
        <p className="text-current/60 max-w-2xl leading-relaxed">
          Demo how Arc Network simplifies stablecoin operations. On Arc, USDC is the native gas token — removing the need for users to hold a separate L1 utility token.
        </p>
      </section>

      <div className="grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
          <div className="glass-card p-10 rounded-[40px]">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-arc-blue/20 blur-[120px] rounded-full" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-xs text-current/40 font-mono uppercase tracking-[0.2em] mb-2">Portfolio Balance</p>
                  <h3 className="text-5xl font-display font-medium text-current tracking-tighter">{balance} <span className="text-arc-blue">USDC</span></h3>
                </div>
                <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 shadow-inner">
                  <Wallet className="text-arc-blue" size={28} />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-current/40 mb-3 px-1 tracking-widest">Recipient Network Address</label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-arc-blue/50 focus:ring-0 transition-all text-current font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-current/40 mb-3 px-1 tracking-widest">Transfer Amount (USDC)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-arc-blue/50 focus:ring-0 transition-all text-current font-mono"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-arc-blue font-bold px-2 py-1 bg-arc-blue/10 rounded cursor-pointer hover:bg-arc-blue/20 transition-colors">MAX</div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleSend}
                    disabled={!amount || !address || isSending}
                    className="w-full h-16 bg-arc-blue text-arc-dark font-display font-bold text-lg rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100 shadow-2xl shadow-arc-blue/20"
                  >
                    {isSending ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : success ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <ArrowUpRight size={20} />
                    )}
                    {isSending ? 'Simulating Settlement...' : success ? 'Transaction Finalized' : 'Send Payment'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                <Shield size={18} />
              </div>
              <div>
                <p className="text-[10px] font-mono text-current/40 uppercase">Deterministic</p>
                <p className="text-xs font-semibold">Sub-second Finality</p>
              </div>
            </div>
            <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-arc-blue/10 flex items-center justify-center text-arc-blue">
                <RefreshCw size={18} />
              </div>
              <div>
                <p className="text-[10px] font-mono text-current/40 uppercase">Gas Policy</p>
                <p className="text-xs font-semibold">Pay with USDC</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 rounded-[32px] space-y-8">
            <h4 className="text-base font-display font-bold flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-arc-blue/10 flex items-center justify-center">
                <Info size={16} className="text-arc-blue" />
              </div> 
              Why Arc Network?
            </h4>
            
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="mt-1"><ChevronRight size={14} className="text-arc-blue" /></div>
                <p className="text-xs text-current/60 leading-relaxed italic">
                  <span className="text-current font-medium not-italic block mb-1">Native USDC Gas</span>
                  Users don't need to bridge and hold ETH. They can pay network fees directly in stablecoins.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="mt-1"><ChevronRight size={14} className="text-arc-blue" /></div>
                <p className="text-xs text-current/60 leading-relaxed italic">
                  <span className="text-current font-medium not-italic block mb-1">Agentic Economy</span>
                  AI agents can settle micro-payments instantly using ERC-8183 job escrow standards.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="mt-1"><ChevronRight size={14} className="text-arc-blue" /></div>
                <p className="text-xs text-current/60 leading-relaxed italic">
                  <span className="text-current font-medium not-italic block mb-1">Unified Balance</span>
                  App Kit abstracts chain fragmentation, making USDC on Arc feel like one global pool.
                </p>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-circle-blue/20 dark:bg-circle-blue/20 border border-circle-blue/30 relative overflow-hidden text-current">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Lock size={80} />
            </div>
            <h4 className="text-sm font-display font-bold mb-2">Build Sustainably</h4>
            <p className="text-[11px] text-current/70 leading-relaxed">
              Arc's infrastructure is built by Circle, ensuring institutional-grade security and compliance ready for global commerce.
            </p>
            <a 
              href="https://docs.arc.network" 
              target="_blank"
              className="mt-4 flex items-center gap-1 text-[11px] text-arc-blue font-bold hover:underline"
            >
              Start Building <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
