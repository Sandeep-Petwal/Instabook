/* eslint-disable react/prop-types */
import { Heart, Bookmark, Send, Smile, ImageOff } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { InstaContext } from '../../context/InstaContext'
import { SocketContext } from '../../context/socketContext';

const apiUrl = import.meta.env.VITE_API_URL
import axios from 'axios';
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import CommentsList from './CommentsList';
import DeletePost from '../modal/DeletePost';

function PostModal({ closeModal, postId = { postId } }) {
    const { emitEvent } = useContext(SocketContext);
    const [postCreator, setPostCreator] = useState(null);

    const { user } = useContext(InstaContext);
    const navigate = useNavigate();

    const [post, setPost] = useState([]);
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [loading, setLoading] = useState(false);



    const loadPost = useCallback(async () => {
        const instabook_token = localStorage.getItem("instabook_token");
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/post/fullpost/${postId}`, {
                headers: { instabook_token }
            });
            setPost(response.data);
            setIsLiked(response.data.liked || false);
            setLikeCount(response.data.likeCount)

            setPostCreator(response.data.user_id);

        } catch (error) {
            console.log("Error loading post");
            console.table(error.response)
        } finally {
            setLoading(false);
        }
    }, [])



    const toggleLikes = async (postId, isLiked, likeCount, setLikeCount) => {
        const instabook_token = localStorage.getItem("instabook_token");
        try {
            setLoading(true);
            await axios.post(`${apiUrl}/post/like/${postId}`, { user_id: user.user_id }, {
                headers: { instabook_token }
            });

            if (isLiked) {
                console.log("currrent LikeCount = " + likeCount);
                console.log("Unliked");
                setLikeCount(likeCount - 1);
            } else {
                console.log("currrent LikeCount = " + likeCount);
                console.log("Liked");
                setLikeCount(likeCount + 1);

                emitEvent(postCreator, "like", postId, user.user_id); // sending a like event
            }
            setIsLiked(prev => !prev);
        } catch (error) {
            console.table(error.response.data)
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        if (!postId) return
        console.log("opening post , postId : " + postId + " user_id : " + user.user_id);
        loadPost();
    }, [loadPost, postId, user.user_id])

    const addComment = async (comment) => {
        console.log("Posting comment  - " + comment);
        try {
            const instabook_token = localStorage.getItem("instabook_token")
            await axios.post(
                `${apiUrl}/post/comments/${postId}`, { comment }, { headers: { instabook_token } }
            );

            emitEvent(postCreator, "comment", postId, user.user_id); // sending a like event

            setComments((prev) => {
                return [{ id: Date.now(), content: comment, user: { profile_url: user.profile_url, username: user.username, user_id: user.user_id } }, ...prev]
            })
            setComment("");
        } catch (error) {
            toast.error("Error while adding comment !")
            console.table(error.response.data)
        } 
    }


    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        )
    }

    if (!loading && post.length < 1) {
        return (
            <div className=" md:w-[700px] lg:w-[800px] min-w-[400px] min-h-[500px] max-h-[95vh] flex flex-col gap-8 justify-center items-center h-full p-8 bg-black border-2 rounded-xl border-gray-600">
                <ImageOff size={160} />
                <h1 className='text-orange-600 text-3xl font-bold'>Unable to find post !</h1>
                <h1 className='text-red-600'> * Post may have deleted or removed !</h1>
                <button
                    onClick={closeModal}
                    className='font-bold p-3'>Close</button>
            </div>
        )
    }

    return (
        <div className="main">

            {
                post.user &&
                <div className=" md:w-[700px] lg:w-[800px] min-w-[400px] min-h-[500px] max-h-[95vh] flex flex-col md:flex-row h-full p-8 bg-black border-2 rounded-xl border-gray-600">
                    <div className="md:w-[50%]  flex items-center justify-center">
                        <img
                            onDoubleClick={() => toggleLikes(postId, isLiked, likeCount, setLikeCount)}
                            src={post.image_url}
                            alt="Post content"
                            className="w-full h-full aspect-square object-cover"
                        />
                    </div>

                    {/* Right side - Content */}
                    <div className="md:w-[50%] min-h-[400px] bg-black border-l border-gray-800 flex flex-col h-full">

                        {/* Comments/Caption Section */}
                        <div className="flex-1 max-h-[300px] overflow-y-scroll p-3">
                            {/* Original post caption */}
                            <div className="flex gap-2">
                                <div
                                    onClick={() => navigate(`/profile/${post.user.user_id}`)}
                                    className="w-8 h-8 rounded-full cursor-pointer  flex-shrink-0">
                                    <img src={post.user.profile_url} alt="user_profile image" className='rounded-full aspect-square' />
                                </div>
                                <div>
                                    <div>
                                        <span
                                            onClick={() => navigate(`/profile/${post.user.user_id}`)}
                                            className="text-sm cursor-pointer font-semibold text-white">{post.user.username}</span>
                                        <span className="text-sm text-white whitespace-pre-wrap">{" " + post.caption}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">{post.timeAgo}</div>
                                </div>
                            </div>
                            <p className='p-2 ml-6 font-semibold text-gray-300'>{comments.length + " Comments"}</p>

                            {/* Commetnts  */}
                            <CommentsList comments={comments} setComments={setComments} postId={postId} />

                        </div>

                        {/* Action buttons */}
                        <div className="border-t border-gray-800 p-3">
                            <div className="flex justify-between mb-4">
                                <div className="flex gap-4">

                                    <button
                                        onClick={() => toggleLikes(postId, isLiked, likeCount, setLikeCount)}
                                        className="text-white hover:text-gray-400">
                                        <Heart className={`w-6 h-6 ${isLiked && "fill-current text-red-500"}`} />
                                    </button>

                                    <button className="text-white hover:text-gray-400">
                                        <Send className="w-6 h-6" />
                                    </button>
                                </div>
                                <button className="text-white hover:text-gray-400">
                                    <Bookmark className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="text-white font-semibold text-sm mb-2">
                                {likeCount} likes
                            </div>
                        </div>

                        {/* Comment input */}
                        <div className="border-t border-gray-800 p-3 flex items-center gap-3">
                            <button className="text-white">
                                <Smile className="w-6 h-6" />
                            </button>
                            <input
                                value={comment}
                                onChange={(e) => {
                                    setComment(e.target.value)
                                    // console.log(e.target.value);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addComment(comment)
                                    }
                                }}
                                type="text"
                                placeholder="Add a comment..."
                                className="flex-1 bg-transparent text-white text-sm border-none outline-none placeholder-gray-500"
                            />
                            <button
                                onClick={() => addComment(comment)}
                                className=" font-semibold text-sm ">
                                Post
                            </button>
                        </div>
                        {
                            post.user_id == user.user_id &&
                            <DeletePost postId={postId} closeMainModal={closeModal} />
                        }
                    </div>
                </div>
            }
            {/* <Toaster position="top-center" reverseOrder={false} /> */}
        </div>

    )
}

export default PostModal
