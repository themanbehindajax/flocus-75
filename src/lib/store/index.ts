
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createUISlice } from './slices/uiSlice';
import { createTasksSlice } from './slices/tasksSlice';
import { createProjectsSlice } from './slices/projectsSlice';
import { createTagsSlice } from './slices/tagsSlice';
import { createPomodoroSlice } from './slices/pomodoroSlice';
import { createMiscSlice } from './slices/miscSlice';
import { createCalendarSlice } from './slices/calendarSlice';
import { AppState } from './types';
import { 
  demoTasks, 
  demoProjects, 
  demoTags, 
  demoPomodoroSessions, 
  demoDailyPriorities, 
  demoProfile, 
  demoCalendarEvents 
} from '../demoData';

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...createUISlice(set),
      ...createTasksSlice(set, get),
      ...createProjectsSlice(set, get),
      ...createPomodoroSlice(set, get),
      ...createMiscSlice(set), // Fixed: Only passing set parameter
      ...createTagsSlice(set),
      ...createCalendarSlice(set, get),
    }),
    {
      name: 'flocus-app-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        sidebarCollapsed: state.sidebarCollapsed,
        notificationsEnabled: state.notificationsEnabled,
        timezone: state.timezone,
        pomodoroSettings: state.pomodoroSettings,
        tasks: state.tasks,
        projects: state.projects,
        tags: state.tags,
        dailyPriorities: state.dailyPriorities,
        pomodoroSessions: state.pomodoroSessions,
        profile: state.profile,
        calendarEvents: state.calendarEvents,
        settings: state.settings
      }),
      onRehydrateStorage: () => (state) => {
        // Para novos usuários (sem dados salvos), carregar dados demo automaticamente
        if (state && !localStorage.getItem('flocus-app-storage-loaded')) {
          if (state.tasks.length === 0) {
            state.tasks = demoTasks;
            state.projects = demoProjects;
            state.tags = demoTags;
            state.pomodoroSessions = demoPomodoroSessions;
            state.dailyPriorities = demoDailyPriorities;
            state.calendarEvents = demoCalendarEvents;
            if (state.profile.name === 'Usuário' && state.profile.points === 0) {
              state.profile = demoProfile;
            }
            localStorage.setItem('flocus-app-storage-loaded', 'true');
          }
        }
      }
    }
  )
);

// Re-export for backward compatibility
export * from './types';
