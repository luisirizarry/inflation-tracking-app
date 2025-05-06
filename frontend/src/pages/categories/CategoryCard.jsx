import { Link } from 'react-router-dom';

function CategoryCard({ category, viewMode }) {
  return (
    <Link
      to={`/categories/${category.id}`}
      className={`category-card ${viewMode}`}
    >
      <div className="category-content">
        <h2>{category.name}</h2>
        <p className="category-description">
          {category.description?.length > 120
            ? `${category.description.substring(0, 120)}...`
            : category.description}
        </p>
        {viewMode === "list" && (
          <div className="item-count">{category.item_count || 0} items</div>
        )}
      </div>
      <div className="category-meta">
        {viewMode === "grid" && (
          <div className="item-count">{category.item_count || 0} items</div>
        )}
        <span className="view-details">View Details →</span>
      </div>
    </Link>
  );
}

export default CategoryCard;
