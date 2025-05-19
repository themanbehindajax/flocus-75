
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "../AppSidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PomodoroMiniWidget } from "@/components/pomodoro/PomodoroMiniWidget";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { sidebarCollapsed, animationsEnabled } = useAppStore();
  
  // Check if current page is pomodoro to avoid applying the background
  const isPomodoroPage = location.pathname === "/pomodoro";

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Define animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2, ease: "easeIn" } }
  };

  return (
    <div className={cn(
      "flex h-screen w-full overflow-hidden",
      !isPomodoroPage && "bg-gradient-to-br from-background via-background to-muted/30 relative"
    )}>
      {/* Background decorative elements - only when not on pomodoro page */}
      {!isPomodoroPage && (
        <div className="absolute inset-0 overflow-hidden -z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.4 }}
            className="absolute -bottom-20 right-1/3 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
          />
          
          {/* New floating elements */}
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.5, 0.7, 0.5],
            }} 
            transition={{ 
              repeat: Infinity, 
              duration: 8, 
              ease: "easeInOut" 
            }}
            className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full bg-primary/5 blur-2xl"
          />
          
          <motion.div 
            animate={{ 
              y: [0, 15, 0],
              opacity: [0.3, 0.6, 0.3],
            }} 
            transition={{ 
              repeat: Infinity, 
              duration: 10, 
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-1/3 left-1/4 w-56 h-56 rounded-full bg-primary/8 blur-2xl"
          />
          
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.4, 0.6, 0.4],
            }} 
            transition={{ 
              repeat: Infinity, 
              duration: 12, 
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-2/3 right-1/5 w-48 h-48 rounded-full bg-primary/10 blur-3xl"
          />
        </div>
      )}
      
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.div
            initial={{ x: isMobile ? -240 : 0, opacity: isMobile ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -240, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
            className="backdrop-blur-sm bg-background/70 dark:bg-background/50 border-r border-border/40 z-20"
          >
            <AppSidebar activePath={location.pathname} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile when sidebar is open */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-10 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main content - only this part animates on route change */}
      <motion.main 
        key={location.pathname}
        initial={animationsEnabled ? "initial" : undefined}
        animate={animationsEnabled ? "enter" : undefined}
        exit={animationsEnabled ? "exit" : undefined}
        variants={pageVariants}
        className={cn(
          "flex-1 overflow-auto transition-all duration-300",
          sidebarCollapsed ? "ml-0" : ""
        )}
      >
        {/* Mobile header with menu button */}
        <div className="md:hidden flex items-center p-4 border-b bg-card/80 backdrop-blur-md sticky top-0 z-10">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="ml-3 font-bold text-xl text-primary">Flocus</h1>
        </div>

        {/* Desktop sidebar toggle button - when sidebar is collapsed */}
        {!sidebarOpen && !isMobile && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="fixed top-4 left-4 z-10"
          >
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full w-10 h-10 p-0 bg-card/80 backdrop-blur-md border shadow-sm hover:shadow-md hover:bg-card/90 transition-all duration-300"
              onClick={toggleSidebar}
            >
              <ChevronRight size={18} />
            </Button>
          </motion.div>
        )}

        {children}
      </motion.main>

      {/* Floating Pomodoro Widget - Always present but conditionally visible */}
      <PomodoroMiniWidget />
    </div>
  );
}
