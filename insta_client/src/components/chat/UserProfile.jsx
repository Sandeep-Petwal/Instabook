/* eslint-disable react/prop-types */
import { IoVideocam, IoCloseCircle } from "react-icons/io5";
import { Toaster, toast } from 'react-hot-toast';
import { ChevronLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';



function UserProfile({ user, onBack }) {
    const navigate = useNavigate();


    return (
        <div className="flex items-center p-4 bg-gray-800 border-b border-gray-700">

            {/* user detail profile */}
            <ChevronLeft size={30} onClick={onBack} className="mr-2 text-gray-400 hover:text-gray-300" />
            <div
                onClick={() => navigate(`/profile/${user.user_id}`)}
                className="w-12 h-12  text-white rounded-full cursor-pointer flex items-center justify-center mr-3">
                <img src={user.profile_url} alt="profile picture" className="rounded-full aspect-square bg-transparent" />
            </div>
            <h2
                onClick={() => navigate(`/profile/${user.user_id}`)}
                className="text-xl font-semibold cursor-pointer">
                {user.name}
                <p className="text-green-400 ">{user.online && "Online"}</p>
            </h2>


            <div className="ml-auto flex space-x-4 text-white">
                <IoVideocam size={30} onClick={() => toast("Calling feature is not available yet!")} />
            </div>
            <Toaster position="top-center" />

        </div>
    );
}

export default UserProfile;
