
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface TimerControlsProps {
  timerState: "idle" | "running" | "paused" | "break" | "completed";
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  timerState,
  onStart,
  onPause,
  onReset,
}) => {
  return (
    <div className="flex gap-4">
      {timerState === "running" ? (
        <Button size="lg" onClick={onPause}>
          <Pause className="mr-2 h-4 w-4" />
          Pausar
        </Button>
      ) : (
        <Button size="lg" onClick={onStart}>
          <Play className="mr-2 h-4 w-4" />
          {timerState === "paused" ? "Continuar" : "Iniciar"}
        </Button>
      )}
      
      <Button size="lg" variant="outline" onClick={onReset}>
        <RotateCcw className="mr-2 h-4 w-4" />
        Reiniciar
      </Button>
    </div>
  );
};
