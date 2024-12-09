import { useState, useRef, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useContext } from 'react';
import { InstaContext } from '../../context/InstaContext';
import Modal from 'react-modal';
import axiosInstance from '@/api/axios';
import Stories from './Stories';
import PostModal from './PostModal';
import Post from './Post';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

Modal.setAppElement('#root');

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
        overflow: 'auto',
        padding: '0',
        border: '1px solid #2d2d2d',
        background: '#1c1c1c',
        borderRadius: '12px'
    }
};

const limitPerPage = 5;

function MainContent() {
    const [limit] = useState(limitPerPage);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [postId, setPostId] = useState(null);
    const closeModal = () => {
        setIsPostModalOpen(false);
    };
    const [loading, setLoading] = useState(false);
    const { user } = useContext(InstaContext);
    const [openMenuId, setOpenMenuId] = useState(null);
    const dropdownRef = useRef(null);
    const [posts, setPosts] = useState([]);

    // Fetch posts
    const fetchPosts = useCallback(async (pageNumber) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/post/feed?user_id=${user.user_id}&limit=${limit}&page=${pageNumber}`);
            if (!response.data.posts) return
            setPosts(prevPosts => [...prevPosts, ...response.data.posts]);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Error loading posts");
        } finally {
            setLoading(false);
        }
    }, [user.user_id, limit]);

    // Initial fetch
    useEffect(() => {
        fetchPosts(page);
    }, [fetchPosts, page]);

    // Scroll event listener
    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50) {
            if (page < totalPages && !loading) {
                setPage(prevPage => prevPage + 1); // Load next page
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll); // Cleanup
    }, [handleScroll]);

    return (
        <div className='w-full flex justify-center'>
            {/* Edit Profile Modal */}
            <Modal
                isOpen={isPostModalOpen}
                onRequestClose={() => setIsPostModalOpen(false)}
                style={customStyles}
                contentLabel="Edit Profile"
            >
                <PostModal postId={postId} closeModal={closeModal} />
            </Modal>

            {/* Main Content */}
            <div className="max-w-[700px]">
                {/* Stories */}
                <Stories />

                {/* Posts */}
                <div className="space-y-6 flex flex-col items-center w-[390px] md:w-[500px] xl:w-[700px]">
                    {posts.map(post => (
                        <Post
                            key={post.id}
                            post={post}
                            dropdownRef={dropdownRef}
                            setOpenMenuId={setOpenMenuId}
                            openMenuId={openMenuId}
                            setPostId={setPostId}
                            setIsPostModalOpen={setIsPostModalOpen}
                            user={user}
                            creator_id={post.user_id}
                        />
                    ))}
                    {loading && (
                        <div className="flex justify-center items-center p-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-200"></div>
                        </div>
                    )}
                    {!loading && posts.length === 0 &&
                        <div className='flex justify-center items-center flex-col'>
                            <p className='text-gray-200 text-lg p-2'>Follow more people to get new posts!</p>
                            <p className='text-gray-200 text-lg p-2 mb-4'>Try searching your friends on Instabook!</p>
                            <Link
                                to={"/search"}
                                className="px-3 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition flex items-center"
                            >
                                <Search className="mr-1" /> Search
                            </Link>
                        </div>
                    }
                </div>
            </div>
            <Toaster position="top-center" reverseOrder={false} />
        </div>
    );
}

export default MainContent;