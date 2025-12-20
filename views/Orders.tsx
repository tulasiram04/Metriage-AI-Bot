import React from 'react';
import { ShoppingBag, CheckCircle, Package, Truck, HomeIcon, Clock } from '../components/Icons';
import { api } from '../services/api';

export const Orders: React.FC = () => {
    const [orders, setOrders] = React.useState<any[]>([]);

    React.useEffect(() => {
        const loadOrders = async () => {
            try {
                const savedUser = localStorage.getItem('medtriage_user');
                if (!savedUser) {
                    alert("Please sign in to view your orders.");
                    window.location.href = 'login.html';
                    return;
                }

                const parsedUser = JSON.parse(savedUser);
                if (parsedUser.id) {
                    const fetchedOrders = await api.orders.getAll(parsedUser.id);
                    setOrders(fetchedOrders);
                }
            } catch (e) {
                console.error(e);
            }
        };
        loadOrders();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                    <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">Your Orders</h2>
                    <p className="text-slate-400">Track current deliveries and view history.</p>
                </div>
            </div>

            <div className="space-y-6">
                {orders.length === 0 ? (
                    <div className="text-center text-slate-500 py-12">
                        <p>No orders found.</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="glass-panel rounded-2xl p-6 md:p-8 border border-white/10">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8 border-b border-white/5 pb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-bold text-white">{order.id}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${order.status === 'Delivered'
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> {new Date(order.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-white">₹{order.total ? order.total.toFixed(2) : '0.00'}</p>
                                    <p className="text-sm text-slate-500">{order.items ? order.items.length : 0} items</p>
                                </div>
                            </div>

                            {/* Timeline - Simplified if data is missing */}
                            {order.timeline && (
                                <div className="relative">
                                    {/* Progress Bar Background */}
                                    <div className="absolute top-2.5 left-0 w-full h-1 bg-white/5 rounded-full z-0 hidden md:block"></div>

                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                                        {order.timeline.map((step: any, idx: number) => (
                                            <div key={idx} className={`flex md:flex-col items-center gap-4 md:gap-3 ${step.done ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 bg-slate-950 ${step.done ? 'border-cyan-500 text-cyan-500' : 'border-slate-700 text-slate-700'
                                                    }`}>
                                                    <div className={`w-2 h-2 rounded-full ${step.done ? 'bg-cyan-500' : 'bg-transparent'}`} />
                                                </div>
                                                <div className="md:text-center pt-1 md:pt-0">
                                                    <p className={`text-sm font-medium ${step.done ? 'text-white' : 'text-slate-500'}`}>{step.step}</p>
                                                    <p className="text-xs text-slate-500">{step.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Items List */}
                            <div className="mt-8 bg-black/20 rounded-xl p-4">
                                <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Items</h4>
                                <ul className="space-y-2">
                                    {order.items && order.items.map((item: any, i: number) => (
                                        <li key={i} className="text-slate-300 text-sm flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                                            {/* Handle both string items and object items if necessary */}
                                            {typeof item === 'string' ? item : item.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
