
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Task } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, Clock, GripVertical, CheckSquare, Square } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useAppStore } from '@/lib/store';
import { TaskDetailDrawer } from '@/components/tasks/TaskDetailDrawer';

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
  const { projects, tags, updateTask } = useAppStore();
  const taskRef = useRef<HTMLDivElement>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isDraggingTask, setIsDraggingTask] = useState(false);
  
  const formattedDate = task.dueDate
    ? formatDistanceToNow(new Date(task.dueDate), {
        addSuffix: true,
        locale: enUS,
      })
    : null;

  const project = task.projectId ? projects.find(p => p.id === task.projectId) : null;
  const taskTags = task.tags
    .map(tagId => tags.find(tag => tag.id === tagId))
    .filter(Boolean);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify({
        taskId: task.id,
        sourceColumnId: columnId
      }));
      event.dataTransfer.effectAllowed = 'move';
      if (taskRef.current) {
        const rect = taskRef.current.getBoundingClientRect();
        event.dataTransfer.setDragImage(taskRef.current, rect.width / 2, rect.height / 2);
      }
    }
    if (taskRef.current) {
      taskRef.current.style.opacity = '0.6';
    }
    taskRef.current?.classList.add('active');
    setIsDraggingTask(true);
    if (onDragStart) onDragStart();
  };

  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    if (taskRef.current) {
      taskRef.current.style.opacity = '1';
      taskRef.current.classList.remove('active');
    }
    setIsDraggingTask(false);
    if (onDragEnd) onDragEnd();
  };
  
  const handleTouchStart = () => {
    taskRef.current?.classList.add('touch-dragging');
  };
  
  const handleTouchEnd = () => {
    taskRef.current?.classList.remove('touch-dragging');
  };

  const handleToggleSubtask = (e: React.MouseEvent, subtaskId: string) => {
    e.stopPropagation(); // Prevent opening the drawer
    
    const updatedSubtasks = task.subtasks.map(subtask => 
      subtask.id === subtaskId 
        ? { ...subtask, completed: !subtask.completed } 
        : subtask
    );
    
    const updatedTask = {
      ...task,
      subtasks: updatedSubtasks,
    };
    
    updateTask(updatedTask);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only open details if we're not dragging
    if (!isDraggingTask) {
      setShowDetails(true);
    }
  };

  const priorityColors = {
    alta: 'bg-red-500',
    media: 'bg-yellow-500',
    baixa: 'bg-green-500',
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  };

  // Calculate subtasks completion
  const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <>
      <div
        ref={taskRef}
        draggable="true"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        className={cn(
          'p-3 mb-2 bg-card rounded-md shadow-sm border cursor-grab active:cursor-grabbing',
          isDragging && 'opacity-50 shadow-md',
          'hover:border-primary/50 hover:shadow-md transition-all duration-150',
          'active:scale-95 active:shadow-inner'
        )}
        role="button"
        aria-roledescription="draggable item"
        aria-grabbed={isDragging ? "true" : "false"}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (onDragStart) onDragStart();
          }
        }}
      >
        <motion.div
          layout
          layoutId={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted/50 rounded-md hover:text-primary transition-colors">
                  <GripVertical size={14} />
                </div>
                <span className="font-medium text-sm">{task.title}</span>
                {/* Quick task badge */}
                {task.isQuick && (
                  <Badge variant="outline" className="ml-1 text-xs px-2 py-0.5">⚡ Quick</Badge>
                )}
              </div>
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

            {/* Subtasks section */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>Subtasks: {completedSubtasks}/{totalSubtasks}</span>
                </div>
                
                {/* Display first 2 subtasks only to save space */}
                <div className="space-y-1">
                  {task.subtasks.slice(0, 2).map(subtask => (
                    <div key={subtask.id} className="flex items-center gap-1.5">
                      <button 
                        className="focus:outline-none"
                        onClick={(e) => handleToggleSubtask(e, subtask.id)}
                      >
                        {subtask.completed ? (
                          <CheckSquare size={12} className="text-primary" />
                        ) : (
                          <Square size={12} className="text-muted-foreground" />
                        )}
                      </button>
                      <span className={`text-xs ${subtask.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                  
                  {/* Show counter if there are more subtasks */}
                  {task.subtasks.length > 2 && (
                    <div className="text-xs text-muted-foreground pl-5">
                      + {task.subtasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-1 mt-1">
              {taskTags.map((tag: any) => (
                <Badge 
                  key={tag.id} 
                  variant="outline" 
                  className="text-xs px-1.5 py-0.5 flex items-center justify-center text-white"
                  style={{ 
                    backgroundColor: tag.color, 
                    borderColor: 'transparent',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  {tag.name}
                </Badge>
              ))}
              
              {project && (
                <Badge 
                  variant="outline" 
                  className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary border-transparent"
                >
                  {project.name}
                </Badge>
              )}
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
            </div>
          </div>
        </motion.div>
      </div>

      {/* Task Detail Drawer */}
      <TaskDetailDrawer 
        task={showDetails ? task : null} 
        open={showDetails} 
        onOpenChange={setShowDetails} 
      />
    </>
  );
};

export default KanbanTask;
