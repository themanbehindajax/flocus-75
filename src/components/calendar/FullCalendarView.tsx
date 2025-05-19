
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
import { Task, Project, CalendarEvent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CalendarTaskCard } from "./CalendarTaskCard";
import { useAppStore } from "@/lib/store";

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
  const { calendarEvents } = useAppStore();
  
  // Get tasks for a specific day
  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), day)
    );
  };
  
  // Get calendar events for a specific day
  const getEventsForDay = (day: Date) => {
    return calendarEvents.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
      
      // Check if this day falls within the event's range
      return isSameDay(day, eventStart) || 
        (event.endDate && eventStart <= day && day <= eventEnd);
    });
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
          const eventsForDay = getEventsForDay(day);
          const totalItems = tasksForDay.length + eventsForDay.length;
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
                
                {totalItems > 0 && (
                  <Badge className="text-[10px] h-5">{totalItems}</Badge>
                )}
              </div>
              
              <div className="mt-1 space-y-1 max-h-[70px] overflow-hidden">
                {/* Display calendar events */}
                {eventsForDay.slice(0, 2).map(event => (
                  <div 
                    key={event.id} 
                    className="text-xs p-1 rounded truncate" 
                    style={{ backgroundColor: `${event.color}20`, color: event.color }}
                  >
                    {event.title}
                  </div>
                ))}
                
                {/* Display tasks */}
                {tasksForDay.slice(0, Math.max(0, 2 - eventsForDay.length)).map(task => (
                  <div key={task.id} className="text-xs p-1 rounded bg-primary/10 truncate">
                    {task.title}
                  </div>
                ))}
                
                {totalItems > 2 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{totalItems - 2} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Selected day items */}
      {(getTasksForDay(selectedDate).length > 0 || getEventsForDay(selectedDate).length > 0) && (
        <div className="p-4 border-t">
          <h3 className="text-sm font-medium mb-2">
            Itens para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </h3>
          
          {/* Show calendar events */}
          {getEventsForDay(selectedDate).length > 0 && (
            <div className="space-y-2 mb-4">
              <h4 className="text-xs font-medium text-muted-foreground">Eventos</h4>
              {getEventsForDay(selectedDate).map(event => (
                <div 
                  key={event.id}
                  className="p-3 rounded-lg border"
                  style={{ borderLeftWidth: '4px', borderLeftColor: event.color }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{event.title}</h3>
                    {!event.allDay && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">
                        {format(new Date(event.startDate), "HH:mm")}
                        {event.endDate && ` - ${format(new Date(event.endDate), "HH:mm")}`}
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Show tasks */}
          {getTasksForDay(selectedDate).length > 0 && (
            <>
              {getEventsForDay(selectedDate).length > 0 && (
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Tarefas</h4>
              )}
              <div className="space-y-2">
                {getTasksForDay(selectedDate).map(task => (
                  <CalendarTaskCard key={task.id} task={task} projects={projects} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
