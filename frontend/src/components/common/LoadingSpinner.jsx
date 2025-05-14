function LoadingSpinner() {
  return (
    <div className="loading-spinner-container">
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #e0e0e0",
          borderTop: "4px solid #007bff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>
    </div>
  );
}

export default LoadingSpinner;
