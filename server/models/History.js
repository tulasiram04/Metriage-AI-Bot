import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String, // Snapshot of user name at time of triage
    age: Number,
    gender: String,
    symptoms: [String],
    duration: String,
    result: {
        riskLevel: String,
        explanation: String,
        recommendation: {
            specialization: String,
            reason: String
        },
        consultationSummary: String,
        disclaimer: String
    },
    chatTranscript: String,
    timestamp: { type: Date, default: Date.now }
});

export const History = mongoose.model('History', historySchema);
