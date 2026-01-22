import React from 'react';
import { ChevronDown } from 'lucide-react';
import { TOKENS } from '../../data/tokens';
import { isValidNumberInput, normalizeInputString, validateBalance } from '../../utils/validation';
import { parseAmount } from '../../utils/formatting';

interface CurrencyInputSectionProps {
    label: string;
    amount: string;
    onAmountChange?: (value: string) => void;
    token: typeof TOKENS[0];
    onSelectToken: () => void;
    balance: string;
    isDarkMode: boolean;
    readOnly?: boolean;
    placeholder?: string;
}

export const CurrencyInputSection: React.FC<CurrencyInputSectionProps> = ({
    label,
    amount,
    onAmountChange,
    token,
    onSelectToken,
    balance,
    isDarkMode,
    readOnly = false,
    placeholder = '0',
}) => {
    const [validationError, setValidationError] = React.useState<string | null>(null);
    const errorTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
        return () => {
            if (errorTimerRef.current) {
                clearTimeout(errorTimerRef.current);
            }
        };
    }, []);

    const triggerError = (msg: string) => {
        setValidationError(msg);
        if (errorTimerRef.current) {
            clearTimeout(errorTimerRef.current);
        }
        errorTimerRef.current = setTimeout(() => {
            setValidationError(null);
        }, 2000);
    };

    const numBalance = parseAmount(balance);
    const numAmount = parseAmount(amount);
    const isInsufficientBalance = !readOnly && !validateBalance(numAmount, numBalance);

    const displayError = validationError || (isInsufficientBalance ? 'Insufficient balance' : null);
    const hasError = !!displayError;

    return (
        <div className={`p-4 rounded-xl shadow-sm border transition-all duration-200 ${hasError
            ? 'bg-red-50 border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200 dark:bg-red-900/20 dark:border-red-500 dark:focus-within:ring-red-900'
            : isDarkMode
                ? 'bg-slate-700 border-slate-600 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-900'
                : 'bg-blue-50/30 border-blue-100/50 focus-within:bg-white focus-within:border-indigo-200 focus-within:ring-4 focus-within:ring-indigo-100/50'
            }`}>
            <div className="flex justify-between items-center mb-4">
                <label className={`text-sm md:text-base font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>{label}</label>

                <button
                    onClick={onSelectToken}
                    className={`flex items-center gap-1 bg-transparent px-3 py-1 rounded-full transition-colors min-w-[80px] h-8 justify-between cursor-pointer ${isDarkMode
                        ? 'hover:bg-slate-600 active:bg-slate-500 text-white'
                        : 'hover:bg-slate-100 active:bg-slate-200 text-slate-900'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <img src={token.icon} alt={token.symbol} className="w-5 h-5" />
                        <span className="font-semibold text-sm">{token.symbol}</span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>
            </div>
            <div className="flex relative flex-row items-center gap-2">
                <input
                    type="text"
                    inputMode="decimal"
                    placeholder={placeholder}
                    readOnly={readOnly}
                    value={amount}
                    onChange={(e) => {
                        if (!onAmountChange) return;

                        if (isValidNumberInput(e.target.value)) {
                            let newValue = e.target.value;

                            newValue = normalizeInputString(newValue);

                            if (newValue.length > 10) {
                                triggerError('Max 10 digits');
                                return;
                            } else {
                                if (validationError) setValidationError(null);
                            }
                            onAmountChange(newValue);
                        }
                    }}
                    className={`flex-1 bg-transparent text-2xl md:text-4xl font-bold outline-none min-w-0 w-full ${isDarkMode
                        ? 'text-white placeholder:text-slate-500'
                        : 'text-slate-900 placeholder:text-slate-200'
                        }`}
                />
            </div>
            <div className={`mt-1 text-sm flex justify-between items-center ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                {displayError && (
                    <span className="text-red-500 font-medium animate-in fade-in slide-in-from-top-1 fill-mode-forwards">{displayError}</span>
                )}
                <div className="flex-1" />
                <span>Balance: {balance}</span>
            </div>
        </div>
    );
};
