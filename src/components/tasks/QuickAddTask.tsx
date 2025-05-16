
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriorityLevel } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface QuickAddTaskProps {
  projectId?: string;
  onTaskAdded?: () => void;
}

export const QuickAddTask = ({ projectId, onTaskAdded }: QuickAddTaskProps) => {
  const { addTask } = useAppStore();
  const { toast } = useToast();
  const [taskTitle, setTaskTitle] = useState("");
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (taskTitle.trim()) {
      const newTask = addTask({
        title: taskTitle.trim(),
        description: "",
        priority: "media" as PriorityLevel,
        status: "todo",
        tags: [],
        projectId,
        isQuick: true
      });
      
      toast({
        title: "Tarefa adicionada",
        description: "Tarefa rápida adicionada com sucesso."
      });
      
      setTaskTitle("");
      if (onTaskAdded) onTaskAdded();
    }
  };
  
  return (
    <form onSubmit={handleAddTask} className="flex gap-2">
      <Input
        placeholder="Adicionar tarefa rápida..."
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        className="flex-1"
      />
      <Button type="submit">
        <Plus className="h-4 w-4 mr-1" />
        Adicionar
      </Button>
    </form>
  );
};
