
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export const SyncCalendarButton = () => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      title="Sincronização de calendário desativada"
      disabled
    >
      <Calendar className="h-4 w-4" />
      <span className="hidden sm:inline">Sincronizar Calendário</span>
    </Button>
  );
};
