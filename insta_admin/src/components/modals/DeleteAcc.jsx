import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";


import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useAdminContext } from "@/hooks/useAdminContext";
const apiUrl = import.meta.env.VITE_API_URL;


function DeleteAcc() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, two_factor_enabled, logout } = useAdminContext()
    const instabook_token = localStorage.getItem("instabook_token");
    const [loading, setLoading] = useState(false);


    const [currentPass, setCurrentPass] = useState("");
    const [email, setEmail] = useState("");
    const [totp, setTotp] = useState('');

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        if (loading) return
        // setIsModalOpen(false);
        if (!confirm("Confirm again ?")) return

        console.log(`Deleting account of  ${user.user_id}`)
        try {
            setLoading(true);
            await axios.delete(`${apiUrl}/user/delete/${user.user_id}`, {
                headers: { instabook_token },
                data: { email, password: currentPass, TOTP: totp }
            });



            // setIsModalOpen(false);
            toast.success("Your account is deleted !");
            setTimeout(() => {
                logout();
            }, 1000);
        } catch (error) {
            toast.error(error.response.data.message)
            console.error("Error deleting user:", error.response?.message);
        } finally {
            setLoading(false);
        }
    }


    return (
        <>

            <div className="group  transition-all duration-200 hover:translate-x-1">
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full p-4 rounded-lg bg-gray-800 hover:bg-red-950/50 transition-all duration-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-700 group-hover:bg-red-950">
                            <Trash2 className="w-5 h-5 text-red-500" />
                        </div>
                        <span className="text-lg text-white group-hover:text-red-500">Delete Account</span>
                    </div>
                </button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen} >
                <DialogTrigger>
                </DialogTrigger>
                <DialogContent className="w-full sm:w-[400px] lg:w-[600px] h-[400px] sm:h-[500px] lg:h-[500px] bg-white p-6 rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-center m-3">Delete Account</DialogTitle>

                        <DialogTitle className="text-center mt-4">Are you absolutely sure?</DialogTitle>
                        <DialogDescription className="m-4">
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </DialogDescription>

                    </DialogHeader>
                    <DialogDescription>

                        <form onSubmit={handleDeleteAccount} className="w-full space-y-2" >
                            <input
                                required
                                type="email"
                                placeholder="Email"
                                className="w-full px-4 py-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-zinc-600"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                minLength={5}
                                required
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-zinc-600"
                                value={currentPass}
                                onChange={(e) => setCurrentPass(e.target.value)}
                            />

                            {
                                two_factor_enabled &&
                                <input
                                    minLength={6}
                                    required
                                    type="text"
                                    placeholder="TOTP"
                                    className="w-full px-4 py-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-zinc-600"
                                    value={totp}
                                    onChange={(e) => setTotp(e.target.value)}
                                />
                            }

                            <button
                                // onClick={handleDeleteAccount}
                                className="w-full mt-5 bg-red-500 text-white py-2 flex justify-center items-center rounded font-semibold hover:bg-red-600 transition"
                                type="submit"
                                disabled={loading}  // Disable button when loading
                            >
                                {loading ?
                                    <img src="loading.gif" alt="loading gif" className='h-5 ' />
                                    : 'Delete Account'}
                            </button>


                        </form>


                    </DialogDescription>
                </DialogContent>
                <Toaster position="top-center" reverseOrder={false} />

            </Dialog>
        </>
    );
}

export default DeleteAcc;
