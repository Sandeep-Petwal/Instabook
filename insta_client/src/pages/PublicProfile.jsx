/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useEffect, useState } from 'react';
import { useParams ,useNavigate} from 'react-router-dom';
import { InstaContext } from '../context/InstaContext';
import { SocketContext } from '../context/socketContext';
import NotFound from './NotFound';
import Profile from './Profile';
import { Grid, Bookmark, UserRoundPlus, UserRoundX, MessageSquareText, LucideClock, LockKeyholeIcon } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL
import Followers from '../components/feed_component/mini_components/Followers';
import Following from '../components/feed_component/mini_components/Following';
import PostGrid from '../components/PostGrid';
document.title = "Instabook - Profile"


function PublicProfile() {
    const navigate = useNavigate();
    const { emitEvent } = useContext(SocketContext)

    const instabook_token = localStorage.getItem("instabook_token");
    const { user } = useContext(InstaContext);
    const { user_id } = useParams();
    console.log(user_id);
    if (isNaN(user_id)) return <NotFound />
    const [activeTab, setActiveTab] = useState('posts');
    const [loading, setLoading] = useState(false);


    const [userProfile, setUserProfile] = useState([]);
    const loadUser = async () => {
        if (loading) return
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/user/profile/${Number(user_id)}`, {
                headers: { instabook_token }
            });
            setUserProfile(response.data.data);
            // console.log("User is :: ");
            // console.table(response.data.data)

            // setIsFollowing(response.data.data.isFollowing);
            setFollowers(response.data.data.followers)
            setFollowing(response.data.data.following)
            setStatus(response.data.data.status);
            setIsPublic(response.data.data.public)
        } catch (error) {
            console.table(error)
        } finally {
            setLoading(false);
        }
    }


    // const [isFollowing, setIsFollowing] = useState(false);
    const [status, setStatus] = useState('');
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [isPublic, setIsPublic] = useState(false);

    const followUser = async () => {   
        if (loading) return
        try {
            setLoading(true);
            await axios.post(`${apiUrl}/user/follow`, {
                "followerId": user.user_id,
                "followingId": Number(user_id)
            }, {
                headers: { instabook_token }
            });

            // setIsFollowing(true);
            setStatus("pending");
            emitEvent(Number(user_id), "follow", user.user_id, user.user_id); // sending a follow event
            setFollowers(prev => prev + 1);

        } catch (error) {
            console.table(error.response.data)
        } finally {
            setLoading(false);
        }
    }

    const unfollowUser = async () => {  
        if (loading) return
        try {
            setLoading(true);
            await axios.post(`${apiUrl}/user/unfollow`, {
                "followerId": user.user_id,
                "followingId": Number(user_id)
            }, {
                headers: { instabook_token }
            });

            // setIsFollowing(false);
            setStatus("none")
            setFollowers(prev => prev - 1);
        } catch (error) {
            console.table(error.response.data)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isNaN(user_id) && (Number(user_id) != user.user_id)) {
            console.log("Loading user : " + user_id);
            loadUser();
        }
    }, [])




    return (
        <div className='w-full'>
            {(Number(user_id) === user.user_id) ? (
                <Profile />
            ) : (
                <div className="w-full">
                    <div className='text-white '>
                        <div className="min-h-screen bg-black text-gray-100 flex justify-center ">
                            <div className=" mx-auto px-4 py-8">
                                {/* Profile Header */}
                                <div className="flex flex-col md:flex-row md:items-start gap-8 mb-8">
                                    <div className="mx-auto md:mx-0 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-800 flex-shrink-0">
                                        <div className="w-full h-full rounded-full flex items-center justify-center">
                                            {/* <UserSquare className="w-12 h-12 md:w-16 md:h-16 text-gray-600" /> */}
                                            <img src={userProfile.profile_url} alt={userProfile.profile_url} className="w-24 h-24 md:w-32 md:h-32 rounded-full" />
                                        </div>
                                    </div>

                                    <div className="flex-1 ">
                                        {/* Stats */}
                                        <div className="flex justify-center sm:justify-start gap-8 mb-4">
                                            <div>
                                                <span className="font-bold text-white">{userProfile.posts}</span>{' '}
                                                <span className="text-gray-300">posts</span>
                                            </div>
                                            {/* <div>
                                                <span className="font-bold text-white">{followers}</span>{' '}
                                                <span className="text-gray-300">followers</span>
                                            </div> */}

                                            <Followers followers={followers} user_id={userProfile.user_id} />
                                            <Following following={following} user_id={userProfile.user_id} />

                                            {/* <div>
                                                <span className="font-bold text-white">{userProfile.following}</span>{' '}
                                                <span className="text-gray-300">following</span>
                                            </div> */}


                                        </div>

                                        {/* Bio */}
                                        <div className="text-center sm:text-left">
                                            <div className="font-medium text-white">{userProfile.name}</div>
                                            <p className="text-sm text-gray-300">@{userProfile.username}</p>
                                            <p className="text-sm text-gray-300">{userProfile.bio}</p>
                                        </div>
                                        <div className="buttons mt-5 flex justify-center">

                                            {
                                                status == "accepted" &&
                                                <button
                                                    onClick={unfollowUser}
                                                    className="px-6 m-2 py-1.5 flex justify-center gap-2 bg-gray-500 text-white rounded-md font-medium hover:bg-gray-600 transition">
                                                    <UserRoundX size={20} />
                                                    Unfollow
                                                </button>

                                            }

                                            {
                                                status == "none" &&
                                                <button
                                                    onClick={followUser}
                                                    className="px-6 m-2 py-1.5 flex justify-center gap-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition">
                                                    <UserRoundPlus size={20} />
                                                    Follow
                                                </button>
                                            }

                                            {
                                                status == "pending" &&
                                                <button
                                                    title='Your request is pending...'
                                                    className="px-6 m-2 py-1.5 flex justify-center gap-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition">
                                                    <LucideClock size={20} />
                                                    Pending
                                                </button>
                                            }

                                            {(isPublic || status == "accepted") &&
                                                <button 
                                                onClick={() => navigate(`/messages/${user_id}`)}
                                                className="px-6 m-2 py-1.5 flex justify-center gap-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition">
                                                    <MessageSquareText />
                                                    Message
                                            </button>}

                                        </div>

                                    </div>


                                </div>


                                {/* Tabs */}
                                <div className="border-t border-gray-800">
                                    <div className="flex justify-center gap-12">
                                        <button
                                            onClick={() => setActiveTab('posts')}
                                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition ${activeTab === 'posts'
                                                ? 'border-t text-white border-white -mt-px'
                                                : 'text-gray-500 hover:text-gray-300'
                                                }`}
                                        >
                                            <Grid className="w-4 h-4" />
                                            POSTS
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('saved')}
                                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition ${activeTab === 'saved'
                                                ? 'border-t text-white border-white -mt-px'
                                                : 'text-gray-500 hover:text-gray-300'
                                                }`}
                                        >
                                            <Bookmark className="w-4 h-4" />
                                            SAVED
                                        </button>
                                    </div>
                                </div>

                                {/* Tab Content */}
                                {activeTab === 'posts' ? (
                                    <div className="">
                                        {(isPublic || status == "accepted") ? <PostGrid user_id={Number(user_id)} /> :
                                            <div className='flex justify-center items-center text-lg mt-5 flex-col'>
                                                <LockKeyholeIcon size={100} className='text-gray-400 hover:text-gray-300' />
                                                <h1>User has locked there profile.</h1>
                                                <h1>Follow them to see posts.</h1>
                                            </div>

                                        }

                                        {/* {status != "accepted" &&
                                        } */}
                                    </div>
                                ) : (
                                    <div className="py-12 flex flex-col items-center justify-center text-center">
                                        <Bookmark className="w-16 h-16 text-gray-600 mb-4" />
                                        <h3 className="text-2xl font-medium mb-2 text-white">No Saved Posts</h3>
                                        <p className="text-gray-400">When you save posts, they will appear here.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <Toaster
                        position="top-center"
                        reverseOrder={false}
                    />
                </div>
            )}
        </div>
    );
}

export default PublicProfile;
