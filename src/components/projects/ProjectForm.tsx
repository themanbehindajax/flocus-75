
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Project } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { t } from "@/lib/translations";

interface ProjectFormProps {
  onSubmit: (project: Omit<Project, "id" | "createdAt" | "updatedAt" | "tasks">) => void;
  onCancel: () => void;
  initialProject?: Partial<Project>;
  submitButtonText?: string;
}

export const ProjectForm = ({
  onSubmit,
  onCancel,
  initialProject = {},
  submitButtonText = t('create_project')
}: ProjectFormProps) => {
  const [name, setName] = useState(initialProject.name || "");
  const [goal, setGoal] = useState(initialProject.goal || "");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialProject.dueDate ? new Date(initialProject.dueDate) : undefined
  );

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit({
        name: name.trim(),
        description: "",
        goal: goal,
        dueDate: selectedDate ? selectedDate.toISOString() : undefined,
      });
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t('project_name')}</Label>
        <Input
          id="name"
          placeholder={t('project_name_placeholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="goal">{t('main_goal')}</Label>
        <Textarea
          id="goal"
          placeholder={t('main_goal_placeholder')}
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dueDate">{t('completion_date')}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="dueDate"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "dd/MM/yyyy") : <span>{t('select_date')}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button onClick={handleSubmit}>{submitButtonText}</Button>
      </DialogFooter>
    </div>
  );
};
