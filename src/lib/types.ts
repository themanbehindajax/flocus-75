
// If types.ts doesn't exist yet, we'll create it
export type PriorityLevel = "baixa" | "media" | "alta";
export type TaskStatus = "todo" | "doing" | "done";

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: PriorityLevel;
  status: TaskStatus;
  dueDate?: string;
  projectId?: string;
  tags: string[];
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  subtasks: SubTask[];
  isQuick?: boolean;
  calendarEventId?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  tasks: string[];
  createdAt: string;
  updatedAt: string;
  goal?: string;
  dueDate?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface PomodoroSession {
  id: string;
  startTime: string;
  endTime?: string;
  taskId?: string;
  projectId?: string;
  completed: boolean;
  duration?: number;
}

export interface DailyPriority {
  id: string;
  date: string;
  taskIds: string[];
}

export interface UserProfile {
  name: string;
  avatar?: string;
  points: number;
  streak: number;
  lastActivity: string;
  totalTasksCompleted: number;
  totalPomodorosCompleted: number;
}

export interface AppSettings {
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  theme: "light" | "dark" | "system";
  notificationsEnabled?: boolean;
  timezone?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  allDay: boolean;
  repeat?: "daily" | "weekly" | "monthly" | "yearly" | "none";
  repeatUntil?: string;
  reminder?: number; // minutes before
  color?: string;
}

export interface Analytics {
  completedTasks: {
    daily: Record<string, number>;
    weekly: Record<string, number>;
    monthly: Record<string, number>;
  };
  tasksByProject: Record<string, number>;
  tasksByTag: Record<string, number>;
  pomodoros: {
    daily: Record<string, number>;
    weekly: Record<string, number>;
    monthly: Record<string, number>;
  };
}
