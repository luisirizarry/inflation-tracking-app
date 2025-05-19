import { useState, useEffect } from "react";
import InflationApi from "../../api/InflationApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import SearchBox from "../../components/common/SearchBox";
import ViewToggle from "../../components/common/ViewToggle";
import CategoryCard from "./CategoryCard";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import "./CategoryList.css";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await InflationApi.getCategories();
        setCategories(data);
        setFilteredCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Filter categories when searchTerm changes
    if (searchTerm === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (category.description &&
            category.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="categories-page">
      <PageHeader
        title="Inflation Categories"
        description="Browse all inflation tracking categories"
      />

      <div className="categories-controls">
        <SearchBox
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search categories..."
        />

        <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
      </div>

      {filteredCategories.length === 0 ? (
        <EmptyState message={`No categories found matching "${searchTerm}"`} />
      ) : (
        <div className={`categories-container ${viewMode}`}>
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryList;
