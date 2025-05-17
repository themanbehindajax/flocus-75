
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
  ChevronLeft,
  ChevronRight,
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
  collapsed?: boolean;
};

const SidebarItem = ({ icon, label, to, active = false, collapsed = false }: SidebarItemProps) => {
  if (collapsed) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={to}
              className={cn(
                "flex justify-center items-center p-3 text-sm font-medium rounded-md transition-colors",
                "hover:bg-primary/10 hover:text-primary",
                active ? "text-primary bg-primary/10" : "text-foreground"
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
  }

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
        "hover:bg-primary/10 hover:text-primary",
        active ? "text-primary bg-primary/10" : "text-foreground"
      )}
      title={label}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

type AppSidebarProps = {
  activePath: string;
};

export function AppSidebar({ activePath }: AppSidebarProps) {
  const { sidebarCollapsed, toggleSidebarCollapse } = useAppStore();
  
  const sidebarItems = [
    { icon: <Home className="w-5 h-5" />, label: "Dashboard", to: "/" },
    { icon: <FolderKanban className="w-5 h-5" />, label: "Projetos", to: "/projects" },
    { icon: <ListTodo className="w-5 h-5" />, label: "Tarefas", to: "/tasks" },
    { icon: <CheckSquare className="w-5 h-5" />, label: "Ivy Lee", to: "/ivy-lee" },
    { icon: <Clock className="w-5 h-5" />, label: "Pomodoro", to: "/pomodoro" },
    { icon: <Calendar className="w-5 h-5" />, label: "Calendário", to: "/calendar" },
    { icon: <Trophy className="w-5 h-5" />, label: "Conquistas", to: "/achievements" },
  ];

  const sidebarVariants = {
    expanded: { width: "16rem", transition: { duration: 0.3 } },
    collapsed: { width: "4rem", transition: { duration: 0.3 } },
  };

  return (
    <motion.div 
      className={cn(
        "fixed z-50 h-auto shadow-lg rounded-r-xl border-r-0 border-t border-b border-r backdrop-blur-xl",
        sidebarCollapsed 
          ? "bg-blue-500/15 border-white/20" 
          : "bg-blue-500/10 border-white/15 h-screen"
      )}
      variants={sidebarVariants}
      initial={sidebarCollapsed ? "collapsed" : "expanded"}
      animate={sidebarCollapsed ? "collapsed" : "expanded"}
      style={{ 
        position: "fixed",
        top: sidebarCollapsed ? "50%" : "0",
        transform: sidebarCollapsed ? "translateY(-50%)" : "none",
        left: "0",
        borderTopLeftRadius: "0",
        borderBottomLeftRadius: "0",
      }}
    >
      <div className={cn("p-4 flex items-center border-b border-white/10", 
        sidebarCollapsed ? "justify-center" : "justify-between"
      )}>
        {sidebarCollapsed ? (
          <span className="font-bold text-xl text-primary">F</span>
        ) : (
          <>
            <h1 className="font-bold text-xl text-primary">Flocus</h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 p-1 h-8 w-8" 
                onClick={toggleSidebarCollapse}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
      
      <div className="flex-1 py-4 overflow-auto">
        <nav className={cn("space-y-1", sidebarCollapsed ? "px-1" : "px-2")}>
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              active={activePath === item.to}
              collapsed={sidebarCollapsed}
            />
          ))}
        </nav>
      </div>
      
      <div className={cn("p-4 border-t border-white/10", sidebarCollapsed && "flex justify-center")}>
        {sidebarCollapsed ? (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/settings"
                  className={cn(
                    "flex justify-center items-center p-2 text-sm font-medium rounded-md transition-colors",
                    "hover:bg-primary/10 hover:text-primary",
                    activePath === "/settings" ? "text-primary bg-primary/10" : "text-foreground"
                  )}
                >
                  <Settings className="w-5 h-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Configurações</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <SidebarItem
            icon={<Settings className="w-5 h-5" />}
            label="Configurações"
            to="/settings"
            active={activePath === "/settings"}
            collapsed={sidebarCollapsed}
          />
        )}
      </div>

      {sidebarCollapsed && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="m-2 h-8 w-auto" 
          onClick={toggleSidebarCollapse}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </motion.div>
  );
};
