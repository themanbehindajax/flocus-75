
import { Task } from "./types";
import { addTaskToCalendar, fetchCalendarEvents } from "./googleCalendar";
import { useAppStore } from "./store";

/**
 * Synchronizes tasks with Google Calendar
 */
export const syncTasksToCalendar = async (
  token: string,
  tasks: Task[]
): Promise<void> => {
  try {
    // Filter tasks that have due dates
    const tasksWithDueDates = tasks.filter(task => task.dueDate && !task.calendarEventId);
    
    // Add each task to Google Calendar
    for (const task of tasksWithDueDates) {
      // Convert task due date to datetime format
      const taskDate = new Date(task.dueDate as string);
      // Set time to noon if no time specified
      if (taskDate.getHours() === 0 && taskDate.getMinutes() === 0) {
        taskDate.setHours(12, 0, 0, 0);
      }
      
      const startDateTime = taskDate.toISOString();
      // Set end time to 1 hour after start time
      const endDateTime = new Date(taskDate.getTime() + 60 * 60 * 1000).toISOString();
      
      try {
        const event = await addTaskToCalendar(
          token,
          task.title,
          task.description || "",
          startDateTime,
          endDateTime
        );
        
        if (event && event.id) {
          // Update task with calendar event ID
          const { updateTask } = useAppStore.getState();
          updateTask({
            ...task,
            calendarEventId: event.id,
            updatedAt: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error(`Error syncing task ${task.id} to calendar:`, error);
      }
    }
  } catch (error) {
    console.error("Error syncing tasks to calendar:", error);
    throw error;
  }
};

/**
 * Fetches events from Google Calendar and creates corresponding tasks
 */
export const syncCalendarToTasks = async (
  token: string,
  addTaskFunction: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "completed">) => void
): Promise<void> => {
  try {
    // Fetch events from Google Calendar
    const now = new Date();
    // Get events for next 3 months
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + 3);
    
    const calendarData = await fetchCalendarEvents(
      token,
      now.toISOString(),
      threeMonthsFromNow.toISOString()
    );
    
    if (calendarData && calendarData.items) {
      const existingTasks = useAppStore.getState().tasks;
      const existingCalendarIds = new Set(existingTasks
        .filter(task => task.calendarEventId)
        .map(task => task.calendarEventId));
      
      for (const event of calendarData.items) {
        // Check if event has necessary data
        if (event.summary && event.start && (event.start.dateTime || event.start.date)) {
          // Skip if we already have this calendar event as a task
          if (existingCalendarIds.has(event.id)) {
            continue;
          }
          
          // Create a task from the calendar event
          const startTime = event.start.dateTime || `${event.start.date}T12:00:00Z`;
          
          addTaskFunction({
            title: event.summary,
            description: event.description || "",
            priority: "media",
            status: "todo",
            dueDate: new Date(startTime).toISOString(),
            tags: [],
            subtasks: [],
            calendarEventId: event.id // Store reference to calendar event ID
          });
        }
      }
    }
  } catch (error) {
    console.error("Error syncing calendar to tasks:", error);
    throw error;
  }
};
