import express from 'express';
import { Order } from '../models/Order.js';

const router = express.Router();

// Create Order
router.post('/create', async (req, res) => {
    try {
        const { userId, items, total } = req.body;

        const order = new Order({
            userId,
            items,
            total,
            status: 'Placed'
        });

        await order.save();
        res.json({ message: "Order created", id: order._id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Server error" });
    }
});

// Get User Orders
router.get('/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).sort({ date: -1 });
        res.json(orders);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
