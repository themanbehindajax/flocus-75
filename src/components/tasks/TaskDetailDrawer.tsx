
import { useState } from "react";
import { Task } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle,
  DrawerDescription,
  DrawerFooter
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckSquare, 
  Square, 
  Edit, 
  Trash2,
  CheckCircle2,
  Folder
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskForm } from "./TaskForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface TaskDetailDrawerProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TaskDetailDrawer = ({ task, open, onOpenChange }: TaskDetailDrawerProps) => {
  const { projects, tags, updateTask, deleteTask, toggleTaskCompletion } = useAppStore();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (!task) return null;

  const project = task.projectId ? projects.find(p => p.id === task.projectId) : null;
  const taskTags = task.tags
    .map(tagId => tags.find(tag => tag.id === tagId))
    .filter(Boolean);

  const handleTaskComplete = () => {
    toggleTaskCompletion(task.id);
    toast({
      title: task.completed ? "Tarefa reaberta" : "Tarefa concluída",
      description: `A tarefa "${task.title}" foi ${task.completed ? "reaberta" : "concluída"} com sucesso.`
    });
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedTask = {
      ...task,
      subtasks: task.subtasks.map(subtask => 
        subtask.id === subtaskId 
          ? { ...subtask, completed: !subtask.completed } 
          : subtask
      )
    };
    
    updateTask(updatedTask);
    
    const subtask = task.subtasks.find(s => s.id === subtaskId);
    if (subtask) {
      toast({
        title: !subtask.completed ? "Subtarefa concluída" : "Subtarefa reaberta",
        description: `A subtarefa "${subtask.title}" foi ${!subtask.completed ? "concluída" : "reaberta"}.`
      });
    }
  };

  const handleDelete = () => {
    if (task) {
      deleteTask(task.id);
      onOpenChange(false);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Tarefa excluída",
        description: "A tarefa foi excluída com sucesso."
      });
    }
  };

  // Format date for display
  const formattedDate = task.dueDate ? format(
    new Date(task.dueDate),
    "dd 'de' MMMM 'de' yyyy", 
    { locale: ptBR }
  ) : null;

  const priorityLabels = {
    alta: "Alta prioridade",
    media: "Média prioridade",
    baixa: "Baixa prioridade"
  };

  const priorityColors = {
    alta: "bg-red-500",
    media: "bg-yellow-500",
    baixa: "bg-green-500"
  };

  // Calculate subtasks completion
  const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <div className="mx-auto w-full max-w-lg">
            <DrawerHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTaskComplete}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      task.completed ? "bg-primary text-white" : "border border-muted-foreground"
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="h-4 w-4" />}
                  </button>
                  <DrawerTitle className={`text-xl ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </DrawerTitle>
                </div>
                
                {task.priority && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{priorityLabels[task.priority as keyof typeof priorityLabels]}</span>
                    <div className={`w-3 h-3 rounded-full ${priorityColors[task.priority as keyof typeof priorityColors]}`}></div>
                  </div>
                )}
              </div>
              
              {task.description && (
                <DrawerDescription className="mt-2 text-sm text-foreground">
                  {task.description}
                </DrawerDescription>
              )}
            </DrawerHeader>

            <div className="p-4 space-y-6">
              {/* Project info */}
              {project && (
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Projeto: <span className="font-medium">{project.name}</span></span>
                </div>
              )}

              {/* Tags */}
              {taskTags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {taskTags.map((tag: any) => (
                      <Badge 
                        key={tag.id} 
                        variant="secondary" 
                        className="text-xs text-white"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Due date */}
              {formattedDate && (
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Data de vencimento: <span className="font-medium">{formattedDate}</span></span>
                </div>
              )}

              {/* Subtasks */}
              {task.subtasks.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Subtarefas ({completedSubtasks}/{totalSubtasks})
                  </h4>
                  <div className="space-y-2 pl-1">
                    {task.subtasks.map(subtask => (
                      <div key={subtask.id} className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-6 w-6 p-0 rounded-sm transition-all ${
                            subtask.completed 
                              ? 'text-primary hover:text-primary/80' 
                              : 'text-muted-foreground hover:text-primary'
                          }`}
                          onClick={() => handleToggleSubtask(subtask.id)}
                        >
                          {subtask.completed ? 
                            <CheckSquare className="h-4 w-4" /> : 
                            <Square className="h-4 w-4" />
                          }
                        </Button>
                        <span className={`text-sm ${subtask.completed ? "line-through text-muted-foreground" : ""}`}>
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* When it was created */}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Criada em {format(new Date(task.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
            </div>

            <DrawerFooter className="flex flex-row justify-end space-x-2">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Editar Tarefa</DialogTitle>
                  </DialogHeader>
                  <TaskForm 
                    onComplete={() => {
                      setIsEditDialogOpen(false);
                      onOpenChange(false);
                    }}
                    editTask={task}
                  />
                </DialogContent>
              </Dialog>

              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Tarefa</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
