
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { CheckCircle, Calendar as CalendarIcon } from "lucide-react";
import { Task } from "@/lib/types";

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
                    <TaskCard key={task.id} task={task} projects={projects} />
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

interface TaskCardProps {
  task: Task;
  projects: { id: string; name: string }[];
}

const TaskCard = ({ task, projects }: TaskCardProps) => {
  const { completeTask } = useAppStore();
  
  const projectName = task.projectId 
    ? projects.find(p => p.id === task.projectId)?.name 
    : undefined;

  return (
    <div className={`p-4 rounded-lg border ${
      task.priority === 'alta' ? 'border-l-4 border-l-red-500' : 
      task.priority === 'media' ? 'border-l-4 border-l-yellow-500' : 
      'border-l-4 border-l-green-500'
    } ${task.completed ? 'bg-muted/20' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => completeTask(task.id)}
          className={`mt-1 w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center transition-colors ${
            task.completed ? "bg-primary text-white" : "border border-muted-foreground"
          }`}
        >
          {task.completed && <CheckCircle className="h-4 w-4" />}
        </button>
        
        <div className="flex-1">
          <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {task.description}
            </p>
          )}
          
          {task.subtasks.length > 0 && (
            <div className="mt-3 space-y-1 pl-2 border-l-2 border-muted">
              {task.subtasks.map(subtask => (
                <div key={subtask.id} className="text-sm flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${subtask.completed ? 'bg-primary' : 'bg-muted-foreground'}`} />
                  <span className={subtask.completed ? "line-through text-muted-foreground" : ""}>
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {projectName && (
            <div className="mt-2">
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                {projectName}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
