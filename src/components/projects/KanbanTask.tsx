
import { Task } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Calendar, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
    
    // Show toast notification based on new completion state
    if (task.completed) {
      toast(`Tarefa "${task.title}" reaberta!`);
    } else {
      toast(`Tarefa "${task.title}" concluída!`);
    }
  };
  
  return (
    <Card 
      className={`border-l-4 cursor-grab active:cursor-grabbing ${
        task.priority === 'alta' ? 'border-l-red-500' : 
        task.priority === 'media' ? 'border-l-yellow-500' : 
        'border-l-green-500'
      } ${task.completed ? 'bg-muted/30' : ''}`}
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
                className={`h-5 w-5 p-0 ${task.completed ? 'text-primary' : 'text-muted-foreground'}`}
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
                  className="px-1.5 py-0.5 rounded-full text-xs"
                  style={{ backgroundColor: tag.color + '20', color: tag.color }}
                >
                  {tag.name}
                </span>
              ))}
              
              {task.isQuick && (
                <Badge variant="outline" className="text-xs px-1.5">⚡ Rápida</Badge>
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
