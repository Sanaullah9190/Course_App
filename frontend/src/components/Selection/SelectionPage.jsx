import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SelectionPage.css';
import {BaseUrl} from '../../Constant.js'

const SelectionPage = () => {
    const { courseName } = useParams();
    const navigate = useNavigate();
    
    const [step, setStep] = useState(1); 
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchYears = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${BaseUrl}/api/structure/all`);
                const filteredData = res.data.filter(item => item.course === courseName);
                const uniqueYears = [...new Set(filteredData.map(item => item.year))].sort();
                setYears(uniqueYears);
            } catch (err) {
                console.error("Year fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchYears();
    }, [courseName]);

    const handleYearSelect = async (year) => {
        setSelectedYear(year);
        try {
            const res = await axios.get('http://localhost:5000/api/structure/all');
            const filteredBranches = res.data
                .filter(item => item.course === courseName && item.year === year)
                .map(item => item.branch);
            
            setBranches([...new Set(filteredBranches)]);
            setStep(2); 
        } catch (err) {
            console.error("Branch fetch error:", err);
        }
    };

    const handleBranchSelect = (branch) => {
        navigate(`/subjects/${courseName}/${selectedYear}/${branch}`);
    };

    return (
        <div className="main-home-container">
            <div className="portal-header">
                <div className="header-content">
                    <h1>Campus <span>Circuit</span> Portal</h1>
                    <p>Select Academic Details for <strong>{courseName}</strong></p>
                </div>
            </div>

            <div className="content-body">
                {loading ? (
                    <div className="loader-container">
                        <div className="spinner"></div>
                        <p>Fetching database records...</p>
                    </div>
                ) : (
                    <div className="selection-wrapper">
                        {step === 1 ? (
                            <div className="step-container">
                                <span className="step-tag">Step 1: Choose Year</span>
                                <h2 className="section-title">Available Years</h2>
                                <div className="card-grid">
                                    {years.map(year => (
                                        <div key={year} className="course-card" onClick={() => handleYearSelect(year)}>
                                            <div className="card-icon">📅</div>
                                            <h3>{year}</h3>
                                            <div className="explore-tag">SELECT →</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="step-container">
                                <span className="step-tag">Step 2: Choose Branch</span>
                                <h2 className="section-title">Select Your Branch</h2>
                                <div className="card-grid">
                                    {branches.map(branch => (
                                        <div key={branch} className="course-card" onClick={() => handleBranchSelect(branch)}>
                                            <div className="card-icon">🏗️</div>
                                            <h3>{branch}</h3>
                                            <div className="explore-tag">EXPLORE →</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
export default SelectionPage;