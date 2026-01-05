from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from calculator import EmissionsCalculator

app = FastAPI(title="Carbon Footprint Estimator API")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

calculator = EmissionsCalculator()

class TransportInput(BaseModel):
    car_miles: float = 0
    flight_miles: float = 0
    public_transit_miles: float = 0

class ElectricityInput(BaseModel):
    usage_kwh: float = 0

class CalculationRequest(BaseModel):
    transport: TransportInput
    diet: str # omnivore, vegetarian, vegan
    electricity: ElectricityInput
    country: str = "USA"

@app.get("/")
def read_root():
    return {"message": "Welcome to the Carbon Footprint Estimator API"}

@app.get("/emissions-data")
def get_emissions_data():
    """Return the raw emission factors dataset."""
    return calculator.dataset

@app.post("/calculate")
def calculate_emissions(request: CalculationRequest):
    """Calculate emissions based on user input."""
    try:
        inputs = request.dict()
        results = calculator.calculate(inputs)
        recommendations = calculator.get_recommendations(results)
        
        country = request.country
        # Default to Global if country not found
        national_avg = calculator.dataset.get("national_averages", {}).get(country, 4700)

        response = {
            "results": results,
            "recommendations": recommendations,
            "national_average": national_avg
        }
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
