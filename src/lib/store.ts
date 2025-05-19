
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Task, 
  PomodoroSession, 
  Project, 
  Tag, 
  DailyPriority,
  UserProfile,
  CalendarEvent
} from './types';
import { 
  createTaskActions, 
  createProjectActions, 
  createTagActions, 
  createPomodoroActions,
  createMiscActions,
  createCalendarActions
} from './storeActions';

export interface AppState {
  // User preferences
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Sidebar state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapse: () => void;
  
  // Notifications
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  
  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  
  // Tags
  tags: Tag[];
  addTag: (tag: Omit<Tag, 'id'>) => void;
  updateTag: (tag: Tag) => void;
  deleteTag: (tagId: string) => void;
  
  // Daily Priorities
  dailyPriorities: DailyPriority[];
  setDailyPriorities: (priorities: DailyPriority) => void;
  
  // Pomodoro sessions
  pomodoroSessions: PomodoroSession[];
  startPomodoroSession: (taskId?: string, projectId?: string) => PomodoroSession;
  completePomodoroSession: (sessionId: string) => void;
  
  // User profile
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  
  // Calendar events
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (event: CalendarEvent) => void;
  deleteCalendarEvent: (eventId: string) => void;
  
  // Pomodoro settings
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
  updatePomodoroSettings: (settings: Partial<AppState['pomodoroSettings']>) => void;
  
  // App settings
  settings: {
    pomodoroDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    theme: 'light' | 'dark' | 'system';
    notificationsEnabled: boolean;
    spotifyAuth?: any;
  };
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  
  // Spotify stubs
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

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      // Initialize task-related actions
      const taskActions = createTaskActions(set, get);
      // Initialize project-related actions
      const projectActions = createProjectActions(set, get);
      // Initialize tag-related actions
      const tagActions = createTagActions(set, get);
      // Initialize pomodoro-related actions
      const pomodoroActions = createPomodoroActions(set, get);
      // Initialize misc actions - remove the get parameter that's causing the error
      const miscActions = createMiscActions(set);
      // Initialize calendar actions
      const calendarActions = createCalendarActions(set, get);
      
      return {
        // Theme
        theme: 'system',
        setTheme: (theme) => set({ theme }),
        
        // Sidebar
        sidebarOpen: true,
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        sidebarCollapsed: false,
        setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
        toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
        
        // Notifications
        notificationsEnabled: true,
        setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
        
        // Tasks
        tasks: [],
        addTask: (task) => set((state) => { 
          // Ensure projectId is a proper string or undefined
          const projectId = task.projectId !== null && 
            task.projectId !== undefined &&
            typeof task.projectId === 'string' ? 
            task.projectId : undefined;
            
          const newTask = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completed: false,
            subtasks: [],
            tags: task.tags || [],
            ...task,
            projectId, // Use sanitized projectId
          };
          
          console.log("[DEBUG STORE] Adicionando task:", newTask);
          
          // Adiciona no window para depuração extra
          (window as any).__GLOBAL_APP_STORE__ = {
            ...((window as any).__GLOBAL_APP_STORE__ || {}),
            tasks: [...state.tasks, newTask],
          };
          return { 
            tasks: [...state.tasks, newTask] 
          };
        }),
        
        // Fix the argument count issues - direct function reference
        updateTask: taskActions.updateTask,
        deleteTask: taskActions.deleteTask,
        completeTask: taskActions.completeTask,
        toggleTaskCompletion: taskActions.toggleTaskCompletion,
        
        // Projects
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
        deleteProject: (projectId) => set((state) => ({
          projects: state.projects.filter(project => project.id !== projectId)
        })),
        
        // Tags
        tags: [],
        addTag: (tag) => set((state) => ({
          tags: [...state.tags, { id: crypto.randomUUID(), ...tag }]
        })),
        updateTag: (updatedTag) => set((state) => ({
          tags: state.tags.map(tag => 
            tag.id === updatedTag.id ? updatedTag : tag
          )
        })),
        deleteTag: (tagId) => set((state) => ({
          tags: state.tags.filter(tag => tag.id !== tagId)
        })),
        
        // Daily Priorities
        dailyPriorities: [],
        setDailyPriorities: miscActions.setDailyPriorities,
        
        // Pomodoro sessions
        pomodoroSessions: [],
        startPomodoroSession: (taskId, projectId) => {
          const newSession = {
            id: crypto.randomUUID(),
            startTime: new Date().toISOString(),
            completed: false,
            taskId,
            projectId
          };
          set((state) => ({
            pomodoroSessions: [...state.pomodoroSessions, newSession]
          }));
          return newSession;
        },
        completePomodoroSession: (sessionId) => set((state) => ({
          pomodoroSessions: state.pomodoroSessions.map(session => 
            session.id === sessionId 
              ? { 
                  ...session, 
                  completed: true, 
                  endTime: new Date().toISOString(),
                  duration: session.startTime ? 
                    Math.round((new Date().getTime() - new Date(session.startTime).getTime()) / 1000 / 60) : 
                    undefined
                } 
              : session
          )
        })),
        
        // User profile
        profile: {
          name: 'Usuário',
          points: 0,
          streak: 0,
          lastActivity: new Date().toISOString(),
          totalTasksCompleted: 0,
          totalPomodorosCompleted: 0
        },
        updateProfile: miscActions.updateProfile,
        
        // Calendar events
        calendarEvents: [],
        addCalendarEvent: calendarActions.addCalendarEvent,
        updateCalendarEvent: calendarActions.updateCalendarEvent,
        deleteCalendarEvent: calendarActions.deleteCalendarEvent,
        
        // Pomodoro settings
        pomodoroSettings: {
          workDuration: 25,
          shortBreakDuration: 5,
          longBreakDuration: 15,
          longBreakInterval: 4,
          autoStartBreaks: true,
          autoStartPomodoros: true,
          alarmSound: 'bell',
          alarmVolume: 0.5,
        },
        updatePomodoroSettings: (settings) => 
          set((state) => ({ 
            pomodoroSettings: { ...state.pomodoroSettings, ...settings } 
          })),
        
        // App settings
        settings: {
          pomodoroDuration: 25,
          shortBreakDuration: 5,
          longBreakDuration: 15,
          theme: 'system',
          notificationsEnabled: true,
        },
        updateSettings: miscActions.updateSettings,
        
        // Spotify stubs
        spotifyAuth: null,
        setSpotifyAuth: (auth) => set({ spotifyAuth: auth }),
        clearSpotifyAuth: () => set({ spotifyAuth: null }),
        getCurrentTrack: () => null,
        playTrack: () => {},
        pauseTrack: () => {},
        nextTrack: () => {},
        previousTrack: () => {},
        getUserPlaylists: () => [],
        playPlaylist: () => {},
      };
    },
    {
      name: 'flocus-app-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        sidebarCollapsed: state.sidebarCollapsed,
        notificationsEnabled: state.notificationsEnabled,
        pomodoroSettings: state.pomodoroSettings,
        spotifyAuth: state.spotifyAuth,
        tasks: state.tasks,
        projects: state.projects,
        tags: state.tags,
        dailyPriorities: state.dailyPriorities,
        pomodoroSessions: state.pomodoroSessions,
        profile: state.profile,
        calendarEvents: state.calendarEvents,
        settings: state.settings
      }),
    }
  )
);
