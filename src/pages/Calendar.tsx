
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format, isSameDay, isToday, startOfWeek, endOfWeek, addDays, subDays, addWeeks, subWeeks } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import { CalendarTaskCard } from "@/components/calendar/CalendarTaskCard";
import { Button } from "@/components/ui/button";
import { FullCalendarView } from "@/components/calendar/FullCalendarView";
import { WeekCalendarView } from "@/components/calendar/WeekCalendarView";
import { DayCalendarView } from "@/components/calendar/DayCalendarView";
import { toast } from "sonner";
import { CalendarEventForm } from "@/components/calendar/CalendarEventForm";

const Calendar = () => {
  const { tasks, projects, calendarEvents } = useAppStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("month");
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  
  // Get tasks for the selected date
  const tasksForSelectedDate = tasks.filter(task => {
    if (!task.dueDate) return false;
    return isSameDay(new Date(task.dueDate), selectedDate);
  });
  
  // Calculate days with tasks for visual indicators
  const daysWithTasks = tasks
    .filter(task => task.dueDate)
    .map(task => new Date(task.dueDate as string));
  
  // Navigation functions
  const goToToday = () => setSelectedDate(new Date());
  
  const navigatePrevious = () => {
    if (view === "day") {
      setSelectedDate(subDays(selectedDate, 1));
    } else if (view === "week") {
      setSelectedDate(subWeeks(selectedDate, 1));
    } else {
      const prevMonth = new Date(selectedDate);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      setSelectedDate(prevMonth);
    }
  };
  
  const navigateNext = () => {
    if (view === "day") {
      setSelectedDate(addDays(selectedDate, 1));
    } else if (view === "week") {
      setSelectedDate(addWeeks(selectedDate, 1));
    } else {
      const nextMonth = new Date(selectedDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setSelectedDate(nextMonth);
    }
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsEventFormOpen(true);
  };
  
  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendário</h1>
            <p className="text-muted-foreground mt-1">
              Visualize suas tarefas e eventos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleAddEvent}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Evento
            </Button>
          </div>
        </div>
        
        {/* Calendar Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={navigatePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={navigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={goToToday}>Hoje</Button>
            <h2 className="text-xl font-semibold ml-2">
              {view === "day" && format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              {view === "week" && `${format(startOfWeek(selectedDate, { weekStartsOn: 0 }), "dd MMM", { locale: ptBR })} - ${format(endOfWeek(selectedDate, { weekStartsOn: 0 }), "dd MMM", { locale: ptBR })}`}
              {view === "month" && format(selectedDate, "MMMM yyyy", { locale: ptBR })}
            </h2>
          </div>
          
          <Tabs defaultValue="month" value={view} onValueChange={(v) => setView(v as "day" | "week" | "month")}>
            <TabsList>
              <TabsTrigger value="day">Dia</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mês</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Calendar Views */}
        <div>
          {view === "month" && (
            <FullCalendarView 
              selectedDate={selectedDate} 
              onSelectDate={setSelectedDate}
              tasks={tasks}
              projects={projects}
              events={calendarEvents}
              onAddEvent={handleAddEvent}
              onEditEvent={(event) => {
                setEditingEvent(event);
                setIsEventFormOpen(true);
              }}
            />
          )}
          
          {view === "week" && (
            <WeekCalendarView 
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              tasks={tasks}
              projects={projects}
              events={calendarEvents}
              onAddEvent={handleAddEvent}
              onEditEvent={(event) => {
                setEditingEvent(event);
                setIsEventFormOpen(true);
              }}
            />
          )}
          
          {view === "day" && (
            <DayCalendarView 
              selectedDate={selectedDate}
              tasks={tasks}
              projects={projects}
              events={calendarEvents}
              onAddEvent={handleAddEvent}
              onEditEvent={(event) => {
                setEditingEvent(event);
                setIsEventFormOpen(true);
              }}
            />
          )}
        </div>

        {/* Event Form Dialog */}
        <CalendarEventForm 
          open={isEventFormOpen} 
          onOpenChange={setIsEventFormOpen} 
          selectedDate={selectedDate} 
          editEvent={editingEvent}
        />
      </div>
    </AppLayout>
  );
};

export default Calendar;
