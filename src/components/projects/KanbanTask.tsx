
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Task } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, Clock, GripVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAppStore } from '@/lib/store';

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
  const { projects, tags } = useAppStore();
  
  const formattedDate = task.dueDate
    ? formatDistanceToNow(new Date(task.dueDate), {
        addSuffix: true,
        locale: ptBR,
      })
    : null;

  // Encontra o nome do projeto se esta tarefa pertencer a um projeto
  const project = task.projectId ? projects.find(p => p.id === task.projectId) : null;
  
  // Encontra objetos de tag para os IDs de tag desta tarefa
  const taskTags = task.tags
    .map(tagId => tags.find(tag => tag.id === tagId))
    .filter(Boolean);

  // Manipulador de HTML5 Drag and Drop - melhorado para melhor experiência
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify({
        taskId: task.id,
        sourceColumnId: columnId
      }));
      event.dataTransfer.effectAllowed = 'move';
      
      // Adiciona uma imagem de arrastar personalizada (opcional)
      const dragImage = document.createElement('div');
      dragImage.classList.add('hidden');
      document.body.appendChild(dragImage);
      event.dataTransfer.setDragImage(dragImage, 0, 0);
      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);
    }
    
    // Adiciona uma classe ao elemento que está sendo arrastado
    event.currentTarget.classList.add('opacity-50');
    
    if (onDragStart) onDragStart();
  };

  // Manipulador para quando o arrastar termina
  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    // Remove a classe adicionada ao elemento que estava sendo arrastado
    event.currentTarget.classList.remove('opacity-50');
    
    if (onDragEnd) onDragEnd();
  };

  const priorityColors = {
    alta: 'bg-red-500',
    media: 'bg-yellow-500',
    baixa: 'bg-green-500',
  };

  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        'p-3 mb-2 bg-card rounded-md shadow-sm border cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-50 shadow-md',
        'hover:border-primary/50 hover:shadow-md transition-all duration-150'
      )}
      role="button"
      aria-roledescription="draggable item"
      aria-grabbed="false"
      tabIndex={0}
      onKeyDown={(e) => {
        // Acessibilidade: permite mover tarefas com o teclado (exemplo simples)
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
  );
};

export default KanbanTask;
