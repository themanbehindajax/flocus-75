
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderPlus,
  Plus,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { toast } from "sonner";

const Projects = () => {
  const { projects, tasks, addProject, updateProject, deleteProject } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<typeof projects[0] | null>(null);
  
  const handleCreateProject = (projectData: Parameters<typeof addProject>[0]) => {
    const newProject = addProject(projectData);
    toast.success(`Projeto "${newProject.name}" criado com sucesso`);
    setIsAddDialogOpen(false);
  };
  
  const handleEditProject = (project: typeof projects[0]) => {
    setCurrentProject(project);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateProject = (projectData: Parameters<typeof updateProject>[0]) => {
    if (currentProject) {
      updateProject({
        ...currentProject,
        ...projectData
      });
      toast.success(`Projeto "${projectData.name}" atualizado com sucesso`);
      setIsEditDialogOpen(false);
      setCurrentProject(null);
    }
  };
  
  const handleDeleteProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      // Confirm deletion
      if (window.confirm(`Tem certeza que deseja excluir o projeto "${project.name}"?`)) {
        deleteProject(projectId);
        toast.success(`Projeto "${project.name}" excluído com sucesso`);
      }
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
            <p className="text-muted-foreground mt-1">
              Crie e gerencie seus projetos
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar projetos..."
                className="pl-10 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Novo Projeto
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Projeto</DialogTitle>
                  <DialogDescription>
                    Adicione detalhes para o seu novo projeto.
                  </DialogDescription>
                </DialogHeader>
                <ProjectForm 
                  onSubmit={handleCreateProject}
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
            
            {/* Edit Project Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Projeto</DialogTitle>
                  <DialogDescription>
                    Atualize os detalhes do projeto.
                  </DialogDescription>
                </DialogHeader>
                {currentProject && (
                  <ProjectForm 
                    initialProject={currentProject}
                    onSubmit={handleUpdateProject}
                    onCancel={() => setIsEditDialogOpen(false)}
                    submitButtonText="Atualizar Projeto"
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const projectTasks = tasks.filter((task) =>
                project.tasks.includes(task.id)
              );
              
              return (
                <ProjectCard 
                  key={project.id}
                  project={project}
                  projectTasks={projectTasks}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <FolderPlus className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Nenhum projeto encontrado</h3>
            {searchQuery ? (
              <p className="text-muted-foreground mb-6">
                Nenhum projeto corresponde à sua busca. Tente outros termos.
              </p>
            ) : (
              <p className="text-muted-foreground mb-6">
                Crie seu primeiro projeto para começar a gerenciar suas tarefas.
              </p>
            )}
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Projeto
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Projects;
