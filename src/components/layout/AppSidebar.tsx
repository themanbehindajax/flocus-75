
import { Link } from "react-router-dom";
import {
  Calendar,
  CheckSquare,
  Clock,
  FolderKanban,
  Home,
  ListTodo,
  Settings,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
};

const SidebarItem = ({ icon, label, to, active = false }: SidebarItemProps) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={to}
            className={cn(
              "flex justify-center items-center p-3 text-sm font-medium rounded-md transition-colors",
              "hover:bg-white/10 hover:text-primary",
              active ? "text-primary bg-white/10" : "text-foreground"
            )}
          >
            {icon}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

type AppSidebarProps = {
  activePath: string;
};

export function AppSidebar({ activePath }: AppSidebarProps) {
  const { sidebarCollapsed } = useAppStore();
  
  const sidebarItems = [
    { icon: <Home className="w-5 h-5" />, label: "Dashboard", to: "/" },
    { icon: <FolderKanban className="w-5 h-5" />, label: "Projetos", to: "/projects" },
    { icon: <ListTodo className="w-5 h-5" />, label: "Tarefas", to: "/tasks" },
    { icon: <CheckSquare className="w-5 h-5" />, label: "Ivy Lee", to: "/ivy-lee" },
    { icon: <Clock className="w-5 h-5" />, label: "Pomodoro", to: "/pomodoro" },
    { icon: <Calendar className="w-5 h-5" />, label: "Calendário", to: "/calendar" },
    { icon: <Trophy className="w-5 h-5" />, label: "Conquistas", to: "/achievements" },
  ];

  return (
    <motion.div 
      className="fixed z-50 h-screen bg-white/10 backdrop-blur-xl border-r border-white/10"
      style={{ 
        width: "4rem",
        left: 0,
        top: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      <div className="flex flex-col items-center w-full">
        <div className="p-4 flex justify-center items-center w-full">
          <span className="font-bold text-xl text-primary">F</span>
        </div>
        
        <div className="w-full h-px bg-white/10 my-2" />
        
        <nav className="flex flex-col items-center gap-4 py-4 w-full">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              active={activePath === item.to}
            />
          ))}
        </nav>
      </div>
      
      <div className="flex flex-col items-center gap-4 py-6 w-full">
        <ThemeToggle />
        <div className="w-full h-px bg-white/10 my-2" />
        <Link
          to="/settings"
          className={cn(
            "flex justify-center items-center p-3 text-sm font-medium rounded-md transition-colors",
            "hover:bg-white/10 hover:text-primary",
            activePath === "/settings" ? "text-primary bg-white/10" : "text-foreground"
          )}
        >
          <Settings className="w-5 h-5" />
        </Link>
      </div>
    </motion.div>
  );
};
