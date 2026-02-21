import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UploadPdf.css';
import { BaseUrl } from '../../../Constant.js';

const UploadForm = () => {
    const [allOptions, setAllOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '', course: '', year: '', branch: '', subject: '', category: 'Notes'
    });
    const [fileBase64, setFileBase64] = useState("");

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await axios.get(`${BaseUrl}/api/structure/all`);
                setAllOptions(res.data);
            } catch (err) { console.error("Error loading options", err); }
        };
        fetchOptions();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => { setFileBase64(reader.result); };
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!fileBase64) return alert("Please select a PDF file!");
        setLoading(true);
        try {
            await axios.post(`${BaseUrl}/api/materials/upload`, { ...formData, fileData: fileBase64 });
            alert("🚀 File Uploaded Successfully!");
            // Sirf title aur file reset kar rahe hain, baki details rehne de sakte ho ya reset kar lo
            setFormData({ ...formData, title: '' });
            setFileBase64("");
        } catch (err) { alert("❌ Upload fail!"); }
        finally { setLoading(false); }
    };

    // --- SMART FILTER LOGIC START (Sirf ye add kiya hai) ---
    
    // 1. Unique Courses nikalne ke liye
    const getCourses = () => [...new Set(allOptions.map(item => item.course))];

    // 2. Selected Course ke basis par Branches filter karna
    const getFilteredBranches = () => {
        if (!formData.course) return [];
        const filtered = allOptions.filter(item => item.course === formData.course);
        return [...new Set(filtered.map(item => item.branch))];
    };

    // 3. Selected Course aur Branch ke basis par Years filter karna
    const getFilteredYears = () => {
        if (!formData.course || !formData.branch) return [];
        const filtered = allOptions.filter(item => 
            item.course === formData.course && item.branch === formData.branch
        );
        return [...new Set(filtered.map(item => item.year))];
    };

    // 4. Sab kuch select hone par sirf relevant Subjects dikhana
    const getFilteredSubjects = () => {
        if (!formData.course || !formData.branch || !formData.year) return [];
        const filtered = allOptions.filter(item => 
            item.course === formData.course && 
            item.branch === formData.branch && 
            item.year === formData.year
        );
        return [...new Set(filtered.map(item => item.subject))];
    };
    // --- SMART FILTER LOGIC END ---

    return (
        <div className="edu-form-wrapper">
            <div className="edu-form-card">
                <div className="edu-form-header">
                    <h3>Upload Study Material</h3>
                    <p>Select the PDF and upload your notes and PYQs.</p>
                </div>

                <form onSubmit={handleUpload} className="edu-main-form">
                    <div className="edu-input-group full-width">
                        <label>Document Title</label>
                        <input type="text" placeholder="e.g. Unit 1 - Introduction" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                    </div>

                    <div className="edu-input-row">
                        <div className="edu-input-group">
                            <label>Course</label>
                            <select 
                                value={formData.course} 
                                onChange={(e) => setFormData({...formData, course: e.target.value, branch: '', year: '', subject: ''})} 
                                required
                            >
                                <option value="">Select Course</option>
                                {getCourses().map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="edu-input-group">
                            <label>Branch</label>
                            <select 
                                value={formData.branch} 
                                onChange={(e) => setFormData({...formData, branch: e.target.value, year: '', subject: ''})} 
                                disabled={!formData.course}
                                required
                            >
                                <option value="">Select Branch</option>
                                {getFilteredBranches().map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="edu-input-row">
                        <div className="edu-input-group">
                            <label>Year</label>
                            <select 
                                value={formData.year} 
                                onChange={(e) => setFormData({...formData, year: e.target.value, subject: ''})} 
                                disabled={!formData.branch}
                                required
                            >
                                <option value="">Select Year</option>
                                {getFilteredYears().map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <div className="edu-input-group">
                            <label>Subject</label>
                            <select 
                                value={formData.subject} 
                                onChange={(e) => setFormData({...formData, subject: e.target.value})} 
                                disabled={!formData.year}
                                required
                            >
                                <option value="">Select Subject</option>
                                {getFilteredSubjects().map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="edu-input-row">
                        <div className="edu-input-group">
                            <label>Category</label>
                            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                                <option value="Notes">Notes</option>
                                <option value="PYP">Previous Year Paper</option>
                            </select>
                        </div>
                        <div className="edu-input-group">
                            <label>Select PDF</label>
                            <input type="file" accept=".pdf" onChange={handleFileChange} required />
                        </div>
                    </div>

                    <button type="submit" className="edu-primary-btn" disabled={loading}>
                        {loading ? "Uploading to Cloud..." : "🚀 Finalize Upload"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadForm;