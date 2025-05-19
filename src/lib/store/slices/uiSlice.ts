
import { UIState, SetFunction } from '../types';

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
});
