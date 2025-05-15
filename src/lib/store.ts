
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { 
  Task, Project, Tag, PomodoroSession, 
  DailyPriority, UserProfile, AppSettings 
} from "./types";

interface AppState {
  tasks: Task[];
  projects: Project[];
  tags: Tag[];
  pomodoroSessions: PomodoroSession[];
  dailyPriorities: DailyPriority[];
  profile: UserProfile;
  settings: AppSettings;
  
  // Task actions
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "completed">) => Task;
  updateTask: (task: Task) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  
  // Project actions
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt" | "tasks">) => Project;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  
  // Tag actions
  addTag: (tag: Omit<Tag, "id">) => Tag;
  updateTag: (tag: Tag) => void;
  deleteTag: (id: string) => void;
  
  // Pomodoro actions
  startPomodoroSession: (taskId?: string, projectId?: string) => PomodoroSession;
  completePomodoroSession: (id: string) => void;
  
  // Daily priorities actions
  setDailyPriorities: (date: string, taskIds: string[]) => void;
  
  // Profile actions
  updateProfile: (profile: Partial<UserProfile>) => void;
  
  // Settings actions
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: [],
      projects: [],
      tags: [
        { id: uuidv4(), name: "Urgente", color: "#EF4444" },
        { id: uuidv4(), name: "Criativo", color: "#8B5CF6" },
        { id: uuidv4(), name: "Financeiro", color: "#10B981" },
      ],
      pomodoroSessions: [],
      dailyPriorities: [],
      profile: {
        name: "Usuário",
        points: 0,
        streak: 0,
        lastActivity: new Date().toISOString(),
        totalTasksCompleted: 0,
        totalPomodorosCompleted: 0,
      },
      settings: {
        pomodoroDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        theme: "system",
      },
      
      addTask: (taskData) => {
        const newTask: Task = {
          id: uuidv4(),
          ...taskData,
          subtasks: taskData.subtasks || [],
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
        
        // If task belongs to a project, update the project
        if (taskData.projectId) {
          const project = get().projects.find(p => p.id === taskData.projectId);
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
      
      updateTask: (task) => {
        set((state) => ({
          tasks: state.tasks.map((t) => 
            t.id === task.id ? { ...task, updatedAt: new Date().toISOString() } : t
          ),
        }));
      },
      
      completeTask: (id) => {
        set((state) => {
          // Update the task
          const updatedTasks = state.tasks.map((task) =>
            task.id === id ? { ...task, completed: true, updatedAt: new Date().toISOString() } : task
          );
          
          // Update profile stats
          const taskCompleted = state.tasks.find(t => t.id === id && !t.completed);
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
      
      deleteTask: (id) => {
        set((state) => {
          // Remove task from any project it belongs to
          const task = state.tasks.find(t => t.id === id);
          let updatedProjects = [...state.projects];
          
          if (task?.projectId) {
            updatedProjects = state.projects.map(project => {
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
          const updatedDailyPriorities = state.dailyPriorities.map(dp => ({
            ...dp,
            taskIds: dp.taskIds.filter(taskId => taskId !== id),
          }));
          
          return {
            tasks: state.tasks.filter(t => t.id !== id),
            projects: updatedProjects,
            dailyPriorities: updatedDailyPriorities,
          };
        });
      },
      
      addProject: (projectData) => {
        const newProject: Project = {
          id: uuidv4(),
          ...projectData,
          tasks: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          projects: [...state.projects, newProject],
        }));
        
        return newProject;
      },
      
      updateProject: (project) => {
        set((state) => ({
          projects: state.projects.map((p) => 
            p.id === project.id ? { ...project, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },
      
      deleteProject: (id) => {
        set((state) => {
          // First, get all task IDs from this project
          const project = state.projects.find(p => p.id === id);
          const taskIds = project?.tasks || [];
          
          // Update tasks to remove project association
          const updatedTasks = state.tasks.map(task => {
            if (task.projectId === id) {
              return { ...task, projectId: undefined, updatedAt: new Date().toISOString() };
            }
            return task;
          });
          
          return {
            projects: state.projects.filter(p => p.id !== id),
            tasks: updatedTasks,
          };
        });
      },
      
      addTag: (tagData) => {
        const newTag: Tag = {
          id: uuidv4(),
          ...tagData,
        };
        
        set((state) => ({
          tags: [...state.tags, newTag],
        }));
        
        return newTag;
      },
      
      updateTag: (tag) => {
        set((state) => ({
          tags: state.tags.map((t) => t.id === tag.id ? tag : t),
        }));
      },
      
      deleteTag: (id) => {
        set((state) => {
          // Remove tag from all tasks
          const updatedTasks = state.tasks.map(task => ({
            ...task,
            tags: task.tags.filter(tagId => tagId !== id),
            updatedAt: task.tags.includes(id) ? new Date().toISOString() : task.updatedAt,
          }));
          
          return {
            tags: state.tags.filter(t => t.id !== id),
            tasks: updatedTasks,
          };
        });
      },
      
      startPomodoroSession: (taskId, projectId) => {
        const newSession: PomodoroSession = {
          id: uuidv4(),
          taskId,
          projectId,
          startTime: new Date().toISOString(),
          endTime: "",
          duration: get().settings.pomodoroDuration,
          completed: false,
        };
        
        set((state) => ({
          pomodoroSessions: [...state.pomodoroSessions, newSession],
          profile: {
            ...state.profile,
            lastActivity: new Date().toISOString(),
          },
        }));
        
        return newSession;
      },
      
      completePomodoroSession: (id) => {
        set((state) => {
          const updatedSessions = state.pomodoroSessions.map(session => {
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
          const sessionCompleted = state.pomodoroSessions.find(s => s.id === id && !s.completed);
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
      
      setDailyPriorities: (date, taskIds) => {
        set((state) => {
          const existingPriority = state.dailyPriorities.find(dp => dp.date === date);
          
          if (existingPriority) {
            return {
              dailyPriorities: state.dailyPriorities.map(dp => 
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
      
      updateProfile: (profileUpdate) => {
        set((state) => ({
          profile: { ...state.profile, ...profileUpdate },
        }));
      },
      
      updateSettings: (settingsUpdate) => {
        set((state) => ({
          settings: { ...state.settings, ...settingsUpdate },
        }));
      },
    }),
    {
      name: "produtivo-app-storage",
    }
  )
);
