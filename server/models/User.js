import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    odessa: { type: String, unique: true, sparse: true },
    name: { type: String, default: '' },
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    googleId: { type: String },
    studentId: { type: String },
    picture: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    profileImageUrl: { type: String, default: null },
    
    // Personal Details
    age: { type: Number, default: null },
    gender: { type: String, default: '' },
    
    // Emergency Contact
    emergencyContactName: { type: String, default: '' },
    emergencyContactRelation: { type: String, default: '' },
    emergencyContactPhone: { type: String, default: '' },
    
    // Medical Information
    bloodGroup: { type: String, default: '' },
    allergies: { type: [String], default: [] },
    conditions: [{
        name: { type: String },
        status: { type: String, default: 'Ongoing' }
    }],
    
    // Additional Medical Details
    height: { type: String, default: '' },
    weight: { type: String, default: '' },
    currentMedications: { type: String, default: '' },
    pastMedicalHistory: { type: String, default: '' },
    specialNotes: { type: String, default: '' },
    
    // Metadata
    medicalInfoUpdatedAt: { type: Date, default: null },
    
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
