/* eslint-disable react/prop-types */
import { useContext } from 'react'
import { InstaContext } from '../../context/InstaContext'

import { User } from 'lucide-react'
import { useNavigate } from 'react-router-dom';




function UserProfile({ type }) {
    const {user} = useContext(InstaContext);

    const navigate = useNavigate();




    return (
        <span>
            {type === "sidebar" ? (
                <button
                    onClick={() => {
                        navigate("/profile");
                        document.title = "Instabook - Profile"
                    }}
                    className="flex mt-4 items-center gap-4 hover:bg-zinc-800 w-full p-1 rounded-lg"
                >
                    {/* <User size={24} /> */}
                    <img src={user.profile_url} alt="profile" className='ml-2 rounded-full object-cover h-8 aspect-square'/>
                    <span>Profile</span>
                </button>
            ) : type === "bottom" ? (
                <button
                    onClick={() => {
                        navigate("/profile");
                        document.title = "Instabook - Profile"
                    }}
                    className="p-2">
                    {/* <User size={24} /> */}
                    <img src={user.profile_url} alt="profile" className='ml-2 rounded-full h-8 aspect-square'/>
                </button>
            ) : null}


           
        </span >
    )
}

export default UserProfile
