
import { v4 as uuidv4 } from "uuid";
import { Project, Task } from "../types";

export const createProjectActions = (set: any, get: any) => ({
  addProject: (projectData: Omit<Project, "id" | "createdAt" | "updatedAt" | "tasks">) => {
    const newProject: Project = {
      id: uuidv4(),
      ...projectData,
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state: any) => ({
      projects: [...state.projects, newProject],
    }));
    return newProject;
  },
  updateProject: (project: Project) => {
    set((state: any) => ({
      projects: state.projects.map((p: Project) =>
        p.id === project.id ? { ...project, updatedAt: new Date().toISOString() } : p
      ),
    }));
  },
  deleteProject: (id: string) => {
    set((state: any) => {
      const project = state.projects.find((p: Project) => p.id === id);
      const taskIds = project?.tasks || [];
      const updatedTasks = state.tasks.map((task: Task) => {
        if (task.projectId === id) {
          return { ...task, projectId: undefined, updatedAt: new Date().toISOString() };
        }
        return task;
      });
      return {
        projects: state.projects.filter((p: Project) => p.id !== id),
        tasks: updatedTasks,
      };
    });
  },
});
