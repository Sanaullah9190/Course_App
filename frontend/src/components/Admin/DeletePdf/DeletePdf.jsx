import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeletePdf.css';
import { BaseUrl } from '../../../Constant.js';

const FileManager = () => {
    const [allOptions, setAllOptions] = useState([]);
    const [filters, setFilters] = useState({ course: '', year: '', branch: '', subject: '' });
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1. Dropdown options load karna
    const fetchOptions = async () => {
        try {
            const res = await axios.get(`${BaseUrl}/api/structure/all`);
            setAllOptions(res.data);
        } catch (err) {
            console.error("Options load Failed", err);
        }
    };

    useEffect(() => {
        fetchOptions();
    }, []);

    // --- SMART FILTER LOGIC ---
    const getCourses = () => [...new Set(allOptions.map(item => item.course))];
    
    const getFilteredBranches = () => {
        if (!filters.course) return [];
        const filtered = allOptions.filter(item => item.course === filters.course);
        return [...new Set(filtered.map(item => item.branch))];
    };

    const getFilteredYears = () => {
        if (!filters.course || !filters.branch) return [];
        const filtered = allOptions.filter(item => 
            item.course === filters.course && item.branch === filters.branch
        );
        return [...new Set(filtered.map(item => item.year))];
    };

    const getFilteredSubjects = () => {
        if (!filters.course || !filters.branch || !filters.year) return [];
        const filtered = allOptions.filter(item => 
            item.course === filters.course && 
            item.branch === filters.branch && 
            item.year === filters.year
        );
        return [...new Set(filtered.map(item => item.subject))];
    };

    // 2. Search PDF
    const handleSearch = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BaseUrl}/api/materials/fetch-manage`, { params: filters });
            setMaterials(res.data);
        } catch (err) {
            alert("❌ Search failed!");
        } finally {
            setLoading(false);
        }
    };

    // 3. Delete PDF File
    const handleDelete = async (id) => {
        if (window.confirm("❌ Do you really want to delete this file?")) {
            try {
                const res = await axios.delete(`${BaseUrl}/api/materials/delete/${id}`);
                if (res.status === 200) {
                    setMaterials(materials.filter(item => item._id !== id));
                    alert("🗑️ File Deleted!");
                }
            } catch (err) {
                alert("❌ Delete failed.");
            }
        }
    };

    // 4. DELETE STRUCTURE
    const handleDeleteStructure = async () => {
        if (!filters.course || !filters.branch || !filters.year || !filters.subject) {
            return alert("⚠️ Please select all fields to delete structure!");
        }
        if (window.confirm("❗ WARNING: Delete this specific academic structure?")) {
            try {
                await axios.post(`${BaseUrl}/api/structure/delete-specific`, filters);
                alert("🗑️ Academic Structure Deleted!");
                fetchOptions();
                setFilters({ course: '', year: '', branch: '', subject: '' });
            } catch (err) {
                alert("❌ Structure Delete failed!");
            }
        }
    };

    return (
        <div className="edu-form-wrapper">
            <div className="edu-form-card full-width-card">
                <div className="edu-form-header">
                    <h3> Course Management </h3>
                    <p>Filter by course to find files or manage academic structure.</p>
                </div>

                <div className="edu-filter-section">
                    {/* Row 1: Course & Year */}
                    <div className="edu-input-row">
                        <div className="edu-input-group">
                            <label>Course</label>
                            <select value={filters.course} onChange={(e) => setFilters({...filters, course: e.target.value, branch: '', year: '', subject: ''})}>
                                <option value="">Select Course</option>
                                {getCourses().map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="edu-input-group">
                            <label>Year</label>
                            <select value={filters.year} disabled={!filters.branch} onChange={(e) => setFilters({...filters, year: e.target.value, subject: ''})}>
                                <option value="">Select Year</option>
                                {getFilteredYears().map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Row 2: Branch & Subject */}
                    <div className="edu-input-row">
                        <div className="edu-input-group">
                            <label>Branch</label>
                            <select value={filters.branch} disabled={!filters.course} onChange={(e) => setFilters({...filters, branch: e.target.value, year: '', subject: ''})}>
                                <option value="">Select Branch</option>
                                {getFilteredBranches().map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div className="edu-input-group">
                            <label>Subject</label>
                            <select value={filters.subject} disabled={!filters.year} onChange={(e) => setFilters({...filters, subject: e.target.value})}>
                                <option value="">Select Subject</option>
                                {getFilteredSubjects().map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="edu-action-buttons" style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                        <button className="edu-primary-btn search-btn" onClick={handleSearch} disabled={loading} style={{flex: 1}}>
                            {loading ? "Searching..." : "🔍 Search Files"}
                        </button>
                        <button className="edu-primary-btn delete-struct-btn" onClick={handleDeleteStructure} style={{backgroundColor: '#dc3545', flex: 1}}>
                            🗑️ Delete Structure
                        </button>
                    </div>
                </div>

                <div className="edu-table-wrapper">
                    <table className="edu-manager-table">
                        <thead>
                            <tr>
                                <th>File Title</th>
                                <th>Category</th>
                                <th style={{textAlign: 'center'}}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.map(item => (
                                <tr key={item._id}>
                                    <td className="file-title-td">{item.title}</td>
                                    <td><span className={`edu-tag ${item.category}`}>{item.category}</span></td>
                                    <td style={{textAlign: 'center'}}>
                                        <button className="edu-delete-x-btn" onClick={() => handleDelete(item._id)}>✕</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!loading && materials.length === 0 && (
                        <div className="no-results">No files found. Select options to search.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileManager;