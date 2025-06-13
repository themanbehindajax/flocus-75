
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  ListPlus, 
  Search,
  List, 
  Kanban
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { EmptyTasksPlaceholder } from "@/components/tasks/EmptyTasksPlaceholder";
import { KanbanBoard } from "@/components/projects/KanbanBoard";
import { QuickAddTask } from "@/components/tasks/QuickAddTask";

const Tasks = () => {
  const { tasks } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [view, setView] = useState<"list" | "kanban">("list");
  const [displayedTasks, setDisplayedTasks] = useState(tasks);
  
  // Update displayed tasks whenever the global task list changes or search query changes
  useEffect(() => {
    const filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDisplayedTasks(filtered);
    console.log("Updating task list:", filtered);
  }, [tasks, searchQuery]);

  const handleTaskCreated = () => {
    // Close the dialog
    setIsAddDialogOpen(false);
    
    // Explicit update of tasks after creating a new one
    setTimeout(() => {
      const currentTasks = useAppStore.getState().tasks.filter((task) => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log("Updating list after creating new task:", currentTasks);
      setDisplayedTasks(currentTasks);
    }, 100);
  };

  const handleQuickTaskAdded = () => {
    // Explicit update of tasks after adding a quick one
    setTimeout(() => {
      const currentTasks = useAppStore.getState().tasks.filter((task) => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log("Updating list after adding quick task:", currentTasks);
      setDisplayedTasks(currentTasks);
    }, 100);
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground mt-1">
              Manage your daily tasks
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-10 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center border rounded-md overflow-hidden">
              <Button
                variant={view === "list" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setView("list")}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={view === "kanban" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setView("kanban")}
                className="rounded-none"
              >
                <Kanban className="h-4 w-4" />
              </Button>
            </div>
            
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
                <TaskForm onComplete={handleTaskCreated} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Quick Add Task */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Add Task</CardTitle>
          </CardHeader>
          <CardContent>
            <QuickAddTask onTaskAdded={handleQuickTaskAdded} />
          </CardContent>
        </Card>
        
        {/* Tasks Grid */}
        {displayedTasks.length > 0 ? (
          view === "list" ? (
            <TaskList tasks={displayedTasks} showProjectName={true} />
          ) : (
            <KanbanBoard tasks={displayedTasks} projectId="" />
          )
        ) : (
          <EmptyTasksPlaceholder onCreateTask={() => setIsAddDialogOpen(true)} />
        )}
      </div>
    </AppLayout>
  );
};

export default Tasks;
