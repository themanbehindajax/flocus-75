
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth";
import { addTaskToCalendar } from "@/lib/googleCalendar";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";
import { formatInTimeZone } from "date-fns-tz";

interface AddToCalendarButtonProps {
  taskTitle: string;
  taskDescription?: string;
  dueDate?: string;
}

export const AddToCalendarButton = ({
  taskTitle,
  taskDescription = "",
  dueDate,
}: AddToCalendarButtonProps) => {
  const { user } = useAuthStore();
  const { addCalendarEvent } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  // Handler to add task to Calendar
  const handleAddToCalendar = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para adicionar ao calendário");
      return;
    }

    if (!dueDate) {
      toast.error("Esta tarefa não tem data definida");
      return;
    }

    try {
      setIsLoading(true);
      
      // Format the date/time for Calendar
      const taskDate = new Date(dueDate);
      // Set time to noon if no time specified
      if (taskDate.getHours() === 0 && taskDate.getMinutes() === 0) {
        taskDate.setHours(12, 0, 0, 0);
      }
      
      // Format start and end times with São Paulo timezone
      const startTime = formatInTimeZone(taskDate, 'America/Sao_Paulo', 'HH:mm');
      const endTime = formatInTimeZone(
        new Date(taskDate.getTime() + 60 * 60 * 1000), 
        'America/Sao_Paulo', 
        'HH:mm'
      );
      
      // Add to local calendar instead
      addCalendarEvent({
        title: taskTitle,
        description: taskDescription || undefined,
        startDate: taskDate.toISOString(),
        endDate: new Date(taskDate.getTime() + 60 * 60 * 1000).toISOString(),
        allDay: false,
        repeat: "none",
        color: "#6366f1"
      });
      
      toast.success(`Tarefa adicionada ao calendário das ${startTime} às ${endTime}`);
    } catch (error) {
      console.error("Erro ao adicionar tarefa ao calendário:", error);
      toast.error("Erro ao adicionar tarefa ao calendário");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleAddToCalendar}
      disabled={isLoading || !dueDate}
      className="flex items-center gap-1"
      title="Adicionar ao Calendário"
    >
      <Calendar className="h-4 w-4" />
      <span className="hidden sm:inline">Calendar</span>
    </Button>
  );
};
