import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

// Routes Import
import authRoutes from './routes/authRoutes.js';
import structureRoutes from './routes/structureRoutes.js';
import materialRoutes from './routes/materialRoutes.js';

// 2. Middlewares
const corsOptions = {
    origin: 'https://course-app-frontend-7evw.onrender.com', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

dotenv.config();
const app = express();

// 1. Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});





// app.use(cors({
//   origin: "*"
// }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Routes Registration
app.use('/api/auth', authRoutes);
app.use('/api/structure', structureRoutes);
app.use('/api/materials', materialRoutes);

// 4. Database Connection & Server Startup (Best Practice)
const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("DB Connected ");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ DB Connection Error:", err);
        process.exit(1); 
    });