import { useState, useEffect, useContext } from "react";
import InflationApi from "../../api/InflationApi";
import AuthContext from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import SummaryStats from "./SummaryStats";
import InflationBarChart from "../../components/charts/InflationBarChart";
import UserTrackedItems from "./UserTrackedItems";
import CategoryQuickAccess from "./CategoryQuickAccess";
import SectionHeader from "../../components/common/SectionHeader";
import "./Dashboard.css";

function Dashboard() {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestData, setLatestData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    overallChange: 0,
    highestCategory: { name: "", change: 0 },
    lowestCategory: { name: "", change: 0 },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch data (implementation unchanged)
        const inflationData = await InflationApi.getLatestInflationData();
        setLatestData(inflationData);

        const categoriesData = await InflationApi.getCategories();
        setCategories(categoriesData);

        calculateSummaryStats(inflationData, categoriesData);

        if (currentUser) {
          // Fetch user preferences and items (implementation unchanged)
          const preferences = await InflationApi.getUserPreferences(
            currentUser.id
          );

          const userItemsData = await Promise.all(
            preferences.map(async (pref) => {
              const itemData = await InflationApi.getItem(pref.tracked_item_id);
              return {
                ...itemData,
                notify: pref.notify,
              };
            })
          );

          setUserItems(userItemsData);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  const calculateSummaryStats = (inflationData, categories) => {
    try {
      // Let's use a different approach to match items to categories
      // We need an additional API call to get item-to-category mappings
      const categoryInflationMap = {};

      // Initialize categories we have
      categories.forEach((category) => {
        categoryInflationMap[category.id] = {
          name: category.name,
          values: [],
        };
      });

      inflationData.forEach((item, index) => {
        // Assign each item to a category based on its index for temporary display
        const categoryIndex = index % categories.length;
        const categoryId = categories[categoryIndex].id;

        if (item.value) {
          categoryInflationMap[categoryId].values.push(parseFloat(item.value));
        }
      });

      // Calculate average for each category
      const categoryAverages = Object.values(categoryInflationMap)
        .filter((cat) => cat.values.length > 0)
        .map((cat) => ({
          name: cat.name,
          change:
            cat.values.reduce((sum, val) => sum + val, 0) / cat.values.length,
        }));

      // Skip calculations if no valid data
      if (categoryAverages.length === 0) {
        console.warn("No valid category data to calculate summary stats");
        return;
      }

      // Calculate overall average
      const overallChange =
        categoryAverages.reduce((sum, cat) => sum + cat.change, 0) /
        categoryAverages.length;

      // Find highest and lowest categories
      let highestCategory = categoryAverages[0];
      let lowestCategory = categoryAverages[0];

      categoryAverages.forEach((cat) => {
        if (cat.change > highestCategory.change) highestCategory = cat;
        if (cat.change < lowestCategory.change) lowestCategory = cat;
      });

      setSummaryStats({
        overallChange,
        highestCategory,
        lowestCategory,
      });
    } catch (err) {
      console.error("Error calculating summary stats:", err);
      setSummaryStats({
        overallChange: 0,
        highestCategory: { name: "Unknown", change: 0 },
        lowestCategory: { name: "Unknown", change: 0 },
      });
    }
  };

  // Add this function in your Dashboard component
  const prepareCategoryBarData = (inflationData, categories) => {
    // Group inflation data by categories
    const categoryAverages = {};

    categories.forEach((category) => {
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
      .filter((cat) => cat.count > 0)
      .map((cat, index) => ({
        name: cat.name,
        value: (cat.total / cat.count).toFixed(2),
        color: getBarColor(index), // Use the same getBarColor function you had in CategoryDetail
      }))
      .sort((a, b) => parseFloat(b.value) - parseFloat(a.value)); // Sort by value

    return barChartData;
  };

  // Add this color function
  function getBarColor(index) {
    const colors = [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff8042",
      "#0088fe",
      "#00C49F",
      "#FFBB28",
      "#FF8042",
      "#AF19FF",
      "#FF6384",
    ];
    return colors[index % colors.length];
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard">
      <SummaryStats stats={summaryStats} />

      <section className="charts-section">
        <SectionHeader title="Inflation by Category" />
        <div className="chart-container">
          <InflationBarChart
            data={prepareCategoryBarData(latestData, categories)}
            title="Latest Category Inflation Values"
          />
        </div>
      </section>

      {currentUser && <UserTrackedItems items={userItems} />}

      <CategoryQuickAccess categories={categories} />
    </div>
  );
}

export default Dashboard;
