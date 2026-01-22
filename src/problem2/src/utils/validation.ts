export const isValidNumberInput = (value: string): boolean => {
    return /^\d*\.?\d*$/.test(value);
};

export const normalizeInputString = (value: string): string => {
    if (/^0\d/.test(value)) {
        return value.replace(/^0/, '');
    }
    return value;
};

export const validateBalance = (amount: number, balance: number): boolean => {
    return amount <= balance;
};

export const isNumeric = (char: string): boolean => {
    return /^\d$/.test(char);
};
