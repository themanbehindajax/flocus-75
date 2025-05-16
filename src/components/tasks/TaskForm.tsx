import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Task, PriorityLevel, TaskStatus, SubTask } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Plus, X, Zap } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ptBR } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "react-router-dom";

interface TaskFormProps {
  onComplete: () => void;
  editTask?: Task;
}

export const TaskForm = ({ onComplete, editTask }: TaskFormProps) => {
  const { addTask, updateTask, projects, tags } = useAppStore();
  const { toast } = useToast();
  const location = useLocation();
  
  // Extract projectId from URL if we're on a project page
  const projectIdFromUrl = location.pathname.startsWith('/projects/') 
    ? location.pathname.split('/projects/')[1]
    : undefined;
  
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    priority: PriorityLevel;
    status: TaskStatus;
    projectId?: string;
    tags: string[];
    dueDate?: string;
    subtasks: string[]; // This is for input only, will be converted to SubTask[]
    isQuick: boolean;
  }>({
    title: "",
    description: "",
    priority: "media",
    status: "todo",
    tags: [],
    projectId: projectIdFromUrl,
    dueDate: undefined,
    subtasks: [],
    isQuick: false,
  });
  
  const [newSubtask, setNewSubtask] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  
  // Fill in the data if we're editing an existing task
  useEffect(() => {
    if (editTask) {
      setNewTask({
        title: editTask.title,
        description: editTask.description || "",
        priority: editTask.priority,
        status: editTask.status,
        projectId: editTask.projectId,
        tags: editTask.tags || [],
        dueDate: editTask.dueDate,
        subtasks: editTask.subtasks.map(st => st.title),
        isQuick: editTask.isQuick || false,
      });
      
      if (editTask.dueDate) {
        setDate(new Date(editTask.dueDate));
      }
    }
  }, [editTask]);
  
  // If we're on a project page, use that project ID
  useEffect(() => {
    if (projectIdFromUrl && !editTask) {
      setNewTask(prev => ({
        ...prev,
        projectId: projectIdFromUrl
      }));
    }
  }, [projectIdFromUrl, editTask]);
  
  const handleSaveTask = () => {
    if (newTask.title.trim()) {
      // Determine if this is a "quick task" automatically if not explicitly marked
      const isAutomaticallyQuick = 
        !newTask.isQuick && // Not already marked as quick
        newTask.description.length < 50 && // Short description
        newTask.subtasks.length === 0 && // No subtasks
        (newTask.dueDate === undefined || 
          (new Date(newTask.dueDate).getTime() - new Date().getTime()) < 86400000); // Due within 24 hours
      
      // Convert string[] to SubTask[] when adding the task
      const formattedSubtasks: SubTask[] = newTask.subtasks.map((title) => {
        // Se estamos editando, tente preservar os IDs das subtarefas existentes
        if (editTask) {
          const existingSubtask = editTask.subtasks.find(st => st.title === title);
          if (existingSubtask) {
            return existingSubtask;
          }
        }
        return {
          id: crypto.randomUUID(),
          title: title,
          completed: false
        };
      });
      
      const taskData = {
        title: newTask.title.trim(),
        description: newTask.description,
        priority: newTask.priority,
        status: newTask.status,
        tags: newTask.tags,
        projectId: newTask.projectId,
        dueDate: date ? format(date, 'yyyy-MM-dd') : undefined,
        subtasks: formattedSubtasks, // Now passing correctly typed SubTask[]
        isQuick: newTask.isQuick || isAutomaticallyQuick, // Use explicit or auto-detection
      };
      
      if (editTask) {
        // Estamos editando uma tarefa existente
        updateTask({
          ...editTask,
          ...taskData,
          updatedAt: new Date().toISOString()
        });
        
        toast({
          title: "Tarefa atualizada",
          description: `A tarefa "${taskData.title}" foi atualizada com sucesso.`,
        });
      } else {
        // Estamos criando uma nova tarefa
        addTask(taskData);
        
        toast({
          title: "Tarefa criada",
          description: `A tarefa "${taskData.title}" foi criada com sucesso.`,
        });
      }
      
      // Resetar formulário
      setNewTask({
        title: "",
        description: "",
        priority: "media",
        status: "todo",
        tags: [],
        projectId: undefined,
        dueDate: undefined,
        subtasks: [],
        isQuick: false,
      });
      setDate(undefined);
      
      onComplete();
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

  return (
    <div>
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
            value={newTask.projectId || "none"}
            onValueChange={(value) => setNewTask({ ...newTask, projectId: value === "none" ? undefined : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um projeto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sem projeto</SelectItem>
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
          <Select 
            onValueChange={(value) => {
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
          <div className="flex items-center space-x-2">
            <Switch
              id="quick-task"
              checked={newTask.isQuick}
              onCheckedChange={(checked) => setNewTask({ ...newTask, isQuick: checked })}
            />
            <Label htmlFor="quick-task" className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-yellow-500" />
              Tarefa rápida (2 minutos)
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">
            Marque tarefas que podem ser concluídas em 2 minutos ou menos
          </p>
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
        <Button variant="outline" onClick={onComplete}>
          Cancelar
        </Button>
        <Button onClick={handleSaveTask}>
          {editTask ? "Salvar Alterações" : "Criar Tarefa"}
        </Button>
      </DialogFooter>
    </div>
  );
};
