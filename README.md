# Carbon Footprint Estimator

A production-ready full-stack web application that estimates your annual CO₂ emissions based on lifestyle choices (transport, diet, electricity) and provides actionable personalized recommendations.

## Comparison & Features
- **Dynamic Emission Calculation**: Uses a retrieved dataset of emission factors.
- **Interactive Dashboard**: Visualizes data with Recharts (Bar & Pie Charts).
- **Personalized Recommendations**: Rule-based AI engine suggests ways to reduce footprint.
- **Clean Architecture**: Separation of concerns with FastAPI backend and React frontend.
- **Bonus Features**: 
    -  Dark Mode Support
    -  Country-specific baselines (USA, UK, Germany, India, China)
    - Local Storage History of recent calculations

## Tech Stack
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Recharts, Axios.
- **Backend**: Python, FastAPI, Pydantic.
- **Data**: JSON-based retrieval system sourced from EPA, UK DEFRA, and Our World in Data.

## How to Run Locally

### Prerequisites
- Python 3.9+
- Node.js 18+ (Required for Frontend)

### 1. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
python3 -m pip install -r requirements.txt
```

Run the backend server:
```bash
uvicorn main:app --reload
```
The API will be available at `http://localhost:8000`.
API Docs: `http://localhost:8000/docs`

### 2. Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies and start the dev server:
```bash
# If you don't have node_modules installed yet
npm install

# Start the development server
npm run dev
```
Open your browser to `http://localhost:5173` (or the port shown in terminal).

## Data Sources & Citations
- **Car Emissions**: EPA Green Vehicle Guide (0.404 kg CO₂/mile)
- **Flight Emissions**: UK DEFRA 2023 (0.254 kg CO₂/mile)
- **Dietary Footprints**: Scarborough et al. (2014) - High meat vs Veg vs Vegan.
- **Electricity**: US EIA 2022 Average (0.386 kg CO₂/kWh)

## Future Improvements
- [ ] Add user authentication (Auth0/Firebase).
- [ ] Implement historical data tracking (DB integration).
- [ ] Add more granular questions (e.g., "Do you recycle?", "Home heating type").
- [ ] Dark Mode toggle (already supported by CSS architecture, needs UI toggle).

