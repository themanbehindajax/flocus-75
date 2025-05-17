
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Task, TaskStatus } from "@/lib/types";
import { KanbanColumn } from "./KanbanColumn";
import { toast } from "sonner";

interface KanbanBoardProps {
  tasks: Task[];
  projectId: string;
}

export const KanbanBoard = ({ tasks, projectId }: KanbanBoardProps) => {
  const { updateTask, toggleTaskCompletion } = useAppStore();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  
  // Group tasks by status
  const todoTasks = tasks.filter(task => task.status === "todo");
  const doingTasks = tasks.filter(task => task.status === "doing");
  const doneTasks = tasks.filter(task => task.status === "done");
  
  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (status: TaskStatus) => {
    if (!draggedTask) return;
    
    if (draggedTask.status !== status) {
      // Update the task status
      const updatedTask = {
        ...draggedTask,
        status: status,
        updatedAt: new Date().toISOString(),
      };
      
      updateTask(updatedTask);
      
      // If moving to "done" status and not already completed, mark as completed
      if (status === "done" && !draggedTask.completed) {
        toggleTaskCompletion(draggedTask.id);
        toast(`Tarefa "${draggedTask.title}" concluída!`);
      }
      // If moving from "done" to another status and is completed, unmark completion
      else if (draggedTask.status === "done" && status !== "done" && draggedTask.completed) {
        toggleTaskCompletion(draggedTask.id);
        toast(`Tarefa "${draggedTask.title}" reaberta!`);
      }
    }
    
    // Reset the dragged task state
    setDraggedTask(null);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KanbanColumn 
        title="A Fazer" 
        tasks={todoTasks}
        status="todo"
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={() => handleDrop("todo")}
      />
      
      <KanbanColumn 
        title="Fazendo" 
        tasks={doingTasks}
        status="doing"
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={() => handleDrop("doing")}
      />
      
      <KanbanColumn 
        title="Feito" 
        tasks={doneTasks}
        status="done"
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={() => handleDrop("done")}
      />
    </div>
  );
};
