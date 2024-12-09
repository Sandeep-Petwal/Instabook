import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ticket, UserCircle, MessageSquare, Clock, Check, Home } from 'lucide-react';
import axiosInstance from '@/api/axios';

function Support() {
  document.title = "Support | InstaBook";

  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, [currentPage, activeTab]);

  const fetchTickets = async () => {
    try {
      const response = await axiosInstance.get(`/admin/tickets/get-all?type=${activeTab}&page=${currentPage}&limit=10`);
      setTickets(response.data.rows);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  const getStatusColor = (state) => {
    switch (state.toLowerCase()) {
      case 'pending': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      // case 'in_progress': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6">

      {/* back to settings button */}
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/')} className="bg-gray-600 hover:bg-gray-500">
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Support Tickets</h1>
      <Tabs defaultValue="all" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          {/* <TabsTrigger value="in_progress">In Progress</TabsTrigger> */}
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {tickets.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className={`
                    cursor-pointer 
                    transition-all 
                    duration-300 
                    ease-in-out 
                    hover:-translate-y-1 
                    hover:shadow-lg 
                    bg-red-600
                   `}
                  onClick={() => navigate(`/support/${ticket.id}`)}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Ticket #{ticket.id}
                    </CardTitle>
                    <Badge className={`${getStatusColor(ticket.state)}`}>
                      <div className="flex items-center gap-2 space-x-2">
                        {ticket.state === 'Resolved' && <Check className="w-4 h-4 text-green-500" />}
                        {ticket.state === 'Pending' && <Clock className="w-4 h-4 text-yellow-500" />}
                        {ticket.state}
                      </div>
                    </Badge>
                  </CardHeader>
                  <CardContent >
                    <div
                      onClick={() => navigate(`/users/${ticket.user.user_id}`)}
                      className="flex items-center space-x-4 mb-2">
                      <Avatar>
                        <AvatarImage src={ticket.user.profile_url} />
                        <AvatarFallback>{ticket.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{ticket.user.name}</p>
                        <p className="text-xs text-muted-foreground">{ticket.user.email}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{ticket.description.substring(0, 100)}...</p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="flex items-center"><Ticket className="w-4 h-4 mr-1" /> {ticket.type}</span>
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets</h3>
              <p className="mt-1 text-sm text-gray-500">There are no tickets in this category.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-6">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || tickets.length === 0}
        >
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || tickets.length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Support;
