
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
  
  // Melhorado: Simplifica o início do arrasto
  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
    setIsDragging(true);
    
    // Adiciona classe global para melhorar a UX durante o arrasto
    document.body.classList.add('is-dragging');
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  };
  
  // Melhorado: Função handleDrop mais intuitiva
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    
    // Limpa estado global de arrastar
    document.body.classList.remove('is-dragging');
    
    if (!draggedTask) return;
    
    // Reseta o estado do drag
    setIsDragging(false);
    setDragOverColumn(null);
    
    if (draggedTask.status !== status) {
      // Atualiza o status da tarefa
      const updatedTask = {
        ...draggedTask,
        status,
        updatedAt: new Date().toISOString(),
      };
      
      updateTask(updatedTask);
      
      // Feedback visual e sonoro melhorado
      // Se movido para o status "done" e não estiver concluído, marca como concluído
      if (status === "done" && !draggedTask.completed) {
        toggleTaskCompletion(draggedTask.id);
        toast.success(`Tarefa "${draggedTask.title}" concluída!`, {
          className: "animate-fade-in",
          duration: 2000
        });
      }
      // Se movido do "done" para outro status e estiver concluído, desmarca conclusão
      else if (draggedTask.status === "done" && status !== "done" && draggedTask.completed) {
        toggleTaskCompletion(draggedTask.id);
        toast.info(`Tarefa "${draggedTask.title}" reaberta!`, {
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
    
    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    // Limpeza completa do estado de arrastar
    setIsDragging(false);
    setDraggedTask(null);
    setDragOverColumn(null);
    document.body.classList.remove('is-dragging');
  };

  // Melhoria de acessibilidade com atalhos de teclado
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
      // Garante que a classe seja removida ao desmontar
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
