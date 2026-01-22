import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, Loader2, CheckCircle, RotateCcw } from 'lucide-react';
import { isNumeric } from '../../utils/validation';

interface OTPVerificationProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: () => void;
    isDarkMode: boolean;
    expectedCode?: string;
}

type VerificationStatus = 'idle' | 'verifying' | 'error' | 'success';

export const OTPVerification: React.FC<OTPVerificationProps> = ({
    isOpen,
    onClose,
    onVerify,
    isDarkMode,
    expectedCode = '777777'
}) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [status, setStatus] = useState<VerificationStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [resendCountdown, setResendCountdown] = useState(0);
    const [showResendToast, setShowResendToast] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setOtp(['', '', '', '', '', '']);
            setStatus('idle');
            setErrorMessage(null);
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 100);
        }
    }, [isOpen]);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (resendCountdown > 0) {
            timer = setInterval(() => {
                setResendCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCountdown]);

    const verifyCode = async (code: string) => {
        setStatus('verifying');

        await new Promise(resolve => setTimeout(resolve, 800));

        if (code === expectedCode) {
            setStatus('success');
            setTimeout(() => {
                onVerify();
            }, 1000);
        } else {
            setStatus('error');
            setErrorMessage('Invalid verification code');

            setTimeout(() => {
                setStatus('idle');
                setOtp(['', '', '', '', '', '']);
                setErrorMessage(null);
                inputRefs.current[0]?.focus();
            }, 1500);
        }
    };

    const handleChange = (index: number, value: string) => {
        if (!isNumeric(value) && value !== '') return;
        if (status === 'verifying' || status === 'success') return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setStatus('idle');

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        if (newOtp.every(digit => digit !== '')) {
            setTimeout(() => {
                verifyCode(newOtp.join(''));
            }, 300);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
        if (pastedData.every(char => /^\d$/.test(char))) {
            const newOtp = [...otp];
            pastedData.forEach((digit, i) => {
                if (i < 6) newOtp[i] = digit;
            });
            setOtp(newOtp);
            if (newOtp.every(digit => digit !== '')) {
                verifyCode(newOtp.join(''));
            }
        }
    };

    const handleResend = () => {
        if (resendCountdown > 0) return;

        setResendCountdown(60);
        setShowResendToast(true);
        setTimeout(() => setShowResendToast(false), 3000);

        setOtp(['', '', '', '', '', '']);
        setStatus('idle');
        inputRefs.current[0]?.focus();
    };

    if (!isOpen) return null;

    return (
        <div className={`absolute inset-0 z-50 backdrop-blur-sm rounded-xl flex flex-col p-5 md:p-8 animate-in fade-in duration-200 border shadow-sm transition-all overflow-hidden ${isDarkMode
            ? 'bg-slate-700/95 border-slate-600'
            : 'bg-white/90 backdrop-blur-xl border-indigo-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
            }`}>
            <div className="flex justify-between items-center mb-6 z-10">
                <h3 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <ShieldCheck className={`w-6 h-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    Verification
                </h3>
                <button
                    onClick={onClose}
                    className={`p-2 rounded-full transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-slate-600 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                        }`}
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-center relative z-10">
                <p className={`mb-8 text-base text-center transition-colors ${status === 'error' ? 'text-red-500 font-medium' :
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                    {status === 'error' ? errorMessage : 'Enter the 6-digit code sent to your device to authorize this transaction.'}
                </p>

                <div
                    ref={containerRef}
                    className={`flex justify-between gap-2 mb-6 transition-transform duration-300 ${status === 'error' ? 'animate-shake' : ''
                        }`}
                    style={{ animation: status === 'error' ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : 'none' }}
                >
                    {otp.map((digit, index) => (
                        <div key={index} className="relative group">
                            <input
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                disabled={status === 'verifying' || status === 'success'}
                                className={`w-10 h-14 md:w-12 md:h-16 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all duration-300 shadow-sm
                                    ${status === 'error'
                                        ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20'
                                        : status === 'success'
                                            ? 'border-green-500 text-green-500 bg-green-50 dark:bg-green-900/20 scale-105'
                                            : isDarkMode
                                                ? 'bg-slate-800 border-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 text-white'
                                                : 'bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-slate-900'
                                    }
                                    ${digit && status !== 'error' && status !== 'success' ? 'border-indigo-500/50' : ''}
                                `}
                            />
                            {status === 'success' && (
                                <div className="absolute -top-3 -right-3 pointer-events-none animate-in zoom-in duration-300">
                                    <div className="bg-green-500 text-white rounded-full p-1 shadow-sm">
                                        <CheckCircle className="w-3 h-3" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="h-12 flex items-center justify-center mb-2">
                    {status === 'verifying' && (
                        <div className="flex items-center gap-2 text-indigo-500 animate-in fade-in duration-300">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="font-medium text-sm">Verifying code...</span>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex items-center gap-2 text-green-500 animate-in zoom-in duration-300">
                            <CheckCircle className="w-6 h-6" />
                            <span className="font-bold text-lg">Verified!</span>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button
                        onClick={handleResend}
                        disabled={resendCountdown > 0 || status === 'verifying' || status === 'success'}
                        className={`w-full py-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 ${resendCountdown > 0
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            : 'hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                            }`}
                    >
                        {resendCountdown > 0 ? (
                            <>
                                <RotateCcw className="w-4 h-4 animate-spin-reverse" style={{ animationDuration: '3s' }} />
                                Resend in {resendCountdown}s
                            </>
                        ) : (
                            'Resend Code'
                        )}
                    </button>

                    {showResendToast && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-full shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Code resent successfully
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
            `}</style>
        </div>
    );
};
