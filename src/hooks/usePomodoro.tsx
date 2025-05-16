import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";

type TimerState = "idle" | "running" | "paused" | "break" | "completed";
type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

export const usePomodoro = () => {
  const { settings, startPomodoroSession, completePomodoroSession } = useAppStore();
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [timerMode, setTimerMode] = useState<TimerMode>("pomodoro");
  const [timeRemaining, setTimeRemaining] = useState(settings.pomodoroDuration * 60);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  // Refs for keeping track of timer even when tab is inactive
  const timerRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number>(Date.now());

  // Get durations based on current mode
  const getDuration = (): number => {
    switch (timerMode) {
      case "pomodoro":
        return settings.pomodoroDuration * 60;
      case "shortBreak":
        return settings.shortBreakDuration * 60;
      case "longBreak":
        return settings.longBreakDuration * 60;
      default:
        return settings.pomodoroDuration * 60;
    }
  };

  // Reset timer when mode changes
  useEffect(() => {
    setTimeRemaining(getDuration());
  }, [timerMode, settings]);

  // Handle timer completion logic
  const handleTimerCompletion = () => {
    if (timerMode === "pomodoro") {
      // Complete the session
      if (activeSessionId) {
        completePomodoroSession(activeSessionId);
        setActiveSessionId(null);
      }
      
      // Increment pomodoro count
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      
      // Determine which break to take
      const nextMode = newCount % 4 === 0 ? "longBreak" : "shortBreak";
      setTimerMode(nextMode);
      
      toast({
        title: "Pomodoro concluído!",
        description: "Hora de fazer uma pausa.",
      });
      
      setTimerState("completed");
    } else {
      // Break completed
      setTimerMode("pomodoro");
      
      toast({
        title: "Pausa concluída!",
        description: "Hora de voltar ao trabalho.",
      });
      
      setTimerState("completed");
    }
    
    setTimeRemaining(0);
  };

  // Timer logic
  useEffect(() => {
    if (timerState !== "running") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Use requestAnimationFrame for more accurate timing
    const tick = () => {
      const now = Date.now();
      const deltaTime = Math.floor((now - lastTickTimeRef.current) / 1000);
      
      if (deltaTime >= 1) {
        lastTickTimeRef.current = now;
        
        setTimeRemaining((prev) => {
          if (prev <= deltaTime) {
            handleTimerCompletion();
            return 0;
          }
          return prev - deltaTime;
        });
      }
      
      if (timerState === "running") {
        timerRef.current = window.requestAnimationFrame(tick);
      }
    };

    // Start the timer
    lastTickTimeRef.current = Date.now();
    timerRef.current = window.requestAnimationFrame(tick);
    
    // Cleanup function
    return () => {
      if (timerRef.current) {
        window.cancelAnimationFrame(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerState, timerMode, pomodoroCount]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.cancelAnimationFrame(timerRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    if (timerState === "paused") {
      setTimerState("running");
      lastTickTimeRef.current = Date.now();
      return;
    }
    
    if (timerMode === "pomodoro") {
      // Start a new session in the store
      const session = startPomodoroSession(selectedTaskId, selectedProjectId);
      setActiveSessionId(session.id);
    }
    
    setTimerState("running");
    lastTickTimeRef.current = Date.now();

    toast({
      title: timerMode === "pomodoro" ? "Foco iniciado!" : "Pausa iniciada!",
      description: "Mantenha o foco na sua tarefa atual.",
    });
  };

  const pauseTimer = () => {
    setTimerState("paused");
  };

  const resetTimer = () => {
    setTimerState("idle");
    setTimeRemaining(getDuration());
    
    // If we're resetting during a pomodoro, consider it abandoned
    if (timerMode === "pomodoro" && activeSessionId) {
      setActiveSessionId(null);
    }
    
    toast({
      title: "Timer reiniciado",
      description: "O temporizador foi redefinido.",
    });
  };

  const handleModeChange = (mode: TimerMode) => {
    if (timerState === "running" || timerState === "paused") {
      const confirm = window.confirm("Mudar o modo irá reiniciar o temporizador. Deseja continuar?");
      if (!confirm) return;
    }
    
    setTimerState("idle");
    setTimerMode(mode);
    setTimeRemaining(getDuration());
  };

  // Calculate progress for visual display
  const progress = 1 - timeRemaining / getDuration();

  return {
    timerState,
    timerMode,
    timeRemaining,
    pomodoroCount,
    progress,
    selectedTaskId,
    selectedProjectId,
    setSelectedTaskId,
    setSelectedProjectId,
    startTimer,
    pauseTimer,
    resetTimer,
    handleModeChange
  };
};

// Helper function to format time for display
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
