
import { useState, useEffect } from 'react';
import { formatTime } from '@/hooks/usePomodoro';
import { useAppStore } from '@/lib/store';
import { X, Maximize2, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendPomodoroNotification } from '@/lib/notifications';
import { usePomodoroStore } from '@/hooks/usePomodoroStore';

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
      
      sendPomodoroNotification(title, message);
    }
  }, [timeRemaining, isActive, timerMode]);

  if (!isVisible) return null;

  return (
    <Card 
      className={`fixed z-50 transition-all duration-300 shadow-lg ${
        isMinimized 
          ? 'bottom-4 right-4 w-auto p-2' 
          : 'bottom-4 right-4 w-64 p-4'
      }`}
    >
      {isMinimized ? (
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold">
            {formatTime(timeRemaining)}
          </span>
          <Button 
            onClick={() => setIsMinimized(false)} 
            size="sm" 
            variant="ghost"
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
                className="h-6 w-6 p-0"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
              <Button 
                onClick={() => navigate('/pomodoro')} 
                size="sm" 
                variant="ghost"
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-2xl font-mono font-bold">
              {formatTime(timeRemaining)}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {timerMode}
            </span>
          </div>
          
          <div className="flex justify-center gap-2">
            {isActive ? (
              <Button onClick={pauseTimer} size="sm" variant="outline" className="w-full">
                <Pause className="h-4 w-4 mr-1" /> Pausar
              </Button>
            ) : (
              <Button onClick={startTimer} size="sm" variant="outline" className="w-full">
                <Play className="h-4 w-4 mr-1" /> Iniciar
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
