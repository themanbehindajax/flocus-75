
import { useAppStore } from "@/lib/store";
import { formatDateInTimezone, getCurrentTimeInTimezone } from "@/lib/timezone";

export const useTimezone = () => {
  const { timezone } = useAppStore();
  
  const formatDate = (date: string | Date, format?: string) => {
    return formatDateInTimezone(date, timezone || 'America/Sao_Paulo', format);
  };
  
  const getCurrentTime = () => {
    return getCurrentTimeInTimezone(timezone || 'America/Sao_Paulo');
  };
  
  const formatRelativeTime = (date: string | Date) => {
    return formatDateInTimezone(date, timezone || 'America/Sao_Paulo', 'DD/MM/YYYY HH:mm');
  };
  
  return {
    timezone: timezone || 'America/Sao_Paulo',
    formatDate,
    getCurrentTime,
    formatRelativeTime
  };
};
