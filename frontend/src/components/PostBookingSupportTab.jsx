import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CloudRain, Clock, Plane, CheckCircle2, RefreshCw, Zap, Bell, ArrowRight } from 'lucide-react';

export default function PostBookingSupportTab({ trip, onSimulateDisruption }) {
  const [activeScenario, setActiveScenario] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  if (!trip) return null;

  const handleSimulate = (scenarioKey) => {
    setIsSimulating(true);
    setActiveScenario(scenarioKey);
    setTimeout(() => {
      onSimulateDisruption(scenarioKey);
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>Pillar 6: Post-Booking Support & Disruption Shield</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-medium">
            Autonomous 24/7 Copilot
          </span>
        </h3>
        <p className="text-xs text-slate-400">
          Continuous AI monitoring beyond booking: flight delay handling, weather rescheduling, and real-time care
        </p>
      </div>

      {/* Interactive Disruption Simulation Control Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <Zap className="h-4 w-4" />
          <span>Interactive Judges Simulation: Test Copilot Reaction</span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Click any scenario below to see how WanderWise Copilot autonomously protects the traveller in real time:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleSimulate('delay')}
            disabled={isSimulating}
            className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                <Clock className="h-4 w-4" />
                <span>Flight Delay (+2h)</span>
              </div>
              <p className="text-[11px] text-slate-400">Simulate runway congestion & late inbound connection</p>
            </div>
            <div className="mt-3 text-[10px] text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Trigger Simulation</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </button>

          <button
            onClick={() => handleSimulate('weather')}
            disabled={isSimulating}
            className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
                <CloudRain className="h-4 w-4" />
                <span>Heavy Rain Alert</span>
              </div>
              <p className="text-[11px] text-slate-400">Simulate sudden thunderstorm during outdoor day trip</p>
            </div>
            <div className="mt-3 text-[10px] text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Trigger Simulation</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </button>

          <button
            onClick={() => handleSimulate('gate')}
            disabled={isSimulating}
            className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold mb-1">
                <Plane className="h-4 w-4" />
                <span>Terminal Gate Change</span>
              </div>
              <p className="text-[11px] text-slate-400">Simulate last-minute airport gate reallocation</p>
            </div>
            <div className="mt-3 text-[10px] text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Trigger Simulation</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </button>
        </div>
      </div>

      {/* Live Disruption & Copilot Activity Feed */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Bell className="h-4 w-4 text-blue-400" />
          <span>Active Journey Monitor & AI Actions ({trip.post_booking_alerts?.length || 0})</span>
        </h4>

        <div className="space-y-3">
          {trip.post_booking_alerts?.map((alert, idx) => (
            <div
              key={alert.id || idx}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex items-start gap-3.5 transition-all"
            >
              <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="h-4 w-4" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h5 className="font-bold text-white text-sm">{alert.type}</h5>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 w-fit">
                    Status: {alert.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>
                <div className="pt-2 text-[11px] text-cyan-400 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Copilot Automation: {alert.action_available}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 24/7 Guarantee Badge */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-blue-950/30 border border-emerald-800/40 flex items-center gap-3 text-xs text-slate-300">
        <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
        <div>
          <span className="font-bold text-white">WanderWise SafeJourney Guarantee:</span> Direct integration with TBO B2B customer support routing ensures zero wait times on cancellations, disruptions, and refunds.
        </div>
      </div>
    </div>
  );
}
