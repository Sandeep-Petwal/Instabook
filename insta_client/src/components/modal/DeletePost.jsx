/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react'
import { Trash } from 'lucide-react'
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL

function DeletePost({ postId, closeMainModal }) {
    const instabook_token = localStorage.getItem("instabook_token");
    const [loading, setLoading] = useState(false); // Track loading state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const modalRef = useRef()

    const handleDeletePost = async () => {
        if (loading) return
        console.log(`Post with ID ${postId} deleting ....`)
        try {
            setLoading(true);
            await axios.delete(`${apiUrl}/post/delete/${postId}`, {  
                headers: { instabook_token },
            });

            setIsModalOpen(false);
            closeMainModal()

        } catch (error) {
            console.error("Error editing post:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            setIsModalOpen(false)
        }
    }

    useEffect(() => {
        if (isModalOpen) {
            document.addEventListener('mousedown', handleOutsideClick)
        } else {
            document.removeEventListener('mousedown', handleOutsideClick)
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [isModalOpen])

    return (
        <div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="fle w-full flex justify-center gap-2 items-center m-2 bg-red-700 hover:bg-red-600 p-2 rounded-md text-white">
                <Trash />
                Delete Post
            </button>

            {isModalOpen && (
                <div className="fixed  inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-50">
                    <div
                        ref={modalRef}
                        className="bg-gray-900 w-[300px] h-[200px] flex justify-center flex-col border-gray-200 border-2 rounded-3xl text-white p-6 shadow-lg ">


                        <h2 className="text-xl font-semibold mb-4">Permanently delete post ?</h2>
                        <div className="flex justify-center gap-5">
                            {/* Confirm Delete */}
                            <button
                                onClick={handleDeletePost}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                                Delete
                            </button>

                            {/* Cancel */}
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DeletePost
