
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Trophy, Star, Zap, Clock, CheckCircle, Calendar, BarChart2, PieChart, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RPieChart, Pie, Cell } from 'recharts';

const Achievements = () => {
  const { profile, tasks, pomodoroSessions, projects, tags } = useAppStore();
  const [activeTab, setActiveTab] = useState<'achievements' | 'analytics'>('achievements');
  
  // Calculate achievements
  const achievementsList = [
    {
      id: "first-task",
      title: "Primeira Tarefa",
      description: "Completou sua primeira tarefa",
      icon: <CheckCircle className="h-6 w-6" />,
      progress: profile.totalTasksCompleted > 0 ? 100 : 0,
      isComplete: profile.totalTasksCompleted > 0,
    },
    {
      id: "task-master",
      title: "Mestre das Tarefas",
      description: "Completou 50 tarefas",
      icon: <Award className="h-6 w-6" />,
      progress: Math.min(profile.totalTasksCompleted / 50 * 100, 100),
      isComplete: profile.totalTasksCompleted >= 50,
    },
    {
      id: "focus-streak",
      title: "Sequência de Foco",
      description: "Manteve um streak de 7 dias",
      icon: <Zap className="h-6 w-6" />,
      progress: Math.min(profile.streak / 7 * 100, 100),
      isComplete: profile.streak >= 7,
    },
    {
      id: "pomodoro-master",
      title: "Mestre do Pomodoro",
      description: "Completou 25 sessões de pomodoro",
      icon: <Clock className="h-6 w-6" />,
      progress: Math.min(profile.totalPomodorosCompleted / 25 * 100, 100),
      isComplete: profile.totalPomodorosCompleted >= 25,
    },
    {
      id: "project-creator",
      title: "Criador de Projetos",
      description: "Criou 5 projetos",
      icon: <Calendar className="h-6 w-6" />,
      progress: Math.min(projects.length / 5 * 100, 100),
      isComplete: projects.length >= 5,
    },
    {
      id: "tag-organizer",
      title: "Organizador de Tags",
      description: "Criou 10 tags diferentes",
      icon: <Star className="h-6 w-6" />,
      progress: Math.min(tags.length / 10 * 100, 100),
      isComplete: tags.length >= 10,
    },
  ];
  
  // Prepare analytics data
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  
  // Task status breakdown
  const statusData = [
    { name: 'A Fazer', value: tasks.filter(t => t.status === 'todo').length },
    { name: 'Fazendo', value: tasks.filter(t => t.status === 'doing').length },
    { name: 'Concluído', value: tasks.filter(t => t.status === 'done').length },
  ];
  
  // Project breakdown
  const projectData = projects.map(project => {
    const projectTasks = tasks.filter(task => task.projectId === project.id);
    const completedCount = projectTasks.filter(t => t.completed).length;
    const pendingCount = projectTasks.filter(t => !t.completed).length;
    
    return {
      name: project.name,
      completed: completedCount,
      pending: pendingCount,
    };
  });
  
  // Tag breakdown
  const tagData = tags.map(tag => {
    const tagTasks = tasks.filter(task => task.tags.includes(tag.id));
    return {
      name: tag.name,
      value: tagTasks.length,
      color: tag.color,
    };
  }).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5 tags
  
  // Priority breakdown
  const priorityData = [
    { name: 'Baixa', value: tasks.filter(t => t.priority === 'baixa').length },
    { name: 'Média', value: tasks.filter(t => t.priority === 'media').length },
    { name: 'Alta', value: tasks.filter(t => t.priority === 'alta').length },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Conquistas e Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe seu progresso e estatísticas
            </p>
          </div>
          
          <div className="inline-flex items-center gap-1 p-1 bg-muted/40 rounded-lg">
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'achievements' ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              <Trophy className="h-4 w-4 mr-2 inline-block" />
              Conquistas
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'analytics' ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart2 className="h-4 w-4 mr-2 inline-block" />
              Analytics
            </button>
          </div>
        </div>
        
        {activeTab === 'achievements' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="border-green-500/20 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Tarefas Concluídas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{profile.totalTasksCompleted}</p>
                </CardContent>
              </Card>
              
              <Card className="border-blue-500/20 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-500" />
                    Streak Atual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{profile.streak} {profile.streak === 1 ? 'dia' : 'dias'}</p>
                </CardContent>
              </Card>
              
              <Card className="border-purple-500/20 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-500" />
                    Pontos Totais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{profile.points}</p>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Suas Conquistas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievementsList.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`transition-all duration-300 ${achievement.isComplete ? 'border-amber-500/50 bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-950/20 dark:to-transparent' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className={`p-2 rounded-full ${achievement.isComplete ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-muted/50 text-muted-foreground'}`}>
                            {achievement.icon}
                          </div>
                          {achievement.title}
                        </CardTitle>
                        {achievement.isComplete && (
                          <Badge variant="success">Completado</Badge>
                        )}
                      </div>
                      <CardDescription>{achievement.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="flex items-center gap-2 justify-between mb-1">
                        <span className="text-sm font-medium">{Math.round(achievement.progress)}%</span>
                        {achievement.isComplete && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
                      </div>
                      <Progress value={achievement.progress} className={achievement.isComplete ? "bg-amber-100 dark:bg-amber-900/40" : ""} />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}
        
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  Visão Geral das Tarefas
                </CardTitle>
                <CardDescription>Distribuição de tarefas por status</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Quantidade" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-blue-500" />
                    Tarefas por Prioridade
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RPieChart>
                      <Pie
                        data={priorityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {priorityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={
                            entry.name === 'Alta' ? '#EF4444' :
                            entry.name === 'Média' ? '#F59E0B' : '#10B981'
                          } />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Tarefas por Tag (Top 5)
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RPieChart>
                      <Pie
                        data={tagData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {tagData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            {projectData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    Tarefas por Projeto
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projectData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" name="Concluídas" stackId="a" fill="#10B981" />
                      <Bar dataKey="pending" name="Pendentes" stackId="a" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Achievements;
