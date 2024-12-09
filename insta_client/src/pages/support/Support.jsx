import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axios';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, PlusCircle, MessageSquare, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast, Toaster } from 'react-hot-toast';
import { useInstaContext } from '@/hooks/useInstaContext';

function Support() {

    // modal open state
    const [open, setOpen] = useState(false);

    const { user } = useInstaContext();
    const navigate = useNavigate();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({all: 0, pending: 0,  resolved: 0 });
    const [newIssue, setNewIssue] = useState({ type: '', description: '', image: null });
    const [previewImage, setPreviewImage] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        try {
            const response = await axiosInstance.get('support/issues?user_id=' + user.user_id);
            setIssues(response.data.data.issues);
            setStats({
                all: response.data.data.count,
                pending: response.data.data.pending,
                resolved: response.data.data.resolved
            });
        } catch (error) {
            console.error('Error fetching issues:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNewIssueSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('type', newIssue.type);
            formData.append('description', newIssue.description);
            formData.append('user_id', user.user_id);
            if (newIssue.image) {
                formData.append('screenshot', newIssue.image);
            }
            await axiosInstance.post('support/add-issue', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchIssues();
            setNewIssue({ type: '', description: '', image: null });
            setPreviewImage(null);
            toast.success('Issue submitted successfully');
        } catch (error) {
            toast.error(error.response.data.message || 'Error submitting new issue');
            console.error('Error submitting new issue:', error);
        } finally {
            setOpen(false);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!newIssue.type) errors.type = "Issue type is required";
        if (!newIssue.description) errors.description = "Description is required";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewIssue({ ...newIssue, image: file });
        setPreviewImage(URL.createObjectURL(file));
    };

    const renderIssueList = (status) => {
        const filteredIssues = status === 'all'
            ? issues
            : issues.filter((issue) => issue.state.toLowerCase() === status);

        return filteredIssues.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIssues.map(issue => (
                    <Card
                        key={issue.id}
                        className="bg-gray-800 hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <div className="p-5">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center space-x-2">
                                    {issue.state.toLowerCase() === 'pending' ? (
                                        <Clock className="text-yellow-500" size={20} />
                                    ) : (
                                        <CheckCircle className="text-green-500" size={20} />
                                    )}
                                    <span className="font-semibold text-lg text-white">{issue.type}</span>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {format(new Date(issue.createdAt), 'MMM d, yyyy')}
                                </span>
                            </div>
                            <p className="text-gray-300 mb-4 line-clamp-2">{issue.description}</p>
                            <div className="flex justify-between items-center">
                                <Button
                                    variant="outline"
                                    className="text-blue-400 hover:text-blue-300 border-blue-400 hover:border-blue-300"
                                    onClick={() => navigate(`/settings/support/issue/${issue.id}`)}
                                >
                                    <MessageSquare className="mr-2" size={16} />
                                    View Details
                                </Button>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    issue.state.toLowerCase() === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'
                                }`}>
                                    {issue.state}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-800 rounded-lg shadow-md">
                <AlertCircle className="text-gray-400 mb-4" size={64} />
                <h3 className="text-xl text-gray-200 font-semibold mb-2">No {status} issues found</h3>
                <p className="text-sm text-gray-400 text-center max-w-md">
                    {status === 'all' 
                        ? "You haven't submitted any issues yet. Click 'New Issue' to get started."
                        : `There are currently no issues in the ${status} state.`}
                </p>
            </div>
        );
    };

    return (
        <div className='w-full p-4'>
            <Button variant="secondary" onClick={() => navigate('/settings')} className="mb-4"><ArrowLeft className="mr-2" size={16} />Back</Button>

            <Dialog open={open} onOpenChange={setOpen} >
                <DialogTrigger asChild>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        {/* <DialogTitle>New Issue</DialogTitle> */}
                    </DialogHeader>
                    <form onSubmit={handleNewIssueSubmit}>
                        <Select onValueChange={(value) => setNewIssue({ ...newIssue, type: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select issue type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Login Issue">Login Issue</SelectItem>
                                <SelectItem value="Have Account Issue">Account Issue</SelectItem>
                                <SelectItem value="Forgot 2FA Code">Forgot 2FA Code</SelectItem>
                                <SelectItem value="Report a Bug">Report a Bug</SelectItem>
                                <SelectItem value="New Feature Request">Feature Request</SelectItem>
                            </SelectContent>
                        </Select>
                        {formErrors.type && <p className="text-red-500 text-sm mt-1"><AlertCircle className="inline mr-1" size={16} />{formErrors.type}</p>}
                        <Textarea
                            placeholder="Describe your issue"
                            value={newIssue.description}
                            onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                            className="mt-4"
                        />
                        {formErrors.description && <p className="text-red-500 text-sm mt-1"><AlertCircle className="inline mr-1" size={16} />{formErrors.description}</p>}
                        <Label htmlFor="image" className="mt-4 block">Upload Screenshot</Label>
                        <Input id="image" type="file" onChange={handleImageChange} className="mt-2" />
                        {previewImage && <img src={previewImage} alt="Preview" className="mt-4 max-w-full h-auto" />}
                        <Button type="submit" className="mt-4">Submit Issue</Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Button onClick={() => setOpen(true)} className="mb-4 ml-4"><PlusCircle className="mr-2" size={16} />Raise New Issue</Button>


            <div className='flex justify-center w-full mt-5'>
                <Tabs defaultValue="all" className="w-full max-w-3xl">
                    <TabsList className="w-full justify-between">
                        <TabsTrigger value="all" className="flex-1 flex items-center justify-center">
                            <Clock className="mr-2" size={16} />
                            all ({stats.all})
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="flex-1 flex items-center justify-center">
                            <AlertCircle className="mr-2" size={16} />
                            Pending ({stats.pending})
                        </TabsTrigger>
                        <TabsTrigger value="resolved" className="flex-1 flex items-center justify-center">
                            <CheckCircle className="mr-2" size={16} />
                            Resolved ({stats.resolved})
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">{renderIssueList('all')}</TabsContent>
                    <TabsContent value="pending">{renderIssueList('pending')}</TabsContent>
                    <TabsContent value="resolved">{renderIssueList('resolved')}</TabsContent>
                </Tabs>
            </div>
            <Toaster position="top-center" reverseOrder={false} />

        </div>
    );
}

export default Support;
