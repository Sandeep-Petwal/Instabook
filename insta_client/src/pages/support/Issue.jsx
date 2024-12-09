import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axios';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, AlertCircle, FileText, Image, Download, Tag, CheckCircle, MessagesSquare, Check } from 'lucide-react';
import { format } from 'date-fns';
import { toast, Toaster } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInstaContext } from '@/hooks/useInstaContext';
import Chat from './Chat';


function Issue() {
    const { user } = useInstaContext()
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resolveMessage, setResolveMessage] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    const [isChatModalOpen, setIsChatModalOpen] = useState(false);


    useEffect(() => {
        const fetchIssue = async () => {
            try {
                const response = await axiosInstance.get(`/support/issue/${id}`);
                setIssue(response.data.data);
            } catch (err) {
                setError('Failed to load issue. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (id && !isNaN(id)) {
            fetchIssue();
        } else {
            setError('Invalid issue ID');
            setLoading(false);
        }
    }, [id]);

    const resolveIssue = async () => {
        try {
            const response = await axiosInstance.post(`/support/resolve/${id}`, { resolve_message: resolveMessage });
            setIssue(response.data.data);
            setIsModalOpen(false);
            toast.success('Issue resolved successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to resolve issue');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2" size={20} />
                Back
            </Button>
            {issue && issue.id && (
                <Card className="p-6 bg-gray-800 text-white shadow-lg rounded-lg">
                    <CardHeader className="pb-4 border-b border-gray-700">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-2xl font-bold flex items-center">
                                <AlertCircle className="mr-3 text-blue-400" size={24} />
                                {issue.type}
                            </CardTitle>
                            <div className="flex items-center text-sm text-gray-400">
                                <Clock className="mr-2" size={16} />
                                {format(new Date(issue.createdAt), 'PPpp')}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2 flex items-center">
                                <FileText className="mr-2 text-green-400" size={20} />
                                Description
                            </h3>
                            <p className="text-gray-300">{issue.description}</p>
                        </div>
                        {issue.screenshotUrl?.trim() !== "" && issue.screenshotUrl && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2 flex items-center">
                                    <Image className="mr-2 text-purple-400" size={20} />
                                    Screenshot
                                </h3>
                                <img src={issue.screenshotUrl} alt="Issue Screenshot" className="max-w-full max-h-96 rounded-md border border-gray-700 h-auto mb-2" />
                                <a className='text-blue-400  hover:text-blue-300 text-sm flex items-center' href={issue.screenshotUrl} download>
                                    <Download size={16} className="mr-1" />
                                    Download Screenshot
                                </a>
                            </div>
                        )}
                        <div className="flex items-center mb-4">
                            <Tag className="mr-2 text-yellow-400" size={20} />
                            <span className="font-semibold">Status: <span className="text-yellow-400">{issue.state}</span></span>
                        </div>
                        <div className="mt-4 p-3 bg-gray-800 m-2 rounded-md text-sm">
                            <span className="font-bold">Ticket ID:</span> <span className="text-blue-400">{"#" + issue.id}</span>
                            {issue.state !== "Resolved" ? <p className="mt-2 text-gray-300">Your ticket has been generated and being processed.</p>
                                :
                                <p>
                                    <b>Resolve Message : </b> {issue.resolve_message}
                                </p>
                            }
                        </div>

                        <div className="flex space-x-4">
                            {(issue.state === 'Pending') && (
                                <Button
                                    variant="outline" className="flex-1 bg-green-500 text-white hover:bg-green-600"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Resolve
                                </Button>
                            )}

                            <Button variant="outline" className="flex-1 bg-blue-500 text-white hover:bg-blue-600" onClick={() => setIsChatModalOpen(true)}>
                                <MessagesSquare className="w-4 h-4 mr-2" />
                                {issue.state === "Pending" ? "Chat" : "Chat History"}
                            </Button>
                        </div>


                        {issue.state === "Resolved" && (
                            <div className="mt-6 bg-gray-700 p-4 rounded-md">
                                <h3 className="text-lg font-semibold mb-2 flex items-center">
                                    <CheckCircle className="mr-2 text-green-400" size={20} />
                                    Resolved
                                </h3>
                            </div>
                        )}

                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="flex items-center">
                                        <MessagesSquare className="mr-2 h-5 w-5" />
                                        Resolve Issue
                                    </DialogTitle>
                                </DialogHeader>
                                <Select onValueChange={setResolveMessage}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select resolve message" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Issue resolved successfully">Issue resolved successfully</SelectItem>
                                        <SelectItem value="Problem fixed as requested">Problem fixed as requested</SelectItem>
                                        <SelectItem value="Made request accedently">Made request accedently</SelectItem>
                                        <SelectItem value="No need to resolve the issue anymore">No need to resolve the issue anymore</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button onClick={resolveIssue}>Submit</Button>
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
                                        issue_id={issue.id}
                                        user_id={issue?.user_id}
                                        onClose={() => setIsChatModalOpen(false)}
                                        user={user}
                                    />

                                </DialogContent>
                            </Dialog>
                        )}


                    </CardContent>
                </Card>
            )}

            <Toaster position="top-center" reverseOrder={false} />
        </div>
    );
}

export default Issue;
