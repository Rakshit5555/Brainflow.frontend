import React from 'react';
import './Navbar.css';

const Navbar = ({ userName, roomId, onLogout }) => {
  return (
    <div className="navbar">
      <div className="navbar-brand">Collaborate</div>
      <div className="navbar-info">
        <span className="navbar-user">👤 {userName}</span>
        <span className="navbar-room">🛖 Room Id: {roomId}</span>
      </div>
      <button className="navbar-logout" onClick={onLogout}>Leave Room</button>
    </div>
  );
};

export default Navbar;
