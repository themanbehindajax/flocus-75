
import { Task } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface KanbanTaskProps {
  task: Task;
  onDragStart: () => void;
}

export const KanbanTask = ({ task, onDragStart }: KanbanTaskProps) => {
  const { tags } = useAppStore();
  
  const getTaskTags = task.tags.map(tagId => 
    tags.find(t => t.id === tagId)
  ).filter(Boolean);
  
  return (
    <Card 
      className={`border-l-4 cursor-grab active:cursor-grabbing ${
        task.priority === 'alta' ? 'border-l-red-500' : 
        task.priority === 'media' ? 'border-l-yellow-500' : 
        'border-l-green-500'
      }`}
      draggable
      onDragStart={onDragStart}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="font-medium line-clamp-2">{task.title}</div>
            
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                {task.description}
              </p>
            )}
            
            {task.subtasks.length > 0 && (
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <CheckCircle className="w-3 h-3" />
                <span>{task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}</span>
              </div>
            )}
            
            <div className="flex flex-wrap gap-1 mt-2">
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
