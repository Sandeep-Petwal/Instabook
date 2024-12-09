/* eslint-disable react/prop-types */
import  { useEffect, useState } from "react";
import { useAdminContext } from "@/hooks/useAdminContext";
import {

  Loader2,
  CloudAlert,
  LockOpen,
  LockIcon,
  Camera,
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import Modal from "react-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const apiUrl = import.meta.env.VITE_API_URL;
const MAX_IMAGE_SIZE = 1 * 1024 * 1024;

Modal.setAppElement("#root");

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    maxWidth: "500px",
    width: "90%",
    maxHeight: "90vh",
    overflow: "auto",
    padding: "0",
    border: "1px solid #2d2d2d",
    background: "#1c1c1c",
    borderRadius: "16px",
  },
};

const EditProfileModal = ({ isOpen, onClose, onSubmit, userData, loading }) => {
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(userData.profile_url);
  const [imageError, setImageError] = useState(null);
  const [name, setName] = useState(userData.name);
  const [username, setUsername] = useState(userData.username);
  const [bio, setBio] = useState(userData.bio || "");
  const [isPublic, setIsPublic] = useState(userData.public);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("File size is too large. Max allowed size is 1MB.");
      return;
    }
    setImage(file);
    setImageError(null);
    const reader = new FileReader();
    reader.onloadend = () => setSelectedImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (image && image.size > MAX_IMAGE_SIZE) return;

    const formData = new FormData();
    if (image) formData.append("profile", image);
    formData.append("name", name);
    formData.append("username", username);
    formData.append("bio", bio);
    formData.append("public", isPublic);

    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={modalStyles}
      contentLabel="Edit Profile"
    >
      <div className="text-white">
        <div className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <button
            onClick={handleSubmit}
            className="text-blue-500 font-semibold hover:text-blue-400 transition-colors"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <Avatar className="w-24 h-24">
                <AvatarImage src={selectedImage} />
                <AvatarFallback>{name[0]}</AvatarFallback>
              </Avatar>
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <Camera className="w-6 h-6" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
            </div>
            {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">
                Username
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-900"
                maxLength={20}
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-1">
                Full name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-900"
                maxLength={20}
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-1">Bio</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-gray-900 resize-none"
                maxLength={150}
                rows={3}
              />
              <div className="text-xs text-gray-400 text-right mt-1">
                {bio.length} / 150
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
              <div className="flex items-center space-x-2">
                {isPublic ? (
                  <LockOpen className="text-green-500" />
                ) : (
                  <LockIcon className="text-red-500" />
                )}
                <span>{isPublic ? "Public Profile" : "Private Profile"}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={() => setIsPublic(!isPublic)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const Profile = () => {
  const { user, logout } = useAdminContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const instabook_token = localStorage.getItem("insta_admin");

  const handleEditProfile = async (formData) => {
    try {
      setLoading(true);
      await axios.put(`${apiUrl}/user/edit/${user.user_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          instabook_token,
        },
      });
      toast.success("Profile updated successfully");
      loadUser();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data.message || "Failed to update profile");
    } finally {
      setIsEditModalOpen(false);
      setLoading(false);
    }
  };

  const loadUser = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/user/profile/${user.user_id}`,
        {
          headers: { instabook_token },
        }
      );
      setUserProfile(response.data.data);
    } catch (error) {
      toast.error("Failed to load profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (loading && !userProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
    );
  }

  if (!loading && !userProfile) {
    return (
      <div className="flex items-center justify-center flex-col h-screen space-y-4">
        <CloudAlert size={100} className="text-red-500" />
        <p className="text-xl font-semibold">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-b p-6">
      <Card className="max-w-2xl mx-auto backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800">
        <CardContent className="p-6 hover:bg-opacity-80 transition-all duration-300">
          <div className="flex flex-col items-center">
            <Avatar className="w-32 h-32 mb-6">
              <AvatarImage src={`${userProfile.profile_url}`} />
              <AvatarFallback className={"text-4xl font-bold"}>{userProfile.name[0].toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                {userProfile.name}
              </h1>
              <p className="text-gray-400">@{userProfile.username}</p>
              {userProfile.bio && (
                <p className="text-gray-300 mt-4 max-w-md">{userProfile.bio}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-8 mb-8 w-full max-w-md">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {userProfile.posts}
                </p>
                <p className="text-gray-400">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {userProfile.followers}
                </p>
                <p className="text-gray-400">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {userProfile.following}
                </p>
                <p className="text-gray-400">Following</p>
              </div>
            </div>

            <div className="flex flex-col w-full max-w-md space-y-3">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Edit Profile
              </Button>
              <Link to="/settings" className="w-full">
                <Button variant="outline" className="w-full">
                  Settings
                </Button>
              </Link>
              <Button variant="destructive" onClick={logout} className="w-full">
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {userProfile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditProfile}
          userData={userProfile}
          loading={loading}
        />
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Profile;
