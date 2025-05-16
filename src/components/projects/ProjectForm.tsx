
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
  submitButtonText = "Criar Projeto"
}: ProjectFormProps) => {
  const [project, setProject] = useState({
    name: initialProject.name || "",
    goal: initialProject.goal || "",
    dueDate: initialProject.dueDate || "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialProject.dueDate ? new Date(initialProject.dueDate) : undefined
  );

  const handleSubmit = () => {
    if (project.name.trim()) {
      onSubmit({
        name: project.name.trim(),
        goal: project.goal.trim(),
        dueDate: selectedDate ? selectedDate.toISOString() : undefined,
      });
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Projeto</Label>
        <Input
          id="name"
          placeholder="Insira o nome do projeto"
          value={project.name}
          onChange={(e) => setProject({ ...project, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="goal">Meta Principal</Label>
        <Textarea
          id="goal"
          placeholder="Qual é o objetivo deste projeto?"
          value={project.goal}
          onChange={(e) => setProject({ ...project, goal: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dueDate">Data de Conclusão</Label>
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
              {selectedDate ? format(selectedDate, "dd/MM/yyyy") : <span>Selecione uma data</span>}
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
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>{submitButtonText}</Button>
      </DialogFooter>
    </div>
  );
};
