import { LogOut, LogOutIcon, Menu, User } from 'lucide-react'
import { useContext, useState } from 'react'
import { InstaContext } from '../../context/InstaContext'
import Modal from 'react-modal';
// Set the app element for accessibility
Modal.setAppElement('#root');
// Modal styles
const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 1000,
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        maxWidth: '250px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '0',
        border: '1px solid #2d2d2d',
        background: '#1c1c1c',
        borderRadius: '12px'
    }
};
import { useNavigate } from 'react-router-dom';

import {
    Settings,
    BarChart,
    Bookmark,
    Moon,
    AlertCircle,
} from "lucide-react";


function More() {
    const navigate = useNavigate()
    const { user, setUser, tab, setTab, logout } = useContext(InstaContext);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const closeModel = () => {
        setIsModelOpen(false);
    }


    return (


        <span>
            <button
                onClick={() => setIsModelOpen(true)}
                className="flex items-center gap-4 hover:bg-zinc-800 w-full p-3 rounded-lg mt-8">
                <Menu size={24} />
                <span>More</span>
            </button>


            <Modal
                isOpen={isModelOpen}
                onRequestClose={() => setIsModelOpen(false)}
                style={customStyles}
                contentLabel="Edit Profile"
            >
                <div className="text-white ">
                    {/* Modal Header */}
                    <div className="border-b border-gray-800 px-4 py-2 flex justify-between items-center">
                        <button
                            onClick={() => {
                                setIsModelOpen(false);
                            }}
                            className="text-gray-400 hover:text-white"
                        >
                            Cancel
                        </button>
                        <h2 className="text-lg font-semibold"></h2>
                        <button className="text-blue-500 font-semibold"></button>
                    </div>

                    <ul className="mt-4 p-4">
                        <li
                            onClick={() => {
                                navigate("/profile")
                                closeModel();

                            }}
                            className="py-2 hover:bg-gray-700 px-4 cursor-pointer flex items-center">
                            <User className="mr-2" size={20} />
                            <span >Profile</span>
                        </li>

                        <li
                            onClick={() => {
                                closeModel();
                            }}
                            className="py-2 hover:bg-gray-700 px-4 cursor-pointer flex items-center">
                            <Bookmark className="mr-2" size={20} />
                            <span>Bookmarks</span>
                        </li>

                        <li
                            onClick={() => {
                                closeModel();
                            }}
                            className="py-2 hover:bg-gray-700 px-4 cursor-pointer flex items-center">
                            <Moon className="mr-2" size={20} />
                            <span>Dark Mode</span>
                        </li>

                        <li
                            onClick={() => {
                                closeModel();
                            }}
                            className="py-2 hover:bg-gray-700 px-4 cursor-pointer flex items-center">
                            <AlertCircle className="mr-2" size={20} />
                            <span>Terms & Conditions</span>
                        </li>

                        <li
                            onClick={() => {
                                logout()
                                closeModel();
                            }}
                            className="py-2 hover:bg-gray-700 px-4 cursor-pointer flex items-center">
                            <LogOutIcon className="mr-2" size={20} />
                            <span>Logout</span>
                        </li>

                    </ul>
                </div>
            </Modal>
        </span>
    )
}

export default More
