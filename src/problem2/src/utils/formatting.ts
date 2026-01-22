export const parseAmount = (value: string): number => {
    return parseFloat(value.replace(/,/g, '')) || 0;
};

export const formatTokenAmount = (amount: number, maxDecimals: number = 6): string => {
    return amount.toLocaleString('en-US', { maximumFractionDigits: maxDecimals });
};

export const formatCurrencyRate = (rate: number, maxSignificantDigits: number = 6): string => {
    return new Intl.NumberFormat('en-US', {
        maximumSignificantDigits: maxSignificantDigits,
    }).format(rate);
};

export const formatUsdValue = (value: number): string => {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
