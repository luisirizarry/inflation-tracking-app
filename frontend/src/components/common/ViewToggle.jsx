function ViewToggle({ currentView, onViewChange }) {
  return (
    <div className="view-toggle">
      <button
        className={`toggle-btn ${currentView === "grid" ? "active" : ""}`}
        onClick={() => onViewChange("grid")}
      >
        <i className="fas fa-th"></i> Grid
      </button>
      <button
        className={`toggle-btn ${currentView === "list" ? "active" : ""}`}
        onClick={() => onViewChange("list")}
      >
        <i className="fas fa-list"></i> List
      </button>
    </div>
  );
}

export default ViewToggle;
