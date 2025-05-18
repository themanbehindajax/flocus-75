
import { v4 as uuidv4 } from "uuid";
import { PomodoroSession } from "../types";

export const createPomodoroActions = (set: any, get: any) => ({
  startPomodoroSession: (taskId?: string, projectId?: string) => {
    const newSession: PomodoroSession = {
      id: uuidv4(),
      taskId,
      projectId,
      startTime: new Date().toISOString(),
      endTime: "",
      duration: get().settings.pomodoroDuration,
      completed: false,
    };
    set((state: any) => ({
      pomodoroSessions: [...state.pomodoroSessions, newSession],
      profile: {
        ...state.profile,
        lastActivity: new Date().toISOString(),
      },
    }));
    return newSession;
  },
  completePomodoroSession: (id: string) => {
    set((state: any) => {
      const updatedSessions = state.pomodoroSessions.map((session: PomodoroSession) => {
        if (session.id === id) {
          return {
            ...session,
            endTime: new Date().toISOString(),
            completed: true,
          };
        }
        return session;
      });
      const sessionCompleted = state.pomodoroSessions.find((s: PomodoroSession) => s.id === id && !s.completed);
      const updatedProfile = { ...state.profile };
      if (sessionCompleted) {
        updatedProfile.points += 10;
        updatedProfile.totalPomodorosCompleted += 1;
        updatedProfile.lastActivity = new Date().toISOString();
        const today = new Date().toISOString().split("T")[0];
        const lastActivityDate = new Date(state.profile.lastActivity).toISOString().split("T")[0];
        if (lastActivityDate === today) {
          // Same day activity, maintain streak
        } else if (
          new Date(lastActivityDate).getTime() >= new Date(new Date(today).getTime() - 86400000).getTime()
        ) {
          // Activity within last 24 hours, increase streak
          updatedProfile.streak += 1;
        } else {
          // Activity after a break, reset streak to 1
          updatedProfile.streak = 1;
        }
      }
      return {
        pomodoroSessions: updatedSessions,
        profile: updatedProfile,
      };
    });
  },
});
