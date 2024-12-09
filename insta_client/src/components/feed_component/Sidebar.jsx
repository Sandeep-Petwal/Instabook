import { useContext, useState } from 'react'
import { InstaContext } from '../../context/InstaContext'
import { SocketContext } from '../../context/socketContext'

import {
    Home, Search,
    MessageCircle, Heart,
    LogOutIcon,
    Settings
} from 'lucide-react';
import CreateButton from './CreatePost';
import UserProfile from './UserProfile';
import { useNavigate } from 'react-router-dom';


import More from '../modal/More';

function Sidebar() {

    const { notificationCount, unreadMsgCount } = useContext(SocketContext)

    const { logout } = useContext(InstaContext);
    const navigate = useNavigate()

    const [isHovered, setIsHovered] = useState(false);
    return (


        <div>
            {/* Left Sidebar - Hidden on mobile */}
            <div className="hidden lg:block w-64 h-screen sticky top-0  overflow-hidden border-r border-zinc-800 p-4">
                {/* <div className="mb-8">
                    <h1 className="text-4xl font-serif insta_font font-bold text-center gradient-text">Instabook</h1>
                </div> */}

                <div className="m-4 flex justify-center items-center gap-2 cursor-pointer">
                    <img src="black_logo.png" alt="logo" className='size-10' />
                    <h1
                        className={`text-4xl font-serif insta_font text-center ${isHovered ? 'gradient-text' : ''}`}
                        onMouseEnter={() => setIsHovered(true)}  // Set state to true when hovered
                        onMouseLeave={() => setIsHovered(false)} // Set state to false when mouse leaves
                    >
                        Instabook
                    </h1>
                </div>

                <nav className="space-y-4">

                    <button
                        onClick={() => {
                            navigate("/home")
                        }}
                        className="flex items-center gap-7 hover:bg-zinc-800 w-full p-3 rounded-lg">
                        <Home size={24} />
                        <span>Home</span>
                    </button>

                    <button
                        onClick={() => {
                            navigate("/search");
                        }}
                        className="flex items-center gap-4 hover:bg-zinc-800 w-full p-3 rounded-lg">
                        <Search size={24} />
                        <span>Search</span>
                    </button>

                    {/* <button className="flex items-center gap-4 hover:bg-zinc-800 w-full p-3 rounded-lg">
                        <Compass size={24} />
                        <span>Explore</span>
                    </button> */}

                    <button
                        onClick={() => {
                            navigate("/messages")
                        }}
                        className="relative flex items-center gap-4 hover:bg-zinc-800 w-full p-3 rounded-lg">
                        <MessageCircle size={24} />
                        <span>Messages</span>

                        {/* Message Badge */}
                        {unreadMsgCount > 0 && <span className="absolute top-0 right-8 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadMsgCount}
                        </span>}


                    </button>


                    <button
                        onClick={() => {
                            navigate("/notification")
                        }}
                        className="flex items-center relative gap-4 hover:bg-zinc-800 w-full p-3 rounded-lg">
                        <Heart size={24} />
                        <span>Notifications</span>

                        {/* Notification Badge */}
                        {notificationCount > 0 && <span className="absolute top-0 right-8 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {notificationCount}
                        </span>}

                    </button>

                    <CreateButton type={"sidebar"} />

                    <UserProfile type={"sidebar"} />

                    {/* <button className="flex items-center gap-4 hover:bg-zinc-800 w-full p-3 rounded-lg">
                        <User size={24} />
                        <span>Profile</span>
                    </button> */}



                    <button
                        onClick={() => navigate("/settings")}
                        className="flex items-center gap-4 hover:bg-zinc-800 w-full p-3 rounded-lg">
                        <Settings size={24} />
                        <span>Settings</span>
                    </button>
                    <button
                        onClick={logout}
                        className="flex items-center gap-4 hover:bg-zinc-800 w-full p-3 rounded-lg">
                        <LogOutIcon size={24} />
                        <span>Logout</span>
                    </button>

                    <More />
                </nav>

            </div>
        </div>
    )
}

export default Sidebar
