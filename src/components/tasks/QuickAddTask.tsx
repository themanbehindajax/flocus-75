
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bolt } from "lucide-react";

interface QuickAddTaskProps {
  projectId?: string;
  onTaskAdded?: () => void;
}

export const QuickAddTask = ({ projectId, onTaskAdded }: QuickAddTaskProps) => {
  const [taskTitle, setTaskTitle] = useState("");
  const { addTask } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      addTask({
        title: taskTitle,
        description: "",
        dueDate: "",
        priority: "media",
        status: "todo",
        projectId,
        tags: [],
        completed: false,
        subtasks: [],
      });
      setTaskTitle("");
      if (onTaskAdded) onTaskAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder="Adicionar nova tarefa..."
        className="flex-grow bg-white/10 border-white/20 text-foreground placeholder:text-muted-foreground"
      />
      <Button 
        type="submit" 
        size="sm" 
        disabled={!taskTitle.trim()}
        className="text-white"
      >
        <Bolt className="w-4 h-4 mr-1" />
        Adicionar
      </Button>
    </form>
  );
};
