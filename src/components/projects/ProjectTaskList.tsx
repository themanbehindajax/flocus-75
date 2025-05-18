
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListPlus, List, Kanban, CheckCircle, CheckCircle2 } from "lucide-react";
import { QuickAddTask } from "@/components/tasks/QuickAddTask";
import { KanbanBoard } from "@/components/projects/KanbanBoard";
import { Task } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProjectTaskListProps {
  projectId: string;
  projectTasks: Task[];
  view: "list" | "kanban";
  setView: (view: "list" | "kanban") => void;
  setIsAddDialogOpen: (open: boolean) => void;
  isAddDialogOpen: boolean;
  children: React.ReactNode; // for renderização do dialog/modal
  onTaskAdded?: () => void; // Novo callback para quando uma tarefa é adicionada
}

export const ProjectTaskList = ({
  projectId, projectTasks, view, setView, setIsAddDialogOpen, isAddDialogOpen, children, onTaskAdded
}: ProjectTaskListProps) => {
  const { toast } = useToast();
  const { toggleTaskCompletion } = useAppStore();
  
  const handleToggleTaskCompletion = (task: Task) => {
    toggleTaskCompletion(task.id);
    if (!task.completed) {
      toast({
        title: "Tarefa concluída",
        description: `A tarefa "${task.title}" foi marcada como concluída.`,
        className: "toast-success"
      });
    } else {
      toast({
        title: "Tarefa reaberta",
        description: `A tarefa "${task.title}" foi desmarcada como concluída.`,
        className: "toast-info"
      });
    }
  };

  const priorityStyles = {
    alta: "border-l-red-500",
    media: "border-l-amber-500",
    baixa: "border-l-green-500"
  };

  return (
    <div className="md:col-span-3 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Tarefas</h3>
        <div className="flex gap-2">
          <div className="flex items-center border rounded-md overflow-hidden">
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("kanban")}
              className="rounded-none"
            >
              <Kanban className="h-4 w-4" />
            </Button>
          </div>
          {children}
        </div>
      </div>

      <Card className="mb-4 shadow-sm">
        <CardContent className="p-4">
          <QuickAddTask
            projectId={projectId}
            onTaskAdded={() => {
              toast({
                title: "Tarefa adicionada",
                description: "Tarefa adicionada ao projeto com sucesso.",
                className: "toast-success"
              });
              // Notificar o componente pai que uma tarefa foi adicionada
              if (onTaskAdded) {
                onTaskAdded();
              }
            }}
          />
        </CardContent>
      </Card>

      {projectTasks.length === 0 ? (
        <div className="text-center py-10 px-4 border rounded-lg bg-muted/20 transition-all animate-fade-in">
          <p className="text-muted-foreground mb-4">Nenhuma tarefa adicionada a este projeto</p>
          <Button onClick={() => setIsAddDialogOpen(true)} className="btn-transition">
            <ListPlus className="mr-2 h-4 w-4" />
            Adicionar Tarefa
          </Button>
        </div>
      ) : (
        <>
          {view === "list" && (
            <div className="space-y-3 animate-fade-in">
              {projectTasks.map((task) => (
                <Card 
                  key={task.id} 
                  className={cn(
                    "border-l-4 transition-all duration-200 hover:shadow-md",
                    priorityStyles[task.priority] || "border-l-green-500",
                    task.completed ? 'bg-muted/30' : ''
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-6 w-6 p-0 rounded-full transition-all duration-200 ${
                            task.completed 
                              ? 'text-primary hover:text-primary/80 hover:bg-primary/10' 
                              : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                          }`}
                          onClick={() => handleToggleTaskCompletion(task)}
                        >
                          {task.completed ? 
                            <CheckCircle2 className="h-4 w-4" /> : 
                            <CheckCircle className="h-4 w-4" />
                          }
                        </Button>
                        <span className={task.completed ? "line-through text-muted-foreground" : "font-medium"}>
                          {task.title}
                        </span>
                        {/* Badge de tarefa rápida */}
                        {task.isQuick && (
                          <Badge variant="outline" className="ml-2 text-xs px-2 py-0.5">⚡ Rápida</Badge>
                        )}
                      </div>
                      {task.dueDate && (
                        <span className="text-xs text-muted-foreground px-2 py-1 bg-muted/30 rounded-full">
                          {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {view === "kanban" && (
            <KanbanBoard tasks={projectTasks} projectId={projectId} />
          )}
        </>
      )}
    </div>
  );
};
