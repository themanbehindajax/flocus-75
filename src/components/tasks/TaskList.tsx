
import { Task } from "@/lib/types";
import { TaskCardWrapper as TaskCard } from "./TaskCard";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

interface TaskListProps {
  tasks: Task[];
}

export const TaskList = ({ tasks }: TaskListProps) => {
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
    <div className="grid grid-cols-1 gap-4">
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onComplete={() => handleCompleteTask(task)}
        />
      ))}
    </div>
  );
};
