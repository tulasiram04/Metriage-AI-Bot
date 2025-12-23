import React from 'react';
import { Button } from './Button';

interface AlertModalProps {
    isOpen: boolean;
    message: string;
    onClose: () => void;
    title?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
    isOpen,
    message,
    onClose,
    title = "Notice"
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Enhanced Backdrop with gradient */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-950/90 to-slate-900/80 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />

            {/* Modal with enhanced styling */}
            <div className="relative w-full max-w-sm p-6 text-center animate-scale-in glass-panel rounded-2xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-teal-500/5 rounded-2xl blur-xl"></div>

                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-3 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                        {title}
                    </h3>
                    <p className="text-slate-300 mb-6 font-medium leading-relaxed">
                        {message}
                    </p>

                    <div className="flex justify-center">
                        <Button
                            onClick={onClose}
                            className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white shadow-lg shadow-cyan-500/30 border-0 transition-all duration-300 hover:shadow-cyan-400/40"
                        >
                            OK
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
