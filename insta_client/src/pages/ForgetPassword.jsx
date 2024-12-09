import { CircleCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import OTPReset from '../components/other/OTPReset';

import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL 

function ForgetPassword() {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("instabook_token")) {
            navigate("/")
        }
    }, [])



    document.title = "Reset - Instabook"
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState(1);

    // Handle form submission #1
    const handleSubmit = async (e) => {
        if (loading) return;
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post(`${apiUrl}/verify/forgotpassword`, {
                email,
                password,
            });
            setStep(2);
        } catch (error) {
            console.table(error.response.data)
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };




    return (
        <div className="w-full h-screen flex justify-center items-center">
            <div className="max-w-[350px] w-full">

                {step == 1 && <div className="flex h-[500px] flex-col items-center border border-gray-600 p-3">
                    <h1 className="insta_font gradient-text text-4xl font-bold mb-2 font-serif ">
                        <Link to={"/"}>
                            Instabook
                        </Link>
                    </h1>
                    <p className="p-4 text-center font-bold">Reset your password.</p>

                    <form className="w-full space-y-2" onSubmit={handleSubmit}>
                        <input
                            required
                            type="email"
                            placeholder="Email"
                            className="w-full px-4 py-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-zinc-600"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            required
                            type="password"
                            placeholder="New password"
                            className="w-full px-4 py-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-zinc-600"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 flex justify-center items-center rounded font-semibold hover:bg-blue-600 transition"
                            disabled={loading}  // Disable button when loading
                        >
                            {loading ?
                                <img src="loading.gif" alt="loading gif" className='h-5 ' />
                                : 'Send OTP'}
                        </button>
                    </form>

                    <div className="flex items-center gap-4 w-full my-2">
                        <div className="h-px bg-zinc-700 flex-1" />
                        <span className="text-zinc-500 text-sm font-semibold">OR</span>
                        <div className="h-px bg-zinc-700 flex-1" />
                    </div>

                    <div className="text-cente">
                        Have an account?{' '}
                        <Link to={"/login"} className="text-blue-500 font-semibold">
                            Login
                        </Link>
                    </div>
                </div>}

                {
                    step == 2 && (
                        <div className='h-[500px]'>
                            <h1 className="insta_font text-center gradient-text text-4xl font-bold mb-2 font-serif ">
                                <Link to={"/"}>
                                    Instabook
                                </Link>
                            </h1>
                            <OTPReset email={email} password={password} loading={loading} setLoading={setLoading} setStep={setStep} />
                        </div>
                    )
                }


                {
                    step == 3 && (
                        <div className='h-[500px]'>
                            <h1 className="insta_font text-center gradient-text text-4xl font-bold mb-2 font-serif ">
                                <Link to={"/"}>
                                    Instabook
                                </Link>
                            </h1>

                            <div className="flex justify-center items-center py-12 gap-5 border  my-14 w-full flex-col">
                                <h2 className=' font-bold text-3xl text-green-400'> Success</h2>
                                <CircleCheck size={100} className='text-green-500' />

                                <Link
                                    to={"/login"}
                                    className={`w-32 gragient py-2 flex items-center justify-center font-bold text-xl mt-4 rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none`}
                                >
                                    Login
                                </Link>

                            </div>
                        </div>
                    )
                }


                <div className="mt-6 text-center">
                    <p className="mb-4">Get the app.</p>
                    <div className="flex gap-4 justify-center">
                        <img src="/apple_store.png" alt="Get it on Google Play" className="h-10" />
                        <img src="/play_store.png" alt="Get it from Microsoft" className="h-10" />
                    </div>
                </div>
            </div>
            <Toaster position="top-center" reverseOrder={false} />
        </div>
    );
}

export default ForgetPassword;
