import React from 'react';
import { DollarSign, TrendingDown, ShieldAlert, Sparkles, PieChart, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CostEstimatorTab({ trip, onApplySavingTip }) {
  if (!trip || !trip.cost_breakdown) return null;

  const cost = trip.cost_breakdown;
  const percentUsed = Math.min(100, Math.round((cost.grand_total / cost.budget_limit) * 100));

  const items = [
    { label: 'Flights (Round-trip)', value: cost.flights_total, color: 'bg-blue-500', percent: Math.round((cost.flights_total / cost.grand_total) * 100) },
    { label: 'Hotel Accommodation', value: cost.hotels_total, color: 'bg-indigo-500', percent: Math.round((cost.hotels_total / cost.grand_total) * 100) },
    { label: 'Airport Transfers & Transit', value: cost.transfers_total, color: 'bg-cyan-500', percent: Math.round((cost.transfers_total / cost.grand_total) * 100) },
    { label: 'Experiences & Activities', value: cost.activities_total, color: 'bg-emerald-500', percent: Math.round((cost.activities_total / cost.grand_total) * 100) },
    { label: 'Dining & Incidentals Buffer', value: cost.food_and_misc, color: 'bg-amber-500', percent: Math.round((cost.food_and_misc / cost.grand_total) * 100) },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>Pillar 4: Cost Estimation & Budget Intelligence</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-medium">
            AI Smart Pricing
          </span>
        </h3>
        <p className="text-xs text-slate-400">
          Real-time expense projection with budget-aware alternatives and discount optimization
        </p>
      </div>

      {/* Main Budget Health Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Estimated Journey Cost</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-white">${cost.grand_total.toFixed(0)}</span>
              <span className="text-xs text-slate-400 font-mono">/ Target Budget ${cost.budget_limit.toFixed(0)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Remaining Surplus</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">
                +${cost.remaining_budget.toFixed(0)}
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingDown className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
            <span>Budget Utilized: <strong className="text-white">{percentUsed}%</strong></span>
            <span className={percentUsed > 90 ? 'text-amber-400' : 'text-emerald-400'}>
              {percentUsed <= 100 ? 'Within Safe Limits' : 'Over Budget'}
            </span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
            {items.map((it, idx) => (
              <div
                key={idx}
                className={`${it.color} h-full transition-all duration-500`}
                style={{ width: `${(it.value / cost.budget_limit) * 100}%` }}
                title={`${it.label}: $${it.value}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Expense Itemization Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <PieChart className="h-4 w-4 text-blue-400" />
            <span>Category Itemization</span>
          </h4>
          <div className="space-y-2.5">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${item.color}`}></div>
                  <span className="text-slate-300">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-400 text-[11px]">{item.percent}%</span>
                  <span className="font-bold text-white font-mono">${item.value.toFixed(0)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget-Aware Alternative Recommendations (Slide 2 Pillar 4) */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>AI Budget-Aware Opportunities</span>
          </h4>
          <p className="text-xs text-slate-400">
            WanderWise evaluated 14 alternative configurations to identify these high-impact savings:
          </p>

          <div className="space-y-2.5">
            {cost.saving_tips?.map((tip, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-blue-500/50 transition-colors flex items-start gap-2.5"
              >
                <div className="h-5 w-5 rounded-md bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingDown className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-300 leading-snug">{tip}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onApplySavingTip}
            className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30 transition-all"
          >
            <span>Auto-Optimize for Maximum Savings</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
