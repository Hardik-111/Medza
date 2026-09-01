import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Clock, Calendar, QrCode, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BRAND } from "@/lib/brand";

const VideoCallSection = () => {
  const navigate = useNavigate();

  const pricingPlans = [
    { duration: "10 min", price: 250, label: "Quick Consult" },
    { duration: "15 min", price: 400, label: "Standard Consult" },
    { duration: "25 min", price: 600, label: "Detailed Consult" },
    { duration: "30+ min", price: 850, label: "Extended Consult" },
  ];

  return (
    <section id="video-consultation" className="border-y border-border/50 bg-gradient-secondary py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            📹 Video Consultation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with {BRAND.shortName} from the comfort of your home. 
            Secure, private, and convenient video consultations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {pricingPlans.map((plan) => (
            <Card key={plan.duration} className="text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
              <CardHeader>
                <CardTitle className="text-lg">{plan.label}</CardTitle>
                <CardDescription>{plan.duration}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-4">₹{plan.price}</div>
                <Button
                  onClick={() => navigate('/video-call')}
                  className="w-full"
                  variant="outline"
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-background/50 backdrop-blur-sm mb-8">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Video className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">HD Video Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Crystal clear video and audio for better consultation
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Flexible Timing</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred date and time slot
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <QrCode className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Pay by scanning the UPI QR code at checkout. More options may be added later.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button
            onClick={() => navigate('/video-call')}
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            <Video className="h-5 w-5 mr-2" />
            Book Video Consultation
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VideoCallSection;
