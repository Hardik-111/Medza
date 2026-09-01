import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Stethoscope, Clock, MapPin, User, LogOut, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BRAND } from "@/lib/brand";

const AuthenticatedNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if we're on the dashboard
  const isDashboard = location.pathname === '/dashboard';

  const navLinks = [
    { name: "Home", href: "#home", hasDropdown: false, isRoute: false },
    { name: "Plans", href: "/plans", hasDropdown: false, isRoute: true },
    { name: "Appointments", href: "/appointments", hasDropdown: false, isRoute: true },
    { name: "About", href: "/about", hasDropdown: false, isRoute: true },
    { name: "Reviews", href: "#reviews", hasDropdown: false, isRoute: false },
    { name: "Contact", href: "#contact", hasDropdown: false, isRoute: false }
  ];

  const [servicesHover, setServicesHover] = useState(false);

  const scrollToSection = (href: string, isRoute: boolean = false) => {
    if (isRoute) {
      navigate(href);
      setIsOpen(false);
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Show logout confirmation
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    // Close mobile menu if open
    setIsOpen(false);
    
    // Redirect to home page
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const handleProfile = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
    setIsOpen(false);
  };

  return (
    <>
      {/* Top Bar - Only show on dashboard */}
      {isDashboard && (
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
      )}

      {/* Main Navigation */}
      <header className="glass-navbar sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Clickable */}
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="bg-foreground p-2 rounded-xl shadow-lg shadow-foreground/10">
                <Stethoscope className="h-6 w-6 text-background" />
              </div>
              <div className="text-left">
                <h1 className="text-lg md:text-xl font-bold text-foreground leading-tight">
                  {BRAND.navbarName}
                </h1>
                <p className="text-xs text-muted-foreground">Home Clinic</p>
              </div>
            </button>

            {/* Desktop Navigation - Only show on dashboard */}
            {isDashboard && (
              <>
                <nav className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
                  {navLinks.map((link) => {
                    if (link.hasDropdown) {
                      return (
                        <div
                          key={link.name}
                          className="relative"
                          onMouseEnter={() => setServicesHover(true)}
                          onMouseLeave={() => setServicesHover(false)}
                        >
                <button
                            onClick={() => scrollToSection(link.href, link.isRoute)}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium whitespace-nowrap flex items-center gap-1"
                >
                  {link.name}
                            <ChevronDown className="h-3 w-3" />
                          </button>
                          {servicesHover && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-md shadow-lg z-50 py-1">
                              <button
                                onClick={() => {
                                  scrollToSection("#services");
                                  setServicesHover(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                              >
                                Pricing Plans
                              </button>
                              <button
                                onClick={() => {
                                  scrollToSection("#appointment");
                                  setServicesHover(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                              >
                                Book Appointment
                              </button>
                              <button
                                onClick={() => {
                                  navigate('/video-call');
                                  setServicesHover(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                              >
                                Video Call Appointment
                </button>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return (
                <button
                  key={link.name}
                        onClick={() => scrollToSection(link.href, link.isRoute)}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium whitespace-nowrap"
                >
                  {link.name}
                </button>
                    );
                  })}
            </nav>

                {/* CTA Buttons - Only show on dashboard */}
                <div className="hidden lg:flex items-center space-x-2">
                  <ThemeToggle />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleProfile}
                    className="text-xs"
                  >
                    <User className="h-4 w-4 mr-1" />
                    Profile
                  </Button>
                  <Button 
                    variant="appointment" 
                    size="sm"
                    onClick={() => navigate("/appointments")}
                    className="text-xs"
                  >
                    Book
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLogout}
                    className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              </>
            )}

            {/* Simplified Navbar for non-dashboard pages */}
            {!isDashboard && (
              <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleProfile}
                  className="hidden md:flex"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
            )}

            {isDashboard && <div className="lg:hidden"><ThemeToggle /></div>}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <button
                  onClick={handleLogoClick}
                  className="flex items-center space-x-3 mb-8 w-full text-left hover:opacity-80 transition-opacity"
                >
                  <div className="bg-gradient-primary p-2 rounded-lg">
                    <Stethoscope className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{BRAND.navbarName}</h2>
                    <p className="text-sm text-muted-foreground">Home Clinic</p>
                  </div>
                </button>

                {/* Show nav links only on dashboard */}
                {isDashboard && (
                  <nav className="space-y-2 mb-6">
                    {navLinks.map((link) => {
                      if (link.hasDropdown) {
                        return (
                          <div key={link.name} className="space-y-1">
                            <button
                              onClick={() => scrollToSection(link.href, link.isRoute)}
                              className="block w-full text-left py-2 px-4 text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors font-medium text-sm flex items-center justify-between"
                            >
                              {link.name}
                              <ChevronDown className="h-4 w-4" />
                            </button>
                            <div className="pl-4 space-y-1">
                              <button
                                onClick={() => {
                                  scrollToSection("#services");
                                  setIsOpen(false);
                                }}
                                className="block w-full text-left py-2 px-4 text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors text-sm"
                              >
                                Pricing Plans
                              </button>
                              <button
                                onClick={() => {
                                  scrollToSection("#appointment");
                                  setIsOpen(false);
                                }}
                                className="block w-full text-left py-2 px-4 text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors text-sm"
                              >
                                Book Appointment
                              </button>
                              <button
                                onClick={() => {
                                  navigate('/video-call');
                                  setIsOpen(false);
                                }}
                                className="block w-full text-left py-2 px-4 text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors text-sm"
                              >
                                Video Call Appointment
                              </button>
                  </div>
                </div>
                        );
                      }
                      return (
                    <button
                      key={link.name}
                          onClick={() => scrollToSection(link.href, link.isRoute)}
                          className="block w-full text-left py-2 px-4 text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors font-medium text-sm"
                    >
                      {link.name}
                    </button>
                      );
                    })}
                </nav>
                )}

                <div className="space-y-2 pt-6 border-t border-border">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleProfile}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  {isDashboard && (
                  <Button 
                    variant="appointment" 
                    className="w-full"
                    onClick={() => navigate("/appointments")}
                  >
                    Book Appointment
                  </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>

                {isDashboard && (
                  <div className="mt-6 pt-6 border-t border-border text-center">
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
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};

export default AuthenticatedNavbar;
