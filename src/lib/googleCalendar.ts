
/**
 * Utility functions for Google Calendar integration
 */

// Function to add a task to Google Calendar
export const addTaskToCalendar = async (
  token: string,
  taskTitle: string,
  description: string = "",
  startDateTime: string,
  endDateTime?: string
) => {
  try {
    const calendarEvent = {
      summary: taskTitle,
      description: description,
      start: {
        dateTime: startDateTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDateTime || new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(calendarEvent),
      }
    );

    if (!response.ok) {
      throw new Error(`Error adding event to calendar: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding event to Google Calendar:", error);
    throw error;
  }
};

// Function to fetch calendar events
export const fetchCalendarEvents = async (
  token: string,
  timeMin?: string,
  timeMax?: string
) => {
  try {
    const now = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(now.getMonth() + 1);

    const params = new URLSearchParams({
      timeMin: timeMin || now.toISOString(),
      timeMax: timeMax || oneMonthFromNow.toISOString(),
      singleEvents: "true",
      orderBy: "startTime",
    });

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching calendar events: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error);
    throw error;
  }
};
