import React, { useState } from 'react';
import { CalculationRequest } from '../services/api';

interface CalculatorFormProps {
    onSubmit: (data: CalculationRequest) => void;
    isLoading: boolean;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ onSubmit, isLoading }) => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<CalculationRequest>({
        transport: {
            car_miles: 0,
            flight_miles: 0,
            public_transit_miles: 0,
        },
        diet: 'omnivore',
        electricity: {
            usage_kwh: 0,
        },
        country: 'USA'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, section: keyof CalculationRequest | null, field?: string) => {
        const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;

        if (section && field) {
            setFormData((prev: CalculationRequest) => ({
                ...prev,
                [section]: {
                    ...prev[section] as any,
                    [field]: value,
                },
            }));
        } else if (section) {
            setFormData((prev: CalculationRequest) => ({
                ...prev,
                [section]: value,
            }));
        }
    };

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md max-w-lg mx-auto transition-colors duration-200">
            <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">
                {step === 0 && '🌎 Your Location'}
                {step === 1 && '🚗 Transport'}
                {step === 2 && '🍽️ Diet'}
                {step === 3 && '⚡ Electricity'}
            </h2>

            <form onSubmit={handleSubmit}>
                {step === 0 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Select Country</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                value={formData.country}
                                onChange={(e) => handleChange(e, 'country')}
                            >
                                <option value="USA">USA</option>
                                <option value="UK">UK</option>
                                <option value="Germany">Germany</option>
                                <option value="India">India</option>
                                <option value="China">China</option>
                                <option value="Global">Global Average</option>
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={nextStep}
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Car Miles (per year)</label>
                            <input
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                value={formData.transport.car_miles}
                                onChange={(e) => handleChange(e, 'transport', 'car_miles')}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Flight Miles (per year)</label>
                            <input
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                value={formData.transport.flight_miles}
                                onChange={(e) => handleChange(e, 'transport', 'flight_miles')}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Public Transit Miles (per year)</label>
                            <input
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                value={formData.transport.public_transit_miles}
                                onChange={(e) => handleChange(e, 'transport', 'public_transit_miles')}
                            />
                        </div>
                        <div className="flex justify-between space-x-2">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="w-1/2 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={nextStep}
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Diet Type</label>
                            <select
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                value={formData.diet}
                                onChange={(e) => handleChange(e, 'diet')}
                            >
                                <option value="omnivore">Omnivore</option>
                                <option value="vegetarian">Vegetarian</option>
                                <option value="vegan">Vegan</option>
                            </select>
                        </div>
                        <div className="flex justify-between space-x-2">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="w-1/2 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={nextStep}
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Electricity Usage (kWh per year)</label>
                            <input
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                value={formData.electricity.usage_kwh}
                                onChange={(e) => handleChange(e, 'electricity', 'usage_kwh')}
                            />
                        </div>
                        <div className="flex justify-between space-x-2">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="w-1/2 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-1/2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition disabled:opacity-50"
                            >
                                {isLoading ? 'Calculating...' : 'Calculate Footprint'}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CalculatorForm;
