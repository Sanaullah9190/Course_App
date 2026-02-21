import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Axios import karein
import './MainHome.css';
import {BaseUrl} from '../../Constant.js'

const MainHome = ({ onAdminClick }) => {
    const navigate = useNavigate();
    
    // Pehle static list thi, ab hum empty state rakhenge
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Database se courses fetch karne ka logic
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Aapke backend ka fetch route (check karein ye route backend mein hai ya nahi)
                const response = await axios.get(`${BaseUrl}/api/structure/courses`);
                setCourses(response.data); // Database se aayi list yahan set hogi
            } catch (error) {
                console.error("Error fetching courses:", error);
                // Agar error aaye toh fallback ke liye purana "B.Tech" dikha sakte hain
                setCourses(["B.Tech"]);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="main-home-container">
            <div className="portal-header">
                <button className="admin-login-btn" onClick={onAdminClick}>
                    Admin Login 👤
                </button>
                
                <div className="header-content">
                    <h1>Campus <span>Circuit</span> Portal</h1>
                    <p>Access high-quality study materials, notes, and previous year papers.</p>
                </div>
            </div>

            <div className="content-body">
                <h2 className="section-title">Select Your Course</h2>
                
                {loading ? (
                    <div className="loader">Loading Courses...</div>
                ) : (
                    <div className="course-grid">
                        {courses.length > 0 ? (
                            courses.map(course => (
                                <div key={course} className="course-card" onClick={() => navigate(`/select-details/${course}`)}>
                                    <div className="card-icon">🎓</div>
                                    <h3>{course}</h3>
                                    <p className="card-desc">Comprehensive Notes & PYQs</p>
                                    <div className="explore-tag">EXPLORE MATERIAL →</div>
                                </div>
                            ))
                        ) : (
                            <p style={{color:"black"}}>No courses found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainHome;