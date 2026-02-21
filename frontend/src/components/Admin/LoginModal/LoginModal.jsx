import React, { useState } from 'react';
import axios from 'axios';
import './LoginModal.css';
import {BaseUrl} from '../../../Constant.js'

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [step, setStep] = useState(1); // Step 1: Password, Step 2: OTP
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    // Phase 1: Email aur Password bhej kar OTP mangwana
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${BaseUrl}/api/auth/login`, { email, password });
            if (res.data.success) {
                alert("OTP Send to your Email!");
                setStep(2); // OTP screen par move karein
            }
        } catch (err) {
            alert(err.response?.data?.message || "Login fail! check Details.");
        } finally {
            setLoading(false);
        }
    };

    // Phase 2: OTP verify karke dashboard mein entry lena
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${BaseUrl}/api/auth/verify-otp`, { email, otp });
            if (res.data.success) {
                alert("Authentication Successful!");
                onLoginSuccess(); // App.jsx wala function jo admin panel kholega
                handleClose(); // Modal band aur reset
            }
        } catch (err) {
            alert(err.response?.data?.message || "Wrong OTP.");
        } finally {
            setLoading(false);
        }
    };

    // Modal band karte waqt sab reset karne ke liye
    const handleClose = () => {
        setStep(1);
        setEmail('');
        setPassword('');
        setOtp('');
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={handleClose}>&times;</button>
                
                {step === 1 ? (
                    <div className="auth-step">
                        <h2>Admin Login</h2>
                        <p> Enter Your registered email and password</p>
                        <form onSubmit={handleLoginSubmit}>
                            <input 
                                type="email" placeholder="Email Address" 
                                value={email} onChange={(e) => setEmail(e.target.value)} required 
                            />
                            <input 
                                type="password" placeholder="Password" 
                                value={password} onChange={(e) => setPassword(e.target.value)} required 
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? "Checking..." : "Get OTP"}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="auth-step">
                        <h2>OTP Verification</h2>
                        <p>OTP Send to your email: <b>{email}</b></p>
                        <form onSubmit={handleOtpSubmit}>
                            <input 
                                type="text" placeholder="6-Digit OTP" 
                                value={otp} onChange={(e) => setOtp(e.target.value)} 
                                required maxLength="6" 
                            />
                            <button type="submit" className="verify-btn" disabled={loading}>
                                {loading ? "Verifying..." : "Verify & Enter"}
                            </button>
                            <button type="button" className="back-link" onClick={() => setStep(1)}>
                                Edit Email/Password
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginModal;