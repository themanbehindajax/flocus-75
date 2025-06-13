
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { t } from "@/lib/translations";

interface TaskFormDueDateProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export const TaskFormDueDate = ({ date, setDate }: TaskFormDueDateProps) => {
  const [open, setOpen] = useState(false);
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setOpen(false); // Close the popover when date is selected
  };
  
  return (
    <div className="space-y-2">
      <Label>{t('due_date')}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP", { locale: enUS }) : <span>{t('select_due_date')}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            locale={enUS}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
