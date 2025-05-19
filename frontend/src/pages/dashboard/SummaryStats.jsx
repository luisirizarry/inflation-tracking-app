// src/components/dashboard/SummaryStats.jsx
import StatCard from './StatCard';

function SummaryStats({ stats }) {
  return (
    <section className="summary-section">
      <h1>Inflation Dashboard</h1>
      <div className="summary-cards">
        <StatCard 
          title="Overall Change"
          value={`${stats.overallChange.toFixed(2)}%`}
          description="Average change across all categories"
        />
        
        <StatCard 
          title="Highest Inflation"
          value={`${stats.highestCategory.change.toFixed(2)}%`}
          description={stats.highestCategory.name}
          trend="up"
        />
        
        <StatCard 
          title="Lowest Inflation"
          value={`${stats.lowestCategory.change.toFixed(2)}%`}
          description={stats.lowestCategory.name}
          trend="down"
        />
      </div>
    </section>
  );
}

export default SummaryStats;