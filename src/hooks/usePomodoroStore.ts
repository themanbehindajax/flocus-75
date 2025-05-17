
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { useAppStore } from '@/lib/store';
import { sendPomodoroNotification } from '@/lib/notifications';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface PomodoroState {
  isActive: boolean;
  isPaused: boolean;
  timerMode: TimerMode;
  timeRemaining: number;
  pomodoroCount: number;
  selectedTaskId: string | null;
  selectedProjectId: string | null;
  activeSessionId: string | null;
  lastTickTime: number;
  
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setTimerMode: (mode: TimerMode) => void;
  setSelectedTaskId: (id: string | null) => void;
  setSelectedProjectId: (id: string | null) => void;
  tick: () => void;
  completeTimer: () => void;
}

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
      
      startTimer: () => {
        const { isPaused, timerMode } = get();
        
        if (isPaused) {
          set({ 
            isActive: true, 
            isPaused: false,
            lastTickTime: Date.now()
          });
          return;
        }
        
        // Start a new session
        const appStore = useAppStore.getState();
        const session = timerMode === 'pomodoro' 
          ? appStore.startPomodoroSession(get().selectedTaskId || undefined, get().selectedProjectId || undefined)
          : null;
          
        set({
          isActive: true,
          isPaused: false,
          activeSessionId: session?.id || null,
          lastTickTime: Date.now()
        });

        toast.success(timerMode === 'pomodoro' ? 'Pomodoro iniciado!' : 'Pausa iniciada!');
      },
      
      pauseTimer: () => {
        set({ isActive: true, isPaused: true });
        toast.info('Timer pausado');
      },
      
      resetTimer: () => {
        const appStore = useAppStore.getState();
        const settings = appStore.settings;
        
        const duration = (() => {
          switch (get().timerMode) {
            case 'pomodoro': return settings.pomodoroDuration * 60;
            case 'shortBreak': return settings.shortBreakDuration * 60;
            case 'longBreak': return settings.longBreakDuration * 60;
            default: return settings.pomodoroDuration * 60;
          }
        })();
        
        set({ 
          isActive: false, 
          isPaused: false, 
          timeRemaining: duration,
          activeSessionId: null
        });
        
        toast.info('Timer reiniciado');
      },
      
      setTimerMode: (mode: TimerMode) => {
        const appStore = useAppStore.getState();
        const settings = appStore.settings;
        
        const duration = (() => {
          switch (mode) {
            case 'pomodoro': return settings.pomodoroDuration * 60;
            case 'shortBreak': return settings.shortBreakDuration * 60;
            case 'longBreak': return settings.longBreakDuration * 60;
            default: return settings.pomodoroDuration * 60;
          }
        })();
        
        set({
          timerMode: mode,
          timeRemaining: duration,
          isActive: false,
          isPaused: false,
          activeSessionId: null
        });
      },
      
      setSelectedTaskId: (id) => set({ selectedTaskId: id }),
      
      setSelectedProjectId: (id) => set({ selectedProjectId: id }),
      
      tick: () => {
        const { isActive, isPaused, lastTickTime, timeRemaining } = get();
        
        if (!isActive || isPaused) return;
        
        const now = Date.now();
        const deltaSeconds = Math.floor((now - lastTickTime) / 1000);
        
        if (deltaSeconds >= 1) {
          const newTimeRemaining = Math.max(0, timeRemaining - deltaSeconds);
          
          set({
            lastTickTime: now,
            timeRemaining: newTimeRemaining
          });
          
          if (newTimeRemaining === 0) {
            get().completeTimer();
          }
        }
      },
      
      completeTimer: () => {
        const { timerMode, activeSessionId, pomodoroCount } = get();
        
        if (timerMode === 'pomodoro') {
          // Complete the pomodoro session
          if (activeSessionId) {
            const appStore = useAppStore.getState();
            appStore.completePomodoroSession(activeSessionId);
          }
          
          // Increment pomodoro count
          const newCount = pomodoroCount + 1;
          
          // Determine which break to take next
          const nextMode = newCount % 4 === 0 ? 'longBreak' : 'shortBreak';
          
          set({
            isActive: false,
            isPaused: false,
            activeSessionId: null,
            pomodoroCount: newCount,
            timerMode: nextMode
          });
          
          // Reset timer for the break
          get().resetTimer();
          
          // Show notification
          sendPomodoroNotification('Pomodoro concluído!', 'Hora de fazer uma pausa.');
        } else {
          // Break completed
          set({
            isActive: false,
            isPaused: false,
            timerMode: 'pomodoro'
          });
          
          // Reset timer for next pomodoro
          get().resetTimer();
          
          // Show notification
          sendPomodoroNotification('Pausa concluída!', 'Hora de voltar ao trabalho.');
        }
      }
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
