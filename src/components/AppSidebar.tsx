
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
import { ThemeToggle } from "./ThemeToggle";

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
  collapsed?: boolean;
};

const SidebarItem = ({ icon, label, to, active = false, collapsed = false }: SidebarItemProps) => {
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
      {!collapsed && <span>{label}</span>}
    </Link>
  );
};

type AppSidebarProps = {
  activePath: string;
  collapsed?: boolean;
};

export function AppSidebar({ activePath, collapsed = false }: AppSidebarProps) {
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
    <div className="h-screen flex flex-col border-r bg-card">
      <div className={cn("p-4 flex items-center border-b", collapsed ? "justify-center" : "justify-between")}>
        {collapsed ? (
          <span className="font-bold text-xl text-primary">F</span>
        ) : (
          <>
            <h1 className="font-bold text-xl text-primary">Flocus</h1>
            <ThemeToggle />
          </>
        )}
      </div>
      
      <div className="flex-1 py-4 overflow-auto">
        <nav className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              active={activePath === item.to}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </div>
      
      <div className={cn("p-4 border-t", collapsed && "flex justify-center")}>
        <SidebarItem
          icon={<Settings className="w-5 h-5" />}
          label="Configurações"
          to="/settings"
          active={activePath === "/settings"}
          collapsed={collapsed}
        />
      </div>
    </div>
  );
}
