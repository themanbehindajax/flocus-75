
export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export interface PomodoroState {
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
