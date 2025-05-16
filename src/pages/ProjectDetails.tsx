import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, ListPlus, Kanban, List } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "@/components/projects/KanbanBoard";
import { QuickAddTask } from "@/components/tasks/QuickAddTask";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { TaskForm } from "@/components/tasks/TaskForm";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projects, tasks, addTask } = useAppStore(); // Added addTask to the destructuring
  const [view, setView] = useState<"list" | "kanban">("list");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const project = projects.find(p => p.id === projectId);
  
  if (!project) {
    return (
      <AppLayout>
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/projects")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
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
  
  const projectTasks = tasks.filter(task => project.tasks.includes(task.id));
  const completedTasks = projectTasks.filter(task => task.completed);
  const progress = projectTasks.length > 0 
    ? Math.round((completedTasks.length / projectTasks.length) * 100) 
    : 0;
  
  // Create a new function to handle task creation specific to this project
  const handleTaskCreated = (taskId) => {
    toast({
      title: "Tarefa adicionada",
      description: "Tarefa adicionada ao projeto com sucesso."
    });
  };
  
  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/projects")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            {project.goal && (
              <p className="text-muted-foreground mt-1">{project.goal}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <h3 className="text-lg font-medium">Progresso</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{completedTasks.length}/{projectTasks.length} tarefas</span>
                  <span>{progress}%</span>
                </div>
              </div>
              
              {project.dueDate && (
                <div className="flex items-center mt-4 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Vence em: {new Date(project.dueDate).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
              
              <div className="mt-4">
                <Button className="w-full">
                  Iniciar Pomodoro
                </Button>
              </div>
            </CardContent>
          </Card>
          
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
                      onComplete={() => {
                        setIsAddDialogOpen(false);
                      }} 
                      editTask={{
                        id: '',
                        title: '',
                        description: '',
                        status: 'todo',
                        priority: 'media',
                        tags: [],
                        projectId: project.id, // Ensure project ID is set correctly
                        subtasks: [],
                        completed: false,
                        createdAt: '',
                        updatedAt: ''
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            {/* Quick Add Task for Project */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <QuickAddTask 
                  projectId={project.id}
                  onTaskAdded={() => {
                    toast({
                      title: "Tarefa adicionada",
                      description: "Tarefa adicionada ao projeto com sucesso."
                    });
                  }}
                />
              </CardContent>
            </Card>
            
            {/* Project Tasks */}
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
                        task.priority === 'alta' ? 'border-l-red-500' : 
                        task.priority === 'media' ? 'border-l-yellow-500' : 
                        'border-l-green-500'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full ${
                                task.completed ? "bg-primary" : "border border-primary"
                              }`} />
                              <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                                {task.title}
                              </span>
                            </div>
                            {task.dueDate && (
                              <span className="text-sm text-muted-foreground">
                                {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                
                {view === "kanban" && (
                  <KanbanBoard tasks={projectTasks} projectId={project.id} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectDetails;
