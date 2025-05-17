
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PomodoroState } from './types';
import { createPomodoroActions } from './actions';

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      isActive: false,
      isPaused: false,
      timerMode: 'pomodoro',
      timeRemaining: 25 * 60, // 25 minutes in seconds
      pomodoroCount: 0,
      selectedTaskId: null,
      selectedProjectId: null,
      activeSessionId: null,
      lastTickTime: Date.now(),
      
      ...createPomodoroActions(set, get)
    }),
    {
      name: 'flocus-pomodoro-storage',
      partialize: (state) => ({
        timerMode: state.timerMode,
        pomodoroCount: state.pomodoroCount,
        selectedTaskId: state.selectedTaskId,
        selectedProjectId: state.selectedProjectId,
      }),
    }
  )
);

// Create a worker function that runs the pomodoro timer in the background
if (typeof window !== 'undefined') {
  // Run tick every second
  setInterval(() => {
    const store = usePomodoroStore.getState();
    if (store.isActive && !store.isPaused) {
      store.tick();
    }
  }, 1000);
}
