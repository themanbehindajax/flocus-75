
import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RotateCw, Maximize, CheckCircle2 } from "lucide-react";
import { TimerModeSelector } from "@/components/pomodoro/TimerModeSelector";
import { usePomodoroStore } from "@/hooks/usePomodoroStore";
import { useAppStore } from "@/lib/store";
import { formatTime } from "@/hooks/usePomodoro";
import { TaskSelection } from "@/components/pomodoro/TaskSelection";
import { QuickAddTask } from "@/components/tasks/QuickAddTask";
import { PageTransition } from "@/components/layout/PageTransition";
import { TimerDisplay } from "@/components/pomodoro/TimerDisplay";
import { TimerControls } from "@/components/pomodoro/TimerControls";

const Pomodoro = () => {
  const { projects, tasks, completeTask, toggleTaskCompletion } = useAppStore();
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

  // Handler para marcar tarefa como concluída
  const handleCompleteTask = (taskId: string) => {
    toggleTaskCompletion(taskId);
  };

  const selectedTask = tasks.find(task => task.id === selectedTaskId);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 fixed top-0 left-0">
      <AppLayout>
        <PageTransition>
          <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-12 px-4">
            <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
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
                  className="flex justify-center mb-6"
                >
                  <TimerDisplay 
                    timeRemaining={timeRemaining} 
                    progress={progress} 
                    timerMode={timerMode} 
                  />
                </motion.div>
                
                {/* Controles do timer */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex justify-center mb-6"
                >
                  <TimerControls
                    timerState={timerState}
                    onStart={startTimer}
                    onPause={pauseTimer}
                    onReset={resetTimer}
                  />
                </motion.div>
                
                {/* Contador de pomodoros */}
                <div className="bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-white">
                  Pomodoros completados hoje: {pomodoroCount}
                </div>
              </motion.div>
              
              {/* Coluna da direita - Projetos e Tarefas */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="backdrop-blur-xl bg-white/5 border border-white/20 p-6 rounded-3xl w-full md:w-1/2 shadow-xl"
              >
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4 text-white">Escolha seu foco</h2>
                  
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
                
                {/* Lista de tarefas do projeto */}
                {selectedProjectId && projectTasks.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 flex items-center text-white">
                      <span>Tarefas do projeto</span>
                      <span className="ml-2 bg-white/10 text-xs rounded-full px-2 py-0.5">{projectTasks.length}</span>
                    </h3>
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar rounded-xl">
                      {projectTasks.map(task => (
                        <div
                          key={task.id}
                          className={`p-3 rounded-lg transition-all flex justify-between items-center ${
                            selectedTaskId === task.id 
                              ? 'bg-white/10 shadow-inner' 
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <p 
                            className={`truncate text-sm flex-1 cursor-pointer text-white ${task.completed ? 'line-through opacity-60' : ''}`}
                            onClick={() => setSelectedTaskId(task.id)}
                          >
                            {task.title}
                          </p>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                            onClick={() => handleCompleteTask(task.id)}
                          >
                            <CheckCircle2 className={`h-5 w-5 ${task.completed ? 'fill-green-500 text-white' : ''}`} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Tarefa atual selecionada */}
                {selectedTaskId && selectedTask && (
                  <div className="mb-6 p-3 rounded-xl bg-white/5 backdrop-blur-md">
                    <h3 className="text-sm font-medium text-white mb-1">Tarefa atual</h3>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">{selectedTask.title}</p>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() => handleCompleteTask(selectedTaskId)}
                        title="Marcar como concluída"
                      >
                        <CheckCircle2 className={`h-5 w-5 ${selectedTask.completed ? 'fill-green-500 text-white' : ''}`} />
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Adicionar tarefa rápida */}
                {selectedProjectId && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-white">Adicionar tarefa</h3>
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
                className="bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-full"
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
        </PageTransition>
      </AppLayout>
    </div>
  );
};

export default Pomodoro;
