import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, studentId } = req.body;

        // Check if user exists
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "User already exists" });

        // Create user (In production, hash password!)
        const user = new User({ name, email, password, studentId });
        await user.save();

        res.json({ message: "Registration successful", user: { id: user._id, name: user.name, email: user.email } });
    } catch (e) {
        console.error("Register Error:", e);
        res.status(500).json({ error: e.message || "Server error" });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        // Check password (In production, compare hash!)
        if (user.password !== password) return res.status(400).json({ error: "Invalid credentials" });

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                studentId: user.studentId,
                picture: user.picture
            }
        });
    } catch (e) {
        console.error("Login Error:", e);
        res.status(500).json({ error: e.message || "Server error" });
    }
});

// Google Login (Sync or Create)
router.post('/google', async (req, res) => {
    try {
        const { name, email, picture, sub: googleId } = req.body; // 'sub' is the google unique ID

        // 1. Check if user exists by email
        let user = await User.findOne({ email });

        if (user) {
            // User exists! Merge/Update info
            // If they didn't have a googleId before, add it now
            if (!user.googleId) user.googleId = googleId;
            if (!user.picture && picture) user.picture = picture;
            await user.save();
        } else {
            // New User via Google
            user = new User({
                name,
                email,
                picture,
                googleId,
                password: "" // Empty password for Google users
            });
            await user.save();
        }

        res.json({
            message: "Google Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                studentId: user.studentId
            }
        });

    } catch (e) {
        console.error("Google Auth Error:", e);
        res.status(500).json({ error: e.message || "Server error" });
    }
});

export default router;
