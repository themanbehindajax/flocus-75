
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Medal, Star, Award } from "lucide-react";

const achievements = [
  {
    id: "tasks_completed_10",
    title: "Primeiros Passos",
    description: "Complete 10 tarefas",
    icon: <Trophy className="h-8 w-8 text-amber-500" />,
    requiredAmount: 10,
    type: "tasks",
    color: "bg-amber-500",
  },
  {
    id: "tasks_completed_50",
    title: "Produtividade em Alta",
    description: "Complete 50 tarefas",
    icon: <Trophy className="h-8 w-8 text-amber-500" />,
    requiredAmount: 50,
    type: "tasks",
    color: "bg-amber-500",
  },
  {
    id: "pomodoros_completed_20",
    title: "Mestre do Tempo",
    description: "Complete 20 sessões de pomodoro",
    icon: <Medal className="h-8 w-8 text-blue-500" />,
    requiredAmount: 20,
    type: "pomodoros",
    color: "bg-blue-500",
  },
  {
    id: "streak_7",
    title: "Consistência Semanal",
    description: "Mantenha um streak de 7 dias",
    icon: <Star className="h-8 w-8 text-emerald-500" />,
    requiredAmount: 7,
    type: "streak",
    color: "bg-emerald-500",
  },
  {
    id: "streak_30",
    title: "Consistência Mensal",
    description: "Mantenha um streak de 30 dias",
    icon: <Star className="h-8 w-8 text-emerald-500" />,
    requiredAmount: 30,
    type: "streak",
    color: "bg-emerald-500",
  },
  {
    id: "points_100",
    title: "Centenário",
    description: "Acumule 100 pontos",
    icon: <Award className="h-8 w-8 text-violet-500" />,
    requiredAmount: 100,
    type: "points",
    color: "bg-violet-500",
  },
  {
    id: "points_500",
    title: "Estrela Ascendente",
    description: "Acumule 500 pontos",
    icon: <Award className="h-8 w-8 text-violet-500" />,
    requiredAmount: 500,
    type: "points",
    color: "bg-violet-500",
  },
];

const AchievementCard = ({ achievement, currentValue }) => {
  const isCompleted = currentValue >= achievement.requiredAmount;
  const progress = Math.min(Math.round((currentValue / achievement.requiredAmount) * 100), 100);

  return (
    <Card className={`border ${isCompleted ? "border-2 border-primary" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="p-2 rounded-full bg-primary/10">{achievement.icon}</div>
          {isCompleted && (
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Conquistado
            </Badge>
          )}
        </div>
        <CardTitle className="mt-2">{achievement.title}</CardTitle>
        <CardDescription>{achievement.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso</span>
            <span className="font-medium">
              {currentValue}/{achievement.requiredAmount}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        <p className="text-xs text-muted-foreground">
          {isCompleted
            ? "Conquista desbloqueada!"
            : `Faltam ${achievement.requiredAmount - currentValue} para desbloquear`}
        </p>
      </CardFooter>
    </Card>
  );
};

const Achievements = () => {
  const { profile } = useAppStore();
  const [filter, setFilter] = useState<"all" | "completed" | "in-progress">("all");

  // Map achievement types to values from the user profile
  const getAchievementValue = (type: string) => {
    switch (type) {
      case "tasks":
        return profile.totalTasksCompleted;
      case "pomodoros":
        return profile.totalPomodorosCompleted;
      case "streak":
        return profile.streak;
      case "points":
        return profile.points;
      default:
        return 0;
    }
  };

  // Filter achievements based on selected filter
  const filteredAchievements = achievements.filter((achievement) => {
    const currentValue = getAchievementValue(achievement.type);
    const isCompleted = currentValue >= achievement.requiredAmount;

    if (filter === "all") return true;
    if (filter === "completed") return isCompleted;
    if (filter === "in-progress") return !isCompleted;
    return true;
  });

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conquistas</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe seu progresso e conquistas
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant={filter === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("all")}
          >
            Todas
          </Badge>
          <Badge
            variant={filter === "completed" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("completed")}
          >
            Conquistadas
          </Badge>
          <Badge
            variant={filter === "in-progress" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("in-progress")}
          >
            Em progresso
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              currentValue={getAchievementValue(achievement.type)}
            />
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Trophy className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Nenhuma conquista encontrada</h3>
            <p className="text-muted-foreground">
              {filter === "completed"
                ? "Você ainda não completou nenhuma conquista. Continue trabalhando!"
                : "Não há conquistas correspondentes ao filtro selecionado."}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Achievements;
