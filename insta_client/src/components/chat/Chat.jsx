/* eslint-disable no-unused-vars */
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback, useContext } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import UserList from '../../components/chat/UserList';
import MessageList from '../../components/chat/MessageList';
import MessageInput from '../../components/chat/MessageInput';
const apiUrl = import.meta.env.VITE_API_URL;
import { SocketContext } from "../../context/socketContext"
import { InstaContext } from '../../context/InstaContext';
import UserProfile from './UserProfile';
document.title = "Instachat"



function Chat() {
    const { socket, emitMessage, setUnreadMsgCount, unreadUsers, setUnreadUsers } = useContext(SocketContext)
    const [loading, setLoading] = useState(false);
    // when messageComponentLoads setMessage count to 0
    useEffect(() => {
        setUnreadMsgCount(0);
    }, [])

    // mark users unread




    const navigate = useNavigate();
    const { user_params } = useParams();
    const { user } = useContext(InstaContext);
    const user_id = user.user_id;

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const onStartTyping = () => {
        console.log("You started typing!");
        socket.emit("start_typing", {
            from: user_id,
            to: selectedUser.user_id
        })
    };

    const onStopTyping = () => {
        console.log("You stopped typing!");
        socket.emit("stop_typing", {
            from: user_id,
            to: selectedUser.user_id
        })
    };


    // handle url parameter
    const handleUrlParam = async (loadedUser) => {
        if (user_params && !isNaN(user_params)) {
            const selectedUserId = Number(user_params);
            console.log("serching in users");
            const userToSelect = loadedUser.find(user => user.user_id === selectedUserId);
            if (userToSelect) {
                handleUserSelect(userToSelect);
            } else {
                console.log("User not found for ID:", selectedUserId);
            }
        }
    }

    // Load messages
    const loadConversation = async (selectedUserId) => {
        const instabook_token = localStorage.getItem("instabook_token");
        try {
            const response = await axios.get(`${apiUrl}/messages/conversation?sender=${selectedUserId}&receiver=${user_id}`, { headers: { instabook_token } });
            setMessages(response.data.data || []);
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch messages');
        }
    }

    // Refresh messages
    const reloadMessages = (userId) => {
        loadConversation(userId);
    };

    // Send message
    const handleSendMessage = () => {
        if (!message || !selectedUser) return;

        const msg_obj = { text: message, sender_id: user_id, receiver_id: selectedUser.user_id };
        emitMessage(msg_obj);

        setMessages(prev => [...prev, msg_obj]);
        setTimeout(() => {
            reloadMessages(selectedUser.user_id);
        }, 2000);
        setMessage('');
    };

    // Handle user selection
    const handleUserSelect = (user) => {
        setSelectedUser(user);
        navigate(`/messages/${user.user_id}`);
        loadConversation(user.user_id);

        // Set unread to false for the selected user
        setUsers(prevUsers =>
            prevUsers.map(prevUser =>
                prevUser.user_id === user.user_id
                    ? { ...prevUser, unread: false }
                    : prevUser
            )
        );
    };



    // Listen for new messages
    useEffect(() => {

        if (!socket) return
        {        // send the user online info
            // socket.emit("online", user_id);

            // socket.on("userOnline", (user_id) => {        // listen other users online status and update state
            //     setUsers(prevUsers =>
            //         prevUsers.map(user =>
            //             user.user_id === user_id ? { ...user, online: true } : user
            //         )
            //     )
            // })

            // socket.on("userOffline", (user_id) => {        // listen other users offline status and update state
            //     setUsers(prevUsers =>
            //         prevUsers.map(user =>
            //             user.user_id === user_id ? { ...user, online: false } : user
            //         )
            //     )
            // })

            // recieve messages //   io.emit(`message_${receiver_id}`, { sender_id, receiver_id, text });
        }
        socket.on(`message_${user_id}`, msg => {
            console.log(":: MessageRecived from server ::");
            if (msg.sender_id === selectedUser?.user_id) {
                setMessages(prev => [...prev, msg]);
            } else {
                // adding unread propery to true
                console.log("msg.sender_id : " + msg.sender_id + ", receiver : " + msg.receiver_id);
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.user_id === msg.sender_id
                            ? { ...user, unread: true }
                            : user
                    )
                );
            }
        });

        // TODO: Typing indicator
        {        // socket.on(`startedTyping${user_id}`, ({ from, to }) => {
            //     console.log(from + " is typing for you");
            //     setUsers(prevUsers =>
            //         prevUsers.map(prevUser =>
            //             prevUser.user_id == from
            //                 ? { ...prevUser, typing: true }
            //                 : { ...prevUser, typing: false }
            //         )
            //     );
            // })

            // socket.on(`stopedTyping${user_id}`, ({ from, to }) => {
            //     console.log(from + " is stoped typing for you");
            //     setUsers(prevUsers =>
            //         prevUsers.map(prevUser =>
            //             prevUser.user_id == from
            //                 ? { ...prevUser, typing: false }
            //                 : { ...prevUser, typing: false }
            //         )
            //     );
            // })
            // return () => socket.off(`message_${user_id}`);
        }
    }, [selectedUser]);



    // Fetch users
    useEffect(() => {
        setLoading(true)
        const fetchUsers = async () => {
            const instabook_token = localStorage.getItem("instabook_token")
            try {
                const response = await axios.get(`${apiUrl}/messages/users?user_id=${user.user_id}`, { headers: { instabook_token } });
                setUsers(response.data.users.map(obj => ({ ...obj, unread: false })) || [])
                handleUrlParam(response.data.users.map(obj => ({ ...obj, unread: false })) || []);
                console.log("Loaded user for chat.");
                // console.table(response.data.users.map(obj => ({ ...obj, unread: false })));
            } catch {
                toast.error('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);





    if (loading) return (
        <div className='w-full flex justify-center items-center py-6'>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
    )





    return (
        <div className="w-full flex flex-col md:flex-row bg-gray-900 text-white">
            <UserList users={users} user_id={user_id} onSelect={handleUserSelect} selectedUser={selectedUser} />
            <div style={{ height: 'calc(100vh - 70px)' }} className="flex-1 flex flex-col">
                {selectedUser ? (
                    <>
                        <UserProfile user={selectedUser} onBack={() => {
                            navigate("/messages");
                            setSelectedUser(null)
                        }} />

                        <MessageList messages={messages} selectedUser={selectedUser} reloadMessages={reloadMessages} setMessages={setMessages} user_id={user_id} />
                        <MessageInput
                            onStartTyping={onStartTyping}
                            onStopTyping={onStopTyping}
                            message={message}
                            setMessage={setMessage}
                            onSendMessage={handleSendMessage}
                        />
                    </>
                ) : (
                    <div className='hidden md:flex justify-center items-center flex-col p-10'>
                        <div className="flex gap-4 items-center">
                            <div className="text-white p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full gragient mt-8">
                                <svg fill='white' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
                                    <path d="M 25 2 C 12.347656 2 2 11.597656 2 23.5 C 2 30.007813 5.132813 35.785156 10 39.71875 L 10 48.65625 L 11.46875 47.875 L 18.6875 44.125 C 20.703125 44.664063 22.800781 45 25 45 C 37.652344 45 48 35.402344 48 23.5 C 48 11.597656 37.652344 2 25 2 Z M 25 4 C 36.644531 4 46 12.757813 46 23.5 C 46 34.242188 36.644531 43 25 43 C 22.835938 43 20.742188 42.6875 18.78125 42.125 L 18.40625 42.03125 L 18.0625 42.21875 L 12 45.375 L 12 38.8125 L 11.625 38.53125 C 6.960938 34.941406 4 29.539063 4 23.5 C 4 12.757813 13.355469 4 25 4 Z M 22.71875 17.71875 L 10.6875 30.46875 L 21.5 24.40625 L 27.28125 30.59375 L 39.15625 17.71875 L 28.625 23.625 Z"></path>
                                </svg>
                            </div>
                            <h1 className='gradient-text insta_font font-extrabold text-4xl font-serif'>instaChat</h1>
                        </div>

                        <h3 className="text-3xl font-semibold font-serif text-white">Select a chat to get started</h3>
                    </div>
                )}
                <Toaster position="top-center" />
            </div>
        </div>
    );
}

export default Chat;
