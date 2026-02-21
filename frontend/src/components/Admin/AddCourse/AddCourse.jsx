import React, { useState } from 'react';
import axios from 'axios';
import './AddCourse.css';
import {BaseUrl} from '../../../Constant.js'

const StructureForm = () => {
    const [structure, setStructure] = useState({
        course: '',
        year: '',
        branch: '',
        subject: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setStructure({ ...structure, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${BaseUrl}/api/structure/add`, structure);
            alert("✅ " + response.data.message);
            setStructure({ course: '', year: '', branch: '', subject: '' });
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert("⚠️ " + error.response.data.message);
            } else {
                alert("❌ Connection Error: Backend check .");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edu-structure-wrapper">
            <div className="edu-card">
                <div className="edu-card-header">
                    <h3>Add Academic Structure</h3>
                    <p>New Course Add Dropdown.</p>
                </div>

                <form onSubmit={handleSubmit} className="edu-form-layout">
                    <div className="edu-form-row">
                        <div className="edu-input-group">
                            <label>Course Name</label>
                            <input 
                                type="text" name="course" placeholder="e.g. B.Tech" 
                                value={structure.course} onChange={handleChange} required 
                            />
                        </div>
                        <div className="edu-input-group">
                            <label>Academic Year</label>
                            <input 
                                type="text" name="year" placeholder="e.g. 3rd Year" 
                                value={structure.year} onChange={handleChange} required 
                            />
                        </div>
                    </div>

                    <div className="edu-form-row">
                        <div className="edu-input-group">
                            <label>Branch</label>
                            <input 
                                type="text" name="branch" placeholder="e.g. Civil Engineering" 
                                value={structure.branch} onChange={handleChange} required 
                            />
                        </div>
                        <div className="edu-input-group">
                            <label>Subject</label>
                            <input 
                                type="text" name="subject" placeholder="e.g. Hydrology" 
                                value={structure.subject} onChange={handleChange} required 
                            />
                        </div>
                    </div>

                    <button type="submit" className="edu-submit-btn" disabled={loading}>
                        {loading ? "Adding..." : "Add to System"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StructureForm;