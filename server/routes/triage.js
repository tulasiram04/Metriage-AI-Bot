import express from 'express';
import { History } from '../models/History.js';
import { User } from '../models/User.js';

const router = express.Router();

// Save Analysis Result
router.post('/save', async (req, res) => {
    try {
        const { userId, name, age, gender, symptoms, duration, result, chatTranscript } = req.body;

        const history = new History({
            userId,
            name,
            age,
            gender,
            symptoms,
            duration,
            result,
            chatTranscript
        });

        await history.save();
        res.json({ message: "Analysis saved", id: history._id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Server error" });
    }
});

// Get User History
router.get('/history/:userId', async (req, res) => {
    try {
        const history = await History.find({ userId: req.params.userId }).sort({ timestamp: -1 });
        res.json(history);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
