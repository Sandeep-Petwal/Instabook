/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
const API_URL = import.meta.env.VITE_API_URL;

const SERVER_URL = import.meta.env.VITE_SERVER_URL

// import { useInstaContext } from './InstaContext';
import { InstaContext } from "../context/InstaContext"
const SocketContext = createContext();




export function SocketProvider({ children }) {
    const [notificationCount, setNotificationCount] = useState(0);
    const [refreshNotifications, setRefreshNotification] = useState(0);
    const { user, logout } = useContext(InstaContext);

    const [unreadMsgCount, setUnreadMsgCount] = useState(0);
    const [unreadUsers, setUnreadUsers] = useState([]);


    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const loadNotificationCount = async (user_id) => {
        try {
            const response = await axios.get(`${API_URL}/user/notification/unread/${user_id}`, {
                headers: { instabook_token: localStorage.getItem("instabook_token") }
            });
            // console.table(response.data.data);
            setNotificationCount(response.data.data.unreadCount)

        } catch (error) {   
            console.log("Error while getting notification count.")
            console.table(error.response.data)
        }
    }

    useEffect(() => {
        if (!user.isLoggedIn) return console.log("User is not logged in");
        const token = localStorage.getItem("instabook_token")
        if (!token) logout();
        loadNotificationCount(user.user_id);

        const socketInstance = io(SERVER_URL, {
            transports: ['websocket'],
            autoConnect: true,
            auth: { token } // for authorized connection
        });


        socketInstance.on('connect', () => {
            setIsConnected(true);
            console.clear();
            console.log('Connected to WS server');
        });

        socketInstance.on('disconnect', () => {
            setIsConnected(false);
            console.log('Disconnected from socket server');
        });

        socketInstance.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        setSocket(socketInstance);

        // Set up event listeners
        socketInstance.on(`notification-${user.user_id}`, (data) => {
            // console.log('New notification :', data);
            setNotificationCount(prev => prev + 1);
            setRefreshNotification(Date.now())
        });

        socketInstance.on(`message_${user.user_id}`, msg => {
            const isMessagesPath = window.location.pathname.includes('/messages');
            setUnreadUsers(prev => {
                return [...prev, msg.sender_id];
            });

            console.log("Setting notification ::")
            if (!isMessagesPath) setUnreadMsgCount(prev => prev + 1)
        });




        // clean on unmount
        return () => {
            if (socketInstance) {
                socketInstance.disconnect();
            }
        };
    }, [user.isLoggedIn]);

    // custom emit function 
    const emitEvent = (user_id, type, source_id, target_user) => {
        if (socket && isConnected) {

            // console.log("Sending event to server ::");
            // console.table({ user_id, type, source_id, target_user });

            socket.emit(type, { user_id, type, source_id, target_user });
        } else {
            console.warn('Socket is not connected');
        }
    };

    // custom emit function for sending messages
    const emitMessage = (msg_obj) => {          // {text, sender_id, receiver_id}
        if (socket && isConnected) {
            console.log("Sending Message to server ::");
            console.table(msg_obj);

            socket.emit("message", msg_obj);
        } else {
            console.warn('Socket is not connected');
        }

    }




    // custom emit function for socket
    const emitSupportMessage = (issue_id, message_obj) => {
        if (socket && isConnected) {

            console.log("Sending event to server ::");
            socket.emit(`support-${issue_id}`, message_obj);
        } else {
            console.warn('Socket is not connected');
        }
    };




    const value = { socket, unreadUsers, emitSupportMessage, setUnreadUsers, isConnected, emitEvent, emitMessage, notificationCount, setNotificationCount, refreshNotifications, setRefreshNotification, unreadMsgCount, setUnreadMsgCount };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}


export { SocketContext };
