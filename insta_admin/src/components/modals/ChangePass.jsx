import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from 'react';
import { LockIcon } from 'lucide-react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { useAdminContext } from "@/hooks/useAdminContext";

const apiUrl = import.meta.env.VITE_API_URL;

function ChangePass() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { user } = useAdminContext();
    const instabook_token = localStorage.getItem("insta_admin");
    const [loading, setLoading] = useState(false); // Track loading state
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (loading) return; // Prevent multiple submissions
        if (!newPass || !currentPass) return toast.error("Invalid password!");
        if (newPass === currentPass) return toast.error("New password can't be the same as the current one!");

        try {
            console.log("Inside handle chage pass");
            setLoading(true);
            await axios.post(`${apiUrl}/verify/changepassword/${user.user_id}`, {
                currentPass,
                newPass
            }, {
                headers: { instabook_token },
            });

            toast.success("Password changed successfully!");
        } catch (error) {
            toast.error(error?.response?.data?.error || "An error occurred while changing password");
            console.error("Error changing password:", error?.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            <div className="group transition-all relative top-5 duration-200 hover:translate-x-1">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-700 group-hover:bg-gray-600">
                            <LockIcon className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="text-lg text-white">Change Password</span>
                    </div>
                </button>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} >
                <DialogTrigger>
                </DialogTrigger>
                <DialogContent className="w-full  bg-white p-6 rounded-lg">
                   
                    <DialogDescription>
                        <DialogTitle>Change Password</DialogTitle>
                        <form className="mt-5 w-full" onSubmit={handleChangePassword}>
                            <input
                                minLength={5}
                                required
                                type="password"
                                placeholder="Current Password"
                                className="w-full px-4 py-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-zinc-600"
                                value={currentPass}
                                onChange={(e) => setCurrentPass(e.target.value)}
                            />
                            <input
                                minLength={5}
                                required
                                type="password"
                                placeholder="New Password"
                                className="w-full mt-2 px-4 py-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-zinc-600"
                                value={newPass}
                                onChange={(e) => setNewPass(e.target.value)}
                            />

                            {/* Submit button */}
                            <button
                                type="submit"
                                onClick={handleChangePassword}
                                className="w-full my-2 bg-red-500 text-white py-2 flex justify-center items-center rounded font-semibold hover:bg-red-600 transition"
                                disabled={loading}
                            >
                                {loading ? (
                                    <img src="loading.gif" alt="loading gif" className="h-5" />
                                ) : (
                                    'Change Password'
                                )}
                            </button>

                            {/* Cancel button */}
                            <button
                                type="button" // changed from submit to button
                                className="w-full bg-blue-500 text-white py-2 flex justify-center items-center rounded font-semibold hover:bg-blue-600 transition"
                                onClick={() => {
                                    setCurrentPass(""); // Clear input fields
                                    setNewPass(""); // Clear input fields
                                    setIsModalOpen(false);
                                }}
                            >
                                Cancel
                            </button>
                        </form>
                    </DialogDescription>
                </DialogContent>
                <Toaster position="top-center" reverseOrder={false} />

            </Dialog>
        </>
    );
}

export default ChangePass;
