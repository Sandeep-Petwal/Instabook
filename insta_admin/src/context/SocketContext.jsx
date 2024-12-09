/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useAdminContext } from '@/hooks/useAdminContext';
import { useEffect, useState, createContext } from 'react';
import io from 'socket.io-client';
const SocketContext = createContext();
const SERVER_URL = import.meta.env.VITE_SOCKET_URL



export function SocketContextProvider({ children }) {
    const { user } = useAdminContext();
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);


    useEffect(() => {
        if (!user.isLoggedIn) return console.log("User is not logged in");
        const token = localStorage.getItem("insta_admin")
        // if (!token) logout();
        const socketInstance = io(SERVER_URL, {
            transports: ['websocket'],
            autoConnect: true,
            auth: { token } // for authorized connection
        });


        socketInstance.on('connect', () => {
            setIsConnected(true);
            console.clear();
            console.log(`Connected to WS server (Admin_${user.user_id})`);
        });

        socketInstance.on('disconnect', () => {
            setIsConnected(false);
            console.log('Disconnected from socket server (Admin_' + user.user_id + ')');
        });

        socketInstance.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        setSocket(socketInstance);

        // clean on unmount
        return () => {
            if (socketInstance) {
                socketInstance.disconnect();
            }
        };
    }, [user.isLoggedIn]);

    // custom emit function for socket
    const emitSupportMessage = (issue_id, message_obj) => {
        if (socket && isConnected) {

            console.log("Sending event to server ::");
            socket.emit(`support-${issue_id}`, message_obj);
        } else {
            console.warn('Socket is not connected');
        }
    };



    const value = { socket, isConnected, emitSupportMessage };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}


export { SocketContext };
