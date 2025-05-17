
import { Task } from "@/lib/types";
import { TaskCardWrapper as TaskCard } from "./TaskCard";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

interface TaskListProps {
  tasks: Task[];
  variant?: "default" | "compact";
}

export const TaskList = ({ tasks, variant = "default" }: TaskListProps) => {
  const { completeTask, updateTask } = useAppStore();

  const handleCompleteTask = (task: Task) => {
    if (!task.completed) {
      completeTask(task.id);
      
      // Also update status to "done" if not already
      if (task.status !== "done") {
        updateTask({
          ...task,
          status: "done",
          completed: true,
          updatedAt: new Date().toISOString(),
        });
      }
      
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
          <TaskCard 
            key={task.id} 
            task={task} 
            onComplete={() => handleCompleteTask(task)}
            variant={variant}
          />
        ))
      )}
    </div>
  );
}
