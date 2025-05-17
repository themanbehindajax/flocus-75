
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
    
    return notification;
  }
  
  return null;
};

// Scheduled notifications manager
interface PendingNotification {
  id: string;
  title: string;
  body: string;
  scheduledTime: Date;
  timeoutId: number;
}

const pendingNotifications: PendingNotification[] = [];

export const scheduleNotification = (
  title: string,
  body: string,
  scheduledTime: Date
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
  }, timeUntilNotification);
  
  // Store the pending notification
  pendingNotifications.push({
    id,
    title,
    body,
    scheduledTime,
    timeoutId,
  });
  
  return id;
};

export const cancelScheduledNotification = (id: string) => {
  const index = pendingNotifications.findIndex(n => n.id === id);
  if (index !== -1) {
    window.clearTimeout(pendingNotifications[index].timeoutId);
    pendingNotifications.splice(index, 1);
    return true;
  }
  return false;
};

export const getPendingNotifications = () => {
  return [...pendingNotifications];
};
