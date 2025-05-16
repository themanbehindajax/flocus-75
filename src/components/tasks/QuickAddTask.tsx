
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { PriorityLevel } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface QuickAddTaskProps {
  projectId?: string;
  onTaskAdded?: () => void;
}

export const QuickAddTask = ({ projectId, onTaskAdded }: QuickAddTaskProps) => {
  const [taskTitle, setTaskTitle] = useState("");
  const { addTask } = useAppStore();

  const handleCreateTask = () => {
    if (taskTitle.trim()) {
      addTask({
        title: taskTitle.trim(),
        description: "",
        priority: "media" as PriorityLevel,
        status: "todo",
        tags: [],
        projectId: projectId,
        subtasks: [], // Add missing subtasks property
        isQuick: true,
      });

      toast(`Tarefa "${taskTitle}" adicionada`);
      setTaskTitle("");
      
      if (onTaskAdded) {
        onTaskAdded();
      }
    }
  };

  return (
    <form 
      className="flex items-center gap-2" 
      onSubmit={(e) => {
        e.preventDefault();
        handleCreateTask();
      }}
    >
      <Input
        placeholder="Adicionar nova tarefa rápida..."
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" disabled={!taskTitle.trim()}>
        Adicionar
      </Button>
    </form>
  );
};
