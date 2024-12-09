/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL
import { Toaster, toast } from 'react-hot-toast';

const OTPInput = ({ email, password , setStep, loading, setLoading }) => {
    const [otp, setOtp] = useState(Array(4).fill('')); // Assuming 4 digits OTP
    

    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const inputRefs = useRef([]); // Array of refs for each input field

    // Check if all OTP digits are filled and enable/disable the submit button
    useEffect(() => {
        const allFilled = otp.every((digit) => digit !== '');
        setIsSubmitDisabled(!allFilled); // Disable the button if any field is empty
    }, [otp]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/[0-9]/.test(value) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move focus to next input when current input is filled
            if (value && index < otp.length - 1) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleFocus = (e) => {
        e.target.select();
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text');
        if (!new RegExp(`^[0-9]{${otp.length}}$`).test(text)) {
            return;
        }
        const digits = text.split('');
        setOtp(digits);
    };

    // Handle Otp submission #2
    const handleOtpSUbmit = async () => {
        console.log('OTP Submitted:', otp.join(''));
        if (loading) return;
        try {
            setLoading(true);
            await axios.post(`${apiUrl}/verify/verifyforgotpass`, { email, otp: otp.join('') , password});
            setStep(3);
        } catch (error) {
            console.table(error.response.data)
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <section className="bg-dark py-10 dark:bg-dark">
            <div className="container">
                <div className='flex justify-center flex-col items-center'>
                    <p className="mb-1.5 text-sm font-medium text-white dark:text-white">Enter OTP :</p>
                    <form id="otp-form" className="flex gap-2 justify-center items-center">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onFocus={handleFocus}
                                onPaste={handlePaste}
                                ref={(el) => (inputRefs.current[index] = el)}
                                className="shadow-xs flex w-16 items-center justify-center rounded-lg border border-gray-600 bg-dark  p-3 text-center text-2xl font-medium dark:border-gray-400 dark:bg-gray-800 outline-none sm:text-4xl focus:border-orange-500 dark:focus:border-orange-600"
                                autoFocus={index === 0} // Auto-focus on the first input
                            />
                        ))}
                    </form>

                    {/* Submit Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            handleOtpSUbmit();
                        }}
                        disabled={isSubmitDisabled} // Button disabled if OTP is incomplete
                        className={`w-32 py-2 mt-4 flex justify-center rounded-md text-white ${isSubmitDisabled ? 'bg-gray-600' : 'bg-pink-600'} hover:bg-pink-700 focus:outline-none`}
                    >
                        {
                            loading
                                ? <img src="loading.gif" alt="loading gif" className='h-6 ' />

                                : 'Submit'
                        }

                    </button>
                </div>
            </div>
            <Toaster position="top-center" reverseOrder={false} />

        </section>
    );
};

export default OTPInput;
