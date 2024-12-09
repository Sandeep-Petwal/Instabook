/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Image as ImageIcon,
    X
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import toast, { Toaster } from 'react-hot-toast';
const apiUrl = import.meta.env.VITE_API_URL;

const EditUserModal = ({
    isOpen,
    onOpenChange,
    userData,
    setUserData,
    setIsEditModalOpen,
    fetchUserData
}) => {
    const [editFormData, setEditFormData] = useState({
        profile_img: '',
        name: '',
        username: '',
        email: '',
        two_factor_enabled: false,
        role: '',
        public: false,
        status: ''
    });

    const [loading, setLoading] = useState(false)
    const [profileImagePreview, setProfileImagePreview] = useState(null);

    // Initialize form data when userData changes
    useEffect(() => {
        if (userData) {
            setEditFormData({
                profile_img: userData.profile_img || '',
                name: userData.name || '',
                username: userData.username || '',
                email: userData.email || '',
                bio: userData.bio || '',
                role: userData.role || 'user',
                public: userData.public || false,
                status: userData.status || 'active'
            });
            setProfileImagePreview(userData.profile_url || null);
        }
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Set file for upload
            setEditFormData(prev => ({
                ...prev,
                profile_img: file
            }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        if (loading) return
        e.preventDefault();

        // Create FormData for file upload
        const formData = new FormData();
        Object.keys(editFormData).forEach(key => {
            formData.append(key, editFormData[key]);
        });

        // Call parent's submit handler
        // onSubmit(formData);
        handleEditSubmit(formData);
    };

    const handleEditSubmit = async (formData) => {
        setLoading(true)
        // console.log(formData)
        try {
            const insta_admin = localStorage.getItem("insta_admin")
            const response = await axios.post(
                `${apiUrl}/admin/users/edit/${userData.user_id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        insta_admin
                    }
                }
            );
            setUserData(response.data.data);
            console.table(response.data.data)
            fetchUserData();
            setIsEditModalOpen(false);

        } catch (error) {
            console.error('Error updating user', error);
            toast.error(error.response.data.message)
        } finally {
            setLoading(false);
        }
    };





    const handleClose = () => {
        // Reset form and close modal
        setProfileImagePreview(userData?.profile_url || null);
        onOpenChange(false);
    };

    return (

        <>



            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit User Profile</DialogTitle>
                        <DialogDescription>
                            Make changes to the user profile. Click then save.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Profile Image Section */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <Avatar className="w-32 h-32">
                                    <AvatarImage
                                        src={profileImagePreview || '/default-avatar.png'}
                                        alt="Profile preview"
                                    />
                                    <AvatarFallback>
                                        <ImageIcon className="w-12 h-12" />
                                    </AvatarFallback>
                                </Avatar>


                            </div>

                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full dark:bg-gray-700"
                            />
                        </div>

                        {/* Other Form Fields */}
                        <div className="space-y-4">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={editFormData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label>Username</Label>
                                <Input
                                    type="text"
                                    name="username"
                                    value={editFormData.username}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label>Bio</Label>
                                <Input
                                    type="text"
                                    name="bio"
                                    value={editFormData?.bio}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={editFormData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>


                            <div>
                                <Label>Role</Label>
                                <select
                                    name="role"
                                    value={editFormData.role}
                                    onChange={handleInputChange}
                                    className="w-full p-2 dark:bg-gray-700 dark:text-gray-100 rounded"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                            </div>

                            <div>
                                <Label>Status</Label>
                                <select
                                    name="status"
                                    value={editFormData.status}
                                    onChange={handleInputChange}
                                    className="w-full p-2 dark:bg-gray-700 dark:text-gray-100 rounded"
                                >
                                    <option value="active">Active</option>
                                    <option value="blocked">Blocked</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>


                            <div className="flex items-center space-x-2">
                                <Switch
                                    name="public"
                                    checked={editFormData.public}
                                    onCheckedChange={(checked) => setEditFormData(prev => ({
                                        ...prev,
                                        public: checked
                                    }))}
                                />
                                <Label>Public Profile</Label>
                            </div>

                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-2 mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Toaster position="top-center" reverseOrder={false} />
        </>
    );
};

export default EditUserModal;