import mongoose from 'mongoose';
import { User } from './server/models/User.js';

const MONGO_URI = "mongodb+srv://Tulasiram04:Tulasiram2709@medtriage-ai.ur25k4y.mongodb.net/?appName=MedTriage-AI";

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected');
        const user = await User.findOne();
        if (user) {
            console.log("Valid User ID:", user._id);
        } else {
            console.log("No users found");
        }
        mongoose.disconnect();
    })
    .catch(err => console.error(err));
