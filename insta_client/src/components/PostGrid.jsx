/* eslint-disable react/prop-types */
import { Grid } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
const apiUrl = import.meta.env.VITE_API_URL
import axios from 'axios';
import PostModal from './feed_component/PostModal';

import Modal from 'react-modal';
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
        // maxWidth: '425px',
        // width: '90%',
        // maxHeight: '90vh',
        overflow: 'auto',
        padding: '0',
        border: '1px solid #2d2d2d',
        background: '#1c1c1c',
        borderRadius: '12px'
    }
};


function PostGrid({ user_id }) {
    const instabook_token = localStorage.getItem("instabook_token");
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const loadPosts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/user/posts?user_id=${user_id}`, {
                headers: { instabook_token }
            });
            setPosts(response.data.posts);
            // console.table(response.data.posts);
        } catch (error) {
            console.table(error.response.data)
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        loadPosts();
    }, [])


    //post modal
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [postTOVIew, setPostTOView] = useState(null);
    const closeModal = () => {
        console.log("Closing the post modal ...");
        setIsPostModalOpen(false);
        setPostTOView(null);
    }



    return (
        <div>

            {/* Edit Profile Modal */}
            <Modal
                isOpen={isPostModalOpen}
                onRequestClose={() => setIsPostModalOpen(false)}
                style={customStyles}
                contentLabel="Edit Profile"
            >
                <PostModal postId={postTOVIew} closeModal={closeModal} />
            </Modal>

            <div className="flex justify-center">
                {
                    posts.length > 0
                        ? <div className=" max-w-[700px] grid grid-cols-3 gap-2 mt-4">
                            {
                                posts.map((post) => {
                                    return (
                                        <div
                                            onClick={() => {
                                                setIsPostModalOpen(true);
                                                setPostTOView(post.id)
                                            }}
                                            key={post.id} className='aspect-squar'>
                                            <img className='aspect-square' src={post.image_url} alt={post.image_url} />
                                        </div>
                                    )
                                })
                            }
                        </div>

                        // if there are no posts 
                        : <div className="col-span-3 py-12 flex flex-col items-center justify-center text-center">
                            <Grid className="w-16 h-16 text-gray-600 mb-4" />
                            <h3 className="text-2xl font-medium mb-2 text-white">Share Photos</h3>
                            <p className="text-gray-400 mb-4">When you share photos, they will appear on your profile.</p>
                            <button className="text-blue-400 font-medium">No posts yet</button>
                        </div>

                }
            </div>
        </div>
    )
}

export default PostGrid
