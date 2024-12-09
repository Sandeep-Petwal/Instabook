import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Home, CheckCircle, Check, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DialogDescription } from '@radix-ui/react-dialog';

import Chat from '@/support/Chat'

function Issue() {
    const [user, setUser] = useState()
    const navigate = useNavigate();
    const [issue, setIssue] = useState(null);
    const { id } = useParams();
    const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [resolveMessage, setResolveMessage] = useState('');

    useEffect(() => {
        const fetchIssue = async () => {
            try {
                const response = await axiosInstance.get(`/admin/tickets/get-issue/${id}`);
                setIssue(response.data.data);
                setUser(response.data.data.user)
            } catch (error) {
                console.error('Error fetching issue:', error);
            }
        };
        fetchIssue();
    }, [id]);

    const handleResolve = async () => {
        try {
            await axiosInstance.post(`/support/resolve/${id}`, { resolve_message: resolveMessage });
            // Refresh the issue data
            const response = await axiosInstance.get(`/admin/tickets/get-issue/${id}`);
            setIsResolveDialogOpen(false);
            setIssue(response.data.data);
        } catch (error) {
            console.error('Error resolving issue:', error);
        }
    };

    if (!issue) return <div>Loading...</div>;
    if (issue === null) return <div>Issue not found</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-100 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/support')}
                        className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/')}
                        className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Home
                    </Button>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Ticket Details <span className='text-blue-500'>#{issue.id}</span></h1>
                    <div
                        onClick={() => navigate(`/users/${issue.user.user_id}`)}
                        className="flex items-center mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-300"
                    >
                        <Avatar className="h-16 w-16 mr-4 border-2 border-blue-500">
                            <AvatarImage src={issue.user.profile_url} alt={issue.user.name} />
                            <AvatarFallback>{issue.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{issue.user.name}</h2>
                            <p className="text-gray-600 dark:text-gray-300">@{issue.user.username}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center">
                            <span className="text-gray-600 dark:text-gray-400 font-medium mr-2">Type:</span>
                            <span className="text-gray-800 dark:text-white">{issue.type}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-600 dark:text-gray-400 font-medium mr-2">State:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${issue.state === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                                    issue.state === 'in_progress' ? 'bg-blue-200 text-blue-800' :
                                        'bg-green-200 text-green-800'}`}>
                                {issue.state}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-600 dark:text-gray-400 font-medium mr-2">Created:</span>
                            <span className="text-gray-800 dark:text-white">{new Date(issue.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Description</h3>
                        <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">{issue.description}</p>
                    </div>
                    {issue.state != 'Resolved' && issue.screenshotUrl && (
                        <>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Screenshot</h3>
                            <div className="mb-6 flex justify-center items-center flex-col">
                                <img src={issue.screenshotUrl} alt="Screenshot" className="h-[300px] rounded-lg shadow-md" />
                            </div>
                        </>
                    )}

                    <div className="flex space-x-4">
                        {(issue.state === 'Pending' ) && (
                            <Button variant="outline" className="flex-1 bg-green-500 text-white hover:bg-green-600" onClick={() => setIsResolveDialogOpen(true)}>
                                <Check className="w-4 h-4 mr-2" />
                                Resolve
                            </Button>
                        )}
                        <Button variant="outline" className="flex-1 bg-blue-500 text-white hover:bg-blue-600" onClick={() => setIsChatModalOpen(true)}>
                            <MessageCircle className="w-4 h-4 mr-2" />
                            {issue.state != "Resolved" ? "Chat" : "Chat History"}
                        </Button>
                    </div>
                    {issue.state === 'Resolved' && (
                        <>
                            <div className="bg-green-100 mt-2 border-l-4 border-green-500 text-green-700 p-4 rounded-lg">
                                <p className="flex items-center font-semibold">
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    This issue has been resolved.
                                </p>
                            </div>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                <span className='font-semibold'>Resolution Message : </span>  {issue.resolve_message}
                            </p>
                        </>
                    )}
                </div>
            </div>

            <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Resolve Issue</DialogTitle>
                    </DialogHeader>
                    <Input
                        placeholder="Enter resolution message"
                        value={resolveMessage}
                        onChange={(e) => setResolveMessage(e.target.value)}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsResolveDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleResolve}>Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {isChatModalOpen && (
                <Dialog open={isChatModalOpen} onOpenChange={setIsChatModalOpen}>
                    <DialogContent className="w-[700px]">
                        <DialogHeader>
                            <DialogTitle>Support Chat</DialogTitle>
                        </DialogHeader>
                        <Chat
                            issue={issue}
                            issue_id={id}
                            user_id={issue.user.user_id}
                            onClose={() => setIsChatModalOpen(false)}
                            user={user}
                        />
                    </DialogContent>
                </Dialog>
            )}        </div>
    );
}

export default Issue;
