import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface KanbanTaskProps {
  task: Task;
  index: number;
  columnId: string;
  isDragging?: boolean;
}

export const KanbanTask = ({ task, index, columnId, isDragging }: KanbanTaskProps) => {
  const formattedDate = task.dueDate
    ? formatDistanceToNow(new Date(task.dueDate), {
        addSuffix: true,
        locale: ptBR,
      })
    : null;

  const handleDragStart = (event: React.PointerEvent) => {
    if ('dataTransfer' in event && event.dataTransfer) {
      event.dataTransfer.setData('taskId', task.id);
      event.dataTransfer.setData('sourceColumnId', columnId);
      event.dataTransfer.effectAllowed = 'move';
    }
  };

  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  };

  return (
    <motion.div
      layout
      layoutId={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragStart={handleDragStart}
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

          {task.estimatedTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{task.estimatedTime}h</span>
            </div>
          )}
        </div>

        {task.assignee && (
          <div className="flex justify-end mt-1">
            <Avatar className="w-6 h-6">
              <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
              <AvatarFallback className="text-xs">
                {task.assignee.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default KanbanTask;
