
/**
 * Handles browser notifications
 */

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
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

// Send a browser notification
export const sendNotification = (title: string, options?: NotificationOptions): Notification | null => {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return null;
  }
  
  const notification = new Notification(title, options);
  return notification;
};

// Send a task due notification
export const sendTaskDueNotification = (task: { title: string; description?: string }) => {
  return sendNotification(`Tarefa: ${task.title}`, {
    body: task.description || "Esta tarefa está prestes a vencer.",
    icon: "/favicon.ico",
    tag: `task-${Date.now()}`,
  });
};

// Send a pomodoro notification
export const sendPomodoroNotification = (title: string, message: string) => {
  return sendNotification(title, {
    body: message,
    icon: "/favicon.ico",
    tag: `pomodoro-${Date.now()}`,
  });
};

// Check for tasks due soon and send notifications
export const checkTasksAndNotify = (tasks: any[], minutesThreshold: number = 15) => {
  const now = new Date();
  const soon = new Date(now.getTime() + minutesThreshold * 60 * 1000);
  
  tasks.forEach(task => {
    if (task.dueDate && !task.completed) {
      const dueDate = new Date(task.dueDate);
      
      if (dueDate > now && dueDate <= soon) {
        sendTaskDueNotification(task);
      }
    }
  });
};
