import express from 'express';
import crypto from 'crypto';
import { User } from '../models/User.js';

const router = express.Router();

// Generate a unique User ID
const generateUserId = () => {
    return 'user_' + crypto.randomBytes(16).toString('hex');
};

// Initialize or retrieve user session
// POST /api/session/init
router.post('/init', async (req, res) => {
    try {
        const { userId } = req.body;

        // If userId provided, verify it exists
        if (userId) {
            const existingUser = await User.findOne({ odessa: userId });
            if (existingUser) {
                return res.json({ 
                    userId: existingUser.odessa,
                    isNew: false,
                    user: existingUser
                });
            }
        }

        // Generate new user ID and create user record
        const newUserId = generateUserId();
        const newUser = new User({
            odessa: newUserId,
            name: '',
            email: `${newUserId}@anonymous.local`,
            createdAt: new Date()
        });

        await newUser.save();

        res.json({ 
            userId: newUserId,
            isNew: true,
            user: newUser
        });
    } catch (e) {
        console.error('Session init error:', e);
        res.status(500).json({ error: 'Failed to initialize session' });
    }
});

// Check if name is unique
// POST /api/session/check-name
router.post('/check-name', async (req, res) => {
    try {
        const { name, currentOdessa } = req.body;
        
        if (!name || !name.trim()) {
            return res.json({ available: false, error: 'Name is required' });
        }

        // Check if name exists for a different user
        const existingUser = await User.findOne({ 
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
            odessa: { $ne: currentOdessa }
        });

        res.json({ 
            available: !existingUser,
            error: existingUser ? 'This name is already taken. Please choose a different name.' : null
        });
    } catch (e) {
        console.error('Check name error:', e);
        res.status(500).json({ available: false, error: 'Failed to check name' });
    }
});

// Validate user session
// GET /api/session/validate/:userId
router.get('/validate/:odessa', async (req, res) => {
    try {
        const { odessa } = req.params;
        
        if (!odessa) {
            return res.status(400).json({ 
                valid: false, 
                error: 'User session not initialized' 
            });
        }

        const user = await User.findOne({ odessa });
        
        if (!user) {
            return res.status(404).json({ 
                valid: false, 
                error: 'User session not found or expired' 
            });
        }

        res.json({ 
            valid: true, 
            user 
        });
    } catch (e) {
        console.error('Session validate error:', e);
        res.status(500).json({ valid: false, error: 'Failed to validate session' });
    }
});

export default router;
