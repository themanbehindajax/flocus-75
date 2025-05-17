
import { Task } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Calendar, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface KanbanTaskProps {
  task: Task;
  onDragStart: () => void;
}

export const KanbanTask = ({ task, onDragStart }: KanbanTaskProps) => {
  const { tags, toggleTaskCompletion } = useAppStore();
  
  const getTaskTags = task.tags.map(tagId => 
    tags.find(t => t.id === tagId)
  ).filter(Boolean);
  
  const handleToggleTaskCompletion = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    toggleTaskCompletion(task.id);
    
    // Show toast notification based on new completion state after toggle
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
  };

  // Define priority styles for consistent design
  const priorityStyles = {
    alta: "border-l-red-500",
    media: "border-l-amber-500",
    baixa: "border-l-green-500"
  };
  
  return (
    <Card 
      className={cn(
        "border-l-4 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all duration-200",
        priorityStyles[task.priority] || "border-l-green-500",
        task.completed ? "bg-muted/30" : ""
      )}
      draggable
      onDragStart={onDragStart}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="font-medium line-clamp-2 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={`h-5 w-5 p-0 rounded-full transition-all duration-200 ${
                  task.completed 
                    ? 'text-primary hover:text-primary/80 hover:bg-primary/10' 
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                }`}
                onClick={handleToggleTaskCompletion}
              >
                {task.completed ? 
                  <CheckCircle2 className="h-4 w-4" /> : 
                  <CheckCircle className="h-4 w-4" />
                }
              </Button>
              <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                {task.title}
              </span>
            </div>
            
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-1 mt-1 ml-7">
                {task.description}
              </p>
            )}
            
            {task.subtasks.length > 0 && (
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground ml-7">
                <CheckCircle className="w-3 h-3" />
                <span>{task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}</span>
              </div>
            )}
            
            <div className="flex flex-wrap gap-1 mt-2 ml-7">
              {getTaskTags.map(tag => tag && (
                <span 
                  key={tag.id}
                  className="px-1.5 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: tag.color + '20', color: tag.color }}
                >
                  {tag.name}
                </span>
              ))}
              
              {task.isQuick && (
                <Badge variant="outline" className="text-xs px-1.5 bg-blue-50 dark:bg-blue-950/40">⚡ Rápida</Badge>
              )}
            </div>
          </div>
          
          {task.dueDate && (
            <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(task.dueDate).toLocaleDateString('pt-BR')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
