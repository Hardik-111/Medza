import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Phone, Clock, MapPin, Award, Users, Heart, X, Stethoscope, Shield, Home, Star, Video } from "lucide-react";
import doctorImage from "@/assets/doctor-profile6.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BRAND } from "@/lib/brand";

const HeroSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Book Appointment", href: "#appointment" },
    { name: "Reviews", href: "#reviews" },
    { name: "Contact", href: "#contact" }
  ];

  const openMaps = () => {
    window.open("https://maps.app.goo.gl/zLogSQaep5GKxDGr9", "_blank");
  };
  
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };


  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-gradient-secondary py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Doctor Information */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                {BRAND.navbarName}
                <span className="block text-2xl lg:text-3xl text-primary font-normal mt-2">
                  MBBS, MD (Internal Medicine)
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                40+ Years of Trusted Healthcare Experience
              </p>
            </div>

            <div className="bg-background/50 backdrop-blur-sm rounded-xl p-6 shadow-card">
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Experience</p>
                    <p className="text-xs text-muted-foreground">40+ Years</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Patients Treated</p>
                    <p className="text-xs text-muted-foreground">10,000+</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Satisfaction</p>
                    <p className="text-xs text-muted-foreground">98%+</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Bringing decades of medical expertise to your doorstep with personalized, 
                  compassionate care in the comfort of a home clinic setting.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Button variant="appointment" size="lg" className="flex-1 sm:flex-none" onClick={() => scrollToSection("#appointment")}>
                    <Phone className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                  
                  <Button variant="outline" size="lg" className="flex-1 sm:flex-none" onClick={() => navigate('/video-call')}>
                    <Video className="h-4 w-4 mr-2" />
                    Video Consultation
                  </Button>
                  
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="trust" size="lg">
                        <MapPin className="h-4 w-4 mr-2" />
                        Get Directions
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                      <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                          <span className="flex items-center">
                            <MapPin className="h-5 w-5 text-primary mr-2" />
                            Dr. J.S.P Singh's Home Clinic
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsOpen(false)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        {/* Address Information */}
                        <div className="bg-primary/5 p-4 rounded-lg">
                          <h3 className="font-semibold text-foreground mb-2">Clinic Address:</h3>
                          <p className="text-muted-foreground">
                            H-20, Rapti Nagar, Phase-4<br />
                            Gorakhpur - 273013<br />
                            Uttar Pradesh, India
                          </p>
                          <div className="flex gap-3 mt-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={openMaps}
                              className="flex items-center"
                            >
                              <MapPin className="h-4 w-4 mr-2" />
                              Open in Google Maps
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText("H-20, Rapti Nagar, Phase-4, Gorakhpur - 273013, Uttar Pradesh, India");
                              }}
                            >
                              Copy Address
                            </Button>
                          </div>
                        </div>
                        
                        {/* Google Maps Iframe */}
                        <div className="relative w-full h-[400px] rounded-lg overflow-hidden border">
                          <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.1124144533455!2d83.3882193!3d26.804548999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3991451921c07d4f%3A0xceb370ba35552d0b!2sDr.%20J.S.P%20Singh&#39;s%20Home!5e0!3m2!1sen!2sin!4v1755346234865!5m2!1sen!2sin" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Dr. J.S.P Singh's Home Clinic Location"
                          />
                        </div>
                        
                        {/* Additional Information */}
                        <div className="text-sm text-muted-foreground">
                          <p><strong>Landmarks:</strong> Near Rapti Nagar Market, Opposite to Central Park</p>
                          <p><strong>Parking:</strong> Available on the main road</p>
                          <p><strong>Accessibility:</strong> 2 minutes walk from the main road</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Quick Contact Info */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="font-medium">+91 7905152928</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Mon-Sat: 9AM - 7PM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Quality Healthcare</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Doctor Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-card">
              <img
                src={doctorImage}
                alt={`${BRAND.shortName} — experienced medical professional`}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>
            
            {/* Floating Trust Badge */}
            <div className="absolute -bottom-6 -left-6 bg-background rounded-xl shadow-card p-4 border-l-4 border-primary">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">40+</div>
                <div className="text-xs text-muted-foreground">Years Serving</div>
                <div className="text-xs text-muted-foreground">The Community</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center bg-background/50 backdrop-blur-sm border-primary/20 hover:shadow-lg hover:scale-105 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer group">
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
              <Stethoscope className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">Comprehensive Care</h3>
            <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">Full spectrum medical services from diagnosis to treatment</p>
          </Card>

          <Card className="p-6 text-center bg-background/50 backdrop-blur-sm border-primary/20 hover:shadow-lg hover:scale-105 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer group">
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
              <Home className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">Health Monitoring</h3>
            <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">Continuous health tracking and monitoring</p>
          </Card>

          <Card className="p-6 text-center bg-background/50 backdrop-blur-sm border-primary/20 hover:shadow-lg hover:scale-105 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer group">
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">Trusted Service</h3>
            <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">40+ years of reliable healthcare in the community</p>
          </Card>

          <Card className="p-6 text-center bg-background/50 backdrop-blur-sm border-primary/20 hover:shadow-lg hover:scale-105 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer group">
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">Patient Satisfaction</h3>
            <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">98%+ patient satisfaction rate with personalized care</p>
          </Card>
        </div>

        {/* Call to Action Section */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-primary/5 border-primary/20 max-w-4xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Ready to Experience Quality Healthcare?
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Book your appointment today and receive personalized medical care from an experienced professional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="appointment" 
                size="lg" 
                onClick={() => scrollToSection("#appointment")}
                className="text-lg px-8 py-3"
              >
                <Phone className="h-5 w-5 mr-2" />
                Book Appointment Now
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open("tel:+917905152928")}
                className="text-lg px-8 py-3"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call +91 7905152928
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
