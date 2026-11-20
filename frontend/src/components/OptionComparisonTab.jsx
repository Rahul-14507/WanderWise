import React, { useState } from 'react';
import { Plane, Building, Car, Check, Clock, Shield, Star, DollarSign, Sparkles, Luggage, Navigation } from 'lucide-react';

export default function OptionComparisonTab({ trip, onSelectOption }) {
  const [activeSubTab, setActiveSubTab] = useState('flights');

  if (!trip) return null;

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Pillar 2: Travel Option Comparison</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium">
              TBO Multi-Inventory
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Compare curated options side-by-side and swap with a single click
          </p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('flights')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'flights'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plane className="h-3.5 w-3.5" />
            <span>Flights ({trip.flight_options?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('hotels')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'hotels'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building className="h-3.5 w-3.5" />
            <span>Hotels ({trip.hotel_options?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('transfers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'transfers'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Car className="h-3.5 w-3.5" />
            <span>Transfers</span>
          </button>
        </div>
      </div>

      {/* FLIGHTS COMPARISON */}
      {activeSubTab === 'flights' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trip.flight_options?.map((flight) => {
              const isSelected = trip.selected_flight?.id === flight.id;
              return (
                <div
                  key={flight.id}
                  className={`rounded-2xl p-4 transition-all flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-gradient-to-b from-blue-900/30 to-slate-900 border-blue-500 ring-2 ring-blue-500/30 shadow-xl'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Airline & Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white text-sm flex items-center gap-1.5">
                        <Plane className="h-4 w-4 text-blue-400" />
                        {flight.airline}
                      </span>
                      {flight.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                          {flight.badge}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 font-mono mb-3">
                      Flight #{flight.flight_number} • {flight.cabin_class}
                    </div>

                    {/* Timing & Duration */}
                    <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80 mb-3 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-white text-sm">{flight.departure_time}</div>
                          <div className="text-slate-500 text-[10px]">{flight.origin}</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-slate-400 font-mono">{flight.duration}</span>
                          <div className="w-16 h-0.5 bg-slate-700 my-1 relative">
                            <Plane className="h-2.5 w-2.5 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          </div>
                          <span className="text-[9px] text-emerald-400 font-semibold">
                            {flight.stops === 0 ? 'Non-Stop' : `${flight.stops} Stop`}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white text-sm">{flight.arrival_time}</div>
                          <div className="text-slate-500 text-[10px]">{flight.destination}</div>
                        </div>
                      </div>
                    </div>

                    {/* Perks */}
                    <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Luggage className="h-3 w-3 text-slate-500" />
                        <span>{flight.baggage}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Shield className="h-3 w-3 text-emerald-400" />
                        <span>On-time reliability: <strong className="text-emerald-400">{flight.on_time_performance}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Select Button */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Per Passenger</div>
                      <div className="text-lg font-bold text-white">${flight.price}</div>
                    </div>
                    <button
                      onClick={() => onSelectOption('flight', flight.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <span>Choose Flight</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* HOTELS COMPARISON */}
      {activeSubTab === 'hotels' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trip.hotel_options?.map((hotel) => {
            const isSelected = trip.selected_hotel?.id === hotel.id;
            return (
              <div
                key={hotel.id}
                className={`rounded-2xl overflow-hidden transition-all flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-gradient-to-b from-blue-900/30 to-slate-900 border-blue-500 ring-2 ring-blue-500/30 shadow-xl'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="h-36 relative overflow-hidden bg-slate-800">
                    <img
                      src={hotel.image_url}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      {hotel.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-amber-300 border border-amber-500/30 font-semibold">
                          {hotel.badge}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-emerald-400 font-bold text-xs flex items-center gap-1">
                      <Star className="h-3 w-3 fill-emerald-400 text-emerald-400" />
                      <span>{hotel.review_score} / 5</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-white text-sm leading-tight">{hotel.name}</h4>
                    </div>
                    <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                      <Navigation className="h-3 w-3 text-blue-400 shrink-0" />
                      <span>{hotel.location}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                      {hotel.neighborhood}
                    </p>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <div className="text-[11px] text-emerald-400 font-medium">
                      ✓ {hotel.cancellation_policy}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-800/80 flex items-center justify-between mt-2">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Per Night</div>
                    <div className="text-base font-bold text-white">
                      ${hotel.price_per_night} <span className="text-xs text-slate-400 font-normal">(${hotel.total_price} total)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectOption('hotel', hotel.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Selected</span>
                      </>
                    ) : (
                      <span>Select Hotel</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TRANSFERS COMPARISON */}
      {activeSubTab === 'transfers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trip.transfer_options?.map((transfer) => {
            const isSelected = trip.selected_transfer?.id === transfer.id;
            return (
              <div
                key={transfer.id}
                className={`rounded-2xl p-5 border flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-900/30 to-slate-900 border-blue-500 ring-2 ring-blue-500/30 shadow-xl'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-blue-400" />
                    <h4 className="font-bold text-white text-sm">{transfer.type}</h4>
                    {transfer.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {transfer.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono">Provider: {transfer.provider} • Duration: {transfer.duration}</p>
                  <p className="text-xs text-slate-300">{transfer.comfort_level}</p>
                </div>

                <div className="text-right pl-4">
                  <div className="text-base font-bold text-white mb-2">${transfer.price}</div>
                  <button
                    onClick={() => onSelectOption('transfer', transfer.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    {isSelected ? <Check className="h-3.5 w-3.5" /> : null}
                    <span>{isSelected ? 'Selected' : 'Choose'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
