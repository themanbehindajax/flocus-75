import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAppStore } from "@/lib/store";
import { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TaskForm } from "@/components/tasks/TaskForm";
import { FolderKanban, Trash2 } from "lucide-react";

interface TaskDetailDrawerProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailDrawer({
  task,
  open,
  onOpenChange
}: TaskDetailDrawerProps) {
  const { deleteTask, projects } = useAppStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const projectName = task?.projectId
    ? projects.find(p => p.id === task.projectId)?.name
    : undefined;

  const handleDelete = () => {
    deleteTask(task.id);
    setShowDeleteConfirm(false);
    onOpenChange(false); // Close the drawer after deletion
  };

  return (
    <Sheet open={open && task !== null} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        {task && (
          <>
            <SheetHeader className="space-y-2.5 mb-6">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-foreground text-xl">
                  {task.title}
                </SheetTitle>
              </div>

              {task.projectId && (
                <div className="flex items-center gap-2">
                  <FolderKanban className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {projectName ? projectName : "Carregando..."}
                  </span>
                </div>
              )}
            </SheetHeader>

            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-foreground">Descrição</h3>
                <p className="text-sm text-muted-foreground">
                  {task.description || "Nenhuma descrição fornecida."}
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium text-foreground">Prioridade</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {task.priority || "Não especificada"}
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium text-foreground">Status</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {task.status || "Não especificado"}
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium text-foreground">Data de Vencimento</h3>
                <p className="text-sm text-muted-foreground">
                  {task.dueDate
                    ? format(new Date(task.dueDate), "PPP", { locale: ptBR })
                    : "Não especificada"}
                </p>
              </div>
            </div>

            {task.subtasks && task.subtasks.length > 0 && (
              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium text-foreground">
                  Subtarefas ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
                </h3>
                <div className="space-y-2">
                  {task.subtasks.map(subtask => (
                    <div key={subtask.id} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{subtask.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {subtask.completed ? "Concluída" : "Pendente"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Editar Tarefa</Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Editar Tarefa</DialogTitle>
                    <DialogDescription>
                      Faça as alterações necessárias na sua tarefa.
                    </DialogDescription>
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

              <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação irá excluir a tarefa permanentemente. Tem certeza que
                      deseja prosseguir?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>
                      Cancelar
                    </AlertDialogCancel>
                    <Button variant="destructive" onClick={handleDelete}>
                      Excluir
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
