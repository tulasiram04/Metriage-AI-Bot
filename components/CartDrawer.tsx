import React from 'react';
import { ShoppingBag, X, Trash, CheckCircle } from './Icons';
import { Button } from './Button';
import { Medicine } from '../views/Pharmacy';

interface CartItem extends Medicine {
    quantity: number;
}

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onRemove: (id: string) => void;
    onUpdateQuantity: (id: string, delta: number) => void;
    onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
    isOpen, onClose, items, onRemove, onUpdateQuantity, onCheckout
}) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md h-full bg-[#0f172a] border-l border-white/10 shadow-2xl flex flex-col transform transition-transform duration-300 animate-slide-in-right">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-cyan-400" />
                        <h2 className="text-xl font-bold text-white">Your Cart</h2>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white">{items.length}</span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                            <ShoppingBag className="w-16 h-16 opacity-20" />
                            <p>Your cart is empty</p>
                            <Button onClick={onClose} variant="ghost">Continue Browsing</Button>
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="bg-white/5 rounded-xl p-4 flex gap-4 border border-white/5">
                                <div className="w-16 h-16 rounded-lg bg-slate-800 flex items-center justify-center text-2xl">
                                    💊
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-semibold text-white">{item.name}</h4>
                                        <button onClick={() => onRemove(item.id)} className="text-slate-500 hover:text-red-400">
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-400 mb-3">{item.category}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 bg-slate-900/50 rounded-lg p-1">
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, -1)}
                                                className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white"
                                            >
                                                -
                                            </button>
                                            <span className="text-sm font-medium text-white w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, 1)}
                                                className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="font-bold text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 bg-white/5 border-t border-white/10 space-y-4">
                        <div className="space-y-2 text-sm text-slate-400">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="text-white">₹{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="text-emerald-400">Free</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-white pt-4 border-t border-white/10">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        <Button onClick={onCheckout} className="w-full py-4 text-base bg-gradient-to-r from-cyan-600 to-blue-600 hover:scale-[1.02]">
                            Checkout Now
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
