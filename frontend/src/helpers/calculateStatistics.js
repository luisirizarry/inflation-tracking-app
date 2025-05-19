/**
 * Calculate statistics from an array of inflation data points
 *
 * @param {Array} data - Array of data points with value property
 * @returns {Object} Object containing min, max, avg, change and percentChange
 */
export default function calculateStatistics(data) {
  if (!data || data.length === 0) {
    return {
      min: null,
      max: null,
      avg: null,
      change: null,
      percentChange: null,
    };
  }

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

  // Calculate change from first to last point
  const first = data[0].value;
  const last = data[data.length - 1].value;
  const change = last - first;
  const percentChange = ((last - first) / first) * 100;

  return {
    min,
    max,
    avg,
    change,
    percentChange,
  };
}
