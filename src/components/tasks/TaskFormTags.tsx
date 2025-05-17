
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TagIcon, X, Plus } from "lucide-react";
import { Tag } from "@/lib/types";
import { TagManager } from "../tags/TagManager";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface TaskFormTagsProps {
  tags: Tag[];
  selected: string[];
  setSelected: (tags: string[]) => void;
}

export const TaskFormTags = ({ tags, selected, setSelected }: TaskFormTagsProps) => {
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);

  const handleToggleTag = (tagId: string) => {
    if (selected.includes(tagId)) {
      setSelected(selected.filter((id) => id !== tagId));
    } else {
      setSelected([...selected, tagId]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>Tags</Label>
        <TagManager 
          triggerComponent={
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs gap-1"
              onClick={() => setIsTagManagerOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              Nova Tag
            </Button>
          }
        />
      </div>

      <div className="flex flex-wrap gap-1.5 p-2 border rounded-md min-h-12">
        {tags.length === 0 ? (
          <div className="w-full flex items-center justify-center text-muted-foreground text-sm py-2">
            <span>Nenhuma tag disponível</span>
          </div>
        ) : (
          <>
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleToggleTag(tag.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all ${
                  selected.includes(tag.id)
                    ? 'text-white ring-1 ring-offset-1'
                    : 'text-foreground bg-muted/40 hover:bg-muted'
                }`}
                style={{
                  backgroundColor: selected.includes(tag.id) ? tag.color : undefined,
                  boxShadow: selected.includes(tag.id) ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                {tag.name}
                {selected.includes(tag.id) && (
                  <X className="h-3 w-3" />
                )}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
