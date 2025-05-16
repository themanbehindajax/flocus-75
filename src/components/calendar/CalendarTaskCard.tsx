
import { Task } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { CheckCircle } from "lucide-react";

interface CalendarTaskCardProps {
  task: Task;
  projects: { id: string; name: string }[];
}

export const CalendarTaskCard = ({ task, projects }: CalendarTaskCardProps) => {
  const { completeTask } = useAppStore();
  
  const projectName = task.projectId 
    ? projects.find(p => p.id === task.projectId)?.name 
    : undefined;

  return (
    <div className={`p-4 rounded-lg border ${
      task.priority === 'alta' ? 'border-l-4 border-l-red-500' : 
      task.priority === 'media' ? 'border-l-4 border-l-yellow-500' : 
      'border-l-4 border-l-green-500'
    } ${task.completed ? 'bg-muted/20' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => completeTask(task.id)}
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
            <div className="mt-3 space-y-1 pl-2 border-l-2 border-muted">
              {task.subtasks.map(subtask => (
                <div key={subtask.id} className="text-sm flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${subtask.completed ? 'bg-primary' : 'bg-muted-foreground'}`} />
                  <span className={subtask.completed ? "line-through text-muted-foreground" : ""}>
                    {subtask.title}
                  </span>
                </div>
              ))}
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
  );
};
