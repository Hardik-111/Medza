import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, ThumbsUp, CheckCircle, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

interface Review {
  id: string;
  patientName: string;
  rating: number;
  title: string;
  comment: string;
  category: string;
  verified: boolean;
  helpful: boolean;
  createdAt: string;
  doctorResponse?: string;
}

const ReviewSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    appointmentId: "",
    patientName: "",
    patientPhone: "",
    reviewDate: new Date(),
    rating: 5,
    title: "",
    comment: "",
    category: "OVERALL",
    anonymous: false
  });
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    positiveReviews: 0
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
    fetchStats();
    // Auto-fill patient name from logged-in user
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.name) {
      setReviewForm(prev => ({ ...prev, patientName: user.name }));
    }
    if (user.phone) {
      setReviewForm(prev => ({ ...prev, patientPhone: user.phone }));
    }
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/reviews`);
      if (response.ok) {
        const data = await response.json();
        // Map backend snake_case to frontend camelCase and ensure dates are valid
        const mappedReviews = data.map((review: any) => ({
          ...review,
          patientName: review.patient_name || review.patientName,
          createdAt: review.created_at || review.createdAt,
          doctorResponse: review.doctor_response || review.doctorResponse,
        }));
        setReviews(mappedReviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/reviews/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats({
          averageRating: data.average_rating || data.averageRating || 0,
          totalReviews: data.total_reviews || data.totalReviews || 0,
          positiveReviews: data.positive_reviews || data.positiveReviews || 0
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Keep default values on error
      setStats({
        averageRating: 0,
        totalReviews: 0,
        positiveReviews: 0
      });
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Generate patient_id if not provided (using phone as identifier)
      const patientId = reviewForm.patientPhone || `patient_${Date.now()}`;
      
      // Transform frontend camelCase to backend snake_case
      const reviewData = {
        appointment_id: reviewForm.appointmentId || `appt_${Date.now()}`,
        patient_id: patientId,
        patient_name: reviewForm.patientName,
        patient_phone: reviewForm.patientPhone || null,
        rating: reviewForm.rating,
        title: reviewForm.title || null,
        comment: reviewForm.comment,
        category: reviewForm.category,
        anonymous: reviewForm.anonymous
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/reviews/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast({
          title: "Review Submitted Successfully!",
          description: "Thank you for your feedback. It helps us improve our services.",
          duration: 5000,
        });
        
        setShowReviewForm(false);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setReviewForm({
          appointmentId: "",
          patientName: user.name || "",
          patientPhone: user.phone || "",
          reviewDate: new Date(),
          rating: 5,
          title: "",
          comment: "",
          category: "OVERALL",
          anonymous: false
        });
        
        fetchReviews();
        fetchStats();
      } else {
        const errorMsg = responseData.detail 
          ? (Array.isArray(responseData.detail) 
              ? responseData.detail.map((d: any) => d.msg).join(', ')
              : responseData.detail)
          : "Please try again or contact us directly.";
        
        toast({
          title: "Review Submission Failed",
          description: errorMsg,
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Review Submission Failed",
        description: "Network error. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <section id="reviews" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Patient Reviews & Feedback
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Read what our patients say about their experience with {BRAND.shortName}
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">{(stats.averageRating || 0).toFixed(1)}</div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(stats.averageRating || 0))}
              </div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">{stats.totalReviews || 0}</div>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">{stats.positiveReviews || 0}</div>
              <p className="text-sm text-muted-foreground">Positive Reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Review Form */}
        <div className="mb-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Share Your Experience
              </CardTitle>
              <CardDescription>
                Help other patients by sharing your feedback about our services
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showReviewForm ? (
                <Button 
                  onClick={() => {
                    // Auto-fill user info when opening form
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    setReviewForm(prev => ({
                      ...prev,
                      patientName: user.name || prev.patientName,
                      patientPhone: user.phone || prev.patientPhone,
                      reviewDate: new Date()
                    }));
                    setShowReviewForm(true);
                  }}
                  className="w-full"
                  variant="appointment"
                >
                  Write a Review
                </Button>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="patientName">Your Name *</Label>
                      <Input
                        id="patientName"
                        value={reviewForm.patientName}
                        onChange={(e) => setReviewForm({...reviewForm, patientName: e.target.value})}
                        required
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="patientPhone">Phone Number *</Label>
                      <Input
                        id="patientPhone"
                        value={reviewForm.patientPhone}
                        onChange={(e) => setReviewForm({...reviewForm, patientPhone: e.target.value})}
                        required
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="appointmentId">Appointment ID (Optional)</Label>
                    <Input
                      id="appointmentId"
                      value={reviewForm.appointmentId}
                      onChange={(e) => setReviewForm({...reviewForm, appointmentId: e.target.value})}
                      placeholder="If you have an appointment ID"
                    />
                    </div>
                    <div>
                      <Label>Review Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !reviewForm.reviewDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {reviewForm.reviewDate ? format(reviewForm.reviewDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={reviewForm.reviewDate}
                            onSelect={(date) => date && setReviewForm({...reviewForm, reviewDate: date})}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Rating *</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({...reviewForm, rating: star})}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${star <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="title">Review Title</Label>
                    <Input
                      id="title"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                      placeholder="Brief summary of your experience"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="comment">Your Review *</Label>
                    <Textarea
                      id="comment"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                      placeholder="Share your experience in detail..."
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={reviewForm.category} 
                      onValueChange={(value) => setReviewForm({...reviewForm, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OVERALL">Overall Experience</SelectItem>
                        <SelectItem value="CONSULTATION">Consultation</SelectItem>
                        <SelectItem value="STAFF">Staff & Service</SelectItem>
                        <SelectItem value="FACILITY">Facility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1" variant="appointment">
                      Submit Review
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowReviewForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    {review.verified && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <Badge variant="secondary">{review.category}</Badge>
                </div>
                <CardTitle className="text-lg">
                  {review.anonymous ? "Anonymous Patient" : review.patientName}
                </CardTitle>
                {review.title && (
                  <CardDescription className="font-medium text-foreground">
                    {review.title}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{review.comment}</p>
                
                {review.doctorResponse && (
                  <div className="bg-primary/5 p-3 rounded-lg border-l-4 border-primary">
                    <p className="text-sm font-medium text-primary mb-1">Doctor's Response:</p>
                    <p className="text-sm text-muted-foreground">{review.doctorResponse}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex flex-col">
                    {(() => {
                      const dateStr = review.createdAt || review.created_at;
                      if (!dateStr) return <span className="text-xs text-muted-foreground">Date not available</span>;
                      
                      const date = new Date(dateStr);
                      if (isNaN(date.getTime())) return <span className="text-xs text-muted-foreground">Invalid date</span>;
                      
                      return (
                        <>
                  <span className="text-xs text-muted-foreground">
                            {format(date, "PPP")}
                          </span>
                          <span className="text-xs text-muted-foreground italic">
                            {formatDistanceToNow(date, { addSuffix: true })}
                  </span>
                        </>
                      );
                    })()}
                  </div>
                  {review.helpful && (
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <ThumbsUp className="h-3 w-3" />
                      <span>Helpful</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewSection;
