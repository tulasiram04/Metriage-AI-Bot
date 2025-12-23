import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

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
   🔥 REQUEST HIT LOGGER (CRITICAL)
   This PROVES whether Express is being called
-------------------------------------------------- */
app.use((req, res, next) => {
  console.log('🔥 HIT EXPRESS SERVER:', req.method, req.url);
  next();
});

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
   Routes
-------------------------------------------------- */
console.log('Importing Routes...');

import authRoutes from './routes/auth.js';
import triageRoutes from './routes/triage.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/user.js';
import profileRoutes from './routes/profile.js';

app.use('/api/auth', authRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);

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
    stack: err.stack, // remove in production
  });
});

/* --------------------------------------------------
   Start Server
-------------------------------------------------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
