import { useState, useEffect } from 'react';
import { TOKENS } from '../data/tokens';
import { MOCK_BALANCES } from '../data/balances';
import { parseAmount, formatTokenAmount, formatCurrencyRate, formatUsdValue } from '../utils/formatting';
import { validateBalance } from '../utils/validation';

export const useSwap = (isLoading: boolean) => {
    const [fromToken, setFromToken] = useState(TOKENS[0]);
    const [toToken, setToToken] = useState(TOKENS[1]);
    const [amount, setAmount] = useState<string>('');
    const [selectingSide, setSelectingSide] = useState<'from' | 'to' | null>(null);
    const [rotation, setRotation] = useState(0);
    const [isSwapping, setIsSwapping] = useState(false);

    useEffect(() => {
        if (!isLoading && TOKENS.length > 0) {
            setFromToken(TOKENS[0]);
            setToToken(TOKENS.find(t => t.currency === 'USDC') || TOKENS[1]);
        }
    }, [isLoading]);

    const handleTokenSelect = (token: typeof TOKENS[0]) => {
        if (selectingSide === 'from') {
            setFromToken(token);
        } else {
            setToToken(token);
        }
        setSelectingSide(null);
    };

    const handleSwapTokens = () => {
        if (isSwapping) return;

        setIsSwapping(true);
        setRotation(prev => prev + 180);

        const temp = fromToken;
        setFromToken(toToken);
        setToToken(temp);

        setTimeout(() => {
            setIsSwapping(false);
        }, 500);
    };

    const getBalance = (symbol: string) => {
        return MOCK_BALANCES[symbol] !== undefined ? MOCK_BALANCES[symbol].toLocaleString() : '0.00';
    };

    const fromPrice = fromToken?.price || 0;
    const toPrice = toToken?.price || 1;
    const rate = (fromPrice && toPrice) ? fromPrice / toPrice : 0;

    const numAmount = parseAmount(amount);
    const outputAmount = formatTokenAmount(numAmount * rate);
    const formattedRate = formatCurrencyRate(rate);
    const balanceStr = fromToken ? getBalance(fromToken.symbol) : '0';
    const numBalance = parseAmount(balanceStr);

    const isInsufficientBalance = !validateBalance(numAmount, numBalance);
    const isValid = numAmount > 0 && !isInsufficientBalance;

    const totalUsdValue = formatUsdValue(parseAmount(outputAmount) * (toToken?.price || 0));

    return {
        fromToken,
        toToken,
        amount,
        selectingSide,
        rotation,
        isSwapping,
        setAmount,
        setSelectingSide,
        handleTokenSelect,
        handleSwapTokens,
        getBalance,
        outputAmount,
        formattedRate,
        isValid,
        isInsufficientBalance,
        totalUsdValue
    };
};
