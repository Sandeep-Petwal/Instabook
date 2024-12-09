import { useState, useEffect } from 'react';
import { Grid, Bookmark, Settings2, LockOpen, LockIcon, Settings } from 'lucide-react';
const apiUrl = import.meta.env.VITE_API_URL
import { toast, Toaster } from 'react-hot-toast';

import axios from 'axios';
import { useContext } from 'react'
import { InstaContext } from '../context/InstaContext'
import Modal from 'react-modal';
import PostGrid from '../components/PostGrid';
import Followers from '../components/feed_component/mini_components/Followers';
import Following from '../components/feed_component/mini_components/Following';
import { Link } from 'react-router-dom';
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
        maxWidth: '425px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '0',
        border: '1px solid #2d2d2d',
        background: '#1c1c1c',
        borderRadius: '12px'
    }
};

const MAX_IMAGE_SIZE = 1 * 1024 * 1024;





const Profile = () => {
    const instabook_token = localStorage.getItem("instabook_token");

    const { user } = useContext(InstaContext);
    const [activeTab, setActiveTab] = useState('posts');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState();
    const [selectedImage, setSelectedImage] = useState(user.profile_url);
    const [imageError, setImageError] = useState(null);
    const [name, setName] = useState(user.name);
    const [username, setUsername] = useState(user.username);
    const [bio, setBio] = useState(user.bio || " ");
    const [isPublic, setIsPublic] = useState(false);

    const toggleIsPublic = () => {
        setIsPublic(prevState => !prevState);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file.size > MAX_IMAGE_SIZE) {
            setImageError('File size is too large. Max allowed size is 1MB.');
            return console.log("File size is too large. Max allowed size is 1MB.")
        }
        if (file) {
            setImageError(null)
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result); // set the preview image
            };
            reader.readAsDataURL(file); // reading the file
        }
    };

    const handleEditProfile = async (e) => {
        console.log("Inside handleEditProfile");
        e.preventDefault();
        if (loading) return
        // if (!image) setImageError("Please select a image !")
        if (image && image.size > MAX_IMAGE_SIZE) return

        try {
            setLoading(true);
            const instabook_token = localStorage.getItem("instabook_token");
            const formData = new FormData();
            formData.append("profile", image)
            formData.append('name', name);
            formData.append('username', username);
            formData.append('bio', bio);
            formData.append("public", isPublic)


            await axios.put(`${apiUrl}/user/edit/${user.user_id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    instabook_token
                }
            });

            // toast("Successfully updated the profile");
            setIsEditModalOpen(false)
            if (image) setSelectedImage(null);
            loadUser();
        } catch (error) {
            console.log(error);
            console.table(error.response.data)
            const errorMessage = error.response?.data.message || "Error while uploading file !";
            toast.error(errorMessage);
        } finally {
            setLoading(false)
        }

    }


    // loading user information 
    const [userProfile, setUserProfile] = useState([]);
    const loadUser = async () => {
        if (loading) return
        setLoading(true)
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/user/profile/${user.user_id}`, {
                headers: { instabook_token }
            });
            setUserProfile(response.data.data);
            setIsPublic(response.data.data.public)
            // console.log("User is :: ");
            // console.table(response.data.data)
        } catch (error) {
            console.table(error.response.data)
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        console.log("Loading Logged in user profile : " + user.user_id);
        loadUser();
    }, [])



    if (loading) return (
        <div className='w-full flex justify-center items-center py-6'>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
    )


    return (

        <div className='w-full flex justify-center'>
            {/* Edit Profile Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={() => setIsEditModalOpen(false)}
                style={customStyles}
                contentLabel="Edit Profile"
            >
                <div className="text-white ">
                    {/* Modal Header */}
                    <div className="border-b border-gray-800 px-4 py-2 flex justify-between items-center">
                        <button
                            onClick={() => {
                                setIsEditModalOpen(false);
                                setSelectedImage(null);
                            }}
                            className="text-gray-400 hover:text-white"
                        >
                            Cancel
                        </button>
                        <h2 className="text-lg font-semibold">Edit profile</h2>
                        <button
                            onClick={(e) => handleEditProfile(e)}
                            className="text-blue-500 font-semibold"
                        >
                            {loading ? "Updating..." : "Done"}
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-4 space-y-6">
                        {/* Profile Photo */}
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                                {/* <UserSquare className="w-8 h-8 text-gray-600" /> */}
                                {selectedImage ? (
                                    <img src={selectedImage} alt="Preview" className="rounded-full h-12  w-12 object-cover" />
                                )
                                    : <img src={user.profile_url} alt="Pofile" className="rounded-full h-12 w-12  object-cover" />
                                }
                            </div>
                            <div>
                                <div className="text-sm">{user.username}</div>
                                <label
                                    htmlFor='profile_pic'
                                    className="text-blue-500 text-sm font-semibold">
                                    Change profile photo
                                    <input
                                        id='profile_pic'
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="sr-only"
                                    />
                                </label>
                            </div>
                        </div>
                        {/* Error Message */}
                        {imageError && <p className='text-red-500 text-center'>{imageError}</p>}


                        <div className="space-y-1">
                            <label className="text-sm text-gray-400 block">Username</label>
                            <input
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                }}

                                type="text"
                                className="w-full bg-[#1c1c1c] border border-gray-800 rounded-md p-2 text-white"
                                placeholder="Username"
                                maxLength={20}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-gray-400 block">Full name</label>
                            <input
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value)
                                }}
                                type="text"
                                className="w-full bg-[#1c1c1c] border border-gray-800 rounded-md p-2 text-white"
                                placeholder="Full name"
                                maxLength={20}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-gray-400 block">Bio</label>
                            <textarea
                                className="w-full bg-[#1c1c1c] border border-gray-800 rounded-md p-2 text-white resize-none"
                                rows={3}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                maxLength={150}
                            />
                            <div className="text-xs text-gray-300 text-right">{bio.length} / 150</div>
                        </div>

                        {/* Visiblilty */}
                        <div className="space-y-1">
                            <div className="flex  gap-3 items-center">
                                {isPublic ?
                                    <LockOpen className='text-green-500' />
                                    : <LockIcon className='text-red-600' />
                                }
                                <span className="mr-2">{isPublic ? 'Public' : 'Private'}</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isPublic}
                                        onChange={toggleIsPublic}
                                        className="sr-only"
                                    />
                                    <div className={`w-11 h-6 rounded-full  transition-colors duration-200 ease-in-out ${isPublic ? 'bg-green-500' : 'bg-gray-300'}`}>
                                        <div
                                            className={`w-5 h-5 rounded-full mt-[2px]  bg-white transition-transform duration-200 ease-in-out ${isPublic ? 'translate-x-5' : 'translate-x-0'}`}
                                        />
                                    </div>
                                </label>
                            </div>
                            <p className="text-sm text-gray-400 p-2">
                                When private only users follow you can see your profile
                            </p>
                        </div>

                    </div>
                </div>
            </Modal>





            <div className=' w-full text-white'>
                <div className="min-h-screen bg-black text-gray-100 ">
                    <div className=" mx-auto px-4 py-8">
                        {/* Profile Header */}
                        <div className="flex flex-col items-center md:ml-[100px] md:flex-row md:items-start gap-8 mb-8">
                            <div className="mx-auto md:mx-0 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-800 flex-shrink-0">
                                <div className="w-full h-full rounded-full flex items-center justify-center">
                                    {/* <UserSquare className="w-12 h-12 md:w-16 md:h-16 text-gray-600" /> */}
                                    <img src={userProfile.profile_url} alt={userProfile.profile_url} className="w-24 h-24 md:w-32 md:h-32 rounded-full" />
                                </div>
                            </div>

                            <div className="flex-1 ">
                                <div className="flex flex-col sm:flex-row items-center gap-4 mb-1">
                                    <h2 className="text-xl font-medium text-white">{userProfile.name}</h2>
                                    {user ? (
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <button
                                                onClick={() => setIsEditModalOpen(true)}
                                                className="w-full sm:w-auto px-4 py-1.5 bg-gray-800 rounded-md font-medium hover:bg-gray-700 transition"
                                            >
                                                Edit profile
                                            </button>
                                            <Link
                                                to={"/settings"}
                                                className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition">
                                                <Settings className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    ) : (
                                        <button className="px-6 py-1.5 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition">
                                            Follow
                                        </button>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="flex justify-center sm:justify-start gap-8 mb-1">
                                    <div>
                                        <span className="font-bold text-white">{userProfile.posts}</span>
                                        <span className="text-gray-300"> posts</span>
                                    </div>
                                    <Followers followers={userProfile.followers} user_id={user.user_id} />
                                    <Following following={userProfile.following} user_id={user.user_id} />
                                </div>

                                {/* Bio */}
                                <div className="text-center sm:text-left">
                                    <div className="font-medium text-white">@{userProfile.username}</div>
                                    <p className="text-sm text-gray-300">{userProfile.bio}</p>
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
                                <PostGrid user_id={user.user_id} />
                            </div>
                        ) : (
                            <div className="py-12  flex flex-col items-center justify-center text-center">
                                <Bookmark className="w-16 h-16 text-gray-600 mb-4" />
                                <h3 className="text-2xl font-medium mb-2 text-white">No Saved Posts</h3>
                                <p className="text-gray-400">When you save posts, they will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Toaster position="top-center" reverseOrder={false} />
        </div >
    );
};

export default Profile;