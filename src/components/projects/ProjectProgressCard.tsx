
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Project, Task } from "@/lib/types";
import { useNavigate } from "react-router-dom";

interface ProjectProgressCardProps {
  project: Project;
  projectTasks: Task[];
}

export const ProjectProgressCard = ({ project, projectTasks }: ProjectProgressCardProps) => {
  const navigate = useNavigate();
  const completedTasks = projectTasks.filter(task => task.completed);
  const progress = projectTasks.length > 0 
    ? Math.round((completedTasks.length / projectTasks.length) * 100) 
    : 0;

  const handleStartPomodoro = () => {
    navigate("/pomodoro", { state: { projectId: project.id } });
  };

  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-medium">Progresso</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{completedTasks.length}/{projectTasks.length} tarefas</span>
            <span>{progress}%</span>
          </div>
        </div>
        {project.dueDate && (
          <div className="flex items-center mt-4 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>Vence em: {new Date(project.dueDate).toLocaleDateString("pt-BR")}</span>
          </div>
        )}
        <div className="mt-4">
          <Button className="w-full" onClick={handleStartPomodoro}>
            Iniciar Pomodoro
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
