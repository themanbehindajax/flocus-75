
import { useState, useEffect } from 'react';
import { formatTime } from '@/hooks/usePomodoro';
import { useAppStore } from '@/lib/store';
import { X, Maximize2, Play, Pause, RotateCcw } from 'lucide-react';
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
  const [isDragging, setIsDragging] = useState(false);
  
  // Get pomodoro state from store
  const { 
    isActive, isPaused, timeRemaining, timerMode,
    startTimer, pauseTimer, resetTimer
  } = usePomodoroStore();
  
  // Compute timerState from isActive and isPaused
  const timerState = isActive 
    ? (isPaused ? "paused" : "running") 
    : (timeRemaining === 0 ? "completed" : "idle");

  // Hide widget on pomodoro page
  useEffect(() => {
    setIsVisible(location.pathname !== '/pomodoro' && isActive);
  }, [location.pathname, isActive]);

  // Setup browser notification permissions
  useEffect(() => {
    // Request notification permissions
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  // Create a title-based notification to make it visible even when tab is not active
  useEffect(() => {
    if (!isActive) return;
    
    // Update document title when timer is active
    const originalTitle = document.title;
    
    const updateTitle = () => {
      if (document.hidden && isActive) {
        document.title = `${formatTime(timeRemaining)} - Flocus`;
      } else {
        document.title = originalTitle;
      }
    };
    
    // Update title initially
    updateTitle();
    
    // Set up event listeners for visibility change
    document.addEventListener('visibilitychange', updateTitle);
    
    // Set up timer to update title
    const titleInterval = setInterval(updateTitle, 1000);
    
    // Play sound and show notification when timer completes
    if (timeRemaining === 0) {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(err => console.error('Could not play notification sound', err));
      
      const title = timerMode === 'pomodoro' ? 'Pomodoro concluído!' : 'Pausa concluída!';
      const message = timerMode === 'pomodoro' ? 'Hora de fazer uma pausa.' : 'Hora de voltar ao trabalho.';
      
      showNotification(title, message);
      
      if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
          body: message,
          icon: '/favicon.ico'
        });
        
        notification.onclick = () => {
          window.focus();
          navigate('/pomodoro');
          notification.close();
        };
      }
    }
    
    return () => {
      document.removeEventListener('visibilitychange', updateTitle);
      clearInterval(titleInterval);
      document.title = originalTitle;
    };
  }, [timeRemaining, isActive, timerMode, navigate]);

  // Allow dragging only when not minimized
  const handleDragStart = () => {
    if (!isMinimized) {
      setIsDragging(true);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  const handleMaximize = () => {
    setIsMinimized(false);
  };
  
  const handleMinimize = () => {
    setIsMinimized(true);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-16 right-16 z-50">
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.div
            key="mini-widget"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Card 
              className="bg-blue-500/70 backdrop-blur-xl shadow-lg border-white/20 rounded-3xl"
            >
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="font-mono font-bold text-white">
                  {formatTime(timeRemaining)}
                </span>
                <Button 
                  onClick={handleMaximize} 
                  size="sm" 
                  variant="ghost"
                  className="text-white hover:bg-white/10 h-7 w-7 p-0"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="expanded-widget"
            drag
            dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
            dragElastic={0.1}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <Card 
              className="w-64 p-4 bg-blue-500/70 backdrop-blur-xl shadow-lg border-white/20 rounded-3xl"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-white">Pomodoro Timer</h3>
                  <div className="flex gap-1">
                    <Button 
                      onClick={handleMinimize} 
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
                  <span className="text-2xl font-mono font-bold text-white">
                    {formatTime(timeRemaining)}
                  </span>
                  <span className="text-xs text-white/80 capitalize">
                    {timerMode === 'pomodoro' ? 'Focus' : timerMode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                  </span>
                </div>
                
                <div className="flex justify-center gap-2">
                  {timerState === "running" ? (
                    <Button onClick={pauseTimer} size="sm" variant="outline" className="w-full border-white/30 bg-transparent text-white hover:bg-white/10">
                      <Pause className="h-4 w-4 mr-1" /> Pausar
                    </Button>
                  ) : (
                    <Button onClick={startTimer} size="sm" variant="outline" className="w-full border-white/30 bg-transparent text-white hover:bg-white/10">
                      <Play className="h-4 w-4 mr-1" /> {timerState === "paused" ? "Continuar" : "Iniciar"}
                    </Button>
                  )}
                  <Button onClick={resetTimer} size="sm" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
