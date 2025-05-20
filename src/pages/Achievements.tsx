
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
  ResponsiveContainer,
} from "recharts";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { 
  Trophy, 
  Flame, 
  CheckCircle2, 
  Clock,
  ChartPie,
  ChartBar,
  ChartLine,
  Calendar,
  Filter
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const Achievements = () => {
  const { profile, tasks, projects, tags, pomodoroSessions } = useAppStore();
  const [selectedTimeRange, setSelectedTimeRange] = useState<"week" | "month" | "all">("week");

  // Calculate stats
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const completedPomodoros = pomodoroSessions.filter(session => session.completed).length;

  // Generate data for weekly tasks and pomodoros
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const getCurrentWeekData = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 6 = Saturday
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - currentDay); // Set to start of week (Sunday)
    
    return daysOfWeek.map((day, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      const dateString = date.toISOString().split('T')[0];
      
      // Count tasks completed on this day
      const dayTasks = tasks.filter(task => {
        const taskUpdateDate = new Date(task.updatedAt).toISOString().split('T')[0];
        return task.completed && taskUpdateDate === dateString;
      }).length;
      
      // Count pomodoros completed on this day
      const dayPomodoros = pomodoroSessions.filter(session => {
        if (!session.endTime) return false;
        const sessionDate = new Date(session.endTime).toISOString().split('T')[0];
        return session.completed && sessionDate === dateString;
      }).length;
      
      return {
        name: day,
        tasks: dayTasks,
        pomodoros: dayPomodoros,
      };
    });
  };

  const weeklyData = getCurrentWeekData();

  // Project distribution with actual data
  const projectDistribution = projects.map(project => {
    const projectTasks = tasks.filter(task => task.projectId === project.id);
    const completedProjectTasks = projectTasks.filter(task => task.completed);
    
    return {
      name: project.name,
      value: projectTasks.length,
      completed: completedProjectTasks.length,
      color: project.color || "#0EA5E9"
    };
  }).filter(project => project.value > 0);

  // Tag distribution with actual data
  const tagDistribution = tags.map(tag => {
    const taggedTasks = tasks.filter(task => task.tags.includes(tag.id));
    
    return {
      name: tag.name,
      value: taggedTasks.length,
      color: tag.color || "#3B82F6"
    };
  }).filter(tag => tag.value > 0);

  // Task completion by day of week with actual data
  const tasksByDayOfWeek = daysOfWeek.map((day, index) => {
    const completedTasksByDay = tasks.filter(task => {
      if (!task.completed) return false;
      const taskDate = new Date(task.updatedAt);
      return taskDate.getDay() === index;
    }).length;
    
    return {
      name: day,
      completed: completedTasksByDay,
    };
  });

  // Chart configs
  const weeklyChartConfig = {
    tasks: { 
      label: "Tasks", 
      theme: { light: "#0EA5E9", dark: "#38BDF8" }
    },
    pomodoros: { 
      label: "Pomodoros", 
      theme: { light: "#3B82F6", dark: "#60A5FA" }
    }
  };

  const tasksByDayConfig = {
    completed: { 
      label: "Completed", 
      theme: { light: "#0EA5E9", dark: "#38BDF8" }
    }
  };

  // Badge data
  const badges = [
    { id: 1, name: "Excellent Productivity", icon: "🏆", achieved: profile.points > 500, description: "Complete more than 500 productivity points" },
    { id: 2, name: "Focus Master", icon: "🧠", achieved: completedPomodoros > 50, description: "Complete 50 pomodoro sessions" },
    { id: 3, name: "Daily Consistency", icon: "🔥", achieved: profile.streak > 7, description: "Maintain a 7-day streak" },
    { id: 4, name: "Organizer", icon: "📊", achieved: projects.length > 3, description: "Create and organize more than 3 projects" },
    { id: 5, name: "Speed", icon: "⚡", achieved: false, description: "Complete 5 tasks in a single day" },
    { id: 6, name: "Marathon Runner", icon: "🏃", achieved: false, description: "Use the app for 30 consecutive days" },
  ];

  // Helper for time range button styling
  const getTimeRangeButtonClass = (range: "week" | "month" | "all") => {
    return `px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
      selectedTimeRange === range 
        ? "bg-blue-500 text-white shadow-lg" 
        : "bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white/80"
    }`;
  };

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <AppLayout>
      {/* Background gradient - using reusable CSS class */}
      <div className="achievements-gradient" />
      
      <div className="relative z-10 p-4 md:p-6 max-w-7xl mx-auto">
        <motion.div 
          className="space-y-8"
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          {/* Header with blue gradient text */}
          <motion.div variants={itemVariants} className="text-center mb-4">
            <h1 className="text-4xl font-bold tracking-tight font-satoshi dark:title-gradient-dark title-gradient-light">
              Achievements & Analytics
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor your progress and visualize your achievements
            </p>
          </motion.div>
          
          {/* Time range filter - centralized and improved */}
          <motion.div variants={itemVariants} className="flex justify-center gap-2 mb-6">
            <div className="inline-flex p-1 bg-black/5 dark:bg-white/10 rounded-full backdrop-blur-sm">
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  selectedTimeRange === "week" 
                    ? "bg-blue-500 text-white shadow-lg" 
                    : "dark:text-white/80 text-black/70 hover:bg-black/10 dark:hover:bg-white/20"
                }`}
                onClick={() => setSelectedTimeRange("week")}
              >
                <span className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Week
                </span>
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  selectedTimeRange === "month" 
                    ? "bg-blue-500 text-white shadow-lg" 
                    : "dark:text-white/80 text-black/70 hover:bg-black/10 dark:hover:bg-white/20"
                }`}
                onClick={() => setSelectedTimeRange("month")}
              >
                <span className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Month
                </span>
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  selectedTimeRange === "all" 
                    ? "bg-blue-500 text-white shadow-lg" 
                    : "dark:text-white/80 text-black/70 hover:bg-black/10 dark:hover:bg-white/20"
                }`}
                onClick={() => setSelectedTimeRange("all")}
              >
                <span className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Total
                </span>
              </button>
            </div>
          </motion.div>

          {/* Stats Cards - evenly sized and aligned */}
          <motion.div 
            variants={itemVariants} 
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {/* Points Card */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full overflow-hidden glassmorphism">
                <CardHeader className="pb-2 flex flex-col items-center text-center">
                  <CardTitle className="flex items-center text-xl">
                    <Trophy className="mr-2 h-5 w-5 text-blue-400" />
                    Points
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-3xl font-bold dark:text-gradient dark:from-blue-300 dark:to-blue-500 text-gradient from-blue-500 to-blue-700"
                  >
                    {profile.points}
                  </motion.div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Earned from completed tasks
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Streak Card */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full overflow-hidden glassmorphism">
                <CardHeader className="pb-2 flex flex-col items-center text-center">
                  <CardTitle className="flex items-center text-xl">
                    <Flame className="mr-2 h-5 w-5 text-orange-400" />
                    Current Streak
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="text-3xl font-bold dark:text-gradient dark:from-orange-300 dark:to-red-500 text-gradient from-orange-500 to-red-600"
                  >
                    {profile.streak} days
                  </motion.div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Last activity: {formatDistanceToNow(new Date(profile.lastActivity), { locale: enUS, addSuffix: true })}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tasks Card */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full overflow-hidden glassmorphism">
                <CardHeader className="pb-2 flex flex-col items-center text-center">
                  <CardTitle className="flex items-center text-xl">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-teal-400" />
                    Completed Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="text-3xl font-bold dark:text-gradient dark:from-teal-300 dark:to-cyan-500 text-gradient from-teal-500 to-cyan-600"
                  >
                    {completedTasks}
                  </motion.div>
                  <div className="text-sm text-muted-foreground mt-1 flex items-center">
                    <span>Completion rate:</span>
                    <span className="ml-1 font-medium dark:text-teal-300 text-teal-600">{completionRate.toFixed(0)}%</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pomodoro Card */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full overflow-hidden glassmorphism">
                <CardHeader className="pb-2 flex flex-col items-center text-center">
                  <CardTitle className="flex items-center text-xl">
                    <Clock className="mr-2 h-5 w-5 text-blue-400" />
                    Pomodoros
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="text-3xl font-bold dark:text-gradient dark:from-blue-300 dark:to-indigo-500 text-gradient from-blue-500 to-indigo-600"
                  >
                    {completedPomodoros}
                  </motion.div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total completed sessions
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Main Charts - consistent sizes */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="h-full"
            >
              <Card className="h-full glassmorphism">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center text-xl justify-center">
                    <ChartLine className="mr-2 h-5 w-5 text-blue-400" />
                    Weekly Progress
                  </CardTitle>
                  <CardDescription>
                    Tasks and pomodoros completed per day
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full"
                  >
                    <ChartContainer config={weeklyChartConfig}>
                      <LineChart
                        data={weeklyData}
                        margin={{ top: 20, right: 20, left: 5, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 12, fill: "var(--color-card-foreground)" }} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "var(--color-card-foreground)" }} 
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
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 2, fill: "#0EA5E9" }}
                          activeDot={{ r: 8, strokeWidth: 0, fill: "#0EA5E9" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="pomodoros"
                          stroke="var(--color-pomodoros)"
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 2, fill: "#3B82F6" }}
                          activeDot={{ r: 8, strokeWidth: 0, fill: "#3B82F6" }}
                        />
                      </LineChart>
                    </ChartContainer>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Second chart */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="h-full"
            >
              <Card className="h-full glassmorphism">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center text-xl justify-center">
                    <ChartBar className="mr-2 h-5 w-5 text-blue-400" />
                    Productivity by Day
                  </CardTitle>
                  <CardDescription>
                    Number of tasks completed by day
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full"
                  >
                    <ChartContainer config={tasksByDayConfig}>
                      <BarChart
                        data={tasksByDayOfWeek}
                        margin={{ top: 20, right: 20, left: 5, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} horizontal={true} vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "var(--color-card-foreground)" }} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "var(--color-card-foreground)" }} 
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
                          fill="url(#barGradient)"
                          radius={[4, 4, 0, 0]}
                          barSize={30}
                        >
                          <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#38BDF8" stopOpacity={1}/>
                              <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                            </linearGradient>
                          </defs>
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Distribution Charts - symmetrical layout */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <motion.div whileHover={{ scale: 1.01 }}>
              <Card className="glassmorphism">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center text-xl justify-center">
                    <ChartPie className="mr-2 h-5 w-5 text-blue-400" />
                    Distribution by Project
                  </CardTitle>
                  <CardDescription>
                    Number of tasks by project
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[280px] flex items-center justify-center">
                  {projectDistribution.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0, rotate: -10 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="w-full h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
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
                            animationBegin={400}
                            animationDuration={1500}
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
                            formatter={(value) => [`${value} tasks`, ""]}
                            contentStyle={{ 
                              backgroundColor: "var(--tooltip-bg, rgba(255, 255, 255, 0.1))",
                              backdropFilter: "blur(8px)",
                              borderRadius: "0.5rem",
                              border: "1px solid rgba(255, 255, 255, 0.2)",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                              padding: "0.75rem",
                              color: "var(--tooltip-color, white)"
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </motion.div>
                  ) : (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground">
                        No projects with tasks yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }}>
              <Card className="glassmorphism">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center text-xl justify-center">
                    <ChartPie className="mr-2 h-5 w-5 text-blue-400" />
                    Distribution by Tag
                  </CardTitle>
                  <CardDescription>
                    Number of tasks by tag
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[280px] flex items-center justify-center">
                  {tagDistribution.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0, rotate: 10 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="w-full h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
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
                            animationBegin={500}
                            animationDuration={1500}
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
                            formatter={(value) => [`${value} tasks`, ""]}
                            contentStyle={{ 
                              backgroundColor: "var(--tooltip-bg, rgba(255, 255, 255, 0.1))",
                              backdropFilter: "blur(8px)",
                              borderRadius: "0.5rem",
                              border: "1px solid rgba(255, 255, 255, 0.2)",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                              padding: "0.75rem",
                              color: "var(--tooltip-color, white)"
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </motion.div>
                  ) : (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground">
                        No tasks with tags yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Achievements/Badges Section - centralized */}
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-2xl font-bold mb-4 inline-block dark:title-gradient-dark title-gradient-light">
              Achievements
            </h2>
            
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
              variants={containerVariants}
            >
              {badges.map((badge) => (
                <motion.div 
                  key={badge.id}
                  whileHover={{ y: -5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <HoverCard>
                    <HoverCardTrigger>
                      <Card className={`h-full overflow-hidden achievement-card ${
                          badge.achieved 
                            ? "dark:bg-gradient-to-br dark:from-blue-500/30 dark:to-purple-500/30 dark:border-white/30 bg-gradient-to-br from-blue-100 to-purple-100 border-black/10" 
                            : "dark:grayscale grayscale-[50%]"
                        } text-center cursor-help`}
                      >
                        <CardContent className="flex flex-col items-center justify-center pt-6 pb-4">
                          <div className="text-4xl mb-2">{badge.icon}</div>
                          <h3 className="font-medium text-sm line-clamp-2">
                            {badge.name}
                          </h3>
                          {badge.achieved && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                              className="mt-2 px-2 py-0.5 rounded-full dark:bg-blue-500/20 dark:text-blue-300 bg-blue-100 text-blue-600 text-xs"
                            >
                              Achieved
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </HoverCardTrigger>
                    <HoverCardContent className="glassmorphism w-60">
                      <div className="flex justify-between items-start">
                        <div className="text-2xl mr-2">{badge.icon}</div>
                        <div>
                          <h4 className="font-bold dark:text-blue-300 text-blue-600">{badge.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground flex justify-end">
                        {badge.achieved ? (
                          <span className="dark:text-green-400 text-green-600">Achieved</span>
                        ) : (
                          <span>In progress</span>
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Achievements;
