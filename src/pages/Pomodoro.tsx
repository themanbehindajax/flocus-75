
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { usePomodoro } from "@/hooks/usePomodoro";
import { TimerDisplay } from "@/components/pomodoro/TimerDisplay";
import { TimerControls } from "@/components/pomodoro/TimerControls";
import { TimerModeSelector } from "@/components/pomodoro/TimerModeSelector";
import { TaskSelection } from "@/components/pomodoro/TaskSelection";
import { PomodoroTips } from "@/components/pomodoro/PomodoroTips";
import { SpotifyPlayer } from "@/components/spotify/SpotifyPlayer";
import { SpotifyPlaylists } from "@/components/spotify/SpotifyPlaylists";

const Pomodoro = () => {
  const {
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
  } = usePomodoro();

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
                onModeChange={handleModeChange}
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
                  selectedTaskId={selectedTaskId}
                  selectedProjectId={selectedProjectId}
                  onTaskChange={setSelectedTaskId}
                  onProjectChange={setSelectedProjectId}
                  disabled={timerState === "running"}
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
