function StatCard({ title, value, description, trend }) {
  const valueClass =
    trend === "up"
      ? "stat-value up"
      : trend === "down"
      ? "stat-value down"
      : "stat-value";

  return (
    <div className="summary-card">
      <h3>{title}</h3>
      <div className={valueClass}>{value}</div>
      <p>{description}</p>
    </div>
  );
}

export default StatCard;
