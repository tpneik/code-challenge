import { TOKENS } from '../../data/tokens';
import { LoadingOverlay } from "./LoadingOverlay";
import { SwapHeader } from "./SwapHeader";
import { CurrencyInputSection } from "./CurrencyInputSection";
import { SwapButton } from "./SwapButton";
import { SwapDetails } from "./SwapDetails";
import { TokenSelectionModal } from "./TokenSelectionModal";
import { OTPVerification } from "./OTPVerification";
import { SuccessView } from "./SuccessView";
import { useTheme } from '../../hooks/useTheme';
import { useTokenInitialization } from '../../hooks/useTokenInitialization';
import { useSwap } from '../../hooks/useSwap';
import { useSwapFlow } from '../../hooks/useSwapFlow';

export const CurrencySwap = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { isLoading } = useTokenInitialization();
    const {
        fromToken, toToken, amount, selectingSide, rotation, isSwapping,
        setAmount, setSelectingSide, handleTokenSelect, handleSwapTokens, getBalance,
        outputAmount, formattedRate, isValid, totalUsdValue
    } = useSwap(isLoading);

    const {
        showDetails, setShowDetails,
        showOTP, setShowOTP,
        showSuccess, setShowSuccess
    } = useSwapFlow();

    const handleOTPVerifySuccess = () => {
        setShowOTP(false);
        setShowSuccess(true);
        setAmount('');
    };

    const handleSwapClick = () => {
        setShowOTP(true);
    };

    if (!isLoading && (!fromToken || !toToken)) return null;

    return (
        <div className={`w-full max-w-[min(90%,420px)] flex flex-col justify-center items-center relative ${isDarkMode ? 'dark' : ''}`}>
            <LoadingOverlay isLoading={isLoading} />

            <OTPVerification
                isOpen={showOTP}
                onClose={() => setShowOTP(false)}
                onVerify={handleOTPVerifySuccess}
                isDarkMode={isDarkMode}
            />

            <SuccessView
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                isDarkMode={isDarkMode}
                message={fromToken && toToken ? `Successfully swapped ${fromToken.symbol} to ${toToken.symbol}!` : 'Swap Successful!'}
            />

            <div className={`w-full rounded-2xl p-5 md:p-8 flex flex-col gap-2 relative border max-h-[90vh] overflow-hidden transition-all duration-300 ${isDarkMode
                ? 'bg-slate-800 border-slate-700 shadow-xl'
                : 'bg-white/80 backdrop-blur-xl border-indigo-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] shadow-indigo-100/50'
                }`}>

                <SwapHeader
                    isDarkMode={isDarkMode}
                    toggleTheme={toggleTheme}
                    showDetails={showDetails}
                    toggleDetails={() => setShowDetails(!showDetails)}
                />

                {fromToken && toToken && (
                    <>
                        <TokenSelectionModal
                            isOpen={selectingSide !== null}
                            onClose={() => setSelectingSide(null)}
                            onSelect={handleTokenSelect}
                            tokens={TOKENS}
                            selectedToken={selectingSide === 'from' ? fromToken : toToken}
                            otherSelectedToken={selectingSide === 'from' ? toToken : fromToken}
                            getBalance={getBalance}
                            isDarkMode={isDarkMode}
                        />

                        <CurrencyInputSection
                            label="From"
                            amount={amount}
                            onAmountChange={setAmount}
                            token={fromToken}
                            onSelectToken={() => setSelectingSide('from')}
                            balance={getBalance(fromToken.symbol)}
                            isDarkMode={isDarkMode}
                            placeholder="0"
                        />
                    </>
                )}

                <SwapButton
                    onClick={handleSwapTokens}
                    rotation={rotation}
                    isDarkMode={isDarkMode}
                    disabled={isSwapping || !fromToken || !toToken}
                />

                {fromToken && toToken && (
                    <>
                        <CurrencyInputSection
                            label="To"
                            amount={amount ? outputAmount : ''}
                            token={toToken}
                            onSelectToken={() => setSelectingSide('to')}
                            balance={getBalance(toToken.symbol)}
                            isDarkMode={isDarkMode}
                            readOnly={true}
                            placeholder="0"
                        />

                        <SwapDetails
                            showDetails={showDetails}
                            isDarkMode={isDarkMode}
                            rate={formattedRate}
                            totalUsdValue={totalUsdValue}
                            outputAmount={amount ? outputAmount : '0'}
                            fromSymbol={fromToken.symbol}
                            toSymbol={toToken.symbol}
                        />
                    </>
                )}

                <button
                    disabled={!isValid}
                    onClick={handleSwapClick}
                    className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all duration-200 min-h-[56px] mt-4 text-lg ${!isValid
                        ? `opacity-50 cursor-not-allowed shadow-none ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-300 text-white'}`
                        : isDarkMode
                            ? 'bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white shadow-indigo-900/50 hover:shadow-indigo-900/70 cursor-pointer'
                            : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-indigo-200 hover:shadow-indigo-300 cursor-pointer'
                        }`}>
                    Swap
                </button>
            </div>
        </div>
    );
};
