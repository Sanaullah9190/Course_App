import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// Import path check kar lena:
import '../Selection/SelectionPage.css'; 
import {BaseUrl} from '../../Constant.js'

const PDFList = () => {
    const { course, year, branch, subject } = useParams();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('categories'); 
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${BaseUrl}/api/materials/fetch-manage`, {
                    params: { course, year, branch, subject }
                });
                setMaterials(res.data);
            } catch (err) {
                console.error("PDF Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFiles();
    }, [course, year, branch, subject]);

    const handleCategorySelect = (cat) => {
        setSelectedCategory(cat);
        setView('files');
    };

    const filteredFiles = materials.filter(m => m.category === selectedCategory);

    return (
        <div className="main-home-container">
            <div className="portal-header">
                <div className="header-content">
                    <h1>Campus <span>Circuit</span> Portal</h1>
                    <p>Resources for <strong>{subject}</strong></p>
                </div>
            </div>

            <div className="content-body">
                {loading ? (
                    <div className="loader-container">
                        <div className="spinner"></div>
                        <p>Fetching Resources...</p>
                    </div>
                ) : (
                    <div className="selection-wrapper">
                        {view === 'categories' ? (
                            <div className="step-container">
                                <span className="step-tag">Step 4: Select Resource Type</span>
                                <h2 className="section-title">Available for <span>{subject}</span></h2>
                                <div className="card-grid">
                                    {/* Notes Card */}
                                    <div className="course-card" onClick={() => handleCategorySelect('Notes')}>
                                        <div className="card-icon">📚</div>
                                        <h3>Study Notes</h3>
                                        <div className="explore-tag">EXPLORE NOTES →</div>
                                    </div>
                                    
                                    {/* PYP Card - Icon Fixed to match others */}
                                    <div className="course-card" onClick={() => handleCategorySelect('PYP')}>
                                        <div className="card-icon">📄</div>
                                        <h3>Previous Papers</h3>
                                        <div className="explore-tag">EXPLORE PAPERS →</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="step-container">
                                <span className="step-tag">{selectedCategory} Section</span>
                                <h2 className="section-title">Available <span>PDFs</span></h2>
                                <div className="card-grid">
                                    {filteredFiles.length > 0 ? filteredFiles.map((file) => (
                                        <div key={file._id} className="course-card">
                                            {/* File cards icon consistency */}
                                            <div className="card-icon">📑</div>
                                            <h3>{file.title}</h3>
                                            <a href={file.fileUrl} target="_blank" rel="noreferrer" className="explore-tag" style={{textDecoration: 'none', display: 'inline-block'}}>
                                                VIEW PDF →
                                            </a>
                                        </div>
                                    )) : (
                                        <div className="no-data">No files found here.</div>
                                    )}
                                </div>
                                <button className="back-to-cat-btn" onClick={() => setView('categories')} style={{marginTop: '25px', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', border: '1px solid #ddd', background: 'white', color: '#64748b', fontWeight: '600'}}>
                                    ← Change Category
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PDFList;