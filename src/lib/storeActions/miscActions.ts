
import { v4 as uuidv4 } from "uuid";
import { DailyPriority, UserProfile } from "../types";

export const createMiscActions = (set: any) => ({
  // Standardize the setDailyPriorities function to accept a complete DailyPriority object
  setDailyPriorities: (priorities: DailyPriority) => {
    set((state: any) => {
      const existingPriority = state.dailyPriorities.find((dp: DailyPriority) => dp.date === priorities.date);
      if (existingPriority) {
        return {
          dailyPriorities: state.dailyPriorities.map((dp: DailyPriority) =>
            dp.date === priorities.date ? { ...dp, taskIds: priorities.taskIds } : dp
          ),
        };
      } else {
        return {
          dailyPriorities: [...state.dailyPriorities, {
            id: priorities.id || uuidv4(),
            date: priorities.date,
            taskIds: priorities.taskIds,
          }],
        };
      }
    });
  },
  
  updateProfile: (profileUpdate: Partial<UserProfile>) => {
    set((state: any) => ({
      profile: { ...state.profile, ...profileUpdate },
    }));
  },
  
  updateSettings: (settingsUpdate: any) => {
    set((state: any) => ({
      settings: { ...state.settings, ...settingsUpdate },
    }));
  }),
});
