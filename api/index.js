import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

/* --------------------------------------------------
   Load environment variables FIRST
-------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";

/* --------------------------------------------------
   App Init
-------------------------------------------------- */
const app = express();
const PORT = process.env.PORT || 5000;

/* --------------------------------------------------
   REQUIRED FOR VERCEL (DO NOT REMOVE)
-------------------------------------------------- */
app.set("trust proxy", 1);

/* --------------------------------------------------
   Middleware
-------------------------------------------------- */

// ✅ CORS – REQUIRED for auth on Vercel
app.use(
  cors({
    origin: true, // Allow all origins for now
    credentials: true,
  })
);

// ✅ SESSION – REQUIRED for login persistence
app.use(
  session({
    name: "metriage.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: true,     // HTTPS only (Vercel)
      sameSite: "none", // allow cross-site
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

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
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

/* --------------------------------------------------
   Routes
-------------------------------------------------- */
const authRoutes = (await import("../server/routes/auth.js")).default;
const triageRoutes = (await import("../server/routes/triage.js")).default;
const orderRoutes = (await import("../server/routes/orders.js")).default;
const userRoutes = (await import("../server/routes/user.js")).default;
const profileRoutes = (await import("../server/routes/profile.js")).default;
const feedbackRoutes = (await import("../server/routes/feedback.js")).default;

app.use("/api/auth", authRoutes);
app.use("/api/triage", triageRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/user", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/feedback", feedbackRoutes);

/* --------------------------------------------------
   Health Check
-------------------------------------------------- */
app.get("/", (req, res) => {
  res.send("Metriage AI API is running");
});

/* --------------------------------------------------
   Global Error Handler
-------------------------------------------------- */
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR 🔥", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Export for Vercel serverless
export default app;