
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, CheckCircle, Target, Zap } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { usePomodoroStore } from "@/hooks/usePomodoroStore";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Helper function to get greeting based on time of day
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

// Frases motivacionais
const motivationalPhrases = [
  "Foco no processo, não no resultado.",
  "Pequenos progressos levam a grandes conquistas.",
  "Uma tarefa por vez, um pomodoro por vez.",
  "A produtividade começa com propósito.",
  "Organize seu dia, simplifique sua vida.",
  "Clareza precede o sucesso.",
  "Não evite tarefas difíceis, comece por elas.",
  "Celebre cada pequena vitória.",
  "Consistência supera intensidade."
];

export const TodayPriorities = () => {
  const { profile, tasks, getTodaysTasks, getCompletedTasksToday } = useAppStore();
  const { totalSessionsToday } = usePomodoroStore();
  const navigate = useNavigate();
  const [motivationalPhrase, setMotivationalPhrase] = useState("");
  
  // Randomly select a motivational phrase
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
    setMotivationalPhrase(motivationalPhrases[randomIndex]);
  }, []);
  
  // Get tasks for today
  const tasksToday = getTodaysTasks();
  const completedTasksToday = getCompletedTasksToday();
  
  const taskCompletionRate = tasksToday.length > 0
    ? Math.round((completedTasksToday.length / tasksToday.length) * 100)
    : 0;
  
  const MotionCardContent = motion(CardContent);
  
  return (
    <Card className="rounded-2xl border-border shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-medium">
              {getGreeting()}, <span className="text-primary">{profile.name}</span>
            </CardTitle>
          </div>
          <CardDescription className="mt-1.5 text-muted-foreground">
            {motivationalPhrase}
          </CardDescription>
        </motion.div>
      </CardHeader>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <MotionCardContent 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="grid gap-4 pt-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Tarefas do dia */}
            <div className="space-y-2 bg-background/40 rounded-xl p-4 border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Tarefas de hoje</span>
                </div>
                <span className="text-2xl font-semibold">{completedTasksToday.length}/{tasksToday.length}</span>
              </div>
              
              <Progress 
                value={taskCompletionRate} 
                className="h-2 rounded-full bg-primary/20" 
              />
            </div>
            
            {/* Pomodoros */}
            <div className="space-y-2 bg-background/40 rounded-xl p-4 border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Pomodoros</span>
                </div>
                <span className="text-2xl font-semibold">{totalSessionsToday}</span>
              </div>
              
              <Progress 
                value={Math.min(totalSessionsToday * 10, 100)} 
                className="h-2 rounded-full bg-primary/20" 
              />
            </div>
            
            {/* Pontuação */}
            <div className="space-y-2 bg-background/40 rounded-xl p-4 border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Pontos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-semibold">{profile.points}</span>
                  <div className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full",
                    "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
                    "flex items-center"
                  )}>
                    <Calendar className="w-3 h-3 mr-0.5" />
                    {profile.streak}d
                  </div>
                </div>
              </div>
              
              <Progress 
                value={Math.min(profile.points / 10, 100)} 
                className="h-2 rounded-full bg-primary/20" 
              />
            </div>
          </div>
        </MotionCardContent>
        
        <CardFooter className="pt-3 pb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2" 
            onClick={() => navigate('/tasks')}
          >
            Ver todas as tarefas
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </motion.div>
    </Card>
  );
};
