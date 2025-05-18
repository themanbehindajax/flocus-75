
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { TaskForm } from "@/components/tasks/TaskForm";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { ProjectProgressCard } from "@/components/projects/ProjectProgressCard";
import { ProjectTaskList } from "@/components/projects/ProjectTaskList";
import { Button } from "@/components/ui/button";
import { ListPlus } from "lucide-react";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projects, tasks } = useAppStore();

  const [view, setView] = useState<"list" | "kanban">("list");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [projectTasks, setProjectTasks] = useState<any[]>([]);

  const project = projects.find(p => p.id === projectId);

  // Função para atualizar as tarefas do projeto
  const updateProjectTasks = () => {
    if (projectId) {
      const currentTasks = tasks.filter(task => task.projectId === projectId);
      console.log("Atualizando tarefas do projeto:", projectId, currentTasks);
      setProjectTasks(currentTasks);
    }
  };

  // Carrega as tarefas do projeto quando a página é carregada ou quando tasks muda
  useEffect(() => {
    updateProjectTasks();
  }, [tasks, projectId]);

  if (!project) {
    return (
      <AppLayout>
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/projects")}>
              <span className="mr-2">
                <svg width={16} height={16}><path d="M10 6L6 10M6 6l4 4" /></svg>
              </span>
              Voltar
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-xl font-medium mb-2">Projeto não encontrado</h3>
            <p className="text-muted-foreground mb-6">
              O projeto que você está procurando não existe ou foi removido.
            </p>
            <Button onClick={() => navigate("/projects")}>Ver todos os projetos</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleTaskCreated = () => {
    setIsAddDialogOpen(false);
    
    // Força atualização das tarefas do projeto após a criação
    updateProjectTasks();
    
    toast({
      title: "Tarefa criada",
      description: "Tarefa adicionada ao projeto com sucesso.",
    });
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <ProjectHeader project={project} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ProjectProgressCard project={project} projectTasks={projectTasks} />
          <ProjectTaskList
            projectId={project.id}
            projectTasks={projectTasks}
            view={view}
            setView={setView}
            setIsAddDialogOpen={setIsAddDialogOpen}
            isAddDialogOpen={isAddDialogOpen}
            onTaskAdded={updateProjectTasks} // Nova prop para atualizar tarefas quando adicionadas via QuickAdd
          >
            {/* Children: botão de nova tarefa com modal */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <ListPlus className="mr-2 h-4 w-4" />
                  Nova Tarefa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Nova Tarefa</DialogTitle>
                  <DialogDescription>
                    Adicione os detalhes da sua nova tarefa.
                  </DialogDescription>
                </DialogHeader>
                <TaskForm
                  onComplete={handleTaskCreated}
                  editTask={{
                    id: '',
                    title: '',
                    priority: 'media',
                    status: 'todo',
                    tags: [],
                    projectId: project.id,
                    completed: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    subtasks: []
                  }}
                />
              </DialogContent>
            </Dialog>
          </ProjectTaskList>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectDetails;
