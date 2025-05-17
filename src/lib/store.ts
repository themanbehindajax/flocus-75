import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppState {
  // User preferences
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Sidebar state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  // Notifications
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  
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
    (set, get) => ({
      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      
      // Sidebar
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      // Notifications
      notificationsEnabled: true,
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      
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
    }),
    {
      name: 'flocus-app-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        notificationsEnabled: state.notificationsEnabled,
        pomodoroSettings: state.pomodoroSettings,
        spotifyAuth: state.spotifyAuth,
      }),
    }
  )
);
