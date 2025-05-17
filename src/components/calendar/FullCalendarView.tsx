
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { format, isSameDay, isToday, parse } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Task, Project } from "@/lib/types";
import { fetchCalendarEvents } from "@/lib/googleCalendar";
import { useAuthStore } from "@/lib/auth";
import { CalendarTaskCard } from "./CalendarTaskCard";
import { Badge } from "@/components/ui/badge";

interface FullCalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  tasks: Task[];
  projects: Project[];
}

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

export function FullCalendarView({ selectedDate, onSelectDate, tasks, projects }: FullCalendarViewProps) {
  const { googleToken } = useAuthStore();
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get tasks for the selected date
  const tasksForSelectedDate = tasks.filter(task => {
    if (!task.dueDate) return false;
    return isSameDay(new Date(task.dueDate), selectedDate);
  });
  
  // Get events for the selected date
  const eventsForSelectedDate = calendarEvents.filter(event => {
    if (!event.start) return false;
    const eventDate = event.start.dateTime 
      ? new Date(event.start.dateTime) 
      : event.start.date 
        ? parse(event.start.date, 'yyyy-MM-dd', new Date())
        : null;
    
    if (!eventDate) return false;
    return isSameDay(eventDate, selectedDate);
  });
  
  // Calculate days with tasks or events for visual indicators
  const daysWithContent = [
    ...tasks.filter(task => task.dueDate).map(task => new Date(task.dueDate as string)),
    ...calendarEvents
      .filter(event => event.start)
      .map(event => event.start.dateTime 
        ? new Date(event.start.dateTime) 
        : event.start.date 
          ? parse(event.start.date, 'yyyy-MM-dd', new Date())
          : null)
      .filter(Boolean) as Date[]
  ];
  
  // Fetch Google Calendar events
  useEffect(() => {
    const fetchEvents = async () => {
      if (!googleToken) return;
      
      try {
        setIsLoading(true);
        
        // Calculate month range
        const startDate = new Date(selectedDate);
        startDate.setDate(1);
        const endDate = new Date(selectedDate);
        endDate.setMonth(endDate.getMonth() + 1, 0);
        
        const events = await fetchCalendarEvents(googleToken, startDate.toISOString(), endDate.toISOString());
        
        if (events && events.items) {
          setCalendarEvents(events.items);
        }
      } catch (error) {
        console.error("Error fetching calendar events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [googleToken, selectedDate]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
      {/* Calendar Column */}
      <Card className="md:col-span-3">
        <CardContent className="pt-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onSelectDate(date)}
            className="rounded-md border"
            locale={ptBR}
            modifiers={{
              hasContent: (date) => daysWithContent.some(contentDate => contentDate && isSameDay(date, contentDate)),
            }}
            modifiersClassNames={{
              hasContent: "bg-primary/10 font-bold",
            }}
            components={{
              DayContent: ({ date }) => (
                <div className="relative flex h-8 w-8 items-center justify-center">
                  {format(date, "d")}
                  {daysWithContent.some(contentDate => contentDate && isSameDay(date, contentDate)) && (
                    <div className="absolute bottom-1 h-1 w-1 rounded-full bg-primary"></div>
                  )}
                </div>
              ),
            }}
          />
        </CardContent>
      </Card>
      
      {/* Tasks and Events for Selected Date */}
      <Card className="md:col-span-4">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-medium text-lg">
              {format(selectedDate, "PPP", { locale: ptBR })}
              {isToday(selectedDate) && (
                <Badge variant="outline" className="ml-2">Hoje</Badge>
              )}
            </h3>
          </div>
          
          {(tasksForSelectedDate.length === 0 && eventsForSelectedDate.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">
                Não há tarefas ou eventos agendados para esta data.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasksForSelectedDate.map(task => (
                <CalendarTaskCard key={task.id} task={task} projects={projects} />
              ))}
              
              {eventsForSelectedDate.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Eventos do Google Calendar</h4>
                  <div className="space-y-2">
                    {eventsForSelectedDate.map(event => (
                      <div key={event.id} className="p-3 rounded-lg border-l-4 border-blue-500 border bg-muted/20">
                        <div className="flex flex-col">
                          <h5 className="font-medium">{event.summary}</h5>
                          {event.start.dateTime && (
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(event.start.dateTime), "HH:mm")}
                              {event.end?.dateTime && ` - ${format(new Date(event.end.dateTime), "HH:mm")}`}
                            </span>
                          )}
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
