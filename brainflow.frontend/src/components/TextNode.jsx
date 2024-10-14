import React, { useState, useEffect } from 'react';
import './TextNode.css';

const TextNode = ({ data, id, xPos, yPos, type, connection, roomId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.label);

  // Sync text with incoming data updates
  useEffect(() => {
    setText(data.label);
  }, [data.label]);

  const handleDoubleClick = () => setIsEditing(true);

  const handleBlur = () => {
    setIsEditing(false);
    // Send updated node data to the backend
    if (connection) {
      const updatedNode = { id, position: { x: xPos, y: yPos }, type, data: { label: text } };
      connection.invoke('SendNodeUpdate', roomId, updatedNode);
    }
  };

  const handleChange = (e) => setText(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      // Send node update on "Enter"
      if (connection) {
        const updatedNode = { id, position: { x: xPos, y: yPos }, type, data: { label: text } };
        connection.invoke('SendNodeUpdate', roomId, updatedNode);
      }
    }
  };

  return (
    <div className="text-node" onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <input
          type="text"
          className="text-input"
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span className="text-label">{text}</span>
      )}
    </div>
  );
};

export default TextNode;
