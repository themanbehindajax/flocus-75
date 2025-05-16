
import React from "react";
import { Button } from "@/components/ui/button";

interface TimerModeSelectorProps {
  currentMode: "pomodoro" | "shortBreak" | "longBreak";
  onModeChange: (mode: "pomodoro" | "shortBreak" | "longBreak") => void;
}

export const TimerModeSelector: React.FC<TimerModeSelectorProps> = ({
  currentMode,
  onModeChange,
}) => {
  return (
    <div className="flex justify-center gap-2 mt-4">
      <Button
        variant={currentMode === "pomodoro" ? "default" : "outline"}
        onClick={() => onModeChange("pomodoro")}
      >
        Pomodoro
      </Button>
      <Button
        variant={currentMode === "shortBreak" ? "default" : "outline"}
        onClick={() => onModeChange("shortBreak")}
      >
        Pausa Curta
      </Button>
      <Button
        variant={currentMode === "longBreak" ? "default" : "outline"}
        onClick={() => onModeChange("longBreak")}
      >
        Pausa Longa
      </Button>
    </div>
  );
};
