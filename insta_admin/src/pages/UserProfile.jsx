import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import {
  Mail,
  Calendar,
  Shield,
  Hash,
  Users,
  Edit,
  Lock,
  CheckCircle,
  Copy,
  Trash2,
  TriangleAlert,
  LogIn,
  Image as ImageIcon,
  UnlockKeyhole,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import EditUserModal from "@/components/modals/EditUserModal";
import UserSessions from "@/components/UserSessions";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const UserProfile = () => {
  const { toast } = useToast();
  const { user_id } = useParams();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    profile_img: "",
    name: "",
    username: "",
    email: "",
    two_factor_enabled: false,
    role: "",
    bio: "",
    public: false,
    status: "",
  });

  const fetchUserData = async () => {
    setLoading(true);
    const insta_admin = localStorage.getItem("insta_admin");
    try {
      const response = await axios.get(
        `${VITE_API_URL}/admin/users/get-user/${user_id}`,
        { headers: { insta_admin } }
      );

      const userData = response.data.data;
      console.log(typeof userData);

      setUserData(userData);
      setEditFormData({
        profile_img: userData.profile_img,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        two_factor_enabled: userData.two_factor_enabled,
        role: userData.role,
        bio: userData.bio,
        public: userData.public,
        status: userData.status,
      });
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user_id]);

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Two-factor secret has been copied.",
    });
  };

  const handleEditModalOpen = () => {
    setIsEditModalOpen(true);
  };

  // delete dialog
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const handleDeleteUser = async () => {
    setLoading(true);
    const insta_admin = localStorage.getItem("insta_admin");
    try {
      await axios.post(
        `${VITE_API_URL}/admin/users/status/${user_id}`,
        { status: "deleted" },
        { headers: { insta_admin } }
      );
      setUserData((prevUserData) => ({
        ...prevUserData,
        status: "deleted",
      }));
      setDeleteModalOpen(false);
    } catch (err) {
      setError(err);
      toast({
        title: `${err.response?.data?.message || "Failed to delete user"}`,
        description: "",
      });
    }
    setLoading(false);
  };

  // set account status to active
  const handleActivateUser = async () => {
    setLoading(true);
    const insta_admin = localStorage.getItem("insta_admin");
    try {
      await axios.post(
        `${VITE_API_URL}/admin/users/status/${user_id}`,
        { status: "active" },
        { headers: { insta_admin }, params: { user_id } }
      );
      setUserData((prevUserData) => ({
        ...prevUserData,
        status: "active",
      }));
    } catch (err) {
      setError(err);
      toast({ title: `${err.response.message}`, description: "" });
    }
    setLoading(false);
  };

  const [ipAddress, setIpAddress] = useState(null);

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        setIpAddress(response.data.ip);
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };
    fetchIpAddress();
  }, []);

  const handleLoginAsUser = async () => {
    console.log("Login as User", userData.user_id);
    setLoading(true);
    const insta_admin = localStorage.getItem("insta_admin");
    try {
      const response = await axios.post(
        `${VITE_API_URL}/admin/users/get-token/${user_id}`,
        { ipAddress },
        {
          headers: {
            insta_admin,
            "User-agent": navigator.userAgent,
          },
        }
      );

      const token = response.data.data;
      console.log(token);
      const clientURL = new URL(
        import.meta.env.VITE_INSTABOOK_CLIENT_URL + "/admin/login"
      );
      clientURL.searchParams.set("token", token);
      window.open(clientURL.toString(), "_blank");
    } catch (err) {
      toast({
        title: `${err.response.data.message || "Failed to login"} `,
        description: "",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900 dark:text-red-400">
        Error loading user data: {error.message}
      </div>
    );
  }

  if (!userData || userData.length < 1) {
    return (
      <div>
        <h1>User not found !</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* delete user modal  */}

        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex justify-center items-center flex-col gap-2">
                <TriangleAlert />
                Are you absolutely sure?
              </DialogTitle>
              <DialogDescription>
                <div>
                  {/* <div className='font-bold text-red-500'>This action cannot be undone. This will permanently delete users account
                    and remove  data from our servers.
                  </div> */}
                  <div className="flex justify-center flex-row gap-4 m-5">
                    <Button variant="destructive" onClick={handleDeleteUser}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete User
                    </Button>
                    <Button
                      // variant="destructive"
                      onClick={() => setDeleteModalOpen(false)}
                    >
                      <X className="mr-2 h-4 w-4" /> Cencel
                    </Button>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {userData && userData.name && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            {/* Previous Card Header and Content remain the same */}
            <CardHeader className="flex flex-row items-center space-x-4">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={userData.profile_url || "/default-avatar.png"}
                  alt={`${userData.name}'s profile`}
                />
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {userData.name}
                </CardTitle>
                <p className="text-sm dark:text-gray-400">
                  @{userData.username}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">User Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 dark:text-blue-400" />
                      <span>{userData.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 dark:text-green-400" />
                      <Badge variant="secondary">{userData.role}</Badge>
                      {userData.two_factor_enabled ? (
                        <Badge variant="outline" className="flex items-center">
                          <Lock className="w-4 h-4 mr-1" />
                          2FA actve
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center">
                          <UnlockKeyhole className="w-4 h-4 mr-1" />
                          2FA Not set
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 dark:text-purple-400" />
                      <span>
                        Joined:{" "}
                        {new Date(userData.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Profile Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Hash className="w-5 h-5 dark:text-yellow-400" />
                      <span>Login Count: {userData.login_count}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 dark:text-teal-400" />
                      <span>Followers: {userData.followers}</span>
                      <span>Following: {userData.following}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 dark:text-green-500" />
                      <Badge
                        variant={
                          userData.status === "active"
                            ? "default"
                            : "destructive"
                        }
                      >
                        Status: {userData.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {userData.bio && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2">Bio</h3>
                  <p className="dark:text-gray-300 italic">{userData.bio}</p>
                </div>
              )}

              <div className="flex justify-end mt-6 space-x-4">
                <Button
                  variant="outline"
                  className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  onClick={handleEditModalOpen}
                >
                  <Edit className="mr-2 w-4 h-4" /> Edit Profile
                </Button>
              </div>
            </CardContent>

            {/* Two Factor Secret Section */}
            {userData.two_factor_enabled && (
              <div className="p-4 border-t dark:border-gray-700 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Two-Factor Secret</h3>
                  <p className="text-sm dark:text-gray-400 break-all">
                    {userData.two_factor_secret}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(userData.two_factor_secret)}
                  className="dark:bg-gray-700 dark:text-gray-200"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Action Buttons */}
            {userData.status == "active" ? (
              <div className="p-4 flex flex-col md:flex-row justify-center gap-1">
                <Button
                  variant="destructive"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete User
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleLoginAsUser}
                  className="dark:bg-green-600 dark:text-white hover:dark:bg-green-700"
                >
                  <LogIn className="mr-2 h-4 w-4" /> Login as User
                </Button>
              </div>
            ) : (
              <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 flex justify-center items-center flex-col w-full">
                <div className="flex items-center mb-4">
                  <Trash2 className="w-6 h-6 text-red-500 mr-2" />
                  <h2 className="text-xl font-semibold">
                    This account is deleted{" "}
                  </h2>
                </div>
                <button
                  onClick={handleActivateUser}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  Recover Account
                </button>
              </div>
            )}

            <UserSessions user_id={user_id} />
          </Card>
        )}

        {/* Reusable Edit Modal */}
        <EditUserModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          userData={userData}
          setUserData={setUserData}
          setIsEditModalOpen={setIsEditModalOpen}
          fetchUserData={fetchUserData}
        />
      </div>
    </div>
  );
};

export default UserProfile;
