
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="flex justify-center gap-4">
      <motion.div whileTap={{ scale: 0.95 }}>
        {timerState === "running" ? (
          <Button size="lg" onClick={onPause} className="relative overflow-hidden bg-blue-600 text-white hover:bg-blue-700 rounded-full font-medium shadow-lg">
            <Pause className="mr-2 h-4 w-4" />
            Pausar
            <motion.div
              className="absolute inset-0 bg-primary-600 -z-10"
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: [0, 1.5], opacity: [0.5, 0] }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: "easeOut",
                repeatDelay: 1
              }}
            />
          </Button>
        ) : (
          <Button size="lg" onClick={onStart} className="relative overflow-hidden bg-blue-600 text-white hover:bg-blue-700 rounded-full font-medium shadow-lg">
            <Play className="mr-2 h-4 w-4" />
            {timerState === "paused" ? "Continuar" : "Iniciar"}
            <motion.div
              className="absolute inset-0 bg-primary-600 -z-10"
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: [0, 1.5], opacity: [0.5, 0] }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: "easeOut",
                repeatDelay: 1
              }}
            />
          </Button>
        )}
      </motion.div>
      
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button size="lg" variant="outline" onClick={onReset} className="border-white/30 bg-transparent text-white hover:bg-white/10 rounded-full transition-all">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reiniciar
        </Button>
      </motion.div>
    </div>
  );
};
