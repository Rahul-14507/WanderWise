import React, { useState } from 'react';
import { Calendar, Sun, CloudRain, Clock, MapPin, Sparkles, Tag, DollarSign, Compass } from 'lucide-react';

export default function ItineraryTab({ trip }) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  if (!trip || !trip.itinerary || trip.itinerary.length === 0) return null;

  const currentDay = trip.itinerary[selectedDayIndex] || trip.itinerary[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Pillar 3: Personalized Itinerary</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
              Day-by-Day Customized
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Tailored around traveller pace, cultural highlights, and local secrets
          </p>
        </div>

        {/* Day selector pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {trip.itinerary.map((d, idx) => (
            <button
              key={d.day}
              onClick={() => setSelectedDayIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDayIndex === idx
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Day {d.day}
            </button>
          ))}
        </div>
      </div>

      {/* Current Day Header Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Day {currentDay.day} Focus
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-300 font-medium">{currentDay.theme}</span>
          </div>
          <h4 className="text-lg font-bold text-white">{currentDay.title}</h4>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Weather Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <Sun className="h-4 w-4 text-amber-400" />
            <div>
              <div className="font-semibold text-white">{currentDay.temp}</div>
              <div className="text-[10px] text-slate-400">{currentDay.weather}</div>
            </div>
          </div>

          {/* Daily estimated budget */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-right">
            <div className="text-[10px] text-slate-400 uppercase">Est. Day Cost</div>
            <div className="font-bold text-emerald-400 text-sm">${currentDay.day_cost}</div>
          </div>
        </div>
      </div>

      {/* Activities Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {currentDay.activities?.map((act, idx) => (
          <div key={act.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-6 top-1.5 h-5 w-5 rounded-full bg-slate-900 border-2 border-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="h-2 w-2 rounded-full bg-blue-400"></div>
            </div>

            {/* Activity Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${
                    act.time_slot === 'Morning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    act.time_slot === 'Afternoon' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  }`}>
                    {act.time_slot}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" />
                    {act.duration}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                    <Tag className="h-2.5 w-2.5 text-blue-400" />
                    {act.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                    {act.estimated_cost === 0 ? 'Complimentary' : `$${act.estimated_cost}`}
                  </span>
                </div>
              </div>

              <h5 className="font-bold text-white text-sm sm:text-base mb-1.5">{act.title}</h5>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">{act.description}</p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                  <span>{act.location}</span>
                </div>

                {act.tip && (
                  <div className="flex items-center gap-1.5 text-amber-300 text-[11px] bg-amber-950/30 border border-amber-800/30 px-2.5 py-1 rounded-lg">
                    <Sparkles className="h-3 w-3 shrink-0 text-amber-400" />
                    <span><strong>Pro Tip:</strong> {act.tip}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
