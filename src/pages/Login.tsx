
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { OnboardingForm } from "@/components/auth/OnboardingForm";
import { motion } from "framer-motion";

const Login = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/30 relative">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/3 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <div className="glass-effect backdrop-blur-xl p-10 animate-fade-in">
          <div className="text-center mb-10">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className="text-5xl font-bold font-satoshi mb-2">
                <span className="dark:title-gradient-dark title-gradient-light">Flocus</span>
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-muted-foreground text-lg mt-3"
              >
                Sua ferramenta de produtividade pessoal
              </motion.p>
            </motion.div>
          </div>
          
          <OnboardingForm />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
