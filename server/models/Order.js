import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        id: String,
        name: String,
        price: Number,
        quantity: Number
    }],
    total: Number,
    status: { type: String, default: 'Pending' }, // Pending, Dispatching, Delivered
    date: { type: Date, default: Date.now }
});

export const Order = mongoose.model('Order', orderSchema);
