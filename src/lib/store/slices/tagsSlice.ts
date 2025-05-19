
import { v4 as uuidv4 } from "uuid";
import { TagsState, SetFunction } from '../types';
import { Tag } from '../../types';

// Predefined tag colors with nice contrast for both dark/light themes
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

export const createTagsSlice = (set: SetFunction): TagsState => ({
  tags: [],
  addTag: (tag) => {
    // If no color is defined, use a random one from predefined colors
    const tagColor = tag.color || predefinedColors[Math.floor(Math.random() * predefinedColors.length)];
    
    set((state) => ({
      tags: [...state.tags, {
        id: crypto.randomUUID(),
        ...tag,
        color: tagColor,
      }]
    }));
  },
  
  updateTag: (updatedTag) => set((state) => ({
    tags: state.tags.map(tag => tag.id === updatedTag.id ? updatedTag : tag)
  })),
  
  deleteTag: (tagId) => set((state: any) => {
    const updatedTasks = state.tasks.map((task: any) => ({
      ...task,
      tags: task.tags.filter((id: string) => id !== tagId),
      updatedAt: task.tags.includes(tagId) ? new Date().toISOString() : task.updatedAt,
    }));
    
    return {
      tags: state.tags.filter((t: Tag) => t.id !== tagId),
      tasks: updatedTasks,
    };
  }),
});
