
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ListChecks, ArrowRight, CheckCircle, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Task } from "@/lib/types";

export const TodayPriorities = () => {
  const { tasks, dailyPriorities, toggleTaskCompletion } = useAppStore();
  const [todaysPriorities, setTodaysPriorities] = useState<string[]>([]);
  const [animateProgress, setAnimateProgress] = useState(false);
  
  useEffect(() => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];
    
    console.log("[DEBUG] TodayPriorities - Today's date (YYYY-MM-DD):", today);
    console.log("[DEBUG] TodayPriorities - All daily priorities:", dailyPriorities);
    
    // Find today's priorities with consistent date format comparison
    const todaysPriorityList = dailyPriorities.find(dp => {
      // Normalize both dates to YYYY-MM-DD format for comparison
      const dpDate = dp.date.split('T')[0];
      console.log(`[DEBUG] Checking priority date: ${dpDate} against today ${today}, match: ${dpDate === today}`);
      return dpDate === today;
    });
    
    if (todaysPriorityList && Array.isArray(todaysPriorityList.taskIds)) {
      console.log("[DEBUG] Found priority list for today:", todaysPriorityList);
      setTodaysPriorities(todaysPriorityList.taskIds);
      console.log("[DEBUG] Set today's priorities to:", todaysPriorityList.taskIds);
    } else {
      console.log("[DEBUG] No priority list found for today. Using empty array.");
      setTodaysPriorities([]);
    }
  }, [dailyPriorities]);
  
  // Get the priority tasks with improved validation and logging
  const priorityTasks = tasks.filter(task => {
    if (!todaysPriorities || !Array.isArray(todaysPriorities)) {
      console.log("[DEBUG] todaysPriorities is not valid:", todaysPriorities);
      return false;
    }
    
    const isInPriorities = todaysPriorities.includes(task.id);
    console.log(`[DEBUG] Task ${task.id} (${task.title}) is in priorities: ${isInPriorities}`);
    return isInPriorities;
  });
  
  console.log("[DEBUG] TodayPriorities - Filtered priority tasks:", priorityTasks);
  
  // Calculate completion percentage
  const completedTasks = priorityTasks.filter(task => task.completed).length;
  const totalTasks = priorityTasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Handle task completion toggle
  const handleToggleTaskCompletion = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toggleTaskCompletion(taskId);
      setAnimateProgress(true);
      
      // Show toast notification based on the new state (opposite of the current state)
      if (!task.completed) {
        toast.success(`Tarefa "${task.title}" concluída!`, {
          className: "toast-success",
          duration: 2000,
          position: "bottom-right",
        });
      } else {
        toast.info(`Tarefa "${task.title}" reaberta!`, {
          className: "toast-info",
          duration: 2000,
          position: "bottom-right",
        });
      }
    }
  };

  // Load existing priority tasks
  if (priorityTasks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="col-span-full shadow-elevated hover:shadow-md transition-all duration-300 bg-gradient-to-br from-card to-background/80 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden">
          <CardContent className="text-center py-16 px-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6"
            >
              <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-6">
                <ListChecks className="h-10 w-10 text-primary/70" />
              </div>
              <h3 className="font-medium text-xl mb-2">Sem prioridades definidas</h3>
              <p className="text-muted-foreground mt-2 mb-8 max-w-md mx-auto">
                Defina até 6 tarefas prioritárias para o dia e aumente sua produtividade
              </p>
            </motion.div>
            <Button variant="default" size="lg" className="gap-2 px-6 rounded-full shadow-[0_4px_12px_rgba(59,130,246,0.25)]" asChild>
              <Link to="/ivy-lee">
                Definir prioridades
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="col-span-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 bg-gradient-to-br from-card to-background/80 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/30">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold leading-none tracking-tight inline-flex items-center gap-2">
              Prioridades de Hoje
              {completionPercentage === 100 && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div>
                      <Trophy className="h-5 w-5 text-amber-500 animate-pulse-light" />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-60 p-3 text-sm">
                    Parabéns! Você completou todas as tarefas prioritárias de hoje.
                  </HoverCardContent>
                </HoverCard>
              )}
            </h2>
            <p className="text-sm text-muted-foreground">
              {completedTasks} de {totalTasks} tarefas concluídas
            </p>
          </div>
          <Button variant="ghost" size="sm" className="gap-1.5 hover:bg-primary/10 hover:text-primary transition-colors rounded-full" asChild>
            <Link to="/ivy-lee">
              Gerenciar
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        
        <CardContent className="pt-4">
          <div className="mb-6">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Progresso</span>
              <motion.span 
                key={completionPercentage}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="font-medium"
              >
                {completionPercentage}%
              </motion.span>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-muted/30">
              <motion.div 
                className={cn(
                  "h-full rounded-full",
                  completionPercentage === 100 
                    ? "bg-gradient-to-r from-green-500 to-green-400" 
                    : "bg-gradient-to-r from-primary-600 to-primary-400"
                )}
                initial={{ width: "0%" }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ 
                  duration: animateProgress ? 0.7 : 0.5, 
                  ease: [0.34, 1.56, 0.64, 1]
                }}
                onAnimationComplete={() => setAnimateProgress(false)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            {priorityTasks.map((task) => (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 py-2"
              >
                <button 
                  onClick={() => handleToggleTaskCompletion(task.id)}
                  className="flex items-center justify-center"
                  aria-label={task.completed ? "Marcar tarefa como não concluída" : "Marcar tarefa como concluída"}
                >
                  <div 
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200",
                      task.completed 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-500 hover:bg-blue-200 dark:hover:bg-blue-800/50"
                    )}
                  >
                    <CheckCircle 
                      size={16} 
                      className={cn(
                        "transition-all",
                        task.completed 
                          ? "opacity-100" 
                          : "opacity-80"
                      )} 
                    />
                  </div>
                </button>
                <span 
                  className={cn(
                    "text-base transition-colors duration-200",
                    task.completed && "line-through text-muted-foreground"
                  )}
                >
                  {task.title}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
