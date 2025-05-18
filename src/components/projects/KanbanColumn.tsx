
import { Task, TaskStatus } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { KanbanTask } from "./KanbanTask";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  status: TaskStatus;
  onDragStart: (task: Task) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  isDraggingOver: boolean;
}

export const KanbanColumn = ({ 
  title, 
  tasks, 
  status, 
  onDragStart, 
  onDragOver, 
  onDrop,
  onDragEnd,
  isDraggingOver
}: KanbanColumnProps) => {
  return (
    <Card className="kanban-column dark:bg-blue-950/40">
      <CardHeader className="pb-2 bg-muted/50 backdrop-blur-sm dark:bg-blue-950/40 rounded-t-2xl">
        <CardTitle className="text-lg font-medium flex justify-between">
          <span>{title} <span className="ml-2 text-sm text-muted-foreground">({tasks.length})</span></span>
        </CardTitle>
      </CardHeader>
      <CardContent 
        className={cn(
          "p-2 min-h-[300px] transition-colors duration-200",
          isDraggingOver 
            ? "bg-muted/40 dark:bg-blue-950/50 border-2 border-dashed border-primary/40 rounded-md backdrop-blur-md" 
            : "backdrop-blur-sm dark:bg-blue-950/20"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          onDragOver(e);
        }}
        onDrop={onDrop}
      >
        <div className="space-y-2">
          {tasks.map(task => (
            <KanbanTask 
              key={task.id} 
              task={task} 
              columnId={status}
              onDragStart={() => onDragStart(task)} 
              onDragEnd={onDragEnd}
            />
          ))}
          {tasks.length === 0 && (
            <div className={cn(
              "flex items-center justify-center h-24 border border-dashed rounded-md text-muted-foreground transition-all duration-200",
              isDraggingOver 
                ? "border-primary/80 bg-primary/10 dark:bg-primary/20 backdrop-blur-md" 
                : "dark:border-white/10 border-black/10 glass-effect"
            )}>
              {isDraggingOver ? 
                <span className="font-medium text-primary">Solte aqui</span> : 
                <span>Sem tarefas</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
