import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Project, Tag, TaskStatus, PriorityLevel, Subtask } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CheckCheck, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

interface TaskFormProps {
  task?: any;
  onCancel: () => void;
  onSubmit: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onCancel, onSubmit }) => {
  const { projects, tags, addTask, updateTask } = useAppStore();
  const [taskTitle, setTaskTitle] = useState(task ? task.title : '');
  const [description, setDescription] = useState(task ? task.description : '');
  const [priority, setPriority] = useState<PriorityLevel>(task ? task.priority : 'media');
  const [status, setStatus] = useState<TaskStatus>(task ? task.status : 'todo');
  const [selectedProject, setSelectedProject] = useState<string | undefined>(task ? task.projectId : undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>(task ? task.tags : []);
  const [dueDate, setDueDate] = useState<Date | undefined>(task ? new Date(task.dueDate) : undefined);
  const [subtasks, setSubtasks] = useState<Subtask[]>(task ? task.subtasks : []);
  const [newSubtask, setNewSubtask] = useState('');

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { id: crypto.randomUUID(), title: newSubtask, completed: false }]);
      setNewSubtask('');
    }
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
      )
    );
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== id));
  };

  // Adicione a propriedade completed como requerido
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskTitle.trim()) {
      toast({
        title: "Erro",
        description: "Título da tarefa é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const taskData = {
      title: taskTitle,
      description: description,
      priority: priority as PriorityLevel,
      status: status as TaskStatus,
      tags: selectedTags,
      projectId: selectedProject,
      dueDate: dueDate,
      subtasks: subtasks,
      isQuick: false,
      completed: false
    };

    if (task) {
      updateTask({ ...task, ...taskData, updatedAt: new Date().toISOString() });
      toast({
        title: "Sucesso",
        description: "Tarefa atualizada com sucesso",
      });
    } else {
      addTask(taskData);
      toast({
        title: "Sucesso",
        description: "Tarefa criada com sucesso",
      });
    }

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input
          type="text"
          id="title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">Prioridade</Label>
          <Select value={priority} onValueChange={(value) => setPriority(value as PriorityLevel)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">A fazer</SelectItem>
              <SelectItem value="doing">Em andamento</SelectItem>
              <SelectItem value="done">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="project">Projeto</Label>
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o projeto" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
            <SelectItem value={undefined}>Nenhum</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
              onClick={() =>
                setSelectedTags((prev) =>
                  prev.includes(tag.id) ? prev.filter((id) => id !== tag.id) : [...prev, tag.id]
                )
              }
              className="cursor-pointer"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label>Data de Entrega</Label>
        <DatePicker
          date={dueDate}
          onDateChange={setDueDate}
        />
      </div>

      <div>
        <Label>Subtarefas</Label>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Nova subtarefa"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
          />
          <Button type="button" variant="outline" size="icon" onClick={handleAddSubtask}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ul className="mt-2 space-y-1">
          {subtasks.map((subtask) => (
            <li key={subtask.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={subtask.id}
                  checked={subtask.completed}
                  onCheckedChange={() => handleToggleSubtask(subtask.id)}
                />
                <Label htmlFor={subtask.id} className={cn(subtask.completed ? 'line-through text-muted-foreground' : '')}>
                  {subtask.title}
                </Label>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteSubtask(subtask.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
};
