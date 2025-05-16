
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { 
  createTaskActions, 
  createProjectActions, 
  createTagActions, 
  createPomodoroActions,
  createMiscActions
} from "./storeActions";

export const useAppStore = create()(
  persist(
    (set, get) => ({
      tasks: [],
      projects: [],
      tags: [
        { id: uuidv4(), name: "Urgente", color: "#EF4444" },
        { id: uuidv4(), name: "Criativo", color: "#8B5CF6" },
        { id: uuidv4(), name: "Financeiro", color: "#10B981" },
      ],
      pomodoroSessions: [],
      dailyPriorities: [],
      profile: {
        name: "Usuário",
        points: 0,
        streak: 0,
        lastActivity: new Date().toISOString(),
        totalTasksCompleted: 0,
        totalPomodorosCompleted: 0,
      },
      settings: {
        pomodoroDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        theme: "system",
      },
      
      ...createTaskActions(set, get),
      ...createProjectActions(set, get),
      ...createTagActions(set),
      ...createPomodoroActions(set, get),
      ...createMiscActions(set),
    }),
    {
      name: "flocus-app-storage",
    }
  )
);
