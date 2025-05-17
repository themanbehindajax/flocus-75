
import { Task } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Calendar, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface KanbanTaskProps {
  task: Task;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export const KanbanTask = ({ task, onDragStart, onDragEnd }: KanbanTaskProps) => {
  const { tags, toggleTaskCompletion } = useAppStore();
  
  const getTaskTags = task.tags.map(tagId => 
    tags.find(tag => tag.id === tagId)
  ).filter(Boolean);

  const handleToggleTaskCompletion = () => {
    toggleTaskCompletion(task.id);
    
    if (!task.completed) {
      toast.success(`Tarefa "${task.title}" concluída!`, {
        className: "toast-success",
        position: "bottom-right"
      });
    } else {
      toast.info(`Tarefa "${task.title}" reaberta!`, {
        className: "toast-info",
        position: "bottom-right"
      });
    }
  };

  // Define prioridades com cores correspondentes
  const priorityColors = {
    alta: "border-l-4 border-l-red-500",
    media: "border-l-4 border-l-yellow-500",
    baixa: "border-l-4 border-l-green-500"
  };

  // Use standard DOM drag events instead of framer-motion drag
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = "move";
    // This is important for Firefox and other browsers
    e.dataTransfer.setData('text/plain', task.id);
    onDragStart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="touch-none"
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      <Card 
        className={cn(
          "cursor-grab active:cursor-grabbing mb-3 group",
          task.completed ? "bg-muted/20" : "",
          task.priority ? priorityColors[task.priority] : "",
          "hover:shadow-md transition-all duration-200",
          "rounded-xl"
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 mr-4">
              <h3 className={`font-medium text-sm mb-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`text-xs ${task.completed ? "text-muted-foreground/70" : "text-muted-foreground"} line-clamp-2 mb-2`}>
                  {task.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-1.5 mt-2">
                {task.isQuick && (
                  <Badge variant="outline" className="bg-blue-50/80 dark:bg-blue-950/30 border-blue-200/80 dark:border-blue-800/40 text-[10px] px-1.5 py-0 h-4 rounded-full">
                    ⚡ Rápida
                  </Badge>
                )}
                
                {task.dueDate && (
                  <Badge variant="outline" className="bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-800/40 text-[10px] px-1.5 py-0 h-4 rounded-full flex items-center gap-1">
                    <Calendar className="h-2.5 w-2.5" />
                    {new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </Badge>
                )}
                
                {getTaskTags?.map(tag => tag && (
                  <Badge 
                    key={tag.id} 
                    className="text-[10px] px-1.5 py-0 h-4 rounded-full"
                    style={{ 
                      backgroundColor: `${tag.color}20`, 
                      color: tag.color,
                      borderColor: `${tag.color}50`
                    }}
                    variant="outline"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleTaskCompletion}
              className={`h-6 w-6 p-0 rounded-full opacity-90 group-hover:opacity-100 ${
                task.completed 
                ? 'text-success-500 hover:text-success-600 hover:bg-success-50 dark:hover:bg-success-900/20' 
                : 'text-muted-foreground hover:text-primary hover:bg-primary-50 dark:hover:bg-primary-900/20'
              }`}
            >
              {task.completed ? <CheckCircle2 className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
