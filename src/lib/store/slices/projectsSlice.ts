
import { v4 as uuidv4 } from "uuid";
import { ProjectsState, SetFunction, GetFunction } from '../types';
import { Project, Task } from '../../types';

export const createProjectsSlice = (set: SetFunction, get: GetFunction): ProjectsState => ({
  projects: [],
  addProject: (project) => set((state) => ({
    projects: [...state.projects, {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasks: [],
      ...project
    }]
  })),
  
  updateProject: (updatedProject) => set((state) => ({
    projects: state.projects.map(project => 
      project.id === updatedProject.id ? { ...updatedProject, updatedAt: new Date().toISOString() } : project
    )
  })),
  
  deleteProject: (projectId) => set((state) => {
    const project = state.projects.find((p: Project) => p.id === projectId);
    const taskIds = project?.tasks || [];
    const updatedTasks = state.tasks.map((task: Task) => {
      if (task.projectId === projectId) {
        return { ...task, projectId: undefined, updatedAt: new Date().toISOString() };
      }
      return task;
    });
    
    return {
      projects: state.projects.filter(project => project.id !== projectId),
      tasks: updatedTasks,
    };
  }),
});
