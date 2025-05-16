
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
import { 
  CheckCircle, 
  ListPlus, 
  Search, 
  Plus, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Trash2 
} from "lucide-react";
import { Task, PriorityLevel, TaskStatus, SubTask } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ptBR } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";

const Tasks = () => {
  const { tasks, projects, tags, addTask, completeTask, deleteTask, updateTask } = useAppStore();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    priority: PriorityLevel;
    status: TaskStatus;
    projectId?: string;
    tags: string[];
    dueDate?: string;
    subtasks: string[]; // This is for input only, will be converted to SubTask[]
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
  
  const [newSubtask, setNewSubtask] = useState("");
  const [date, setDate] = useState<Date>();
  
  const handleCreateTask = () => {
    if (newTask.title.trim()) {
      // Convert string[] to SubTask[] when adding the task
      const formattedSubtasks: SubTask[] = newTask.subtasks.map((title) => ({
        id: crypto.randomUUID(),
        title: title,
        completed: false
      }));
      
      const taskData = {
        title: newTask.title.trim(),
        description: newTask.description,
        priority: newTask.priority,
        status: newTask.status,
        tags: newTask.tags,
        projectId: newTask.projectId,
        dueDate: date ? format(date, 'yyyy-MM-dd') : undefined,
        subtasks: formattedSubtasks, // Now passing correctly typed SubTask[]
      };
      
      addTask(taskData);
      
      toast({
        title: "Tarefa criada",
        description: `A tarefa "${taskData.title}" foi criada com sucesso.`,
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
      setDate(undefined);
      
      setIsAddDialogOpen(false);
    }
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setNewTask({
        ...newTask,
        subtasks: [...newTask.subtasks, newSubtask.trim()]
      });
      setNewSubtask("");
    }
  };

  const handleRemoveSubtask = (index: number) => {
    const updatedSubtasks = [...newTask.subtasks];
    updatedSubtasks.splice(index, 1);
    setNewTask({
      ...newTask,
      subtasks: updatedSubtasks
    });
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedSubtasks = task.subtasks.map(subtask => 
      subtask.id === subtaskId 
        ? { ...subtask, completed: !subtask.completed } 
        : subtask
    );

    updateTask({
      ...task,
      subtasks: updatedSubtasks
    });
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpandTask = (taskId: string) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
    } else {
      setExpandedTaskId(taskId);
    }
  };

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
              <DialogContent className="max-h-[90vh] overflow-y-auto">
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          {date ? (
                            format(date, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
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
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <Select onValueChange={(value) => {
                      if (!newTask.tags.includes(value)) {
                        setNewTask({ ...newTask, tags: [...newTask.tags, value] });
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Adicionar tag" />
                      </SelectTrigger>
                      <SelectContent>
                        {tags.map((tag) => (
                          <SelectItem key={tag.id} value={tag.id}>
                            {tag.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newTask.tags.map((tagId) => {
                        const tag = tags.find(t => t.id === tagId);
                        if (!tag) return null;
                        
                        return (
                          <span 
                            key={tag.id}
                            className="px-2 py-1 rounded-full text-xs flex items-center gap-1"
                            style={{ backgroundColor: tag.color + '20', color: tag.color }}
                          >
                            {tag.name}
                            <button onClick={() => {
                              setNewTask({
                                ...newTask,
                                tags: newTask.tags.filter(id => id !== tagId)
                              });
                            }}>
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Subtarefas</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Adicionar subtarefa"
                        value={newSubtask}
                        onChange={(e) => setNewSubtask(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddSubtask();
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddSubtask}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {newTask.subtasks.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {newTask.subtasks.map((subtask, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between py-1 px-3 bg-background border rounded-md"
                          >
                            <span>{subtask}</span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveSubtask(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
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
              } ${task.completed ? 'bg-muted/20' : ''}`}>
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
                      {task.subtasks.length > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-2 h-6 w-6 p-0"
                          onClick={() => toggleExpandTask(task.id)}
                        >
                          {expandedTaskId === task.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      )}
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
                  
                  {/* Subtasks */}
                  {expandedTaskId === task.id && task.subtasks.length > 0 && (
                    <div className="mt-3 space-y-2 pl-8 border-l-2 border-muted mb-4">
                      {task.subtasks.map((subtask) => (
                        <div 
                          key={subtask.id} 
                          className="flex items-center gap-2"
                        >
                          <button
                            onClick={() => handleToggleSubtask(task.id, subtask.id)}
                            className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                              subtask.completed ? "bg-primary text-white" : "border border-muted-foreground"
                            }`}
                          >
                            {subtask.completed && <CheckCircle className="h-3 w-3" />}
                          </button>
                          <span className={subtask.completed ? "line-through text-muted-foreground text-sm" : "text-sm"}>
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
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
                  
                  <div className="flex justify-end mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
