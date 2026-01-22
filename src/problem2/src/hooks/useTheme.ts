import { useState, useEffect } from 'react';

export const useTheme = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const hour = new Date().getHours();
        setIsDarkMode(hour >= 18 || hour < 6);
    }, []);

    const toggleTheme = () => setIsDarkMode(prev => !prev);

    return { isDarkMode, setIsDarkMode, toggleTheme };
};
