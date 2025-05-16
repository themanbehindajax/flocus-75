
import React from "react";
import { useAppStore } from "@/lib/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskSelectionProps {
  selectedTaskId: string;
  selectedProjectId: string;
  onTaskChange: (taskId: string) => void;
  onProjectChange: (projectId: string) => void;
  disabled: boolean;
}

export const TaskSelection: React.FC<TaskSelectionProps> = ({
  selectedTaskId,
  selectedProjectId,
  onTaskChange,
  onProjectChange,
  disabled,
}) => {
  const { tasks, projects } = useAppStore();
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Tarefa</label>
        <Select
          value={selectedTaskId}
          onValueChange={onTaskChange}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma tarefa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sem tarefa específica</SelectItem>
            {tasks
              .filter(task => !task.completed)
              .map(task => (
                <SelectItem key={task.id} value={task.id}>
                  {task.title}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Projeto</label>
        <Select
          value={selectedProjectId}
          onValueChange={onProjectChange}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um projeto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sem projeto específico</SelectItem>
            {projects.map(project => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
