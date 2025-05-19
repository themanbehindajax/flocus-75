
import { CalendarState, SetFunction, GetFunction } from '../types';
import { CalendarEvent } from '../../types';
import { scheduleNotification } from '../../notifications';
import { formatInTimeZone } from 'date-fns-tz';

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
        // Format time for notification using São Paulo timezone
        const eventTime = formatInTimeZone(eventDate, 'America/Sao_Paulo', 'HH:mm');
        
        scheduleNotification(
          `Lembrete: ${eventData.title}`,
          `O evento "${eventData.title}" começará às ${eventTime}.`,
          reminderDate
        );
        
        console.log(`Notificação agendada para ${reminderDate.toLocaleString()} (${eventData.reminder} minutos antes do evento)`);
      } else {
        console.log("Não foi possível agendar notificação: data de lembrete já passou");
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
        // Format time for notification using São Paulo timezone
        const eventTime = formatInTimeZone(eventDate, 'America/Sao_Paulo', 'HH:mm');
        
        scheduleNotification(
          `Lembrete: ${event.title}`,
          `O evento "${event.title}" começará às ${eventTime}.`,
          reminderDate
        );
        
        console.log(`Notificação atualizada para ${reminderDate.toLocaleString()} (${event.reminder} minutos antes do evento)`);
      } else {
        console.log("Não foi possível agendar notificação: data de lembrete já passou");
      }
    }
  },
  
  deleteCalendarEvent: (id) => {
    set((state) => ({
      calendarEvents: state.calendarEvents.filter((e: CalendarEvent) => e.id !== id),
    }));
  },
});
