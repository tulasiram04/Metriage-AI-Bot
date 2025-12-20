import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

// Get User Profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Update User Profile
router.put('/:id', async (req, res) => {
    try {
        console.log(`[PUT] Update User: ${req.params.id}`, req.body); // DEBUG LOG
        const { name, bloodGroup, allergies, conditions, contact, picture, profileImageUrl, email } = req.body;
        const updates = {};

        if (name !== undefined) updates.name = name;
        if (bloodGroup !== undefined) updates.bloodGroup = bloodGroup;
        if (allergies !== undefined) updates.allergies = allergies;
        if (conditions !== undefined) updates.conditions = conditions;
        if (contact !== undefined) updates.contact = contact;
        if (picture !== undefined) updates.picture = picture;
        if (profileImageUrl !== undefined) {
            updates.profileImageUrl = profileImageUrl;
            // Also update picture for backward compatibility if needed, but per request store in profileImageUrl
        }
        // Email is required for creation (upsert), but usually immutable.
        // We include it here to allow re-creating the user if they don't exist.
        if (email !== undefined) updates.email = email;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (e) {
        if (e.name === 'CastError') {
            return res.status(400).json({ error: "Invalid User ID. Please sign out and sign in again." });
        }
        res.status(500).json({ error: e.message });
    }
});

// Log Recently Viewed Item
router.post('/:id/activity', async (req, res) => {
    try {
        const { medicineId, name, strength, price } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ error: "User not found" });

        // Remove existing entry for this medicine if it exists (to move it to top)
        user.recentlyViewed = user.recentlyViewed.filter(item => item.medicineId !== medicineId);

        // Add new entry to the BEGINNING of array
        user.recentlyViewed.unshift({
            medicineId,
            name,
            strength,
            price,
            timestamp: new Date()
        });

        // Limit to 10 items
        if (user.recentlyViewed.length > 10) {
            user.recentlyViewed = user.recentlyViewed.slice(0, 10);
        }

        await user.save();
        res.json(user.recentlyViewed);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
