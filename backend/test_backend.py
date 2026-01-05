from calculator import EmissionsCalculator

def test_calculator():
    calc = EmissionsCalculator()
    
    inputs = {
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
    
    results = calc.calculate(inputs)
    print("Results:", results)
    
    recommendations = calc.get_recommendations(results)
    print("Recommendations:", recommendations)
    
    # Test Country Logic check (mocking the request processing)
    national_avg_us = calc.dataset["national_averages"].get("USA", 0)
    national_avg_india = calc.dataset["national_averages"].get("India", 0)
    
    print(f"US Avg: {national_avg_us}, India Avg: {national_avg_india}")
    
    assert results["total"] > 0
    assert len(recommendations) > 0
    assert national_avg_us == 16000
    assert national_avg_india == 1900
    print("Test Passed!")

if __name__ == "__main__":
    test_calculator()
