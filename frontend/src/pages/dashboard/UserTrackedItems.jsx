import TrackedItemCard from '../items/TrackedItemCard';
import SectionHeader from '../../components/common/SectionHeader';
import EmptyState from '../../components/common/EmptyState';

function UserTrackedItems({ items }) {
  return (
    <section className="tracked-items-section">
      <SectionHeader 
        title="Your Tracked Items" 
        actionLink="/preferences"
        actionText="Manage Preferences"
      />
      
      {items.length === 0 ? (
        <EmptyState 
          message="You're not tracking any inflation items yet."
          actionLink="/categories"
          actionText="Browse Categories"
        />
      ) : (
        <div className="tracked-items-grid">
          {items.map(item => (
            <TrackedItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

export default UserTrackedItems;