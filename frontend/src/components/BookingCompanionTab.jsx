import React, { useState } from 'react';
import { Ticket, CheckCircle2, QrCode, Printer, Download, ShieldCheck, Plane, Building, Calendar, User, Phone, Mail } from 'lucide-react';

export default function BookingCompanionTab({ trip, onConfirmBooking }) {
  const [passengerName, setPassengerName] = useState('Alex & Jordan Mercer');
  const [email, setEmail] = useState('traveler@example.com');
  const [phone, setPhone] = useState('+1 (555) 382-9901');
  const [isBooked, setIsBooked] = useState(false);

  if (!trip) return null;

  const voucher = trip.voucher;

  const handleBook = (e) => {
    e.preventDefault();
    setIsBooked(true);
    if (onConfirmBooking) {
      onConfirmBooking(passengerName, email, phone);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Pillar 5: Booking Companion & Vouchers</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
              Verified & Ticketed
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Instant multi-inventory booking confirmation and travel document retrieval
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Voucher</span>
          </button>
        </div>
      </div>

      {/* TRAVEL VOUCHER DISPLAY CARD */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute right-4 top-4 text-[90px] font-black text-slate-800/20 select-none pointer-events-none font-mono">
          TBO
        </div>

        {/* Voucher Top Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6 relative">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Ticket className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">
                Official Travel Document
              </div>
              <h4 className="text-lg font-extrabold text-white">WanderWise Electronic Travel Voucher</h4>
              <p className="text-xs text-slate-400 font-mono">Issued via TBO Global Distribution System</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{voucher?.status || 'Confirmed & Ticketed'}</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">Ref: {voucher?.booking_reference}</div>
          </div>
        </div>

        {/* Core Credentials Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/90 mb-6 font-mono text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase">Airline PNR</span>
            <div className="text-sm font-bold text-cyan-400">{voucher?.pnr}</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase">Hotel Conf #</span>
            <div className="text-sm font-bold text-amber-300">{voucher?.hotel_confirmation}</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase">Travel Dates</span>
            <div className="text-xs font-bold text-white truncate">{trip.dates}</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase">24/7 Support PIN</span>
            <div className="text-sm font-bold text-emerald-400">{voucher?.support_pin}</div>
          </div>
        </div>

        {/* Flight & Hotel Specifics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Flight Details */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <Plane className="h-3.5 w-3.5" />
              <span>Confirmed Flight Itinerary</span>
            </div>
            <div className="text-sm font-bold text-white">{trip.selected_flight.airline} ({trip.selected_flight.flight_number})</div>
            <div className="text-xs text-slate-300">Route: {trip.selected_flight.origin} ➔ {trip.selected_flight.destination}</div>
            <div className="text-xs text-slate-400 font-mono">Departure: {trip.selected_flight.departure_time} • Cabin: {trip.selected_flight.cabin_class}</div>
            <div className="text-[11px] text-emerald-400">✓ Baggage Allowance: {trip.selected_flight.baggage}</div>
          </div>

          {/* Hotel Details */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
              <Building className="h-3.5 w-3.5" />
              <span>Confirmed Hotel Reservation</span>
            </div>
            <div className="text-sm font-bold text-white">{trip.selected_hotel.name}</div>
            <div className="text-xs text-slate-300">{trip.selected_hotel.location}</div>
            <div className="text-xs text-slate-400 font-mono">Stay: {trip.duration_days} Nights • Deluxe Double/Twin</div>
            <div className="text-[11px] text-emerald-400">✓ {trip.selected_hotel.cancellation_policy}</div>
          </div>
        </div>

        {/* Passenger Info & Verification QR Mock */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white text-slate-950">
              <QrCode className="h-10 w-10" />
            </div>
            <div className="text-xs">
              <div className="font-semibold text-white">Lead Passenger: {passengerName}</div>
              <div className="text-slate-400 text-[11px]">Destination: {trip.destination}</div>
              <div className="text-slate-500 text-[10px] font-mono">Voucher ID: {voucher?.voucher_id}</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase">Total Transaction Verified</div>
            <div className="text-xl font-black text-white">${trip.cost_breakdown.grand_total.toFixed(2)} USD</div>
            <div className="text-[10px] text-emerald-400 font-medium">Includes All Taxes & Airport Fees</div>
          </div>
        </div>
      </div>
    </div>
  );
}
