
import { v4 as uuidv4 } from "uuid";
import { DailyPriority, UserProfile } from "../types";

export const createMiscActions = (set: any) => ({
  // Enhanced setDailyPriorities function with better logging
  setDailyPriorities: (priorities: DailyPriority) => {
    console.log("[DEBUG] Setting daily priorities:", priorities);
    
    // Validate taskIds is an array
    const validatedTaskIds = Array.isArray(priorities.taskIds) ? priorities.taskIds : [];
    
    // Create a standardized priorities object
    const standardizedPriorities = {
      id: priorities.id || uuidv4(),
      date: priorities.date,
      taskIds: validatedTaskIds,
    };
    
    console.log("[DEBUG] Standardized priorities object:", standardizedPriorities);
    
    set((state: any) => {
      const existingPriority = state.dailyPriorities.find((dp: DailyPriority) => dp.date === priorities.date);
      
      if (existingPriority) {
        console.log("[DEBUG] Updating existing priorities for date:", priorities.date);
        return {
          dailyPriorities: state.dailyPriorities.map((dp: DailyPriority) =>
            dp.date === priorities.date ? standardizedPriorities : dp
          ),
        };
      } else {
        console.log("[DEBUG] Adding new priorities for date:", priorities.date);
        return {
          dailyPriorities: [...state.dailyPriorities, standardizedPriorities],
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
    }))
  }
});
