
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format, isSameDay, isToday, startOfWeek, endOfWeek, addDays, subDays, addWeeks, subWeeks } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, PlusCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FullCalendarView } from "@/components/calendar/FullCalendarView";
import { WeekCalendarView } from "@/components/calendar/WeekCalendarView";
import { DayCalendarView } from "@/components/calendar/DayCalendarView";
import { toast } from "sonner";
import { CalendarEventForm } from "@/components/calendar/CalendarEventForm";
import { formatInTimeZone } from "date-fns-tz";
import { requestNotificationPermission } from "@/lib/notifications";

const Calendar = () => {
  const { tasks, projects, calendarEvents } = useAppStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("month");
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Atualizar o horário atual a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 60000ms = 1 minuto
    
    return () => clearInterval(timer);
  }, []);

  // Solicitar permissão de notificação quando o componente montar
  useEffect(() => {
    const checkNotificationPermission = async () => {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        toast.warning("As notificações estão desativadas. Você não receberá lembretes de eventos.", {
          duration: 5000,
          action: {
            label: "Ativar",
            onClick: () => requestNotificationPermission()
          }
        });
      }
    };
    
    checkNotificationPermission();
  }, []);
  
  // Formatar data e horário com o fuso horário de São Paulo
  const formatLocalDateTime = (date: Date, formatStr: string) => {
    return formatInTimeZone(date, 'America/Sao_Paulo', formatStr, { locale: ptBR });
  };
  
  // Obter o dia da semana em português
  const getCurrentDayOfWeek = () => {
    return formatInTimeZone(currentTime, 'America/Sao_Paulo', 'EEEE', { locale: ptBR });
  };
  
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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendário</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-muted-foreground mt-1">
              <p>
                {formatLocalDateTime(currentTime, 'PPP')}
              </p>
              <p className="hidden sm:block">•</p>
              <p className="flex items-center gap-1.5">
                <span className="capitalize">{getCurrentDayOfWeek()}</span>
                <span className="font-medium text-foreground">{formatLocalDateTime(currentTime, 'HH:mm')}</span>
                <span className="text-xs">({formatLocalDateTime(currentTime, 'OOOO')})</span>
              </p>
            </div>
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
              {view === "day" && formatLocalDateTime(selectedDate, "dd 'de' MMMM 'de' yyyy")}
              {view === "week" && `${formatLocalDateTime(startOfWeek(selectedDate, { weekStartsOn: 0 }), "dd MMM")} - ${formatLocalDateTime(endOfWeek(selectedDate, { weekStartsOn: 0 }), "dd MMM")}`}
              {view === "month" && formatLocalDateTime(selectedDate, "MMMM yyyy")}
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
            />
          )}
          
          {view === "week" && (
            <WeekCalendarView 
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              tasks={tasks}
              projects={projects}
            />
          )}
          
          {view === "day" && (
            <DayCalendarView 
              selectedDate={selectedDate}
              tasks={tasks}
              projects={projects}
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
