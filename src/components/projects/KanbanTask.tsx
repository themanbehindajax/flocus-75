
import React, { useRef } from 'react';
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
  const taskRef = useRef<HTMLDivElement>(null);
  
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

  // Melhorado: Manipulador de HTML5 Drag and Drop para estilo "clique, segure e solte"
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    // Configura imediatamente os dados de transferência
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify({
        taskId: task.id,
        sourceColumnId: columnId
      }));
      
      // Melhora o feedback visual durante o arrasto
      event.dataTransfer.effectAllowed = 'move';
      
      // Cria uma imagem de arrastar personalizada (opcional, melhora a UX)
      if (taskRef.current) {
        const rect = taskRef.current.getBoundingClientRect();
        event.dataTransfer.setDragImage(taskRef.current, rect.width / 2, rect.height / 2);
      }
    }
    
    // Adiciona uma classe para feedback visual durante o arrastar
    if (taskRef.current) {
      taskRef.current.style.opacity = '0.6';
    }
    
    // Simula um toque ou pressionar em dispositivos móveis
    taskRef.current?.classList.add('active');
    
    if (onDragStart) onDragStart();
  };

  // Manipulador para quando o arrastar termina
  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    // Remove efeitos visuais de arrastar
    if (taskRef.current) {
      taskRef.current.style.opacity = '1';
      taskRef.current.classList.remove('active');
    }
    
    if (onDragEnd) onDragEnd();
  };
  
  // Ajuda a fixar o item ao toque em dispositivos móveis
  const handleTouchStart = () => {
    taskRef.current?.classList.add('touch-dragging');
  };
  
  const handleTouchEnd = () => {
    taskRef.current?.classList.remove('touch-dragging');
  };

  const priorityColors = {
    alta: 'bg-red-500',
    media: 'bg-yellow-500',
    baixa: 'bg-green-500',
  };

  return (
    <div
      ref={taskRef}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
