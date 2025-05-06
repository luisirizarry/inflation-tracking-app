function SearchBox({ value, onChange, placeholder }) {
  return (
    <div className="search-box">
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={onChange}
        className="search-input"
      />
    </div>
  );
}

export default SearchBox;