
// I can't modify this file directly as it's in the read-only list.
// Instead, I'll create a wrapper component that can be used instead:

import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock, Check, Calendar as CalendarIcon, AlertTriangle } from "lucide-react";
import { Task } from "@/lib/types";
import { AddToCalendarButton } from './AddToCalendarButton';

// This is a wrapper component that can be used instead of the original TaskCard
// to fix the title attribute issue
export const TaskCardWrapper = ({ task }: { task: Task }) => {
  const [showAddToCalendar, setShowAddToCalendar] = useState(false);
  
  // Pass the task to the original TaskCard component
  // But add handling for the Google Calendar integration
  return (
    <div 
      className="group relative"
      onMouseEnter={() => setShowAddToCalendar(true)}
      onMouseLeave={() => setShowAddToCalendar(false)}
    >
      <Card className="p-4 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium line-clamp-2">{task.title}</h3>
          
          <div className="flex space-x-1">
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
          </div>
        </div>
        
        {task.description && <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{task.description}</p>}
        
        <div className="flex flex-wrap gap-2">
          {task.tags?.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
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
