import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app=express();

await connectCloudinary()

app.use(cors(
    
))
app.use(express.json());
app.use(clerkMiddleware())
// app.use((req, res, next) => {
//   console.log('\n===== INCOMING REQUEST =====')
//   console.log('Method:', req.method)
//   console.log('Path:', req.path)
//   console.log('Headers:', req.headers)
//   console.log('Auth:', req.auth?.())
//   next()
// })
app.get('/',(req,res)=>{
    res.send('server is live!')
})

app.use(requireAuth())
app.use('/api/ai',aiRouter);
app.use('/api/user',userRouter);

const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log('server is running on port',PORT);
    
})