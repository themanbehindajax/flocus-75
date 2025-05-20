
import { Button } from "@/components/ui/button";
import { ListPlus, Plus } from "lucide-react";

interface EmptyTasksPlaceholderProps {
  onCreateTask: () => void;
}

export const EmptyTasksPlaceholder = ({ onCreateTask }: EmptyTasksPlaceholderProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <ListPlus className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-2">No tasks found</h3>
      <p className="text-muted-foreground mb-6">
        Create your first task to start managing your activities.
      </p>
      <Button onClick={onCreateTask}>
        <Plus className="mr-2 h-4 w-4" />
        Create Task
      </Button>
    </div>
  );
};
