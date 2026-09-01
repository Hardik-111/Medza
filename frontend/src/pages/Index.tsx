import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AppointmentSection from "@/components/AppointmentSection";
import VideoCallSection from "@/components/VideoCallSection";
import ReviewSection from "@/components/ReviewSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import LandingPage from "./LandingPage";
import { ENABLE_BACKEND_FEATURES } from "@/config/features";

const Index = () => {
  if (!ENABLE_BACKEND_FEATURES) return <LandingPage />;

  return (
    <div className="app-shell">
      <AuthenticatedNavbar />
      <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }}>
        <HeroSection />
        <ServicesSection />
        <VideoCallSection />
        <AppointmentSection />
        <ReviewSection />
        <TestimonialsSection />
        <ContactSection />
      </motion.main>
      <Footer />
    </div>
  );
};

export default Index;
