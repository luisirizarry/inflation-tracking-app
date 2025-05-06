import { useState, useEffect, useContext } from "react";
import InflationApi from "../../api/InflationApi";
import AuthContext from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import SummaryStats from "./SummaryStats";
import InflationLineChart from "../../components/charts/InflationLineChart";
import CategoryBarChart from "../../components/charts/CategoryBarChart";
import DistributionPieChart from "../../components/charts/DistributionPieChart";
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
    // Implementation unchanged
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard">
      <SummaryStats stats={summaryStats} />
  
      <section className="charts-section">
        <SectionHeader title="Recent Inflation Trends" />
        <div className="chart-container">
          <InflationLineChart data={latestData} />
        </div>
  
        <div className="chart-grid">
          <div className="chart-container">
            <h3>By Category</h3>
            <CategoryBarChart data={categories.slice(0, 5)} />
          </div>
  
          <div className="chart-container">
            <h3>Distribution</h3>
            <DistributionPieChart data={categories.slice(0, 5)} />
          </div>
        </div>
      </section>
  
      {currentUser && <UserTrackedItems items={userItems} />}
  
      <CategoryQuickAccess categories={categories} />
    </div>
  );
}

export default Dashboard;
