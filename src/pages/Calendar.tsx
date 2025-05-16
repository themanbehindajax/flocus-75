
import { useState } from "react";
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
import { cn } from "@/lib/utils";
import { format, isSameDay, isToday } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from "lucide-react";
import { CalendarTaskCard } from "@/components/calendar/CalendarTaskCard";
import { SyncCalendarButton } from "@/components/calendar/SyncCalendarButton";

const Calendar = () => {
  const { tasks, projects } = useAppStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Get tasks for the selected date
  const tasksForSelectedDate = tasks.filter(task => {
    if (!task.dueDate) return false;
    return isSameDay(new Date(task.dueDate), selectedDate);
  });
  
  // Calculate days with tasks for visual indicators
  const daysWithTasks = tasks
    .filter(task => task.dueDate)
    .map(task => new Date(task.dueDate as string));
  
  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendário</h1>
            <p className="text-muted-foreground mt-1">
              Visualize suas tarefas em formato de calendário
            </p>
          </div>
          <SyncCalendarButton />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calendar Column */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Calendário</CardTitle>
              <CardDescription>
                Selecione uma data para ver as tarefas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
                locale={ptBR}
                modifiers={{
                  hasTasks: (date) => daysWithTasks.some(taskDate => isSameDay(date, taskDate)),
                }}
                modifiersClassNames={{
                  hasTasks: "bg-primary/10 font-bold",
                }}
                components={{
                  DayContent: ({ date }) => (
                    <div className="relative flex h-8 w-8 items-center justify-center">
                      {format(date, "d")}
                      {daysWithTasks.some(taskDate => isSameDay(date, taskDate)) && (
                        <div className="absolute bottom-1 h-1 w-1 rounded-full bg-primary"></div>
                      )}
                    </div>
                  ),
                }}
              />
            </CardContent>
          </Card>
          
          {/* Tasks for Selected Date */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Tarefas para {format(selectedDate, "PPP", { locale: ptBR })}
              </CardTitle>
              <CardDescription>
                {isToday(selectedDate) ? "Hoje" : ""} 
                {tasksForSelectedDate.length === 0 
                  ? " - Nenhuma tarefa agendada para esta data" 
                  : ` - ${tasksForSelectedDate.length} tarefa(s) agendada(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tasksForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {tasksForSelectedDate.map(task => (
                    <CalendarTaskCard key={task.id} task={task} projects={projects} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">
                    Não há tarefas agendadas para esta data.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Calendar;
