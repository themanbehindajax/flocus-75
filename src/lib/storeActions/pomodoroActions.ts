
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
      // Update the pomodoro session to completed
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
      
      // Find the session that was just completed (if it exists and wasn't already completed)
      const sessionCompleted = state.pomodoroSessions.find((s: PomodoroSession) => s.id === id && !s.completed);
      const updatedProfile = { ...state.profile };
      
      if (sessionCompleted) {
        // Update points and pomodoro count immediately
        updatedProfile.points += 10;
        updatedProfile.totalPomodorosCompleted += 1;
        updatedProfile.lastActivity = new Date().toISOString();
        
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split("T")[0];
        const lastActivityDate = new Date(state.profile.lastActivity).toISOString().split("T")[0];
        
        console.log("Streak check - Today:", today);
        console.log("Streak check - Last activity:", lastActivityDate);
        console.log("Streak check - Current streak:", state.profile.streak);
        
        if (lastActivityDate === today) {
          // Same day activity, maintain streak
          console.log("Same day activity - maintaining streak");
        } else if (
          new Date(lastActivityDate).getTime() >= new Date(new Date(today).getTime() - 86400000).getTime()
        ) {
          // Activity within last 24 hours (yesterday), increase streak
          updatedProfile.streak += 1;
          console.log("Activity within 24h - increasing streak to:", updatedProfile.streak);
        } else {
          // Activity after a break (more than 1 day), reset streak to 1
          updatedProfile.streak = 1;
          console.log("Activity after break - resetting streak to 1");
        }
      }
      
      return {
        pomodoroSessions: updatedSessions,
        profile: updatedProfile,
      };
    });
  },
});
