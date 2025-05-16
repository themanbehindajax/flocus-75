
import { v4 as uuidv4 } from "uuid";
import { Task, Project, Tag, DailyPriority, PomodoroSession, UserProfile } from "./types";

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
    
    // If task belongs to a project, update the project
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
      // Update the task
      const updatedTasks = state.tasks.map((task: Task) =>
        task.id === id ? { ...task, completed: true, updatedAt: new Date().toISOString() } : task
      );
      
      // Update profile stats
      const taskCompleted = state.tasks.find((t: Task) => t.id === id && !t.completed);
      const updatedProfile = { ...state.profile };
      
      if (taskCompleted) {
        updatedProfile.points += 5;
        updatedProfile.totalTasksCompleted += 1;
        updatedProfile.lastActivity = new Date().toISOString();
        
        // Check streak
        const today = new Date().toISOString().split("T")[0];
        const lastActivityDate = new Date(state.profile.lastActivity).toISOString().split("T")[0];
        
        if (lastActivityDate === today) {
          // Already had activity today, streak remains
        } else if (
          new Date(lastActivityDate) >= new Date(today + "T00:00:00.000Z") ||
          new Date(lastActivityDate) >= new Date(new Date(today).getTime() - 86400000) // yesterday
        ) {
          // Activity was yesterday or today, increase streak
          updatedProfile.streak += 1;
        } else {
          // Activity was older than yesterday, reset streak
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
      // Remove task from any project it belongs to
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
      
      // Remove task from daily priorities
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
      // First, get all task IDs from this project
      const project = state.projects.find((p: Project) => p.id === id);
      const taskIds = project?.tasks || [];
      
      // Update tasks to remove project association
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

export const createTagActions = (set: any) => ({
  addTag: (tagData: Omit<Tag, "id">) => {
    const newTag: Tag = {
      id: uuidv4(),
      ...tagData,
    };
    
    set((state: any) => ({
      tags: [...state.tags, newTag],
    }));
    
    return newTag;
  },
  
  updateTag: (tag: Tag) => {
    set((state: any) => ({
      tags: state.tags.map((t: Tag) => t.id === tag.id ? tag : t),
    }));
  },
  
  deleteTag: (id: string) => {
    set((state: any) => {
      // Remove tag from all tasks
      const updatedTasks = state.tasks.map((task: Task) => ({
        ...task,
        tags: task.tags.filter(tagId => tagId !== id),
        updatedAt: task.tags.includes(id) ? new Date().toISOString() : task.updatedAt,
      }));
      
      return {
        tags: state.tags.filter((t: Tag) => t.id !== id),
        tasks: updatedTasks,
      };
    });
  },
});

export const createPomodoroActions = (set: any, get: any) => ({
  startPomodoroSession: (taskId?: string, projectId?: string) => {
    const newSession: PomodoroSession = {
      id: uuidv4(),
      taskId,
      projectId,
      startTime: new Date().toISOString(),
      endTime: "",
      duration: get().settings.pomodoroDuration,
      completed: false,
    };
    
    set((state: any) => ({
      pomodoroSessions: [...state.pomodoroSessions, newSession],
      profile: {
        ...state.profile,
        lastActivity: new Date().toISOString(),
      },
    }));
    
    return newSession;
  },
  
  completePomodoroSession: (id: string) => {
    set((state: any) => {
      const updatedSessions = state.pomodoroSessions.map((session: PomodoroSession) => {
        if (session.id === id) {
          return {
            ...session,
            endTime: new Date().toISOString(),
            completed: true,
          };
        }
        return session;
      });
      
      // Update profile stats
      const sessionCompleted = state.pomodoroSessions.find((s: PomodoroSession) => s.id === id && !s.completed);
      const updatedProfile = { ...state.profile };
      
      if (sessionCompleted) {
        updatedProfile.points += 10;
        updatedProfile.totalPomodorosCompleted += 1;
        updatedProfile.lastActivity = new Date().toISOString();
        
        // Check streak (same logic as completeTask)
        const today = new Date().toISOString().split("T")[0];
        const lastActivityDate = new Date(state.profile.lastActivity).toISOString().split("T")[0];
        
        if (lastActivityDate === today) {
          // Already had activity today, streak remains
        } else if (
          new Date(lastActivityDate) >= new Date(new Date(today).getTime() - 86400000) // yesterday
        ) {
          // Activity was yesterday, increase streak
          updatedProfile.streak += 1;
        } else {
          // Activity was older than yesterday, reset streak
          updatedProfile.streak = 1;
        }
      }
      
      return {
        pomodoroSessions: updatedSessions,
        profile: updatedProfile,
      };
    });
  },
});

export const createMiscActions = (set: any) => ({
  setDailyPriorities: (date: string, taskIds: string[]) => {
    set((state: any) => {
      const existingPriority = state.dailyPriorities.find((dp: DailyPriority) => dp.date === date);
      
      if (existingPriority) {
        return {
          dailyPriorities: state.dailyPriorities.map((dp: DailyPriority) => 
            dp.date === date ? { ...dp, taskIds } : dp
          ),
        };
      } else {
        return {
          dailyPriorities: [...state.dailyPriorities, {
            id: uuidv4(),
            date,
            taskIds,
          }],
        };
      }
    });
  },
  
  updateProfile: (profileUpdate: Partial<UserProfile>) => {
    set((state: any) => ({
      profile: { ...state.profile, ...profileUpdate },
    }));
  },
  
  updateSettings: (settingsUpdate: any) => {
    set((state: any) => ({
      settings: { ...state.settings, ...settingsUpdate },
    }));
  },
});
