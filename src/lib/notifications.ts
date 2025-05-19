
// Check if browser supports notifications
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("Este navegador não suporta notificações desktop");
    return false;
  }
  
  if (Notification.permission === "granted") {
    return true;
  }
  
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  
  return false;
};

export const showNotification = (title: string, body: string, icon?: string) => {
  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      body,
      icon: icon || "/favicon.ico",
    });
    
    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);
    
    // Play sound if available
    try {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(e => console.log('Não foi possível tocar som de notificação:', e));
    } catch (e) {
      console.log('Erro ao tocar som de notificação:', e);
    }
    
    return notification;
  }
  
  return null;
};

// Adding the missing function
export const sendPomodoroNotification = (title: string, message: string) => {
  showNotification(title, message, '/favicon.ico');
};

// Scheduled notifications manager
interface PendingNotification {
  id: string;
  title: string;
  body: string;
  scheduledTime: Date;
  timeoutId: number;
  eventId?: string; // Add eventId to track which event a notification belongs to
}

const pendingNotifications: PendingNotification[] = [];

export const scheduleNotification = (
  title: string,
  body: string,
  scheduledTime: Date,
  eventId?: string // Optional eventId parameter
) => {
  const now = new Date();
  if (scheduledTime <= now) {
    // If the scheduled time is in the past, show notification immediately
    showNotification(title, body);
    return null;
  }
  
  const timeUntilNotification = scheduledTime.getTime() - now.getTime();
  
  const id = crypto.randomUUID();
  const timeoutId = window.setTimeout(() => {
    showNotification(title, body);
    // Remove from pending
    const index = pendingNotifications.findIndex(n => n.id === id);
    if (index !== -1) {
      pendingNotifications.splice(index, 1);
    }
    console.log(`Notificação exibida: ${title} - ${body}`);
  }, timeUntilNotification);
  
  // Store the pending notification
  pendingNotifications.push({
    id,
    title,
    body,
    scheduledTime,
    timeoutId,
    eventId
  });
  
  console.log(`Notificação agendada para ${scheduledTime.toLocaleString()} (em ${Math.floor(timeUntilNotification/60000)} minutos)`);
  
  return id;
};

export const cancelScheduledNotification = (id: string) => {
  const index = pendingNotifications.findIndex(n => n.id === id);
  if (index !== -1) {
    window.clearTimeout(pendingNotifications[index].timeoutId);
    pendingNotifications.splice(index, 1);
    console.log(`Notificação cancelada: ${id}`);
    return true;
  }
  return false;
};

// Cancel all notifications for a specific event
export const cancelEventNotifications = (eventId: string) => {
  const notificationsToCancel = pendingNotifications.filter(n => n.eventId === eventId);
  
  notificationsToCancel.forEach(notification => {
    cancelScheduledNotification(notification.id);
  });
  
  return notificationsToCancel.length > 0;
};

export const getPendingNotifications = () => {
  return [...pendingNotifications];
};
