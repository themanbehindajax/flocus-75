
export const translations = {
  // General
  save: "Save",
  cancel: "Cancel",
  delete: "Delete",
  edit: "Edit",
  create: "Create",
  update: "Update",
  close: "Close",
  open: "Open",
  select: "Select",
  
  // Navigation
  home: "Home",
  projects: "Projects",
  tasks: "Tasks",
  calendar: "Calendar",
  pomodoro: "Pomodoro",
  settings: "Settings",
  achievements: "Achievements",
  
  // Settings
  settings_title: "Settings",
  profile: "Profile",
  profile_description: "Configure your personal information",
  pomodoro_settings: "Pomodoro Settings",
  pomodoro_settings_description: "Adjust focus and break times",
  appearance: "Appearance",
  appearance_description: "Customize the application appearance",
  theme: "Theme",
  light: "Light",
  dark: "Dark",
  system: "System",
  timezone: "Timezone",
  timezone_description: "Current time:",
  notifications: "Notifications",
  enabled: "Enabled",
  disabled: "Disabled",
  save_settings: "Save Settings",
  settings_saved: "Settings updated successfully!",
  
  // Profile
  name: "Name",
  your_points: "Your points:",
  current_streak: "Current streak:",
  points: "points",
  days: "days",
  
  // Pomodoro
  pomodoro_duration: "Pomodoro Duration",
  short_break: "Short Break",
  long_break: "Long Break",
  minutes: "min",
  
  // Projects
  project_name: "Project Name",
  project_name_placeholder: "Enter project name",
  main_goal: "Main Goal",
  main_goal_placeholder: "What is the objective of this project?",
  completion_date: "Completion Date",
  select_date: "Select a date",
  create_project: "Create Project",
  edit_project: "Edit Project",
  tasks_count: "tasks",
  
  // Timezone options
  timezone_brasilia: "Brasília (UTC-3)",
  timezone_manaus: "Manaus (UTC-4)",
  timezone_rio_branco: "Rio Branco (UTC-5)",
  timezone_noronha: "Fernando de Noronha (UTC-2)",
  timezone_utc: "UTC (UTC+0)",
  timezone_new_york: "New York (UTC-5/-4)",
  timezone_los_angeles: "Los Angeles (UTC-8/-7)",
  timezone_london: "London (UTC+0/+1)",
  timezone_paris: "Paris (UTC+1/+2)",
  timezone_tokyo: "Tokyo (UTC+9)",
  timezone_shanghai: "Shanghai (UTC+8)",
  timezone_sydney: "Sydney (UTC+10/+11)",
} as const;

export type TranslationKey = keyof typeof translations;

export const t = (key: TranslationKey): string => {
  return translations[key];
};
