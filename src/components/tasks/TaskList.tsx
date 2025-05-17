
import { Task } from "@/lib/types";
import { TaskCardWrapper as TaskCard } from "./TaskCard";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { TaskCardCompact } from "./TaskCardCompact";
import { motion } from "framer-motion";

interface TaskListProps {
  tasks: Task[];
  variant?: "default" | "compact";
  showProjectName?: boolean;
}

export const TaskList = ({ tasks, variant = "default", showProjectName = false }: TaskListProps) => {
  const { toggleTaskCompletion, projects, tags } = useAppStore();

  const handleToggleTaskCompletion = (task: Task) => {
    toggleTaskCompletion(task.id);
    
    // Mostrar toast notification baseado no novo estado após o toggle
    // Como o estado já foi alterado pelo toggleTaskCompletion, precisamos verificar o oposto
    if (!task.completed) {
      toast.success(`Tarefa "${task.title}" concluída!`, {
        className: "toast-success",
        position: "bottom-right",
        duration: 3000
      });
    } else {
      toast.info(`Tarefa "${task.title}" reaberta!`, {
        className: "toast-info",
        position: "bottom-right",
        duration: 3000
      });
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  // Função para buscar o projeto pelo ID
  const getProjectName = (projectId?: string) => {
    if (!projectId) return null;
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : null;
  };

  // Função para obter as tags pelo ID
  const getTaskTags = (tagIds: string[]) => {
    return tagIds.map(id => {
      const tag = tags.find(t => t.id === id);
      return tag || null;
    }).filter(tag => tag !== null);
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className={`grid grid-cols-1 ${variant === "compact" ? "gap-2.5" : "gap-4"}`}
    >
      {tasks.length === 0 ? (
        <motion.div 
          variants={item}
          className="py-12 px-6 text-center bg-muted/10 rounded-2xl border border-muted/30"
        >
          <p className="text-muted-foreground">Nenhuma tarefa encontrada.</p>
        </motion.div>
      ) : (
        tasks.map((task) => (
          <motion.div key={task.id} variants={item}>
            {variant === "compact" ? (
              <TaskCardCompact
                task={task}
                onComplete={() => handleToggleTaskCompletion(task)}
              />
            ) : (
              <TaskCard
                task={{
                  ...task,
                  projectName: showProjectName ? getProjectName(task.projectId) : undefined,
                  tagObjects: getTaskTags(task.tags)
                }}
                onComplete={() => handleToggleTaskCompletion(task)}
              />
            )}
          </motion.div>
        ))
      )}
    </motion.div>
  );
};
