
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

  // Hide widget on pomodoro page, but keep it visible when timer is active
  useEffect(() => {
    // Only show widget when we're not on the pomodoro page AND timer is or has been active
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
      
      const title = timerMode === 'pomodoro' ? 'Pomodoro completed!' : 'Break completed!';
      const message = timerMode === 'pomodoro' ? 'Time to take a break.' : 'Time to get back to work.';
      
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
  
  // Modified handler for reset - we need to keep the widget visible
  const handleReset = () => {
    resetTimer();
    // Don't change visibility state here
  };

  // Helper to get timer mode color
  const getTimerColor = () => {
    switch(timerMode) {
      case 'pomodoro': return 'from-blue-500/70 to-blue-600/70';
      case 'shortBreak': return 'from-green-500/70 to-green-600/70';
      case 'longBreak': return 'from-indigo-500/70 to-indigo-600/70';
      default: return 'from-blue-500/70 to-blue-600/70';
    }
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
              className={`bg-gradient-to-r ${getTimerColor()} backdrop-blur-xl shadow-lg border-white/20 rounded-3xl`}
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
              className={`w-64 p-4 bg-gradient-to-r ${getTimerColor()} backdrop-blur-xl shadow-lg border-white/20 rounded-3xl`}
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
                
                <motion.div 
                  className="w-full h-1 bg-white/20 rounded-full overflow-hidden mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div 
                    className="h-full bg-white"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(1 - timeRemaining / (timerMode === 'pomodoro' ? 1500 : 300)) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
                
                <div className="flex justify-center gap-2">
                  {timerState === "running" ? (
                    <Button 
                      onClick={pauseTimer} 
                      size="sm" 
                      variant="outline" 
                      className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                    >
                      <Pause className="h-4 w-4 mr-1" /> Pause
                    </Button>
                  ) : (
                    <Button 
                      onClick={startTimer} 
                      size="sm" 
                      variant="outline" 
                      className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                    >
                      <Play className="h-4 w-4 mr-1" /> {timerState === "paused" ? "Continue" : "Start"}
                    </Button>
                  )}
                  <Button 
                    onClick={handleReset} 
                    size="sm" 
                    variant="outline" 
                    className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                  >
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
