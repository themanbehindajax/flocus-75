
import { useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  FolderPlus,
  Pencil,
  Plus,
  Search,
  Trash2,
  CalendarIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const Projects = () => {
  const { projects, tasks, addProject, updateProject, deleteProject } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    goal: "",
    dueDate: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  const handleCreateProject = () => {
    if (newProject.name.trim()) {
      addProject({
        name: newProject.name.trim(),
        goal: newProject.goal.trim(),
        dueDate: selectedDate ? selectedDate.toISOString() : undefined,
      });
      
      setNewProject({
        name: "",
        goal: "",
        dueDate: "",
      });
      setSelectedDate(undefined);
      
      setIsAddDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy");
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
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Projeto</Label>
                    <Input
                      id="name"
                      placeholder="Insira o nome do projeto"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal">Meta Principal</Label>
                    <Textarea
                      id="goal"
                      placeholder="Qual é o objetivo deste projeto?"
                      value={newProject.goal}
                      onChange={(e) => setNewProject({ ...newProject, goal: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Data de Conclusão</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="dueDate"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateProject}>Criar Projeto</Button>
                </DialogFooter>
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
              
              const completedTasks = projectTasks.filter((task) => task.completed);
              const progress = projectTasks.length > 0
                ? Math.round((completedTasks.length / projectTasks.length) * 100)
                : 0;
              
              return (
                <Card key={project.id} className="project-card animate-fade-in">
                  <CardHeader className="pb-2">
                    <CardTitle>{project.name}</CardTitle>
                    {project.goal && (
                      <CardDescription className="line-clamp-2">
                        {project.goal}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <div>{completedTasks.length}/{projectTasks.length} tarefas</div>
                      {project.dueDate && (
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(project.dueDate)}
                        </div>
                      )}
                    </div>
                    <Progress value={progress} className="h-2" />
                  </CardContent>
                  
                  <CardFooter className="flex justify-between pt-2">
                    <div className="flex space-x-2">
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button asChild>
                      <Link to={`/projects/${project.id}`}>Abrir</Link>
                    </Button>
                  </CardFooter>
                </Card>
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
