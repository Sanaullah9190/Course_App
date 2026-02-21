import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import Material from '../models/Material.js';

dotenv.config();

const router = express.Router();

router.post('/upload', async (req, res) => {
    try {
        const { title, course, year, branch, subject, category, fileData } = req.body;

        // 1. Cloudinary Upload
        const uploadResponse = await cloudinary.uploader.upload(fileData, {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            resource_type: "auto",
            folder: "university_portal"
        });

        // 2. Database Save
        const newMaterial = new Material({
            title, 
            course, 
            year, 
            branch, 
            subject, 
            category,
            fileUrl: uploadResponse.secure_url,
            publicId: uploadResponse.public_id 
        });

        await newMaterial.save();
        res.status(200).json({ message: "🚀 Upload Successful!" });

    } catch (error) {
        console.error("Full Error Info:", error);
        res.status(500).json({ message: "Upload Error: " + error.message });
    }
});


// 1. NAYA ROUTE: Files  filter 
router.get('/fetch-manage', async (req, res) => {
    try {
        
        const { course, year, branch, subject } = req.query;

        // Ek empty object 
        let query = {};

        
        if (course) query.course = course;
        if (year) query.year = year;
        if (branch) query.branch = branch;
        if (subject) query.subject = subject;

        // Database mein filters ke hisaab se search karna
        const files = await Material.find(query);
        
        // Results wapas bhejna
        res.status(200).json(files);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ message: "Server error while fetching files" });
    }
});

// 2. DELETE ROUTE: File delete 
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const material = await Material.findById(id);
        
        if (!material) {
            return res.status(404).json({ message: "File not found!" });
        }

        // 1. Cloudinary se delete 
        if (material.publicId) {
            await cloudinary.uploader.destroy(material.publicId, {
                
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            });
        }

        // 2. Database se delete
        await Material.findByIdAndDelete(id);
        
        res.status(200).json({ message: "🗑️ Deleted Successfully!" });
    } catch (error) {
        console.error("Delete Route Error:", error);
        res.status(500).json({ message: "Delete Error: " + error.message });
    }
});


export default router;
