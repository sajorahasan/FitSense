// Date utility functions for FitSense

/**
 * Format a date for display
 */
export function formatDate(
  date: Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  }).format(date);
}

/**
 * Format a time for display
 */
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/**
 * Format date and time together
 */
export function formatDateTime(date: Date): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return formatDate(date);
}

/**
 * Check if two dates are on the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Get start of day for a date
 */
export function startOfDay(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

/**
 * Get end of day for a date
 */
export function endOfDay(date: Date): Date {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Subtract days from a date
 */
export function subDays(date: Date, days: number): Date {
  return addDays(date, -days);
}

/**
 * Convert DD/MM/YYYY string to timestamp (number)
 * @param dateString - Date string in DD/MM/YYYY format
 * @returns Timestamp in milliseconds
 * @throws Error if date string is invalid
 */
export function dateStringToTimestamp(dateString: string): number {
  if (!dateString.trim()) {
    throw new Error("Date string cannot be empty");
  }

  // Remove any whitespace
  const cleanDateString = dateString.trim();

  // Check if the string matches DD/MM/YYYY format
  const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const match = cleanDateString.match(dateRegex);

  if (!match) {
    throw new Error("Date must be in DD/MM/YYYY format");
  }

  const [, day, month, year] = match;
  const dayNum = Number.parseInt(day, 10);
  const monthNum = Number.parseInt(month, 10);
  const yearNum = Number.parseInt(year, 10);

  // Validate day and month ranges
  if (dayNum < 1 || dayNum > 31) {
    throw new Error("Day must be between 1 and 31");
  }
  if (monthNum < 1 || monthNum > 12) {
    throw new Error("Month must be between 1 and 12");
  }
  if (yearNum < 1900 || yearNum > 2100) {
    throw new Error("Year must be between 1900 and 2100");
  }

  // Create date object (month is 0-indexed in JavaScript Date)
  const date = new Date(yearNum, monthNum - 1, dayNum);

  // Validate that the date is valid (handles cases like 31/02/2024)
  if (
    date.getDate() !== dayNum ||
    date.getMonth() !== monthNum - 1 ||
    date.getFullYear() !== yearNum
  ) {
    throw new Error("Invalid date");
  }

  return date.getTime();
}

/**
 * Convert timestamp to DD/MM/YYYY string
 * @param timestamp - Timestamp in milliseconds
 * @returns Date string in DD/MM/YYYY format
 */
export function timestampToDateString(timestamp: number): string {
  const date = new Date(timestamp);

  // Check if the date is valid
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid timestamp");
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
  const year = date.getFullYear().toString();

  return `${day}/${month}/${year}`;
}

/**
 * Convert DD/MM/YYYY string to ISO string
 * @param dateString - Date string in DD/MM/YYYY format
 * @returns ISO string representation of the date
 */
export function dateStringToISO(dateString: string): string {
  const timestamp = dateStringToTimestamp(dateString);
  return new Date(timestamp).toISOString();
}

/**
 * Convert ISO string to DD/MM/YYYY string
 * @param isoString - ISO string representation of the date
 * @returns Date string in DD/MM/YYYY format
 */
export function isoToDateString(isoString: string): string {
  const timestamp = new Date(isoString).getTime();
  return timestampToDateString(timestamp);
}
