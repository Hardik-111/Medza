import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Stethoscope, Clock, MapPin } from "lucide-react";
import { BRAND } from "@/lib/brand";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Book Appointment", href: "#appointment" },
    { name: "Reviews", href: "#reviews" },
    { name: "Contact", href: "#contact" }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center md:justify-between items-center text-sm gap-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 7905152928</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Mon-Sat: 9AM - 7PM</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Gorakhpur, Uttar Pradesh | Quality Healthcare</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{BRAND.navbarName}</h1>
                <p className="text-xs text-muted-foreground">Home Clinic</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.slice(0, -2).map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  {link.name}
                </button>
              ))}
              {navLinks.slice(-2).map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = "tel:+917905152928"}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
              <Button 
                variant="appointment" 
                size="sm"
                onClick={() => scrollToSection("#appointment")}
              >
                Book Appointment
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="bg-gradient-primary p-2 rounded-lg">
                    <Stethoscope className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{BRAND.navbarName}</h2>
                    <p className="text-sm text-muted-foreground">Home Clinic</p>
                  </div>
                </div>

                <nav className="space-y-4">
                  {navLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => scrollToSection(link.href)}
                      className="block w-full text-left py-3 px-4 text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors font-medium"
                    >
                      {link.name}
                    </button>
                  ))}
                </nav>

                <div className="space-y-3 mt-8 pt-8 border-t border-border">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      window.location.href = "tel:+917905152928";
                      setIsOpen(false);
                    }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                  <Button 
                    variant="appointment" 
                    className="w-full"
                    onClick={() => scrollToSection("#appointment")}
                  >
                    Book Appointment
                  </Button>
                </div>

                <div className="mt-8 pt-8 border-t border-border text-center">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center justify-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>+91 7905152928</span>
                    </p>
                    <p className="flex items-center justify-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Mon-Sat: 9AM - 7PM</span>
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;