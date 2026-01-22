import React from 'react';
import { X } from 'lucide-react';
import { TOKENS } from '../../data/tokens';

interface TokenSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (token: typeof TOKENS[0]) => void;
    tokens: typeof TOKENS;
    selectedToken?: typeof TOKENS[0];
    otherSelectedToken?: typeof TOKENS[0];
    getBalance: (symbol: string) => string;
    isDarkMode: boolean;
}

export const TokenSelectionModal: React.FC<TokenSelectionModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    tokens,
    selectedToken,
    otherSelectedToken,
    getBalance,
    isDarkMode
}) => {
    if (!isOpen) return null;

    return (
        <div className={`absolute inset-0 z-50 backdrop-blur-sm rounded-2xl flex flex-col p-4 animate-in fade-in duration-200 ${isDarkMode ? 'bg-slate-800/95' : 'bg-slate-50/95'
            }`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Select Token</h3>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                >
                    <X className="w-5 h-5 text-slate-500" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col gap-2">
                {tokens.map((token, index) => {
                    const isDisabled = token.currency === otherSelectedToken?.currency;
                    return (
                        <button
                            key={`${token.currency}-${index}`}
                            onClick={() => !isDisabled && onSelect(token)}
                            disabled={isDisabled}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${isDisabled
                                ? 'opacity-50 cursor-not-allowed'
                                : isDarkMode
                                    ? 'hover:bg-slate-700 hover:shadow-sm cursor-pointer'
                                    : 'hover:bg-white hover:shadow-sm cursor-pointer'
                                }`}
                        >
                            <img src={token.icon} alt={token.symbol} className="w-8 h-8 rounded-full" />
                            <div className="flex flex-col items-start">
                                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{token.symbol}</span>
                                <span className="text-slate-500 text-xs">Balance: {getBalance(token.symbol)}</span>
                            </div>
                            {(selectedToken === token) && (
                                <div className="ml-auto w-2 h-2 bg-indigo-600 rounded-full"></div>
                            )}
                            {isDisabled && (
                                <span className="ml-auto text-xs font-medium text-slate-500">Selected</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
