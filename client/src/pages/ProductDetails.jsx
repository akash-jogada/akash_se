import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import API from '../services/api';

// All your CSS is in this template literal
const productDetailsStyles = `
/* 1. Import the 'Lato' font */
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');

/* 2. Define Color Palette as CSS Variables */
:root {
  --primary: #2a9d8f;
  --primary-dark: #227b70;
  --primary-light: #e9f5f4;
  --danger: #e76f51;
  --danger-dark: #d85e40;
  --success-light: #e8f5e9;
  --success: #2e7d32;
  --error-light: #ffebee;
  --error: #c62828;
  --light: #f9f9f9;
  --white: #ffffff;
  --dark: #333333;
  --medium: #666666;
  --border: #e0e0e0;
  --focus-glow: rgba(42, 157, 143, 0.3);
}

/* 3. Apply new font and base styles */
.product-details-container {
  font-family: 'Lato', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
  color: var(--dark);
}

* {
  box-sizing: border-box;
}

/* --- Breadcrumbs --- */
.breadcrumb {
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--medium);
}
.breadcrumb a {
  color: var(--primary);
  text-decoration: none;
}
.breadcrumb a:hover {
  text-decoration: underline;
}

/* --- Main Layout --- */
.product-layout-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}
@media (max-width: 900px) {
  .product-layout-grid {
    grid-template-columns: 1fr;
  }
}

/* --- Image Gallery (Left) --- */
.main-image-container {
  width: 100%;
  height: 500px;
  /* --bg-image is set dynamically in the style prop */
  background-image: var(--bg-image, linear-gradient(135deg, var(--primary-light) 0%, #c7e9e5 100%));
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--medium);
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
  margin-bottom: 15px;
}

.no-image-placeholder {
  text-align: center;
}
.no-image-placeholder span {
  font-size: 14px;
}

.image-counter {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}
.nav-arrow:hover {
  background: rgba(0,0,0,0.8);
}
.nav-arrow.left {
  left: 15px;
}
.nav-arrow.right {
  right: 15px;
}

.thumbnail-gallery {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 5px;
}
.thumbnail-image {
  min-width: 90px;
  height: 90px;
  background-size: cover;
  background-position: center;
  /* --bg-image set in style prop */
  background-image: var(--bg-image);
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid var(--border);
  transition: all 0.2s;
  opacity: 0.6;
}
.thumbnail-image:hover {
  opacity: 0.8;
}
.thumbnail-image.active {
  border: 3px solid var(--primary);
  opacity: 1;
}

/* --- Product Info (Right) --- */
.product-info h1 {
  margin: 0 0 10px 0;
  font-size: 32px;
  color: var(--dark);
}

.product-meta-tags {
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--medium);
  display: flex;
  align-items: center;
}
.category-tag {
  display: inline-block;
  padding: 4px 10px;
  background: var(--primary-light);
  border-radius: 5px;
  margin-right: 10px;
  color: var(--primary);
  font-weight: bold;
}

.product-price {
  font-size: 36px;
  font-weight: bold;
  color: var(--primary);
  margin-bottom: 20px;
}

.stock-status {
  margin-bottom: 20px;
  padding: 10px 15px;
  border-radius: 5px;
  font-weight: bold;
}
.stock-status.in-stock {
  background: var(--success-light);
  color: var(--success);
}
.stock-status.out-of-stock {
  background: var(--error-light);
  color: var(--error);
}

.product-description h3, .product-materials h4 {
  margin-bottom: 10px;
  color: var(--dark);
}
.product-description p, .product-materials p {
  line-height: 1.8;
  color: var(--medium);
  font-size: 16px;
}
.product-description {
  margin-bottom: 30px;
}
.product-materials {
  margin-bottom: 20px;
}

/* --- Quantity & Actions --- */
.quantity-selector {
  margin-bottom: 20px;
}
.quantity-selector label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}
.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
.quantity-btn {
  padding: 10px 15px;
  font-size: 18px;
  background: var(--light);
  border: 1px solid var(--border);
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.quantity-btn:hover {
  background: var(--border);
}
.quantity-input {
  width: 80px;
  padding: 10px;
  font-size: 18px;
  text-align: center;
  border: 1px solid var(--border);
  border-radius: 5px;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

/* --- Base Button Styles --- */
.btn {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}
.btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.btn:focus {
  outline: none;
  box-shadow: 0 0 0 4px var(--focus-glow);
}

.btn-primary {
  background: var(--primary);
  color: var(--white);
}
.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
}

.btn-buy-now {
  background: var(--danger);
  color: var(--white);
}
.btn-buy-now:hover:not(:disabled) {
  background: var(--danger-dark);
}

/* --- Product Meta Table --- */
.product-info-table {
  margin-top: 30px;
  padding: 20px;
  background: var(--light);
  border-radius: 8px;
}
.product-info-table h4 {
  margin-top: 0;
}
.product-info-table table {
  width: 100%;
  font-size: 14px;
  border-collapse: collapse;
}
.product-info-table tr {
  border-bottom: 1px solid var(--border);
}
.product-info-table tr:last-child {
  border-bottom: none;
}
.product-info-table td {
  padding: 10px 0;
}
.product-info-table td:first-child {
  font-weight: bold;
  width: 40%;
}

/* --- Guard Pages (Login/Empty) --- */
.centered-page {
  max-width: 600px;
  margin: 50px auto;
  text-align: center;
  padding: 40px;
  background: var(--light);
  border-radius: 12px;
}
.centered-page h2 {
  font-size: 1.8rem;
  color: var(--dark);
  margin-bottom: 25px;
}
.centered-page-link {
  color: var(--primary);
  font-size: 1.2rem;
  font-weight: 600;
  text-decoration: none;
  border: 2px solid var(--primary);
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.2s;
}
.centered-page-link:hover {
  background: var(--primary);
  color: var(--white);
}
`;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Product not found');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <>
        <style>{productDetailsStyles}</style>
        <div className="product-details-container">
          <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading product...</p>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <style>{productDetailsStyles}</style>
        <div className="centered-page">
          <h2>Product Not Found</h2>
          <Link to="/" className="centered-page-link">Back to Home</Link>
        </div>
      </>
    );
  }

  const handleAddToCart = () => {
    // This logic adds the item `quantity` times, based on your original code
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/cart');
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, Math.min(product.stock, value)));
  };
  
  const incrementQuantity = () => {
    setQuantity(q => Math.min(product.stock, q + 1));
  };
  
  const decrementQuantity = () => {
    setQuantity(q => Math.max(1, q - 1));
  };
  
  const handlePrevImage = () => {
    setSelectedImageIndex(i => (i === 0 ? product.images.length - 1 : i - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex(i => (i === product.images.length - 1 ? 0 : i + 1));
  };

  return (
    <>
      {/* This <style> tag injects all the CSS onto the page */}
      <style>{productDetailsStyles}</style>

      <div className="product-details-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          {' > '}
          <span>{product.category.name}</span>
          {' > '}
          <span>{product.name}</span>
        </div>

        <div className="product-layout-grid">
          {/* Product Image Gallery */}
          <div>
            {/* Main Image Display */}
            <div 
              className="main-image-container"
              // Dynamically set the --bg-image CSS variable
              style={{
                '--bg-image': (product.images && product.images.length > 0)
                  ? `url(${product.images[selectedImageIndex]})`
                  : 'linear-gradient(135deg, var(--primary-light) 0%, #c7e9e5 100%)'
              }}
            >
              {(!product.images || product.images.length === 0) && (
                <div className="no-image-placeholder">
                  📷 Product Image
                  <br />
                  <span>(No image uploaded)</span>
                </div>
              )}

              {/* Image Counter */}
              {product.images && product.images.length > 1 && (
                <div className="image-counter">
                  {selectedImageIndex + 1} / {product.images.length}
                </div>
              )}

              {/* Navigation Arrows */}
              {product.images && product.images.length > 1 && (
                <>
                  <button onClick={handlePrevImage} className="nav-arrow left">
                    ‹
                  </button>
                  <button onClick={handleNextImage} className="nav-arrow right">
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="thumbnail-gallery">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`thumbnail-image ${selectedImageIndex === index ? 'active' : ''}`}
                    style={{ '--bg-image': `url(${image})` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="product-info">
            <h1>{product.name}</h1>
            
            {/* Category & Artisan */}
            <div className="product-meta-tags">
              <span className="category-tag">
                {product.category.name}
              </span>
              <span>by <strong>{product.artisan.name}</strong></span>
            </div>

            {/* Price */}
            <div className="product-price">
              ${product.price}
            </div>

            {/* Stock Status */}
            <div className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? (
                <>✓ In Stock ({product.stock} available)</>
              ) : (
                <>✗ Out of Stock</>
              )}
            </div>

            {/* Description */}
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {/* Materials */}
            {product.materials && (
              <div className="product-materials">
                <h4>Materials</h4>
                <p>{product.materials}</p>
              </div>
            )}

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="quantity-selector">
                <label>Quantity</label>
                <div className="quantity-controls">
                  <button onClick={decrementQuantity} className="quantity-btn">-</button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={product.stock}
                    className="quantity-input"
                  />
                  <button onClick={incrementQuantity} className="quantity-btn">+</button>
                  <span style={{ color: '#666', fontSize: '14px' }}>
                    (Max: {product.stock})
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn btn-primary"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="btn btn-buy-now"
              >
                Buy Now
              </button>
            </div>

            {/* Product Meta Information */}
            <div className="product-info-table">
              <h4>Product Information</h4>
              <table>
                <tbody>
                  <tr>
                    <td>SKU</td>
                    <td>{product._id.slice(-8).toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td>Category</td>
                    <td>{product.category.name}</td>
                  </tr>
                  <tr>
                    <td>Artisan</td>
                    <td>{product.artisan.name}</td>
                  </tr>
                  <tr>
                    <td>Listed On</td>
                    <td>
                      {new Date(product.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;