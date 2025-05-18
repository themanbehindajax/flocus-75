
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Clock, Pencil, Trash2 } from "lucide-react";
import { Project, Task } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ProjectCardProps {
  project: Project;
  projectTasks: Task[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

export const ProjectCard = ({ project, projectTasks, onEdit, onDelete }: ProjectCardProps) => {
  const completedTasks = projectTasks.filter((task) => task.completed);
  const progress = projectTasks.length > 0
    ? Math.round((completedTasks.length / projectTasks.length) * 100)
    : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy");
  };

  return (
    <Card className="animate-fade-in shadow-sm hover:shadow-md transition-all duration-300 dark:bg-blue-950/40">
      <CardHeader className="pb-2">
        <CardTitle>{project.name}</CardTitle>
        {project.goal && (
          <CardDescription className="line-clamp-2">
            {project.goal}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between text-sm mb-2">
          <div>{completedTasks.length}/{projectTasks.length} tarefas</div>
          {project.dueDate && (
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(project.dueDate)}
            </div>
          )}
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <div className="flex space-x-2">
          <Button 
            size="icon" 
            variant="outline" 
            className="h-8 w-8 dark:bg-blue-950/20 dark:border-white/10"
            onClick={() => onEdit(project)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="outline" 
            className="h-8 w-8 text-destructive dark:bg-blue-950/20 dark:border-white/10"
            onClick={() => onDelete(project.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <Button asChild className="dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
          <Link to={`/projects/${project.id}`}>Abrir</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
