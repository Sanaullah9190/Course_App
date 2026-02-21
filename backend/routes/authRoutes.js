import express from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/admin.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'; // 1. Dotenv import karein

dotenv.config(); // 2. Config load karein

const router = express.Router();

// 1. REGISTER (Wahi purana logic)
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ email, password: hashedPassword });
        await newAdmin.save();
        res.status(201).json({ success: true, message: "Admin Registered Succesful!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Registration failed" });
    }
});

// 2. LOGIN (OTP bhejne wala)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) return res.status(404).json({ success: false, message: "Admin not found!" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid Email and Password!" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        admin.otp = otp;
        admin.otpExpires = Date.now() + 10 * 60 * 1000;
        await admin.save();

        // 3. Ab yahan password code mein nahi hai, .env se aa raha hai
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            auth: {
                user: process.env.EMAIL_USER, // .env file se uthayega
                pass: process.env.EMAIL_PASS  // .env file se uthayega
            },
            port: 465,
            secure: true,
            requireTLS: true
        });

        


        const mailOptions = {
            from: `"Campus Circuit " <${process.env.EMAIL_USER}>`,
            to: admin.email,
            subject: 'Login Verification OTP',
            text: `Dear User,Thank you for choosing Campus Circuit.Use the following One-Time Password (OTP) to complete your verification. This code is valid for the next 10 minutes. ${otp} If you did not request this code, please ignore this email or contact our support team.Best regards,Team Campus Circuit.`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "OTP Send to your Email!" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Login Error", error: error.message });
        console.log("new eroror ye h ",res, error);

    }
});

// 3. VERIFY OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin || admin.otp !== otp || admin.otpExpires < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid OTP!" });
        }

        admin.otp = null;
        admin.otpExpires = null;
        await admin.save();

        res.status(200).json({ success: true, message: "Success!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error!" });
    }
});

export default router;