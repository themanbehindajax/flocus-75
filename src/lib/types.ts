export interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: 'alta' | 'media' | 'baixa';
  status: 'todo' | 'doing' | 'done';
  tags: string[];
  projectId?: string;
  dueDate?: string;
  estimatedTime?: number;
  assignee?: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  subtasks: Subtask[];
  isQuick?: boolean;
  completed: boolean;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
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
  duration?: number;
  completed: boolean;
  taskId?: string;
  projectId?: string;
}

export interface UserProfile {
  name: string;
  points: number;
  streak: number;
  lastActivity: string;
  totalTasksCompleted: number;
  totalPomodorosCompleted: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  projectId?: string;
  taskId?: string;
}

export interface DailyPriority {
  date: string;
  tasks: string[];
}
