
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ListChecks, ArrowRight, CheckCircle, Trophy } from "lucide-react";
import { TaskCardCompact } from "../tasks/TaskCardCompact";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const TodayPriorities = () => {
  const { tasks, dailyPriorities, toggleTaskCompletion } = useAppStore();
  const [todaysPriorities, setTodaysPriorities] = useState<string[]>([]);
  
  useEffect(() => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];
    
    // Find today's priorities
    const todaysPriorityList = dailyPriorities.find(dp => dp.date === today);
    if (todaysPriorityList) {
      setTodaysPriorities(todaysPriorityList.taskIds);
    } else {
      setTodaysPriorities([]);
    }
  }, [dailyPriorities]);
  
  // Get the priority tasks
  const priorityTasks = tasks.filter(task => todaysPriorities.includes(task.id));
  
  // Calculate completion percentage
  const completedTasks = priorityTasks.filter(task => task.completed).length;
  const totalTasks = priorityTasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Handle task completion toggle
  const handleToggleTaskCompletion = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toggleTaskCompletion(taskId);
      
      // Show toast notification based on the new state (opposite of the current state)
      if (!task.completed) {
        toast.success(`Tarefa "${task.title}" concluída!`, {
          className: "animate-fade-in",
          duration: 2000
        });
      } else {
        toast.info(`Tarefa "${task.title}" reaberta!`, {
          className: "animate-fade-in",
          duration: 2000
        });
      }
    }
  };

  if (priorityTasks.length === 0) {
    return (
      <Card className="col-span-full shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in">
        <CardContent className="text-center py-12 px-4">
          <ListChecks className="h-12 w-12 mx-auto mb-4 text-muted-foreground/70" />
          <h3 className="font-medium text-lg mb-1">Sem prioridades definidas</h3>
          <p className="text-muted-foreground mt-1 mb-6 max-w-md mx-auto">
            Defina até 6 tarefas prioritárias para o dia
          </p>
          <Button variant="default" size="lg" className="gap-2" asChild>
            <Link to="/ivy-lee">
              Definir prioridades
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold leading-none tracking-tight inline-flex items-center gap-2">
            Prioridades de Hoje
            {completionPercentage === 100 && (
              <Trophy className="h-5 w-5 text-amber-500 animate-pulse-light" />
            )}
          </h2>
          <p className="text-sm text-muted-foreground">
            {completedTasks} de {totalTasks} tarefas concluídas
          </p>
        </div>
        <Button variant="ghost" size="sm" className="gap-1.5 hover:bg-primary/10 transition-colors" asChild>
          <Link to="/ivy-lee">
            Gerenciar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="mb-5">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Progresso</span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <Progress 
            value={completionPercentage} 
            className={cn(
              "h-2 transition-all duration-500",
              completionPercentage === 100 ? "bg-muted/30" : "bg-muted/20"
            )}
            indicatorClassName={cn(
              completionPercentage === 100 ? "bg-green-500" : ""
            )}
          />
        </div>
        
        <div className="space-y-2.5">
          {priorityTasks.map((task) => (
            <TaskCardCompact
              key={task.id}
              task={task}
              onComplete={() => handleToggleTaskCompletion(task.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
