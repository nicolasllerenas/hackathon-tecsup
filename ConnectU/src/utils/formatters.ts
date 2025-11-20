import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { es } from "date-fns/locale";

// Format timestamp for chat messages
export const formatMessageTime = (timestamp: string | Date): string => {
  const date = new Date(timestamp);

  if (isToday(date)) {
    return format(date, "HH:mm");
  }

  if (isYesterday(date)) {
    return `Ayer ${format(date, "HH:mm")}`;
  }

  return format(date, "dd/MM HH:mm");
};

// Format relative time
export const formatRelativeTime = (timestamp: string | Date): string => {
  return formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
    locale: es,
  });
};

// Format date for sessions
export const formatSessionDate = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  return format(date, "EEEE, dd 'de' MMMM 'a las' HH:mm", { locale: es });
};

// Format risk score
export const formatRiskScore = (
  score: number
): {
  label: string;
  color: string;
  variant: "success" | "warning" | "danger";
} => {
  if (score >= 70) {
    return { label: "Alto", color: "#ef4444", variant: "danger" };
  }
  if (score >= 40) {
    return { label: "Medio", color: "#f59e0b", variant: "warning" };
  }
  return { label: "Bajo", color: "#10b981", variant: "success" };
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

// Get initials from name
export const getInitials = (firstName: string, lastName?: string): string => {
  if (lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  return firstName.slice(0, 2).toUpperCase();
};

// Format number with K suffix
export const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate institutional email
export const isInstitutionalEmail = (email: string): boolean => {
  return email.endsWith(".edu.pe");
};
