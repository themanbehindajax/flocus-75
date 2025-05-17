
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Bell, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

interface CalendarEventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
  editEvent?: CalendarEvent;
}

export const CalendarEventForm = ({ 
  open, 
  onOpenChange,
  selectedDate,
  editEvent
}: CalendarEventFormProps) => {
  const { addCalendarEvent, updateCalendarEvent } = useAppStore();
  
  const [eventData, setEventData] = useState<{
    title: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    allDay: boolean;
    repeat: "none" | "daily" | "weekly" | "monthly" | "yearly";
    repeatUntil?: Date;
    reminder: number | null;
    color: string;
  }>({
    title: editEvent?.title || "",
    description: editEvent?.description || "",
    startDate: editEvent ? new Date(editEvent.startDate) : selectedDate || new Date(),
    endDate: editEvent?.endDate ? new Date(editEvent.endDate) : undefined,
    allDay: editEvent?.allDay || false,
    repeat: editEvent?.repeat || "none",
    repeatUntil: editEvent?.repeatUntil ? new Date(editEvent.repeatUntil) : undefined,
    reminder: editEvent?.reminder || null,
    color: editEvent?.color || "#6366f1"
  });

  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);
  const [repeatUntilPickerOpen, setRepeatUntilPickerOpen] = useState(false);

  const resetForm = () => {
    setEventData({
      title: "",
      description: "",
      startDate: selectedDate || new Date(),
      endDate: undefined,
      allDay: false,
      repeat: "none",
      repeatUntil: undefined,
      reminder: null,
      color: "#6366f1"
    });
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      setEventData(prev => ({ 
        ...prev, 
        startDate: date,
        // If end date is before new start date, update it
        endDate: prev.endDate && prev.endDate < date ? date : prev.endDate
      }));
      setStartDatePickerOpen(false);
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEventData(prev => ({ ...prev, endDate: date }));
    setEndDatePickerOpen(false);
  };

  const handleRepeatUntilSelect = (date: Date | undefined) => {
    setEventData(prev => ({ ...prev, repeatUntil: date }));
    setRepeatUntilPickerOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventData.title.trim()) {
      toast.error("O título do evento é obrigatório");
      return;
    }
    
    // For repeating events, require a repeat until date
    if (eventData.repeat !== "none" && !eventData.repeatUntil) {
      toast.error("Para eventos recorrentes, defina até quando o evento se repetirá");
      return;
    }

    const newEventData = {
      title: eventData.title.trim(),
      description: eventData.description.trim() || undefined,
      startDate: eventData.startDate.toISOString(),
      endDate: eventData.endDate?.toISOString(),
      allDay: eventData.allDay,
      repeat: eventData.repeat,
      repeatUntil: eventData.repeatUntil?.toISOString(),
      reminder: eventData.reminder || undefined,
      color: eventData.color
    };
    
    if (editEvent) {
      updateCalendarEvent({
        ...editEvent,
        ...newEventData
      });
      toast.success("Evento atualizado com sucesso!");
    } else {
      addCalendarEvent(newEventData);
      toast.success("Evento criado com sucesso!");
    }
    
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {editEvent ? "Editar Evento" : "Criar Novo Evento"}
            </DialogTitle>
            <DialogDescription>
              Adicione os detalhes do evento no seu calendário
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                placeholder="Título do evento"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={eventData.description}
                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                placeholder="Descrição do evento (opcional)"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="all-day">Dia Inteiro</Label>
                <Switch
                  id="all-day"
                  checked={eventData.allDay}
                  onCheckedChange={(checked) => setEventData({ ...eventData, allDay: checked })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Data de Início</Label>
                <Popover open={startDatePickerOpen} onOpenChange={setStartDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(eventData.startDate, "PPP", { locale: ptBR })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={eventData.startDate}
                      onSelect={handleStartDateSelect}
                      initialFocus
                      locale={ptBR}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label>Data de Fim</Label>
                <Popover open={endDatePickerOpen} onOpenChange={setEndDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {eventData.endDate ? format(eventData.endDate, "PPP", { locale: ptBR }) : "Não definido"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={eventData.endDate}
                      onSelect={handleEndDateSelect}
                      fromDate={eventData.startDate}
                      initialFocus
                      locale={ptBR}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="repeat">Repetir</Label>
              <Select
                value={eventData.repeat}
                onValueChange={(value: any) => setEventData({ ...eventData, repeat: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Não repetir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Não repetir</SelectItem>
                  <SelectItem value="daily">Diariamente</SelectItem>
                  <SelectItem value="weekly">Semanalmente</SelectItem>
                  <SelectItem value="monthly">Mensalmente</SelectItem>
                  <SelectItem value="yearly">Anualmente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {eventData.repeat !== "none" && (
              <div className="grid gap-2">
                <Label htmlFor="repeat-until">Repetir Até</Label>
                <Popover open={repeatUntilPickerOpen} onOpenChange={setRepeatUntilPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {eventData.repeatUntil ? format(eventData.repeatUntil, "PPP", { locale: ptBR }) : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={eventData.repeatUntil}
                      onSelect={handleRepeatUntilSelect}
                      fromDate={eventData.startDate}
                      initialFocus
                      locale={ptBR}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="reminder">Lembrete</Label>
              <Select
                value={eventData.reminder?.toString() || "null"}
                onValueChange={(value) => setEventData({ ...eventData, reminder: value === "null" ? null : parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sem lembrete" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">Sem lembrete</SelectItem>
                  <SelectItem value="5">5 minutos antes</SelectItem>
                  <SelectItem value="15">15 minutos antes</SelectItem>
                  <SelectItem value="30">30 minutos antes</SelectItem>
                  <SelectItem value="60">1 hora antes</SelectItem>
                  <SelectItem value="1440">1 dia antes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="color">Cor</Label>
              <div className="flex gap-2">
                {["#6366f1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"].map(color => (
                  <button
                    key={color}
                    type="button"
                    className={cn(
                      "w-8 h-8 rounded-full transition-all",
                      eventData.color === color ? "ring-2 ring-offset-2 ring-offset-background ring-primary" : ""
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setEventData({ ...eventData, color })}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editEvent ? "Atualizar Evento" : "Criar Evento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
