
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { Tag } from "@/lib/types";

interface TaskFormTagsProps {
  tags: Tag[];
  selected: string[];
  setSelected: (s: string[]) => void;
}

export const TaskFormTags = ({ tags, selected, setSelected }: TaskFormTagsProps) => (
  <div className="space-y-2">
    <Label>Tags</Label>
    <Select 
      onValueChange={(value) => {
        if (!selected.includes(value)) {
          setSelected([...selected, value]);
        }
      }}>
      <SelectTrigger>
        <SelectValue placeholder="Adicionar tag" />
      </SelectTrigger>
      <SelectContent>
        {tags.map((tag) => (
          <SelectItem key={tag.id} value={tag.id}>
            {tag.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <div className="flex flex-wrap gap-2 mt-2">
      {selected.map((tagId) => {
        const tag = tags.find(t => t.id === tagId);
        if (!tag) return null;
        return (
          <span 
            key={tag.id}
            className="px-2 py-1 rounded-full text-xs flex items-center gap-1"
            style={{ backgroundColor: tag.color + '20', color: tag.color }}
          >
            {tag.name}
            <button
              type="button"
              onClick={() => setSelected(selected.filter(id => id !== tagId))}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        );
      })}
    </div>
  </div>
);
