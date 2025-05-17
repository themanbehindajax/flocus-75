
import { Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    alta: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/50",
    media: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50",
    baixa: "bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800/50"
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-md border",
        task.completed ? "bg-muted/30 border-muted/40" : "hover:scale-[1.01] border-muted/50",
        task.priority && priorityColors[task.priority]
      )}
    >
      <div className="flex justify-between items-center p-3.5 gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className={`h-6 w-6 p-0 rounded-full transition-all duration-200 ${
              task.completed 
                ? 'text-primary hover:text-primary/80 hover:bg-primary/10' 
                : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
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
            <h3 className={`font-medium text-sm truncate transition-all duration-200 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {task.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 shrink-0">
          {task.priority === 'alta' && (
            <Badge variant="destructive" className="text-xs px-1.5 py-0 h-5">Alta</Badge>
          )}
          
          {task.isQuick && (
            <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 bg-blue-50 dark:bg-blue-950/40">⚡ Rápida</Badge>
          )}
        </div>
      </div>
    </Card>
  );
};
