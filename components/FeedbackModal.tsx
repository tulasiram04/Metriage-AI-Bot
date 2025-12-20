import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Button } from './Button';

interface FeedbackModalProps {
    onClose: () => void;
    onSubmit: (rating: number) => void;
    onSkip: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose, onSubmit, onSkip }) => {
    const [rating, setRating] = useState(0);

    const handleSubmit = () => {
        onSubmit(rating);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <GlassCard className="relative w-full max-w-sm p-8 text-center animate-scale-in">
                <h3 className="text-2xl font-bold text-white mb-4">How was your session?</h3>
                <p className="text-slate-400 mb-6">
                    Please rate your experience with MedTriage AI.
                </p>

                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <svg
                                className={`w-10 h-10 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-slate-600'}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        onClick={handleSubmit}
                        className="w-full"
                        disabled={rating === 0}
                    >
                        Submit Feedback
                    </Button>
                    <Button onClick={onSkip} variant="ghost" className="w-full">
                        Skip
                    </Button>
                </div>
            </GlassCard>
        </div>
    );
};
