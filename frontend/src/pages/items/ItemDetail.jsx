import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import InflationApi from "../../api/InflationApi";
import AuthContext from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import formatDate from "../../helpers/formatDate";
import calculateStatistics from "../../helpers/calculateStatistics";
import processInflationData from "../../helpers/processInflationData";
import filterDataByDateRange from "../../helpers/filterDataByDateRange";
import "./ItemDetail.css";

function ItemDetail() {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [item, setItem] = useState(null);
  const [category, setCategory] = useState(null);
  const [inflationData, setInflationData] = useState([]);
  const [isTracked, setIsTracked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRangeError, setDateRangeError] = useState(null);
  
  // Date range state (default to last 12 months)
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1); // 1 year ago
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0]; // Today
  });
  
  // Statistics
  const [stats, setStats] = useState({
    min: null,
    max: null,
    avg: null,
    change: null,
    percentChange: null
  });
  
  // Fetch data when component mounts or when id changes
  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        setDateRangeError(null);
        
        // Fetch item details
        const itemData = await InflationApi.getItem(id);
        setItem(itemData);
        
        // Fetch category information
        if (itemData?.category_id) {
          const categoryData = await InflationApi.getCategory(itemData.category_id);
          setCategory(categoryData);
        }
        
        // Check if user is tracking this item
        if (currentUser) {
          try {
            const preferences = await InflationApi.getUserPreferences(currentUser.id);
            setIsTracked(preferences.some(pref => pref.tracked_item_id === parseInt(id)));
          } catch (err) {
            console.error("Error checking tracking status:", err);
          }
        }
        
        // Fetch inflation data for date range
        await fetchInflationData(id, startDate, endDate);
        
      } catch (err) {
        console.error("Error fetching item details:", err);
        setError("Failed to load item details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchItemDetails();
  }, [id, currentUser]);
  
  // Function to fetch inflation data with date range
  const fetchInflationData = async (itemId, start, end) => {
    try {
      setDateRangeError(null);
      
      // Try to use date range endpoint if both dates are provided
      let data;
      if (start && end) {
        try {
          data = await InflationApi.getInflationRange(itemId, start, end);
        } catch (err) {
          // If range API fails, try getting all data and filtering
          const allData = await InflationApi.getItemInflationData(itemId);
          data = filterDataByDateRange(allData, start, end);
        }
      } else {
        // Fallback to all data
        data = await InflationApi.getItemInflationData(itemId);
      }
      
      if (!data || data.length === 0) {
        setDateRangeError("No data available for the selected date range. Try a different range.");
        // Get all data instead to show something
        data = await InflationApi.getItemInflationData(itemId);
      }
      
      // Process data using helper function
      const processedData = processInflationData(data);
      setInflationData(processedData);
      
      // Calculate statistics using helper function and update state
      const statsData = calculateStatistics(processedData);
      setStats(statsData);
      
    } catch (err) {
      console.error("Error fetching inflation data:", err);
      setDateRangeError("Failed to load inflation data for the selected range.");
    }
  };
  
  // Handle date range change
  const handleDateChange = async () => {
    if (!id) return;
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      setDateRangeError("Start date cannot be after end date.");
      return;
    }
    
    // Check for too large date range (optional limit)
    const diffYears = (end - start) / (1000 * 60 * 60 * 24 * 365);
    if (diffYears > 10) {
      setDateRangeError("Please select a date range of 10 years or less.");
      return;
    }
    
    setLoading(true);
    await fetchInflationData(id, startDate, endDate);
    setLoading(false);
  };
  
  // Toggle tracking status
  const handleToggleTracking = async () => {
    if (!currentUser || !id) return;
    
    try {
      if (isTracked) {
        await InflationApi.removePreference(currentUser.id, parseInt(id));
      } else {
        await InflationApi.addPreference(currentUser.id, parseInt(id));
      }
      setIsTracked(!isTracked);
    } catch (err) {
      console.error("Error updating tracking status:", err);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="item-detail error-state">
        <h1>Error</h1>
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">Try Again</button>
      </div>
    );
  }
  
  if (!item) {
    return (
      <div className="item-detail error-state">
        <h1>Item Not Found</h1>
        <p>The requested item could not be found.</p>
        <Link to="/categories" className="back-link">Browse Categories</Link>
      </div>
    );
  }

  return (
    <div className="item-detail">
      <div className="item-header">
        <div className="item-title-area">
          <h1>{item.name}</h1>
          {category && (
            <Link to={`/categories/${category.id}`} className="category-badge">
              {category.name}
            </Link>
          )}
        </div>
        
        {currentUser && (
          <button 
            className={`track-button ${isTracked ? 'tracking' : ''}`}
            onClick={handleToggleTracking}
          >
            {isTracked ? 'Untrack Item' : 'Track Item'}
          </button>
        )}
      </div>
      
      <div className="item-info">
        <p className="series-id">Series ID: {item.series_id}</p>
        {category?.description && <p className="category-description">{category.description}</p>}
      </div>
      
      <div className="date-range-selector">
        <h3>Select Date Range</h3>
        <div className="date-inputs">
          <label>
            Start:
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            End:
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
            />
          </label>
          <button onClick={handleDateChange} className="apply-button">Apply</button>
        </div>
        
        {dateRangeError && (
          <div className="date-range-error">{dateRangeError}</div>
        )}
      </div>
      
      <div className="inflation-data-container">
        <h2>Inflation Trend</h2>
        {inflationData.length === 0 ? (
          <div className="no-data">No data available for this item.</div>
        ) : (
          <>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={inflationData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={date => formatDate(date)}
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={date => formatDate(date)}
                    formatter={(value) => [`${value.toFixed(2)}`, 'Value']}
                  />
                  <ReferenceLine
                    y={stats.avg}
                    stroke="#888"
                    strokeDasharray="3 3"
                    label={{ value: "Avg", position: "left" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3498db"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="stats-container">
              <div className="stat-box">
                <span className="stat-title">Start Value</span>
                <span className="stat-value">{inflationData[0]?.value.toFixed(2)}</span>
                <span className="stat-date">{formatDate(inflationData[0]?.date)}</span>
              </div>
              
              <div className="stat-box">
                <span className="stat-title">Latest Value</span>
                <span className="stat-value">{inflationData[inflationData.length-1]?.value.toFixed(2)}</span>
                <span className="stat-date">{formatDate(inflationData[inflationData.length-1]?.date)}</span>
              </div>
              
              <div className="stat-box">
                <span className="stat-title">Change</span>
                <span className={`stat-value ${stats.change >= 0 ? 'positive' : 'negative'}`}>
                  {stats.change >= 0 ? '+' : ''}{stats.change?.toFixed(2)} 
                  ({stats.percentChange >= 0 ? '+' : ''}{stats.percentChange?.toFixed(2)}%)
                </span>
                <span className="stat-period">Over selected period</span>
              </div>
              
              <div className="stat-box">
                <span className="stat-title">Min/Max</span>
                <span className="stat-value">
                  {stats.min?.toFixed(2)} / {stats.max?.toFixed(2)}
                </span>
                <span className="stat-range">Range: {(stats.max - stats.min)?.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="data-points-info">
              Showing {inflationData.length} data points from {formatDate(inflationData[0]?.date)} to {formatDate(inflationData[inflationData.length-1]?.date)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ItemDetail;