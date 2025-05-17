
import { v4 as uuidv4 } from "uuid";
import { Task, Project, DailyPriority } from "../types";

export const createTaskActions = (set: any, get: any) => ({
  addTask: (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "completed">) => {
    const newTask: Task = {
      id: uuidv4(),
      ...taskData,
      subtasks: taskData.subtasks || [],
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Adiciona a tarefa à lista global de tarefas
    set((state: any) => ({
      tasks: [...state.tasks, newTask],
    }));
    
    // Se a tarefa pertence a um projeto, adiciona-a ao projeto
    if (taskData.projectId) {
      // Busca o projeto atual
      const currentState = get();
      const project = currentState.projects.find((p: Project) => p.id === taskData.projectId);
      
      if (project) {
        // Atualiza o projeto com a nova tarefa
        const updatedProject = {
          ...project,
          tasks: [...project.tasks, newTask.id],
          updatedAt: new Date().toISOString(),
        };
        
        // Atualiza o estado com o projeto modificado
        set((state: any) => ({
          projects: state.projects.map((p: Project) => 
            p.id === taskData.projectId ? updatedProject : p
          ),
        }));
      }
    }
    
    return newTask;
  },
  
  updateTask: (task: Task) => {
    set((state: any) => {
      const oldTask = state.tasks.find((t: Task) => t.id === task.id);
      const updatedTask = { 
        ...task, 
        updatedAt: new Date().toISOString() 
      };
      
      // If status changed to done and task is not completed yet, mark it as completed
      if (updatedTask.status === "done" && !updatedTask.completed) {
        updatedTask.completed = true;
      }
      
      // Verify if the project of the task was changed
      if (oldTask && oldTask.projectId !== updatedTask.projectId) {
        // If it was in a project and was removed or moved to another project
        if (oldTask.projectId) {
          const oldProject = state.projects.find((p: Project) => p.id === oldTask.projectId);
          if (oldProject) {
            const updatedOldProject = {
              ...oldProject,
              tasks: oldProject.tasks.filter((id: string) => id !== task.id),
              updatedAt: new Date().toISOString(),
            };
            get().updateProject(updatedOldProject);
          }
        }
        
        // If it was added to a new project
        if (updatedTask.projectId) {
          const newProject = state.projects.find((p: Project) => p.id === updatedTask.projectId);
          if (newProject && !newProject.tasks.includes(task.id)) {
            const updatedNewProject = {
              ...newProject,
              tasks: [...newProject.tasks, task.id],
              updatedAt: new Date().toISOString(),
            };
            get().updateProject(updatedNewProject);
          }
        }
      }
      
      return {
        tasks: state.tasks.map((t: Task) => t.id === task.id ? updatedTask : t)
      };
    });
  },
  
  completeTask: (id: string) => {
    set((state: any) => {
      const updatedTasks = state.tasks.map((task: Task) =>
        task.id === id 
        ? { 
            ...task, 
            completed: true, 
            status: "done", 
            updatedAt: new Date().toISOString() 
          } 
        : task
      );
      
      const taskCompleted = state.tasks.find((t: Task) => t.id === id && !t.completed);
      const updatedProfile = { ...state.profile };
      
      if (taskCompleted) {
        updatedProfile.points += 5;
        updatedProfile.totalTasksCompleted += 1;
        updatedProfile.lastActivity = new Date().toISOString();
        const today = new Date().toISOString().split("T")[0];
        const lastActivityDate = new Date(state.profile.lastActivity).toISOString().split("T")[0];
        
        if (lastActivityDate === today) {
          // Same day activity, maintain streak
        } else if (
          new Date(lastActivityDate).getTime() >= new Date(new Date(today).getTime() - 86400000).getTime()
        ) {
          // Activity within last 24 hours, increase streak
          updatedProfile.streak += 1;
        } else {
          // Activity after a break, reset streak to 1
          updatedProfile.streak = 1;
        }
      }
      
      return {
        tasks: updatedTasks,
        profile: updatedProfile,
      };
    });
  },
  
  toggleTaskCompletion: (id: string) => {
    set((state: any) => {
      const task = state.tasks.find((t: Task) => t.id === id);
      
      if (!task) return state;
      
      const newCompletedState = !task.completed;
      
      // Create a new array and update the specific task
      const updatedTasks = state.tasks.map((t: Task) => {
        if (t.id !== id) return t;
        
        // Create a new task object with updated properties
        const updatedTask = { 
          ...t, 
          completed: newCompletedState, 
          updatedAt: new Date().toISOString() 
        };
        
        // If completing the task, set status to done
        if (newCompletedState) {
          updatedTask.status = "done";
        }
        // If uncompleting and status was done, set to todo
        else if (t.status === "done") {
          updatedTask.status = "todo";  
        }
        
        return updatedTask;
      });
      
      const updatedProfile = { ...state.profile };
      
      // If completing the task (not uncompleting)
      if (newCompletedState) {
        updatedProfile.points += 5;
        updatedProfile.totalTasksCompleted += 1;
        updatedProfile.lastActivity = new Date().toISOString();
        
        const today = new Date().toISOString().split("T")[0];
        const lastActivityDate = new Date(state.profile.lastActivity).toISOString().split("T")[0];
        
        if (lastActivityDate !== today) {
          if (new Date(lastActivityDate).getTime() >= new Date(new Date(today).getTime() - 86400000).getTime()) {
            // Activity within last 24 hours, increase streak
            updatedProfile.streak += 1;
          } else {
            // Activity after a break, reset streak to 1
            updatedProfile.streak = 1;
          }
        }
      }
      
      return {
        tasks: updatedTasks,
        profile: updatedProfile,
      };
    });
  },
  
  deleteTask: (id: string) => {
    set((state: any) => {
      const taskToDelete = state.tasks.find((t: Task) => t.id === id);
      
      if (!taskToDelete) return state;
      
      // If the task is part of a project, remove it from the project
      if (taskToDelete.projectId) {
        const project = state.projects.find((p: Project) => p.id === taskToDelete.projectId);
        if (project) {
          const updatedProject = {
            ...project,
            tasks: project.tasks.filter((taskId: string) => taskId !== id),
            updatedAt: new Date().toISOString(),
          };
          get().updateProject(updatedProject);
        }
      }
      
      // Remove task from daily priorities if present
      const updatedDailyPriorities = state.dailyPriorities.map((dp: DailyPriority) => ({
        ...dp,
        taskIds: dp.taskIds.filter((taskId: string) => taskId !== id),
      }));
      
      return {
        tasks: state.tasks.filter((t: Task) => t.id !== id),
        dailyPriorities: updatedDailyPriorities,
      };
    });
  },
});
