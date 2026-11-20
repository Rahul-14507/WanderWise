from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class FlightOption(BaseModel):
    id: str
    airline: str
    flight_number: str
    origin: str
    destination: str
    departure_time: str
    arrival_time: str
    duration: str
    price: float
    stops: int
    cabin_class: str = "Economy"
    baggage: str = "7kg Cabin + 23kg Check-in"
    on_time_performance: str = "94%"
    badge: Optional[str] = None  # e.g. "Cheapest", "Fastest", "Recommended"

class HotelOption(BaseModel):
    id: str
    name: str
    location: str
    star_rating: int
    review_score: float
    price_per_night: float
    total_price: float
    amenities: List[str]
    neighborhood: str
    cancellation_policy: str
    image_url: str
    badge: Optional[str] = None

class TransferOption(BaseModel):
    id: str
    type: str
    provider: str
    duration: str
    price: float
    comfort_level: str
    badge: Optional[str] = None

class ActivityItem(BaseModel):
    id: str
    time_slot: str  # Morning, Afternoon, Evening
    title: str
    category: str
    duration: str
    estimated_cost: float
    description: str
    location: str
    tip: Optional[str] = None

class DayPlan(BaseModel):
    day: int
    title: str
    theme: str
    weather: str
    temp: str
    activities: List[ActivityItem]
    day_cost: float

class CostBreakdown(BaseModel):
    flights_total: float
    hotels_total: float
    transfers_total: float
    activities_total: float
    food_and_misc: float
    grand_total: float
    budget_limit: float
    remaining_budget: float
    currency: str = "USD"
    saving_tips: List[str] = []

class BookingVoucher(BaseModel):
    voucher_id: str
    booking_reference: str
    pnr: str
    hotel_confirmation: str
    traveler_name: str
    destination: str
    dates: str
    total_paid: float
    currency: str
    status: str = "Confirmed"
    issued_at: str
    flight_details: Dict[str, Any]
    hotel_details: Dict[str, Any]
    support_pin: str

class DisruptionResolution(BaseModel):
    issue: str
    status: str
    suggested_alternative: str
    compensation_eligibility: str
    copilot_action_taken: str

class OrchestrationStepLog(BaseModel):
    step_number: int
    name: str
    status: str
    details: str
    timestamp: str

class TripPlan(BaseModel):
    destination: str
    origin: str
    dates: str
    duration_days: int
    traveler_type: str
    interests: List[str]
    selected_flight: FlightOption
    selected_hotel: HotelOption
    selected_transfer: TransferOption
    flight_options: List[FlightOption]
    hotel_options: List[HotelOption]
    transfer_options: List[TransferOption]
    itinerary: List[DayPlan]
    cost_breakdown: CostBreakdown
    voucher: Optional[BookingVoucher] = None
    orchestration_logs: List[OrchestrationStepLog] = []
    post_booking_alerts: List[Dict[str, Any]] = []

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []
    current_trip: Optional[TripPlan] = None

class ChatResponse(BaseModel):
    reply: str
    suggested_actions: List[str] = []
    updated_trip: Optional[TripPlan] = None
    orchestration_logs: List[OrchestrationStepLog] = []

class BookingRequest(BaseModel):
    trip: TripPlan
    traveler_name: str
    email: str
    phone: str
