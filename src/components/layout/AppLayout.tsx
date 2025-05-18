
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "../AppSidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { sidebarCollapsed } = useAppStore();
  
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

  return (
    <div className={cn(
      "flex h-screen w-full overflow-hidden",
      !isPomodoroPage && "bg-gradient-to-br from-background via-background to-muted/30 relative"
    )}>
      {/* Background decorative elements - only when not on pomodoro page */}
      {!isPomodoroPage && (
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute -bottom-20 right-1/3 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
        </div>
      )}
      
      {/* Sidebar */}
      {sidebarOpen && <AppSidebar activePath={location.pathname} />}

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "flex-1 overflow-auto transition-all duration-300",
          sidebarCollapsed ? "ml-0" : ""
        )}
      >
        {/* Mobile header with menu button */}
        <div className="md:hidden flex items-center p-4 border-b glass-effect sticky top-0 z-10">
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

        {children}
      </motion.main>
    </div>
  );
}
