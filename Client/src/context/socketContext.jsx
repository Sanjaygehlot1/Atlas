import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext'; // Your existing AuthContext
import { App } from 'antd';
import getUserClass from '../Helper/getClass';

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();
    const { notification } = App.useApp(); // Ant Design notification hook

    useEffect(() => {
        if (user && user.class) {
            // Connect to the server and store the socket instance
            const newSocket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000');
            setSocket(newSocket);

            const className = getUserClass(user);

            // Join the room for the student's class
            newSocket.emit('join_class_room', 'TE IT 1');

            console.log(newSocket)

            // Listen for lecture update events from the server
            newSocket.on('lecture_update', (data) => {
                console.log('Received lecture update:', data);
                notification.info({
                    message: 'Timetable Update',
                    description: data.message,
                    placement: 'topRight',
                });
                // Here, you would typically use a state management library (like Redux or Zustand)
                // to update the timetable data globally so the dashboard re-renders.
            });

            // Disconnect when the component unmounts or user logs out
            return () => newSocket.disconnect();
        }
    }, [user, notification]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};