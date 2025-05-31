
import { UIState, SetFunction } from '../types';
import { getDefaultTimezone } from '../../timezone';

export const createUISlice = (set: SetFunction): UIState => ({
  // Theme
  theme: 'system',
  setTheme: (theme) => set((state) => ({ theme })),
  
  // Sidebar
  sidebarOpen: true,
  setSidebarOpen: (open) => set((state) => ({ sidebarOpen: open })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set((state) => ({ sidebarCollapsed: collapsed })),
  toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  
  // Notifications
  notificationsEnabled: true,
  setNotificationsEnabled: (enabled) => set((state) => ({ notificationsEnabled: enabled })),
  
  // Timezone
  timezone: getDefaultTimezone(),
  setTimezone: (timezone) => set((state) => ({ timezone })),
  
  // UI Preferences
  colorMode: 'light',
  setColorMode: (mode) => set((state) => ({ colorMode: mode })),
  accentColor: 'blue',
  setAccentColor: (color) => set((state) => ({ accentColor: color })),
  animationsEnabled: true,
  setAnimationsEnabled: (enabled) => set((state) => ({ animationsEnabled: enabled })),
});
