
import { Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TaskCardCompactProps {
  task: Task;
  onComplete?: () => void;
}

export const TaskCardCompact = ({ task, onComplete }: TaskCardCompactProps) => {
  const handleToggleTaskCompletion = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (onComplete) {
      onComplete();
    }
  };

  // Define prioridades com cores correspondentes
  const priorityColors = {
    alta: "bg-red-50/80 dark:bg-red-950/30 border-red-200/80 dark:border-red-800/40",
    media: "bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-800/40",
    baixa: "bg-green-50/80 dark:bg-green-950/30 border-green-200/80 dark:border-green-800/40"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={cn(
          "transition-all duration-200 hover:shadow-md border",
          task.completed ? "bg-muted/30 border-muted/40" : "hover:scale-[1.01] border-border",
          task.priority && priorityColors[task.priority],
          "rounded-xl"
        )}
      >
        <div className="flex justify-between items-center p-4 gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 p-0 rounded-full transition-all duration-300 ${
                task.completed 
                  ? 'text-success-500 hover:text-success-600 hover:bg-success-50 dark:hover:bg-success-900/20' 
                  : 'text-muted-foreground hover:text-primary hover:bg-primary-50 dark:hover:bg-primary-900/20'
              }`}
              onClick={handleToggleTaskCompletion}
              aria-label={task.completed ? "Desmarcar tarefa concluída" : "Marcar como concluída"}
            >
              {task.completed ? 
                <CheckCircle2 className="h-5 w-5" /> : 
                <CheckCircle className="h-5 w-5" />
              }
            </Button>
            
            <div className="min-w-0">
              <h3 className={`font-medium text-sm truncate transition-all duration-300 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1.5 shrink-0">
            {task.priority === 'alta' && (
              <Badge variant="destructive" className="text-xs px-2 py-0.5 h-5 rounded-full font-normal">Alta</Badge>
            )}
            
            {task.isQuick && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 h-5 bg-blue-50/80 dark:bg-blue-950/30 border-blue-200/80 dark:border-blue-800/40 rounded-full font-normal">⚡ Rápida</Badge>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
