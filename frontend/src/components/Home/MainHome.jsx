import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './MainHome.css';
import {BaseUrl} from '../../Constant.js'
import Header from '../Header/Header.jsx';

const MainHome = ({ onAdminClick }) => {
    const navigate = useNavigate();
    
    // Pehle static list thi, ab hum empty state rakhenge
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Database se courses fetch karne ka logic
    useEffect(() => {
        const fetchCourses = async () => {
            try {
               
                const response = await axios.get(`${BaseUrl}/api/structure/courses`);
                setCourses(response.data); 
            } catch (error) {
                console.error("Error fetching courses:", error);
                
                setCourses(["B.Tech"]);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="main-home-container">
            <Header/>
            <div className='login-btn-container'>
                <button className="admin-login-btn" onClick={onAdminClick}>
                    Login 👤
                </button>
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