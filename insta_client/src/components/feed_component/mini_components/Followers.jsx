/* eslint-disable react/prop-types */
import Modal from 'react-modal';
import axios from 'axios';
import { useState } from 'react';
import { X } from 'lucide-react';
const apiUrl = import.meta.env.VITE_API_URL
import { useNavigate } from 'react-router-dom';


function Followers({ followers, user_id }) {
    const navigate = useNavigate();
    const instabook_token = localStorage.getItem("instabook_token");

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [userList, setUserList] = useState([])



    const loadFollowers = async () => {
        if (loading) return
        setIsOpen(true);

        try {
            const response = await axios.get(`${apiUrl}/user/followers/${user_id}`, {
                headers: { instabook_token }
            });

            // console.log("Successfully loaded the followers - ");
            // console.table(response.data.users);
            setUserList(response.data.users);
        }
        catch (error) {
            console.log(error);
            console.table(error.response)
        } finally {
            setLoading(false)
        }
    }


    return (

        <>
            <div
                onClick={loadFollowers}
                className='cursor-pointer underline underline-offset-2 hover:text-blue-500'>
                <span className="font-bold text-white">{followers}</span>{' '}
                <span className="text-gray-300">followers</span>
            </div>

            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                    content: {
                        width: '400px',
                        height: '400px',
                        margin: 'auto',
                        padding: '0',
                        borderRadius: '12px',
                        backgroundColor: '#262626',
                        color: 'white',
                        border: 'none',
                    }
                }}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
                        <h2 className="text-base font-semibold">Followers ({followers})</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:opacity-70"
                        >
                            <X size={20} />
                        </button>
                    </div>


                    {/* Followers list */}
                    <div className="flex-1 overflow-y-auto">
                        {userList?.length > 0 && userList.map((user) => (
                            <div
                                onClick={() => navigate(`/profile/${user.follower.user_id}`)}
                                key={user.id}
                                className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-700"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={user.follower.profile_url}
                                        alt={user.follower.username}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <div className="text-sm font-semibold">{user.follower.username}</div>
                                        <div className="text-sm text-gray-400">{user.follower.name}</div>
                                    </div>
                                </div>
                                {/* <button className="px-4 py-1.5 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600">
                                    Follow
                                </button> */}
                            </div>
                        ))}

                        {
                            !userList?.length > 0 &&
                            <div className='flex justify-center items-center mt-10'>
                                <h1> No user&#39;s found </h1>
                            </div>
                        }


                    </div>
                </div>
            </Modal>        </>
    )
}

export default Followers
