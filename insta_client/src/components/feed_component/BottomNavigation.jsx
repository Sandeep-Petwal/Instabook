import { useContext } from 'react'
import { InstaContext } from '../../context/InstaContext'
import { SocketContext } from '../../context/socketContext'

import {
    Home, Search, Heart,
    MessageCircleDashed,
    MessageCircleX
} from 'lucide-react';
import CreateButton from './CreatePost';
import UserProfile from './UserProfile';
import { useNavigate } from 'react-router-dom';
// import { useSocket } from '../../context/socketContext';

function BottomNavigation() {
    const { notificationCount, unreadMsgCount } = useContext(SocketContext)

    const { user, login, logout, tab, setTab } = useContext(InstaContext);
    const navigate = useNavigate()

    return (
        <div>
            {/* Mobile Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 lg:hidden">
                <div className="flex justify-around items-center h-16 px-4">

                    <button
                        onClick={() => {
                            navigate("/home")
                        }}
                        className="p-2">
                        <Home size={24} />
                    </button>

                    <button
                        onClick={() => {
                            navigate("/search")

                        }}
                        className="p-2">
                        <Search size={24} />
                    </button>

                    <CreateButton type={"bottom"} />

                    <button
                        onClick={() => {
                            navigate("/notification")
                        }}
                        className="p-2 relative">
                        <Heart size={24} />

                        {/* Notification Badge */}

                        {notificationCount > 0 &&
                            <span className="absolute left-8 bottom-6 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">
                                {/* {notificationCount} */}
                            </span>

                        }

                    </button>

                    <button
                        onClick={() => {
                            navigate("/messages")

                        }}
                        className="p-2 relative">

                        <svg fill='white' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
                            <path d="M 25 2 C 12.347656 2 2 11.597656 2 23.5 C 2 30.007813 5.132813 35.785156 10 39.71875 L 10 48.65625 L 11.46875 47.875 L 18.6875 44.125 C 20.703125 44.664063 22.800781 45 25 45 C 37.652344 45 48 35.402344 48 23.5 C 48 11.597656 37.652344 2 25 2 Z M 25 4 C 36.644531 4 46 12.757813 46 23.5 C 46 34.242188 36.644531 43 25 43 C 22.835938 43 20.742188 42.6875 18.78125 42.125 L 18.40625 42.03125 L 18.0625 42.21875 L 12 45.375 L 12 38.8125 L 11.625 38.53125 C 6.960938 34.941406 4 29.539063 4 23.5 C 4 12.757813 13.355469 4 25 4 Z M 22.71875 17.71875 L 10.6875 30.46875 L 21.5 24.40625 L 27.28125 30.59375 L 39.15625 17.71875 L 28.625 23.625 Z"></path>
                        </svg>

                        {unreadMsgCount > 0 &&
                            <span className="absolute left-8 bottom-6 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">
                                {/* {notificationCount} */}
                            </span>

                        }

                    </button>


                    <UserProfile type={"bottom"} />

                    {/* <button className="p-2">
                        <User size={24} />
                    </button> */}
                </div>
            </div>
        </div>
    )
}

export default BottomNavigation
