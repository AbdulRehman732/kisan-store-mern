import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // Connect to backend
    const newSocket = io('http://localhost:5000', {
      withCredentials: true
    });

    setSocket(newSocket);

    // Identify user to server
    if (user && user._id) {
      newSocket.emit('join', user._id);
    }

    // Cleanup on unmount
    return () => newSocket.close();
  }, [user]);

  // Global listeners (e.g. for toasts)
  useEffect(() => {
    if (!socket) return;

    socket.on('new_order', (data) => {
      console.log('[SOCKET] New Institutional Procurement:', data);
      // You could trigger a global toast here if a Toast Library was present
    });

    socket.on('order_update', (data) => {
      console.log('[SOCKET] Procurement Update:', data);
      alert(`Procurement Update: ${data.message}`);
    });

    socket.on('payment_update', (data) => {
      console.log('[SOCKET] Settlement recorded:', data);
      alert(`Settlement Alert: ${data.message}`);
    });

    return () => {
      socket.off('new_order');
      socket.off('order_update');
      socket.off('payment_update');
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
