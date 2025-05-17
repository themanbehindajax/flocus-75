
import { v4 as uuidv4 } from "uuid";
import { CalendarEvent } from "../types";
import { scheduleNotification } from "../notifications";

export const createCalendarActions = (set: any, get: any) => ({
  addCalendarEvent: (eventData: Omit<CalendarEvent, "id">) => {
    const id = uuidv4();
    const newEvent: CalendarEvent = {
      id,
      ...eventData
    };
    
    set((state: any) => ({
      calendarEvents: [...state.calendarEvents, newEvent],
    }));
    
    // Schedule notification if reminder is set
    if (eventData.reminder && eventData.startDate) {
      const eventDate = new Date(eventData.startDate);
      const reminderDate = new Date(eventDate.getTime() - eventData.reminder * 60 * 1000);
      
      if (reminderDate > new Date()) {
        scheduleNotification(
          `Lembrete: ${eventData.title}`,
          `O evento "${eventData.title}" começará em breve.`,
          reminderDate
        );
      }
    }
    
    return newEvent;
  },
  
  updateCalendarEvent: (event: CalendarEvent) => {
    set((state: any) => ({
      calendarEvents: state.calendarEvents.map((e: CalendarEvent) => 
        e.id === event.id ? event : e
      ),
    }));
    
    // Schedule notification if reminder is set
    if (event.reminder && event.startDate) {
      const eventDate = new Date(event.startDate);
      const reminderDate = new Date(eventDate.getTime() - event.reminder * 60 * 1000);
      
      if (reminderDate > new Date()) {
        scheduleNotification(
          `Lembrete: ${event.title}`,
          `O evento "${event.title}" começará em breve.`,
          reminderDate
        );
      }
    }
  },
  
  deleteCalendarEvent: (id: string) => {
    set((state: any) => ({
      calendarEvents: state.calendarEvents.filter((e: CalendarEvent) => e.id !== id),
    }));
  },
  
  getCalendarEventsInRange: (startDate: Date, endDate: Date) => {
    const { calendarEvents } = get();
    
    return calendarEvents.filter((event: CalendarEvent) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
      
      return (
        (eventStart >= startDate && eventStart <= endDate) || // Event starts in range
        (eventEnd >= startDate && eventEnd <= endDate) || // Event ends in range
        (eventStart <= startDate && eventEnd >= endDate) // Event spans the range
      );
    });
  }
});
