
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TaskFormTitleProps {
  value: string;
  onChange: (value: string) => void;
}

export const TaskFormTitle = ({ value, onChange }: TaskFormTitleProps) => (
  <div className="space-y-2">
    <Label htmlFor="title">Título</Label>
    <Input
      id="title"
      placeholder="Insira o título da tarefa"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
