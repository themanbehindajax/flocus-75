
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
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Get pomodoro state from store
  const { 
    isActive, timeRemaining, timerMode,
    startTimer, pauseTimer, resetTimer
  } = usePomodoroStore();

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

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="pomodoro-widget"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        drag={!isMinimized}
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="fixed z-50"
        style={{
          bottom: isMinimized ? '4rem' : 'auto',
          right: isMinimized ? '4rem' : 'auto',
          cursor: isDragging ? 'grabbing' : (isMinimized ? 'default' : 'grab')
        }}
      >
        <Card 
          className="transition-all duration-300 shadow-lg backdrop-blur-xl border-white/20"
          style={{
            width: isMinimized ? 'auto' : '16rem',
            padding: isMinimized ? '0.5rem' : '1rem',
            borderRadius: '2rem',
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)'
          }}
        >
          {isMinimized ? (
            <div className="flex items-center gap-2 px-2">
              <span className="font-mono font-bold text-white">
                {formatTime(timeRemaining)}
              </span>
              <Button 
                onClick={() => setIsMinimized(false)} 
                size="sm" 
                variant="ghost"
                className="text-white hover:bg-white/10 h-7 w-7 p-0"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-white">Pomodoro Timer</h3>
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
                <span className="text-2xl font-mono font-bold text-white">
                  {formatTime(timeRemaining)}
                </span>
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
