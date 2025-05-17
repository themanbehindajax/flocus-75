
import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RotateCw, Maximize } from "lucide-react";
import { TimerModeSelector } from "@/components/pomodoro/TimerModeSelector";
import { usePomodoroStore } from "@/hooks/usePomodoroStore";
import { useAppStore } from "@/lib/store";
import { formatTime } from "@/hooks/usePomodoro";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuickAddTask } from "@/components/tasks/QuickAddTask";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "@/components/layout/PageTransition";

const Pomodoro = () => {
  const navigate = useNavigate();
  const { projects, tasks } = useAppStore();
  const [projectTasks, setProjectTasks] = useState<any[]>([]);
  const {
    isActive,
    isPaused,
    timerMode,
    timeRemaining,
    pomodoroCount,
    selectedTaskId,
    selectedProjectId,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerMode,
    setSelectedTaskId,
    setSelectedProjectId,
  } = usePomodoroStore();

  // Atualiza as tarefas do projeto selecionado
  useEffect(() => {
    if (selectedProjectId) {
      const filteredTasks = tasks.filter(
        task => task.projectId === selectedProjectId && !task.completed
      );
      setProjectTasks(filteredTasks);
    } else {
      setProjectTasks([]);
    }
  }, [selectedProjectId, tasks]);

  // Calcular o progresso com base no tempo atual e duração total
  const getDuration = () => {
    const settings = useAppStore.getState().settings;
    switch (timerMode) {
      case "pomodoro": return settings.pomodoroDuration * 60;
      case "shortBreak": return settings.shortBreakDuration * 60;
      case "longBreak": return settings.longBreakDuration * 60;
      default: return settings.pomodoroDuration * 60;
    }
  };
  
  const progress = 1 - timeRemaining / getDuration();
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);
  const timerState = isActive 
    ? (isPaused ? "paused" : "running") 
    : (timeRemaining === 0 ? "completed" : "idle");
  
  const handleTaskAdded = () => {
    // Atualizar a lista de tarefas quando uma nova tarefa for adicionada
    if (selectedProjectId) {
      const updatedTasks = useAppStore.getState().tasks.filter(
        task => task.projectId === selectedProjectId && !task.completed
      );
      setProjectTasks(updatedTasks);
    }
  };

  return (
    <AppLayout>
      <PageTransition>
        <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden flex flex-col items-center justify-center py-8 px-4">
          {/* Fundo com gradiente */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-700 to-primary-900 z-0" />
          
          {/* Conteúdo centralizado */}
          <div className="relative z-10 w-full max-w-3xl mx-auto text-white">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                O que você quer focar hoje?
              </h1>
              <p className="text-xl opacity-80">
                "It's never too late for a fresh start"
              </p>
            </motion.div>
            
            {/* Seletor de modo do timer */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <TimerModeSelector 
                currentMode={timerMode}
                onModeChange={setTimerMode}
                className="justify-center"
              />
            </motion.div>
            
            {/* Timer circular */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
              className="flex justify-center mb-8"
            >
              <div className="relative w-64 h-64">
                <svg className="w-full h-full" viewBox="0 0 256 256">
                  {/* Background circle */}
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="4"
                  />
                  
                  {/* Progress circle */}
                  <motion.circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="none"
                    stroke="white"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    transform="rotate(-90, 128, 128)"
                  />
                </svg>
                
                {/* Time display */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span 
                    key={timeRemaining}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-6xl md:text-7xl font-mono font-bold"
                  >
                    {formatTime(timeRemaining)}
                  </motion.span>
                </div>
              </div>
            </motion.div>
            
            {/* Controles do timer */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-center gap-4 mb-12"
            >
              {timerState === "running" ? (
                <Button 
                  size="lg" 
                  onClick={pauseTimer}
                  variant="secondary"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 rounded-full transition-all"
                >
                  Pausar
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={startTimer}
                  className="bg-white text-primary-700 hover:bg-white/90 px-8 rounded-full font-medium transition-all"
                >
                  {timerState === "paused" ? "Continuar" : "Iniciar"}
                </Button>
              )}
              
              <Button 
                size="lg" 
                variant="outline" 
                onClick={resetTimer}
                className="border-white/30 bg-transparent text-white hover:bg-white/10 rounded-full transition-all"
              >
                <RotateCw className="mr-2 h-4 w-4" />
                Reiniciar
              </Button>
            </motion.div>
            
            {/* Seletor de projetos e tarefas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="glass-effect p-6 max-w-md mx-auto"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Escolha seu foco</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium opacity-80">Projeto</label>
                    <Select
                      value={selectedProjectId || ""}
                      onValueChange={(value) => {
                        setSelectedProjectId(value || null);
                        setSelectedTaskId(null); // Reset task selection
                      }}
                      disabled={isActive && !isPaused}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Selecione um projeto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Sem projeto específico</SelectItem>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedProjectId && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium opacity-80">Tarefa</label>
                      <Select
                        value={selectedTaskId || ""}
                        onValueChange={(value) => setSelectedTaskId(value || null)}
                        disabled={isActive && !isPaused}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Selecione uma tarefa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Sem tarefa específica</SelectItem>
                          {projectTasks.map(task => (
                            <SelectItem key={task.id} value={task.id}>
                              {task.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Lista de tarefas do projeto */}
              {selectedProjectId && projectTasks.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Tarefas do projeto</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                    {projectTasks.map(task => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`p-2 rounded-lg transition-all cursor-pointer ${
                          selectedTaskId === task.id 
                            ? 'bg-white/20' 
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                        onClick={() => setSelectedTaskId(task.id)}
                      >
                        <p className="truncate text-sm">{task.title}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Adicionar tarefa rápida */}
              {selectedProjectId && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Adicionar tarefa</h3>
                  <QuickAddTask 
                    projectId={selectedProjectId} 
                    onTaskAdded={handleTaskAdded}
                  />
                </div>
              )}
              
              {/* Contador de pomodoros */}
              <div className="mt-6 text-center">
                <p className="text-sm opacity-70">
                  Pomodoros completados hoje: {pomodoroCount}
                </p>
              </div>
            </motion.div>
            
            {/* Botão de tela cheia */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="fixed bottom-4 right-4"
            >
              <Button
                size="icon"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => {
                  if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                  }
                }}
              >
                <Maximize size={16} />
              </Button>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
};

export default Pomodoro;
