
import { v4 as uuidv4 } from "uuid";
import { Tag } from "../types";

export const createTagActions = (set: any) => ({
  addTag: (tagData: Omit<Tag, "id">) => {
    const newTag: Tag = {
      id: uuidv4(),
      ...tagData,
    };
    set((state: any) => ({
      tags: [...state.tags, newTag],
    }));
    return newTag;
  },
  updateTag: (tag: Tag) => {
    set((state: any) => ({
      tags: state.tags.map((t: Tag) => t.id === tag.id ? tag : t),
    }));
  },
  deleteTag: (id: string) => {
    set((state: any) => {
      const updatedTasks = state.tasks.map((task: any) => ({
        ...task,
        tags: task.tags.filter((tagId: string) => tagId !== id),
        updatedAt: task.tags.includes(id) ? new Date().toISOString() : task.updatedAt,
      }));
      return {
        tags: state.tags.filter((t: Tag) => t.id !== id),
        tasks: updatedTasks,
      };
    });
  },
});
