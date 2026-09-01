import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import { User, Mail, Phone, MapPin, Lock, Save, Eye, EyeOff, Calendar as CalendarIcon, Video, FileText, CreditCard, Upload, Clock, X, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

function formatPaymentMethodLabel(method: string): string {
  if (method === "QR_SCAN") return "QR scan";
  return method;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  createdAt: string;
  lastLoginAt: string;
  active: boolean;
}

interface Appointment {
  id: string;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  appointment_status: string;
  consultation_type: string;
  consultation_fee: number;
  symptoms: string;
  created_at: string;
}

interface VideoCall {
  id: string;
  appointment_id: string | null;
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

interface Payment {
  id: string;
  type: string;
  date: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  description: string;
  created_at: string;
}

interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_url: string;
  file_size: string;
  description: string;
  uploaded_at: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Appointments state
  const [appointments, setAppointments] = useState<{upcoming: Appointment[], past: Appointment[]}>({upcoming: [], past: []});
  const [videoCalls, setVideoCalls] = useState<VideoCall[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  // Reschedule state
  const [rescheduleDate, setRescheduleDate] = useState<Date>();
  const [rescheduleTime, setRescheduleTime] = useState<string>("");
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState<string | null>(null);

  // Document upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("OTHER");
  const [documentDescription, setDocumentDescription] = useState("");

  useEffect(() => {
    fetchProfile();
    fetchAppointments();
    fetchVideoCalls();
    fetchPayments();
    fetchDocuments();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth');
        return;
      }

      const response = await fetch('http://localhost:8000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setProfileForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || ""
        });
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth');
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/appointments/my-appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchVideoCalls = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/video-calls/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVideoCalls(data);
      }
    } catch (error) {
      console.error("Error fetching video calls:", error);
    }
  };

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/payments/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/documents/my-documents', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileForm),
      });

      const data = await response.json();
      
      if (data.success !== false) {
        toast({
          title: "Profile Updated!",
          description: "Your profile has been updated successfully.",
        });
        fetchProfile();
      } else {
        toast({
          title: "Update Failed",
          description: data.message || "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordForm),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Password Changed!",
          description: "Your password has been changed successfully.",
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        toast({
          title: "Password Change Failed",
          description: data.detail || data.message || "Failed to change password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "Password Change Failed",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleDate || !rescheduleTime || !rescheduleAppointmentId) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const [hours, minutes] = rescheduleTime.split(':');
      const newDateTime = new Date(rescheduleDate);
      newDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const response = await fetch(
        `http://localhost:8000/api/appointments/${rescheduleAppointmentId}/reschedule`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            new_date: newDateTime.toISOString(),
            new_time: rescheduleTime,
          }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Appointment Rescheduled!",
          description: "Your appointment has been rescheduled successfully.",
        });
        setRescheduleAppointmentId(null);
        setRescheduleDate(undefined);
        setRescheduleTime("");
        fetchAppointments();
      } else {
        toast({
          title: "Reschedule Failed",
          description: data.detail || "Failed to reschedule appointment.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error rescheduling:", error);
      toast({
        title: "Reschedule Failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDocumentUpload = async () => {
    if (!uploadFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('document_name', documentName || uploadFile.name);
      formData.append('document_type', documentType);
      if (documentDescription) {
        formData.append('description', documentDescription);
      }

      const response = await fetch('http://localhost:8000/api/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Document Uploaded!",
          description: "Your document has been uploaded successfully.",
        });
        setUploadFile(null);
        setDocumentName("");
        setDocumentType("OTHER");
        setDocumentDescription("");
        fetchDocuments();
      } else {
        toast({
          title: "Upload Failed",
          description: data.detail || "Failed to upload document.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error uploading document:", error);
    toast({
        title: "Upload Failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Document Deleted!",
          description: "Document has been deleted successfully.",
        });
        fetchDocuments();
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete document.",
        variant: "destructive",
    });
    }
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      COMPLETED: "default",
      CONFIRMED: "default",
      SCHEDULED: "outline",
      ONGOING: "secondary",
      CANCELLED: "destructive",
      EXPIRED: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AuthenticatedNavbar />
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and medical records</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 h-auto">
              <TabsTrigger value="profile" className="text-xs md:text-sm py-2 px-2 md:px-4">Profile</TabsTrigger>
              <TabsTrigger value="appointments" className="text-xs md:text-sm py-2 px-2 md:px-4">Appointments</TabsTrigger>
              <TabsTrigger value="video-calls" className="text-xs md:text-sm py-2 px-2 md:px-4">Video Calls</TabsTrigger>
              <TabsTrigger value="documents" className="text-xs md:text-sm py-2 px-2 md:px-4">Documents</TabsTrigger>
              <TabsTrigger value="payments" className="text-xs md:text-sm py-2 px-2 md:px-4">Payments</TabsTrigger>
              <TabsTrigger value="security" className="text-xs md:text-sm py-2 px-2 md:px-4">Security</TabsTrigger>
          </TabsList>

            {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-background/80 backdrop-blur-md border-primary/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                            className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                            disabled
                            className="pl-10 bg-muted"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="address"
                          type="text"
                          value={profileForm.address}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                            className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                    <Button type="submit" disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {appointments.upcoming.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No upcoming appointments</p>
                    ) : (
                      <div className="space-y-4">
                        {appointments.upcoming.map((apt) => (
                          <Card key={apt.id} className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CalendarIcon className="h-4 w-4 text-primary" />
                                  <span className="font-semibold">{format(new Date(apt.appointment_date), "PPP")}</span>
                                  <span className="text-muted-foreground">{apt.appointment_time}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs font-mono">
                                    ID: {apt.id.substring(0, 8)}...
                                  </Badge>
                                  <p className="text-sm text-muted-foreground">{apt.consultation_type}</p>
                                </div>
                                {apt.symptoms && <p className="text-sm">Symptoms: {apt.symptoms}</p>}
                                <p className="text-sm font-semibold mt-2">Fee: ₹{apt.consultation_fee}</p>
                              </div>
                              <div className="flex flex-col gap-2 items-end">
                                {getStatusBadge(apt.appointment_status)}
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setRescheduleAppointmentId(apt.id);
                                        setRescheduleDate(new Date(apt.appointment_date));
                                        setRescheduleTime(apt.appointment_time || "");
                                      }}
                                    >
                                      Reschedule
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Reschedule Appointment</DialogTitle>
                                      <DialogDescription>
                                        Select a new date and time for your appointment
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Select Date</Label>
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !rescheduleDate && "text-muted-foreground")}>
                                              <CalendarIcon className="mr-2 h-4 w-4" />
                                              {rescheduleDate ? format(rescheduleDate, "PPP") : "Pick a date"}
                                            </Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={rescheduleDate} onSelect={setRescheduleDate} disabled={(date) => date < new Date()} />
                                          </PopoverContent>
                                        </Popover>
                                      </div>
                                      <div>
                                        <Label>Select Time</Label>
                                        <Select value={rescheduleTime} onValueChange={setRescheduleTime}>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select time" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {timeSlots.map((time) => (
                                              <SelectItem key={time} value={time}>{time}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <Button onClick={handleReschedule} className="w-full">Confirm Reschedule</Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Past Appointments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {appointments.past.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No past appointments</p>
                    ) : (
                      <div className="space-y-4">
                        {appointments.past.map((apt) => (
                          <Card key={apt.id} className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <CalendarIcon className="h-4 w-4 text-primary" />
                                  <span className="font-semibold">{format(new Date(apt.appointment_date), "PPP")}</span>
                                  <span className="text-muted-foreground">{apt.appointment_time}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs font-mono">
                                    ID: {apt.id.substring(0, 8)}...
                                  </Badge>
                                  <p className="text-sm text-muted-foreground">{apt.consultation_type}</p>
                                </div>
                                <p className="text-sm font-semibold mt-2">Fee: ₹{apt.consultation_fee}</p>
                              </div>
                              {getStatusBadge(apt.appointment_status)}
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Video Calls Tab */}
            <TabsContent value="video-calls">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-primary" />
                    Video Call History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {videoCalls.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No video calls yet</p>
                  ) : (
                    <div className="space-y-4">
                      {videoCalls.map((call) => (
                        <Card key={call.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Video className="h-4 w-4 text-primary" />
                                <span className="font-semibold">{format(new Date(call.scheduled_start_time), "PPP 'at' p")}</span>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                {call.appointment_id && (
                                  <Badge variant="outline" className="text-xs font-mono">
                                    Appointment ID: {call.appointment_id.substring(0, 8)}...
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs font-mono">
                                  Call ID: {call.id.substring(0, 8)}...
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {call.actual_duration_seconds 
                                    ? `${Math.floor(call.actual_duration_seconds / 60)}m ${call.actual_duration_seconds % 60}s`
                                    : `${call.duration_minutes} min`}
                                </span>
                                <span>₹{call.consultation_fee}</span>
                              </div>
                            </div>
                            {getStatusBadge(call.call_status)}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Upload Document
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Select File</Label>
                      <Input
                        type="file"
                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Document Name</Label>
                      <Input
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        placeholder="Enter document name"
                      />
                    </div>
                    <div>
                      <Label>Document Type</Label>
                      <Select value={documentType} onValueChange={setDocumentType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRESCRIPTION">Prescription</SelectItem>
                          <SelectItem value="REPORT">Report</SelectItem>
                          <SelectItem value="XRAY">X-Ray</SelectItem>
                          <SelectItem value="LAB">Lab Test</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Description (Optional)</Label>
                      <Input
                        value={documentDescription}
                        onChange={(e) => setDocumentDescription(e.target.value)}
                        placeholder="Add description"
                      />
                    </div>
                    <Button onClick={handleDocumentUpload} disabled={!uploadFile}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>My Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {documents.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No documents uploaded</p>
                    ) : (
                      <div className="space-y-4">
                        {documents.map((doc) => (
                          <Card key={doc.id} className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText className="h-4 w-4 text-primary" />
                                  <span className="font-semibold">{doc.document_name}</span>
                                  <Badge variant="outline">{doc.document_type}</Badge>
                                </div>
                                {doc.description && <p className="text-sm text-muted-foreground mb-1">{doc.description}</p>}
                                <p className="text-xs text-muted-foreground">
                                  {doc.file_size} • {format(new Date(doc.uploaded_at), "PPP")}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => window.open(`http://localhost:8000${doc.file_url}`, '_blank')}>
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteDocument(doc.id)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {payments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No payments found</p>
                  ) : (
                    <div className="space-y-4">
                      {payments.map((payment) => (
                        <Card key={payment.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={payment.type === "VIDEO_CALL" ? "default" : "secondary"}>
                                  {payment.type === "VIDEO_CALL" ? "Video Call" : "Appointment"}
                                </Badge>
                                <span className="font-semibold">₹{payment.amount}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">{payment.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{format(new Date(payment.date), "PPP")}</span>
                                <span>{formatPaymentMethodLabel(payment.payment_method)}</span>
                              </div>
                            </div>
                            <Badge variant={payment.payment_status === "COMPLETED" ? "default" : "outline"}>
                              {payment.payment_status}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
          <TabsContent value="security">
            <Card className="bg-background/80 backdrop-blur-md border-primary/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      >
                          {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                    <Button type="submit" disabled={saving}>
                      <Lock className="h-4 w-4 mr-2" />
                      {saving ? "Changing..." : "Change Password"}
                    </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
