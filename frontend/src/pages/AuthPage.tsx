import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/brand";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data.userId,
          name: data.name,
          email: data.email,
          role: data.role
        }));
        
        toast({
          title: "Login Successful!",
          description: `Welcome back to ${BRAND.shortName}`,
          variant: "success",
        });
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Please check your credentials and try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "Network error. Please check your connection and try again",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (userData: any) => {
    try {
      const response = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          confirmPassword: userData.confirmPassword
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data.userId,
          name: data.name,
          email: data.email,
          role: data.role
        }));
        
        toast({
          title: "Signup Successful!",
          description: `Welcome to ${BRAND.shortName}! Your account has been created.`,
          variant: "success",
        });
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        toast({
          title: "Signup Failed",
          description: data.message || "Please check your information and try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: "Network error. Please check your connection and try again",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = async (email: string) => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Email Sent!",
          description: data.message || "Password reset email sent successfully!",
          variant: "success",
        });
      } else {
        toast({
          title: "Email Failed",
          description: data.message || "Failed to send password reset email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast({
        title: "Email Failed",
        description: "Network error. Please check your connection and try again",
        variant: "destructive",
      });
    }
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="app-shell relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-primary/10 rounded-full blur-lg animate-pulse delay-500"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <Button
            variant="ghost"
            onClick={goBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-3"><ThemeToggle /><div className="flex items-center gap-2 text-primary"><Stethoscope className="h-6 w-6" /><span className="font-semibold text-lg">{BRAND.shortName}</span></div></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45, ease: "easeOut" }} className="w-full max-w-md">
            {isLogin ? (
              <LoginForm 
                onSwitchToSignup={() => setIsLogin(false)}
                onLogin={handleLogin}
                onForgotPassword={handleForgotPassword}
              />
            ) : (
              <SignupForm 
                onSwitchToLogin={() => setIsLogin(true)}
                onSignup={handleSignup}
              />
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="text-center p-6 text-sm text-muted-foreground">
          <p>© 2025 {BRAND.fullName}. All rights reserved.</p>
          <p className="mt-1">Your trusted healthcare partner</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
