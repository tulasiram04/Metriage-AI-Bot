import React from 'react';
import { GlassCard } from './GlassCard';
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
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <GlassCard className="relative w-full max-w-sm p-6 text-center animate-scale-in border border-white/10 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-300 mb-6 font-medium">
                    {message}
                </p>

                <div className="flex justify-center">
                    <Button
                        onClick={onClose}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                    >
                        OK
                    </Button>
                </div>
            </GlassCard>
        </div>
    );
};
