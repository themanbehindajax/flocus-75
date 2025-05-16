
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
    const tasksWithDueDates = tasks.filter(task => task.dueDate);
    
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
      
      await addTaskToCalendar(
        token,
        task.title,
        task.description || "",
        startDateTime,
        endDateTime
      );
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
  addTaskFunction: typeof useAppStore.getState().addTask
): Promise<void> => {
  try {
    // Fetch events from Google Calendar
    const now = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(now.getMonth() + 1);
    
    const calendarData = await fetchCalendarEvents(
      token,
      now.toISOString(),
      oneMonthFromNow.toISOString()
    );
    
    if (calendarData && calendarData.items) {
      for (const event of calendarData.items) {
        // Check if event has necessary data
        if (event.summary && event.start && event.start.dateTime) {
          // Create a task from the calendar event
          addTaskFunction({
            title: event.summary,
            description: event.description || "",
            priority: "media",
            status: "todo",
            dueDate: new Date(event.start.dateTime).toISOString(),
            tags: [],
            subtasks: [],
            calendarEventId: event.id, // Store reference to calendar event ID
          });
        }
      }
    }
  } catch (error) {
    console.error("Error syncing calendar to tasks:", error);
    throw error;
  }
};
