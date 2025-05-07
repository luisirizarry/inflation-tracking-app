const prepareCategoryBarData = (inflationData, categories) => {
  // Group inflation data by categories
  const categoryAverages = {};
  
  categories.forEach(category => {
    categoryAverages[category.id] = {
      name: category.name,
      total: 0,
      count: 0,
    };
  });
  
  // Assign data to categories (using the same temp method as calculateSummaryStats)
  inflationData.forEach((item, index) => {
    const categoryIndex = index % categories.length;
    const categoryId = categories[categoryIndex].id;
    
    if (item.value) {
      categoryAverages[categoryId].total += parseFloat(item.value);
      categoryAverages[categoryId].count += 1;
    }
  });
  
  // Format for bar chart
  const barChartData = Object.values(categoryAverages)
    .filter(cat => cat.count > 0)
    .map((cat, index) => ({
      name: cat.name,
      value: (cat.total / cat.count).toFixed(2),
      color: getBarColor(index) // Use the same getBarColor function you had in CategoryDetail
    }))
    .sort((a, b) => parseFloat(b.value) - parseFloat(a.value)); // Sort by value
  
  return barChartData;
};

// Add this color function
function getBarColor(index) {
  const colors = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe",
    "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF6384"
  ];
  return colors[index % colors.length];
}

export default prepareLineChartData;