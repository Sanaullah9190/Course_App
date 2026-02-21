import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Student Portal Files
import MainHome from './components/Home/MainHome.jsx';
import SelectionPage from './components/Selection/SelectionPage.jsx';
import SubjectGrid from './components/Subjects/SubjectGrid.jsx';
import PDFList from './components/Display/PDFList.jsx';

// Admin Files
import AdminDashboard from './components/Admin/AdminDashboard/AdminDashboard';
import AddCourse from './components/Admin/AddCourse/AddCourse';
import UploadPdf from './components/Admin/UploadPdf/UploadPdf';
import DeletePdf from './components/Admin/DeletePdf/DeletePdf';
import LoginModal from './components/Admin/LoginModal/LoginModal';

const AppContent = () => {
  // Check if admin was already logged in 
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    localStorage.getItem('isAdmin') === 'true'
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    localStorage.setItem('isAdmin', 'true'); // Browser mein save 
    setIsAdminAuthenticated(true);
    setIsModalOpen(false);
    navigate('/admin'); 
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin'); // Token delete
    setIsAdminAuthenticated(false);
    navigate('/'); 
  };



  return (
    <div className="App">
      <LoginModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />

      <Routes>
        {/* --- STUDENT ROUTES --- */}
        <Route path="/" element={<MainHome onAdminClick={() => setIsModalOpen(true)} />} />
        <Route path="/select-details/:courseName" element={<SelectionPage />} />
        <Route path="/subjects/:course/:year/:branch" element={<SubjectGrid />} />
        <Route path="/display-pdf/:course/:year/:branch/:subject" element={<PDFList />} />

        {/* --- ADMIN ROUTES --- */}
        {/* Har admin page ko handleLogout pass kar rahe hain taaki button kaam kare */}
        <Route 
          path="/admin" 
          element={isAdminAuthenticated ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/admin/add-course" 
          element={isAdminAuthenticated ? <AddCourse onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/admin/upload" 
          element={isAdminAuthenticated ? <UploadPdf onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/admin/delete" 
          element={isAdminAuthenticated ? <DeletePdf onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;