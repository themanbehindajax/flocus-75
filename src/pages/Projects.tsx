import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { ProjectList } from "@/components/projects/ProjectList";
import { useAppStore } from "@/lib/store";
import { Project } from "@/lib/types";

const Projects = () => {
  const { projects, addProject } = useAppStore();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProject = () => {
    setIsCreating(true);
  };

  const handleProjectCreated = (newProject: Project) => {
    setIsCreating(false);
    addProject(newProject);
  };

  return (
    <AppLayout>
      <div className="container py-10">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Projetos</h1>
          <button
            onClick={handleCreateProject}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Criar Projeto
          </button>
        </div>

        {isCreating ? (
          <ProjectForm onProjectCreated={handleProjectCreated} onCancel={() => setIsCreating(false)} />
        ) : (
          <ProjectList projects={projects} />
        )}
      </div>
    </AppLayout>
  );
};

export default Projects;
