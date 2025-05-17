
import { Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, CheckCircle2, Clock } from "lucide-react";
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
    alta: "bg-gradient-to-r from-red-50/80 to-red-100/50 dark:bg-red-950/30 border-red-200/60 dark:border-red-800/40",
    media: "bg-gradient-to-r from-amber-50/80 to-amber-100/50 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/40",
    baixa: "bg-gradient-to-r from-green-50/80 to-green-100/50 dark:bg-green-950/30 border-green-200/60 dark:border-green-800/40"
  };

  // Badge styling
  const badgeStyles = {
    alta: "border-red-200/70 dark:border-red-700/40 text-red-700 dark:text-red-400 bg-gradient-to-r from-red-50 to-red-100/80 dark:from-red-900/30 dark:to-red-800/20",
    rapida: "border-blue-200/70 dark:border-blue-700/40 text-blue-700 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-blue-100/80 dark:from-blue-900/30 dark:to-blue-800/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
    >
      <Card 
        className={cn(
          "transition-all duration-200 hover:shadow-md border",
          task.completed ? "bg-muted/30 border-muted/40" : "border-border/50",
          task.priority && priorityColors[task.priority],
          "rounded-xl overflow-hidden shadow-sm"
        )}
      >
        <div className="flex justify-between items-center p-4 gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <motion.div whileTap={{ scale: 0.92 }}>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 p-0 rounded-full transition-all duration-300 ${
                  task.completed 
                    ? 'bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400 hover:bg-success-100 dark:hover:bg-success-900/30 hover:text-success-700 dark:hover:text-success-300' 
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
            </motion.div>
            
            <div className="min-w-0">
              <h3 className={`font-medium text-sm transition-all duration-300 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                  {task.description}
                </p>
              )}

              {task.dueDate && (
                <div className="flex items-center mt-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1.5 shrink-0">
            {task.priority === 'alta' && (
              <Badge variant="outline" className={`text-xs px-2.5 py-0.5 h-5 rounded-full font-normal ${badgeStyles.alta}`}>Alta</Badge>
            )}
            
            {task.isQuick && (
              <Badge variant="outline" className={`text-xs px-2.5 py-0.5 h-5 rounded-full font-normal ${badgeStyles.rapida}`}>⚡ Rápida</Badge>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
