import { useState } from 'react';
import { Shield, AlertCircle, Loader2, Copy, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
const apiUrl = import.meta.env.VITE_API_URL;

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Link } from 'react-router-dom';
import { useAdminContext } from '@/hooks/useAdminContext';


function TwoFectorAuth() {
    const { two_factor_enabled, user, set_Two_factor_enabled } = useAdminContext();
    const [enabled2FA, setEnabled2FA] = useState(two_factor_enabled);
    const [loading, setLoading] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [totpCode, setTotpCode] = useState('');
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [qrCodeData, setQrCodeData] = useState('');
    const [secret, setSecret] = useState('');
    const [copied, setCopied] = useState(false);
    const [disableLoading, setDisableLoading] = useState(false);
    const [showDisableConfirm, setShowDisableConfirm] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const enable2fa = async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem('instabook_token');
            const response = await axios.post(
                `${apiUrl}/verify/enable-2fa`,
                { user_id: user.user_id },
                {
                    headers: {
                        'instabook_token': token
                    }
                }
            );

            setQrCodeData(response.data.data.qrCode);
            setSecret(response.data.data.secret);
            setShowQR(true);
            toast.success('2FA setup initiated successfully');
        } catch (error) {
            toast.error('Failed to enable 2FA');
            console.error('Error enabling 2FA:', error);
        } finally {
            setLoading(false);
        }
    };



    const handleCopySecret = () => {
        navigator.clipboard.writeText(secret);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Secret copied to clipboard');
    };



    const disable2fa = async () => {
        setDisableLoading(true);
        try {
            const token = localStorage.getItem('insta_admin');
            await axios.post(`${apiUrl}/verify/disable2Fa`, { user_id: user.user_id, TOTP: totpCode }, { headers: { 'instabook_token': token } });
            setEnabled2FA(false);
            setShowDisableConfirm(false);
            set_Two_factor_enabled(false);
            setTotpCode('');
            toast.success('2FA disabled successfully');
        } catch (error) {
            toast('Failed to disable 2FA');
            console.error('Error disabling 2FA:', error);
        } finally {
            setDisableLoading(false);
            setLoading(false);
        }
    };

    const handle2FAToggle = () => {
        if (loading) return;

        if (!enabled2FA) {
            setIsModalOpen(true)
        } else {
            setShowDisableConfirm(true);
            setLoading(false);
        }
    };


    const handleVerifyTOTP = async (e) => {
        e.preventDefault();
        setVerifyLoading(true);

        try {
            const token = localStorage.getItem('instabook_token');
            await axios.post(`${apiUrl}/verify/verify-2fa`, { user_id: user.user_id, TOTP: totpCode }, { headers: { 'instabook_token': token } });

            setEnabled2FA(true);
            setShowQR(false);
            toast.success('2FA enabled successfully');
            set_Two_factor_enabled(true);
        } catch (error) {
            toast.error('Invalid verification code');
            console.error('Error verifying 2FA:', error);
        } finally {
            setVerifyLoading(false);
        }
    };

    return (
        <div className="w-full m-4 max-w-2xl mx-auto p-6 space-y-6 bg-black rounded-lg shadow-lg border border-zinc-800">
            <Link
                to={"/settings"}
                className="px-4 py-2  text-white rounded  transition duration-200"
            >
                Back
            </Link>
            {/* Header */}
            <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-blue-500" />
                <h2 className="text-2xl font-bold text-white">Two-Factor Authentication</h2>
            </div>

            {/* Main toggle section */}
            <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium text-white">Enable 2FA</h3>
                    <p className="text-zinc-400">Add an extra layer of security to your account</p>
                </div>
                <Switch
                    checked={enabled2FA}
                    onCheckedChange={handle2FAToggle}
                    className="ml-4"
                    disabled={loading || showQR}
                />
            </div>

            {/* QR Code and Verification Section */}
            {showQR && (
                <div className="space-y-6 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-white">Scan QR Code</h3>
                        <p className="text-zinc-400">Scan this QR code with your authenticator app</p>

                        {/* QR Code */}
                        <div className="bg-white w-48 h-48 mx-auto rounded-lg">
                            <img
                                src={qrCodeData}
                                alt="QR Code"
                                className="w-full h-full"
                            />
                        </div>

                        {/* Secret Key */}
                        <div className="mt-4 space-y-2">
                            <label className="text-sm font-medium text-zinc-300">
                                Secret Key (Manual Entry)
                            </label>
                            <div className="flex items-center space-x-2 bg-zinc-800 p-2 rounded-md">
                                <code className="text-sm text-wrap overflow-hidden text-zinc-300 flex-1">{secret}</code>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopySecret}
                                    className="text-zinc-400 hover:text-white"
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* TOTP Verification Form */}
                        <form onSubmit={handleVerifyTOTP} className="space-y-4 mt-6">
                            <div className="space-y-2">
                                <label htmlFor="totp" className="text-sm font-medium text-zinc-300">
                                    Enter Verification Code
                                </label>
                                <Input
                                    id="totp"
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    value={totpCode}
                                    onChange={(e) => setTotpCode(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                    maxLength={6}
                                    pattern="[0-9]*"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={totpCode.length !== 6 || verifyLoading}
                            >
                                {verifyLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Verify and Enable 2FA
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Disable 2FA Confirmation Section */}
            {showDisableConfirm && (
                <div className="space-y-6 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-white">Disable Two-Factor Authentication</h3>
                        <p className="text-zinc-400">Please enter your authentication code to disable 2FA</p>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            disable2fa();
                        }} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="disable-totp" className="text-sm font-medium text-zinc-300">
                                    Authentication Code
                                </label>
                                <Input
                                    id="disable-totp"
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    value={totpCode}
                                    onChange={(e) => setTotpCode(e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                    maxLength={6}
                                    pattern="[0-9]*"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    className="flex-1"
                                    disabled={totpCode.length !== 6 || disableLoading}
                                >
                                    {disableLoading && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Disable 2FA
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowDisableConfirm(false);
                                        setTotpCode('');
                                    }}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Setup instructions when not enabled */}
            {!enabled2FA && !showQR && (
                <>
                    <div className="space-y-4">
                        <Alert className="border-blue-500 bg-zinc-900 ">
                            <AlertCircle className="w-4 h-4 text-blue-500" />
                            <AlertDescription className="text-zinc-300 ml-2">
                                To complete setup, you'll need to:
                            </AlertDescription>
                        </Alert>
                        <ol className="space-y-2 text-zinc-300 ml-4">
                            <li className="list-decimal">Install an authenticator app on your mobile device</li>
                            <li className="list-decimal">Scan the QR code we'll provide</li>
                            <li className="list-decimal">Enter the verification code to confirm setup</li>
                        </ol>
                    </div>

                    <div className="border-t border-zinc-800 pt-4">
                        <p className="text-sm text-zinc-400">
                            Make sure to save your recovery codes in a secure location. You'll need them if you lose access to your authentication device.
                        </p>
                    </div>





                </>
            )}

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-white rounded-lg shadow-lg p-6">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Are you sure?</DialogTitle>
                        <DialogDescription className="mt-2 text-gray-300">
                            Make sure to save your recovery codes in a secure location. You'll need them if you lose access to your authentication device.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 flex justify-end space-x-4">
                        <button
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-200"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-200"
                            onClick={() => {
                                // Handle proceed action
                                setIsModalOpen(false);
                                enable2fa();

                            }}
                        >
                            Proceed
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            <Toaster position="top-center" reverseOrder={false} />
        </div>
    );
}

export default TwoFectorAuth;