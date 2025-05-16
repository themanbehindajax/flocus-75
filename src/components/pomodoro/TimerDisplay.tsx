
import React from "react";
import { formatTime } from "@/hooks/usePomodoro";

interface TimerDisplayProps {
  timeRemaining: number;
  progress: number;
  timerMode: "pomodoro" | "shortBreak" | "longBreak";
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  timeRemaining, 
  progress,
  timerMode
}) => {
  const circumference = 2 * Math.PI * 45; // Circle radius is 45
  const dashoffset = circumference * (1 - progress);

  return (
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
  );
};
