
import { useState, useEffect } from "react";
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval,
  format, 
  isSameMonth,
  isSameDay,
  isToday
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Task, Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CalendarTaskCard } from "./CalendarTaskCard";

interface FullCalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  tasks: Task[];
  projects: Project[];
}

export function FullCalendarView({ 
  selectedDate, 
  onSelectDate, 
  tasks, 
  projects 
}: FullCalendarViewProps) {
  // Get days for the calendar grid
  const getDaysToDisplay = (date: Date) => {
    const start = startOfWeek(startOfMonth(date), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(date), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  };

  const days = getDaysToDisplay(selectedDate);
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  
  // Get tasks for a specific day
  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), day)
    );
  };
  
  return (
    <div className="border rounded-md overflow-hidden bg-background">
      {/* Day of week headers */}
      <div className="grid grid-cols-7 bg-muted/20">
        {dayNames.map((name) => (
          <div 
            key={name} 
            className="py-2 text-center text-sm font-medium text-muted-foreground"
          >
            {name}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 auto-rows-fr border-t">
        {days.map((day, i) => {
          const tasksForDay = getTasksForDay(day);
          const isCurrentMonth = isSameMonth(day, selectedDate);
          const isSelected = isSameDay(day, selectedDate);
          
          return (
            <div 
              key={day.toString()}
              className={cn(
                "min-h-[120px] border-b border-r p-2 transition-colors hover:bg-muted/5",
                !isCurrentMonth && "bg-muted/10 text-muted-foreground",
                isSelected && "bg-muted/20",
                i % 7 === 6 && "border-r-0", // Remove right border from last column
                Math.floor(i / 7) === Math.floor(days.length / 7) && "border-b-0" // Remove bottom border from last row
              )}
              onClick={() => onSelectDate(day)}
            >
              <div className="flex justify-between items-start">
                <div
                  className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center text-sm",
                    isToday(day) && "bg-primary text-primary-foreground font-medium"
                  )}
                >
                  {format(day, "d")}
                </div>
                
                {tasksForDay.length > 0 && (
                  <Badge className="text-[10px] h-5">{tasksForDay.length}</Badge>
                )}
              </div>
              
              <div className="mt-1 space-y-1 max-h-[70px] overflow-hidden">
                {tasksForDay.slice(0, 2).map(task => (
                  <div key={task.id} className="text-xs p-1 rounded bg-primary/10 truncate">
                    {task.title}
                  </div>
                ))}
                {tasksForDay.length > 2 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{tasksForDay.length - 2} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Selected day tasks */}
      {getTasksForDay(selectedDate).length > 0 && (
        <div className="p-4 border-t">
          <h3 className="text-sm font-medium mb-2">
            Tarefas para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </h3>
          <div className="space-y-2">
            {getTasksForDay(selectedDate).map(task => (
              <CalendarTaskCard key={task.id} task={task} projects={projects} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
