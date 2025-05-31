
import moment from 'moment-timezone';
import { t } from './translations';

// List of most common timezones in Brazil and worldwide
export const TIMEZONE_OPTIONS = [
  { value: 'America/Sao_Paulo', label: t('timezone_brasilia') },
  { value: 'America/Manaus', label: t('timezone_manaus') },
  { value: 'America/Rio_Branco', label: t('timezone_rio_branco') },
  { value: 'America/Noronha', label: t('timezone_noronha') },
  { value: 'UTC', label: t('timezone_utc') },
  { value: 'America/New_York', label: t('timezone_new_york') },
  { value: 'America/Los_Angeles', label: t('timezone_los_angeles') },
  { value: 'Europe/London', label: t('timezone_london') },
  { value: 'Europe/Paris', label: t('timezone_paris') },
  { value: 'Asia/Tokyo', label: t('timezone_tokyo') },
  { value: 'Asia/Shanghai', label: t('timezone_shanghai') },
  { value: 'Australia/Sydney', label: t('timezone_sydney') },
];

export const getDefaultTimezone = (): string => {
  // Detect user's timezone or use São Paulo as default
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Check if user's timezone is in our list
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
