import { useState } from 'react';

export const useSwapFlow = () => {
    const [showDetails, setShowDetails] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    return {
        showDetails,
        setShowDetails,
        showOTP,
        setShowOTP,
        showSuccess,
        setShowSuccess
    };
};
