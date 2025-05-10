import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import InflationApi from "../../api/InflationApi";
import AuthContext from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import "./UserPreferences.css";

function UserPreferences() {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackedItems, setTrackedItems] = useState([]);
  const [itemDetails, setItemDetails] = useState({});

  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Get user preferences
        const preferences = await InflationApi.getUserPreferences(
          currentUser.id
        );

        if (!preferences || !Array.isArray(preferences)) {
          setError("Invalid data received from server");
          return;
        }

        // Store the raw preferences first
        setTrackedItems(preferences);

        // Create a lookup object for item details
        const details = {};

        // Loop through preferences one by one
        for (const pref of preferences) {
          try {
            // Get item data
            const itemData = await InflationApi.getItem(pref.tracked_item_id);

            // Get category if available
            let categoryName = "Unknown";
            if (itemData.category_id) {
              try {
                const category = await InflationApi.getCategory(
                  itemData.category_id
                );
                categoryName = category.name;
              } catch (err) {
                // Category fetch failed, keep default "Unknown"
              }
            }

            // Get inflation data - just for the latest value
            const inflationData = await InflationApi.getItemInflationData(
              pref.tracked_item_id
            );

            details[pref.tracked_item_id] = {
              id: itemData.id,
              name: itemData.name,
              categoryName: categoryName,
              latestValue: inflationData && inflationData.length > 0 ? 
                parseFloat(inflationData[0].value) : null,
              latestDate: inflationData && inflationData.length > 0 ? 
                new Date(inflationData[0].date) : null
            };
          } catch (err) {
            details[pref.tracked_item_id] = {
              error: true,
              message: err.message,
            };
          }
        }

        setItemDetails(details);
      } catch (err) {
        setError("Failed to load your tracked items");
      } finally {
        setLoading(false);
      }
    };

    loadUserPreferences();
  }, [currentUser]);

  const handleRemoveItem = async (itemId) => {
    try {
      await InflationApi.removePreference(
        currentUser.id,
        itemId
      );
      setTrackedItems(
        trackedItems.filter((item) => item.tracked_item_id !== itemId)
      );

      const newDetails = { ...itemDetails };
      delete newDetails[itemId];
      setItemDetails(newDetails);
    } catch (err) {
      setError("Failed to remove item from tracking");
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!currentUser) {
    return (
      <div className="user-preferences">
        <div className="not-logged-in">
          <h2>You must be logged in to view your preferences</h2>
          <Link to="/login" className="login-link">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="user-preferences">
      <h1>My Tracked Items</h1>

      {error && <div className="error-message">{error}</div>}

      {trackedItems.length === 0 ? (
        <div className="no-items">
          <p>You aren't tracking any items yet.</p>
          <Link to="/categories" className="browse-categories">
            Browse Categories
          </Link>
        </div>
      ) : (
        <div className="tracked-items-container">

          <div className="tracked-items-grid">
            {Object.entries(itemDetails).map(([itemId, item]) => {
              if (item.error) return null;

              return (
                <div key={itemId} className="item-card">
                  <div className="card-header">
                    <h3>{item.name}</h3>
                    <span className="category-tag">{item.categoryName}</span>
                  </div>

                  <div className="card-body">
                    <div className="latest-value">
                      <span className="value-label">Current value:</span>
                      <span className="value-number">
                        {item.latestValue ? item.latestValue.toFixed(1) : "N/A"}
                      </span>
                      <span className="value-date">
                        {item.latestDate ? item.latestDate.toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <Link to={`/items/${item.id}`} className="details-btn">
                      View Details
                    </Link>
                    <button
                      onClick={() => handleRemoveItem(itemId)}
                      className="untrack-btn"
                    >
                      Untrack
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPreferences;