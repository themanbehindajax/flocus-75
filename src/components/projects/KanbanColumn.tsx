
import { Task, TaskStatus } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { KanbanTask } from "./KanbanTask";

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  status: TaskStatus;
  onDragStart: (task: Task) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: () => void;
}

export const KanbanColumn = ({ 
  title, 
  tasks, 
  status, 
  onDragStart, 
  onDragOver, 
  onDrop 
}: KanbanColumnProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2 bg-muted/50">
        <CardTitle className="text-lg font-medium">
          {title} 
          <span className="ml-2 text-sm text-muted-foreground">({tasks.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent 
        className="p-2 min-h-[200px]" 
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <div className="space-y-2">
          {tasks.map(task => (
            <KanbanTask 
              key={task.id} 
              task={task} 
              onDragStart={() => onDragStart(task)} 
            />
          ))}
          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-24 border border-dashed rounded-md text-muted-foreground">
              Sem tarefas
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
