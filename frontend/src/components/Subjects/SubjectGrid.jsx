import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SubjectGrid.css';
import {BaseUrl} from '../../Constant.js'

const SubjectGrid = () => {
    const { course, year, branch } = useParams();
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${BaseUrl}/api/structure/all`);
                // Filter logic same as before
                const filtered = res.data
                    .filter(item => item.course === course && item.year === year && item.branch === branch)
                    .map(item => item.subject);
                
                setSubjects([...new Set(filtered)]);
            } catch (err) {
                console.error("Subject fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, [course, year, branch]);

    return (
        <div className="main-home-container">
            {/* Wahi Premium Hero Section jo aapne select kiya tha */}
            <div className="portal-header">
                <div className="header-content">
                    <h1>Campus <span>Circuit</span> Portal</h1>
                    <p>{course} • {year} • {branch}</p>
                </div>
            </div>

            <div className="content-body">
                {/* No Back Button here anymore */}
                
                <div className="selection-wrapper">
                    <span className="step-tag">Step 3: Choose Subject</span>
                    <h2 className="section-title">Select Your <span>Subject</span></h2>

                    {loading ? (
                        <div className="loader-container">
                            <div className="spinner"></div>
                            <p>Loading subjects...</p>
                        </div>
                    ) : (
                        <div className="card-grid">
                            {subjects.length > 0 ? subjects.map((sub, index) => (
                                <div 
                                    key={index} 
                                    className="course-card"
                                    onClick={() => navigate(`/display-pdf/${course}/${year}/${branch}/${sub}`)}
                                >
                                    <div className="card-icon">📘</div>
                                    <h3>{sub}</h3>
                                    <div className="explore-tag">VIEW MATERIALS →</div>
                                </div>
                            )) : (
                                <div className="no-data">No course Add.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubjectGrid;