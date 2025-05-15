
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, ListPlus, Search, Plus } from "lucide-react";
import { Task, PriorityLevel, TaskStatus } from "@/lib/types";

const Tasks = () => {
  const { tasks, projects, tags, addTask, completeTask, deleteTask } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    priority: PriorityLevel;
    status: TaskStatus;
    projectId?: string;
    tags: string[];
    dueDate?: string;
    subtasks: string[];
  }>({
    title: "",
    description: "",
    priority: "media",
    status: "todo",
    tags: [],
    projectId: undefined,
    dueDate: undefined,
    subtasks: [],
  });
  
  const handleCreateTask = () => {
    if (newTask.title.trim()) {
      addTask({
        title: newTask.title.trim(),
        description: newTask.description,
        priority: newTask.priority,
        status: newTask.status,
        tags: newTask.tags,
        projectId: newTask.projectId,
        dueDate: newTask.dueDate || undefined,
        subtasks: newTask.subtasks,
      });
      
      setNewTask({
        title: "",
        description: "",
        priority: "media",
        status: "todo",
        tags: [],
        projectId: undefined,
        dueDate: undefined,
        subtasks: [],
      });
      
      setIsAddDialogOpen(false);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas tarefas diárias
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tarefas..."
                className="pl-10 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <ListPlus className="mr-2 h-4 w-4" />
                  Nova Tarefa
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Nova Tarefa</DialogTitle>
                  <DialogDescription>
                    Adicione os detalhes da sua nova tarefa.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      placeholder="Insira o título da tarefa"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva a tarefa"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Prioridade</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({ ...newTask, priority: value as PriorityLevel })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baixa">Baixa</SelectItem>
                          <SelectItem value="media">Média</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newTask.status}
                        onValueChange={(value) => setNewTask({ ...newTask, status: value as TaskStatus })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">A fazer</SelectItem>
                          <SelectItem value="doing">Em progresso</SelectItem>
                          <SelectItem value="done">Concluída</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Data de entrega</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate || ""}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project">Projeto</Label>
                    <Select
                      value={newTask.projectId}
                      onValueChange={(value) => setNewTask({ ...newTask, projectId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um projeto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Sem projeto</SelectItem>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateTask}>Criar Tarefa</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Tasks Grid */}
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className={`border-l-4 ${
                task.priority === 'alta' ? 'border-l-red-500' : 
                task.priority === 'media' ? 'border-l-yellow-500' : 
                'border-l-green-500'
              }`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => completeTask(task.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          task.completed ? "bg-primary text-white" : "border border-muted-foreground"
                        }`}
                      >
                        {task.completed && <CheckCircle className="h-4 w-4" />}
                      </button>
                      <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                        {task.title}
                      </span>
                    </div>
                    <div className="text-sm font-normal text-muted-foreground">
                      {task.dueDate && (
                        <span>Vence: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tagId) => {
                      const tag = tags.find(t => t.id === tagId);
                      if (!tag) return null;
                      
                      return (
                        <span 
                          key={tag.id}
                          className="px-2 py-1 rounded-full text-xs"
                          style={{ backgroundColor: tag.color + '20', color: tag.color }}
                        >
                          {tag.name}
                        </span>
                      );
                    })}
                    
                    {task.projectId && (
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {projects.find(p => p.id === task.projectId)?.name || 'Projeto'}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <ListPlus className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Nenhuma tarefa encontrada</h3>
            {searchQuery ? (
              <p className="text-muted-foreground mb-6">
                Nenhuma tarefa corresponde à sua busca. Tente outros termos.
              </p>
            ) : (
              <p className="text-muted-foreground mb-6">
                Crie sua primeira tarefa para começar a gerenciar suas atividades.
              </p>
            )}
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Tarefa
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Tasks;
