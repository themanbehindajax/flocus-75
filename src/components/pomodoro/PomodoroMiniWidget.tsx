
import { useState, useEffect } from 'react';
import { formatTime } from '@/hooks/usePomodoro';
import { useAppStore } from '@/lib/store';
import { X, Maximize2, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocation, useNavigate } from 'react-router-dom';
import { showNotification } from '@/lib/notifications';
import { usePomodoroStore } from '@/hooks/usePomodoroStore';
import { motion, AnimatePresence } from 'framer-motion';

export const PomodoroMiniWidget = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  
  // Get pomodoro state from the new store
  const { 
    isActive, timeRemaining, timerMode,
    startTimer, pauseTimer, resetTimer
  } = usePomodoroStore();

  // Hide widget on pomodoro page
  useEffect(() => {
    setIsVisible(location.pathname !== '/pomodoro' && isActive);
  }, [location.pathname, isActive]);

  // Play sound and show notification when timer completes
  useEffect(() => {
    if (timeRemaining === 0 && isActive) {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(err => console.error('Could not play notification sound', err));
      
      const title = timerMode === 'pomodoro' ? 'Pomodoro concluído!' : 'Pausa concluída!';
      const message = timerMode === 'pomodoro' ? 'Hora de fazer uma pausa.' : 'Hora de voltar ao trabalho.';
      
      showNotification(title, message);
    }
  }, [timeRemaining, isActive, timerMode]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="pomodoro-widget"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          className={`fixed bottom-4 right-4 z-50 transition-all duration-300 shadow-lg bg-gradient-to-br from-primary-400 to-primary-700 text-white border-none ${
            isMinimized 
              ? 'w-auto p-2' 
              : 'w-64 p-4'
          }`}
        >
          {isMinimized ? (
            <div className="flex items-center gap-2">
              <motion.span 
                key={timeRemaining}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono font-bold"
              >
                {formatTime(timeRemaining)}
              </motion.span>
              <Button 
                onClick={() => setIsMinimized(false)} 
                size="sm" 
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Pomodoro Timer</h3>
                <div className="flex gap-1">
                  <Button 
                    onClick={() => setIsMinimized(true)} 
                    size="sm" 
                    variant="ghost"
                    className="h-6 w-6 p-0 text-white hover:bg-white/10"
                  >
                    <Maximize2 className="h-3 w-3" />
                  </Button>
                  <Button 
                    onClick={() => navigate('/pomodoro')} 
                    size="sm" 
                    variant="ghost"
                    className="h-6 w-6 p-0 text-white hover:bg-white/10"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <motion.span 
                  key={timeRemaining}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-2xl font-mono font-bold"
                >
                  {formatTime(timeRemaining)}
                </motion.span>
                <span className="text-xs text-white/80 capitalize">
                  {timerMode === 'pomodoro' ? 'Focus' : timerMode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                </span>
              </div>
              
              <div className="flex justify-center gap-2">
                <motion.div whileTap={{ scale: 0.95 }} className="w-full">
                  {isActive ? (
                    <Button onClick={pauseTimer} size="sm" variant="outline" className="w-full border-white/30 bg-transparent text-white hover:bg-white/10">
                      <Pause className="h-4 w-4 mr-1" /> Pausar
                    </Button>
                  ) : (
                    <Button onClick={startTimer} size="sm" variant="outline" className="w-full border-white/30 bg-transparent text-white hover:bg-white/10">
                      <Play className="h-4 w-4 mr-1" /> Iniciar
                    </Button>
                  )}
                </motion.div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
