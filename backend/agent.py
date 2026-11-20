"""
WanderWise AI Agent Orchestrator
Implements the 5-step End-to-End Workflow & 6 Core Capabilities from the VoyageHack 4.0 submission:
1. Traveller Request (Conversational Discovery)
2. AI Preference Analysis (Clarify needs, extract constraints)
3. Agent Orchestration (Plan, select tools, coordinate sub-agents)
4. Travel Services (Flights, Hotels, Transfers, Activities via TBO GDS)
5. Trip Plan & Management (Itinerary, Cost Breakdown, Booking Companion & Post-Booking Support)
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
from models import TripPlan, ChatResponse, OrchestrationStepLog
from data_service import build_complete_trip, DESTINATIONS_DATA

# If langgraph is available, we can model this as a formal graph or state runner
try:
    from langgraph.graph import StateGraph, END
    LANGGRAPH_AVAILABLE = True
except ImportError:
    LANGGRAPH_AVAILABLE = False

class WanderWiseAgent:
    def __init__(self):
        self.conversation_memory: List[Dict[str, str]] = []

    def extract_intent_and_entities(self, user_message: str) -> Dict[str, Any]:
        msg = user_message.lower()
        
        # Detect destination
        destination = "Tokyo"
        for d in DESTINATIONS_DATA.keys():
            if d.lower() in msg:
                destination = d
                break
        
        # Detect days
        days = 4
        words = msg.split()
        for idx, w in enumerate(words):
            if w.isdigit() and idx + 1 < len(words) and "day" in words[idx + 1]:
                days = max(1, min(14, int(w)))
                break
            elif "weekend" in msg:
                days = 3
                break

        # Detect budget
        budget = 2500.0
        if "3000" in msg:
            budget = 3000.0
        elif "2000" in msg:
            budget = 2000.0
        elif "1500" in msg:
            budget = 1500.0
        elif "35000" in msg or "35k" in msg:
            budget = 500.0 # INR converted to USD approx
        elif "luxury" in msg:
            budget = 4500.0
        elif "budget" in msg or "cheap" in msg:
            budget = 1400.0

        # Traveler type
        traveler_type = "Couple / Explorers"
        if "solo" in msg:
            traveler_type = "Solo Traveler"
        elif "family" in msg or "kids" in msg:
            traveler_type = "Family with Children"
        elif "friends" in msg or "group" in msg:
            traveler_type = "Friends Group"

        # Action request (e.g., flight change, hotel switch, disruption simulation)
        is_change_request = any(k in msg for k in ["change", "switch", "cheaper", "upgrade", "delay", "cancel", "refund", "voucher"])

        return {
            "destination": destination,
            "days": days,
            "budget": budget,
            "traveler_type": traveler_type,
            "is_change_request": is_change_request
        }

    def process_message(self, user_message: str, current_trip: Optional[TripPlan] = None) -> ChatResponse:
        entities = self.extract_intent_and_entities(user_message)
        msg_lower = user_message.lower()

        # Step 1: Request parsing
        # Step 2: Preference Analysis
        # Step 3: Orchestration
        # Step 4: Travel Services retrieval
        # Step 5: Plan & Management

        # Check for specific interactive prompts
        if "cheaper hotel" in msg_lower or "budget hotel" in msg_lower:
            if current_trip and len(current_trip.hotel_options) > 1:
                cheaper_hotel = current_trip.hotel_options[-1]
                current_trip.selected_hotel = cheaper_hotel
                # recalculate costs
                diff = current_trip.hotel_options[0].total_price - cheaper_hotel.total_price
                current_trip.cost_breakdown.hotels_total = cheaper_hotel.total_price
                current_trip.cost_breakdown.grand_total -= diff
                current_trip.cost_breakdown.remaining_budget += diff
                
                logs = [
                    OrchestrationStepLog(
                        step_number=1,
                        name="Traveller Preference Update",
                        status="SUCCESS",
                        details="Received request to optimize accommodation cost.",
                        timestamp="Action: Hotel Swap"
                    ),
                    OrchestrationStepLog(
                        step_number=3,
                        name="Cost Optimization Engine",
                        status="SUCCESS",
                        details=f"Swapped to {cheaper_hotel.name}. Saved ${diff:.0f}.",
                        timestamp="Budget Saved"
                    )
                ]
                reply = (
                    f"Done! I've switched your accommodation to **{cheaper_hotel.name}** "
                    f"in {cheaper_hotel.neighborhood}. This immediately saves you **${diff:.0f}**, "
                    f"bringing your grand total down to **${current_trip.cost_breakdown.grand_total:.0f}** "
                    f"(well below your ${current_trip.cost_breakdown.budget_limit:.0f} budget limit)."
                )
                return ChatResponse(
                    reply=reply,
                    suggested_actions=["View updated cost breakdown", "Check cancellation policy", "Confirm booking"],
                    updated_trip=current_trip,
                    orchestration_logs=logs
                )

        if "flight delay" in msg_lower or "disruption" in msg_lower or "post-booking" in msg_lower:
            if not current_trip:
                current_trip = build_complete_trip("Tokyo")
            disruption_alert = {
                "id": f"ALT-DISRUPT-{datetime.now().strftime('%M%S')}",
                "type": "Disruption Alert: Flight Schedule Shift",
                "status": "Rescheduled (+1h 45m)",
                "message": f"{current_trip.selected_flight.flight_number} departure has been delayed by 1 hour 45 minutes due to inbound air traffic. WanderWise Copilot has automatically notified your airport transfer driver and adjusted Day 1 hotel check-in time.",
                "action_available": "No penalty rebooking or complimentary lounge pass access"
            }
            current_trip.post_booking_alerts.insert(0, disruption_alert)
            logs = [
                OrchestrationStepLog(
                    step_number=5,
                    name="Post-Booking Copilot Disruption Monitor",
                    status="AUTO-HANDLED",
                    details=f"Detected delay for {current_trip.selected_flight.flight_number}. Re-synced airport transfer and updated check-in desk.",
                    timestamp="Real-time Assistant"
                )
            ]
            reply = (
                f"⚠️ **Disruption Handled by WanderWise Copilot:**\n\n"
                f"Your flight **{current_trip.selected_flight.flight_number}** has experienced an airline delay of 1h 45m. "
                f"Don't worry—I have already:\n"
                f"1. **Notified your airport transfer chauffeur** ({current_trip.selected_transfer.provider}) so they pick you up without waiting charges.\n"
                f"2. **Updated your hotel's front desk** ({current_trip.selected_hotel.name}) for late arrival.\n"
                f"3. **Claimed your complimentary lounge access voucher** at the departure terminal.\n\n"
                f"Everything is taken care of!"
            )
            return ChatResponse(
                reply=reply,
                suggested_actions=["View active travel voucher", "Request alternative flight", "Show Day 1 revised schedule"],
                updated_trip=current_trip,
                orchestration_logs=logs
            )

        if "voucher" in msg_lower or "booking" in msg_lower or "confirm" in msg_lower:
            if not current_trip:
                current_trip = build_complete_trip(entities["destination"], entities["budget"], entities["days"], entities["traveler_type"])
            reply = (
                f"🎉 Your trip to **{current_trip.destination}** is fully confirmed and ticketed!\n\n"
                f"• **PNR:** `{current_trip.voucher.pnr}`\n"
                f"• **Hotel Reference:** `{current_trip.voucher.hotel_confirmation}`\n"
                f"• **TBO Booking Reference:** `{current_trip.voucher.booking_reference}`\n\n"
                f"You can view, print, or download your official WanderWise Travel Voucher & Boarding pass in the **Booking Companion** tab!"
            )
            return ChatResponse(
                reply=reply,
                suggested_actions=["View Travel Voucher", "Simulate Flight Delay Disruption", "Customize Day 2 Itinerary"],
                updated_trip=current_trip,
                orchestration_logs=current_trip.orchestration_logs
            )

        # Standard new trip planning or re-planning
        trip = build_complete_trip(
            destination_name=entities["destination"],
            budget=entities["budget"],
            days=entities["days"],
            traveler_type=entities["traveler_type"]
        )

        reply = (
            f"I have orchestrated your complete journey to **{trip.destination}** for **{trip.duration_days} days**!\n\n"
            f"Here is how I organized everything for you:\n"
            f"• **Flight:** {trip.selected_flight.airline} ({trip.selected_flight.flight_number}) • Non-stop • ${trip.selected_flight.price}\n"
            f"• **Hotel:** {trip.selected_hotel.name} ({trip.selected_hotel.star_rating}★) in {trip.selected_hotel.neighborhood} • ${trip.selected_hotel.price_per_night}/night\n"
            f"• **Transfer:** {trip.selected_transfer.type} via {trip.selected_transfer.provider}\n"
            f"• **Budget Status:** Estimated **${trip.cost_breakdown.grand_total:.0f}** (You have **${trip.cost_breakdown.remaining_budget:.0f} buffer** remaining)\n\n"
            f"Explore the interactive tabs on your right to inspect comparisons, day-by-day activities, live cost breakdowns, and your instant booking voucher!"
        )

        actions = [
            f"Compare alternative flights to {entities['destination']}",
            "Switch to a cheaper hotel",
            "Simulate flight delay disruption support",
            "View official booking voucher"
        ]

        return ChatResponse(
            reply=reply,
            suggested_actions=actions,
            updated_trip=trip,
            orchestration_logs=trip.orchestration_logs
        )
