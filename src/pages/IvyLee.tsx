import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/lib/store";
import { 
  CheckCircle, 
  Grip, 
  Info, 
  ListChecks,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

const MAX_PRIORITIES = 6;

const IvyLee = () => {
  const { tasks, dailyPriorities, setDailyPriorities, completeTask } = useAppStore();
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const { toast } = useToast();

  // Filter for incomplete tasks
  const incompleteTasks = tasks.filter(task => !task.completed);

  // Load priorities for selected date
  useEffect(() => {
    console.log("[DEBUG IvyLee] Loading priorities for date:", date);
    console.log("[DEBUG IvyLee] All daily priorities:", dailyPriorities);
    
    // Always ensure date is in YYYY-MM-DD format
    const formattedDate = date.split('T')[0];
    
    // Find priorities with consistent date formatting
    const selectedDatePriorities = dailyPriorities.find(dp => {
      const formattedDpDate = dp.date.split('T')[0]; 
      const isMatch = formattedDpDate === formattedDate;
      
      console.log(`[DEBUG IvyLee] Comparing: ${formattedDpDate} with ${formattedDate}, match: ${isMatch}`);
      return isMatch;
    });
    
    if (selectedDatePriorities && Array.isArray(selectedDatePriorities.taskIds)) {
      console.log("[DEBUG IvyLee] Found priorities for date:", formattedDate, selectedDatePriorities);
      setSelectedTaskIds(selectedDatePriorities.taskIds);
    } else {
      console.log("[DEBUG IvyLee] No priorities found for date:", formattedDate);
      setSelectedTaskIds([]);
    }
  }, [date, dailyPriorities]);

  const handleAddTask = (taskId: string) => {
    if (selectedTaskIds.length >= MAX_PRIORITIES) {
      toast({
        title: "Limite atingido",
        description: `O método Ivy Lee permite no máximo ${MAX_PRIORITIES} prioridades por dia.`,
        variant: "destructive",
      });
      return;
    }
    
    if (selectedTaskIds.includes(taskId)) return;
    
    const newSelectedTaskIds = [...selectedTaskIds, taskId];
    setSelectedTaskIds(newSelectedTaskIds);
    
    // Garantindo formato de data consistente
    const formattedDate = date.split('T')[0];
    const existingPriority = dailyPriorities.find(dp => dp.date.split('T')[0] === formattedDate);
    
    console.log("[DEBUG IvyLee] Adding task to priorities:", taskId);
    console.log("[DEBUG IvyLee] New selected task IDs:", newSelectedTaskIds);
    
    // Create or update priority with the correct structure
    setDailyPriorities({
      id: existingPriority?.id || uuidv4(),
      date: formattedDate, // Use formatted date
      taskIds: newSelectedTaskIds
    });
    
    toast({
      title: "Tarefa adicionada",
      description: "Tarefa adicionada às prioridades do dia.",
    });
  };

  const handleRemoveTask = (taskId: string) => {
    const newSelectedTaskIds = selectedTaskIds.filter(id => id !== taskId);
    setSelectedTaskIds(newSelectedTaskIds);
    
    // Find existing priority for this date with consistent formatting
    const formattedDate = date.split('T')[0];
    const existingPriority = dailyPriorities.find(dp => dp.date.split('T')[0] === formattedDate);
    
    console.log("[DEBUG IvyLee] Removing task from priorities:", taskId);
    console.log("[DEBUG IvyLee] New selected task IDs:", newSelectedTaskIds);
    
    setDailyPriorities({
      id: existingPriority?.id || uuidv4(),
      date: formattedDate, // Use formatted date
      taskIds: newSelectedTaskIds
    });
    
    toast({
      title: "Tarefa removida",
      description: "Tarefa removida das prioridades do dia.",
    });
  };

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
    toast({
      title: "Tarefa concluída",
      description: "Parabéns por completar esta tarefa!",
    });
  };
  
  // Function to move task in the priority list
  const moveTask = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex < 0 ||
      fromIndex >= selectedTaskIds.length ||
      toIndex < 0 ||
      toIndex >= selectedTaskIds.length
    )
      return;

    const newOrder = [...selectedTaskIds];
    const [movedTask] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedTask);
    
    setSelectedTaskIds(newOrder);
    
    // Find existing priority for this date with consistent formatting
    const formattedDate = date.split('T')[0];
    const existingPriority = dailyPriorities.find(dp => dp.date.split('T')[0] === formattedDate);
    
    console.log("[DEBUG IvyLee] Reordering tasks, new order:", newOrder);
    
    setDailyPriorities({
      id: existingPriority?.id || uuidv4(),
      date: formattedDate, // Use formatted date
      taskIds: newOrder
    });
  };

  // Get priority tasks in order
  const priorityTasks = selectedTaskIds
    .map(id => tasks.find(task => task.id === id))
    .filter((task): task is typeof tasks[0] => task !== undefined);

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Método Ivy Lee</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>O método Ivy Lee consiste em escolher as 6 tarefas mais importantes para serem concluídas no dia seguinte, organizadas por ordem de prioridade.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-muted-foreground mt-1">
            Defina até 6 prioridades para o dia e foque nelas
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <label htmlFor="date-select" className="text-sm font-medium">
              Selecione a data
            </label>
            <input
              id="date-select"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2"
            />
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Tarefas selecionadas</p>
            <p className="text-2xl font-bold">{selectedTaskIds.length}/{MAX_PRIORITIES}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Priority List */}
          <Card>
            <CardHeader>
              <CardTitle>Prioridades do Dia</CardTitle>
              <CardDescription>
                Organize suas tarefas por ordem de importância
              </CardDescription>
            </CardHeader>
            <CardContent>
              {priorityTasks.length > 0 ? (
                <ul className="space-y-2">
                  {priorityTasks.map((task, index) => (
                    <li 
                      key={task.id} 
                      className="flex items-center border rounded-md p-3 bg-card"
                    >
                      <div className="mr-2 text-muted-foreground">
                        <Grip className="h-4 w-4" />
                      </div>
                      <div className="mr-2">
                        <p className="font-medium">{index + 1}</p>
                      </div>
                      <div className="flex-1">
                        <p className={task.completed ? "line-through text-muted-foreground" : ""}>
                          {task.title}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleCompleteTask(task.id)}
                          disabled={task.completed}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive"
                          onClick={() => handleRemoveTask(task.id)}
                        >
                          <span>×</span>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ListChecks className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-1">Nenhuma prioridade definida</h3>
                  <p className="text-sm text-muted-foreground">
                    Selecione tarefas da lista para definir suas prioridades
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Tarefas Disponíveis</CardTitle>
              <CardDescription>
                Escolha entre suas tarefas não concluídas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {incompleteTasks.length > 0 ? (
                <ul className="space-y-2">
                  {incompleteTasks
                    .filter(task => !selectedTaskIds.includes(task.id))
                    .map((task) => (
                      <li 
                        key={task.id} 
                        className="flex items-center border rounded-md p-3 bg-card"
                      >
                        <div className="flex-1">
                          <p>{task.title}</p>
                          {task.projectId && (
                            <p className="text-xs text-muted-foreground">
                              Projeto: {task.projectId}
                            </p>
                          )}
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleAddTask(task.id)}
                          disabled={selectedTaskIds.length >= MAX_PRIORITIES}
                        >
                          Adicionar
                        </Button>
                      </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <h3 className="font-medium mb-1">Nenhuma tarefa disponível</h3>
                  <p className="text-sm text-muted-foreground">
                    Todas as tarefas já foram concluídas ou adicionadas às prioridades
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default IvyLee;
