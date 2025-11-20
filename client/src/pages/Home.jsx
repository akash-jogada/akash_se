import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { CartContext } from '../context/CartContext';

// All your CSS is in this template literal
const homeStyles = `
/* 1. Import the 'Montserrat' font */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

/* 2. Define Color Palette as CSS Variables */
:root {
  --primary: #2a9d8f;
  --primary-dark: #227b70;
  --primary-light: #e9f5f4;
  --danger: #e76f51;
  --danger-dark: #d85e40;
  --error: #c62828;
  --light: #f9f9f9;
  --white: #ffffff;
  --dark: #333333;
  --medium: #666666;
  --border: #e0e0e0;
  --focus-glow: rgba(42, 157, 143, 0.3);
}

/* 3. Apply new font and base styles */
.home-container {
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  max-width: 1400px;
  margin: 20px auto;
  padding: 0 20px;
}

* {
  box-sizing: border-box;
}

.home-container h1 {
  color: var(--primary);
  border-bottom: 2px solid var(--border);
  padding-bottom: 10px;
}

/* --- Filter Section --- */
.filter-container {
  background: var(--light);
  padding: 25px;
  border-radius: 10px;
  margin-bottom: 30px; /* Increased margin */
}

.search-input {
  width: 100%;
  padding: 15px;
  font-size: 20px;
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-bottom: 20px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--focus-glow);
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px; /* Increased gap */
  margin-bottom: 20px;
}

.filter-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
}

/* Base style for inputs/selects */
.filter-input {
  width: 100%;
  padding: 10px 12px;
  font-size: 15px;
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.filter-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--focus-glow);
}
select.filter-input {
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%2C%20fill%3D%22%23666%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
}

.btn-clear-filters {
  padding: 8px 16px;
  background: var(--danger);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-clear-filters:hover {
  background: var(--danger-dark);
}
.btn-clear-filters:focus {
  outline: none;
  box-shadow: 0 0 0 4px var(--focus-glow);
}

.results-count {
  margin-top: 20px;
  font-size: 14px;
  color: var(--medium);
}

/* --- Products Grid --- */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px; /* Increased gap */
}

/* --- Product Card --- */
.product-card {
  text-decoration: none;
  color: inherit;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--white);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
/* Replaced JS hover with CSS hover */
.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

/* --- Card Image --- */
.product-image-container {
  width: 100%;
  height: 250px; /* <-- INCREASED IMAGE SPACE */
  background: linear-gradient(135deg, var(--primary-light) 0%, #c7e9e5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--medium);
  font-size: 14px;
  position: relative;
  overflow: hidden;
}
.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.product-card:hover .product-image {
  transform: scale(1.05); /* Add a subtle zoom on hover */
}

.no-image-placeholder {
  text-align: center;
}
.no-image-placeholder span {
  font-size: 12px;
}

/* Stock Badges */
.stock-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  color: white;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.low-stock {
  background: var(--danger);
}
.out-of-stock {
  background: var(--error);
}

/* --- Card Content --- */
.product-content {
  padding: 20px; /* Increased padding */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  margin: 0 0 10px 0;
  color: var(--primary);
  font-size: 20px; /* <-- BIGGER WRITING */
  font-weight: 700; /* <-- MORE APPEALING */
  line-height: 1.3;
}

.product-description {
  color: var(--medium);
  font-size: 15px; /* <-- BIGGER WRITING */
  min-height: 45px; /* Adjusted for new font size */
  margin-bottom: 15px;
  line-height: 1.5;
  /* Truncate to 2 lines */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* This div pushes the button to the bottom */
.product-footer {
  margin-top: auto;
}

.product-price {
  font-size: 28px; /* <-- BIGGER WRITING */
  font-weight: 700; /* <-- MORE APPEALING */
  color: var(--primary);
  margin: 15px 0;
}

.artisan-info {
  font-size: 12px;
  color: var(--medium);
  margin-bottom: 15px;
  padding-top: 15px;
  border-top: 1px solid var(--light);
}
.artisan-info div {
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.artisan-info span {
  font-weight: 600;
  margin-right: 5px;
}
.stock-level {
  color: var(--stock-color, var(--dark)); /* Color set in JS */
  font-weight: bold;
  margin-top: 5px;
}

/* --- Add to Cart Button --- */
.btn-add-to-cart {
  width: 100%;
  padding: 12px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px; /* <-- BIGGER WRITING */
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(42, 157, 143, 0.3);
}
/* Replaced JS hover with CSS hover */
.btn-add-to-cart:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(42, 157, 143, 0.4);
}
.btn-add-to-cart:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

/* --- No Products --- */
.no-products-found {
  text-align: center;
  padding: 40px;
  color: var(--medium);
}
.no-products-found h3 {
  color: var(--dark);
}
`;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    // Fetch products
    API.get('/products')
      .then(res => {
        // Set initial sort by newest
        const sortedProducts = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setProducts(sortedProducts);
        setFilteredProducts(sortedProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    // Fetch categories
    API.get('/categories')
      .then(res => {
        setCategories(res.data.data);
      })
      .catch(err => console.error(err));
  }, []);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCategory, minPrice, maxPrice, sortBy, products]);

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category?._id === selectedCategory);
    }

    // Price range filter
    if (minPrice) {
      filtered = filtered.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= Number(maxPrice));
    }

    // Sorting
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  // Helper to determine stock color
  const getStockColor = (stock) => {
    if (stock === 0) return '#c62828'; // --error
    if (stock <= 10) return '#e76f51'; // --danger
    return '#2a9d8f'; // --primary
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading products...</p>;

  return (
    <>
      {/* This <style> tag injects all the CSS onto the page */}
      <style>{homeStyles}</style>
      
      <div className="home-container">
        <h1>Handicraft Products</h1>

        {/* Search & Filter Section */}
        <div className="filter-container">
          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Filters Row */}
          <div className="filter-grid">
            {/* Category Filter */}
            <div>
              <label className="filter-label" htmlFor="category-select">Category</label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-input"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="filter-label" htmlFor="min-price">Min Price ($)</label>
              <input
                id="min-price"
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
                className="filter-input"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="filter-label" htmlFor="max-price">Max Price ($)</label>
              <input
                id="max-price"
                type="number"
                placeholder="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                className="filter-input"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="filter-label" htmlFor="sort-by">Sort By</label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-input"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={clearFilters}
            className="btn-clear-filters"
          >
            Clear All Filters
          </button>

          {/* Results Count */}
          <div className="results-count">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="no-products-found">
            <h3>No products found</h3>
            <p>Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="product-card"
              >
                {/* Product Image */}
                <div className="product-image-container">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="product-image"
                    />
                  ) : (
                    <div className="no-image-placeholder">
                      📷 
                      <br />
                      <span>No Image</span>
                    </div>
                  )}

                  {/* Low Stock Badge */}
                  {product.stock < 10 && product.stock > 0 && (
                    <span className="stock-badge low-stock">
                      ⚠️ Low Stock
                    </span>
                  )}

                  {/* Out of Stock Badge */}
                  {product.stock === 0 && (
                    <span className="stock-badge out-of-stock">
                      ❌ Out of Stock
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="product-content">
                  <h3 className="product-name">
                    {product.name}
                  </h3>

                  <p className="product-description">
                    {product.description.substring(0, 85)}...
                  </p>

                  <div className="product-footer">
                    <p className="product-price">
                      ${product.price}
                    </p>

                    <div className="artisan-info">
                      <div>
                        <span>📦</span>
                        {product.category?.name || 'Unknown Category'}
                      </div>
                      <div>
                        <span>👨‍🎨</span>
                        {product.artisan?.name || 'Unknown Artisan'}
                      </div>
                      {product.materials && (
                        <div>
                          <span>🎨</span>
                          {product.materials}
                        </div>
                      )}
                      <div 
                        className="stock-level"
                        // Set CSS variable for dynamic color
                        style={{'--stock-color': getStockColor(product.stock)}}
                      >
                        📊 Stock: {product.stock}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={product.stock === 0}
                      className="btn-add-to-cart"
                    >
                      {product.stock === 0 ? '❌ Out of Stock' : '🛒 Add to Cart'}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;