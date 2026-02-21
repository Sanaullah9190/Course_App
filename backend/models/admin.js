import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Ek email se ek hi admin
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String, // OTP temporary save karne ke liye
        default: null
    },
    otpExpires: {
        type: Date, // OTP kab expire hoga uske liye
        default: null
    }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;