
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Task, TaskStatus } from "@/lib/types";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
  tasks: Task[];
  projectId: string;
}

export const KanbanBoard = ({ tasks, projectId }: KanbanBoardProps) => {
  const { updateTask, completeTask } = useAppStore();
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
    if (draggedTask && draggedTask.status !== status) {
      // First update the task status
      updateTask({
        ...draggedTask,
        status: status,
        updatedAt: new Date().toISOString(),
      });
      
      // If moving to "done" status, also mark as completed
      if (status === "done" && !draggedTask.completed) {
        completeTask(draggedTask.id);
      }
      
      setDraggedTask(null);
    }
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
