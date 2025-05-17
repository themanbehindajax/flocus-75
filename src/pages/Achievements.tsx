
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
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Trophy, 
  Flame, 
  Star, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  ChartPie,
  ChartBar,
  ChartLine
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";

const Achievements = () => {
  const { profile, tasks, projects, tags, pomodoroSessions } = useAppStore();
  const [selectedTimeRange, setSelectedTimeRange] = useState<"week" | "month" | "all">("week");

  // Calculate stats
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const completedPomodoros = pomodoroSessions.filter(session => session.completed).length;

  // Generate data for analytics
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

  // Task completion by day of week
  const tasksByDayOfWeek = daysOfWeek.map(day => ({
    name: day,
    completed: Math.floor(Math.random() * 10),
  }));

  // Chart configs
  const weeklyChartConfig = {
    tasks: { 
      label: "Tarefas", 
      theme: { light: "#0EA5E9", dark: "#38BDF8" }
    },
    pomodoros: { 
      label: "Pomodoros", 
      theme: { light: "#3B82F6", dark: "#60A5FA" }
    }
  };

  const tasksByDayConfig = {
    completed: { 
      label: "Concluídas", 
      theme: { light: "#0EA5E9", dark: "#38BDF8" }
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="space-y-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="overflow-hidden border border-blue-100/40 dark:border-blue-900/30 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-900/70 dark:text-blue-300/90 flex items-center text-xl">
                    <Trophy className="mr-2 h-5 w-5 text-blue-500" />
                    Pontos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                    {profile.points}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
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
              <Card className="overflow-hidden border border-purple-100/40 dark:border-purple-900/30 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-purple-900/70 dark:text-purple-300/90 flex items-center text-xl">
                    <Flame className="mr-2 h-5 w-5 text-purple-500" />
                    Streak Atual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                    {profile.streak} dias
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
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
              <Card className="overflow-hidden border border-cyan-100/40 dark:border-cyan-900/30 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-cyan-900/70 dark:text-cyan-300/90 flex items-center text-xl">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-cyan-500" />
                    Tarefas Concluídas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-cyan-700 dark:text-cyan-400">
                    {completedTasks}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
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
              <Card className="overflow-hidden border border-blue-100/40 dark:border-blue-900/30 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-900/70 dark:text-blue-300/90 flex items-center text-xl">
                    <Clock className="mr-2 h-5 w-5 text-blue-500" />
                    Pomodoros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                    {completedPomodoros}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
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
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-black/20 border border-blue-100/20 dark:border-blue-900/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900 dark:text-blue-100 text-xl">
                    <ChartLine className="mr-2 h-5 w-5 text-blue-500" />
                    Progresso Semanal
                  </CardTitle>
                  <CardDescription>
                    Tarefas e pomodoros concluídos por dia
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ChartContainer config={weeklyChartConfig}>
                    <LineChart
                      data={weeklyData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12 }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 12 }} 
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                      />
                      <ChartLegend 
                        content={<ChartLegendContent />} 
                        verticalAlign="top" 
                        align="right"
                      />
                      <Line
                        type="monotone"
                        dataKey="tasks"
                        stroke="var(--color-tasks)"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="pomodoros"
                        stroke="var(--color-pomodoros)"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-black/20 border border-blue-100/20 dark:border-blue-900/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900 dark:text-blue-100 text-xl">
                    <ChartBar className="mr-2 h-5 w-5 text-blue-500" />
                    Produtividade por Dia
                  </CardTitle>
                  <CardDescription>
                    Número de tarefas concluídas por dia
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ChartContainer config={tasksByDayConfig}>
                    <BarChart
                      data={tasksByDayOfWeek}
                      margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} horizontal={true} vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 12 }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 12 }} 
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                      />
                      <ChartLegend 
                        content={<ChartLegendContent />} 
                        verticalAlign="top" 
                        align="right" 
                      />
                      <Bar 
                        dataKey="completed" 
                        fill="var(--color-completed)"
                        radius={[4, 4, 0, 0]}
                        barSize={24}
                      />
                    </BarChart>
                  </ChartContainer>
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
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-black/20 border border-blue-100/20 dark:border-blue-900/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900 dark:text-blue-100 text-xl">
                    <ChartPie className="mr-2 h-5 w-5 text-blue-500" />
                    Distribuição por Projeto
                  </CardTitle>
                  <CardDescription>
                    Número de tarefas por projeto
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[280px] flex items-center justify-center">
                  {projectDistribution.length > 0 ? (
                    <PieChart width={300} height={280}>
                      <Pie
                        data={projectDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        paddingAngle={2}
                      >
                        {projectDistribution.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color} 
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} tarefas`, ""]}
                        contentStyle={{ 
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          backdropFilter: "blur(8px)",
                          borderRadius: "0.5rem",
                          border: "1px solid rgba(59, 130, 246, 0.1)",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                          padding: "0.75rem"
                        }}
                      />
                    </PieChart>
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
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-black/20 border border-blue-100/20 dark:border-blue-900/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900 dark:text-blue-100 text-xl">
                    <Star className="mr-2 h-5 w-5 text-blue-500" />
                    Distribuição por Tag
                  </CardTitle>
                  <CardDescription>
                    Número de tarefas por tag
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[280px] flex items-center justify-center">
                  {tagDistribution.length > 0 ? (
                    <PieChart width={300} height={280}>
                      <Pie
                        data={tagDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        paddingAngle={2}
                      >
                        {tagDistribution.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color} 
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} tarefas`, ""]}
                        contentStyle={{ 
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          backdropFilter: "blur(8px)",
                          borderRadius: "0.5rem",
                          border: "1px solid rgba(59, 130, 246, 0.1)",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                          padding: "0.75rem"
                        }}
                      />
                    </PieChart>
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
