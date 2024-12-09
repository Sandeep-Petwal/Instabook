import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash2, ArrowLeft, Chrome, Globe } from "lucide-react";
import { FaFirefox, FaSafari } from "react-icons/fa";
import { toast } from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function ActiveSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const instabook_token = localStorage.getItem("insta_admin");
      const response = await axiosInstance.get(
        "/user/sessions",
        {},
        { headers: { instabook_token } }
      );
      setSessions(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Failed to load sessions");
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      await axiosInstance.delete(`/user/session/${sessionId}`);
      setSessions(
        sessions.filter((session) => session.session_id !== sessionId)
      );
      toast.success("Session deleted successfully");
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Failed to delete session");
    }
  };

  const deleteAllSessions = async () => {
    const currentSessionId = sessions.find(
      (session) => session.current
    )?.session_id;
    try {
      await axiosInstance.delete("/user/sessions", {
        data: { current_session_id: currentSessionId },
      });
      setSessions(
        sessions.filter((session) => session.session_id === currentSessionId)
      );
      toast.success("All other sessions deleted successfully");
    } catch (error) {
      console.error("Error deleting all sessions:", error);
      toast.error("Failed to delete all sessions");
    }
  };

  const getBrowserIcon = (userAgent) => {
    if (userAgent.includes("Chrome"))
      return <Chrome className="h-4 w-4 mr-2" />;
    if (userAgent.includes("Firefox"))
      return <FaFirefox className="h-4 w-4 mr-2" />;
    if (userAgent.includes("Safari"))
      return <FaSafari className="h-4 w-4 mr-2" />;
    return <Globe className="h-4 w-4 mr-2" />;
  };

  const trimUserAgent = (userAgent) => {
    return userAgent.split(" ")[0];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Button
        onClick={() => navigate("/settings")}
        variant="outline"
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Settings
      </Button>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="mb-4">
                Delete All Other Sessions
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all
                  other active sessions.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteAllSessions}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="space-y-4">
            {sessions.map((session) => (
              <Card
                key={session.session_id}
                className={`p-4 ${session.current ? "border-green-500" : ""}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold flex items-center">
                      {getBrowserIcon(session.userAgent)}
                      {trimUserAgent(session.userAgent)}
                    </p>
                    <p className="text-sm text-gray-500">{session.ip}</p>
                    <p className="text-sm text-gray-500">
                      Created at: {new Date(session.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!session.current && (
                    <Button
                      onClick={() => deleteSession(session.session_id)}
                      variant="ghost"
                      size="icon"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  {session.current && (
                    <span className="text-green-500 font-semibold">
                      Current Session
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ActiveSessions;
