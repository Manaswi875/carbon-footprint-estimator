import json
import os
from typing import Dict, Any

class EmissionsCalculator:
    def __init__(self, dataset_path: str = "emissions_dataset.json"):
        self.dataset = self._load_dataset(dataset_path)

    def _load_dataset(self, path: str) -> Dict[str, Any]:
        try:
            with open(path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # Fallback for dev environment or running from different dir
            base_dir = os.path.dirname(os.path.abspath(__file__))
            full_path = os.path.join(base_dir, path)
            with open(full_path, 'r') as f:
                return json.load(f)

    def calculate(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate emissions based on inputs.
        inputs example:
        {
            "transport": {
                "car_miles": 5000,
                "flight_miles": 2000,
                "public_transit_miles": 500
            },
            "diet": "vegetarian",
            "electricity": {
                "usage_kwh": 4000
            }
        }
        """
        
        results = {
            "transport": 0.0,
            "diet": 0.0,
            "electricity": 0.0,
            "total": 0.0,
            "breakdown": {}
        }
        
        # Transport
        if "transport" in inputs:
            t_data = self.dataset["transport"]
            t_inputs = inputs["transport"]
            
            car_emissions = t_inputs.get("car_miles", 0) * t_data["car"]["co2_per_mile"]
            flight_emissions = t_inputs.get("flight_miles", 0) * t_data["flight"]["co2_per_mile"]
            transit_emissions = t_inputs.get("public_transit_miles", 0) * t_data["public_transit"]["co2_per_mile"]
            
            results["transport"] = round(car_emissions + flight_emissions + transit_emissions, 2)
            results["breakdown"]["transport"] = {
                "car": round(car_emissions, 2),
                "flight": round(flight_emissions, 2),
                "public_transit": round(transit_emissions, 2)
            }

        # Diet
        if "diet" in inputs:
            diet_type = inputs["diet"].lower()
            if diet_type in self.dataset["diet"]:
                results["diet"] = self.dataset["diet"][diet_type]["co2_per_year"]
                results["breakdown"]["diet"] = results["diet"]
            else:
                 # Default to omnivore if unknown
                results["diet"] = self.dataset["diet"]["omnivore"]["co2_per_year"]

        # Electricity
        if "electricity" in inputs:
            elec_data = self.dataset["electricity"]["default"]
            kwh = inputs["electricity"].get("usage_kwh", 0)
            results["electricity"] = round(kwh * elec_data["co2_per_kwh"], 2)
            results["breakdown"]["electricity"] = results["electricity"]

        # Total
        results["total"] = round(results["transport"] + results["diet"] + results["electricity"], 2)
        
        return results

    def get_recommendations(self, results: Dict[str, Any]) -> list[str]:
        recommendations = []
        breakdown = results.get("breakdown", {})
        
        # Simple rule-based recommendations
        # Check transport total directly from results
        if results.get("transport", 0) > 4000:
            recommendations.append("🚗 Transport: Consider carpooling or switching to an EV to reduce driving emissions.")
            recommendations.append("✈️ Transport: Try to replace one long-haul flight with a local vacation or train trip.")
            
        # Diet is directly in results or breakdown (it is a float in both based on current logic, but safer to use results['diet'])
        if results.get("diet", 0) > 2000:
             recommendations.append("🍽️ Diet: Reducing meat consumption, even by one day a week (Meatless Mondays), can significantly lower your footprint.")
             
        # Electricity
        if results.get("electricity", 0) > 3000:
            recommendations.append("⚡ Energy: Switch to LED bulbs and unplug electronics when not in use.")
            recommendations.append("☀️ Energy: Determine if your utility provider offers a Green Energy option.")

        if not recommendations:
             recommendations.append("🌟 Great job! Your carbon footprint is relatively low. Keep maintaining your sustainable habits.")
             
        return recommendations
