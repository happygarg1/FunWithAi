import express from 'express';
import { generateResume } from '../controllers/resumeController.js';

const resumeRouter = express.Router();
resumeRouter.post('/generate', generateResume);

export default resumeRouter;
