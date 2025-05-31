
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import { useEffect } from "react";
import { requestNotificationPermission } from "@/lib/notifications";
import { PomodoroMiniWidget } from "@/components/pomodoro/PomodoroMiniWidget";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/layout/PageTransition";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import IvyLee from "./pages/IvyLee";
import Pomodoro from "./pages/Pomodoro";
import Settings from "./pages/Settings";
import Achievements from "./pages/Achievements";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import React from "react";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// AnimatedRoutes component for smooth page transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/lp" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <PageTransition><Index /></PageTransition>
          </ProtectedRoute>
        } />
        
        <Route path="/projects" element={
          <ProtectedRoute>
            <PageTransition><Projects /></PageTransition>
          </ProtectedRoute>
        } />
        
        <Route path="/projects/:projectId" element={
          <ProtectedRoute>
            <PageTransition><ProjectDetails /></PageTransition>
          </ProtectedRoute>
        } />
        
        <Route path="/tasks" element={
          <ProtectedRoute>
            <PageTransition><Tasks /></PageTransition>
          </ProtectedRoute>
        } />
        
        <Route path="/calendar" element={
          <ProtectedRoute>
            <PageTransition><Calendar /></PageTransition>
          </ProtectedRoute>
        } />
        
        <Route path="/ivy-lee" element={
          <ProtectedRoute>
            <PageTransition><IvyLee /></PageTransition>
          </ProtectedRoute>
        } />
        
        <Route path="/pomodoro" element={
          <ProtectedRoute>
            <PageTransition><Pomodoro /></PageTransition>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <PageTransition><Settings /></PageTransition>
          </ProtectedRoute>
        } />
        
        <Route path="/achievements" element={
          <ProtectedRoute>
            <PageTransition><Achievements /></PageTransition>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  useEffect(() => {
    // Request notification permission when app loads
    requestNotificationPermission();
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AnimatedRoutes />
            
            {/* Pomodoro mini widget will show on all protected routes */}
            <ProtectedRoute>
              <PomodoroMiniWidget />
            </ProtectedRoute>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
