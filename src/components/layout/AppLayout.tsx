
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
  const { sidebarCollapsed, toggleSidebarCollapse } = useAppStore();

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
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Fixed sidebar that doesn't animate on page changes */}
      <div
        className={cn(
          "h-screen z-20 transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-16" : "w-64",
          sidebarOpen ? "" : "absolute -left-full",
          isMobile && !sidebarOpen ? "absolute -left-full" : ""
        )}
      >
        <AppSidebar activePath={location.pathname} />
      </div>

      {/* Show collapsed sidebar indicator when sidebar is collapsed */}
      {sidebarCollapsed && !isMobile && sidebarOpen && (
        <div className="fixed left-16 top-1/2 -translate-y-1/2 z-30">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-primary/10 hover:bg-primary/20 rounded-full"
            onClick={toggleSidebarCollapse}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header with menu button */}
        <div className="md:hidden flex items-center p-4 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
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
          className="flex-1 overflow-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
