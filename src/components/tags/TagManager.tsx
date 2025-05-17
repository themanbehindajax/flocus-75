
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { PlusCircle, X, TagIcon, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/lib/types";

interface TagManagerProps {
  triggerComponent?: React.ReactNode;
}

export const TagManager = ({ triggerComponent }: TagManagerProps) => {
  const { tags, addTag, updateTag, deleteTag } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#6366f1");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const handleAddTag = () => {
    if (!newTagName.trim()) return;

    if (editingTag) {
      updateTag({
        ...editingTag,
        name: newTagName,
        color: newTagColor,
      });
      setEditingTag(null);
    } else {
      addTag({
        name: newTagName,
        color: newTagColor,
      });
    }

    setNewTagName("");
    setNewTagColor("#6366f1");
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    setNewTagColor(tag.color);
  };

  const handleCancel = () => {
    setEditingTag(null);
    setNewTagName("");
    setNewTagColor("#6366f1");
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {triggerComponent || (
          <Button variant="outline" size="sm" className="gap-2">
            <TagIcon className="h-4 w-4" /> Gerenciar Tags
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Tags</DialogTitle>
          <DialogDescription>
            Crie e edite tags para organizar suas tarefas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Add new tag form */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="tag-name">{editingTag ? "Editar Tag" : "Nova Tag"}</Label>
            <div className="flex gap-2">
              <Input
                id="tag-name"
                placeholder="Nome da tag"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="flex-1"
                autoComplete="off"
              />
              <input
                type="color"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="w-12 h-10 rounded-md cursor-pointer border"
              />
            </div>
            <div className="flex gap-2 justify-end">
              {editingTag && (
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              )}
              <Button onClick={handleAddTag} disabled={!newTagName.trim()}>
                {editingTag ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </div>

          {/* Tags list */}
          <div className="space-y-2">
            <Label>Tags Existentes</Label>
            <div className="border rounded-md p-4 space-y-2 max-h-60 overflow-y-auto">
              {tags.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nenhuma tag criada</p>
              ) : (
                tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between bg-muted/30 p-2 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      ></div>
                      <span>{tag.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(tag)}
                        className="h-8 w-8"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTag(tag.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
