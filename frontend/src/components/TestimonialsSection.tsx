import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, MessageCircle, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const testimonials = [
  {
    name: "Priya Sharma",
    age: 45,
    rating: 5,
    text: "Dr. JSP's home clinic is a blessing. After years of visiting crowded hospitals, having such personalized care at home makes all the difference. His experience really shows in his diagnosis.",
    condition: "Diabetes Management",
    date: "2 weeks ago"
  },
  {
    name: "Rajesh Gupta",
    age: 62,
    rating: 5,
    text: "As a senior citizen, traveling to clinics was becoming difficult. Dr. JSP's comfortable clinic setup and modern facilities have been perfect for my regular checkups.",
    condition: "Hypertension",
    date: "1 month ago"
  },
  {
    name: "Anita Singh",
    age: 38,
    rating: 5,
    text: "The video consultation feature saved me during the lockdown. Dr. JSP was thorough even over video call and the digital prescription system is very convenient.",
    condition: "General Consultation",
    date: "3 weeks ago"
  },
  {
    name: "Mukesh Patel",
    age: 55,
    rating: 5,
    text: "Been coming to Dr. JSP for 5 years. His knowledge and patience in explaining conditions is exceptional. The new home clinic maintains the same quality care.",
    condition: "Chronic Care",
    date: "1 week ago"
  }
];

const TestimonialsSection = () => {
  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    email: "",
    rating: 5,
    experience: "",
    recommend: true
  });

  const { toast } = useToast();

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thank you for your feedback!",
      description: "Your review helps us serve our patients better.",
      duration: 5000,
    });
    setFeedbackForm({
      name: "",
      email: "",
      rating: 5,
      experience: "",
      recommend: true
    });
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFeedbackForm(prev => ({ ...prev, [field]: value }));
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <section id="reviews" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              What Our Patients Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real experiences from patients who've trusted us with their healthcare journey
            </p>
            <div className="flex justify-center items-center space-x-4 mt-6">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-lg font-semibold text-foreground">4.9/5</span>
              </div>
              <Badge variant="secondary" className="px-4 py-1">
                <ThumbsUp className="h-3 w-3 mr-1" />
                98% Satisfaction Rate
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Testimonials */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-foreground mb-8">Patient Reviews</h3>
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="shadow-card hover:shadow-soft transition-smooth">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
                          <Quote className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                              <p className="text-sm text-muted-foreground">Age {testimonial.age} • {testimonial.date}</p>
                            </div>
                            {renderStars(testimonial.rating)}
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                            "{testimonial.text}"
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {testimonial.condition}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Feedback Form */}
            <div className="space-y-6">
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <h3 className="text-2xl font-semibold text-foreground">Share Your Experience</h3>
                  </div>
                  
                  <form onSubmit={handleSubmitFeedback} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="feedback-name">Your Name</Label>
                        <Input
                          id="feedback-name"
                          placeholder="Enter your name"
                          value={feedbackForm.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="feedback-email">Email (Optional)</Label>
                        <Input
                          id="feedback-email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={feedbackForm.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Rate Your Experience</Label>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleInputChange("rating", star)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-6 w-6 cursor-pointer transition-colors ${
                                star <= feedbackForm.rating 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-300 hover:text-yellow-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Your Experience</Label>
                      <Textarea
                        id="experience"
                        placeholder="Tell us about your experience with our clinic and services..."
                        value={feedbackForm.experience}
                        onChange={(e) => handleInputChange("experience", e.target.value)}
                        rows={4}
                        required
                      />
                    </div>

                    <Button type="submit" variant="appointment" className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Your feedback helps us improve our services and may be featured on our website (with your permission)
                    </p>
                  </form>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="shadow-card text-center p-6">
                  <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                  <div className="text-sm text-muted-foreground">Happy Patients</div>
                </Card>
                <Card className="shadow-card text-center p-6">
                  <div className="text-3xl font-bold text-primary mb-2">40+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;