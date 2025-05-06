import { Link } from 'react-router-dom';

function TrackedItemCard({ item }) {
  return (
    <div className="tracked-item-card">
      <h3>{item.name}</h3>
      <div className="item-value">
        {item.latestValue?.toFixed(2)}%
        <span className={item.change > 0 ? 'trend-up' : 'trend-down'}>
          {item.change > 0 ? '↑' : '↓'}
        </span>
      </div>
      <Link to={`/items/${item.id}`} className="details-link">
        View Details
      </Link>
    </div>
  );
}

export default TrackedItemCard;