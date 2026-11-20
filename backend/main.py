import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional

from models import TripPlan, ChatRequest, ChatResponse, BookingRequest, BookingVoucher
from agent import WanderWiseAgent
from data_service import build_complete_trip, DESTINATIONS_DATA

app = FastAPI(
    title="WanderWise API - VoyageHack 4.0",
    description="Virtual Travel Agent – Travel Agent Copilot Backend powered by LangGraph agent orchestration",
    version="1.0.0"
)

# Enable CORS for local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = WanderWiseAgent()

@app.get("/api/info")
def read_info():
    return {
        "project": "WanderWise",
        "hackathon": "VoyageHack 4.0 (TBO.com)",
        "team": "INVICTUS",
        "members": ["Rongali Nandika Laxmi Narayani", "Rahul Pujari"],
        "college": "Institute of Aeronautical Engineering",
        "problem_statement": "Virtual Travel Agent – Travel Agent Copilot",
        "status": "Running",
        "endpoints": ["/api/health", "/api/trip/default", "/api/chat", "/api/destinations", "/api/booking/confirm", "/api/disruption/simulate"]
    }

@app.get("/api/health")
def health():
    return {"status": "ok", "agent_engine": "LangGraph + FastAPI"}

@app.get("/api/destinations")
def get_destinations():
    return {
        "destinations": list(DESTINATIONS_DATA.keys()),
        "details": {k: {"country": v["country"], "avg_budget": v["avg_budget"]} for k, v in DESTINATIONS_DATA.items()}
    }

@app.get("/api/trip/default", response_model=TripPlan)
def get_default_trip():
    return build_complete_trip(destination_name="Tokyo", budget=2500, days=4, traveler_type="Couple / Explorers")

@app.post("/api/chat", response_model=ChatResponse)
def handle_chat(req: ChatRequest):
    return agent.process_message(req.message, req.current_trip)

class GenerateTripRequest(BaseModel):
    destination: str
    budget: float = 2500
    days: int = 4
    traveler_type: str = "Couple / Explorers"

@app.post("/api/trip/generate", response_model=TripPlan)
def generate_trip(req: GenerateTripRequest):
    return build_complete_trip(
        destination_name=req.destination,
        budget=req.budget,
        days=req.days,
        traveler_type=req.traveler_type
    )

class SelectOptionRequest(BaseModel):
    trip: TripPlan
    option_id: str
    option_type: str  # "flight" or "hotel" or "transfer"

@app.post("/api/trip/select-option", response_model=TripPlan)
def select_option(req: SelectOptionRequest):
    trip = req.trip
    if req.option_type == "flight":
        match = next((f for f in trip.flight_options if f.id == req.option_id), None)
        if match:
            trip.selected_flight = match
    elif req.option_type == "hotel":
        match = next((h for h in trip.hotel_options if h.id == req.option_id), None)
        if match:
            trip.selected_hotel = match
    elif req.option_type == "transfer":
        match = next((t for t in trip.transfer_options if t.id == req.option_id), None)
        if match:
            trip.selected_transfer = match

    # Recalculate cost
    flights_total = trip.selected_flight.price * 2 if "couple" in trip.traveler_type.lower() else trip.selected_flight.price
    hotels_total = trip.selected_hotel.price_per_night * trip.duration_days
    transfers_total = trip.selected_transfer.price
    activities_total = sum(d.day_cost for d in trip.itinerary)
    food_and_misc = trip.duration_days * 50.0
    grand_total = flights_total + hotels_total + transfers_total + activities_total + food_and_misc

    trip.cost_breakdown.flights_total = round(flights_total, 2)
    trip.cost_breakdown.hotels_total = round(hotels_total, 2)
    trip.cost_breakdown.transfers_total = round(transfers_total, 2)
    trip.cost_breakdown.activities_total = round(activities_total, 2)
    trip.cost_breakdown.grand_total = round(grand_total, 2)
    trip.cost_breakdown.remaining_budget = round(max(0.0, trip.cost_breakdown.budget_limit - grand_total), 2)
    if trip.voucher:
        trip.voucher.total_paid = trip.cost_breakdown.grand_total

    return trip

@app.post("/api/booking/confirm")
def confirm_booking(req: BookingRequest):
    trip = req.trip
    if trip.voucher:
        trip.voucher.traveler_name = req.traveler_name or trip.voucher.traveler_name
        trip.voucher.status = "Confirmed & Fully Paid"
    return {
        "status": "success",
        "message": f"Reservation successfully confirmed for {req.traveler_name}!",
        "voucher": trip.voucher
    }

class DisruptionSimRequest(BaseModel):
    trip: TripPlan
    scenario: str = "delay"  # delay, cancellation, weather

@app.post("/api/disruption/simulate", response_model=TripPlan)
def simulate_disruption(req: DisruptionSimRequest):
    trip = req.trip
    if req.scenario == "delay":
        alert = {
            "id": "ALT-SIM-DELAY",
            "type": "Live Flight Disruption: Delay Alert",
            "status": "Delayed by 2h 10m",
            "message": f"Flight {trip.selected_flight.flight_number} delayed due to runway congestion. WanderWise Copilot automatically rebooked transfer pickup to match revised arrival.",
            "action_available": "Transfer updated • Complimentary airport meal voucher issued"
        }
    elif req.scenario == "weather":
        alert = {
            "id": "ALT-SIM-WEATHER",
            "type": "Weather Disruption: Rain Forecast",
            "status": "Rain Advisory Day 2",
            "message": "Sudden heavy rain forecast for Day 2 afternoon. WanderWise Copilot has swapped outdoor walking for an indoor teamLab & Ginza art gallery tour.",
            "action_available": "Indoor itinerary activated smoothly"
        }
    else:
        alert = {
            "id": "ALT-SIM-CANC",
            "type": "Carrier Notice: Gate Change & Re-routing",
            "status": "Resolved",
            "message": "Terminal re-assigned to Gate 42B. Digital lounge code updated in voucher.",
            "action_available": "Gate updated"
        }
    trip.post_booking_alerts.insert(0, alert)
    return trip

# Mount built frontend if available
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
