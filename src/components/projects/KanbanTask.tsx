
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Task } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface KanbanTaskProps {
  task: Task;
  index?: number;
  columnId?: string;
  isDragging?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export const KanbanTask = ({ 
  task, 
  index, 
  columnId, 
  isDragging,
  onDragStart,
  onDragEnd 
}: KanbanTaskProps) => {
  const formattedDate = task.dueDate
    ? formatDistanceToNow(new Date(task.dueDate), {
        addSuffix: true,
        locale: ptBR,
      })
    : null;

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('taskId', task.id);
      if (columnId) {
        event.dataTransfer.setData('sourceColumnId', columnId);
      }
      event.dataTransfer.effectAllowed = 'move';
    }
    if (onDragStart) onDragStart();
  };

  const priorityColors = {
    alta: 'bg-red-500',
    media: 'bg-yellow-500',
    baixa: 'bg-green-500',
  };

  return (
    <motion.div
      layout
      layoutId={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        'p-3 mb-2 bg-card rounded-md shadow-sm border cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-50 shadow-md'
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <span className="font-medium text-sm">{task.title}</span>
          {task.priority && (
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                priorityColors[task.priority as keyof typeof priorityColors]
              )}
            />
          )}
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
        )}

        <div className="flex flex-wrap gap-1 mt-1">
          {task.tags?.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            {formattedDate && (
              <>
                <CalendarIcon className="w-3 h-3" />
                <span>{formattedDate}</span>
              </>
            )}
          </div>

          {/* Removendo referência a estimatedTime que não existe no tipo Task */}
        </div>

        {/* Removendo referência a assignee que não existe no tipo Task */}
      </div>
    </motion.div>
  );
};

export default KanbanTask;
