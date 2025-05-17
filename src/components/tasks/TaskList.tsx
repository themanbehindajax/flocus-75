
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
    // First toggle the task completion
    toggleTaskCompletion(task.id);
    
    // Show toast notification based on the NEW completion state (opposite of current)
    if (task.completed) {
      toast(`Tarefa "${task.title}" reaberta!`);
    } else {
      toast(`Tarefa "${task.title}" concluída!`);
    }
  };

  return (
    <div className={`grid grid-cols-1 ${variant === "compact" ? "gap-2" : "gap-4"}`}>
      {tasks.length === 0 ? (
        <div className="py-8 text-center">
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
