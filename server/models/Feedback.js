import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

export const Feedback = mongoose.model('Feedback', feedbackSchema);
