
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, ChevronDown, ChevronUp, Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const { completeTask, deleteTask, updateTask, projects, tags } = useAppStore();
  const [expandedTaskId, setExpandedTaskId] = useState<boolean>(false);
  
  const projectName = task.projectId 
    ? projects.find(p => p.id === task.projectId)?.name 
    : undefined;

  const toggleExpandTask = () => {
    setExpandedTaskId(!expandedTaskId);
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map(subtask => 
      subtask.id === subtaskId 
        ? { ...subtask, completed: !subtask.completed } 
        : subtask
    );

    updateTask({
      ...task,
      subtasks: updatedSubtasks
    });
  };

  return (
    <Card className={`border-l-4 ${
      task.priority === 'alta' ? 'border-l-red-500' : 
      task.priority === 'media' ? 'border-l-yellow-500' : 
      'border-l-green-500'
    } ${task.completed ? 'bg-muted/20' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => completeTask(task.id)}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                task.completed ? "bg-primary text-white" : "border border-muted-foreground"
              }`}
            >
              {task.completed && <CheckCircle className="h-4 w-4" />}
            </button>
            <span className={task.completed ? "line-through text-muted-foreground" : ""}>
              {task.title}
            </span>
            {task.subtasks.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 h-6 w-6 p-0"
                onClick={toggleExpandTask}
              >
                {expandedTaskId ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          <div className="text-sm font-normal text-muted-foreground">
            {task.dueDate && (
              <span>Vence: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {task.description && (
          <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
        )}
        
        {/* Subtasks */}
        {expandedTaskId && task.subtasks.length > 0 && (
          <div className="mt-3 space-y-2 pl-8 border-l-2 border-muted mb-4">
            {task.subtasks.map((subtask) => (
              <div 
                key={subtask.id} 
                className="flex items-center gap-2"
              >
                <button
                  onClick={() => handleToggleSubtask(subtask.id)}
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                    subtask.completed ? "bg-primary text-white" : "border border-muted-foreground"
                  }`}
                >
                  {subtask.completed && <CheckCircle className="h-3 w-3" />}
                </button>
                <span className={subtask.completed ? "line-through text-muted-foreground text-sm" : "text-sm"}>
                  {subtask.title}
                </span>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {task.tags.map((tagId) => {
            const tag = tags.find(t => t.id === tagId);
            if (!tag) return null;
            
            return (
              <span 
                key={tag.id}
                className="px-2 py-1 rounded-full text-xs"
                style={{ backgroundColor: tag.color + '20', color: tag.color }}
              >
                {tag.name}
              </span>
            );
          })}
          
          {task.projectId && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
              {projectName || 'Projeto'}
            </span>
          )}
        </div>
        
        <div className="flex justify-end mt-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => deleteTask(task.id)}
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
