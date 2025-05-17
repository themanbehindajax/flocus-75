
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListPlus, List, Kanban, CheckCircle, CheckCircle2 } from "lucide-react";
import { QuickAddTask } from "@/components/tasks/QuickAddTask";
import { KanbanBoard } from "@/components/projects/KanbanBoard";
import { Task } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAppStore } from "@/lib/store";

interface ProjectTaskListProps {
  projectId: string;
  projectTasks: Task[];
  view: "list" | "kanban";
  setView: (view: "list" | "kanban") => void;
  setIsAddDialogOpen: (open: boolean) => void;
  isAddDialogOpen: boolean;
  children: React.ReactNode; // for renderização do dialog/modal
}

export const ProjectTaskList = ({
  projectId, projectTasks, view, setView, setIsAddDialogOpen, isAddDialogOpen, children,
}: ProjectTaskListProps) => {
  const { toast } = useToast();
  const { toggleTaskCompletion, updateTask } = useAppStore();
  
  const handleToggleTaskCompletion = (task: Task) => {
    toggleTaskCompletion(task.id);
    
    // Show toast notification based on new completion state
    if (!task.completed) {
      toast({
        title: "Tarefa concluída",
        description: `A tarefa "${task.title}" foi marcada como concluída.`,
      });
    } else {
      toast({
        title: "Tarefa reaberta",
        description: `A tarefa "${task.title}" foi desmarcada como concluída.`,
      });
    }
  };

  return (
    <div className="md:col-span-3">
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

      <Card className="mb-4">
        <CardContent className="p-4">
          <QuickAddTask
            projectId={projectId}
            onTaskAdded={() => {
              toast({
                title: "Tarefa adicionada",
                description: "Tarefa adicionada ao projeto com sucesso.",
              });
            }}
          />
        </CardContent>
      </Card>

      {projectTasks.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground mb-4">Nenhuma tarefa adicionada a este projeto</p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <ListPlus className="mr-2 h-4 w-4" />
            Adicionar Tarefa
          </Button>
        </div>
      ) : (
        <>
          {view === "list" && (
            <div className="space-y-3">
              {projectTasks.map((task) => (
                <Card key={task.id} className={`border-l-4 ${
                  task.priority === "alta" ? "border-l-red-500" :
                  task.priority === "media" ? "border-l-yellow-500" :
                  "border-l-green-500"
                } ${task.completed ? 'bg-muted/30' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-6 w-6 p-0 ${task.completed ? 'text-primary' : 'text-muted-foreground'}`}
                          onClick={() => handleToggleTaskCompletion(task)}
                        >
                          {task.completed ? 
                            <CheckCircle2 className="h-4 w-4" /> : 
                            <CheckCircle className="h-4 w-4" />
                          }
                        </Button>
                        <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                          {task.title}
                        </span>
                      </div>
                      {task.dueDate && (
                        <span className="text-sm text-muted-foreground">
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
