
import { useState, useEffect } from "react";
import { format, isSameDay, isToday } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task, Project, CalendarEvent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CalendarTaskCard } from "./CalendarTaskCard";
import { useAppStore } from "@/lib/store";

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
  color?: string;
  allDay?: boolean;
}

export function DayCalendarView({ selectedDate, tasks, projects }: DayCalendarViewProps) {
  const [dayEvents, setDayEvents] = useState<DayEvent[]>([]);
  const { calendarEvents } = useAppStore();
  
  // Convert tasks and calendar events to display events
  useEffect(() => {
    // Process tasks to events
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
    
    // Process calendar events
    const calendarDisplayEvents: DayEvent[] = calendarEvents
      .filter(event => {
        const eventStart = new Date(event.startDate);
        const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
        return isSameDay(eventStart, selectedDate) || 
               (event.endDate && eventStart <= selectedDate && selectedDate <= eventEnd);
      })
      .map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        start: new Date(event.startDate),
        end: event.endDate ? new Date(event.endDate) : undefined,
        isTask: false,
        color: event.color || "#6366f1",
        allDay: event.allDay
      }));
    
    // Combine and sort by time
    const combinedEvents = [...taskEvents, ...calendarDisplayEvents].sort((a, b) => 
      a.start.getTime() - b.start.getTime()
    );
    
    setDayEvents(combinedEvents);
  }, [tasks, calendarEvents, selectedDate]);
  
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
              
              // Calculate height based on duration (for calendar events)
              let height = 60; // Default height (1 hour)
              if (event.end) {
                const durationMinutes = (event.end.getTime() - event.start.getTime()) / (60 * 1000);
                height = Math.max(30, durationMinutes * (16 / 60)); // Minimum height of 30px
              }
              
              // If it's a task, render a task card
              if (event.isTask && event.taskData) {
                return (
                  <div 
                    key={event.id}
                    className="absolute left-2 right-2 rounded-lg"
                    style={{
                      top: `${top}px`,
                      zIndex: 10
                    }}
                  >
                    <CalendarTaskCard task={event.taskData} projects={projects} />
                  </div>
                );
              }
              
              // Render calendar event
              return (
                <div
                  key={event.id}
                  className="absolute left-2 right-2 rounded-lg p-2 text-white"
                  style={{
                    top: `${top}px`,
                    height: `${event.allDay ? 40 : height}px`,
                    backgroundColor: event.color,
                    zIndex: 5
                  }}
                >
                  <div className="flex justify-between">
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs opacity-90">
                      {format(event.start, "HH:mm")}
                      {event.end && ` - ${format(event.end, "HH:mm")}`}
                    </p>
                  </div>
                  {event.description && (
                    <p className="text-xs mt-1 opacity-80 line-clamp-2">{event.description}</p>
                  )}
                </div>
              );
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
