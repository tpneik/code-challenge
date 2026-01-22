import React from 'react';

interface LoadingOverlayProps {
    isLoading: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
    return (
        <div
            className={`fixed inset-0 z-[200] flex items-center justify-center bg-slate-50/60 backdrop-blur-md transition-all duration-500 ${isLoading
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
                }`}
        >
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                    </div>
                </div>
                <span className="text-slate-600 font-medium tracking-widest uppercase text-sm animate-pulse">Loading Assets...</span>
            </div>
        </div>
    );
};
