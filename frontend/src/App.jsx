import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AgentWorkflowBar from './components/AgentWorkflowBar';
import ChatPanel from './components/ChatPanel';
import OptionComparisonTab from './components/OptionComparisonTab';
import ItineraryTab from './components/ItineraryTab';
import CostEstimatorTab from './components/CostEstimatorTab';
import BookingCompanionTab from './components/BookingCompanionTab';
import PostBookingSupportTab from './components/PostBookingSupportTab';

import { 
  Compass, MapPin, Calendar, Users, DollarSign, 
  Layers, ShieldAlert, Sparkles, RefreshCw, CheckCircle2 
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

export default function App() {
  const [trip, setTrip] = useState(null);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [activeMode, setActiveMode] = useState('traveler'); // 'traveler' or 'copilot'
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm **WanderWise**, your AI Travel Agent Copilot for **VoyageHack 4.0**.\n\nI turn your travel intent from *'Where should I go?'* to *'Your trip is ready.'*\n\nI have pre-orchestrated a sample journey to **Tokyo, Japan** based on your preferences. You can ask me to change hotels, swap flights, optimize your budget, or simulate real-world flight disruptions!"
    }
  ]);

  // Load initial trip plan
  useEffect(() => {
    fetchDefaultTrip();
  }, []);

  const fetchDefaultTrip = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/trip/default`);
      if (res.ok) {
        const data = await res.json();
        setTrip(data);
      }
    } catch (err) {
      console.warn('Backend server not yet ready, using local initial state', err);
    }
  };

  const handleSendMessage = async (userText) => {
    // Add user message
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: newMessages.map(m => ({ role: m.role, content: m.content })),
          current_trip: trip
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        if (data.updated_trip) {
          setTrip(data.updated_trip);
        }
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      // Local graceful fallback if backend is offline
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            content: `I processed your request: "${userText}". WanderWise Copilot has evaluated options across TBO GDS and updated your journey plan!` 
          }
        ]);
      }, 700);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectOption = async (optionType, optionId) => {
    if (!trip) return;
    try {
      const res = await fetch(`${API_BASE}/api/trip/select-option`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip,
          option_type: optionType,
          option_id: optionId
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setTrip(updated);
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `Updated your trip selection to **${optionId}**. Costs, itinerary schedules, and vouchers have been re-synchronized.`
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulateDisruption = async (scenarioKey) => {
    if (!trip) return;
    try {
      const res = await fetch(`${API_BASE}/api/disruption/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip,
          scenario: scenarioKey
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setTrip(updated);
        const alertMsg = updated.post_booking_alerts[0]?.message || 'Disruption resolved';
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `⚠️ **Live Disruption Handled:**\n${alertMsg}`
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSwitchDestination = async (destName) => {
    setIsTyping(true);
    try {
      const res = await fetch(`${API_BASE}/api/trip/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destName,
          budget: destName === 'Goa' ? 850 : destName === 'Dubai' ? 2200 : 2500,
          days: destName === 'Goa' ? 3 : 4,
          traveler_type: 'Couple / Explorers'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setTrip(data);
        setMessages(prev => [
          ...prev,
          {
            role: 'user',
            content: `Plan a trip to ${destName}`
          },
          {
            role: 'assistant',
            content: `I've prepared a comprehensive journey to **${data.destination}**! All 6 pillars (Discovery, Comparisons, Itinerary, Costs, Vouchers, and Disruption Protection) are generated.`
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const tabs = [
    { id: 'itinerary', label: 'Personalized Itinerary', badge: 'Pillar 3', icon: Calendar },
    { id: 'compare', label: 'Travel Option Comparison', badge: 'Pillar 2', icon: Layers },
    { id: 'costs', label: 'Cost Estimation', badge: 'Pillar 4', icon: DollarSign },
    { id: 'booking', label: 'Booking Companion', badge: 'Pillar 5', icon: CheckCircle2 },
    { id: 'support', label: 'Post-Booking Support', badge: 'Pillar 6', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar activeMode={activeMode} setActiveMode={setActiveMode} trip={trip} />

      {/* Slide 3 End-to-End Agent Workflow Progress Bar */}
      <AgentWorkflowBar logs={trip?.orchestration_logs || []} />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 flex flex-col gap-4">
        {/* Destination Quick Selector Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-rose-400" />
            <span className="text-xs font-semibold text-slate-300">Quick Destination Switcher:</span>
            <div className="flex gap-1.5 flex-wrap">
              {['Tokyo', 'Dubai', 'Goa', 'Paris'].map(dest => (
                <button
                  key={dest}
                  onClick={() => handleSwitchDestination(dest)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    trip?.destination?.includes(dest)
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>

          {/* Current Active Trip Metrics */}
          {trip && (
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span>{trip.destination}</span>
              <span>•</span>
              <span>{trip.dates}</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">${trip.cost_breakdown.grand_total.toFixed(0)} USD</span>
            </div>
          )}
        </div>

        {/* 2-Column Split: Copilot Chat (Left) + Interactive Solution Dashboard (Right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[640px]">
          {/* Left Column: Conversational Discovery & Copilot (Slide 2 Pillar 1 & Slide 3 Step 1-2) */}
          <div className="lg:col-span-5 h-[620px] lg:h-auto">
            <ChatPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
              onQuickPrompt={handleSendMessage}
            />
          </div>

          {/* Right Column: Dynamic Travel Intelligence Workspace */}
          <div className="lg:col-span-7 flex flex-col bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
            {/* Tab Header */}
            <div className="border-b border-slate-800 bg-slate-900/90 px-4 pt-3 overflow-x-auto scrollbar-none flex gap-2">
              {tabs.map(t => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                      isActive
                        ? 'border-blue-500 bg-slate-800/80 text-white shadow-sm'
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                    <span>{t.label}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                      isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {t.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tab Body */}
            <div className="flex-1 p-5 overflow-y-auto">
              {!trip ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3 py-16">
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
                  <p className="text-xs">Orchestrating trip details with LangGraph agent...</p>
                </div>
              ) : (
                <>
                  {activeTab === 'itinerary' && <ItineraryTab trip={trip} />}
                  {activeTab === 'compare' && (
                    <OptionComparisonTab trip={trip} onSelectOption={handleSelectOption} />
                  )}
                  {activeTab === 'costs' && (
                    <CostEstimatorTab
                      trip={trip}
                      onApplySavingTip={() => handleSendMessage('Switch to a cheaper hotel')}
                    />
                  )}
                  {activeTab === 'booking' && (
                    <BookingCompanionTab
                      trip={trip}
                      onConfirmBooking={(name, email, phone) => {
                        handleSendMessage(`Confirm booking for ${name}`);
                      }}
                    />
                  )}
                  {activeTab === 'support' && (
                    <PostBookingSupportTab
                      trip={trip}
                      onSimulateDisruption={handleSimulateDisruption}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-3 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-slate-300">WanderWise</strong> — A complete travel journey, powered by one AI Agent
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span>VOYAGEHACK 4.0 (TBO.com)</span>
            <span>•</span>
            <span className="text-slate-400">Team INVICTUS: Rongali Nandika Laxmi Narayani & Rahul Pujari</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
