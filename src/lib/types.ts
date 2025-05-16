
export type PriorityLevel = "baixa" | "media" | "alta";

export type TaskStatus = "todo" | "doing" | "done";

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: PriorityLevel;
  dueDate?: string; // ISO date string
  tags: string[]; // tag ids
  projectId?: string;
  subtasks: SubTask[];
  completed: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isQuick?: boolean; // for 2-minute rule tasks
  calendarEventId?: string; // ID of the associated Google Calendar event
}

export interface Project {
  id: string;
  name: string;
  goal: string;
  dueDate?: string; // ISO date string
  tasks: string[]; // task ids
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface PomodoroSession {
  id: string;
  taskId?: string;
  projectId?: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  duration: number; // in minutes
  completed: boolean;
}

export interface DailyPriority {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  taskIds: string[]; // max 6 task ids (Ivy Lee method)
}

export interface UserProfile {
  name: string;
  avatar?: string;
  points: number;
  streak: number;
  lastActivity: string; // ISO date string
  totalTasksCompleted: number;
  totalPomodorosCompleted: number;
}

export interface SpotifyAuth {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface AppSettings {
  pomodoroDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  theme: "light" | "dark" | "system";
  spotifyAuth?: SpotifyAuth;
}
