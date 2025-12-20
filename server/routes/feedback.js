import express from 'express';
import { Feedback } from '../models/Feedback.js';

const router = express.Router();

router.post('/save', async (req, res) => {
    try {
        const { userId, rating } = req.body;
        
        const feedback = new Feedback({
            userId: userId || null,
            rating
        });

        await feedback.save();
        res.status(201).json({ message: 'Feedback saved successfully' });
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ error: 'Failed to save feedback' });
    }
});

export default router;
