import React from 'react';
import { GlassCard } from './GlassCard';
import { Button } from './Button';
import { ShieldAlert, User } from './Icons';

interface SignInModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSignIn: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onSignIn }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <GlassCard className="relative w-full max-w-sm p-8 text-center border-l-4 border-amber-500 animate-scale-in">
                <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        <ShieldAlert className="w-10 h-10" />
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">Sign In Required</h3>
                <p className="text-slate-400 mb-8 leading-relaxed">
                    Order is only placed after the sign in process. Please sign in to securely complete your purchase.
                </p>

                <div className="flex flex-col gap-3">
                    <Button onClick={onSignIn} className="w-full">
                        Sign In to Continue
                    </Button>
                    <Button onClick={onClose} variant="ghost" className="w-full">
                        Cancel
                    </Button>
                </div>
            </GlassCard>
        </div>
    );
};
