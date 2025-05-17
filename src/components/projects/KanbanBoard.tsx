
import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Task, TaskStatus } from "@/lib/types";
import { KanbanColumn } from "./KanbanColumn";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface KanbanBoardProps {
  tasks: Task[];
  projectId: string;
}

export const KanbanBoard = ({ tasks, projectId }: KanbanBoardProps) => {
  const { updateTask, toggleTaskCompletion } = useAppStore();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  
  // Group tasks by status
  const todoTasks = tasks.filter(task => task.status === "todo");
  const doingTasks = tasks.filter(task => task.status === "doing");
  const doneTasks = tasks.filter(task => task.status === "done");
  
  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
    setIsDragging(true);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    
    // Try to get the data from dataTransfer first
    let taskData;
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (dataStr) {
        taskData = JSON.parse(dataStr);
      }
    } catch (err) {
      console.error("Error parsing drag data:", err);
    }
    
    // Fall back to the state if dataTransfer doesn't work
    const taskId = taskData?.taskId || (draggedTask?.id || null);
    if (!taskId) return;
    
    // Find the task by ID
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Reset drag state
    setIsDragging(false);
    setDragOverColumn(null);
    setDraggedTask(null);
    
    if (task.status !== status) {
      // Update the task status
      const updatedTask = {
        ...task,
        status,
        updatedAt: new Date().toISOString(),
      };
      
      updateTask(updatedTask);
      
      // If moving to "done" status and not already completed, mark as completed
      if (status === "done" && !task.completed) {
        toggleTaskCompletion(task.id);
        toast.success(`Tarefa "${task.title}" concluída!`, {
          className: "animate-fade-in",
          duration: 2000
        });
      }
      // If moving from "done" to another status and is completed, unmark completion
      else if (task.status === "done" && status !== "done" && task.completed) {
        toggleTaskCompletion(task.id);
        toast.info(`Tarefa "${task.title}" reaberta!`, {
          className: "animate-fade-in",
          duration: 2000
        });
      } else {
        toast.info(`Tarefa movida para ${
          status === "todo" ? "A Fazer" : 
          status === "doing" ? "Fazendo" : 
          "Feito"
        }`, {
          className: "animate-fade-in",
          duration: 2000
        });
      }
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  // Improve accessibility with keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!draggedTask) return;
      
      if (e.key === 'Escape') {
        setDraggedTask(null);
        setIsDragging(false);
        setDragOverColumn(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [draggedTask]);
  
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 animate-fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <KanbanColumn 
        title="A Fazer" 
        tasks={todoTasks}
        status="todo"
        onDragStart={handleDragStart}
        onDragOver={(e) => handleDragOver(e, "todo")}
        onDrop={(e) => handleDrop(e, "todo")}
        onDragEnd={handleDragEnd}
        isDraggingOver={isDragging && dragOverColumn === "todo"}
      />
      
      <KanbanColumn 
        title="Fazendo" 
        tasks={doingTasks}
        status="doing"
        onDragStart={handleDragStart}
        onDragOver={(e) => handleDragOver(e, "doing")}
        onDrop={(e) => handleDrop(e, "doing")}
        onDragEnd={handleDragEnd}
        isDraggingOver={isDragging && dragOverColumn === "doing"}
      />
      
      <KanbanColumn 
        title="Feito" 
        tasks={doneTasks}
        status="done"
        onDragStart={handleDragStart}
        onDragOver={(e) => handleDragOver(e, "done")}
        onDrop={(e) => handleDrop(e, "done")}
        onDragEnd={handleDragEnd}
        isDraggingOver={isDragging && dragOverColumn === "done"}
      />
    </motion.div>
  );
};
