import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import InflationApi from "../../api/InflationApi";
import AuthContext from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import "./CategoryDetail.css";

function CategoryDetail() {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);

  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPreferences, setUserPreferences] = useState([]);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        setLoading(true);

        // Fetch category data
        const result = await InflationApi.getItemsByCategory(id);

        // Check if we received the expected structure
        if (!result || !result.categoryWithItems) {
          console.error("Invalid API response structure:", result);
          setError("Invalid data received from server");
          return;
        }

        setCategory(result.categoryWithItems);
        const categoryItems = result.categoryWithItems.items || [];
        setItems(categoryItems);

        // Fetch aggregated inflation data for this category
        const latestData = await InflationApi.getLatestInflationData();

        // Filter and add item names from categoryItems
        const filteredCategoryData = latestData
          .filter((dataItem) =>
            categoryItems.some(
              (catItem) => catItem.id === dataItem.tracked_item_id
            )
          )
          .map((dataItem) => {
            // Find the matching category item to get its name
            const matchingItem = categoryItems.find(
              (catItem) => catItem.id === dataItem.tracked_item_id
            );

            // Add the name to the data item
            return {
              ...dataItem,
              name: matchingItem
                ? matchingItem.name
                : `Unknown Item ${dataItem.tracked_item_id}`,
            };
          });

        // Format chart data
        const processedData = processChartData(filteredCategoryData);
        setChartData(processedData);
      } catch (err) {
        console.error("Error loading category details:", err);
        setError("Failed to load category details");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [id, currentUser]);

  const processChartData = (data) => {
    // Get a common month from the data
    const monthYearStr =
      data.length > 0
        ? new Date(data[0].date).toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })
        : "";

    // Transform the data for a bar chart comparing items
    return {
      monthYear: monthYearStr,
      items: data.map((item, index) => ({
        name: item.name, // Use item name on X-axis
        value: parseFloat(item.value).toFixed(2), // Inflation value as bar height
        color: getBarColor(index), // Assign a unique color to each bar
        date: new Date(item.date).toLocaleDateString(), // Keep date for tooltip
      })),
    };
  };

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

  const handleTrackItem = async (itemId) => {
    if (!currentUser) return;

    try {
      if (userPreferences.includes(itemId)) {
        // Untrack item
        const result = await InflationApi.removePreference(
          currentUser.id,
          itemId
        );
        setUserPreferences(userPreferences.filter((id) => id !== itemId));
      } else {
        // Track item
        const result = await InflationApi.addPreference(currentUser.id, itemId);
        setUserPreferences([...userPreferences, itemId]);
      }
    } catch (err) {
      console.error("Error updating tracking preference:", err);
    }
  };

  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!currentUser) {
        setUserPreferences([]);
        return;
      }

      try {
        const preferences = await InflationApi.getUserPreferences(
          currentUser.id
        );

        const preferenceIds = Array.isArray(preferences)
          ? preferences.map((pref) => pref.tracked_item_id)
          : preferences && Array.isArray(preferences.items)
          ? preferences.items.map((item) => item.id)
          : [];

        setUserPreferences(preferenceIds);
      } catch (err) {
        console.error("Error loading user preferences:", err);
      }
    };

    loadUserPreferences();
  }, [currentUser]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!category) return <div className="not-found">Category not found</div>;

  return (
    <div className="category-detail">
      {/* Category Info Section */}
      <div className="category-header">
        <h1>{category.name}</h1>
        <p className="category-description">{category.description}</p>
      </div>
      {/* Category Inflation Trends Chart */}
      <div className="category-chart-section">
        <h2>Category Inflation Comparison - {chartData.monthYear}</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData.items}
              margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis axisLine={false} tick={false} />
              <YAxis
                label={{
                  value: "Inflation %",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                formatter={(value, _, props) => [
                  `${value}%`,
                  props.payload.name,
                ]}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              <Bar
                dataKey="value"
                name="Inflation Rate %"
                isAnimationActive
                animationDuration={1000}
                shape={(props) => {
                  const { x, y, width, height, payload } = props;
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={payload.color}
                    />
                  );
                }}
              >
                <LabelList
                  dataKey="name"
                  position="bottom"
                  offset={10}
                  style={{ fontSize: 12 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* List of Items in Category */}
      <div className="category-items-section">
        <h2>Items in this Category</h2>

        {items.length === 0 ? (
          <p className="no-items">No items found in this category.</p>
        ) : (
          <div className="items-grid">
            {items.map((item) => (
              <div key={item.id} className="item-card">
                <h3>{item.name}</h3>
                <p className="item-series">Series ID: {item.series_id}</p>

                <div className="item-actions">
                  <Link to={`/items/${item.id}`} className="view-details-btn">
                    View Details
                  </Link>

                  {currentUser && (
                    <button
                      className={`track-btn ${
                        userPreferences.includes(item.id) ? "tracked" : ""
                      }`}
                      onClick={() => handleTrackItem(item.id)}
                    >
                      {userPreferences.includes(item.id) ? "Untrack" : "Track"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryDetail;
