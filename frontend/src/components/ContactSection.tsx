import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WHATSAPP_URL } from "@/lib/contact";
import { BRAND } from "@/lib/brand";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Navigation, 
  Car,
  Bus,
  Train,
  Home,
  Wifi,
  Shield,
  Stethoscope
} from "lucide-react";

const ContactSection = () => {
  const openMaps = () => {
    window.open("https://maps.app.goo.gl/zLogSQaep5GKxDGr9", "_blank");
  };

  const makeCall = () => {
    window.location.href = "tel:+917905152928";
  };

  const sendWhatsApp = () => {
    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="contact" className="border-y border-border/50 bg-gradient-secondary py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Visit Our Home Clinic
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Easily accessible location with convenient parking and all modern medical facilities
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-6">
              {/* Main Contact Card */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Get In Touch</CardTitle>
                  <CardDescription>
                    Contact us for appointments, emergencies, or general inquiries
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-center space-x-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Phone & WhatsApp</p>
                      <p className="text-muted-foreground">+91 7905152928</p>
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" onClick={makeCall}>
                        Call
                      </Button>
                      <Button variant="medical" size="sm" onClick={sendWhatsApp}>
                        WhatsApp
                      </Button>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center space-x-4 p-4 bg-accent/5 rounded-lg border border-accent/10">
                    <div className="bg-accent/20 p-3 rounded-full">
                      <Mail className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Email</p>
                      <p className="text-muted-foreground">drjsp@gmail.com</p>
                    </div>
                  </div>

                  {/* Clinic Hours */}
                  <div className="p-4 bg-secondary/50 rounded-lg border border-secondary/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <Clock className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Clinic Hours</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monday - Friday</span>
                        <span className="font-medium text-foreground">9:00 AM - 7:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Saturday</span>
                        <span className="font-medium text-foreground">9:00 AM - 5:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sunday</span>
                        <span className="font-medium text-destructive">Closed</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-secondary/30">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          <Home className="h-3 w-3 mr-1" />
                          Quality Healthcare
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Wifi className="h-3 w-3 mr-1" />
                          Teleconsult 24/7
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Consultation Fees */}
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Consultation Fees</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">First Visit</span>
                        <span className="font-medium text-foreground">₹499</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Follow-up (4 days)</span>
                        <span className="font-medium text-success">Free</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Repeat Visit</span>
                        <span className="font-medium text-foreground">₹400-450</span>
                      </div>
                      <div className="pt-2 border-t border-primary/20">
                        <div className="text-xs text-muted-foreground">
                          <p className="font-medium mb-1">📦 Subscription Plans:</p>
                          <p>• Weekly (3 visits): ₹999</p>
                          <p>• Bi-Weekly (4-5 visits): ₹1,799</p>
                          <p>• Monthly (7-8 visits): ₹3,499-3,699</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="shadow-card border-destructive/20 bg-destructive/5">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="h-5 w-5 text-destructive" />
                    <h3 className="font-semibold text-foreground">Emergency Contact</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    For medical emergencies outside clinic hours, please call:
                  </p>
                  <Button variant="destructive" onClick={makeCall} className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Emergency: +91 7905152928
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Available 24/7 for existing patients
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Location & Directions */}
            <div className="space-y-6">
              {/* Address */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>Clinic Location</span>
                  </CardTitle>
                  <CardDescription>
                    Conveniently located home clinic with easy access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-foreground">
                    <p className="font-semibold">{BRAND.fullName}</p>
                    <p className="text-muted-foreground">
                      H-20, Rapti Nagar, Phase-4<br />
                      Gorakhpur - 273013<br />
                      Uttar Pradesh, India
                    </p>
                  </div>

                  <Button variant="appointment" onClick={openMaps} className="w-full">
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>

                  {/* Nearby Landmarks */}
                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium text-foreground mb-3">Nearby Landmarks</h4>
                                      <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Near Sanjeev Singh's Clinic</p>
                    <p>• Backgate of LFS Raptinagar</p>
                    <p>• Near to Rana Hospital Road</p>
                    {/* <p>• 2 minutes walk from main road</p> */}
                  </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transportation Options */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>How to Reach</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <Train className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">Train</p>
                      <p className="text-xs text-muted-foreground">Gorakhpur Junction</p>
                      <p className="text-xs text-muted-foreground">7km away</p>
                    </div>
                    {/* <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <Bus className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">Bus</p>
                      <p className="text-xs text-muted-foreground">Route 123, 456</p>
                      <p className="text-xs text-muted-foreground">Main Road Stop</p>
                    </div> */}
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <Car className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">Car</p>
                      <p className="text-xs text-muted-foreground">Free Parking</p>
                      <p className="text-xs text-muted-foreground">Available</p>
                    </div>
                  </div>

                  <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                    <h4 className="font-medium text-foreground mb-2">Parking Information</h4>
                    <p className="text-sm text-muted-foreground">
                      Free parking available in front of the clinic. Street parking also available. 
                      {/* Wheelchair accessible entrance. */}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <Card className="shadow-card">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 h-64 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                      <p className="text-foreground font-medium">Interactive Map</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Click below to open in Google Maps
                      </p>
                      <Button variant="outline" onClick={openMaps}>
                        <Navigation className="h-4 w-4 mr-2" />
                        View on Maps
                      </Button>
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

export default ContactSection;
