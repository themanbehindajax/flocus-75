
import { v4 as uuidv4 } from "uuid";
import { DailyPriority, UserProfile } from "../types";

// Fix the interface to properly accept both set and get parameters
type SetFunction = (fn: (state: any) => any) => void;
type GetFunction = () => any;

// Restructured to properly handle the set and get parameters
export const createMiscActions = (set: SetFunction, get: GetFunction) => ({
  // Enhanced setDailyPriorities function with consistent date formatting
  setDailyPriorities: (priorities: DailyPriority) => {
    // Ensure date is in YYYY-MM-DD format (remove any time component)
    const formattedDate = priorities.date.split('T')[0];
    
    console.log("[DEBUG] Setting daily priorities:", priorities);
    console.log("[DEBUG] Formatted date:", formattedDate);
    
    // Validate taskIds is an array
    const validatedTaskIds = Array.isArray(priorities.taskIds) ? priorities.taskIds : [];
    
    // Create a standardized priorities object
    const standardizedPriorities = {
      id: priorities.id || uuidv4(),
      date: formattedDate, // Use the formatted date
      taskIds: validatedTaskIds,
    };
    
    console.log("[DEBUG] Standardized priorities object:", standardizedPriorities);
    
    set((state: any) => {
      const existingPriority = state.dailyPriorities.find(
        (dp: DailyPriority) => dp.date.split('T')[0] === formattedDate
      );
      
      console.log("[DEBUG] Found existing priority?", !!existingPriority);
      if (existingPriority) {
        console.log("[DEBUG] Existing priority taskIds:", existingPriority.taskIds);
        console.log("[DEBUG] Updating priorities for date:", formattedDate);
        
        return {
          dailyPriorities: state.dailyPriorities.map((dp: DailyPriority) =>
            dp.date.split('T')[0] === formattedDate ? standardizedPriorities : dp
          ),
        };
      } else {
        console.log("[DEBUG] Adding new priorities for date:", formattedDate);
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
    }));
  }
});
