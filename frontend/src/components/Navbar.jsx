import React from 'react';
import { Compass, Sparkles, ShieldCheck, Cpu, UserCheck, Plane } from 'lucide-react';

export default function Navbar({ activeMode, setActiveMode, trip }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Team Info */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Compass className="h-5 w-5 text-blue-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-white bg-clip-text text-transparent">
                WanderWise
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                VOYAGEHACK 4.0
              </span>
              <span className="hidden sm:inline-flex text-[10px] uppercase font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                TBO.com
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>Team <strong className="text-slate-200 font-semibold">INVICTUS</strong></span>
              <span className="text-slate-600">•</span>
              <span className="hidden md:inline">IARE College</span>
              <span className="text-slate-600">•</span>
              <span className="text-blue-400/90 font-medium">Virtual Travel Agent Copilot</span>
            </p>
          </div>
        </div>

        {/* Status Indicators & Mode Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Agent Workflow Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <Cpu className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span className="text-slate-300 font-mono">LangGraph Orchestrator:</span>
            <span className="text-emerald-400 font-semibold">5-Stage Active</span>
          </div>

          {/* TBO GDS Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-slate-300">TBO Services:</span>
            <span className="text-slate-200 font-medium">Flights • Hotels • Transfers</span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 text-xs font-medium">
            <button
              onClick={() => setActiveMode('traveler')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeMode === 'traveler'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Traveller Mode</span>
            </button>
            <button
              onClick={() => setActiveMode('copilot')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeMode === 'copilot'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Agent Copilot Mode</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
