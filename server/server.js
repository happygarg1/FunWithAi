// /backend/index.js

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';

import aiRouter from './routes/aiRoutes.js';
import userRouter from './routes/userRoutes.js';
import resumeRouter from './routes/Resumeroutes.js'; // Corrected import path casing

const app = express();

await connectCloudinary();

// --- Middleware Setup ---
// Enable CORS for all origins
app.use(cors());
// Parse JSON bodies
app.use(express.json());

// --- Public Routes ---
// The resume router is placed before the auth middleware to make it public.
app.use('/api/resume', resumeRouter);

app.get('/', (req, res) => {
  res.send('Server is live!');
});

// --- Authentication Middleware ---
// All routes defined below this point will require authentication.
app.use(clerkMiddleware());
app.use(requireAuth());

// --- Protected Routes ---
app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});