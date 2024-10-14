import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import MindMapCanvas2 from './components/MindMapCanvas2';
import MindMapCanvas from './components/MindMapCanvas';
import NotesSection from './components/NotesSection';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar'; // Import Navbar
import './App.css';

const Collaborate = () => {
  const query = new URLSearchParams(window.location.search);
  const roomId = query.get('roomId');
  const userName = query.get('userName');

  const handleLogout = () => {
    // Handle the logout logic
    window.location.href = '/'; // Redirect to login
  };

  return (
    <div className="app-container">
      <Navbar userName={userName} roomId={roomId} onLogout={handleLogout} />
      <div className="main-content">
        {/* <MindMapCanvas2 roomId={roomId} userName={userName} /> */}
        <MindMapCanvas roomId={roomId} userName={userName}/>
        {/* <NotesSection roomId={roomId} userName={userName}/> */}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/collaborate" element={<Collaborate />} />
      </Routes>
    </Router>
  );
};

export default App;
