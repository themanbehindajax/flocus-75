
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";

interface TaskFormQuickProps {
  value: boolean;
  onChange: (val: boolean) => void;
}

export const TaskFormQuick = ({ value, onChange }: TaskFormQuickProps) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-2">
      <Switch
        id="quick-task"
        checked={value}
        onCheckedChange={onChange}
      />
      <Label htmlFor="quick-task" className="flex items-center gap-1">
        <Zap className="h-4 w-4 text-yellow-500" />
        Tarefa rápida (2 minutos)
      </Label>
    </div>
    <p className="text-xs text-muted-foreground">
      Marque tarefas que podem ser concluídas em 2 minutos ou menos
    </p>
  </div>
);
