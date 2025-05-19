
import { 
  Task, 
  PomodoroSession, 
  Project, 
  Tag, 
  DailyPriority,
  UserProfile,
  CalendarEvent
} from '../types';

export interface UIState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapse: () => void;
  
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export interface TasksState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
}

export interface ProjectsState {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
}

export interface TagsState {
  tags: Tag[];
  addTag: (tag: Omit<Tag, 'id'>) => void;
  updateTag: (tag: Tag) => void;
  deleteTag: (tagId: string) => void;
}

export interface MiscState {
  dailyPriorities: DailyPriority[];
  setDailyPriorities: (priorities: DailyPriority) => void;
  
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  
  settings: {
    pomodoroDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    theme: 'light' | 'dark' | 'system';
    notificationsEnabled: boolean;
    spotifyAuth?: any;
  };
  updateSettings: (settings: Partial<MiscState['settings']>) => void;
}

export interface PomodoroState {
  pomodoroSessions: PomodoroSession[];
  startPomodoroSession: (taskId?: string, projectId?: string) => PomodoroSession;
  completePomodoroSession: (sessionId: string) => void;
  
  pomodoroSettings: {
    workDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    longBreakInterval: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
    alarmSound: string;
    alarmVolume: number;
  };
  updatePomodoroSettings: (settings: Partial<PomodoroState['pomodoroSettings']>) => void;
}

export interface CalendarState {
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (event: CalendarEvent) => void;
  deleteCalendarEvent: (eventId: string) => void;
}

export interface SpotifyState {
  spotifyAuth: any | null;
  setSpotifyAuth: (auth: any) => void;
  clearSpotifyAuth: () => void;
  getCurrentTrack: () => any;
  playTrack: (trackId: string) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  getUserPlaylists: () => any[];
  playPlaylist: (playlistId: string) => void;
}

// Combined state type that represents the entire app state
export type AppState = UIState & 
  TasksState & 
  ProjectsState & 
  TagsState & 
  MiscState & 
  PomodoroState & 
  CalendarState & 
  SpotifyState;

// Helper type for create function parameters
export type SetFunction = (fn: (state: any) => any) => void;
export type GetFunction = () => any;
