
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriorityLevel } from "@/lib/types";

interface TaskFormPriorityProps {
  value: PriorityLevel;
  onChange: (value: PriorityLevel) => void;
}

export const TaskFormPriority = ({ value, onChange }: TaskFormPriorityProps) => (
  <div className="space-y-2">
    <Label htmlFor="priority">Prioridade</Label>
    <Select
      value={value}
      onValueChange={(v) => onChange(v as PriorityLevel)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecione" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="baixa">Baixa</SelectItem>
        <SelectItem value="media">Média</SelectItem>
        <SelectItem value="alta">Alta</SelectItem>
      </SelectContent>
    </Select>
  </div>
);
