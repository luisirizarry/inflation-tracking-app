/**
 * Process and sort inflation data for chart display
 *
 * @param {Array} data - Raw inflation data from API
 * @returns {Array} Processed and sorted data points
 */
export default function processInflationData(data) {
  if (!data || data.length === 0) return [];

  // Process and format data for chart
  const processedData = data.map((point) => ({
    ...point,
    date: new Date(point.date),
    value: parseFloat(point.value),
  }));

  // Sort by date (oldest to newest for chart)
  return [...processedData].sort((a, b) => a.date - b.date);
}
