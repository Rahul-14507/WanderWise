import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, Compass, ArrowRight, CornerDownLeft } from 'lucide-react';

export default function ChatPanel({ onSendMessage, messages, isTyping, onQuickPrompt }) {
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const samplePrompts = [
    { label: '🗼 Tokyo 4-day plan ($2500)', text: 'Plan a 4-day immersive trip to Tokyo for 2 with $2500 budget' },
    { label: '🏜️ Dubai 3-day luxury', text: 'Plan 3 days in Dubai with Burj Khalifa and desert safari' },
    { label: '🏖️ Goa beach vacation', text: 'Plan 3 days in Goa with beachside resorts and sunset spots' },
    { label: '💰 Switch to cheaper hotel', text: 'Switch to a cheaper hotel to save money' },
    { label: '⚠️ Simulate flight delay', text: 'Simulate flight delay disruption and see how copilot responds' },
    { label: '🎟️ Issue travel voucher', text: 'Generate official confirmed booking vouchers for this trip' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <span>WanderWise AI Copilot</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
            </h2>
            <p className="text-[11px] text-slate-400">Conversational Discovery & Action Engine</p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-2 bg-slate-950/40 border-b border-slate-800/60 overflow-x-auto scrollbar-none flex gap-2">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => onQuickPrompt(p.text)}
            className="text-[11px] whitespace-nowrap bg-slate-800/80 hover:bg-slate-700/80 hover:text-white border border-slate-700/50 text-slate-300 px-2.5 py-1 rounded-full transition-all shrink-0 flex items-center gap-1"
          >
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role !== 'user' && (
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                <Bot className="h-3.5 w-3.5" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-sm whitespace-pre-line'
              }`}
            >
              {m.content}
            </div>
            {m.role === 'user' && (
              <div className="h-7 w-7 rounded-lg bg-slate-700 flex items-center justify-center text-white shrink-0 mt-0.5">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
            <div className="h-6 w-6 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400">
              <RefreshCw className="h-3 w-3 animate-spin" />
            </div>
            <span className="italic">WanderWise Agent analyzing options & coordinating tools...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-900/90 border-t border-slate-800">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask WanderWise: 'Switch hotel', 'Budget breakdown', 'Add evening cruise'..."
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-3.5 pr-12 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-1.5 p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white transition-all shadow-md shadow-blue-600/30"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 px-1">
          <span>Personalized • Actionable • Continuous</span>
          <span className="flex items-center gap-1">Press <CornerDownLeft className="h-2.5 w-2.5" /> to send</span>
        </div>
      </form>
    </div>
  );
}
