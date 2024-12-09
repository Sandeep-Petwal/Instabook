import React, { useContext, useState, useEffect, useCallback } from 'react';
import { InstaContext } from '../context/InstaContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { UserPlus, UserMinus, Loader2, ChevronLeft } from 'lucide-react';

function FollowRequests() {
    const { user } = useContext(InstaContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        count: 0
    });

    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const loadRequests = useCallback(async (page = 1) => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('instabook_token');
            const response = await axios.get(`${apiUrl}/user/follow/requests/${user.user_id}`, {
                headers: { 'instabook_token': `${token}` }
            });

            const { users, count, totalPages, currentPage } = response.data;

            setRequests(users || []);
            setPagination({
                currentPage,
                totalPages,
                count
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load follow requests');
            toast.error(err.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [user.user_id, apiUrl, navigate]);

    useEffect(() => {
        loadRequests();
    }, [loadRequests]);


    const acceptRequest = async (id) => {
        try {
            const instabook_token = localStorage.getItem('instabook_token');
            await axios.post(`${apiUrl}/user/follow/accept`, { id, user_id: user.user_id },
                { headers: { instabook_token } }
            );

            setRequests(prev => prev.filter(req => req.id !== id));
            setPagination((prev) => {
                return {...prev, count : prev.count - 1}
            });


            toast.success("Accepted");
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to process request');
        }

    }
    const rejectRequest = async (id) => {
        try {
            const instabook_token = localStorage.getItem('instabook_token');
            await axios.post(`${apiUrl}/user/follow/delete`, { id, user_id: user.user_id },
                { headers: { instabook_token } }
            );

            setRequests(prev => prev.filter(req => req.id !== id));
            setPagination((prev) => {
                return {...prev, count : prev.count - 1}
            });


            toast.success("Deleted.");
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to process request');
        }

    }




    // Render loading or error states
    if (loading && requests.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    // if (requests.length == 0) {
    //     return (
    //         <div>
    //             NO Request.
    //         </div>
    //     )
    // }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="flex w-full justify-center mt-4 min-h-screen">
            <div className="w-full max-w-xl p-6 rounded-lg shadow-lg">

                <ChevronLeft size={30} onClick={() => navigate("/notification")} />
                <h2 className="text-2xl mt-2 text-white mb-4 font-bold">
                    Follow Requests
                    {pagination.count > 0 && ` (${pagination.count})`}
                </h2>

                {requests?.length == 0 ? (
                    <div className="text-center text-2xl text-gray-400 py-10">
                        No follow requests at the moment
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {requests?.map((request) => (
                            <div
                                key={request.id}
                                className="flex items-center gap-4 p-4 rounded-md bg-gray-700 shadow-md"
                            >
                                <img
                                    src={request.follower.profile_url || '/profile.jpeg'}
                                    alt={request.follower.username}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-grow">
                                    <p className="font-bold text-lg text-white">
                                        {request.follower.username}
                                    </p>
                                    <p className="text-gray-400">
                                        {request.follower.name}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => acceptRequest(request.id, 'accept')}
                                        className="px-3 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition flex items-center"
                                    >
                                        <UserPlus size={20} className="mr-1" /> Accept
                                    </button>
                                    <button
                                        onClick={() => rejectRequest(request.id, 'decline')}
                                        className="px-3 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition flex items-center"
                                    >
                                        <UserMinus size={20} className="mr-1" /> Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                
            </div>
            <Toaster position="top-center" />
        </div>
    );
}

export default FollowRequests;