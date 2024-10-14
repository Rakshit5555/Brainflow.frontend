import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRoomAction = () => {
    if (!roomId || !userName) {
      setError('Room ID and username are required.');
      return;
    }

    setSuccess('Room joined or created successfully!');
    navigate(`/collaborate?roomId=${roomId}&userName=${userName}`);
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <div className="quote">
          "Collaboration allows us to achieve more than we ever could alone."
        </div>
      </div>
      <div className="right-side">
        <h1>Start Contribution here</h1>
        <div className="login-fields">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <input
            type="text"
            placeholder="And what should people call you?"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <button className="login-button" onClick={handleRoomAction}>
          Create/Join Room
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
