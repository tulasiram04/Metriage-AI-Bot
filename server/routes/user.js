import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

// Middleware to validate user session
const validateSession = async (req, res, next) => {
    const odessa = req.params.odessa || req.body.odessa || req.headers['x-user-id'];
    
    if (!odessa) {
        return res.status(400).json({ 
            error: 'User session not initialized. Please refresh the page.' 
        });
    }
    
    req.odessa = odessa;
    next();
};

// Get User Profile by odessa (persistent user ID)
router.get('/profile/:odessa', validateSession, async (req, res) => {
    try {
        const user = await User.findOne({ odessa: req.odessa });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found. Session may have expired.' });
        }
        
        res.json(user);
    } catch (e) {
        console.error('Get profile error:', e);
        res.status(500).json({ error: e.message });
    }
});

// Update User Profile by odessa
router.put('/profile/:odessa', validateSession, async (req, res) => {
    try {
        console.log(`[PUT] Update User Profile: ${req.odessa}`);
        
        const {
            name,
            age,
            gender,
            emergencyContactName,
            emergencyContactRelation,
            emergencyContactPhone,
            bloodGroup,
            allergies,
            conditions,
            height,
            weight,
            currentMedications,
            pastMedicalHistory,
            specialNotes
        } = req.body;

        const updates = { medicalInfoUpdatedAt: new Date() };

        if (name !== undefined) updates.name = name;
        if (age !== undefined) updates.age = age;
        if (gender !== undefined) updates.gender = gender;
        if (emergencyContactName !== undefined) updates.emergencyContactName = emergencyContactName;
        if (emergencyContactRelation !== undefined) updates.emergencyContactRelation = emergencyContactRelation;
        if (emergencyContactPhone !== undefined) updates.emergencyContactPhone = emergencyContactPhone;
        if (bloodGroup !== undefined) updates.bloodGroup = bloodGroup;
        if (allergies !== undefined) updates.allergies = allergies;
        if (conditions !== undefined) updates.conditions = conditions;
        if (height !== undefined) updates.height = height;
        if (weight !== undefined) updates.weight = weight;
        if (currentMedications !== undefined) updates.currentMedications = currentMedications;
        if (pastMedicalHistory !== undefined) updates.pastMedicalHistory = pastMedicalHistory;
        if (specialNotes !== undefined) updates.specialNotes = specialNotes;

        const user = await User.findOneAndUpdate(
            { odessa: req.odessa },
            { $set: updates },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'Failed to update user profile' });
        }

        res.json(user);
    } catch (e) {
        console.error('Update profile error:', e);
        res.status(500).json({ error: e.message });
    }
});

// Legacy routes for backward compatibility (using MongoDB _id)
router.get('/:id', async (req, res) => {
    try {
        // First try to find by odessa
        let user = await User.findOne({ odessa: req.params.id });
        
        // If not found, try MongoDB _id
        if (!user) {
            user = await User.findById(req.params.id);
        }
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(user);
    } catch (e) {
        // If it's a cast error (invalid ObjectId), try odessa lookup
        if (e.name === 'CastError') {
            try {
                const user = await User.findOne({ odessa: req.params.id });
                if (user) return res.json(user);
            } catch (e2) {
                console.error('Fallback lookup failed:', e2);
            }
        }
        res.status(500).json({ error: e.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const {
            name,
            age,
            gender,
            emergencyContactName,
            emergencyContactRelation,
            emergencyContactPhone,
            bloodGroup,
            allergies,
            conditions,
            height,
            weight,
            currentMedications,
            pastMedicalHistory,
            specialNotes,
            email,
            picture,
            profileImageUrl
        } = req.body;

        const updates = { medicalInfoUpdatedAt: new Date() };

        if (name !== undefined) updates.name = name;
        if (email !== undefined) updates.email = email;
        if (age !== undefined) updates.age = age;
        if (gender !== undefined) updates.gender = gender;
        if (emergencyContactName !== undefined) updates.emergencyContactName = emergencyContactName;
        if (emergencyContactRelation !== undefined) updates.emergencyContactRelation = emergencyContactRelation;
        if (emergencyContactPhone !== undefined) updates.emergencyContactPhone = emergencyContactPhone;
        if (bloodGroup !== undefined) updates.bloodGroup = bloodGroup;
        if (allergies !== undefined) updates.allergies = allergies;
        if (conditions !== undefined) updates.conditions = conditions;
        if (height !== undefined) updates.height = height;
        if (weight !== undefined) updates.weight = weight;
        if (currentMedications !== undefined) updates.currentMedications = currentMedications;
        if (pastMedicalHistory !== undefined) updates.pastMedicalHistory = pastMedicalHistory;
        if (specialNotes !== undefined) updates.specialNotes = specialNotes;
        if (picture !== undefined) updates.picture = picture;
        if (profileImageUrl !== undefined) updates.profileImageUrl = profileImageUrl;

        // First try odessa lookup
        let user = await User.findOneAndUpdate(
            { odessa: req.params.id },
            { $set: updates },
            { new: true }
        );

        // If not found, try MongoDB _id
        if (!user) {
            user = await User.findByIdAndUpdate(
                req.params.id,
                { $set: updates },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (e) {
        if (e.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid User ID format' });
        }
        res.status(500).json({ error: e.message });
    }
});

// Log Recently Viewed Item
router.post('/:id/activity', async (req, res) => {
    try {
        const { medicineId, name, strength, price } = req.body;
        
        let user = await User.findOne({ odessa: req.params.id });
        if (!user) {
            user = await User.findById(req.params.id);
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.recentlyViewed = user.recentlyViewed.filter(item => item.medicineId !== medicineId);
        user.recentlyViewed.unshift({
            medicineId,
            name,
            strength,
            price,
            timestamp: new Date()
        });

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
