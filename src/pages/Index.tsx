
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppStore } from "@/lib/store";
import {
  Calendar,
  CheckCircle,
  Clock,
  FolderKanban,
  ListTodo,
  Trophy,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { TodayPriorities } from "@/components/home/TodayPriorities";
import { requestNotificationPermission } from "@/lib/notifications";
import { toast } from "sonner";

const Index = () => {
  const {
    tasks,
    projects,
    profile,
    pomodoroSessions,
    updateProfile,
    toggleTaskCompletion,
  } = useAppStore();

  const [quickTasks, setQuickTasks] = useState<string[]>([]);

  // Function to get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Function to format weekday with first letter capitalized
  const formatWeekday = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    };
    
    // Get formatted date string in English
    const dateStr = date.toLocaleDateString('en-US', options);
    
    // Capitalize first letter (already done in English format)
    return dateStr;
  };

  useEffect(() => {
    // Setup user profile on first visit - only if name is exactly "User"
    if (profile.name === "Usuário") {
      const username = localStorage.getItem("username");
      if (username && username !== "Usuário") {
        updateProfile({ name: username });
      }
    }

    // Request notification permission
    requestNotificationPermission();

    // Find quick tasks (only those explicitly marked as quick)
    const quickTaskIds = tasks
      .filter(task => 
        !task.completed && 
        task.isQuick === true
      )
      .slice(0, 5)
      .map(task => task.id);
    
    setQuickTasks(quickTaskIds);
    
    console.log("Index - Profile:", profile);
    console.log("Index - Profile points:", profile.points);
  }, [tasks, profile.name, updateProfile]); 

  // Statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const taskCompletion = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const todayCompletedTasks = tasks.filter(task => 
    task.completed && 
    new Date(task.updatedAt).toDateString() === new Date().toDateString()
  ).length;
  
  const todayPomodoros = pomodoroSessions.filter(session => 
    session.completed && 
    new Date(session.endTime).toDateString() === new Date().toDateString()
  ).length;
  
  const todayPoints = (todayCompletedTasks * 5) + (todayPomodoros * 10);
  const totalPoints = profile.points;
  const totalPomodoros = profile.totalPomodorosCompleted;

  // New function to handle completing quick tasks
  const handleCompleteQuickTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toggleTaskCompletion(taskId);
      
      toast.success(`Task "${task.title}" completed!`, {
        duration: 2000,
        position: "bottom-right",
      });
      
      // Remove the task from the quick tasks list to update UI immediately
      setQuickTasks(prev => prev.filter(id => id !== taskId));
    }
  };
  
  console.log("Index - Total points calculated:", totalPoints);
  console.log("Index - Today points calculated:", todayPoints);

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight animate-fade-in">
              {getGreeting()}, {profile.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              {formatWeekday(new Date())}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current streak</p>
              <p className="text-2xl font-bold text-primary">{profile.streak} days</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-primary animate-pulse-light" />
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{completedTasks}/{totalTasks}</div>
                <div className="flex items-center">
                  <Progress value={taskCompletion} className="h-2 w-16" />
                  <span className="ml-2 text-sm">{taskCompletion}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Points Today
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div className="text-2xl font-bold">{todayPoints}</div>
              <div className="flex items-center text-muted-foreground text-sm">
                <span>Total: {totalPoints}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pomodoros Today
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div className="text-2xl font-bold">{todayPomodoros}</div>
              <div className="flex items-center text-muted-foreground text-sm">
                <Clock className="h-4 w-4 mr-1" />
                <span>Total: {totalPomodoros}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Ivy Lee Method */}
          <div className="space-y-6 lg:col-span-2">
            {/* Today's Priorities - Enhanced Version */}
            <TodayPriorities />
            
            {/* Quick Tasks Section */}
            <div>
              <h2 className="text-xl font-bold mb-4">Quick Tasks</h2>
              
              {quickTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickTasks.map((taskId) => {
                    const task = tasks.find(t => t.id === taskId);
                    if (!task) return null;
                    
                    return (
                      <Card key={task.id} className="hover-card transition-all duration-200 hover:shadow-md">
                        <CardContent className="p-4 flex justify-between items-center">
                          <div className="flex items-center">
                            <Zap className="h-5 w-5 text-amber-500 mr-3" />
                            <span>{task.title}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-full h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                            onClick={() => handleCompleteQuickTask(task.id)}
                            aria-label="Complete task"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="text-center py-6">
                  <CardContent>
                    <p className="text-muted-foreground">
                      No quick tasks found. Add tasks to get started.
                    </p>
                    <Button variant="outline" className="mt-4" asChild>
                      <Link to="/tasks">Add tasks</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {/* Right Column - Projects & Shortcuts */}
          <div className="space-y-6">
            {/* Projects Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Your Projects</h2>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/projects">View all</Link>
                </Button>
              </div>
              
              <div className="space-y-3">
                {projects.slice(0, 3).map(project => (
                  <Card key={project.id} className="hover-card">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {project.tasks.length} tasks
                          </p>
                        </div>
                        <Button size="sm" variant="ghost" asChild>
                          <Link to={`/projects/${project.id}`}>
                            <Calendar className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      
                      {project.tasks.length > 0 && (
                        <Progress 
                          className="h-1 mt-3" 
                          value={
                            (tasks
                              .filter(task => project.tasks.includes(task.id) && task.completed)
                              .length / project.tasks.length) * 100
                          } 
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {projects.length === 0 && (
                  <Card className="text-center p-6">
                    <FolderKanban className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="font-medium">No projects</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create your first project
                    </p>
                    <Button variant="outline" className="mt-4" asChild>
                      <Link to="/projects">Create project</Link>
                    </Button>
                  </Card>
                )}
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h2 className="text-xl font-bold mb-4">Quick Access</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <Card className="hover-card">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Clock className="h-6 w-6 mb-2" />
                    <h3 className="font-medium">Pomodoro</h3>
                    <Button variant="ghost" size="sm" className="mt-2" asChild>
                      <Link to="/pomodoro">Start</Link>
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="hover-card">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <ListTodo className="h-6 w-6 mb-2" />
                    <h3 className="font-medium">Tasks</h3>
                    <Button variant="ghost" size="sm" className="mt-2" asChild>
                      <Link to="/tasks">View</Link>
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="hover-card">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Calendar className="h-6 w-6 mb-2" />
                    <h3 className="font-medium">Calendar</h3>
                    <Button variant="ghost" size="sm" className="mt-2" asChild>
                      <Link to="/calendar">View</Link>
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="hover-card">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Trophy className="h-6 w-6 mb-2" />
                    <h3 className="font-medium">Achievements</h3>
                    <Button variant="ghost" size="sm" className="mt-2" asChild>
                      <Link to="/achievements">View</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
