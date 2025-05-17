
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

  return (
    <Card 
      className={cn(
        "p-3 transition-all duration-200 hover:shadow-md",
        task.completed ? "bg-muted/50" : "hover:scale-[1.01]"
      )}
    >
      <div className="flex justify-between items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className={`h-6 w-6 p-0 ${task.completed ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={handleToggleTaskCompletion}
            aria-label={task.completed ? "Desmarcar tarefa concluída" : "Marcar como concluída"}
          >
            {task.completed ? 
              <CheckCircle2 className="h-5 w-5" /> : 
              <CheckCircle className="h-5 w-5" />
            }
          </Button>
          
          <div>
            <h3 className={`font-medium truncate ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {task.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 shrink-0">
          {task.priority === 'alta' && (
            <Badge variant="destructive" className="text-xs px-1.5">Alta</Badge>
          )}
          
          {task.isQuick && (
            <Badge variant="outline" className="text-xs px-1.5">⚡ Rápida</Badge>
          )}
        </div>
      </div>
    </Card>
  );
};
