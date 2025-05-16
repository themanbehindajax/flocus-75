
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth";
import { useAppStore } from "@/lib/store";
import { syncTasksToCalendar, syncCalendarToTasks } from "@/lib/calendarSync";
import { toast } from "sonner";
import { Calendar, SyncIcon } from "lucide-react";

export const SyncCalendarButton = () => {
  const { googleToken } = useAuthStore();
  const { tasks, addTask } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    if (!googleToken) {
      toast.error("Você precisa estar logado com Google para sincronizar o calendário");
      return;
    }

    try {
      setIsLoading(true);
      
      // Two-way sync: First push tasks to calendar, then pull events from calendar
      await syncTasksToCalendar(googleToken, tasks);
      await syncCalendarToTasks(googleToken, addTask);
      
      toast.success("Calendário sincronizado com sucesso!");
    } catch (error) {
      console.error("Erro ao sincronizar com o calendário:", error);
      toast.error("Erro ao sincronizar com o calendário");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSync}
      disabled={isLoading || !googleToken}
      className="flex items-center gap-1"
      title="Sincronizar com Google Calendar"
    >
      {isLoading ? (
        <SyncIcon className="h-4 w-4 animate-spin" />
      ) : (
        <Calendar className="h-4 w-4" />
      )}
      <span className="hidden sm:inline">Sincronizar Calendário</span>
    </Button>
  );
};
