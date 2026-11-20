import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, Activity, Terminal, X, Zap } from 'lucide-react';

export default function AgentWorkflowBar({ logs = [] }) {
  const [showLogsModal, setShowLogsModal] = useState(false);

  const steps = [
    { num: 1, label: 'Traveller Request', sub: 'Dates • Budget • Interests' },
    { num: 2, label: 'AI Preference Analysis', sub: 'Clarify Needs • Constraints' },
    { num: 3, label: 'Agent Orchestration', sub: 'LangGraph State Planner' },
    { num: 4, label: 'Travel Services', sub: 'Flights • Hotels • Activities' },
    { num: 5, label: 'Trip Plan & Management', sub: 'Itinerary • Cost • Vouchers' },
  ];

  return (
    <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Step Progression Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs scrollbar-none">
          <div className="flex items-center gap-1.5 text-blue-400 font-semibold uppercase tracking-wider text-[11px] pr-2 shrink-0">
            <Zap className="h-3.5 w-3.5 fill-blue-400 text-blue-400" />
            <span>Workflow:</span>
          </div>
          {steps.map((st, i) => (
            <React.Fragment key={st.num}>
              <div className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg px-2.5 py-1 shrink-0 transition-colors">
                <span className="flex h-4 w-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] items-center justify-center border border-emerald-500/40">
                  {st.num}
                </span>
                <span className="font-medium text-slate-200">{st.label}</span>
                <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
              </div>
              {i < steps.length - 1 && (
                <ChevronRight className="h-3.5 w-3.5 text-slate-600 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* View LangGraph Logs Button */}
        <button
          onClick={() => setShowLogsModal(true)}
          className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono bg-cyan-950/40 hover:bg-cyan-950/60 border border-cyan-800/50 px-2.5 py-1 rounded-lg transition-colors shrink-0 self-start md:self-auto"
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>Inspect Agent Reasoning</span>
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
        </button>
      </div>

      {/* Modal for Agent Orchestration Details */}
      {showLogsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-cyan-400" />
                <h3 className="font-semibold text-white">LangGraph Agent Orchestration Trace</h3>
              </div>
              <button
                onClick={() => setShowLogsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 overflow-y-auto space-y-3 font-mono text-xs pr-1">
              {logs && logs.length > 0 ? (
                logs.map((lg, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-cyan-400 font-semibold">
                        [STAGE {lg.step_number}] {lg.name}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {lg.status}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{lg.details}</p>
                    <div className="mt-2 text-[10px] text-slate-500">{lg.timestamp}</div>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 p-4 text-center">No active execution logs found.</div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span>LangGraph v0.2 • FastAPI Agent Loop</span>
              <button
                onClick={() => setShowLogsModal(false)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
