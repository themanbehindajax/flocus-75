
// Import and re-export slices for backward compatibility
export { createTasksSlice as createTaskActions } from "./store/slices/tasksSlice";
export { createProjectsSlice as createProjectActions } from "./store/slices/projectsSlice";
export { createTagsSlice as createTagActions } from "./store/slices/tagsSlice";
export { createPomodoroSlice as createPomodoroActions } from "./store/slices/pomodoroSlice";
export { createMiscSlice as createMiscActions } from "./store/slices/miscSlice";
export { createCalendarSlice as createCalendarActions } from "./store/slices/calendarSlice";
export { createUISlice } from "./store/slices/uiSlice";
