
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Project } from "@/lib/types";
import { useNavigate } from "react-router-dom";

interface ProjectHeaderProps {
  project: Project;
}

export const ProjectHeader = ({ project }: ProjectHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="sm" onClick={() => navigate("/projects")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
        {project.goal && (
          <p className="text-muted-foreground mt-1">{project.goal}</p>
        )}
      </div>
    </div>
  );
};
