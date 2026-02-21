import React, { useState } from 'react';
import StructureForm from '../AddCourse/AddCourse';
import UploadForm from '../UploadPdf/UploadPdf';
import FileManager from '../DeletePdf/DeletePdf';
import './AdminDashboard.css';


const AdminDashboard = ({ onLogout }) => { // App.jsx se logout function yahan aayega
    const [activeTab, setActiveTab] = useState('structure');

    return (
        <div className="admin-layout">
            {/* 1. Sidebar - Fixed Sidebar with original styling */}
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <div className="brand-logo">CCP</div>
                    <div className="brand-info">
                        <h3>👤 Admin</h3>
                        <p>Campus Circuit Portal</p>
                    </div>
                </div>
                
                <nav className="sidebar-nav">
                    <button 
                        className={activeTab === 'structure' ? 'nav-item active' : 'nav-item'} 
                        onClick={() => setActiveTab('structure')}
                    >
                        <span className="icon">⚙️</span> Structure Manager
                    </button>
                    <button 
                        className={activeTab === 'upload' ? 'nav-item active' : 'nav-item'} 
                        onClick={() => setActiveTab('upload')}
                    >
                        <span className="icon">📤</span> Upload Notes
                    </button>
                    <button 
                        className={activeTab === 'manage' ? 'nav-item active' : 'nav-item'} 
                        onClick={() => setActiveTab('manage')}
                    >
                        <span className="icon">🗑️</span> Delete Manager
                    </button>

                    {/* Naya Logout Button Sidebar ke andar */}
                    <button className="nav-item logout-btn" onClick={onLogout}>
                        <span className="icon">👤</span> Logout
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <span>Logged in as Admin</span>
                </div>
            </aside>

            {/* 2. Main Content - Takes remaining 100% width */}
            <main className="admin-main">
                <header className="main-header">
                    <h2 className="header-title">
                        {activeTab === 'structure' && 'Academic Categories'}
                        {activeTab === 'upload' && 'Upload Material'}
                        {activeTab === 'manage' && 'File Management'}
                    </h2>
                    <div className="admin-profile">
                        <span className="user-name">Campus Circuit</span>
                        <div className="avatar">CCP</div>
                    </div>
                </header>

                <div className="content-container">
                    <div className="centered-content">
                        {activeTab === 'structure' && <StructureForm />}
                        {activeTab === 'upload' && <UploadForm />}
                        {activeTab === 'manage' && <FileManager />}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;