
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "../AppSidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence } from "framer-motion";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

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
          sidebarOpen ? "w-64" : "w-0 md:w-16",
          isMobile && !sidebarOpen ? "absolute -left-full" : ""
        )}
      >
        <AppSidebar activePath={location.pathname} collapsed={!sidebarOpen} />
      </div>

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
            <div
              className="fixed inset-0 z-10 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Main content - without animation */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
