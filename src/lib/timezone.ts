
import moment from 'moment-timezone';

// Lista dos fusos horários mais comuns do Brasil e do mundo
export const TIMEZONE_OPTIONS = [
  { value: 'America/Sao_Paulo', label: 'Brasília (UTC-3)' },
  { value: 'America/Manaus', label: 'Manaus (UTC-4)' },
  { value: 'America/Rio_Branco', label: 'Rio Branco (UTC-5)' },
  { value: 'America/Noronha', label: 'Fernando de Noronha (UTC-2)' },
  { value: 'UTC', label: 'UTC (UTC+0)' },
  { value: 'America/New_York', label: 'Nova York (UTC-5/-4)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (UTC-8/-7)' },
  { value: 'Europe/London', label: 'Londres (UTC+0/+1)' },
  { value: 'Europe/Paris', label: 'Paris (UTC+1/+2)' },
  { value: 'Asia/Tokyo', label: 'Tóquio (UTC+9)' },
  { value: 'Asia/Shanghai', label: 'Xangai (UTC+8)' },
  { value: 'Australia/Sydney', label: 'Sydney (UTC+10/+11)' },
];

export const getDefaultTimezone = (): string => {
  // Detecta o fuso horário do usuário ou usa São Paulo como padrão
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Verifica se o fuso horário do usuário está na nossa lista
  const isSupported = TIMEZONE_OPTIONS.some(tz => tz.value === userTimezone);
  
  return isSupported ? userTimezone : 'America/Sao_Paulo';
};

export const formatDateInTimezone = (date: string | Date, timezone: string, format: string = 'DD/MM/YYYY HH:mm'): string => {
  return moment.tz(date, timezone).format(format);
};

export const getCurrentTimeInTimezone = (timezone: string): string => {
  return moment.tz(timezone).format('HH:mm');
};

export const convertToTimezone = (date: string | Date, fromTimezone: string, toTimezone: string): Date => {
  return moment.tz(date, fromTimezone).tz(toTimezone).toDate();
};
