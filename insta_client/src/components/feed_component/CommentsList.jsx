/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useContext } from 'react'
import { InstaContext } from '../../context/InstaContext'

const apiUrl = import.meta.env.VITE_API_URL

function CommentsList({ comments, setComments, postId }) {
    const { user } = useContext(InstaContext);
    const instabook_token = localStorage.getItem("instabook_token");

    const [menuOpen, setMenuOpen] = useState(null); // To toggle menu for a specific comment
    const [isModalOpen, setIsModalOpen] = useState(false); // To toggle modal visibility
    const [editingComment, setEditingComment] = useState(null); // To store the comment being edited
    const [loading, setLoading] = useState(false); // Track loading state
    const menuRef = useRef(null); // Ref for menu to detect outside clicks

    // Load comments from API
    const loadComments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/post/comments/${postId}`, {
                headers: { instabook_token },
            });
            setComments(response.data);
        } catch (error) {
            console.error("Error loading comments:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    // Load comments on mount
    useEffect(() => {
        loadComments();
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleEdit = (comment) => {
        setEditingComment(comment);
        setIsModalOpen(true);
        setMenuOpen(null); // Close menu
    };



    const handleSaveEdit = async () => {
        try {
            setLoading(true);
            await axios.put(`${apiUrl}/post/comment/${editingComment.id}`, { content: editingComment.content }, {
                headers: { instabook_token },
            });

            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === editingComment.id
                        ? { ...comment, content: editingComment.content }
                        : comment
                )
            );
        } catch (error) {
            console.error("Error loading comments:", error.response?.data || error.message);
        } finally {
            setLoading(false);
            setIsModalOpen(false);

        }
    };

    const handleDelete = async (commentId) => {
        try {
            setLoading(true);
            await axios.delete(`${apiUrl}/post/comment/${commentId}`, {
                headers: { instabook_token },
            });
            setComments((prev) => prev.filter((comment) => comment.id !== commentId));
            setMenuOpen(null); // Close menu
        } catch (error) {
            console.error("Error editing comments:", error.response?.data || error.message);
        } finally {
            setLoading(false);
            setIsModalOpen(false);
        }
    };

    return (
        <div>
            {/* Loader */}
            {loading && <p className="text-white">Loading comments...</p>}

            {/* Comments */}
            {!loading && comments.map((comment) => (
                <div key={comment.id} className="flex gap-2 mb-4 relative">
                    <div className="w-8 h-8 rounded-full cursor-pointer flex-shrink-0">
                        <img
                            src={comment.user.profile_url}
                            alt="user_profile image"
                            className="rounded-full aspect-square"
                        />
                    </div>
                    <div>
                        <span className="text-sm font-semibold cursor-pointer text-white">
                            {comment.user.username}
                        </span>
                        <span className="text-sm text-white whitespace-pre-wrap">
                            {" " + comment.content}
                        </span>
                    </div>


                    {
                        comment.user_id == user.user_id &&
                        <div className="relative">
                            <MoreHorizontal
                                onClick={() =>
                                    setMenuOpen(menuOpen === comment.id ? null : comment.id)
                                }
                                className="cursor-pointer text-white"
                            />
                            {menuOpen === comment.id && (
                                <div
                                    ref={menuRef}
                                    className="absolute top-[-40px] right-0 bg-gray-700 text-white rounded shadow-lg p-2 w-32"
                                >
                                    <button
                                        className="flex items-center gap-2 w-full p-2 hover:bg-gray-600 rounded"
                                        onClick={() => handleEdit(comment)}
                                    >
                                        <Pencil size={20} /> Edit
                                    </button>
                                    <button
                                        className="flex items-center gap-2 w-full p-2 hover:bg-gray-600 rounded"
                                        onClick={() => handleDelete(comment.id)}
                                    >
                                        <Trash2 size={20} /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    }


                </div>
            ))}

            {/* Custom Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                    <div className="bg-gray-900 text-white p-8 rounded-xl max-w-md w-full shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-center">Edit Comment</h2>
                        <textarea
                            className="w-full p-3 bg-gray-800 rounded-lg text-white resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={editingComment?.content || ''}
                            onChange={(e) =>
                                setEditingComment({
                                    ...editingComment,
                                    content: e.target.value,
                                })
                            }
                            rows="4"
                        />
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-300"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300"
                                onClick={handleSaveEdit}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CommentsList;
