import React from 'react';
import { Info, Sun, Moon } from 'lucide-react';

interface SwapHeaderProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
    showDetails: boolean;
    toggleDetails: () => void;
}

export const SwapHeader: React.FC<SwapHeaderProps> = ({
    isDarkMode,
    toggleTheme,
    showDetails,
    toggleDetails
}) => {
    return (
        <div className="flex justify-between items-center mb-2">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Swap</h2>
            <div className="flex gap-2">
                {/* Details Toggle */}
                <button
                    onClick={toggleDetails}
                    className={`p-2 rounded-full transition-colors ${isDarkMode
                        ? 'hover:bg-slate-700 text-slate-300'
                        : 'hover:bg-slate-100 text-slate-600'
                        }`}
                    title={showDetails ? 'Hide details' : 'Show details'}
                >
                    <Info className="w-5 h-5" />
                </button>
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-full transition-colors ${isDarkMode
                        ? 'hover:bg-slate-700 text-yellow-400'
                        : 'hover:bg-slate-100 text-slate-600'
                        }`}
                    title={isDarkMode ? 'Switch to day mode' : 'Switch to night mode'}
                >
                    {isDarkMode ? (
                        <Sun className="w-5 h-5" />
                    ) : (
                        <Moon className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>
    );
};
