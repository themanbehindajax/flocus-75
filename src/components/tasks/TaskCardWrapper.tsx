
import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock, Calendar as CalendarIcon, AlertTriangle, CheckCircle, CheckCircle2 } from "lucide-react";
import { Task } from "@/lib/types";
import { AddToCalendarButton } from './AddToCalendarButton';
import { useAppStore } from '@/lib/store';
import { useToast } from "@/hooks/use-toast";
import { TaskCardActions } from './TaskCardActions';

// This is a wrapper component that can be used instead of the original TaskCard
export const TaskCardWrapper = ({ task, onComplete }: { 
  task: Task, 
  onComplete?: () => void 
}) => {
  const { completeTask } = useAppStore();
  const { toast } = useToast();
  const [showAddToCalendar, setShowAddToCalendar] = useState(false);
  
  const handleCompleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!task.completed && onComplete) {
      onComplete();
    } else if (!task.completed) {
      completeTask(task.id);
      toast({
        title: "Tarefa concluída",
        description: `A tarefa "${task.title}" foi concluída com sucesso.`
      });
    }
  };
  
  return (
    <div 
      className="group relative"
      onMouseEnter={() => setShowAddToCalendar(true)}
      onMouseLeave={() => setShowAddToCalendar(false)}
    >
      <Card className="p-4 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 p-0 ${task.completed ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={handleCompleteTask}
              aria-label={task.completed ? "Tarefa concluída" : "Marcar como concluída"}
            >
              {task.completed ? 
                <CheckCircle2 className="h-4 w-4" /> : 
                <CheckCircle className="h-4 w-4" />
              }
            </Button>
            <h3 className={`font-medium line-clamp-2 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </h3>
          </div>
          
          <div className="flex space-x-1 items-center">
            {task.dueDate && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <CalendarIcon className="h-4 w-4" aria-label="Due Date" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Due: {new Date(task.dueDate).toLocaleDateString()}</TooltipContent>
              </Tooltip>
            )}
            
            {task.priority === 'alta' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <AlertTriangle className="h-4 w-4 text-destructive" aria-label="High Priority" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>High Priority</TooltipContent>
              </Tooltip>
            )}
            
            <TaskCardActions task={task} />
          </div>
        </div>
        
        {task.description && <p className="text-muted-foreground text-sm line-clamp-2 mb-3 ml-8">{task.description}</p>}
        
        <div className="flex flex-wrap gap-2 ml-8">
          {task.tags?.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
          
          {task.isQuick && (
            <Badge variant="outline" className="text-xs px-1.5">⚡ Rápida</Badge>
          )}
        </div>
        
        {showAddToCalendar && task.dueDate && (
          <div className="absolute -right-2 -top-2">
            <AddToCalendarButton 
              taskTitle={task.title} 
              taskDescription={task.description} 
              dueDate={task.dueDate}
            />
          </div>
        )}
      </Card>
    </div>
  );
};
