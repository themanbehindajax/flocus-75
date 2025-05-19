
import { v4 as uuidv4 } from "uuid";
import { CalendarState, SetFunction, GetFunction } from '../types';
import { CalendarEvent } from '../../types';
import { scheduleNotification } from '../../notifications';

export const createCalendarSlice = (set: SetFunction, get: GetFunction): CalendarState => ({
  calendarEvents: [],
  
  addCalendarEvent: (eventData) => {
    const id = crypto.randomUUID();
    const newEvent: CalendarEvent = {
      id,
      ...eventData
    };
    
    set((state) => ({
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
  
  updateCalendarEvent: (event) => {
    set((state) => ({
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
  
  deleteCalendarEvent: (id) => {
    set((state) => ({
      calendarEvents: state.calendarEvents.filter((e: CalendarEvent) => e.id !== id),
    }));
  },
});
