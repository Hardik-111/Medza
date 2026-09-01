import { CustomToaster } from "@/components/ui/custom-toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import VideoCallPage from "./pages/VideoCallPage";
import PlansPage from "./pages/PlansPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import AboutPage from "./pages/AboutPage";
import CallHistoryPage from "./pages/CallHistoryPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { ENABLE_BACKEND_FEATURES } from "./config/features";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CustomToaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={ENABLE_BACKEND_FEATURES ? <AuthPage /> : <LandingPage />} />
          <Route path="/dashboard" element={ENABLE_BACKEND_FEATURES ? <ProtectedRoute><Index /></ProtectedRoute> : <LandingPage />} />
          <Route path="/profile" element={ENABLE_BACKEND_FEATURES ? <ProtectedRoute><ProfilePage /></ProtectedRoute> : <LandingPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/video-call" element={<VideoCallPage />} />
          <Route path="/video-call/:callId" element={<VideoCallPage />} />
          <Route path="/call-history" element={ENABLE_BACKEND_FEATURES ? <ProtectedRoute><CallHistoryPage /></ProtectedRoute> : <LandingPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
