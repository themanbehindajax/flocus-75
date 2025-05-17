
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trophy, Flame, CheckCircle2, Clock } from "lucide-react";

const Achievements = () => {
  const { profile, tasks, projects, tags, pomodoroSessions } = useAppStore();
  const [selectedTimeRange, setSelectedTimeRange] = useState<"week" | "month" | "all">("week");

  // Calculate stats
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const completedPomodoros = pomodoroSessions.filter(session => session.completed).length;

  // Generate random analytics data
  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const weeklyData = daysOfWeek.map(day => ({
    name: day,
    tasks: Math.floor(Math.random() * 8),
    pomodoros: Math.floor(Math.random() * 5),
  }));

  // Task completion by day of week
  const tasksByDayOfWeek = daysOfWeek.map(day => ({
    name: day,
    completed: Math.floor(Math.random() * 10),
  }));

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Conquistas & Análises
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitore seu progresso e visualize suas conquistas
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm">
                  <Trophy className="mr-2 h-4 w-4" />
                  Pontos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profile.points}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm">
                  <Flame className="mr-2 h-4 w-4" />
                  Streak Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profile.streak} dias
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Última atividade: {formatDistanceToNow(new Date(profile.lastActivity), { locale: ptBR, addSuffix: true })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Tarefas Concluídas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {completedTasks}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Taxa de conclusão: {completionRate.toFixed(0)}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4" />
                  Pomodoros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {completedPomodoros}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total de sessões concluídas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Progresso Semanal</CardTitle>
                <CardDescription>
                  Tarefas e pomodoros concluídos por dia
                </CardDescription>
              </CardHeader>
              <CardContent className="h-72">
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
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="tasks"
                      name="Tarefas"
                      stroke="#0ea5e9"
                      fill="#0ea5e9"
                      fillOpacity={0.6}
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

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Produtividade por Dia</CardTitle>
                <CardDescription>
                  Número de tarefas concluídas por dia
                </CardDescription>
              </CardHeader>
              <CardContent className="h-72">
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
                    <Tooltip />
                    <Bar 
                      dataKey="completed" 
                      name="Tarefas Concluídas" 
                      fill="#0ea5e9"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Achievements;
