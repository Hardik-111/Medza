import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Stethoscope, 
  Heart,
  Shield,
  Star,
  Users,
  Award,
  ChevronUp
} from "lucide-react";
import { BRAND } from "@/lib/brand";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Book Appointment", href: "#appointment" },
    { name: "Reviews", href: "#reviews" },
    { name: "Contact Us", href: "#contact" }
  ];

  return (
    <footer className="border-t border-border bg-gradient-to-br from-primary/[0.08] via-background to-accent/[0.06]">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Clinic Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-primary p-3 rounded-xl">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{BRAND.navbarName}</h3>
                <p className="text-sm text-muted-foreground">Home Clinic</p>
              </div>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed">
              Bringing 40+ years of trusted medical expertise to your doorstep with 
              personalized, compassionate healthcare in a comfortable home clinic setting.
            </p>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-xs">
                <Award className="h-3 w-3 mr-1" />
                40+ Years Experience
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                10,000+ Patients
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">4.9/5</span>
              <span className="text-xs text-muted-foreground">(500+ reviews)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="block text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-foreground">Consultation Plans</h4>
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm hover:text-primary transition-colors cursor-pointer">
                First Visit: ₹499
              </p>
              <p className="text-muted-foreground text-sm hover:text-primary transition-colors cursor-pointer">
                Follow-up (4 days): Free
              </p>
              <p className="text-muted-foreground text-sm hover:text-primary transition-colors cursor-pointer">
                Weekly Plan: ₹999
              </p>
              <p className="text-muted-foreground text-sm hover:text-primary transition-colors cursor-pointer">
                Monthly Plan: ₹3,499-3,699
              </p>
              <p className="text-muted-foreground text-sm hover:text-primary transition-colors cursor-pointer">
                Video Consultations Available
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-foreground">Contact Info</h4>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">+91 7905152928</p>
                  <p className="text-xs text-muted-foreground">Available 24/7 for emergencies</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">drjsp@gmail.com</p>
                  <p className="text-xs text-muted-foreground">For appointments & queries</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">H-20, Rapti Nagar, Phase-4</p>
                  <p className="text-xs text-muted-foreground">Gorakhpur - 273013, Uttar Pradesh</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Mon-Sat: 9AM - 7PM</p>
                  <p className="text-xs text-muted-foreground">Sunday: Closed</p>
                </div>
              </div>
            </div>

            <Button 
              variant="appointment" 
              size="sm" 
              className="w-full"
              onClick={() => scrollToSection("#appointment")}
            >
              <Heart className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="border-t border-border bg-gradient-secondary">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <Card className="p-6 bg-background/50 backdrop-blur-sm shadow-soft border-primary/10">
              <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
              <h5 className="font-semibold text-foreground mb-2">Secure & Private</h5>
              <p className="text-sm text-muted-foreground">
                Your medical records are encrypted and securely stored following healthcare privacy standards.
              </p>
            </Card>

            <Card className="p-6 bg-background/50 backdrop-blur-sm shadow-soft border-primary/10">
              <Award className="h-8 w-8 text-primary mx-auto mb-3" />
              <h5 className="font-semibold text-foreground mb-2">Certified & Experienced</h5>
              <p className="text-sm text-muted-foreground">
                MBBS, MD qualified with 40+ years of practice and thousands of satisfied patients.
              </p>
            </Card>

            <Card className="p-6 bg-background/50 backdrop-blur-sm shadow-soft border-primary/10">
              <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
              <h5 className="font-semibold text-foreground mb-2">Personalized Care</h5>
              <p className="text-sm text-muted-foreground">
                Individual attention and customized treatment plans for your unique health needs.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground text-center md:text-left">
              <p>© 2025 {BRAND.fullName}. All rights reserved.</p>
              <p className="mt-1">
                Licensed Medical Practitioner | Reg. No: DL-12345-MED | 
                <span className="ml-2">Privacy Policy | Terms of Service</span>
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className="text-muted-foreground hover:text-primary"
              >
                <ChevronUp className="h-4 w-4 mr-1" />
                Back to Top
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
