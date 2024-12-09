import { CircleCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import OTPInput from '../components/other/OTPInput';

import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL

function Signup() {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("instabook_token")) {
            navigate("/")
        }
    }, [])



    document.title = "Signup - Instabook"
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState(1);

    // Handle form submission #1
    const handleSubmit = async (e) => {
        if (loading) return;
        e.preventDefault();

        // console.log('Name:', name);
        // console.log('Username:', username);
        // console.log('Email:', email);
        // console.log('Password:', password);

        try {
            setLoading(true);
            await axios.post(`${apiUrl}/verify/createtempuser`, {
                name,
                username,
                email,
                password,
            });

            // toast.success('Signup successful!');
            // navigate('/login');
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
                    <p className="p-4 text-center font-bold">Sign up to see photos and videos from your friends.</p>

                    <form className="w-full space-y-2" onSubmit={handleSubmit}>
                        <input
                            required
                            type="text"
                            placeholder="Full name"
                            className="w-full px-4 py-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-zinc-600"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            required
                            type="text"
                            placeholder="Username"
                            className="w-full px-4 py-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-zinc-600"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
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
                            placeholder="Password"
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
                            <OTPInput email={email} loading={loading} setLoading={setLoading} setStep={setStep} />
                        </div>
                    )
                }


                {
                    step == 3 && (
                        <div className='h-[500px] flex flex-col items-center justify-center'>
                            <h1 className="insta_font text-center gradient-text text-5xl font-bold mb-8 font-serif">
                                <Link to={"/"}>Instabook</Link>
                            </h1>
                            <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
                                <div className="flex flex-col items-center">
                                    <CircleCheck size={80} className='text-green-500 mb-4' />
                                    <h3 className='font-bold flex justify-center items-center text-green-400 mb-6'>Registration Successful!</h3>
                                    <Link
                                        to={"/login"}
                                        className="w-full flex justify-center bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-md font-bold text-lg transition duration-300 ease-in-out hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                    >
                                        Login Now
                                    </Link>
                                </div>
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

export default Signup;
