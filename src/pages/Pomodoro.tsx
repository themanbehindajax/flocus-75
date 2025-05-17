
import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RotateCw, Maximize } from "lucide-react";
import { TimerModeSelector } from "@/components/pomodoro/TimerModeSelector";
import { usePomodoroStore } from "@/hooks/usePomodoroStore";
import { useAppStore } from "@/lib/store";
import { formatTime } from "@/hooks/usePomodoro";
import { TaskSelection } from "@/components/pomodoro/TaskSelection";
import { QuickAddTask } from "@/components/tasks/QuickAddTask";
import { PageTransition } from "@/components/layout/PageTransition";

const Pomodoro = () => {
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
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 z-0" />
          
          {/* Conteúdo centralizado */}
          <div className="relative z-10 w-full max-w-5xl mx-auto text-white">
            {/* Layout em duas colunas para desktop */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-center">
              {/* Coluna da esquerda - Timer */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center w-full md:w-1/2"
              >
                {/* Seletor de modo do timer */}
                <div className="w-full mb-6">
                  <TimerModeSelector 
                    currentMode={timerMode}
                    onModeChange={setTimerMode}
                    className="justify-center"
                  />
                </div>
                
                {/* Timer circular */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                  className="flex justify-center mb-6 relative"
                >
                  <div className="relative w-72 h-72">
                    <svg className="w-full h-full" viewBox="0 0 256 256">
                      {/* Background circle */}
                      <circle
                        cx="128"
                        cy="128"
                        r="120"
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="6"
                      />
                      
                      {/* Progress circle */}
                      <motion.circle
                        cx="128"
                        cy="128"
                        r="120"
                        fill="none"
                        stroke="white"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        transform="rotate(-90, 128, 128)"
                      />
                    </svg>
                    
                    {/* Time display - without animation */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-6xl md:text-7xl font-mono font-bold mb-1">
                        {formatTime(timeRemaining)}
                      </span>
                      <span className="text-sm font-medium uppercase tracking-wider opacity-70">
                        {timerMode === 'pomodoro' ? 'Concentração' : timerMode === 'shortBreak' ? 'Pausa Curta' : 'Pausa Longa'}
                      </span>
                    </div>
                  </div>
                </motion.div>
                
                {/* Controles do timer */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex justify-center gap-4 mb-6"
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
                      className="bg-white text-blue-700 hover:bg-white/90 px-10 rounded-full font-medium transition-all shadow-lg"
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
                
                {/* Contador de pomodoros */}
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                  Pomodoros completados hoje: {pomodoroCount}
                </div>
              </motion.div>
              
              {/* Coluna da direita - Projetos e Tarefas */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-2xl w-full md:w-1/2"
              >
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">Escolha seu foco</h2>
                  
                  <TaskSelection
                    selectedTaskId={selectedTaskId}
                    selectedProjectId={selectedProjectId}
                    onTaskChange={(value) => setSelectedTaskId(value === "none" ? null : value)}
                    onProjectChange={(value) => {
                      setSelectedProjectId(value === "none" ? null : value);
                      setSelectedTaskId(null); // Reset task selection
                    }}
                    disabled={isActive && !isPaused}
                  />
                </div>
                
                {/* Lista de tarefas do projeto - limitada a 3 visíveis */}
                {selectedProjectId && projectTasks.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <span>Tarefas do projeto</span>
                      <span className="ml-2 bg-white/20 text-xs rounded-full px-2 py-0.5">{projectTasks.length}</span>
                    </h3>
                    <div className="space-y-2 h-[120px] overflow-y-auto pr-2 custom-scrollbar rounded-xl">
                      {projectTasks.slice(0, 3).map(task => (
                        <div
                          key={task.id}
                          className={`p-3 rounded-lg transition-all cursor-pointer ${
                            selectedTaskId === task.id 
                              ? 'bg-white/20 shadow-inner' 
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                          onClick={() => setSelectedTaskId(task.id)}
                        >
                          <p className="truncate text-sm">{task.title}</p>
                        </div>
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
              </motion.div>
            </div>
            
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
