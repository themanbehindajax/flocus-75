
import { useState, useEffect } from "react";
import { format, addDays, startOfWeek, isSameDay, isToday } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from "@/components/ui/card";
import { Task, Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface WeekCalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  tasks: Task[];
  projects: Project[];
}

interface WeekEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end?: Date;
  isTask: boolean;
  completed?: boolean;
  projectId?: string;
}

export function WeekCalendarView({ selectedDate, onSelectDate, tasks, projects }: WeekCalendarViewProps) {
  const [weekEvents, setWeekEvents] = useState<WeekEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate week start (Sunday) and generate week days
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  // Convert tasks to events
  useEffect(() => {
    const taskEvents: WeekEvent[] = tasks
      .filter(task => task.dueDate)
      .map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        start: new Date(task.dueDate as string),
        isTask: true,
        completed: task.completed,
        projectId: task.projectId,
      }));
    
    setWeekEvents(taskEvents);
  }, [tasks]);
  
  // Get hours for time grid
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return (
    <div className="bg-background border rounded-md overflow-hidden">
      {/* Week header */}
      <div className="grid grid-cols-8 border-b">
        {/* Time column header */}
        <div className="border-r p-2 text-center">
          <span className="text-xs text-muted-foreground">Hora</span>
        </div>
        
        {/* Day columns headers */}
        {weekDays.map((day, index) => (
          <div 
            key={index}
            className={cn(
              "p-2 text-center cursor-pointer hover:bg-accent/50",
              isSameDay(day, selectedDate) ? "bg-accent" : "",
              isToday(day) ? "font-bold" : ""
            )}
            onClick={() => onSelectDate(day)}
          >
            <div className="text-xs text-muted-foreground">
              {format(day, "EEE", { locale: ptBR })}
            </div>
            <div className={cn(
              "text-sm leading-6 h-6 w-6 rounded-full mx-auto flex items-center justify-center",
              isToday(day) ? "bg-primary text-primary-foreground" : ""
            )}>
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>
      
      {/* Time grid */}
      <div className="grid grid-cols-8 relative" style={{ height: "600px", overflowY: "auto" }}>
        {/* Time column */}
        <div className="border-r">
          {hours.map((hour) => (
            <div key={hour} className="h-12 border-b flex items-center justify-center">
              <span className="text-xs text-muted-foreground">
                {hour.toString().padStart(2, "0")}:00
              </span>
            </div>
          ))}
        </div>
        
        {/* Day columns with events */}
        {weekDays.map((day, dayIndex) => (
          <div 
            key={dayIndex}
            className={cn(
              "relative border-r last:border-r-0",
              isSameDay(day, selectedDate) ? "bg-accent/30" : ""
            )}
          >
            {/* Hour cells */}
            {hours.map((hour) => (
              <div key={hour} className="h-12 border-b"></div>
            ))}
            
            {/* Events for this day */}
            {weekEvents
              .filter(event => isSameDay(event.start, day))
              .map((event, eventIndex) => {
                const hour = event.start.getHours();
                const minute = event.start.getMinutes();
                const top = (hour * 60 + minute) * (12 / 60); // 12px per hour
                
                const projectColor = event.projectId
                  ? projects.find(p => p.id === event.projectId)?.name
                  : undefined;
                
                return (
                  <div 
                    key={event.id}
                    className={cn(
                      "absolute left-1 right-1 rounded-md p-1 text-xs overflow-hidden",
                      event.isTask 
                        ? event.completed 
                          ? "bg-muted text-muted-foreground line-through" 
                          : "bg-blue-500 text-white"
                        : "bg-green-500 text-white"
                    )}
                    style={{
                      top: `${top}px`,
                      height: "24px"
                    }}
                    title={event.title}
                  >
                    <div className="flex items-center gap-1">
                      <span className="truncate">
                        {format(event.start, "HH:mm")} {event.title}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}
