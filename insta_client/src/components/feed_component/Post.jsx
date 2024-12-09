/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars

import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import axios from 'axios';
import { useContext, useState } from 'react';
const apiUrl = import.meta.env.VITE_API_URL
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../context/socketContext';

function Post(post_prop) {
    const navigate = useNavigate();
    const { emitEvent } = useContext(SocketContext)

    const { post, dropdownRef, setOpenMenuId, openMenuId, setPostId, setIsPostModalOpen, user, creator_id } = post_prop;

    const [isLiked, setIsLiked] = useState(post.liked);
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [loading, setLoading] = useState(false);



    const toggleLikes = async () => {
        if (loading) return
        const instabook_token = localStorage.getItem("instabook_token");
        try {
            setLoading(true);
             await axios.post(`${apiUrl}/post/like/${post.id}`, { user_id: user.user_id }, {
                headers: { instabook_token }
            }); 

            if (isLiked) {
                console.log("currrent LikeCount = " + likeCount);
                console.log("Unliked");
                setLikeCount(likeCount - 1);
            } else {
                console.log("currrent LikeCount = " + likeCount + " Liked");


                emitEvent(creator_id, "like", post.id, user.user_id); // sending a like event

                setLikeCount(likeCount + 1);
            }
            setIsLiked(prev => !prev);
        } catch (error) {
            console.table(error.response.data)
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }

    const openFullPost = () => {
        setPostId(post.id);
        setIsPostModalOpen(true)

    }

    return (
        <div>
            <div key={post.id} className="border-b w-[400px] md:w-[500px] border-zinc-800 pb-6">
                {/* Post Header */}
                <div className="flex items-center justify-between px-4 mb-3">
                    <div
                        onClick={() => navigate(`/profile/${post.user.user_id}`)}
                        className="flex items-center gap-3 cursor-pointer">
                        <img
                            src={post.user.profile_url}
                            alt={post.user.username + "'s profile picture"}
                            className="w-8 h-8 rounded-full"
                        />
                        <div>
                            <div className="flex items-center gap-1">
                                <span className="font-semibold">{post.user.username}</span>
                                <span className="text-zinc-500"> • {post.timeAgo}</span>
                            </div>
                            {post && (
                                <p className="text-xs text-zinc-300">India</p>
                            )}
                        </div>
                    </div>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
                            className="hover:text-zinc-400"
                        >
                            <MoreHorizontal size={20} />
                        </button>

                        {openMenuId === post.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-black rounded-lg shadow-lg border border-zinc-500 z-50">
                                <div className="py-1">
                                    <button
                                        className="w-full text-center px-4 py-2 text-sm hover:bg-gray-900"
                                        onClick={() => {
                                            console.log('Follow/Unfollow:', post.username);
                                            setOpenMenuId(null);
                                        }}
                                    >
                                        Follow / Unfollow
                                    </button>
                                    <button
                                        className="w-full text-center px-4 py-2 text-sm hover:bg-gray-900"
                                        onClick={() => {
                                            console.log('Add to favorites:', post.id);
                                            setOpenMenuId(null);
                                        }}
                                    >
                                        Add to favorites
                                    </button>
                                    <button
                                        className="w-full text-center px-4 py-2 text-sm hover:bg-gray-900"
                                        onClick={() => {
                                            console.log('Share:', post.id);
                                            setOpenMenuId(null);
                                        }}
                                    >
                                        Share
                                    </button>
                                    <button
                                        className="w-full text-center px-4 py-2 text-sm hover:bg-gray-900"
                                        onClick={() => {
                                            console.log('Share:', post.id);
                                            setOpenMenuId(null);
                                        }}
                                    >
                                        Bookmark
                                    </button>
                                    <button
                                        className="w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-gray-900"
                                        onClick={() => {
                                            console.log('Report:', post.id);
                                            setOpenMenuId(null);
                                        }}
                                    >
                                        Report
                                    </button>
                                    <button
                                        className="w-full text-center px-4 py-2 text-sm hover:bg-gray-900"
                                        onClick={() => {
                                            console.log('Share:', post.id);
                                            setOpenMenuId(null);
                                        }}
                                    >
                                        Cencel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Post Image */}
                <div
                    onDoubleClick={toggleLikes}
                    className="aspect-square md:aspect-auto">
                    <img
                        src={post.image_url}
                        alt="Post content"
                        className="w-full aspect-square object-cover"
                    />
                </div>

                {/* Post Actions */}
                <div
                    className="px-4 mt-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => toggleLikes()}

                            >
                                <Heart className={`w-6 h-6 ${isLiked && "fill-current text-red-500"}`} />

                                {/* <Heart className="w-6 h-6 hover:text-zinc-400" /> */}
                            </button>
                            <button
                                onClick={openFullPost}
                            >
                                <MessageCircle
                                    className="w-6 h-6 hover:text-zinc-400" />
                            </button>
                        </div>
                    </div>
                    <p
                        onClick={openFullPost}
                        className="font-semibold mb-1">{likeCount || "0"} likes
                    </p>

                    <p onClick={openFullPost}>
                        <span className="font-semibold">{post.username}</span>{' '}
                        {post.caption}
                    </p>
                    <button
                        onClick={openFullPost}
                        className="text-zinc-300 hover:text-zinc-200 text-sm mt-1">
                        {
                            post.commentCount ? `View all ${post.commentCount} comments` : "No comments"
                        }
                        {/* View all {post.commentCount || ""} comments */}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Post
