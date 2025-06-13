
import { useState, useEffect } from "react";
import { format, addDays, startOfWeek, isSameDay, isToday } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from "@/components/ui/card";
import { Task, Project, CalendarEvent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { formatInTimeZone } from "date-fns-tz";
import { useAppStore } from "@/lib/store";
import { CalendarEventForm } from "./CalendarEventForm";

interface WeekCalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  tasks: Task[];
  projects: Project[];
}

interface WeekEventDisplay {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end?: Date;
  isTask: boolean;
  completed?: boolean;
  projectId?: string;
  color?: string;
  allDay?: boolean;
  originalEvent?: CalendarEvent;
}

export function WeekCalendarView({ selectedDate, onSelectDate, tasks, projects }: WeekCalendarViewProps) {
  const [weekEvents, setWeekEvents] = useState<WeekEventDisplay[]>([]);
  const { calendarEvents } = useAppStore();
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  
  // Calculate week start (Sunday) and generate week days
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  // Convert tasks and calendar events to display events
  useEffect(() => {
    // Process tasks
    const taskEvents: WeekEventDisplay[] = tasks
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
    
    // Process calendar events
    const calendarEventDisplays: WeekEventDisplay[] = calendarEvents
      .map(calEvent => ({
        id: calEvent.id,
        title: calEvent.title,
        description: calEvent.description,
        start: new Date(calEvent.startDate),
        end: calEvent.endDate ? new Date(calEvent.endDate) : undefined,
        isTask: false,
        color: calEvent.color || "#6366f1",
        allDay: calEvent.allDay,
        originalEvent: calEvent
      }));
    
    // Combine and sort events
    const combinedEvents = [...taskEvents, ...calendarEventDisplays].sort((a, b) => 
      a.start.getTime() - b.start.getTime()
    );
    
    setWeekEvents(combinedEvents);
  }, [tasks, calendarEvents]);

  const handleEventClick = (event: WeekEventDisplay) => {
    if (!event.isTask && event.originalEvent) {
      setEditingEvent(event.originalEvent);
      setIsEventFormOpen(true);
    }
  };
  
  // Get hours for time grid
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Format time with timezone
  const formatTime = (date: Date) => {
    return formatInTimeZone(date, 'America/Sao_Paulo', 'HH:mm');
  };
  
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
                
                // Calculate event height based on duration
                let height = 24; // Default height
                if (event.end) {
                  const durationMinutes = (event.end.getTime() - event.start.getTime()) / (60 * 1000);
                  height = durationMinutes * (12 / 60);
                  // Ensure minimum height
                  height = Math.max(height, 24);
                }
                
                // Determine background color
                let bgColorClass = "";
                let bgColor = undefined;
                let textColor = "text-white";
                
                if (event.isTask) {
                  bgColorClass = event.completed 
                    ? "bg-muted text-muted-foreground line-through" 
                    : "bg-blue-500";
                } else {
                  // For calendar events, use the event color directly
                  bgColor = event.color;
                }
                
                return (
                  <div 
                    key={event.id}
                    className={cn(
                      "absolute left-1 right-1 rounded-md p-1 text-xs overflow-hidden shadow-sm cursor-pointer hover:opacity-90 transition-opacity",
                      bgColorClass,
                      textColor
                    )}
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      backgroundColor: bgColor
                    }}
                    title={event.title}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-center gap-1">
                      <span className="truncate">
                        {formatTime(event.start)} {event.title}
                      </span>
                    </div>
                    {event.end && !event.isTask && (
                      <div className="text-xs opacity-80 overflow-hidden text-ellipsis">
                        até {formatTime(event.end)}
                      </div>
                    )}
                  </div>
                );
              })}
              
            {/* All-day events */}
            {weekEvents
              .filter(event => 
                event.allDay && 
                isSameDay(event.start, day)
              )
              .map((event, idx) => (
                <div
                  key={`all-day-${event.id}`}
                  className="absolute top-0 left-0 right-0 px-1 py-0.5 text-xs text-white truncate cursor-pointer hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: event.color,
                    zIndex: 20
                  }}
                  onClick={() => handleEventClick(event)}
                >
                  {event.title}
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Event Form Dialog for editing */}
      <CalendarEventForm 
        open={isEventFormOpen} 
        onOpenChange={setIsEventFormOpen} 
        selectedDate={selectedDate} 
        editEvent={editingEvent}
      />
    </div>
  );
}
