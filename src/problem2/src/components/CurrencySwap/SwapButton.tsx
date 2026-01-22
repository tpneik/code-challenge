import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface SwapButtonProps {
    onClick: () => void;
    rotation: number;
    isDarkMode: boolean;
    disabled?: boolean;
}

export const SwapButton: React.FC<SwapButtonProps> = ({ onClick, rotation, isDarkMode, disabled }) => {
    return (
        <div className="relative h-2 z-10">
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
                <button
                    onClick={onClick}
                    disabled={disabled}
                    className={`group shadow-md p-2 rounded-full hover:scale-110 active:scale-95 transition-all duration-200 w-12 h-12 flex items-center justify-center cursor-pointer disabled:cursor-wait disabled:hover:scale-100 disabled:active:scale-100 ${isDarkMode
                        ? 'bg-slate-700 border border-slate-600'
                        : 'bg-white border border-slate-100'
                        }`}
                >
                    <ArrowUpDown
                        className="w-5 h-5 text-indigo-600 transition-transform duration-300"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    />
                </button>
            </div>
        </div>
    );
};
