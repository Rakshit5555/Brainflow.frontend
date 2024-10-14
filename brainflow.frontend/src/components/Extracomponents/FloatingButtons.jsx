import React from 'react';

const FloatingButtons = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <button
        onClick={() => alert('Text button clicked')}
        style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px', borderRadius: '5px' }}
      >
        Text
      </button>
      <button
        onClick={() => alert('Image upload button clicked')}
        style={{ backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '10px', borderRadius: '5px' }}
      >
        Image
      </button>
      <button
        onClick={() => alert('File upload button clicked')}
        style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '10px', borderRadius: '5px' }}
      >
        File
      </button>
    </div>
  );
};

export default FloatingButtons;
