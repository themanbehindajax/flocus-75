
import React from "react";
import { useAppStore } from "@/lib/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

interface TaskSelectionProps {
  selectedTaskId: string;
  selectedProjectId: string;
  onTaskChange: (taskId: string) => void;
  onProjectChange: (projectId: string) => void;
  disabled: boolean;
}

export const TaskSelection: React.FC<TaskSelectionProps> = ({
  selectedTaskId,
  selectedProjectId,
  onTaskChange,
  onProjectChange,
  disabled,
}) => {
  const { tasks, projects } = useAppStore();
  
  return (
    <motion.div 
      className="space-y-4 w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-2 w-full">
        <label className="text-sm font-medium text-white">Project</label>
        <Select
          value={selectedProjectId || "none"}
          onValueChange={onProjectChange}
          disabled={disabled}
        >
          <SelectTrigger className="bg-white/5 border-white/20 text-white w-full">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No specific project</SelectItem>
            {projects.map(project => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2 w-full">
        <label className="text-sm font-medium text-white">Task</label>
        <Select
          value={selectedTaskId || "none"}
          onValueChange={onTaskChange}
          disabled={disabled}
        >
          <SelectTrigger className="bg-white/5 border-white/20 text-white w-full">
            <SelectValue placeholder="Select a task" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No specific task</SelectItem>
            {tasks
              .filter(task => !task.completed && (!selectedProjectId || task.projectId === selectedProjectId))
              .map(task => (
                <SelectItem key={task.id} value={task.id}>
                  {task.title}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};
