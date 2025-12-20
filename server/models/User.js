import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Made optional for Google users
    googleId: { type: String },
    studentId: { type: String }, // Optional for guests
    picture: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    profileImageUrl: { type: String, default: null },
    // Profile Fields
    bloodGroup: { type: String, default: '' },
    allergies: { type: String, default: '— NIL —' },
    conditions: { type: String, default: '— NIL —' },
    contact: { type: String, default: '' },
    // Activity / Shopping
    recentlyViewed: [{
        medicineId: String,
        name: String,
        strength: String,
        price: Number,
        timestamp: { type: Date, default: Date.now }
    }]
});

export const User = mongoose.model('User', userSchema);
