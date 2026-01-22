import React from 'react';

interface SwapDetailsProps {
    showDetails: boolean;
    isDarkMode: boolean;
    rate: string;
    totalUsdValue: string;
    outputAmount: string;
    fromSymbol: string;
    toSymbol: string;
}

export const SwapDetails: React.FC<SwapDetailsProps> = ({
    showDetails,
    isDarkMode,
    rate,
    totalUsdValue,
    fromSymbol,
    toSymbol
}) => {
    return (
        <div
            className={`px-2 flex flex-col gap-2 rounded-lg overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top ${showDetails
                ? 'max-h-40 opacity-100 py-3 scale-100 mb-0 mt-4'
                : 'max-h-0 opacity-0 py-0 scale-95 -mb-2 mt-0'
                }`}
        >
            <div className={`transition-opacity duration-300 delay-100 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex justify-between text-sm items-center">
                    <span className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Rate</span>
                    <div className={`flex items-center gap-1 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        <span>1 {fromSymbol}</span>
                        <span>=</span>
                        <span>{rate} {toSymbol}</span>
                    </div>
                </div>
                <div className="flex justify-between text-sm items-center mt-2">
                    <span className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>USD Value</span>
                    <span className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>~${totalUsdValue}</span>
                </div>
                {/* <div className="flex justify-between text-sm items-center mt-2">
                    <span className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Expected Output</span>
                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{outputAmount} {toSymbol}</span>
                </div> */}
            </div>
        </div>
    );
};
