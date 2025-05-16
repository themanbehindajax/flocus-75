
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
    set((state: any) => ({
      tasks: state.tasks.map((t: Task) =>
        t.id === task.id ? { ...task, updatedAt: new Date().toISOString() } : t
      ),
    }));
  },
  completeTask: (id: string) => {
    set((state: any) => {
      const updatedTasks = state.tasks.map((task: Task) =>
        task.id === id ? { ...task, completed: true, updatedAt: new Date().toISOString() } : task
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
