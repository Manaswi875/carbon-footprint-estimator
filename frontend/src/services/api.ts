import axios from 'axios';

const API_URL = 'http://localhost:8000';

export interface TransportInput {
    car_miles: number;
    flight_miles: number;
    public_transit_miles: number;
}

export interface ElectricityInput {
    usage_kwh: number;
}

export interface CalculationRequest {
    transport: TransportInput;
    diet: string;
    electricity: ElectricityInput;
}

export interface CalculationResult {
    results: {
        transport: number;
        diet: number;
        electricity: number;
        total: number;
        breakdown: {
            transport: {
                car: number;
                flight: number;
                public_transit: number;
            };
            diet: number;
            electricity: number;
        };
    };
    recommendations: string[];
    national_average: number;
}

export const calculateEmissions = async (data: CalculationRequest): Promise<CalculationResult> => {
    const response = await axios.post<CalculationResult>(`${API_URL}/calculate`, data);
    return response.data;
};
