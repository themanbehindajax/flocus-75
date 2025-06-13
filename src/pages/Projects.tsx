
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderPlus,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Projects = () => {
  const { projects, tasks, addProject, updateProject, deleteProject } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<typeof projects[0] | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "date" | "progress">("name");
  
  const handleCreateProject = (projectData: Parameters<typeof addProject>[0]) => {
    const newProject = addProject(projectData);
    toast.success(`Project "${projectData.name}" created successfully`);
    setIsAddDialogOpen(false); // Close the dialog after creating the project
  };
  
  const handleEditProject = (project: typeof projects[0]) => {
    setCurrentProject(project);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateProject = (projectData: Parameters<typeof updateProject>[0]) => {
    if (currentProject) {
      updateProject({
        ...currentProject,
        ...projectData
      });
      toast.success(`Project "${projectData.name}" updated successfully`);
      setIsEditDialogOpen(false);
      setCurrentProject(null);
    }
  };
  
  const handleDeleteProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      // Confirm deletion
      if (window.confirm(`Are you sure you want to delete the project "${project.name}"?`)) {
        deleteProject(projectId);
        toast.success(`Project "${project.name}" deleted successfully`);
      }
    }
  };

  // Filter projects based on search query
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "date") {
      const aDate = a.createdAt || "0";
      const bDate = b.createdAt || "0";
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    }
    // Sort by progress
    const aProgress = calculateProgress(a.id);
    const bProgress = calculateProgress(b.id);
    return bProgress - aProgress;
  });
  
  // Helper function to get tasks for a specific project
  const getProjectTasks = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };
  
  // Calculate progress for sorting
  const calculateProgress = (projectId: string) => {
    const projectTasks = getProjectTasks(projectId);
    if (projectTasks.length === 0) return 0;
    const completedTasks = projectTasks.filter(task => task.completed);
    return (completedTasks.length / projectTasks.length) * 100;
  };

  // Animation variants for staggered animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your projects
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-10 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-shrink-0">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Sort
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Sort Projects</DialogTitle>
                    <DialogDescription>
                      Choose how projects should be sorted.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant={sortBy === "name" ? "default" : "outline"}
                        onClick={() => setSortBy("name")}
                        className="justify-start"
                      >
                        By Name
                      </Button>
                      <Button 
                        variant={sortBy === "date" ? "default" : "outline"}
                        onClick={() => setSortBy("date")}
                        className="justify-start"
                      >
                        By Creation Date
                      </Button>
                      <Button 
                        variant={sortBy === "progress" ? "default" : "outline"}
                        onClick={() => setSortBy("progress")}
                        className="justify-start"
                      >
                        By Progress
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <FolderPlus className="mr-2 h-4 w-4" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Add details for your new project.
                    </DialogDescription>
                  </DialogHeader>
                  <ProjectForm 
                    onSubmit={handleCreateProject}
                    onCancel={() => setIsAddDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Edit Project Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Project</DialogTitle>
                  <DialogDescription>
                    Update project details.
                  </DialogDescription>
                </DialogHeader>
                {currentProject && (
                  <ProjectForm 
                    initialProject={currentProject}
                    onSubmit={handleUpdateProject}
                    onCancel={() => setIsEditDialogOpen(false)}
                    submitButtonText="Update Project"
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
        
        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedProjects.map((project) => {
              const projectTasks = getProjectTasks(project.id);
              
              return (
                <motion.div key={project.id} variants={item}>
                  <ProjectCard 
                    project={project}
                    projectTasks={projectTasks}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <FolderPlus className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">No projects found</h3>
            {searchQuery ? (
              <p className="text-muted-foreground mb-6">
                No projects match your search. Try other terms.
              </p>
            ) : (
              <p className="text-muted-foreground mb-6">
                Create your first project to start managing your tasks.
              </p>
            )}
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="animate-pulse-light"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default Projects;
