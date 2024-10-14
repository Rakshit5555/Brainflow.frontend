import React, { useState, useEffect } from 'react';
import { useSignalR } from '../hooks/useSignalR';
import './NotesSection.css'

const NotesSection = ({ roomId, userName }) => {
  const connection = useSignalR(roomId, userName);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (newNote.trim()) {
      connection.invoke('SendNoteUpdate', roomId, newNote);
      setNewNote('');
    }
  };

  const handleNoteChange = (e) => {
    setNewNote(e.target.value);
  };

  useEffect(() => {
    if (connection) {
      connection.on('ReceiveAllNotes', (notes) => setNotes(notes));
      connection.on('ReceiveNoteUpdate', (notes) => setNotes(notes));
    }
  }, [connection]);

  return (
    <div className="notes-section">
              <ul>
        {notes.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
      <textarea
        value={newNote}
        onChange={handleNoteChange}
        placeholder="Add a new note"
      />
      <button onClick={handleAddNote}>Add Note</button>

    </div>
  );
};

export default NotesSection;
