
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
  
  // Get pomodoro state from store
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

  // Update the selected project's tasks
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

  // Calculate progress based on current time and total duration
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
    // Update the task list when a new task is added
    if (selectedProjectId) {
      const updatedTasks = useAppStore.getState().tasks.filter(
        task => task.projectId === selectedProjectId && !task.completed
      );
      setProjectTasks(updatedTasks);
    }
  };

  // Handler to mark task as completed
  const handleCompleteTask = (taskId: string) => {
    toggleTaskCompletion(taskId);
  };

  const selectedTask = tasks.find(task => task.id === selectedTaskId);

  return (
    <AppLayout>
      <PageTransition>
        <div className="relative min-h-screen flex flex-col overflow-hidden">
          {/* Background with gradient that extends to extreme left */}
          <div className="absolute inset-0 -left-[100vw] -right-[100vw] bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 z-0" />
          
          {/* Content vertically and horizontally centered */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-4 py-12">
            <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
              {/* Left Column - Timer */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center w-full md:w-1/2"
              >
                {/* Timer mode selector */}
                <div className="w-full mb-6">
                  <TimerModeSelector 
                    currentMode={timerMode}
                    onModeChange={setTimerMode}
                    className="justify-center"
                  />
                </div>
                
                {/* Circular timer */}
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
                
                {/* Timer controls */}
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
                
                {/* Pomodoro counter */}
                <div className="bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-white">
                  Pomodoros completed today: {pomodoroCount}
                </div>
              </motion.div>
              
              {/* Right Column - Projects and Tasks */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="backdrop-blur-xl bg-white/5 border border-white/20 p-6 rounded-3xl w-full md:w-1/2 shadow-xl"
              >
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4 text-white">Choose your focus</h2>
                  
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
                
                {/* Project task list */}
                {selectedProjectId && projectTasks.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 flex items-center text-white">
                      <span>Project tasks</span>
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
                
                {/* Current selected task */}
                {selectedTaskId && selectedTask && (
                  <div className="mb-6 p-3 rounded-xl bg-white/5 backdrop-blur-md">
                    <h3 className="text-sm font-medium text-white mb-1">Current task</h3>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">{selectedTask.title}</p>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() => handleCompleteTask(selectedTaskId)}
                        title="Mark as completed"
                      >
                        <CheckCircle2 className={`h-5 w-5 ${selectedTask.completed ? 'fill-green-500 text-white' : ''}`} />
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Add quick task */}
                {selectedProjectId && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-white">Add task</h3>
                    <QuickAddTask 
                      projectId={selectedProjectId} 
                      onTaskAdded={handleTaskAdded}
                    />
                  </div>
                )}
              </motion.div>
            </div>
            
            {/* Fullscreen button */}
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
        </div>
      </PageTransition>
    </AppLayout>
  );
};

export default Pomodoro;
