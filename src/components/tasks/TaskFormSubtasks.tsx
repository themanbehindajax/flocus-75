
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface TaskFormSubtasksProps {
  subtasks: string[];
  setSubtasks: (s: string[]) => void;
  newSubtask: string;
  setNewSubtask: (v: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
}

export const TaskFormSubtasks = ({
  subtasks,
  setSubtasks,
  newSubtask,
  setNewSubtask,
  onAdd,
  onRemove,
}: TaskFormSubtasksProps) => (
  <div className="space-y-2">
    <Label>Subtarefas</Label>
    <div className="flex gap-2">
      <Input
        placeholder="Adicionar subtarefa"
        value={newSubtask}
        onChange={(e) => setNewSubtask(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onAdd();
          }
        }}
      />
      <Button type="button" onClick={onAdd}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
    {subtasks.length > 0 && (
      <div className="space-y-2 mt-2">
        {subtasks.map((subtask, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-1 px-3 bg-background border rounded-md"
          >
            <span>{subtask}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    )}
  </div>
);
