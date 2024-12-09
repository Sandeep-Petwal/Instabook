/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useContext } from 'react';
import axiosInstance from '../api/axios';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, set } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminContext } from '@/hooks/useAdminContext';
import { Image, Send, Check, Loader2, X, Download, Info, CheckCircle, Camera } from 'lucide-react';
import { SocketContext } from '@/context/SocketContext';

const Chat = ({ issue, issue_id, user_id, onClose, user }) => {
    const { socket, isConnected, emitSupportMessage } = useContext(SocketContext)
    const { admin_user_id } = useAdminContext();

    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(20);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const observerRef = useRef(null);

    const fileInputRef = useRef(null);
    const scrollAreaRef = useRef(null);

    // Function to scroll to bottom
    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const scrollViewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollViewport) {
                scrollViewport.scrollTop = scrollViewport.scrollHeight;
            }
        }
    };

    // Example: Scroll to bottom when conversations change
    useEffect(() => {
        scrollToBottom();
    }, [conversations]); // Trigger when conversations update


    const loadConversations = async (page) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/support/conversation/${issue_id}?page=${page}&limit=${limit}`);
            let { conversations: newConversations, totalPages: total, currentPage } = response.data.data;

            newConversations.reverse();
            if (page === 1) {
                setConversations(newConversations);
            } else {
                setConversations(prev => [...newConversations, ...prev]);
            }
            setTotalPages(total);
            setCurrentPage(currentPage);
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadConversations(1);
    }, [issue_id]);



    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                alert('Image size should be less than 1MB');
            } else if (!file.type.startsWith('image/')) {
                alert('Plese select an image');
            } else {
                setImage(file);
                setPreviewUrl(URL.createObjectURL(file));
            }
        } else {
            alert('Please select a file');
        }
    };



    // listing for new messages
    useEffect(() => {
        if (socket && isConnected && issue_id.state != 'Resolved') {
            socket.on(`support-${issue_id}`, (data) => {
                setConversations(prev => [...prev, data]);
            });
        }


        console.log("Issue already resolved");
        return () => {
            if (socket) {
                socket.off(`support-${issue_id}`);
            }
        };
    }, [socket, isConnected, issue_id]);

    const handleSend = async () => {
        if ((!message && !image) || sendingMessage) return;

        setSendingMessage(true);
        const formData = new FormData();
        formData.append('issue_id', issue_id);
        formData.append('sender_id', admin_user_id);
        formData.append('receiver_id', user.user_id);

        if (message) formData.append('text', message);
        if (image) formData.append('conversation_image', image);

        try {
            const response = await axiosInstance.post('/support/add-message', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // sending socket message
            emitSupportMessage(issue_id, response.data.data);
            // setConversations(prev => [...prev, response.data.data]); // TODO: Not adding send message to conversation becaouse it will be added by socket
            setMessage('');
            setImage(null);
            setPreviewUrl('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSendingMessage(false);
        }
    };

    const MessageBubble = React.useCallback(({ message, isUser }) => (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[70%] ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'} rounded-lg p-3 relative`}>
                {message.image_url && (
                    <div className="mt-2">
                        <img
                            src={message.image_url}
                            alt="Shared image"
                            className="max-w-full rounded-lg"
                            style={{ maxHeight: '200px' }}
                        />

                    </div>
                )}
                <p className="text-xs mt-1 opacity-70 flex justify-between flex-row items-center">
                    <p> {format(new Date(message.createdAt), 'MMM d, yyyy HH:mm')}</p>

                    {message.image_url && <a
                        href={message.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="block mt-2 text-gray-300 text-sm hover:underline"
                    >
                        <Download className="w-4 h-4 inline-block mr-1" />

                    </a>}
                </p>
                {message.text && (
                    <p className="text-sm">{message.text}</p>
                )}

                {isUser && <Check className="absolute bottom-1 right-1 w-4 h-4 text-gray-300" />}
            </div>
        </div>
    ), []);

    return (




        <div className="flex flex-col h-[700px] w-full max-w-lg m-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <div className="p-4 border-b dark:border-gray-700 flex items-center cursor-pointer" onClick={() => navigate(`/users/${user.user_id}`)}>
                <Avatar className="w-10 h-10 mr-3">
                    <AvatarImage src={user.profile_url} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4"
                ref={scrollAreaRef}

            >
                <div ref={observerRef} className="h-4" />
                {loading && currentPage === 1 && (
                    <div className="flex justify-center p-4">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                    </div>
                )}

                {/* Button to load more messages  */}
                {currentPage < totalPages && (
                    <div className="flex justify-center p-4">
                        <button
                            onClick={() => loadConversations(currentPage + 1)}
                            className="text-blue-500 hover:underline"
                        >
                            Load more
                        </button>
                    </div>
                )}


                {conversations.map((message) => (
                    <MessageBubble
                        key={message.id}
                        message={message}
                        isUser={message.sender_id != user_id}
                    />
                ))}

                {/* when conversation is empty */}
                {conversations.length === 0 && (
                    <div className="flex justify-center p-4">
                        {/* icnon  */}
                        <Info className="w-6 h-6 mr-2 text-gray-300" />
                        <p className="text-gray-300">No messages yet</p>
                    </div>
                )}


            </ScrollArea>

            <div className="p-4 border-t dark:border-gray-700">
                {previewUrl && (
                    <div className="mb-2 relative">
                        <img src={previewUrl} alt="Preview" className="max-h-20 rounded" />
                        <button
                            onClick={() => { setImage(null); setPreviewUrl(''); }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}


                {/* Hide this if issue is resolved */}
                <div className={` ${issue.state == 'Resolved' ? 'hidden' : ''} flex items-center`}>
                    <Input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow mr-2"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        className="hidden"
                    />
                    <Button onClick={() => fileInputRef.current.click()} className="mr-2">
                        <Camera className="w-5 h-5" />
                    </Button>
                    <Button onClick={handleSend} disabled={sendingMessage}>
                        {sendingMessage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </Button>
                </div>

                {/* show message when issue is resolved */}
                <div className={`${issue.state === 'Resolved' ? '' : 'hidden'} flex items-center justify-center p-4 bg-green-100 dark:bg-green-900 rounded-md`}>
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <p className="text-green-600 dark:text-green-300 font-medium">Issue has been resolved</p>
                </div>

            </div>
        </div>

    );
};

export default Chat;