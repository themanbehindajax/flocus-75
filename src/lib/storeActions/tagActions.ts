
import { v4 as uuidv4 } from "uuid";
import { Tag } from "../types";

const predefinedColors = [
  "#9b87f5", // Primary Purple
  "#F97316", // Bright Orange
  "#0EA5E9", // Ocean Blue
  "#D946EF", // Magenta Pink
  "#8B5CF6", // Vivid Purple
  "#EC4899", // Pink
  "#10B981", // Green
  "#EF4444", // Red
  "#F59E0B", // Amber
  "#6366F1", // Indigo
];

export const createTagActions = (set: any) => ({
  addTag: (tagData: Omit<Tag, "id">) => {
    // Se não houver cor definida, pegue uma aleatória dos predefinidos
    const tagColor = tagData.color || predefinedColors[Math.floor(Math.random() * predefinedColors.length)];
    
    const newTag: Tag = {
      id: uuidv4(),
      ...tagData,
      color: tagColor,
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
