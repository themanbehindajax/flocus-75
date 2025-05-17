
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trophy, Flame, Star, Award, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";

const Achievements = () => {
  const { profile, tasks, projects, tags, pomodoroSessions } = useAppStore();
  const [selectedTimeRange, setSelectedTimeRange] = useState<"week" | "month" | "all">("week");

  // Calculate stats
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const completedPomodoros = pomodoroSessions.filter(session => session.completed).length;

  // Generate random analytics data (for the UI demonstration)
  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const getCurrentWeekData = () => {
    return daysOfWeek.map(day => ({
      name: day,
      tasks: Math.floor(Math.random() * 8),
      pomodoros: Math.floor(Math.random() * 5),
    }));
  };

  const weeklyData = getCurrentWeekData();

  const projectDistribution = projects.map(project => {
    const projectTasks = tasks.filter(task => task.projectId === project.id);
    const completedProjectTasks = projectTasks.filter(task => task.completed);
    
    return {
      name: project.name,
      value: projectTasks.length,
      completed: completedProjectTasks.length,
      color: project.color || "#0EA5E9"
    };
  });

  const tagDistribution = tags.map(tag => {
    const taggedTasks = tasks.filter(task => task.tags.includes(tag.id));
    
    return {
      name: tag.name,
      value: taggedTasks.length,
      color: tag.color
    };
  });

  // Color palettes for charts
  const BLUE_COLORS = [
    "#0ea5e9",
    "#38bdf8",
    "#7dd3fc",
    "#bae6fd",
    "#e0f2fe",
    "#3b82f6",
    "#60a5fa",
  ];

  // Task completion by day of week
  const tasksByDayOfWeek = daysOfWeek.map(day => ({
    name: day,
    completed: Math.floor(Math.random() * 10),
  }));

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Conquistas & Análises
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitore seu progresso e visualize suas conquistas
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-900/70 dark:text-blue-300/90 flex items-center">
                    <Trophy className="mr-2 h-5 w-5 text-blue-500" />
                    Pontos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                    {profile.points}
                  </div>
                  <p className="text-sm text-blue-700/70 dark:text-blue-400/70 mt-1">
                    Ganho com tarefas concluídas
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-purple-900/70 dark:text-purple-300/90 flex items-center">
                    <Flame className="mr-2 h-5 w-5 text-purple-500" />
                    Streak Atual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                    {profile.streak} dias
                  </div>
                  <p className="text-sm text-purple-700/70 dark:text-purple-400/70 mt-1">
                    Última atividade: {formatDistanceToNow(new Date(profile.lastActivity), { locale: ptBR, addSuffix: true })}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/30 dark:to-cyan-900/20">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-cyan-900/70 dark:text-cyan-300/90 flex items-center">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-cyan-500" />
                    Tarefas Concluídas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-cyan-700 dark:text-cyan-400">
                    {completedTasks}
                  </div>
                  <p className="text-sm text-cyan-700/70 dark:text-cyan-400/70 mt-1">
                    Taxa de conclusão: {completionRate.toFixed(0)}%
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-900/70 dark:text-blue-300/90 flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-blue-500" />
                    Pomodoros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                    {completedPomodoros}
                  </div>
                  <p className="text-sm text-blue-700/70 dark:text-blue-400/70 mt-1">
                    Total de sessões concluídas
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-black/40 border border-blue-100 dark:border-blue-900/30 shadow-lg shadow-blue-900/5">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900 dark:text-blue-100">
                    <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
                    Progresso Semanal
                  </CardTitle>
                  <CardDescription>
                    Tarefas e pomodoros concluídos por dia
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={weeklyData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#888" strokeOpacity={0.2} />
                      <XAxis dataKey="name" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          backdropFilter: "blur(8px)",
                          borderRadius: "8px",
                          border: "1px solid rgba(59, 130, 246, 0.2)"
                        }} 
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="tasks"
                        name="Tarefas"
                        stroke="#0ea5e9"
                        fill="#0ea5e9"
                        fillOpacity={0.6}
                        activeDot={{ r: 8 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="pomodoros"
                        name="Pomodoros"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.4}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-black/40 border border-blue-100 dark:border-blue-900/30 shadow-lg shadow-blue-900/5">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900 dark:text-blue-100">
                    <Award className="mr-2 h-5 w-5 text-blue-500" />
                    Produtividade por Dia da Semana
                  </CardTitle>
                  <CardDescription>
                    Número de tarefas concluídas por dia
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={tasksByDayOfWeek}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#888" strokeOpacity={0.2} />
                      <XAxis dataKey="name" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          backdropFilter: "blur(8px)",
                          borderRadius: "8px",
                          border: "1px solid rgba(59, 130, 246, 0.2)"
                        }}
                      />
                      <Bar 
                        dataKey="completed" 
                        name="Tarefas Concluídas" 
                        radius={[4, 4, 0, 0]}
                      >
                        {tasksByDayOfWeek.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={BLUE_COLORS[index % BLUE_COLORS.length]} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Distribution Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-black/40 border border-blue-100 dark:border-blue-900/30 shadow-lg shadow-blue-900/5">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900 dark:text-blue-100">
                    <Star className="mr-2 h-5 w-5 text-blue-500" />
                    Distribuição por Projeto
                  </CardTitle>
                  <CardDescription>
                    Número de tarefas por projeto
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[280px] flex items-center justify-center">
                  {projectDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={projectDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {projectDistribution.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color || BLUE_COLORS[index % BLUE_COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} tarefas`, ""]}
                          contentStyle={{ 
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(8px)",
                            borderRadius: "8px",
                            border: "1px solid rgba(59, 130, 246, 0.2)"
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground">
                        Nenhum projeto com tarefas ainda.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-black/40 border border-blue-100 dark:border-blue-900/30 shadow-lg shadow-blue-900/5">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900 dark:text-blue-100">
                    <Star className="mr-2 h-5 w-5 text-blue-500" />
                    Distribuição por Tag
                  </CardTitle>
                  <CardDescription>
                    Número de tarefas por tag
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[280px] flex items-center justify-center">
                  {tagDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={tagDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {tagDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} tarefas`, ""]}
                          contentStyle={{ 
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(8px)",
                            borderRadius: "8px",
                            border: "1px solid rgba(59, 130, 246, 0.2)"
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground">
                        Nenhuma tarefa com tags ainda.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Achievements;
