import { useState, useEffect } from 'react';
import { loadTokens } from '../data/tokens';

export const useTokenInitialization = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initData = async () => {
            setIsLoading(true);
            await Promise.all([
                loadTokens(),
                new Promise(resolve => setTimeout(resolve, 1500))
            ]);
            setIsLoading(false);
        };

        initData();
    }, []);

    return { isLoading };
};
