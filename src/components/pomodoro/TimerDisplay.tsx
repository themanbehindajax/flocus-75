
import React from "react";
import { formatTime } from "@/hooks/usePomodoro";
import { motion } from "framer-motion";

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

  // Get the appropriate text based on timer mode
  const getModeText = () => {
    switch(timerMode) {
      case "pomodoro": return "FOCUS";
      case "shortBreak": return "SHORT BREAK";
      case "longBreak": return "LONG BREAK";
      default: return "FOCUS";
    }
  };

  return (
    <div className="relative w-64 h-64 mb-6 flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-white/20"
        />
        
        {/* Progress circle with improved animation */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="text-white"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashoffset }}
          transition={{ 
            duration: 0.5, 
            ease: "linear",
            // Remove any springiness to avoid visual jitter
            type: "tween" 
          }}
          transform="rotate(-90, 50, 50)"
        />
      </svg>
      
      {/* Time display with smooth updating */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          key={timeRemaining}
          initial={{ opacity: 0.8, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="text-5xl font-mono font-bold text-white"
        >
          {formatTime(timeRemaining)}
        </motion.span>
        <span className="text-xs font-medium text-white/70 uppercase tracking-wider mt-2">
          {getModeText()}
        </span>
      </div>
    </div>
  );
};
