

import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { User } from '../models/User.js';

const router = express.Router();

/* --------------------------------------------------
   DEBUG: Verify env vars INSIDE this module
-------------------------------------------------- */
console.log('☁️ Cloudinary ENV CHECK (profile route):', {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : undefined,
});

/* --------------------------------------------------
   Cloudinary Configuration
-------------------------------------------------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* --------------------------------------------------
   POST /api/profile/avatar
-------------------------------------------------- */
router.post('/avatar', async (req, res) => {
  try {
    const { userId, imageBase64 } = req.body;

    /* ---------- Env Guard ---------- */
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return res.status(500).json({
        error: 'Cloudinary configuration missing',
      });
    }

    /* ---------- Validation ---------- */
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    if (!imageBase64 || !imageBase64.startsWith('data:image/')) {
      return res.status(400).json({
        error: 'Invalid imageBase64 (data:image/*;base64 expected)',
      });
    }

    /* ---------- Size Check (≤5MB decoded) ---------- */
    const match = imageBase64.match(/^data:image\/\w+;base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ error: 'Invalid image data URI' });
    }

    const byteLength = Buffer.byteLength(match[1], 'base64');
    if (byteLength > 5 * 1024 * 1024) {
      return res.status(413).json({
        error: 'Image too large. Please upload an image under 5MB.',
      });
    }

    /* ---------- User Check ---------- */
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    /* ---------- Upload to Cloudinary ---------- */
    const uploadResult = await cloudinary.uploader.upload(imageBase64, {
      folder: 'medtriage-ai', // ✅ NO SPACES
      overwrite: true,
      transformation: [
        { width: 512, height: 512, crop: 'fill', gravity: 'auto' },
      ],
    });

    if (!uploadResult?.secure_url) {
      throw new Error('Cloudinary upload failed (no secure_url)');
    }

    /* ---------- Save ---------- */
    user.profileImageUrl = uploadResult.secure_url;
    await user.save();

    console.log(`[Profile] Updated avatar for user ${userId}`);

    return res.json({
      message: 'Avatar uploaded successfully',
      url: uploadResult.secure_url,
      user,
    });

  } catch (err) {
    console.error('Profile Avatar Upload Error:', err);
    return res.status(500).json({
      error: err.message || 'Internal Server Error',
    });
  }
});

export default router;
