
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { 
  createTaskActions, 
  createProjectActions, 
  createTagActions, 
  createPomodoroActions,
  createMiscActions,
  createSpotifyActions
} from "./storeActions";
import { Task, Project, Tag, PomodoroSession, DailyPriority, UserProfile, AppSettings } from "./types";

// Define the full store state type
export interface AppState {
  // State
  tasks: Task[];
  projects: Project[];
  tags: Tag[];
  pomodoroSessions: PomodoroSession[];
  dailyPriorities: DailyPriority[];
  profile: UserProfile;
  settings: AppSettings;
  
  // Actions from task actions
  addTask: (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "completed">) => Task;
  updateTask: (task: Task) => void;
  completeTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  
  // Actions from project actions
  addProject: (projectData: Omit<Project, "id" | "createdAt" | "updatedAt" | "tasks">) => Project;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  
  // Actions from tag actions
  addTag: (tagData: Omit<Tag, "id">) => Tag;
  updateTag: (tag: Tag) => void;
  deleteTag: (id: string) => void;
  
  // Actions from pomodoro actions
  startPomodoroSession: (taskId?: string, projectId?: string) => PomodoroSession;
  completePomodoroSession: (id: string) => void;
  
  // Actions from misc actions
  setDailyPriorities: (date: string, taskIds: string[]) => void;
  updateProfile: (profileUpdate: Partial<UserProfile>) => void;
  updateSettings: (settingsUpdate: Partial<AppSettings>) => void;
  
  // Actions from spotify actions
  setSpotifyAuth: (auth: { accessToken: string; refreshToken: string; expiresAt: number }) => void;
  clearSpotifyAuth: () => void;
  getCurrentTrack: () => Promise<any | null>;
  playTrack: (uri: string) => Promise<void>;
  pauseTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  getUserPlaylists: () => Promise<any[]>;
  playPlaylist: (playlistUri: string) => Promise<void>;
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
      
      ...createTaskActions(set, get),
      ...createProjectActions(set, get),
      ...createTagActions(set),
      ...createPomodoroActions(set, get),
      ...createMiscActions(set),
      ...createSpotifyActions(set, get),
    }),
    {
      name: "flocus-app-storage",
    }
  )
);
