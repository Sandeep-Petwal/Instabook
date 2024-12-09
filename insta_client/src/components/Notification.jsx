import { Bell, Heart, MessageCircleMore, UserRoundCheckIcon } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { SocketContext } from "../context/socketContext"
import { InstaContext } from '../context/InstaContext'
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;
import axios from 'axios';

const Notifications = () => {
    const { socket, isConnected, emitEvent, setNotificationCount, refreshNotifications, setRefreshNotification } = useContext(SocketContext)
    const navigate = useNavigate();


    const { user } = useContext(InstaContext);

    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const loadNotification = async () => {
        // console.log("Inside loadNotification :: ");
        setLoading(true);
        const instabook_token = localStorage.getItem("instabook_token");
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/user/notification/${user.user_id}`, {
                headers: { instabook_token }
            }); 

            setNotifications(response.data.notifications);
            setNotificationCount(0);
            // console.log("Notifications are :: ");
            // console.table(response.data.notifications)
        } catch (error) {
            console.table(error.response.data)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadNotification();
    }, [refreshNotifications])



    if (loading) return (
        <div className="flex w-full justify-center items-center h-full mt-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className='w-full p-10 bg-gray-950 flex flex-col gap-7 rounded-lg shadow-lg'>
            <div className="flex gap-4 font-semibold items-center text-white mb-5">
                <Bell size={30} className="text-blue-500" />
                <h1 className="text-2xl">Notifications</h1>
            </div>

            {/* Notifications List */}
            <div className="flex flex-col gap-2">

                {
                    notifications.map((n) => {
                        return (
                            <div key={n.id} className="flex gap-3 items-center bg-gray-800 p-2   rounded-lg shadow-md hover:bg-gray-700 transition-colors">

                                {n.type == "follow" &&
                                    <>
                                        <div className="flex justify-center items-center bg-blue-500 rounded-full p-2">
                                            <UserRoundCheckIcon size={25} className="text-white" />
                                        </div>
                                        <p
                                            onClick={() => navigate("/request")}
                                            className="text-white text-lg cursor-pointer">
                                            <strong>@{n.target_username}</strong> Requested to follow you.
                                        </p>
                                    </>
                                }

                                {n.type == "like" &&
                                    <>
                                        <div className="flex justify-center items-center bg-red-500 rounded-full p-2">
                                            <Heart size={25} className="text-white" />
                                        </div>
                                        <p className="text-white text-lg">
                                            <strong>@{n.target_username}</strong> liked your post.
                                        </p>
                                    </>
                                }


                                {n.type == "comment" &&
                                    <>
                                        <div className="flex justify-center items-center bg-blue-500 rounded-full p-2">
                                            <MessageCircleMore size={25} className="text-white" />
                                        </div>
                                        <p className="text-white text-lg">
                                            <strong>@{n.target_username}</strong> commented on your post.
                                        </p>

                                    </>
                                }

                            </div>

                        )
                    })
                }


                {notifications.length < 1 &&
                    <div>

                        {/* <BellRing size={100} /> */}
                        <div className="bg-gray-800 text-white p-8 rounded-lg shadow-md flex flex-col items-center">
                            <div className="flex relative justify-center items-center w-40 h-40 rounded-full bg-gray-700">
                                <svg className="w-[100px] h-[100px] text-whit dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="m10.827 5.465-.435-2.324m.435 2.324a5.338 5.338 0 0 1 6.033 4.333l.331 1.769c.44 2.345 2.383 2.588 2.6 3.761.11.586.22 1.171-.31 1.271l-12.7 2.377c-.529.099-.639-.488-.749-1.074C5.813 16.73 7.538 15.8 7.1 13.455c-.219-1.169.218 1.162-.33-1.769a5.338 5.338 0 0 1 4.058-6.221Zm-7.046 4.41c.143-1.877.822-3.461 2.086-4.856m2.646 13.633a3.472 3.472 0 0 0 6.728-.777l.09-.5-6.818 1.277Z" />
                                </svg>

                                <span className="bg-red-500 absolute top-2 right-3 text-white rounded-full px-3 py-1 ml-2 text-lg font-bold">0</span>
                            </div>

                            <h2 className="text-2xl font-bold mt-4">No Notifications Yet</h2>
                            <p className="text-gray-400 mt-2">You have no notifications right now. Come back later</p>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Refresh</button>
                        </div>

                    </div>

                }
            </div>
        </div>
    );
}

export default Notifications;
