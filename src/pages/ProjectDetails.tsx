
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { TaskForm } from "@/components/tasks/TaskForm";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { ProjectProgressCard } from "@/components/projects/ProjectProgressCard";
import { ProjectTaskList } from "@/components/projects/ProjectTaskList";
import { Button } from "@/components/ui/button";
import { ListPlus } from "lucide-react";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projects, tasks } = useAppStore();

  const [view, setView] = useState<"list" | "kanban">("list");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [projectTasks, setProjectTasks] = useState<any[]>([]);

  const project = projects.find(p => p.id === projectId);

  // Function to update project tasks
  const updateProjectTasks = () => {
    if (projectId) {
      // Uses getState to ensure the most recent state
      const currentTasks = useAppStore.getState().tasks.filter(task => task.projectId === projectId);
      console.log("Updating project tasks:", projectId, currentTasks);
      setProjectTasks(currentTasks);
    }
  };

  // Load project tasks when the page is loaded or when tasks change
  useEffect(() => {
    updateProjectTasks();
  }, [tasks, projectId]);

  if (!project) {
    return (
      <AppLayout>
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/projects")}>
              <span className="mr-2">
                <svg width={16} height={16}><path d="M10 6L6 10M6 6l4 4" /></svg>
              </span>
              Back
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-xl font-medium mb-2">Project not found</h3>
            <p className="text-muted-foreground mb-6">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/projects")}>View all projects</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleTaskCreated = () => {
    // Close the task addition dialog
    setIsAddDialogOpen(false);
    
    // Force explicit update of project tasks after creation
    // Using setTimeout to ensure the store was updated before fetching tasks
    setTimeout(() => {
      updateProjectTasks();
      
      toast({
        title: "Task created",
        description: "Task successfully added to the project.",
      });
    }, 100);
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <ProjectHeader project={project} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ProjectProgressCard project={project} projectTasks={projectTasks} />
          <ProjectTaskList
            projectId={project.id}
            projectTasks={projectTasks}
            view={view}
            setView={setView}
            setIsAddDialogOpen={setIsAddDialogOpen}
            isAddDialogOpen={isAddDialogOpen}
            onTaskAdded={updateProjectTasks} // To update tasks when added via QuickAdd
          >
            {/* Children: new task button with modal */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <ListPlus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Add details for your new task.
                  </DialogDescription>
                </DialogHeader>
                <TaskForm
                  onComplete={handleTaskCreated}
                  defaultProjectId={project.id}
                />
              </DialogContent>
            </Dialog>
          </ProjectTaskList>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectDetails;
