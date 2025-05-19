/**
 * Filter inflation data by date range
 *
 * @param {Array} data - Raw inflation data from API
 * @param {string} startDate - Start date in ISO format
 * @param {string} endDate - End date in ISO format
 * @returns {Array} Filtered data points
 */
export default function filterDataByDateRange(data, startDate, endDate) {
  if (!data || data.length === 0 || !startDate || !endDate) return data;

  const startDateTime = new Date(startDate).getTime();
  const endDateTime = new Date(endDate).getTime();

  return data.filter((point) => {
    const pointDate = new Date(point.date).getTime();
    return pointDate >= startDateTime && pointDate <= endDateTime;
  });
}
