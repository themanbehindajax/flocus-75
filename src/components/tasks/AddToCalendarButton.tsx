
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth";
import { addTaskToCalendar } from "@/lib/googleCalendar";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

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
  const { googleToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Handler to add task to Google Calendar
  const handleAddToCalendar = async () => {
    if (!googleToken) {
      toast.error("Você precisa estar logado com Google para adicionar ao calendário");
      return;
    }

    if (!dueDate) {
      toast.error("Esta tarefa não tem data definida");
      return;
    }

    try {
      setIsLoading(true);
      
      // Format the date/time for Google Calendar
      const taskDate = new Date(dueDate);
      // Set time to noon if no time specified
      if (taskDate.getHours() === 0 && taskDate.getMinutes() === 0) {
        taskDate.setHours(12, 0, 0, 0);
      }
      
      const startDateTime = taskDate.toISOString();
      
      // Set end time to 1 hour after start time
      const endDateTime = new Date(taskDate.getTime() + 60 * 60 * 1000).toISOString();
      
      await addTaskToCalendar(
        googleToken,
        taskTitle,
        taskDescription,
        startDateTime,
        endDateTime
      );
      
      toast.success("Tarefa adicionada ao Google Calendar com sucesso!");
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
      disabled={isLoading || !dueDate || !googleToken}
      className="flex items-center gap-1"
      title="Adicionar ao Google Calendar"
    >
      <Calendar className="h-4 w-4" />
      <span className="hidden sm:inline">Calendar</span>
    </Button>
  );
};
