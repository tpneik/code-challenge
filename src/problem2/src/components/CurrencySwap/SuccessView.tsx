import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessViewProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
    isDarkMode: boolean;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ isOpen, onClose, message, isDarkMode }) => {
    if (!isOpen) return null;

    // Matching CurrencyInputSection styles (slate-700/white, rounded-xl)
    return (
        <div className={`absolute inset-0 z-50 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-8 animate-in fade-in duration-300 border shadow-sm ${isDarkMode
                ? 'bg-slate-700/95 border-slate-600'
                : 'bg-white/90 backdrop-blur-xl border-indigo-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
            }`}>
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 shadow-sm animate-in zoom-in-50 duration-300">
                <CheckCircle className="w-10 h-10 text-green-500 dark:text-green-400" />
            </div>

            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Success!</h2>
            <p className={`mb-8 text-base text-center ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {message || 'Your transaction has been completed successfully.'}
            </p>

            <button
                onClick={onClose}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50"
            >
                Done
            </button>
        </div>
    );
};
