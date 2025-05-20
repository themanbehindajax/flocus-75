
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
  
  // Improved: Simplifies drag start
  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
    setIsDragging(true);
    
    // Add global class to improve UX during dragging
    document.body.classList.add('is-dragging');
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  };
  
  // Improved: More intuitive handleDrop function
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    
    // Clear global drag state
    document.body.classList.remove('is-dragging');
    
    if (!draggedTask) return;
    
    // Reset drag state
    setIsDragging(false);
    setDragOverColumn(null);
    
    if (draggedTask.status !== status) {
      // Update task status
      const updatedTask = {
        ...draggedTask,
        status,
        updatedAt: new Date().toISOString(),
      };
      
      updateTask(updatedTask);
      
      // Improved visual and audio feedback
      // If moved to "done" status and not completed, mark as completed
      if (status === "done" && !draggedTask.completed) {
        toggleTaskCompletion(draggedTask.id);
        toast.success(`Task "${draggedTask.title}" completed!`, {
          className: "animate-fade-in",
          duration: 2000
        });
      }
      // If moved from "done" to another status and is completed, unmark completion
      else if (draggedTask.status === "done" && status !== "done" && draggedTask.completed) {
        toggleTaskCompletion(draggedTask.id);
        toast.info(`Task "${draggedTask.title}" reopened!`, {
          className: "animate-fade-in",
          duration: 2000
        });
      } else {
        toast.info(`Task moved to ${
          status === "todo" ? "To Do" : 
          status === "doing" ? "In Progress" : 
          "Done"
        }`, {
          className: "animate-fade-in",
          duration: 2000
        });
      }
    }
    
    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    // Complete cleanup of drag state
    setIsDragging(false);
    setDraggedTask(null);
    setDragOverColumn(null);
    document.body.classList.remove('is-dragging');
  };

  // Accessibility improvement with keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!draggedTask) return;
      
      if (e.key === 'Escape') {
        setDraggedTask(null);
        setIsDragging(false);
        setDragOverColumn(null);
        document.body.classList.remove('is-dragging');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Ensure class is removed when unmounting
      document.body.classList.remove('is-dragging');
    };
  }, [draggedTask]);
  
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 animate-fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <KanbanColumn 
        title="To Do" 
        tasks={todoTasks}
        status="todo"
        onDragStart={handleDragStart}
        onDragOver={(e) => handleDragOver(e, "todo")}
        onDrop={(e) => handleDrop(e, "todo")}
        onDragEnd={handleDragEnd}
        isDraggingOver={isDragging && dragOverColumn === "todo"}
      />
      
      <KanbanColumn 
        title="In Progress" 
        tasks={doingTasks}
        status="doing"
        onDragStart={handleDragStart}
        onDragOver={(e) => handleDragOver(e, "doing")}
        onDrop={(e) => handleDrop(e, "doing")}
        onDragEnd={handleDragEnd}
        isDraggingOver={isDragging && dragOverColumn === "doing"}
      />
      
      <KanbanColumn 
        title="Done" 
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
