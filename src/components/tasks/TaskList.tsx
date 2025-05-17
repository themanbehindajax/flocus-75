
import { Task } from "@/lib/types";
import { TaskCardWrapper as TaskCard } from "./TaskCard";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { TaskCardCompact } from "./TaskCardCompact";

interface TaskListProps {
  tasks: Task[];
  variant?: "default" | "compact";
}

export const TaskList = ({ tasks, variant = "default" }: TaskListProps) => {
  const { toggleTaskCompletion } = useAppStore();

  const handleToggleTaskCompletion = (task: Task) => {
    toggleTaskCompletion(task.id);
    
    // Mostrar toast notification baseado no novo estado após o toggle
    // Como o estado já foi alterado pelo toggleTaskCompletion, precisamos verificar o oposto
    if (!task.completed) {
      toast.success(`Tarefa "${task.title}" concluída!`, {
        className: "animate-fade-in",
        duration: 2000
      });
    } else {
      toast.info(`Tarefa "${task.title}" reaberta!`, {
        className: "animate-fade-in",
        duration: 2000
      });
    }
  };

  return (
    <div className={`grid grid-cols-1 ${variant === "compact" ? "gap-2" : "gap-4"} animate-fade-in`}>
      {tasks.length === 0 ? (
        <div className="py-10 px-4 text-center bg-muted/20 rounded-xl border border-muted/30">
          <p className="text-muted-foreground">Nenhuma tarefa encontrada.</p>
        </div>
      ) : (
        tasks.map((task) => (
          variant === "compact" ? (
            <TaskCardCompact
              key={task.id}
              task={task}
              onComplete={() => handleToggleTaskCompletion(task)}
            />
          ) : (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={() => handleToggleTaskCompletion(task)}
            />
          )
        ))
      )}
    </div>
  );
}
