import React from 'react';
import { GlassCard } from './GlassCard';
import { Button } from './Button';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel"
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-transparent"
                onClick={onCancel}
            />

            {/* Modal */}
            <GlassCard className="relative w-full max-w-sm p-6 text-center animate-scale-in">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6 font-medium">
                    {message}
                </p>

                <div className="flex gap-3 justify-center">
                    <Button
                        onClick={onCancel}
                        variant="ghost"
                        className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="flex-1 bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30"
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </GlassCard>
        </div>
    );
};
