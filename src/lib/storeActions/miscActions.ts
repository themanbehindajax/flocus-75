
import { v4 as uuidv4 } from "uuid";
import { DailyPriority, UserProfile } from "../types";

export const createMiscActions = (set: any) => ({
  setDailyPriorities: (date: string, taskIds: string[]) => {
    set((state: any) => {
      const existingPriority = state.dailyPriorities.find((dp: DailyPriority) => dp.date === date);
      if (existingPriority) {
        return {
          dailyPriorities: state.dailyPriorities.map((dp: DailyPriority) =>
            dp.date === date ? { ...dp, taskIds } : dp
          ),
        };
      } else {
        return {
          dailyPriorities: [...state.dailyPriorities, {
            id: uuidv4(),
            date,
            taskIds,
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
  },
});
