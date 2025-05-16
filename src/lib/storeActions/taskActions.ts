
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
    
    set((state: any) => ({
      tasks: [...state.tasks, newTask],
    }));
    
    if (taskData.projectId) {
      const project = get().projects.find((p: Project) => p.id === taskData.projectId);
      if (project) {
        const updatedProject = {
          ...project,
          tasks: [...project.tasks, newTask.id],
          updatedAt: new Date().toISOString(),
        };
        get().updateProject(updatedProject);
      }
    }
    
    return newTask;
  },
  
  updateTask: (task: Task) => {
    set((state: any) => {
      const oldTask = state.tasks.find((t: Task) => t.id === task.id);
      const updatedTask = { ...task, updatedAt: new Date().toISOString() };
      
      // Verify if status changed to done and task is not completed yet
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
        } else if (
          new Date(lastActivityDate) >= new Date(today + "T00:00:00.000Z") ||
          new Date(lastActivityDate) >= new Date(new Date(today).getTime() - 86400000)
        ) {
          updatedProfile.streak += 1;
        } else {
          updatedProfile.streak = 1;
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
      const task = state.tasks.find((t: Task) => t.id === id);
      let updatedProjects = [...state.projects];
      if (task?.projectId) {
        updatedProjects = state.projects.map((project: Project) => {
          if (project.id === task.projectId) {
            return {
              ...project,
              tasks: project.tasks.filter(taskId => taskId !== id),
              updatedAt: new Date().toISOString(),
            };
          }
          return project;
        });
      }
      const updatedDailyPriorities = state.dailyPriorities.map((dp: DailyPriority) => ({
        ...dp,
        taskIds: dp.taskIds.filter(taskId => taskId !== id),
      }));
      return {
        tasks: state.tasks.filter((t: Task) => t.id !== id),
        projects: updatedProjects,
        dailyPriorities: updatedDailyPriorities,
      };
    });
  },
});
