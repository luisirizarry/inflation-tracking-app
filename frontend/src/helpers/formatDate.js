/**
 * Format date for display in charts and statistics
 *
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string (e.g. "Jan 2025")
 */
export default function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}
