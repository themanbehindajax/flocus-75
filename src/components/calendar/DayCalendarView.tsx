
import { useState, useEffect } from "react";
import { format, isSameDay, isToday } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task, Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CalendarTaskCard } from "./CalendarTaskCard";

interface DayCalendarViewProps {
  selectedDate: Date;
  tasks: Task[];
  projects: Project[];
}

interface DayEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end?: Date;
  isTask: boolean;
  taskData?: Task;
}

export function DayCalendarView({ selectedDate, tasks, projects }: DayCalendarViewProps) {
  const [dayEvents, setDayEvents] = useState<DayEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Convert tasks to events
  useEffect(() => {
    const taskEvents: DayEvent[] = tasks
      .filter(task => task.dueDate && isSameDay(new Date(task.dueDate), selectedDate))
      .map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        start: new Date(task.dueDate as string),
        isTask: true,
        taskData: task,
      }));
    
    setDayEvents(taskEvents);
  }, [tasks, selectedDate]);
  
  // Get hours for the day
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            {isToday(selectedDate) && (
              <Badge variant="outline" className="ml-2">Hoje</Badge>
            )}
          </h2>
        </div>
        
        <div className="grid grid-cols-12">
          {/* Hour column */}
          <div className="col-span-1 border-r">
            {hours.map((hour) => (
              <div key={hour} className="h-16 border-b flex items-center justify-center">
                <span className="text-xs text-muted-foreground">
                  {hour.toString().padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>
          
          {/* Events column */}
          <div className="col-span-11 relative min-h-[600px]">
            {hours.map((hour) => (
              <div key={hour} className="h-16 border-b"></div>
            ))}
            
            {/* Events */}
            {dayEvents.map((event) => {
              const hour = event.start.getHours();
              const minute = event.start.getMinutes();
              const top = (hour * 60 + minute) * (16 / 60); // 16px per hour
              
              // If it's a task, render a task card
              if (event.isTask && event.taskData) {
                const taskData = event.taskData;
                const projectName = taskData.projectId 
                  ? projects.find(p => p.id === taskData.projectId)?.name 
                  : undefined;
                
                return (
                  <div 
                    key={event.id}
                    className="absolute left-2 right-2 rounded-lg"
                    style={{
                      top: `${top}px`,
                      zIndex: 10
                    }}
                  >
                    <CalendarTaskCard task={taskData} projects={projects} />
                  </div>
                );
              }
              
              return null;
            })}
            
            {dayEvents.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">
                  Não há tarefas ou eventos para este dia.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
