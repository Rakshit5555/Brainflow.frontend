import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

export const useSignalR = (roomId, userName) => {
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    if (!roomId || !userName) return; // Avoid running until both are set

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5114/collabHub')
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection.start()
      .then(() => {
        console.log('Connected to backend');
        newConnection.invoke('JoinRoom', roomId, userName)
          .catch(err => console.error('Error joining room:', err));
      })
      .catch(err => console.error('Connection error:', err));

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, [roomId, userName]);

  return connection;
};
