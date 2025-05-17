
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth";
import { useAppStore } from "@/lib/store";
import { syncTasksToCalendar, syncCalendarToTasks } from "@/lib/calendarSync";
import { toast } from "sonner";
import { Calendar, RefreshCw, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const SyncCalendarButton = () => {
  const { googleToken } = useAuthStore();
  const { tasks, addTask } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleSync = async () => {
    if (!googleToken) {
      setShowDialog(true);
      return;
    }

    try {
      setIsLoading(true);
      
      // Two-way sync: First push tasks to calendar, then pull events from calendar
      await syncTasksToCalendar(googleToken, tasks);
      
      // After pushing tasks, fetch new events from Google Calendar
      await syncCalendarToTasks(googleToken, addTask);
      
      toast.success("Calendário sincronizado com sucesso!");
    } catch (error) {
      console.error("Erro ao sincronizar com o calendário:", error);
      
      // Mensagens mais descritivas baseadas no erro
      if (String(error).includes("401")) {
        toast.error("Erro de autenticação. Por favor, faça login novamente com sua conta Google.");
      } else {
        toast.error("Não foi possível sincronizar com o Google Calendar. Verifique sua conexão.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSync}
        disabled={isLoading}
        className="flex items-center gap-2"
        title="Sincronizar com Google Calendar"
      >
        {isLoading ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <Calendar className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">Sincronizar Calendário</span>
      </Button>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sincronização com Google Calendar</DialogTitle>
            <DialogDescription>
              Para sincronizar suas tarefas com o Google Calendar, você precisa estar logado com uma conta Google.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center p-4 bg-muted/20 rounded-lg">
            <AlertCircle className="h-6 w-6 text-amber-500 mr-2" />
            <p className="text-sm">
              Você pode continuar usando o calendário interno do Flocus sem precisar sincronizar com o Google Calendar.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
