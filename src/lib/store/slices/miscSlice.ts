
import { v4 as uuidv4 } from "uuid";
import { MiscState, SetFunction } from '../types';
import { DailyPriority, UserProfile } from '../../types';

export const createMiscSlice = (set: SetFunction): MiscState => ({
  // Daily Priorities
  dailyPriorities: [],
  setDailyPriorities: (priorities) => {
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
  
  // User profile
  profile: {
    name: 'Usuário',
    points: 0,
    streak: 0,
    lastActivity: new Date().toISOString(),
    totalTasksCompleted: 0,
    totalPomodorosCompleted: 0
  },
  updateProfile: (profileUpdate) => {
    set((state: any) => ({
      profile: { ...state.profile, ...profileUpdate },
    }));
  },
  
  // App settings
  settings: {
    pomodoroDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    theme: 'system',
    notificationsEnabled: true,
  },
  updateSettings: (settingsUpdate) => {
    set((state: any) => ({
      settings: { ...state.settings, ...settingsUpdate },
    }));
  }
});
