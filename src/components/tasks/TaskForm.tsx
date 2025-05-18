
import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Task, PriorityLevel, TaskStatus, SubTask } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import { TaskFormTitle } from "./TaskFormTitle";
import { TaskFormDescription } from "./TaskFormDescription";
import { TaskFormPriority } from "./TaskFormPriority";
import { TaskFormStatus } from "./TaskFormStatus";
import { TaskFormDueDate } from "./TaskFormDueDate";
import { TaskFormProject } from "./TaskFormProject";
import { TaskFormTags } from "./TaskFormTags";
import { TaskFormQuick } from "./TaskFormQuick";
import { TaskFormSubtasks } from "./TaskFormSubtasks";

interface TaskFormProps {
  onComplete: () => void;
  editTask?: Task;
  defaultProjectId?: string;
}

export const TaskForm = ({ onComplete, editTask, defaultProjectId }: TaskFormProps) => {
  const { addTask, updateTask, projects, tags } = useAppStore();
  const { toast } = useToast();
  const location = useLocation();

  // Determinar projectId com base na ordem de prioridade:
  // 1. defaultProjectId (passado como prop)
  // 2. editTask?.projectId (se estiver editando uma tarefa)
  // 3. URL do projeto atual (se estiver em uma página de projeto)
  const projectIdFromUrl = location.pathname.startsWith('/projects/') 
    ? location.pathname.split('/projects/')[1]
    : undefined;
    
  const initialProjectId = defaultProjectId || (editTask?.projectId) || projectIdFromUrl;

  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    priority: PriorityLevel;
    status: TaskStatus;
    projectId?: string;
    tags: string[];
    dueDate?: string;
    subtasks: string[];
    isQuick: boolean;
  }>({
    title: "",
    description: "",
    priority: "media",
    status: "todo",
    tags: [],
    projectId: initialProjectId,
    dueDate: undefined,
    subtasks: [],
    isQuick: false,
  });

  const [newSubtask, setNewSubtask] = useState("");
  const [date, setDate] = useState<Date | undefined>();

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
      if (editTask.dueDate) setDate(new Date(editTask.dueDate));
    }
  }, [editTask]);

  // Garante que o projectId é atualizado se a prop defaultProjectId mudar
  useEffect(() => {
    if (defaultProjectId) {
      setNewTask(prev => ({
        ...prev,
        projectId: defaultProjectId
      }));
    }
  }, [defaultProjectId]);

  const handleSaveTask = () => {
    if (newTask.title.trim()) {
      let isQuickTask = newTask.isQuick;
      
      const formattedSubtasks: SubTask[] = newTask.subtasks.map((title) => {
        if (editTask) {
          const existingSubtask = editTask.subtasks.find(st => st.title === title);
          if (existingSubtask) return existingSubtask;
        }
        return {
          id: crypto.randomUUID(),
          title,
          completed: false
        };
      });

      // Usamos o projectId do estado, que já foi definido corretamente
      const actualProjectId = newTask.projectId;
      
      console.log("Salvando tarefa com dados. ProjectId=", actualProjectId);

      const taskData = {
        title: newTask.title.trim(),
        description: newTask.description,
        priority: newTask.priority,
        status: newTask.status,
        tags: newTask.tags,
        projectId: actualProjectId,
        dueDate: date ? date.toISOString() : undefined,
        subtasks: formattedSubtasks,
        isQuick: isQuickTask,
        completed: false,
      };

      console.log("Salvando tarefa com dados completos:", taskData);

      try {
        if (editTask) {
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
          // Adiciona a tarefa diretamente usando o método do store
          const taskId = addTask(taskData);
          console.log("Tarefa criada com ID:", taskId);
          
          toast({
            title: "Tarefa criada",
            description: `A tarefa "${taskData.title}" foi criada com sucesso.`,
          });
        }
        
        // Resetamos o formulário
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
        
        // Chamamos o callback após a operação ser concluída
        if (onComplete) {
          onComplete();
        }
      } catch (error) {
        console.error("Erro ao salvar tarefa:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao salvar a tarefa.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Título obrigatório",
        description: "Por favor, adicione um título para a tarefa.",
        variant: "destructive"
      });
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
        <TaskFormTitle value={newTask.title} onChange={(title) => setNewTask({ ...newTask, title })} />
        <TaskFormDescription value={newTask.description} onChange={(description) => setNewTask({ ...newTask, description })} />
        <div className="grid grid-cols-2 gap-4">
          <TaskFormPriority value={newTask.priority} onChange={(priority) => setNewTask({ ...newTask, priority })} />
          <TaskFormStatus value={newTask.status} onChange={(status) => setNewTask({ ...newTask, status })} />
        </div>
        <TaskFormDueDate date={date} setDate={setDate} />
        <TaskFormProject
          projectId={newTask.projectId}
          setProjectId={(projectId) => setNewTask({ ...newTask, projectId })}
          projects={projects}
          disabled={!!defaultProjectId} // Desabilitar se um projectId foi fornecido como prop
        />
        <TaskFormTags
          tags={tags}
          selected={newTask.tags}
          setSelected={(t) => setNewTask({ ...newTask, tags: t })}
        />
        <TaskFormQuick
          value={newTask.isQuick}
          onChange={(isQuick) => setNewTask({ ...newTask, isQuick })}
        />
        <TaskFormSubtasks
          subtasks={newTask.subtasks}
          setSubtasks={(subtasks) => setNewTask({ ...newTask, subtasks })}
          newSubtask={newSubtask}
          setNewSubtask={setNewSubtask}
          onAdd={handleAddSubtask}
          onRemove={handleRemoveSubtask}
        />
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
