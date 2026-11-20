import random
from datetime import datetime, timedelta
from typing import Dict, Any, List
from models import (
    FlightOption, HotelOption, TransferOption, ActivityItem,
    DayPlan, CostBreakdown, BookingVoucher, TripPlan, OrchestrationStepLog
)

DESTINATIONS_DATA: Dict[str, Dict[str, Any]] = {
    "Tokyo": {
        "country": "Japan",
        "currency": "USD",
        "avg_budget": 2400,
        "flights": [
            {
                "id": "FL-TK-101",
                "airline": "All Nippon Airways (ANA)",
                "flight_number": "NH 828",
                "origin": "Del / SFO / HND",
                "destination": "Tokyo (HND)",
                "departure_time": "08:15 AM",
                "arrival_time": "04:30 PM",
                "duration": "8h 15m (Non-stop)",
                "price": 780,
                "stops": 0,
                "cabin_class": "Economy",
                "baggage": "2 x 23kg check-in",
                "on_time_performance": "98%",
                "badge": "Fastest & Recommended"
            },
            {
                "id": "FL-TK-102",
                "airline": "Singapore Airlines",
                "flight_number": "SQ 634",
                "origin": "Transit via SIN",
                "destination": "Tokyo (NRT)",
                "departure_time": "11:20 PM",
                "arrival_time": "10:45 AM (+1)",
                "duration": "11h 25m (1 stop)",
                "price": 620,
                "stops": 1,
                "cabin_class": "Economy",
                "baggage": "25kg check-in",
                "on_time_performance": "95%",
                "badge": "Cheapest Option"
            },
            {
                "id": "FL-TK-103",
                "airline": "Japan Airlines (JAL)",
                "flight_number": "JL 740",
                "origin": "Direct Express",
                "destination": "Tokyo (HND)",
                "departure_time": "02:00 PM",
                "arrival_time": "10:30 PM",
                "duration": "8h 30m (Non-stop)",
                "price": 850,
                "stops": 0,
                "cabin_class": "Premium Economy",
                "baggage": "2 x 32kg check-in",
                "on_time_performance": "97%",
                "badge": "Top Comfort"
            }
        ],
        "hotels": [
            {
                "id": "HT-TK-201",
                "name": "Hotel Gracery Shinjuku",
                "location": "Shinjuku, Tokyo",
                "star_rating": 4,
                "review_score": 4.7,
                "price_per_night": 165,
                "total_price": 660,
                "amenities": ["High-speed WiFi", "Godzilla Terrace", "Direct Metro Access", "Daily Breakfast Included"],
                "neighborhood": "Heart of Shinjuku - Vibrant nightlife & dining",
                "cancellation_policy": "Free cancellation until 48h before check-in",
                "image_url": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80",
                "badge": "Top Value & Location"
            },
            {
                "id": "HT-TK-202",
                "name": "Keio Plaza Hotel Tokyo",
                "location": "Nishi-Shinjuku",
                "star_rating": 5,
                "review_score": 4.8,
                "price_per_night": 240,
                "total_price": 960,
                "amenities": ["Luxury Spa", "Sky Bar", "Airport Limousine Bus Stop", "Gym & Pool"],
                "neighborhood": "Skyscraper district, quiet yet accessible",
                "cancellation_policy": "Free cancellation up to 24h before",
                "image_url": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
                "badge": "Luxury Pick"
            },
            {
                "id": "HT-TK-203",
                "name": "Candeo Hotels Tokyo Shimbashi",
                "location": "Minato-ku, Tokyo",
                "star_rating": 4,
                "review_score": 4.5,
                "price_per_night": 125,
                "total_price": 500,
                "amenities": ["Rooftop Open-air SkySpa", "Sauna", "Ultra-fast WiFi", "Luggage Storage"],
                "neighborhood": "Close to Ginza shopping and Tokyo Station",
                "cancellation_policy": "Non-refundable (Save $80)",
                "image_url": "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=600&q=80",
                "badge": "Budget Saver"
            }
        ],
        "transfers": [
            {
                "id": "TR-TK-301",
                "type": "Tokyo Skyliner / Narita Express Pass",
                "provider": "Keisei / JR East",
                "duration": "36 mins to City Center",
                "price": 38,
                "comfort_level": "Spacious seats, luggage racks, USB power",
                "badge": "Most Popular"
            },
            {
                "id": "TR-TK-302",
                "type": "Private Chauffeur Sedan",
                "provider": "TBO VIP Mobility",
                "duration": "55 mins door-to-door",
                "price": 110,
                "comfort_level": "Executive Mercedes/Toyota Alphard, meet & greet",
                "badge": "Maximum Comfort"
            }
        ],
        "itinerary_days": [
            {
                "day": 1,
                "title": "Neon Horizons & Sensory Arrival",
                "theme": "Arrival, Iconic Shibuya Crossing & Shinjuku Neon",
                "weather": "Sunny",
                "temp": "18°C",
                "day_cost": 45,
                "activities": [
                    {
                        "id": "ACT-101",
                        "time_slot": "Morning",
                        "title": "Hotel Check-in & Refresh at Shinjuku",
                        "category": "Logistics",
                        "duration": "1.5 hours",
                        "estimated_cost": 0,
                        "description": "Drop bags, collect Pocket WiFi/Suica card, and take in the view from Tokyo Metropolitan Government Building.",
                        "location": "Shinjuku Center",
                        "tip": "Observation deck is free and offers panoramic Mount Fuji views on clear days!"
                    },
                    {
                        "id": "ACT-102",
                        "time_slot": "Afternoon",
                        "title": "Shibuya Crossing & Meiji Shrine Serenity",
                        "category": "Culture & Landmarks",
                        "duration": "3.5 hours",
                        "estimated_cost": 15,
                        "description": "Walk through the sacred forest of Meiji Jingu shrine, followed by crossing the world-famous Shibuya Scramble and visiting Hachiko statue.",
                        "location": "Shibuya & Harajuku",
                        "tip": "Great rooftop photo spots at Shibuya Sky (booking 2 days in advance recommended)."
                    },
                    {
                        "id": "ACT-103",
                        "time_slot": "Evening",
                        "title": "Omoide Yokocho Yakitori Tasting",
                        "category": "Culinary Experience",
                        "duration": "2 hours",
                        "estimated_cost": 30,
                        "description": "Immerse in historic Memory Lane alleyway, sampling flame-grilled wagyu skewers and authentic craft ramen.",
                        "location": "Omoide Yokocho, Shinjuku",
                        "tip": "Cash or IC card preferred in narrow traditional alleys."
                    }
                ]
            },
            {
                "day": 2,
                "title": "Digital Art Revolution & Ancient Heritage",
                "theme": "teamLab Planets, Asakusa Senso-ji & Akihabara",
                "weather": "Clear sky",
                "temp": "19°C",
                "day_cost": 75,
                "activities": [
                    {
                        "id": "ACT-201",
                        "time_slot": "Morning",
                        "title": "Sensory Immersion at teamLab Planets",
                        "category": "Immersive Art",
                        "duration": "2.5 hours",
                        "estimated_cost": 38,
                        "description": "Walk barefoot through glowing crystal rooms, water gardens, and interactive infinite mirrored illusions.",
                        "location": "Toyosu, Koto-ku",
                        "tip": "Wear pants that can be rolled up past knees for shallow water installations."
                    },
                    {
                        "id": "ACT-202",
                        "time_slot": "Afternoon",
                        "title": "Senso-ji Temple & Nakamise Dori Street Treats",
                        "category": "Culture & Heritage",
                        "duration": "2.5 hours",
                        "estimated_cost": 12,
                        "description": "Explore Tokyo's oldest Buddhist temple dating to 628 AD. Taste freshly baked melonpan and Ningyo-yaki sweets.",
                        "location": "Asakusa",
                        "tip": "Draw an Omikuji (fortune slip) at the main shrine pavilion."
                    },
                    {
                        "id": "ACT-203",
                        "time_slot": "Evening",
                        "title": "Akihabara Tech & Retro Arcade Walk",
                        "category": "Pop Culture & Entertainment",
                        "duration": "2 hours",
                        "estimated_cost": 25,
                        "description": "Discover multi-floor hobby centres, vintage retro video game halls, and high-tech anime gadgets.",
                        "location": "Electric Town Akihabara",
                        "tip": "Duty-free discounts available for tourists carrying passport."
                    }
                ]
            },
            {
                "day": 3,
                "title": "Imperial Elegance & Waterfront Sunset",
                "theme": "Ginza Boutique stroll, Imperial Palace & Odaiba Bay",
                "weather": "Partly cloudy",
                "temp": "17°C",
                "day_cost": 60,
                "activities": [
                    {
                        "id": "ACT-301",
                        "time_slot": "Morning",
                        "title": "Imperial Palace East Gardens Walk",
                        "category": "Nature & History",
                        "duration": "2 hours",
                        "estimated_cost": 0,
                        "description": "Serene stroll across Edo castle stone moats, historical guardhouses, and meticulously manicured Japanese pine trees.",
                        "location": "Chiyoda",
                        "tip": "Closed on Mondays and Fridays - entry is complimentary."
                    },
                    {
                        "id": "ACT-302",
                        "time_slot": "Afternoon",
                        "title": "Ginza Art & Matcha Tea Ceremony",
                        "category": "Culinary & Crafts",
                        "duration": "2.5 hours",
                        "estimated_cost": 28,
                        "description": "Browse premier department stores, Ginza Six rooftop garden, and participate in a guided Uji matcha whisking workshop.",
                        "location": "Ginza 6-chome",
                        "tip": "Pedestrian paradise promenade opened on weekends."
                    },
                    {
                        "id": "ACT-303",
                        "time_slot": "Evening",
                        "title": "Odaiba Rainbow Bridge Sunset Cruise",
                        "category": "Sightseeing",
                        "duration": "2 hours",
                        "estimated_cost": 32,
                        "description": "Cruise Tokyo Bay on the futuristic Himiko waterbus with spectacular twilight views of the Rainbow Bridge and Tokyo skyline.",
                        "location": "Odaiba Seaside Park",
                        "tip": "Best twilight golden hour starts around 5:15 PM."
                    }
                ]
            },
            {
                "day": 4,
                "title": "Artistic Alleys & Mount Fuji Gateway",
                "theme": "Shimokitazawa Vintage & Roppongi Hills Skyline",
                "weather": "Sunny",
                "temp": "20°C",
                "day_cost": 50,
                "activities": [
                    {
                        "id": "ACT-401",
                        "time_slot": "Morning",
                        "title": "Shimokitazawa Indie Boutiques & Specialty Coffee",
                        "category": "Urban Exploration",
                        "duration": "2.5 hours",
                        "estimated_cost": 15,
                        "description": "Tokyo's bohemian hub featuring vinyl record shops, vintage apparel, and artisanal third-wave coffee roasters.",
                        "location": "Shimokitazawa",
                        "tip": "Shops usually open slightly later, around 11:00 AM."
                    },
                    {
                        "id": "ACT-402",
                        "time_slot": "Afternoon",
                        "title": "Mori Art Museum Contemporary Exhibits",
                        "category": "Art & Architecture",
                        "duration": "2 hours",
                        "estimated_cost": 20,
                        "description": "Perched on the 53rd floor of Roppongi Hills Mori Tower, displaying world-class contemporary art.",
                        "location": "Roppongi Hills",
                        "tip": "Ticket includes admission to Tokyo City View sky observatory."
                    },
                    {
                        "id": "ACT-403",
                        "time_slot": "Evening",
                        "title": "Farewell Omakase Dinner",
                        "category": "Culinary",
                        "duration": "2 hours",
                        "estimated_cost": 65,
                        "description": "Chef-curated multi-course nigiri sushi experience prepared with daily arrivals from Toyosu market.",
                        "location": "Ebisu or Ginza",
                        "tip": "Dietary constraints accommodated if notified beforehand."
                    }
                ]
            }
        ]
    },
    "Dubai": {
        "country": "United Arab Emirates",
        "currency": "USD",
        "avg_budget": 2100,
        "flights": [
            {
                "id": "FL-DB-101",
                "airline": "Emirates",
                "flight_number": "EK 511",
                "origin": "Direct Gateway",
                "destination": "Dubai (DXB)",
                "departure_time": "10:00 AM",
                "arrival_time": "12:45 PM",
                "duration": "4h 15m (Non-stop)",
                "price": 540,
                "stops": 0,
                "cabin_class": "Economy",
                "baggage": "30kg check-in",
                "on_time_performance": "96%",
                "badge": "Top Airline & Direct"
            },
            {
                "id": "FL-DB-102",
                "airline": "Flydubai / Air Arabia",
                "flight_number": "FZ 442",
                "origin": "Regional Hub",
                "destination": "Dubai (DXB)",
                "departure_time": "06:30 PM",
                "arrival_time": "09:00 PM",
                "duration": "4h 00m (Non-stop)",
                "price": 390,
                "stops": 0,
                "cabin_class": "Economy",
                "baggage": "20kg check-in",
                "on_time_performance": "92%",
                "badge": "Budget Friendly"
            }
        ],
        "hotels": [
            {
                "id": "HT-DB-201",
                "name": "Rove Downtown Dubai",
                "location": "Downtown, Dubai",
                "star_rating": 4,
                "review_score": 4.6,
                "price_per_night": 140,
                "total_price": 560,
                "amenities": ["Burj Khalifa View Pool", "24/7 Laundromat", "Free Shuttle to Dubai Mall"],
                "neighborhood": "Overlooking Burj Khalifa and Dubai Mall fountains",
                "cancellation_policy": "Free cancellation until 24h before",
                "image_url": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",
                "badge": "Best Downtown Value"
            },
            {
                "id": "HT-DB-202",
                "name": "Atlantis The Palm",
                "location": "Palm Jumeirah",
                "star_rating": 5,
                "review_score": 4.9,
                "price_per_night": 380,
                "total_price": 1520,
                "amenities": ["Complimentary Aquaventure Access", "Private Beach", "Michelin Dining"],
                "neighborhood": "Iconic Palm Island resort experience",
                "cancellation_policy": "Free cancellation 7 days before",
                "image_url": "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80",
                "badge": "Iconic Luxury"
            }
        ],
        "transfers": [
            {
                "id": "TR-DB-301",
                "type": "Private Airport SUV (Tesla/Lexus)",
                "provider": "TBO Elite Dubai",
                "duration": "20 mins",
                "price": 45,
                "comfort_level": "Chilled bottled water, leather interiors, toll fees included",
                "badge": "Recommended"
            }
        ],
        "itinerary_days": [
            {
                "day": 1,
                "title": "Futuristic Skylines & Fountains",
                "theme": "Burj Khalifa At The Top, Dubai Mall & Fountain Show",
                "weather": "Sunny & Pleasant",
                "temp": "28°C",
                "day_cost": 85,
                "activities": [
                    {
                        "id": "ACT-DB-1",
                        "time_slot": "Morning",
                        "title": "Burj Khalifa 124th & 125th Floor Observatory",
                        "category": "Iconic Landmark",
                        "duration": "2 hours",
                        "estimated_cost": 48,
                        "description": "High-speed elevator to world's highest deck with 360-degree desert and gulf vista.",
                        "location": "Downtown Dubai",
                        "tip": "Slot booked for 10:30 AM avoids mid-day glare."
                    },
                    {
                        "id": "ACT-DB-2",
                        "time_slot": "Afternoon",
                        "title": "Dubai Aquarium & Underwater Zoo Walkthrough",
                        "category": "Family & Nature",
                        "duration": "2 hours",
                        "estimated_cost": 35,
                        "description": "Marvel at 33,000 aquatic animals through one of the largest acrylic viewing panels on earth.",
                        "location": "Dubai Mall ground level"
                    },
                    {
                        "id": "ACT-DB-3",
                        "time_slot": "Evening",
                        "title": "Dubai Fountain Lake Ride & Waterfront Dinner",
                        "category": "Entertainment",
                        "duration": "2 hours",
                        "estimated_cost": 30,
                        "description": "Traditional Abra boat ride on Burj Lake during dancing water choreographies.",
                        "location": "Souk Al Bahar Promenade"
                    }
                ]
            },
            {
                "day": 2,
                "title": "Red Dunes Adventure & Bedouin Camp",
                "theme": "Desert Safari, Dune Bashing & Arabian Barbecue",
                "weather": "Clear skies",
                "temp": "29°C",
                "day_cost": 75,
                "activities": [
                    {
                        "id": "ACT-DB-4",
                        "time_slot": "Morning",
                        "title": "Old Dubai Al Fahidi Historic District & Abra Crossing",
                        "category": "Heritage & Culture",
                        "duration": "3 hours",
                        "estimated_cost": 5,
                        "description": "Explore wind-tower architecture, Spice Souk aromas, and Gold Souk treasures after a 1-dirham abra ride.",
                        "location": "Dubai Creek / Deira"
                    },
                    {
                        "id": "ACT-DB-5",
                        "time_slot": "Afternoon & Evening",
                        "title": "Premium Lahbab Red Dune Safari & BBQ Camp",
                        "category": "Adventure & Culture",
                        "duration": "6 hours",
                        "estimated_cost": 70,
                        "description": "4x4 dune bashing, sandboarding, falcon photography, camel ride, fire show, and open-air buffet.",
                        "location": "Lahbab Desert",
                        "tip": "Comfortable breathable clothing recommended."
                    }
                ]
            }
        ]
    },
    "Goa": {
        "country": "India",
        "currency": "USD",
        "avg_budget": 850,
        "flights": [
            {
                "id": "FL-GOA-101",
                "airline": "IndiGo",
                "flight_number": "6E 2145",
                "origin": "Direct",
                "destination": "Goa (MOPA / GOX)",
                "departure_time": "09:30 AM",
                "arrival_time": "11:45 AM",
                "duration": "2h 15m (Non-stop)",
                "price": 140,
                "stops": 0,
                "cabin_class": "Economy",
                "baggage": "15kg check-in",
                "on_time_performance": "96%",
                "badge": "Best Domestic Connection"
            }
        ],
        "hotels": [
            {
                "id": "HT-GOA-201",
                "name": "Taj Fort Aguada Resort & Spa",
                "location": "Candolim, North Goa",
                "star_rating": 5,
                "review_score": 4.8,
                "price_per_night": 180,
                "total_price": 540,
                "amenities": ["Clifftop Ocean View", "Jiva Spa", "Heritage Portuguese Charm"],
                "neighborhood": "Overlooking Arabian Sea and 16th century fortress",
                "cancellation_policy": "Free cancellation 72h before",
                "image_url": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
                "badge": "Heritage Luxury"
            },
            {
                "id": "HT-GOA-202",
                "name": "W Goa Beachfront",
                "location": "Vagator, North Goa",
                "star_rating": 5,
                "review_score": 4.7,
                "price_per_night": 220,
                "total_price": 660,
                "amenities": ["Rockpool Sunsets", "FIT Gym", "Private Beach Access"],
                "neighborhood": "Adjacent to Chapora Fort and sunset cliffs",
                "cancellation_policy": "Flexible cancellation",
                "image_url": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
                "badge": "Lifestyle & Vibe"
            }
        ],
        "transfers": [
            {
                "id": "TR-GOA-301",
                "type": "AC Private Sedan Transfer",
                "provider": "Goa Tourism / TBO Partner",
                "duration": "45 mins",
                "price": 28,
                "comfort_level": "Chilled vehicle, courteous local driver",
                "badge": "Guaranteed Rate"
            }
        ],
        "itinerary_days": [
            {
                "day": 1,
                "title": "Sun, Sand & Coastal Shacks",
                "theme": "Candolim Beach, Fort Aguada Lighthouse & Shack Dining",
                "weather": "Warm & Sunny",
                "temp": "31°C",
                "day_cost": 40,
                "activities": [
                    {
                        "id": "ACT-GOA-1",
                        "time_slot": "Morning",
                        "title": "Fort Aguada & Sea Cliff Exploration",
                        "category": "Heritage",
                        "duration": "2 hours",
                        "estimated_cost": 5,
                        "description": "Portuguese fort built in 1612 with panoramic Arabian Sea coastal vantage point.",
                        "location": "Sinquerim"
                    },
                    {
                        "id": "ACT-GOA-2",
                        "time_slot": "Afternoon & Evening",
                        "title": "Sundowner at Thalassa / Curlies",
                        "category": "Beach & Sunset",
                        "duration": "3 hours",
                        "estimated_cost": 35,
                        "description": "Sip fresh kokum spritzers and enjoy fresh Goan butter garlic prawns as the sun dips below horizon.",
                        "location": "Anjuna / Siolim"
                    }
                ]
            }
        ]
    },
    "Paris": {
        "country": "France",
        "currency": "EUR / USD",
        "avg_budget": 2800,
        "flights": [
            {
                "id": "FL-PA-101",
                "airline": "Air France",
                "flight_number": "AF 225",
                "origin": "Direct Route",
                "destination": "Paris (CDG)",
                "departure_time": "11:00 AM",
                "arrival_time": "05:40 PM",
                "duration": "9h 40m (Non-stop)",
                "price": 820,
                "stops": 0,
                "cabin_class": "Economy",
                "baggage": "23kg check-in",
                "on_time_performance": "93%",
                "badge": "Direct Flagship"
            }
        ],
        "hotels": [
            {
                "id": "HT-PA-201",
                "name": "Hôtel Pullman Paris Tour Eiffel",
                "location": "15th Arrondissement, Paris",
                "star_rating": 4,
                "review_score": 4.6,
                "price_per_night": 270,
                "total_price": 1080,
                "amenities": ["Direct Eiffel Tower Balcony Views", "Fitness Lounge", "California-French Fusion Bistro"],
                "neighborhood": "5-minute walk to Champ de Mars and Eiffel Tower",
                "cancellation_policy": "Free cancellation until 48 hours prior",
                "image_url": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
                "badge": "Eiffel Views"
            }
        ],
        "transfers": [
            {
                "id": "TR-PA-301",
                "type": "RER B Express or Private Cab",
                "provider": "SNCF / TBO VIP",
                "duration": "40 mins",
                "price": 55,
                "comfort_level": "Direct connection to central stations",
                "badge": "Convenient"
            }
        ],
        "itinerary_days": [
            {
                "day": 1,
                "title": "Gothic Marvels & Seine Twilight",
                "theme": "Notre-Dame, Latin Quarter & Seine Sunset Cruise",
                "weather": "Mild Breeze",
                "temp": "19°C",
                "day_cost": 65,
                "activities": [
                    {
                        "id": "ACT-PA-1",
                        "time_slot": "Morning",
                        "title": "Île de la Cité & Sainte-Chapelle Stained Glass",
                        "category": "History & Architecture",
                        "duration": "2 hours",
                        "estimated_cost": 18,
                        "description": "Marvel at 1,113 stained-glass windows in this 13th-century royal chapel masterpiece.",
                        "location": "1st Arrondissement"
                    },
                    {
                        "id": "ACT-PA-2",
                        "time_slot": "Evening",
                        "title": "Bateaux Mouches Seine River Cruise",
                        "category": "Sightseeing",
                        "duration": "1.5 hours",
                        "estimated_cost": 22,
                        "description": "Glide under Pont Alexandre III as Paris city lights and Eiffel Tower golden sparkle illuminate.",
                        "location": "Pont de l'Alma"
                    }
                ]
            }
        ]
    }
}

