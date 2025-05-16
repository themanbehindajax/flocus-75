
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskStatus } from "@/lib/types";

interface TaskFormStatusProps {
  value: TaskStatus;
  onChange: (value: TaskStatus) => void;
}

export const TaskFormStatus = ({ value, onChange }: TaskFormStatusProps) => (
  <div className="space-y-2">
    <Label htmlFor="status">Status</Label>
    <Select
      value={value}
      onValueChange={(v) => onChange(v as TaskStatus)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecione" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todo">A fazer</SelectItem>
        <SelectItem value="doing">Em progresso</SelectItem>
        <SelectItem value="done">Concluída</SelectItem>
      </SelectContent>
    </Select>
  </div>
);
