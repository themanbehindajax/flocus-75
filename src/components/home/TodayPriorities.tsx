
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
      
      // Show toast notification
      if (!task.completed) {
        toast(`Tarefa "${task.title}" concluída!`);
      } else {
        toast(`Tarefa "${task.title}" reaberta!`);
      }
    }
  };

  if (priorityTasks.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="text-center py-10">
          <ListChecks className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-medium text-lg">Sem prioridades definidas</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Defina até 6 tarefas prioritárias para o dia
          </p>
          <Button variant="outline" asChild>
            <Link to="/ivy-lee">Definir prioridades</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold leading-none tracking-tight inline-flex items-center gap-2">
            Prioridades de Hoje
            {completionPercentage === 100 && (
              <Trophy className="h-4 w-4 text-amber-500" />
            )}
          </h2>
          <p className="text-sm text-muted-foreground">
            {completedTasks} de {totalTasks} tarefas concluídas
          </p>
        </div>
        <Button variant="ghost" size="sm" className="gap-1" asChild>
          <Link to="/ivy-lee">
            Gerenciar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progresso</span>
            <span>{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
        
        <div className="space-y-2">
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
