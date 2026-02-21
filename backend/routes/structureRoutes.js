import express from 'express';
import Structure from '../models/sructure.js';

const router = express.Router();

// 1. ADD STRUCTURE: New Course/Year/Branch/Subject add 
router.post('/add', async (req, res) => {
    try {
        const { course, year, branch, subject } = req.body;

        // Validation: 
        const existingStructure = await Structure.findOne({ course, year, branch, subject });
        
        if (existingStructure) {
            // Agar pehle se hai, toh status 400 (Bad Request) ke saath message bhej do
            return res.status(400).json({ 
                success: false, 
                message: "Already Exists! This combination Allready Exits." 
            });
        }

        // Agar naya hai, toh save karo
        const newStructure = new Structure({ course, year, branch, subject });
        await newStructure.save();

        res.status(201).json({ 
            success: true, 
            message: "Success! Structure Added Successful." 
        });

    } catch (error) {
        console.error("Structure Add Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error: Structure Add failed." 
        });
    }
});

// 2. NEW ROUTE: For Unique Courses Show ke liye 
router.get('/courses', async (req, res) => {
    try {
        
        const courses = await Structure.distinct('course');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ success: false, message: "Courses fetch Error" });
    }
});

// 2. FETCH ALL
router.get('/all', async (req, res) => {
    try {
       
        const data = await Structure.find().sort({ course: 1, year: 1, branch: 1 });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Data fetch Error." 
        });
    }
});

// routes/structureRoutes.js mein niche add karein
router.post('/delete-specific', async (req, res) => {
    try {
        const { course, year, branch, subject } = req.body;
        const deleted = await Structure.findOneAndDelete({ course, year, branch, subject });
        if (deleted) {
            res.status(200).json({ success: true, message: "Deleted!" });
        } else {
            res.status(404).json({ success: false, message: "Not found!" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error" });
    }
});



export default router;