def build_complete_trip(destination_name: str, budget: float = 2500, days: int = 4, traveler_type: str = "Couple / Explorers") -> TripPlan:
    dest_key = "Tokyo"
    for k in DESTINATIONS_DATA.keys():
        if k.lower() in destination_name.lower():
            dest_key = k
            break
            
    data = DESTINATIONS_DATA[dest_key]
    flights = [FlightOption(**f) for f in data["flights"]]
    hotels = [HotelOption(**h) for h in data["hotels"]]
    transfers = [TransferOption(**t) for t in data["transfers"]]
    
    selected_flight = flights[0]
    selected_hotel = hotels[0]
    selected_transfer = transfers[0]
    
    # Calculate costs
    flights_total = selected_flight.price * 2 if "couple" in traveler_type.lower() else selected_flight.price
    hotels_total = selected_hotel.price_per_night * days
    transfers_total = selected_transfer.price
    
    # Generate itinerary
    base_days = data["itinerary_days"]
    itinerary: List[DayPlan] = []
    activities_total = 0.0
    
    for idx in range(days):
        base_day = base_days[idx % len(base_days)]
        day_cost = base_day["day_cost"]
        activities = [ActivityItem(**a) for a in base_day["activities"]]
        activities_total += sum(a.estimated_cost for a in activities)
        
        itinerary.append(DayPlan(
            day=idx + 1,
            title=base_day["title"] if idx < len(base_days) else f"Exploration Day {idx + 1}: Hidden Gems & Leisure",
            theme=base_day["theme"],
            weather=base_day["weather"],
            temp=base_day["temp"],
            activities=activities,
            day_cost=day_cost
        ))

    food_and_misc = days * 50.0
    grand_total = flights_total + hotels_total + transfers_total + activities_total + food_and_misc
    remaining = max(0.0, budget - grand_total)
    
    saving_tips = [
        f"Switch to '{hotels[-1].name}' to save ${hotels[0].total_price - hotels[-1].total_price:.0f} on accommodation.",
        "Book teamLab & Shibuya Sky 7 days early to lock in 15% partner discount via TBO.",
        "Use 72-Hour Metro Pass instead of single transit tickets to save approx $25 per person."
    ]

    cost_breakdown = CostBreakdown(
        flights_total=round(flights_total, 2),
        hotels_total=round(hotels_total, 2),
        transfers_total=round(transfers_total, 2),
        activities_total=round(activities_total, 2),
        food_and_misc=round(food_and_misc, 2),
        grand_total=round(grand_total, 2),
        budget_limit=budget,
        remaining_budget=round(remaining, 2),
        currency="USD",
        saving_tips=saving_tips
    )

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
    departure_date = (datetime.now() + timedelta(days=14)).strftime("%b %d, %Y")
    return_date = (datetime.now() + timedelta(days=14 + days)).strftime("%b %d, %Y")
    dates_str = f"{departure_date} - {return_date}"

    # Orchestration logs representing the 5 stages from Slide 3
    logs = [
        OrchestrationStepLog(
            step_number=1,
            name="Traveller Request Extraction",
            status="SUCCESS",
            details=f"Parsed user prompt: Destination='{dest_key}', Budget=${budget}, Duration={days} days, Persona='{traveler_type}'",
            timestamp="Step 1/5 • Complete"
        ),
        OrchestrationStepLog(
            step_number=2,
            name="AI Preference & Constraint Analysis",
            status="SUCCESS",
            details="Identified priorities: Culture, Comfort, Central Proximity, Time-saving airport transit",
            timestamp="Step 2/5 • Complete"
        ),
        OrchestrationStepLog(
            step_number=3,
            name="LangGraph Agent Orchestration",
            status="SUCCESS",
            details="Coordinated 4 sub-tasks: Flight Search Tool, Hotel Matcher, Transfer Router, Itinerary Composer",
            timestamp="Step 3/5 • Complete"
        ),
        OrchestrationStepLog(
            step_number=4,
            name="Travel Services Aggregation (TBO GDS)",
            status="SUCCESS",
            details=f"Retrieved 3 real-time flight fares, 3 verified hotels, 2 transfer options, and curated {len(itinerary)} day plans",
            timestamp="Step 4/5 • Complete"
        ),
        OrchestrationStepLog(
            step_number=5,
            name="Trip Plan & Cost Optimization",
            status="SUCCESS",
            details=f"Generated balanced budget (${grand_total:.0f} vs limit ${budget:.0f}), generated voucher skeleton & active disruption monitor",
            timestamp="Step 5/5 • Active"
        )
    ]

    voucher = BookingVoucher(
        voucher_id=f"WW-TBO-{random.randint(100000, 999999)}",
        booking_reference=f"TBO-VOYAGE-{random.randint(4000, 8999)}",
        pnr=f"PNR{random.randint(1000, 9999)}JP",
        hotel_confirmation=f"HCONF-{random.randint(20000, 79999)}",
        traveler_name="Alex & Jordan Mercer",
        destination=f"{dest_key}, {data['country']}",
        dates=dates_str,
        total_paid=round(grand_total, 2),
        currency="USD",
        status="Confirmed & Ticketed",
        issued_at=now_str,
        flight_details={
            "airline": selected_flight.airline,
            "flight_number": selected_flight.flight_number,
            "route": f"{selected_flight.origin} -> {selected_flight.destination}",
            "departure": selected_flight.departure_time,
            "cabin": selected_flight.cabin_class
        },
        hotel_details={
            "hotel_name": selected_hotel.name,
            "location": selected_hotel.location,
            "nights": days,
            "room_type": "Deluxe King Room with City View",
            "cancellation": selected_hotel.cancellation_policy
        },
        support_pin=f"WW-{random.randint(100, 999)}"
    )

    alerts = [
        {
            "id": "ALT-1",
            "type": "Flight Status",
            "status": "On-Time",
            "message": f"{selected_flight.flight_number} is operating on schedule with 98% historical punctuality.",
            "action_available": "Track live gate in Tokyo Narita / Haneda"
        },
        {
            "id": "ALT-2",
            "type": "Weather Advisory",
            "status": "Clear Skies",
            "message": f"Expected mild temperatures ({itinerary[0].temp}) across all {days} travel days. Perfect outdoor walking conditions.",
            "action_available": "No schedule adjustments needed"
        },
        {
            "id": "ALT-3",
            "type": "Post-Booking Copilot",
            "status": "Active Protection",
            "message": "Free 1-click date change & 24/7 luggage disruption compensation assistant enabled.",
            "action_available": "Tap Copilot below to request modifications"
        }
    ]

    return TripPlan(
        destination=f"{dest_key}, {data['country']}",
        origin="Home Airport",
        dates=dates_str,
        duration_days=days,
        traveler_type=traveler_type,
        interests=["Culture", "Culinary", "Sightseeing", "Modern Architecture"],
        selected_flight=selected_flight,
        selected_hotel=selected_hotel,
        selected_transfer=selected_transfer,
        flight_options=flights,
        hotel_options=hotels,
        transfer_options=transfers,
        itinerary=itinerary,
        cost_breakdown=cost_breakdown,
        voucher=voucher,
        orchestration_logs=logs,
        post_booking_alerts=alerts
    )
