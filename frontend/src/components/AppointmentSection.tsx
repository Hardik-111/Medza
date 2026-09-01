import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Phone, Video, MapPin, Stethoscope, Activity, Package, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
];

const consultationTypes = [
  { value: "first-visit", label: "First Visit", price: 499, icon: Stethoscope },
  { value: "followup-free", label: "Follow-up (4 days) - Free", price: 0, icon: Calendar },
  { value: "repeat-visit", label: "Repeat Visit", price: 400, icon: Activity },
  { value: "weekly-plan", label: "Weekly Plan (7 days, 3-4 visits)", price: 999, originalPrice: 1500, icon: Package },
  { value: "biweekly-plan", label: "Bi-Weekly Plan (14 days, 5 visits)", price: 1799, originalPrice: 2500, icon: Package },
  { value: "monthly-plan", label: "Monthly Plan (30 days, 7-8 visits)", price: 3499, originalPrice: 4000, icon: Package },
  { value: "video-quick", label: "Quick Video Consult (10 min)", price: 250, icon: Video },
  { value: "video-standard", label: "Standard Video Consult (15 min)", price: 400, icon: Video },
  { value: "video-detailed", label: "Detailed Video Consult (25 min)", price: 600, icon: Video },
  { value: "video-extended", label: "Extended Video Consult (30+ min)", price: 850, icon: Video }
];

const AppointmentSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    consultationType: "",
    date: "",
    time: "",
    symptoms: "",
  });

  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const appointmentData = {
        patient_name: formData.name,
        patient_phone: formData.phone,
        patient_email: formData.email || null,
        consultation_type: formData.consultationType,
        consultation_plan: formData.consultationType,
        appointment_date: `${formData.date}T00:00:00`,
        appointment_time: formData.time,
        symptoms: formData.symptoms,
        payment_method: "QR_SCAN",
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/appointments/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Appointment Booked Successfully!",
          description: result.message || "We'll confirm your appointment within 30 minutes via phone call.",
          duration: 5000,
        });
        
        // Reset form
        setFormData({
          name: "",
          phone: "",
          email: "",
          consultationType: "",
          date: "",
          time: "",
          symptoms: "",
        });
      } else {
        toast({
          title: "Booking Failed",
          description: result.message || "Please try again or contact us directly.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Booking Failed",
        description: "Network error. Please try again or contact us directly.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const selectedConsultation = consultationTypes.find(type => type.value === formData.consultationType);

  return (
    <section id="appointment" className="border-y border-border/50 bg-gradient-secondary py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Book Your Appointment
            </h2>
            <p className="text-lg text-muted-foreground">
              Schedule a consultation that fits your needs and timeline
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Appointment Form */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Schedule Consultation</CardTitle>
                <CardDescription>
                  Fill in your details and we'll confirm your appointment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 rounded-2xl border border-primary/25 bg-primary/10 p-4 text-center">
                  <Lock className="mx-auto h-5 w-5 text-primary" />
                  <p className="mt-2 font-semibold">Coming in a future release</p>
                  <p className="mt-1 text-sm text-muted-foreground">Online appointment booking is currently disabled.</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <fieldset disabled className="pointer-events-none space-y-6 opacity-50">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 7905152928"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>

                  {/* Consultation Type */}
                  <div className="space-y-2">
                    <Label htmlFor="consultation-type">Consultation Type *</Label>
                    <Select 
                      value={formData.consultationType} 
                      onValueChange={(value) => handleInputChange("consultationType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select consultation type" />
                      </SelectTrigger>
                      <SelectContent>
                        {consultationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center space-x-2">
                              <type.icon className="h-4 w-4" />
                              <span>{type.label} - ₹{type.price}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date and Time */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Preferred Time *</Label>
                      <Select 
                        value={formData.time} 
                        onValueChange={(value) => handleInputChange("time", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Symptoms / Reason for Visit</Label>
                    <Textarea
                      id="symptoms"
                      placeholder="Briefly describe your symptoms or reason for consultation"
                      value={formData.symptoms}
                      onChange={(e) => handleInputChange("symptoms", e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    variant="appointment" 
                    size="lg" 
                    className="w-full"
                    disabled={!formData.name || !formData.phone || !formData.consultationType || !formData.date || !formData.time}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    We'll call you within 30 minutes to confirm your appointment
                  </p>
                  </fieldset>
                </form>
              </CardContent>
            </Card>

            {/* Pricing & Info */}
            <div className="space-y-6">
              {/* Selected Consultation Info */}
              {selectedConsultation && (
                <Card className="shadow-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <selectedConsultation.icon className="h-5 w-5 text-primary" />
                      <span>{selectedConsultation.label}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          {selectedConsultation.price === 0 ? "Free" : `₹${selectedConsultation.price}`}
                        </span>
                        {selectedConsultation.originalPrice && (
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{selectedConsultation.originalPrice}
                            </span>
                            <span className="text-sm font-medium text-green-600">
                              Save ₹{selectedConsultation.originalPrice - selectedConsultation.price}
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary">
                        {selectedConsultation.value.includes("video") ? "Video Consultation" : 
                         selectedConsultation.value.includes("plan") ? "Subscription Plan" : 
                         selectedConsultation.value === "followup-free" ? "Free Follow-up" : "In-Person Visit"}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {selectedConsultation.value.includes("video") ? (
                        <>
                          <p>• Video call consultation from anywhere</p>
                          <p>• Digital prescription provided</p>
                          <p>• Link sent via SMS/Email</p>
                          <p>• Screen sharing for better diagnosis</p>
                        </>
                      ) : selectedConsultation.value.includes("plan") ? (
                        <>
                          <p>• Multiple visits included in package</p>
                          <p>• Priority booking available</p>
                          <p>• Comprehensive care coverage</p>
                          <p>• Cost-effective for regular patients</p>
                        </>
                      ) : (
                        <>
                          <p>• Complete physical examination</p>
                          <p>• Digital prescription provided</p>
                          <p>• Follow-up support available</p>
                          <p>• Modern clinic facilities</p>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Consultation Plans Overview */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-primary" />
                    <span>Consultation Plans Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h4 className="font-semibold text-foreground mb-2">Per-Visit Options</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• First Visit: ₹499</p>
                      <p>• Follow-up (within 4 days): Free</p>
                      <p>• Repeat Visit: ₹419-449</p>
                    </div>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <h4 className="font-semibold text-foreground mb-2">Subscription Plans</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center justify-between">
                        <span>• Weekly (7 days, 3-4 visits):</span>
                        <div className="text-right">
                          <span className="font-medium text-foreground">₹999</span>
                          <span className="text-xs text-muted-foreground line-through ml-1">₹1500</span>
                          <span className="text-xs text-green-600 ml-1">Save ₹501</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>• Bi-Weekly (14 days, 5 visits):</span>
                        <div className="text-right">
                          <span className="font-medium text-foreground">₹1,799</span>
                          <span className="text-xs text-muted-foreground line-through ml-1">₹2,500</span>
                          <span className="text-xs text-green-600 ml-1">Save ₹701</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>• Monthly (30 days, 7-8 visits):</span>
                        <div className="text-right">
                          <span className="font-medium text-foreground">₹3,499</span>
                          <span className="text-xs text-muted-foreground line-through ml-1">₹4,000</span>
                          <span className="text-xs text-green-600 ml-1">Save ₹501</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                    <h4 className="font-semibold text-foreground mb-2">Video Consultations</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Quick (10 min): ₹200-300</p>
                      <p>• Standard (15 min): ₹350-500</p>
                      <p>• Detailed (25 min): ₹500-700</p>
                      <p>• Extended (30+ min): ₹700-1,000</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground bg-background/50 p-3 rounded-lg">
                    <p className="font-medium mb-1">💡 Plan Benefits:</p>
                    <p>• Free follow-up within 4 days for same issue</p>
                    <p>• <span className="text-green-600 font-medium">Heavy discounts on subscription plans</span></p>
                    <p>• Save up to ₹701 on bi-weekly plans</p>
                    <p>• Video consultations for convenience</p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="shadow-card bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-4">Need Help?</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>+91 7905152928</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>Mon-Sat: 9AM - 7PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentSection;
