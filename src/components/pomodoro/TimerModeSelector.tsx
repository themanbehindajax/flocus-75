
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface TimerModeSelectorProps {
  currentMode: "pomodoro" | "shortBreak" | "longBreak";
  onModeChange: (mode: "pomodoro" | "shortBreak" | "longBreak") => void;
  className?: string;
}

export const TimerModeSelector: React.FC<TimerModeSelectorProps> = ({
  currentMode,
  onModeChange,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <ModeButton 
        isActive={currentMode === "pomodoro"}
        onClick={() => onModeChange("pomodoro")}
        label="Focus"
      />
      <ModeButton 
        isActive={currentMode === "shortBreak"}
        onClick={() => onModeChange("shortBreak")}
        label="Short Break"
      />
      <ModeButton 
        isActive={currentMode === "longBreak"}
        onClick={() => onModeChange("longBreak")}
        label="Long Break"
      />
    </div>
  );
};

interface ModeButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
}

const ModeButton: React.FC<ModeButtonProps> = ({ isActive, onClick, label }) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`relative overflow-hidden px-8 rounded-full transition-all duration-300 ${
        isActive 
          ? "bg-white text-primary-700 hover:bg-white/90"
          : "bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      {isActive && (
        <motion.div 
          layoutId="activeIndicator"
          className="absolute inset-0 bg-white -z-10"
          initial={false}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30 
          }}
        />
      )}
      {label}
    </Button>
  );
};
