import { useState, useEffect } from "react";
import { format, isSameDay, isToday } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task, Project } from "@/lib/types";
import { fetchCalendarEvents } from "@/lib/googleCalendar";
import { useAuthStore } from "@/lib/auth";
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
  const { googleToken } = useAuthStore();
  const [dayEvents, setDayEvents] = useState<DayEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Convert tasks to events and fetch Google Calendar events
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
    
    setDayEvents(prev => {
      // Keep only Google events
      const googleEvents = prev.filter(event => !event.isTask);
      return [...googleEvents, ...taskEvents].sort((a, b) => a.start.getTime() - b.start.getTime());
    });
    
    // Fetch Google Calendar events
    const fetchEvents = async () => {
      if (!googleToken) return;
      
      try {
        setIsLoading(true);
        
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        const calendarData = await fetchCalendarEvents(googleToken, startOfDay.toISOString(), endOfDay.toISOString());
        
        if (calendarData && calendarData.items) {
          const googleEvents: DayEvent[] = calendarData.items
            .filter(event => event.start && (event.start.dateTime || event.start.date))
            .map(event => ({
              id: event.id,
              title: event.summary,
              description: event.description,
              start: event.start.dateTime 
                ? new Date(event.start.dateTime) 
                : new Date(`${event.start.date}T12:00:00`),
              end: event.end?.dateTime 
                ? new Date(event.end.dateTime) 
                : event.end?.date 
                  ? new Date(`${event.end.date}T12:00:00`) 
                  : undefined,
              isTask: false,
            }));
          
          // Merge with task events
          setDayEvents(prev => {
            // Keep only task events
            const taskEvents = prev.filter(event => event.isTask);
            return [...taskEvents, ...googleEvents].sort((a, b) => a.start.getTime() - b.start.getTime());
          });
        }
      } catch (error) {
        console.error("Error fetching calendar events for day view:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [googleToken, selectedDate, tasks]);
  
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
              
              // If it's a Google Calendar event, render an event card
              return (
                <div 
                  key={event.id}
                  className="absolute left-2 right-2 rounded-lg p-2 bg-green-500 text-white"
                  style={{
                    top: `${top}px`,
                    minHeight: "32px"
                  }}
                >
                  <div className="font-medium">
                    {format(event.start, "HH:mm")} - {event.title}
                  </div>
                  {event.description && (
                    <div className="text-xs mt-1">{event.description}</div>
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
