/* eslint-disable react/prop-types */
const apiUrl = import.meta.env.VITE_API_URL
import { useContext } from 'react'
import { InstaContext } from '../../context/InstaContext'

import { PlusSquare, Send, X } from 'lucide-react'
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useState } from 'react';




function CreatePost({ type }) {
    const { user } = useContext(InstaContext);

    const MAX_IMAGE_SIZE = 1 * 1024 * 1024;  // 5MB in bytes
    const [imageError, setImageError] = useState(null);
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        setImageError(null)
        setSelectedImage(null);
    }

    const [image, setImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [caption, setCaption] = useState('');
    const handleCaptionChange = (e) => {
        setCaption(e.target.value);
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

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (loading) return
        if (!image) setImageError("Please select a image !")
        if (image.size > MAX_IMAGE_SIZE) return

        console.log("Inside handlecreatePost");

        try {
            setLoading(true);
            const instabook_token = localStorage.getItem("instabook_token");
            const formData = new FormData();
            formData.append('post', image);
            formData.append('caption', caption);
            formData.append('user_id', user.user_id);

            const response = await axios.post(`${apiUrl}/post/add`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    instabook_token
                }
            });

            toast.success("Successfully added the post");
            setIsOpen(false)
            setSelectedImage(null);
        } catch (error) {
            console.log(error);
            console.table(error.response)
            const errorMessage = error.response?.data.message || "Error while uploading file !";
            toast.error(errorMessage);
        } finally {
            setLoading(false)
        }

    }


    return (
        <span>
            {type === "sidebar" ? (
                <button
                    onClick={openModal}
                    className="flex mt-4 items-center gap-4 hover:bg-zinc-800 w-full p-3 rounded-lg"
                >
                    <PlusSquare size={24} />
                    <span>Create</span>
                </button>
            ) : type === "bottom" ? (
                <button onClick={openModal} className="p-2">
                    <PlusSquare size={24} />
                </button>
            ) : null}


            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark transparent background
                    },
                    content: {
                        // width: '400px',
                        maxWidth: '600px',
                        height: '600px',
                        margin: 'auto',
                        padding: '20px',
                        borderRadius: '10px',
                        backgroundColor: '#1a1a1a', // Dark background for the modal content
                        color: 'white',
                    },
                }}
            >
                <form onSubmit={handleCreatePost} className='select-none'>
                    {/* <h2 className="text-2xl font-bold mb-4 text-center">Create Post</h2> */}

                    {/* Image Upload (New File Upload UI) */}
                    <div className="mb-4 ">
                        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-900">
                            Cover photo
                        </label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25">
                            <div className="text-center">

                                <label
                                    htmlFor="file-upload-input"
                                    className="relative cursor-pointer rounded-md  font-semibold focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                >
                                    {!selectedImage && (<svg
                                        className="mx-auto h-56 w-56 text-gray-300"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    )}

                                    {/* Image Preview */}
                                    {selectedImage && (
                                        <div className="mb-4">
                                            <img src={selectedImage} alt="Preview" className="w-full h-56 object-cover rounded-md" />
                                        </div>
                                    )}

                                    <div className="mt-4 flex justify-center items-center text-sm text-gray-300 text-center">

                                        <span >Upload a file</span>
                                        <input
                                            required
                                            id='file-upload-input'
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}  // Handle file change
                                            className="sr-only"
                                        />
                                    </div>
                                    <p className="pl-1 text-white">or drag and drop</p>
                                </label>
                                <p className="text-xs text-gray-300">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {imageError && <p className='text-red-500 text-center'>{imageError}</p>}



                    {/* Caption Input */}
                    <textarea
                        value={caption}
                        onChange={handleCaptionChange}
                        placeholder="Write a caption..."
                        rows="3"
                        maxLength={500}
                        className="w-full max-h-28 p-3 rounded-md bg-zinc-800 text-white border-none focus:outline-none mt-7 mb-4"
                    />

                    {/* Buttons */}
                    <div className="flex justify-center gap-6 mt-4">
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={closeModal}
                                    className="flex items-center px-4 py-2 text-red-500 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
                                >
                                    <X className="w-5 h-5 mr-2" />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center px-4 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
                                >
                                    <Send className="w-5 h-5 mr-2" />
                                    Post
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </Modal>
        </span >
    )
}

export default CreatePost
