import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Heart, 
  Activity, 
  Video, 
  Users,
  Clock,
  Shield,
  Calendar,
  Package
} from "lucide-react";
import PricingTablePDF from "./PricingTablePDF";

// Shared with the standalone Plans page.
// eslint-disable-next-line react-refresh/only-export-components
export const consultationPlans = [
  {
    icon: Stethoscope,
    title: "First Visit",
    description: "Comprehensive health assessment and diagnosis for new patients",
    price: "₹499",
    validity: "One appointment",
    visits: "1",
    features: ["Complete physical examination", "Medical history review", "Treatment plan", "Digital prescription"]
  },
  {
    icon: Calendar,
    title: "Follow-Up (4 days)",
    description: "Free follow-up consultation for the same health issue",
    price: "Free",
    validity: "4 days",
    visits: "1",
    features: ["Same issue consultation", "Progress review", "Treatment adjustment", "No additional charges"]
  },
  {
    icon: Activity,
    title: "Repeat Visit",
    description: "Consultation after 4 days or for new health issues",
    price: "₹400-450",
    validity: "After 4 days",
    visits: "1",
    features: ["New consultation", "Follow-up care", "Treatment review", "Reduced rate"]
  },
  {
    icon: Package,
    title: "Weekly Plan",
    description: "Short-term care for acute conditions requiring multiple visits",
    price: "₹999",
    originalPrice: "₹1,500",
    validity: "7 days",
    visits: "3-4",
    features: ["Acute condition management", "Recovery monitoring", "Treatment adjustment", "Save ₹501"]
  },
  {
    icon: Package,
    title: "Bi-Weekly Plan",
    description: "Medium-term care for chronic conditions and extended recovery",
    price: "₹1,799",
    originalPrice: "₹2,500",
    validity: "14 days",
    visits: "5",
    features: ["Chronic disease management", "Post-hospitalization care", "Regular monitoring", "Save ₹701"]
  },
  {
    icon: Package,
    title: "Monthly Plan",
    description: "Long-term care for regular monitoring and chronic conditions",
    price: "₹3,499",
    originalPrice: "₹4,000",
    validity: "30 days",
    visits: "7-8",
    features: ["Regular health monitoring", "Chronic condition care", "Priority booking", "Save ₹501"]
  }
];

// eslint-disable-next-line react-refresh/only-export-components
export const teleconsultPlans = [
  {
    icon: Video,
    title: "Quick Video Consult",
    description: "Brief consultation for minor queries and quick follow-ups",
    price: "₹200-300",
    duration: "Up to 10 min",
    features: ["Quick follow-up", "Minor health queries", "Prescription renewal", "Convenient access"]
  },
  {
    icon: Video,
    title: "Standard Video Consult",
    description: "Regular teleconsultation for common health issues",
    price: "₹350-500",
    duration: "10-20 min",
    features: ["Standard consultation", "Symptom assessment", "Treatment advice", "Digital prescription"]
  },
  {
    icon: Video,
    title: "Detailed Video Consult",
    description: "Comprehensive teleconsultation for complex health issues",
    price: "₹500-700",
    duration: "20-30 min",
    features: ["Detailed consultation", "Complex case review", "Treatment planning", "Follow-up scheduling"]
  },
  {
    icon: Video,
    title: "Extended Video Consult",
    description: "In-depth consultation for complex and chronic conditions",
    price: "₹700-1,000",
    duration: "30+ min",
    features: ["Extended consultation", "Chronic condition review", "Comprehensive care plan", "Family consultation"]
  }
];

const ServicesSection = () => {
  return (
    <section id="services" className="border-y border-border/50 bg-card/25 py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            🩺 Consultation Fee & Subscription Plans
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Transparent pricing with flexible plans designed to meet your healthcare needs. Choose from per-visit options or cost-effective subscription packages.
          </p>
        </div>

        {/* Consultation Plans */}
        <div className="mb-20">
          <h3 className="text-2xl font-semibold text-center mb-8 text-foreground flex items-center justify-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            In-Person Consultation Plans
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultationPlans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card key={plan.title} className="shadow-card hover:shadow-lg hover:scale-105 hover:border-primary/50 transition-all duration-300 group border-primary/20 cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto bg-gradient-primary p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gradient-trust transition-all duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors duration-300">{plan.title}</CardTitle>
                    <CardDescription className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{plan.price}</div>
                      {plan.originalPrice && (
                        <div className="flex items-center justify-center space-x-2 mt-1">
                          <span className="text-sm text-muted-foreground line-through">
                            {plan.originalPrice}
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            Save ₹{parseInt(plan.originalPrice.replace('₹', '').replace(',', '')) - parseInt(plan.price.replace('₹', '').replace(',', ''))}
                          </span>
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">Starting from</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center p-2 bg-primary/5 rounded-lg">
                        <div className="font-semibold text-foreground">Validity</div>
                        <div className="text-muted-foreground">{plan.validity}</div>
                      </div>
                      <div className="text-center p-2 bg-primary/5 rounded-lg">
                        <div className="font-semibold text-foreground">Visits</div>
                        <div className="text-muted-foreground">{plan.visits}</div>
                      </div>
                    </div>
                    
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-muted-foreground">
                          <Shield className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Teleconsult Plans */}
        <div className="mb-20">
          <h3 className="text-2xl font-semibold text-center mb-8 text-foreground flex items-center justify-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            Video Consultation Plans
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {teleconsultPlans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card key={plan.title} className="shadow-card hover:shadow-lg hover:scale-105 hover:border-accent/50 transition-all duration-300 group border-accent/20 cursor-pointer">
                  <CardHeader className="text-center pb-4">
                  <div className="mx-auto bg-gradient-primary p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gradient-trust transition-all duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors duration-300">{plan.title}</CardTitle>
                    <CardDescription className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent-foreground">{plan.price}</div>
                      <div className="text-sm text-muted-foreground">Duration: {plan.duration}</div>
                    </div>
                    
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-muted-foreground">
                          <Shield className="h-4 w-4 text-accent-foreground mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* How to Use Plans */}
        <div className="bg-gradient-secondary rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">🔑 How These Plans Fit Together</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-background/50 rounded-xl">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Occasional Patients</h4>
              <p className="text-sm text-muted-foreground">
                Pay per-visit at ₹499 with free follow-up within 4 days
              </p>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-xl">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Short-Term Care</h4>
              <p className="text-sm text-muted-foreground">
                Weekly plan @ ₹999 (was ₹1,500) for acute conditions needing 3-4 visits
              </p>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-xl">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Long-Term Care</h4>
              <p className="text-sm text-muted-foreground">
                Monthly plan @ ₹3,499 (was ₹4,000) for chronic conditions
              </p>
            </div>
          </div>
        </div>

        {/* Download Pricing Table */}
        <div className="text-center">
          <PricingTablePDF />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
