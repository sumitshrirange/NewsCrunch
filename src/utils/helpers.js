/**
 * Format a date string as "X min/h/d ago".
 */
export const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const then = new Date(dateStr);
  if (isNaN(then)) return dateStr;
  const diff = Math.floor((Date.now() - then) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

/**
 * Pad a number to 2 digits: 1 → "01".
 */
export const pad2 = (n) => String(n).padStart(2, "0");

/**
 * Extract first name from full name.
 */
export const firstName = (name = "") => name.split(" ")[0] || name;

/**
 * Get initials (up to 2 chars) from a full name.
 */
export const initials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";
