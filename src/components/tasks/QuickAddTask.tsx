
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bolt, Zap } from "lucide-react";

interface QuickAddTaskProps {
  projectId?: string;
  onTaskAdded?: () => void;
}

export const QuickAddTask = ({ projectId, onTaskAdded }: QuickAddTaskProps) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [isQuick, setIsQuick] = useState(false);
  const { addTask } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      console.log("Adding quick task with projectId:", projectId);
      
      const taskId = addTask({
        title: taskTitle,
        description: "",
        dueDate: "",
        priority: "media",
        status: "todo",
        projectId,
        tags: [],
        subtasks: [],
        isQuick: isQuick,
      });
      
      console.log("Quick task created with ID:", taskId);
      setTaskTitle("");
      setIsQuick(false);
      
      if (onTaskAdded) {
        onTaskAdded();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
      <Input
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder="Add new task..."
        className="flex-grow text-foreground placeholder:text-muted-foreground w-full"
      />
      <Button
        type="button"
        size="sm"
        variant={isQuick ? "default" : "outline"}
        onClick={() => setIsQuick((v) => !v)}
        className={`text-yellow-500 ${isQuick ? "bg-yellow-100 dark:bg-yellow-950/40" : ""}`}
        title="Quick task (under 2 minutes)"
      >
        <Zap className="w-4 h-4" />
      </Button>
      <Button 
        type="submit" 
        size="sm" 
        disabled={!taskTitle.trim()}
        className="whitespace-nowrap"
      >
        <Bolt className="w-4 h-4 mr-1" />
        Add
      </Button>
    </form>
  );
};
