
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
import { motion } from "framer-motion";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projects, tasks, addTask } = useAppStore();
  const [view, setView] = useState<"list" | "kanban">("list");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [projectTasks, setProjectTasks] = useState<any[]>([]);

  const project = projects.find(p => p.id === projectId);

  // Atualiza as tarefas do projeto sempre que as tarefas ou projetos mudarem
  useEffect(() => {
    if (project) {
      const currentTasks = tasks.filter(task => task.projectId === projectId);
      setProjectTasks(currentTasks);
    }
  }, [project, tasks, projectId]);

  if (!project) {
    return (
      <AppLayout>
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-4"
          >
            <Button variant="outline" size="sm" onClick={() => navigate("/projects")}>
              <span className="mr-2">
                <svg width={16} height={16}><path d="M10 6L6 10M6 6l4 4" /></svg>
              </span>
              Voltar
            </Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <h3 className="text-xl font-medium mb-2">Projeto não encontrado</h3>
            <p className="text-muted-foreground mb-6">
              O projeto que você está procurando não existe ou foi removido.
            </p>
            <Button onClick={() => navigate("/projects")}>Ver todos os projetos</Button>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  const handleTaskCreated = () => {
    // Fecha o diálogo de adição de tarefa
    setIsAddDialogOpen(false);
    
    // Força a atualização das tarefas do projeto
    const currentTasks = useAppStore.getState().tasks.filter(task => task.projectId === projectId);
    setProjectTasks(currentTasks);
    
    // Notifica o usuário sobre a criação da tarefa
    toast({
      title: "Tarefa criada",
      description: "Tarefa adicionada ao projeto com sucesso."
    });
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ProjectHeader project={project} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <ProjectProgressCard project={project} projectTasks={projectTasks} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="md:col-span-3"
          >
            <ProjectTaskList
              projectId={project.id}
              projectTasks={projectTasks}
              view={view}
              setView={setView}
              setIsAddDialogOpen={setIsAddDialogOpen}
              isAddDialogOpen={isAddDialogOpen}
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
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectDetails;
