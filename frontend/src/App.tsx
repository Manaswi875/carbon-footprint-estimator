import { useState, useEffect } from 'react';
import CalculatorForm from './components/CalculatorForm';
import ResultsDashboard from './components/ResultsDashboard';
import { calculateEmissions, CalculationRequest, CalculationResult } from './services/api';
import { Moon, Sun, History } from 'lucide-react';

function App() {
    const [results, setResults] = useState<CalculationResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Dark Mode State
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    // History State
    const [history, setHistory] = useState<CalculationResult[]>(() => {
        const saved = localStorage.getItem('emissionHistory');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const handleCalculate = async (data: CalculationRequest) => {
        setLoading(true);
        setError(null);
        try {
            const result = await calculateEmissions(data);
            setResults(result);

            // Save to history
            const newHistory = [result, ...history].slice(0, 5); // Keep last 5
            setHistory(newHistory);
            localStorage.setItem('emissionHistory', JSON.stringify(newHistory));

        } catch (err) {
            setError('Failed to calculate emissions. Please ensure the backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setResults(null);
    };

    return (
        <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200 ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-12 relative">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="absolute right-0 top-0 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                    >
                        {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-slate-600" />}
                    </button>

                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                        🌍 Carbon Footprint Estimator
                    </h1>
                    <p className="mt-4 text-xl opacity-75">
                        Calculate your annual impact and find ways to live more sustainably.
                    </p>
                </header>

                <main>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {!results ? (
                        <div className="space-y-10">
                            <CalculatorForm onSubmit={handleCalculate} isLoading={loading} />

                            {history.length > 0 && (
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md transition-colors duration-200">
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
                                        <History className="w-5 h-5" /> Recent Calculations
                                    </h3>
                                    <div className="space-y-3">
                                        {history.map((h, i) => (
                                            <div key={i} className="flex justify-between items-center border-b dark:border-slate-700 pb-2 dark:text-gray-300">
                                                <span>Total: {h.results.total} kg CO₂e</span>
                                                <span className="text-sm opacity-60">{new Date().toLocaleDateString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <ResultsDashboard data={results} onReset={handleReset} />
                    )}
                </main>

                <footer className="mt-16 text-center text-sm opacity-60">
                    <p>Data sources: EPA, UK DEFRA, Our World in Data.</p>
                    <p>© {new Date().getFullYear()} Carbon Footprint Estimator</p>
                </footer>
            </div>
        </div>
    );
}

export default App;
