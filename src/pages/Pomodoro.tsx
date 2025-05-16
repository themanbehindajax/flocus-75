import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Clock, Play, Pause, RotateCcw, CheckCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SpotifyPlayer } from "@/components/spotify/SpotifyPlayer";
import { SpotifyPlaylists } from "@/components/spotify/SpotifyPlaylists";

type TimerState = "idle" | "running" | "paused" | "break" | "completed";
type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const Pomodoro = () => {
  const { settings, tasks, projects, startPomodoroSession, completePomodoroSession } = useAppStore();
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [timerMode, setTimerMode] = useState<TimerMode>("pomodoro");
  const [timeRemaining, setTimeRemaining] = useState(settings.pomodoroDuration * 60);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const { toast } = useToast();

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

  // Timer logic
  useEffect(() => {
    if (timerState !== "running") return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          
          // Handle timer completion
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
            
            return 0;
          } else {
            // Break completed
            setTimerMode("pomodoro");
            
            toast({
              title: "Pausa concluída!",
              description: "Hora de voltar ao trabalho.",
            });
            
            setTimerState("completed");
            
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState, timerMode, pomodoroCount, activeSessionId]);

  const startTimer = () => {
    if (timerState === "paused") {
      setTimerState("running");
      return;
    }
    
    if (timerMode === "pomodoro") {
      // Start a new session in the store
      const session = startPomodoroSession(selectedTaskId, selectedProjectId);
      setActiveSessionId(session.id);
    }
    
    setTimerState("running");

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

  // Get progress percentage for the circle
  const progress = 1 - timeRemaining / getDuration();
  const circumference = 2 * Math.PI * 45; // Circle radius is 45
  const dashoffset = circumference * (1 - progress);

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Pomodoro Timer</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Timer Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Timer</CardTitle>
              <CardDescription>
                Gerencie seu tempo com a técnica Pomodoro
              </CardDescription>
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant={timerMode === "pomodoro" ? "default" : "outline"}
                  onClick={() => handleModeChange("pomodoro")}
                >
                  Pomodoro
                </Button>
                <Button
                  variant={timerMode === "shortBreak" ? "default" : "outline"}
                  onClick={() => handleModeChange("shortBreak")}
                >
                  Pausa Curta
                </Button>
                <Button
                  variant={timerMode === "longBreak" ? "default" : "outline"}
                  onClick={() => handleModeChange("longBreak")}
                >
                  Pausa Longa
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8">
                {/* Timer Circle */}
                <div className="relative w-52 h-52 mb-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-muted-foreground/20"
                    />
                    
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      className={`${
                        timerMode === "pomodoro"
                          ? "text-primary"
                          : "text-primary/80"
                      } transition-all duration-1000`}
                      strokeDasharray={circumference}
                      strokeDashoffset={dashoffset}
                      transform="rotate(-90, 50, 50)"
                    />
                  </svg>
                  
                  {/* Time display */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                </div>
                
                {/* Timer controls */}
                <div className="flex gap-4">
                  {timerState === "running" ? (
                    <Button size="lg" onClick={pauseTimer}>
                      <Pause className="mr-2 h-4 w-4" />
                      Pausar
                    </Button>
                  ) : (
                    <Button size="lg" onClick={startTimer}>
                      <Play className="mr-2 h-4 w-4" />
                      {timerState === "paused" ? "Continuar" : "Iniciar"}
                    </Button>
                  )}
                  
                  <Button size="lg" variant="outline" onClick={resetTimer}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reiniciar
                  </Button>
                </div>
              </div>
              
              <p className="text-center text-muted-foreground mt-4">
                Pomodoros completados hoje: {pomodoroCount}
              </p>
            </CardContent>
          </Card>
          
          {/* Settings Card */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tarefa Atual</CardTitle>
                <CardDescription>
                  Selecione uma tarefa ou projeto para este pomodoro
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tarefa</label>
                  <Select
                    value={selectedTaskId}
                    onValueChange={setSelectedTaskId}
                    disabled={timerState === "running"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma tarefa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem tarefa específica</SelectItem>
                      {tasks
                        .filter(task => !task.completed)
                        .map(task => (
                          <SelectItem key={task.id} value={task.id}>
                            {task.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Projeto</label>
                  <Select
                    value={selectedProjectId}
                    onValueChange={setSelectedProjectId}
                    disabled={timerState === "running"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um projeto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem projeto específico</SelectItem>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            {/* Spotify Player */}
            <SpotifyPlayer />
            
            {/* Spotify Playlists */}
            <SpotifyPlaylists />
          </div>
        </div>
        
        {/* Tips Card */}
        <Card>
          <CardHeader>
            <CardTitle>Dicas para o Pomodoro</CardTitle>
            <CardDescription>Maximize sua produtividade com estas práticas</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 sm:grid-cols-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-1 text-primary" />
                <span>Foque em uma única tarefa durante cada pomodoro</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-1 text-primary" />
                <span>Elimine distrações como notificações</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-1 text-primary" />
                <span>Levante-se e alongue-se durante as pausas</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-1 text-primary" />
                <span>Após 4 pomodoros, faça uma pausa mais longa</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Pomodoro;
