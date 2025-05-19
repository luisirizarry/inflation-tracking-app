import SectionHeader from '../../components/common/SectionHeader';
import CategoryCard from '../categories/CategoryCard';

function CategoryQuickAccess({ categories }) {
  return (
    <section className="categories-section">
      <SectionHeader 
        title="Browse Categories"
        actionLink="/categories"
        actionText="View All"
      />
      
      <div className="categories-grid">
        {categories.slice(0, 6).map(category => (
          <CategoryCard 
            key={category.id} 
            category={category} 
            viewMode="grid" 
            compact={true} 
          />
        ))}
      </div>
    </section>
  );
}

export default CategoryQuickAccess;