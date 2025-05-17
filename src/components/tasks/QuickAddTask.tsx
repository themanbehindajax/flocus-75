import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { toast } from '@/components/ui/use-toast';
import { Project, PriorityLevel, TaskStatus } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuickAddTaskProps {
  projects?: Project[];
}

const QuickAddTask: React.FC<QuickAddTaskProps> = ({ projects }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [priority, setPriority] = useState<PriorityLevel | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const addTask = useAppStore((state) => state.addTask);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setTaskInput('');
    setPriority(null);
    setSelectedProject(null);
  };

  // Certifique-se de adicionar a propriedade completed como requerido
  const handleAddTask = () => {
    if (!taskInput.trim()) return;

    addTask({
      title: taskInput,
      description: "",
      priority: priority as PriorityLevel,
      status: "todo" as TaskStatus,
      tags: [],
      projectId: selectedProject,
      subtasks: [],
      isQuick: true,
      completed: false
    });

    setTaskInput('');
    setPriority(null);
    setSelectedProject(null);
    setIsExpanded(false);

    toast({
      title: "Tarefa adicionada!",
      description: "Sua tarefa foi adicionada com sucesso.",
    });
  };

  return (
    <div className="border rounded-md p-3 bg-card">
      {!isExpanded ? (
        <Button variant="ghost" className="w-full justify-start" onClick={handleExpand}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar tarefa rápida
        </Button>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Título da tarefa"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
            />
            <Button variant="ghost" onClick={handleCollapse}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Select onValueChange={(value) => setPriority(value as PriorityLevel)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>

            {projects && projects.length > 0 && (
              <Select onValueChange={(value) => setSelectedProject(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecionar Projeto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Button onClick={handleAddTask} disabled={!taskInput.trim()}>
            Adicionar Tarefa
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuickAddTask;
