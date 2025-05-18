
import { useState } from "react";
import { Task } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { CheckCircle, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskDetailDrawer } from "@/components/tasks/TaskDetailDrawer";

interface CalendarTaskCardProps {
  task: Task;
  projects: { id: string; name: string }[];
}

export const CalendarTaskCard = ({ task, projects }: CalendarTaskCardProps) => {
  const { completeTask, updateTask } = useAppStore();
  const [showDetails, setShowDetails] = useState(false);
  
  const projectName = task.projectId 
    ? projects.find(p => p.id === task.projectId)?.name 
    : undefined;

  const handleToggleSubtask = (e: React.MouseEvent, subtaskId: string) => {
    e.stopPropagation(); // Prevent opening the drawer
    
    const updatedTask = {
      ...task,
      subtasks: task.subtasks.map(subtask => 
        subtask.id === subtaskId 
          ? { ...subtask, completed: !subtask.completed } 
          : subtask
      )
    };
    
    updateTask(updatedTask);
  };

  const handleClick = () => {
    setShowDetails(true);
  };

  return (
    <>
      <div 
        className={`p-4 rounded-lg border ${
          task.priority === 'alta' ? 'border-l-4 border-l-red-500' : 
          task.priority === 'media' ? 'border-l-4 border-l-yellow-500' : 
          'border-l-4 border-l-green-500'
        } ${task.completed ? 'bg-muted/20' : ''} hover:bg-muted/10 cursor-pointer transition-colors`}
        onClick={handleClick}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent opening drawer
              completeTask(task.id);
            }}
            className={`mt-1 w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center transition-colors ${
              task.completed ? "bg-primary text-white" : "border border-muted-foreground"
            }`}
          >
            {task.completed && <CheckCircle className="h-4 w-4" />}
          </button>
          
          <div className="flex-1">
            <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {task.description}
              </p>
            )}
            
            {task.subtasks.length > 0 && (
              <div className="mt-3 space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Subtarefas ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
                </p>
                <div className="pl-2 space-y-1.5">
                  {task.subtasks.map(subtask => (
                    <div key={subtask.id} className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-5 w-5 p-0 rounded-sm transition-all ${
                          subtask.completed 
                            ? 'text-primary hover:text-primary/80' 
                            : 'text-muted-foreground hover:text-primary'
                        }`}
                        onClick={(e) => handleToggleSubtask(e, subtask.id)}
                      >
                        {subtask.completed ? 
                          <CheckSquare className="h-3.5 w-3.5" /> : 
                          <Square className="h-3.5 w-3.5" />
                        }
                      </Button>
                      <span className={`text-xs ${subtask.completed ? "line-through text-muted-foreground" : ""}`}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {projectName && (
              <div className="mt-2">
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {projectName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Detail Drawer */}
      <TaskDetailDrawer 
        task={showDetails ? task : null} 
        open={showDetails} 
        onOpenChange={setShowDetails} 
      />
    </>
  );
};
