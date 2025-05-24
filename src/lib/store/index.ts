
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
    }
  )
);

// Re-export for backward compatibility
export * from './types';
