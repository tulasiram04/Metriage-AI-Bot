import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables FIRST
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

console.log('Starting Server Initialization...');
console.log('Environment loaded, GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'SET' : 'NOT SET');
// Debug: show env vars from .env (custom ones, not system)
const customEnvVars = ['GROQ_API_KEY', 'MONGODB_URI', 'CLOUDINARY_CLOUD_NAME', 'PORT'];
console.log('Checking env vars:');
customEnvVars.forEach(v => console.log(`  ${v}:`, process.env[v] ? 'SET' : 'NOT SET'));

/* --------------------------------------------------
   App Init
-------------------------------------------------- */
const app = express();
const PORT = process.env.PORT || 5000;

/* --------------------------------------------------
   Middleware
-------------------------------------------------- */
console.log('Middleware Setup...');

app.use(cors());

// IMPORTANT: increase body size for Base64 images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/* --------------------------------------------------
   JSON & Payload Error Handling
-------------------------------------------------- */
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Image too large. Please upload an image under 5MB.',
    });
  }

  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  if (err instanceof SyntaxError) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  next(err);
});

/* --------------------------------------------------
   Request Logging
-------------------------------------------------- */
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

/* --------------------------------------------------
   MongoDB Connection
-------------------------------------------------- */
const MONGO_URI = process.env.MONGODB_URI;

console.log('Connecting to MongoDB...');

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

/* --------------------------------------------------
   Routes - Using dynamic imports to ensure env vars are loaded first
-------------------------------------------------- */
console.log('Importing Routes...');

const authRoutes = (await import('./routes/auth.js')).default;
const triageRoutes = (await import('./routes/triage.js')).default;
const orderRoutes = (await import('./routes/orders.js')).default;
const userRoutes = (await import('./routes/user.js')).default;
const profileRoutes = (await import('./routes/profile.js')).default;
const feedbackRoutes = (await import('./routes/feedback.js')).default;
const sessionRoutes = (await import('./routes/session.js')).default;

app.use('/api/auth', authRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/session', sessionRoutes);

/* --------------------------------------------------
   Health Check
-------------------------------------------------- */
app.get('/', (req, res) => {
  res.send('MedTriage AI API is running');
});

/* --------------------------------------------------
   GLOBAL ERROR HANDLER (MUST BE LAST)
-------------------------------------------------- */
app.use((err, req, res, next) => {
  console.error('🔥 GLOBAL ERROR HANDLER 🔥');
  console.error(err);

  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    stack: err.stack, // REMOVE in production
  });
});

/* --------------------------------------------------
   Start Server
-------------------------------------------------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Keep the event loop running

/* --------------------------------------------------
   Error Handlers
-------------------------------------------------- */
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
