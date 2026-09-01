import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Video, Clock, QrCode, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ENABLE_BACKEND_FEATURES } from "@/config/features";
import { BRAND } from "@/lib/brand";

interface VideoCallBookingProps {
  onBookingComplete?: (callId: string, meetingLink: string) => void;
}

/** Must match backend `ALLOWED_PAYMENT_METHOD` — only QR scan is supported for now. */
const PAYMENT_METHOD_QR_SCAN = "QR_SCAN" as const;

const VideoCallBooking = ({ onBookingComplete }: VideoCallBookingProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [duration, setDuration] = useState<number>(15);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const durationOptions = [
    { value: 10, label: "Quick (10 min)", price: 250 },
    { value: 15, label: "Standard (15 min)", price: 400 },
    { value: 25, label: "Detailed (25 min)", price: 600 },
    { value: 30, label: "Extended (30+ min)", price: 850 },
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"
  ];

  const selectedPrice = durationOptions.find(opt => opt.value === duration)?.price || 0;
  const isPublicPreview = !ENABLE_BACKEND_FEATURES;

  const handleBooking = async () => {
    if (isPublicPreview) return;
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');

      // Combine date and time
      const [hours, minutes] = selectedTime.split(':');
      const scheduledDateTime = new Date(selectedDate);
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const response = await fetch('http://localhost:8000/api/video-calls/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          patient_name: user.name || "Patient",
          patient_phone: user.phone || "",
          patient_email: user.email || "",
          call_type: "VIDEO",
          duration_minutes: duration,
          scheduled_start_time: scheduledDateTime.toISOString(),
          payment_method: PAYMENT_METHOD_QR_SCAN,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Check if this is a mock order (for development/testing)
        if (data.payment_order_id && data.payment_order_id.startsWith('order_mock')) {
          // Use mock payment flow for testing
          handleMockPayment(data.payment_order_id, data.payment_amount, data.call_id);
        } else {
          // Load Razorpay script and initialize payment
          await loadRazorpayScript();
          handleRazorpayPayment(data.payment_order_id, data.payment_amount, data.call_id);
        }
      } else {
        toast({
          title: "Booking Failed",
          description: data.message || "Failed to create video call",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMockPayment = async (orderId: string, amount: number, callId: string) => {
    // Mock payment flow for testing - simulates successful payment
    toast({
      title: "Mock Payment",
      description: "Using mock payment for testing. Payment will be auto-approved.",
    });

    // Simulate payment delay
    setTimeout(async () => {
      try {
        const token = localStorage.getItem('token');
        // Verify mock payment with backend
        const verifyResponse = await fetch(
          `http://localhost:8000/api/video-calls/payment/verify?call_id=${callId}&payment_id=mock_payment_${Date.now()}&signature=mock_signature`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        const verifyData = await verifyResponse.json();
        if (verifyData.success) {
          toast({
            title: "Payment Successful!",
            description: "Mock payment completed. Your video call has been scheduled",
          });
          if (onBookingComplete) {
            onBookingComplete(callId, verifyData.meeting_link || `/video-call/${callId}`);
          }
        } else {
          toast({
            title: "Payment Verification Failed",
            description: verifyData.message || "Please contact support",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Mock payment error:", error);
        toast({
          title: "Payment Error",
          description: "Failed to process mock payment",
          variant: "destructive",
        });
      }
    }, 1000); // 1 second delay to simulate payment processing
  };

  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async (orderId: string, amount: number, callId: string) => {
    const configResponse = await fetch('http://localhost:8000/api/payments/config');
    const paymentConfig = await configResponse.json();
    if (!paymentConfig.enabled || !paymentConfig.razorpay_key_id) {
      toast({ title: "Payments unavailable", description: "Secure payment is not configured yet. Please contact the clinic.", variant: "destructive" });
      return;
    }

    const options = {
      key: paymentConfig.razorpay_key_id,
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      name: BRAND.paymentName,
      description: `Video Consultation - ${duration} minutes`,
      order_id: orderId,
      handler: async (response: any) => {
        // Verify payment
        const token = localStorage.getItem('token');
        const verifyResponse = await fetch(
          `http://localhost:8000/api/video-calls/payment/verify?call_id=${callId}&payment_id=${response.razorpay_payment_id}&signature=${response.razorpay_signature}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        const verifyData = await verifyResponse.json();
        if (verifyData.success) {
          toast({
            title: "Payment Successful!",
            description: "Your video call has been scheduled",
          });
          if (onBookingComplete) {
            onBookingComplete(callId, verifyData.meeting_link);
          }
        } else {
          toast({
            title: "Payment Verification Failed",
            description: "Please contact support",
            variant: "destructive",
          });
        }
      },
      prefill: {
        name: JSON.parse(localStorage.getItem('user') || '{}').name || '',
        email: JSON.parse(localStorage.getItem('user') || '{}').email || '',
      },
      theme: {
        color: '#3b82f6',
      },
    };

    const razorpay = (window as any).Razorpay(options);
    razorpay.open();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }}>
    <Card className="w-full max-w-2xl mx-auto overflow-hidden border-white/10 bg-card/80 shadow-2xl shadow-primary/10 dark:bg-card/70">
      <CardHeader className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-primary/15 via-card/20 to-transparent p-7 sm:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background shadow-lg shadow-foreground/15"><Video className="h-5 w-5" /></span>
          <div><p className="mb-1 text-xs font-semibold uppercase tracking-[0.17em] text-primary">Private telehealth</p><CardTitle className="text-2xl tracking-[-0.04em]">Book a video consultation</CardTitle><CardDescription className="mt-2 text-[15px] leading-6">{isPublicPreview ? "Online payment and confirmation will be available in a future release." : "Choose a time that works for you. Your appointment is confirmed only after secure payment verification."}</CardDescription></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-7 p-7 pt-7 sm:p-8 sm:pt-8">
        {/* Date Selection */}
        <div className="space-y-2">
          <Label>Select Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Selection */}
        <div className="space-y-2">
          <Label>Select Time</Label>
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select time slot" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Duration Selection */}
        <div className="space-y-2">
          <Label>Consultation Duration</Label>
          <Select value={duration.toString()} onValueChange={(val) => setDuration(parseInt(val))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {durationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label} - ₹{option.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payment: QR scan only (matches backend) */}
        <div className="rounded-2xl border border-primary/20 bg-primary/[0.07] p-5 space-y-2 dark:border-primary/25 dark:bg-primary/[0.09]">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary"><QrCode className="h-5 w-5 shrink-0" /></span>
            <div><span className="block font-semibold text-foreground">Secure QR payment</span><span className="text-xs text-muted-foreground">Verified before your call is confirmed</span></div>
          </div>
          <p className="pt-1 text-sm leading-6 text-muted-foreground">
            At checkout, scan the secure UPI QR code with your banking app. We verify the payment response before confirming your consultation.
          </p>
        </div>

        {/* Price Summary */}
        <div className="rounded-2xl border border-border/70 bg-background/50 p-5 space-y-2 dark:bg-black/20">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-semibold">{duration} minutes</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Consultation Fee:</span>
            <span className="text-2xl font-bold text-primary">₹{selectedPrice}</span>
          </div>
        </div>

        {/* Book Button */}
        <Button
          onClick={handleBooking}
          disabled={isPublicPreview || isLoading || !selectedDate || !selectedTime}
          className="w-full rounded-xl py-6 text-[15px] font-semibold shadow-xl shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-primary/30"
          size="lg"
        >
          {isPublicPreview ? "Online booking coming soon" : isLoading ? "Processing..." : `Pay ₹${selectedPrice} & Book Call`}
        </Button>
        {isPublicPreview && <p className="text-center text-sm leading-6 text-muted-foreground">This feature will be live in a future release. To book now, please call the clinic directly.</p>}
      </CardContent>
    </Card>
    </motion.div>
  );
};

export default VideoCallBooking;
