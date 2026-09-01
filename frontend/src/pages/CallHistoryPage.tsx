import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Clock, Calendar, CreditCard, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import { motion } from "framer-motion";

interface CallHistory {
  id: string;
  patient_name: string;
  scheduled_start_time: string;
  actual_start_time: string | null;
  actual_end_time: string | null;
  duration_minutes: number;
  actual_duration_seconds: number | null;
  call_status: string;
  consultation_fee: number;
  payment_status: string;
  payment_method: string | null;
  created_at: string;
}

const CallHistoryPage = () => {
  const [calls, setCalls] = useState<CallHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCallHistory();
  }, []);

  const fetchCallHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/video-calls/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCalls(data);
      }
    } catch (error) {
      console.error("Error fetching call history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      COMPLETED: "default",
      ONGOING: "secondary",
      SCHEDULED: "outline",
      CANCELLED: "destructive",
      EXPIRED: "destructive",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {status}
      </Badge>
    );
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading call history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AuthenticatedNavbar />
      <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="py-10 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Video Call History</h1>
          <p className="text-muted-foreground">View all your past and upcoming video consultations</p>
        </div>

        {calls.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No video calls found</p>
              <Button
                onClick={() => navigate('/video-call')}
                className="mt-4"
              >
                Book a Video Call
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {calls.map((call) => (
              <Card key={call.id} className="hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Video className="h-5 w-5 text-primary" />
                        {call.patient_name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Scheduled: {format(new Date(call.scheduled_start_time), "PPP 'at' p")}
                      </p>
                    </div>
                    {getStatusBadge(call.call_status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-semibold">
                          {call.actual_duration_seconds
                            ? formatDuration(call.actual_duration_seconds)
                            : `${call.duration_minutes} min`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-semibold">₹{call.consultation_fee}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {call.payment_status === "COMPLETED" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Payment</p>
                        <p className="font-semibold">{call.payment_status}</p>
                      </div>
                    </div>
                    {call.payment_method && (
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Method</p>
                          <p className="font-semibold">
                            {call.payment_method === "QR_SCAN" ? "QR scan" : call.payment_method}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {call.actual_start_time && call.actual_end_time && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Call started: {format(new Date(call.actual_start_time), "p")} • 
                        Ended: {format(new Date(call.actual_end_time), "p")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      </motion.main>
    </div>
  );
};

export default CallHistoryPage;
