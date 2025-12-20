import React, { useState } from 'react';
import { X, Plus, CheckCircle } from './Icons';

interface IOSSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    options: string[];
    onSelect: (value: string) => void;
    selectedValue?: string;
    allowCustom?: boolean;
}

export const IOSSelectModal: React.FC<IOSSelectModalProps> = ({
    isOpen,
    onClose,
    title,
    options,
    onSelect,
    selectedValue,
    allowCustom = false
}) => {
    const [customValue, setCustomValue] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);

    if (!isOpen) return null;

    const handleCustomSubmit = () => {
        if (customValue.trim()) {
            onSelect(customValue.trim());
            setCustomValue('');
            setShowCustomInput(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[250] flex items-end justify-center sm:items-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-slate-900 border-t sm:border border-slate-700/50 rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up sm:animate-scale-in overflow-hidden max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <h3 className="text-lg font-bold text-white text-center flex-1">{title}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white absolute right-2">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 overflow-y-auto space-y-2">
                    {options.map((option) => (
                        <button
                            key={option}
                            onClick={() => onSelect(option)}
                            className={`w-full text-left px-4 py-3.5 rounded-xl font-medium transition-all flex items-center justify-between group ${selectedValue === option
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                    : 'bg-white/5 text-slate-300 hover:bg-white/10 active:scale-[0.98]'
                                }`}
                        >
                            <span>{option}</span>
                            {selectedValue === option && <CheckCircle className="w-5 h-5 text-cyan-400" />}
                        </button>
                    ))}

                    {/* Custom Input Option */}
                    {allowCustom && (
                        <div className="pt-2">
                            {showCustomInput ? (
                                <div className="flex gap-2 animate-fade-in">
                                    <input
                                        type="text"
                                        autoFocus
                                        value={customValue}
                                        onChange={(e) => setCustomValue(e.target.value)}
                                        placeholder="Type custom entry..."
                                        className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors"
                                        onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
                                    />
                                    <button
                                        onClick={handleCustomSubmit}
                                        className="px-4 py-2 bg-cyan-600 rounded-xl text-white font-medium hover:bg-cyan-500 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowCustomInput(true)}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-white/5 transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Add Custom Entry</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Safe Area for Mobile */}
                <div className="h-6 sm:h-2 bg-transparent" />
            </div>
        </div>
    );
};
