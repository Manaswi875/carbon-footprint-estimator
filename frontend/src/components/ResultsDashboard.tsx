import React from 'react';
import { CalculationResult } from '../services/api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ResultsDashboardProps {
    data: CalculationResult;
    onReset: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ data, onReset }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    const pieData = [
        { name: 'Transport', value: data.results.transport },
        { name: 'Diet', value: data.results.diet },
        { name: 'Electricity', value: data.results.electricity },
    ];

    const comparisonData = [
        { name: 'You', emissions: data.results.total },
        { name: 'National Avg', emissions: data.national_average },
    ];

    const getFootprintLabel = (total: number) => {
        if (total < 6000) return { text: 'Low Footprint 🌱', color: 'text-green-600' };
        if (total < 16000) return { text: 'Medium Footprint 👣', color: 'text-yellow-600' };
        return { text: 'High Footprint ⚠️', color: 'text-red-600' };
    };

    const label = getFootprintLabel(data.results.total);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center transition-colors duration-200">
                <h2 className="text-3xl font-bold mb-2 dark:text-white">Your Annual Carbon Footprint</h2>
                <p className={`text-4xl font-extrabold ${label.color} mb-2`}>{data.results.total} kg CO₂e</p>
                <p className="text-xl font-medium dark:text-gray-300">{label.text}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md h-80 transition-colors duration-200">
                    <h3 className="text-xl font-bold mb-4 text-center dark:text-white">Emissions Breakdown</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md h-80 transition-colors duration-200">
                    <h3 className="text-xl font-bold mb-4 text-center dark:text-white">Comparison</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                            <Legend />
                            <Bar dataKey="emissions" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg border border-indigo-100 dark:border-indigo-800 transition-colors duration-200">
                <h3 className="text-2xl font-bold mb-4 text-indigo-900 dark:text-indigo-300">Personalized Recommendations</h3>
                <ul className="space-y-3">
                    {data.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                            <span className="mr-2 text-indigo-500">•</span>
                            <span className="text-indigo-800 dark:text-indigo-200">{rec}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="text-center">
                <button
                    onClick={onReset}
                    className="bg-gray-600 dark:bg-gray-700 text-white py-2 px-6 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition"
                >
                    Recalculate
                </button>
            </div>
        </div>
    );
};

export default ResultsDashboard;
