
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { PriorityLevel, TaskStatus } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Zap } from "lucide-react";

interface QuickAddTaskProps {
  projectId?: string;
  onTaskAdded?: () => void;
}

export const QuickAddTask = ({ projectId, onTaskAdded }: QuickAddTaskProps) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [isQuickTask, setIsQuickTask] = useState(false);
  const { addTask } = useAppStore();

  const handleCreateTask = () => {
    if (taskTitle.trim()) {
      // Certifica-se de que a tarefa será associada ao projeto
      const newTask = {
        title: taskTitle.trim(),
        description: "",
        priority: "media" as PriorityLevel,
        status: "todo" as TaskStatus,
        tags: [],
        projectId: projectId,
        subtasks: [],
        isQuick: isQuickTask,
        completed: false,
      };
      
      // Adiciona a tarefa e obtém a referência da tarefa criada
      addTask(newTask);
      
      if (isQuickTask) {
        toast(`Tarefa rápida "${taskTitle}" adicionada`);
      } else {
        toast(`Tarefa "${taskTitle}" adicionada`);
      }
      
      setTaskTitle("");
      setIsQuickTask(false);
      
      // Chama o callback para atualizar a interface se fornecido
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
        placeholder="Adicionar nova tarefa..."
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        className="flex-1"
      />
      <Button
        type="button"
        size="icon"
        variant={isQuickTask ? "default" : "outline"}
        onClick={() => setIsQuickTask(!isQuickTask)}
        className="min-w-10"
        title={isQuickTask ? "Tarefa rápida ativa" : "Marcar como tarefa rápida"}
      >
        <Zap className={`h-4 w-4 ${isQuickTask ? "text-white" : ""}`} />
      </Button>
      <Button type="submit" disabled={!taskTitle.trim()}>
        Adicionar
      </Button>
    </form>
  );
};
