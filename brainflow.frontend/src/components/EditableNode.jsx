import React, { useState, useEffect, useCallback } from 'react';
import { Handle } from 'reactflow';
import './EditableNode.css';

const EditableNode = ({ data, id, xPos, yPos, type, connection, roomId, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  // Sync label with incoming data updates
  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);

  // Handle double-click to start editing
  const handleDoubleClick = () => setIsEditing(true);

  // Handle input blur event (when focus leaves input)
  const handleBlur = () => {
    setIsEditing(false);
    if (connection) {
      const updatedNode = { id, position: { x: xPos, y: yPos }, type, data: { label } };
      connection.invoke('SendNodeUpdate', roomId, updatedNode);
    }
  };

  // Handle input change event
  const handleChange = (e) => setLabel(e.target.value);

  // Handle pressing Enter key to confirm the change
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (connection) {
        const updatedNode = { id, position: { x: xPos, y: yPos }, type, data: { label } };
        connection.invoke('SendNodeUpdate', roomId, updatedNode);
      }
    }
  };

  // Handle click for selection
  const handleClick = useCallback((event) => {
    event.stopPropagation(); // Ensure the event doesn't propagate to the canvas
  }, []);

  return (
    <div
      className="editable-node"
      onDoubleClick={handleDoubleClick}
      //onClick={handleClick}  // Ensure node click is registered
      style={{
        border: selected ? '2px solid blue' : '2px solid lightgray', // Visual feedback for selection
        padding: '10px',
        borderRadius: '5px',
        background: 'white',
        textAlign: 'center',
      }}
    >
      {isEditing ? (
        <input
          type="text"
          className="node-input"
          value={label}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span className="node-label">{label}</span>
      )}

      {/* Handles for connectors */}
      <Handle
        type="target"
        position="left"
        style={{ background: '#555' }}
      />
      <Handle
        type="source"
        position="right"
        style={{ background: '#555' }}
      />
    </div>
  );
};

export default EditableNode;
