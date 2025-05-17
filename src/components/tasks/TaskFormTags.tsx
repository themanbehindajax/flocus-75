
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Tag as TagIcon, PlusCircle } from "lucide-react";
import { Tag } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TagManager } from "@/components/tags/TagManager";

interface TaskFormTagsProps {
  tags: Tag[];
  selected: string[];
  setSelected: (s: string[]) => void;
}

export const TaskFormTags = ({ tags, selected, setSelected }: TaskFormTagsProps) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <Label>Tags</Label>
      <TagManager triggerComponent={
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          <PlusCircle className="h-3.5 w-3.5 mr-1" />
          Gerenciar tags
        </Button>
      } />
    </div>
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
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }}></div>
              {tag.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <div className="flex flex-wrap gap-2 mt-2">
      {selected.map((tagId) => {
        const tag = tags.find(t => t.id === tagId);
        if (!tag) return null;
        return (
          <Badge 
            key={tag.id}
            className="px-2 py-1 rounded-full text-xs flex items-center gap-1 animate-fade-in text-white"
            style={{ backgroundColor: tag.color }}
          >
            {tag.name}
            <button
              type="button"
              onClick={() => setSelected(selected.filter(id => id !== tagId))}
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        );
      })}
    </div>
  </div>
);
