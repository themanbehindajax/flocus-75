
import React, { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TimerDisplay } from "@/components/pomodoro/TimerDisplay";
import { TimerControls } from "@/components/pomodoro/TimerControls";
import { TimerModeSelector } from "@/components/pomodoro/TimerModeSelector";
import { TaskSelection } from "@/components/pomodoro/TaskSelection";
import { PomodoroTips } from "@/components/pomodoro/PomodoroTips";
import { SpotifyPlayer } from "@/components/spotify/SpotifyPlayer";
import { SpotifyPlaylists } from "@/components/spotify/SpotifyPlaylists";
import { usePomodoroStore } from "@/hooks/usePomodoroStore";
import { useAppStore } from "@/lib/store";

const Pomodoro = () => {
  const {
    isActive,
    isPaused,
    timerMode,
    timeRemaining,
    pomodoroCount,
    selectedTaskId,
    selectedProjectId,
    setSelectedTaskId,
    setSelectedProjectId,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerMode
  } = usePomodoroStore();

  const { settings } = useAppStore();
  
  // Calculate the progress based on current time and total duration
  const getDuration = () => {
    switch (timerMode) {
      case "pomodoro": return settings.pomodoroDuration * 60;
      case "shortBreak": return settings.shortBreakDuration * 60;
      case "longBreak": return settings.longBreakDuration * 60;
      default: return settings.pomodoroDuration * 60;
    }
  };
  
  const progress = 1 - timeRemaining / getDuration();
  
  // Set document title to show the timer
  useEffect(() => {
    const formatTimeForTitle = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? '0' + secs : secs}`;
    };
    
    if (isActive && !isPaused) {
      document.title = `${formatTimeForTitle(timeRemaining)} - ${timerMode === 'pomodoro' ? '🍅' : '☕️'} Flocus`;
    } else {
      document.title = 'Flocus - Pomodoro Timer';
    }
    
    return () => {
      document.title = 'Flocus';
    };
  }, [timeRemaining, isActive, isPaused, timerMode]);

  const timerState = isActive 
    ? (isPaused ? "paused" : "running") 
    : (timeRemaining === 0 ? "completed" : "idle");

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
              <TimerModeSelector 
                currentMode={timerMode}
                onModeChange={setTimerMode}
              />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8">
                {/* Timer Circle */}
                <TimerDisplay 
                  timeRemaining={timeRemaining}
                  progress={progress}
                  timerMode={timerMode}
                />
                
                {/* Timer controls */}
                <TimerControls 
                  timerState={timerState}
                  onStart={startTimer}
                  onPause={pauseTimer}
                  onReset={resetTimer}
                />
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
              <CardContent>
                <TaskSelection 
                  selectedTaskId={selectedTaskId || ""}
                  selectedProjectId={selectedProjectId || ""}
                  onTaskChange={(id) => setSelectedTaskId(id || null)}
                  onProjectChange={(id) => setSelectedProjectId(id || null)}
                  disabled={isActive && !isPaused}
                />
              </CardContent>
            </Card>
            
            {/* Spotify Player */}
            <SpotifyPlayer />
            
            {/* Spotify Playlists */}
            <SpotifyPlaylists />
          </div>
        </div>
        
        {/* Tips Card */}
        <PomodoroTips />
      </div>
    </AppLayout>
  );
};

export default Pomodoro;
