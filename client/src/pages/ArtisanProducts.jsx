import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

// --- 🎨 Central Color & Style Definitions ---

const palette = {
  primary: '#2a9d8f', // Teal
  primaryDark: '#227b70', // Darker Teal for hover
  danger: '#ef4444', // Red
  dangerDark: '#c82333', // Darker Red for hover
  success: '#2e7d32', // Green
  warning: '#e76f51', // Orange/Yellow
  light: '#f9f9f9', // Lightest Gray
  white: '#ffffff',
  dark: '#333333', // Dark text
  medium: '#666666', // Medium text
  border: '#e0e0e0', // Light border
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  modalOverlay: 'rgba(0, 0, 0, 0.6)',
  focusGlow: 'rgba(42, 157, 143, 0.3)',
};

const styles = {
  // --- Page Layout ---
  pageContainer: {
    maxWidth: '2000px',
    margin: '20px auto',
    padding: '0 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: palette.dark,
  },
  pageTitle: {
    color: palette.primary,
    borderBottom: `2px solid ${palette.border}`,
    paddingBottom: '10px',
  },
  sectionTitle: {
    color: palette.dark,
    marginTop: '40px',
    marginBottom: '20px',
  },
  hr: {
    margin: '40px 0',
    border: 'none',
    borderTop: `2px solid ${palette.light}`,
  },

  // --- Alerts ---
  alertBase: {
    padding: '15px 20px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontWeight: '500',
  },
  alertSuccess: {
    background: '#e8f5e9',
    color: palette.success,
    border: `1px solid ${palette.success}`,
  },
  alertError: {
    background: '#ffebee',
    color: palette.danger,
    border: `1px solid ${palette.danger}`,
  },

  // --- Buttons ---
  buttonBase: {
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'background-color 0.2s, transform 0.1s ease-out',
  },
  buttonPrimary: {
    background: palette.primary,
    color: palette.white,
  },
  buttonPrimaryHover: {
    background: palette.primaryDark,
    transform: 'translateY(-1px)',
  },
  buttonDanger: {
    background: palette.danger,
    color: palette.white,
  },
  buttonDangerHover: {
    background: palette.dangerDark,
    transform: 'translateY(-1px)',
  },
  buttonSecondary: {
    background: palette.medium,
    color: palette.white,
  },
  buttonSecondaryHover: {
    background: palette.dark,
    transform: 'translateY(-1px)',
  },
  buttonDisabled: {
    background: palette.border,
    color: palette.medium,
    cursor: 'not-allowed',
  },

  // --- Forms & Inputs ---
  formContainer: {
    background: palette.white,
    padding: '30px',
    borderRadius: '12px',
    boxShadow: `0 4px 16px ${palette.shadowLight}`,
    border: `1px solid ${palette.border}`,
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: palette.dark,
  },
  inputBase: {
    width: '100%',
    padding: '12px 15px',
    fontSize: '16px',
    border: `1px solid ${palette.border}`,
    borderRadius: '8px',
    boxSizing: 'border-box', // Important
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  inputFocus: {
    outline: 'none',
    borderColor: palette.primary,
    boxShadow: `0 0 0 3px ${palette.focusGlow}`,
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  smallText: {
    color: palette.medium,
    fontSize: '14px',
    marginTop: '5px',
    display: 'block',
  },

  // --- Product List & Cards ---
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '25px',
    marginTop: '20px',
  },
  productCard: {
    border: `1px solid ${palette.border}`,
    borderRadius: '12px',
    backgroundColor: palette.white,
    boxShadow: `0 4px 12px ${palette.shadowLight}`,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    overflow: 'hidden', // Ensures image border-radius is respected
  },
  productCardHover: {
    transform: 'translateY(-5px)',
    boxShadow: `0 8px 16px ${palette.shadow}`,
  },
  productImageContainer: {
    position: 'relative',
    width: '100%',
    height: '220px',
    background: `linear-gradient(135deg, ${palette.light} 0%, ${palette.border} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: palette.medium,
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageCountBadge: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    background: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  productCardContent: {
    padding: '15px',
  },
  productName: {
    marginTop: 0,
    color: palette.primary,
    fontSize: '20px',
  },
  productDescription: {
    color: palette.medium,
    fontSize: '14px',
    minHeight: '60px',
    lineHeight: '1.5',
  },
  productPrice: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: palette.primary,
  },
  productStockButton: {
    padding: '6px 12px',
    background: palette.light,
    border: `1px solid ${palette.border}`,
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    color: palette.dark,
    transition: 'background-color 0.2s',
  },
  productStockButtonHover: {
    background: palette.border,
  },
  productCardActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: `1px solid ${palette.light}`,
  },

  // --- Modal ---
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: palette.modalOverlay,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: palette.white,
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: `0 10px 30px ${palette.shadow}`,
  },
  imageSelector: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  imageThumb: {
    width: '100px',
    height: '100px',
    cursor: 'pointer',
    border: `2px solid ${palette.border}`,
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
    transition: 'border-color 0.2s',
  },
  imageThumbActive: {
    border: `3px solid ${palette.primary}`,
  },
  imageThumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  primaryBadge: {
    position: 'absolute',
    bottom: '5px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: palette.primary,
    color: 'white',
    padding: '3px 8px',
    fontSize: '10px',
    borderRadius: '3px',
    fontWeight: 'bold',
  },
};

// --- React Component ---

const ArtisanProducts = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    materials: ''
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingProducts, setFetchingProducts] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingStock, setEditingStock] = useState(null);
  
  // Image states
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  // Edit product states
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  // --- Input Focus State ---
  const [focusedInput, setFocusedInput] = useState(null);
  const handleFocus = (name) => setFocusedInput(name);
  const handleBlur = () => setFocusedInput(null);

  // --- Button Hover States ---
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoverStates, setHoverStates] = useState({});
  const setHover = (name, value) => setHoverStates(prev => ({ ...prev, [name]: value }));

  // Helper to combine styles
  const combineStyles = (...styleObjects) => {
    return Object.assign({}, ...styleObjects);
  };

  useEffect(() => {
    fetchCategories();
    fetchArtisanProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories');
      setCategories(response.data.data);
      if (response.data.data.length > 0) {
        setFormData(prev => ({ ...prev, category: response.data.data[0]._id }));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

 const fetchArtisanProducts = async () => {
  try {
    setFetchingProducts(true);
    const response = await API.get('/products');
    const myProducts = response.data.data.filter(
      product => product.artisan && product.artisan._id === user.id
    );
    setProducts(myProducts);
  } catch (err) {
    console.error('Error fetching products:', err);
  } finally {
    setFetchingProducts(false);
  }
};

  if (!user || user.role !== 'artisan') {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Access Denied</h2>
        <p>Only artisans can access this page</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setImageFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('materials', formData.materials);

      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      const response = await API.post('/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setSuccess('Product created successfully!');
        setFormData({
          name: '',
          description: '',
          price: '',
          category: categories.length > 0 ? categories[0]._id : '',
          stock: '',
          materials: ''
        });
        setImageFiles([]);
        setImagePreviews([]);
        fetchArtisanProducts();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (productId, newStock) => {
    try {
      const response = await API.put(`/products/${productId}`, { stock: newStock });
      if (response.data.success) {
        fetchArtisanProducts();
        setEditingStock(null);
        setSuccess('Stock updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to update stock');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await API.delete(`/products/${productId}`);
      if (response.data.success) {
        setSuccess('Product deleted successfully!');
        fetchArtisanProducts();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to delete product');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category._id,
      stock: product.stock,
      materials: product.materials || ''
    });
    setPrimaryImageIndex(0);
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await API.put(`/products/${editingProduct._id}`, editFormData);
      
      if (primaryImageIndex !== 0) {
        await API.put(`/products/${editingProduct._id}/reorder-images`, {
          primaryImageIndex
        });
      }
      
      if (response.data.success) {
        setSuccess('Product updated successfully!');
        setEditingProduct(null);
        fetchArtisanProducts();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to update product');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.pageTitle}>My Products Dashboard</h1>

      {success && <div style={combineStyles(styles.alertBase, styles.alertSuccess)}>{success}</div>}
      {error && <div style={combineStyles(styles.alertBase, styles.alertError)}>{error}</div>}

      <div style={{ marginBottom: '50px' }}>
        <h2 style={styles.sectionTitle}>Your Products ({products.length})</h2>
        
        {fetchingProducts ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p style={{ color: palette.medium, fontStyle: 'italic' }}>You haven't created any products yet. Time to add your first creation!</p>
        ) : (
          <div style={styles.productGrid}>
            {products.map(product => (
              <div 
                key={product._id} 
                style={combineStyles(
                  styles.productCard,
                  hoveredCard === product._id && styles.productCardHover
                )}
                onMouseEnter={() => setHoveredCard(product._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {product.images && product.images.length > 0 ? (
                  <div style={styles.productImageContainer}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={styles.productImage}
                    />
                    {product.images.length > 1 && (
                      <span style={styles.imageCountBadge}>
                        📸 {product.images.length}
                      </span>
                    )}
                  </div>
                ) : (
                  <div style={styles.productImageContainer}>
                    📷 No Image
                  </div>
                )}
                
                <div style={styles.productCardContent}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <p style={styles.productDescription}>{product.description}</p>
                  
                  {product.materials && (
                    <p style={{ fontSize: '12px', color: palette.medium, marginTop: '5px' }}>
                      <strong>Materials:</strong> {product.materials}
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <span style={styles.productPrice}>${product.price}</span>
                    
                    {editingStock === product._id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <button onClick={() => handleStockUpdate(product._id, Math.max(0, product.stock - 1))} style={{ ...styles.buttonBase, padding: '5px 10px' }}>-</button>
                        <span style={{ fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>{product.stock}</span>
                        <button onClick={() => handleStockUpdate(product._id, product.stock + 1)} style={{ ...styles.buttonBase, padding: '5px 10px' }}>+</button>
                        <button onClick={() => setEditingStock(null)} style={{ ...styles.buttonBase, background: palette.warning, color: 'white', padding: '5px 10px', fontSize: '12px' }}>Done</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setEditingStock(product._id)} 
                        style={combineStyles(
                          styles.productStockButton,
                          hoverStates[`stock_${product._id}`] && styles.productStockButtonHover
                        )}
                        onMouseEnter={() => setHover(`stock_${product._id}`, true)}
                        onMouseLeave={() => setHover(`stock_${product._id}`, false)}
                      >
                        Stock: {product.stock} ✏️
                      </button>
                    )}
                  </div>

                  <div style={{ marginTop: '10px' }}>
                    <small style={{ color: palette.medium }}>Created: {new Date(product.createdAt).toLocaleDateString()}</small>
                  </div>

                  <div style={styles.productCardActions}>
                    <button 
                      onClick={() => handleEditProduct(product)} 
                      style={combineStyles(
                        styles.buttonBase,
                        styles.buttonPrimary,
                        hoverStates[`edit_${product._id}`] && styles.buttonPrimaryHover,
                        { flex: 1, fontSize: '14px' }
                      )}
                      onMouseEnter={() => setHover(`edit_${product._id}`, true)}
                      onMouseLeave={() => setHover(`edit_${product._id}`, false)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product._id)} 
                      style={combineStyles(
                        styles.buttonBase,
                        styles.buttonDanger,
                        hoverStates[`delete_${product._id}`] && styles.buttonDangerHover,
                        { flex: 1, fontSize: '14px' }
                      )}
                      onMouseEnter={() => setHover(`delete_${product._id}`, true)}
                      onMouseLeave={() => setHover(`delete_${product._id}`, false)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Edit Product Modal --- */}
      {editingProduct && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{ marginTop: 0 }}>Edit Product</h2>

            {editingProduct.images && editingProduct.images.length > 1 && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Select Primary Image (Click to set as main)</label>
                <div style={styles.imageSelector}>
                  {editingProduct.images.map((image, index) => (
                    <div 
                      key={index} 
                      onClick={() => setPrimaryImageIndex(index)} 
                      style={combineStyles(
                        styles.imageThumb,
                        primaryImageIndex === index && styles.imageThumbActive
                      )}
                    >
                      <img src={image} alt={`Product ${index + 1}`} style={styles.imageThumbImg} />
                      {primaryImageIndex === index && (
                        <span style={styles.primaryBadge}>PRIMARY</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Product Name</label>
              <input type="text" name="name" value={editFormData.name} onChange={handleEditChange} 
                style={combineStyles(styles.inputBase, focusedInput === 'edit_name' && styles.inputFocus)}
                onFocus={() => handleFocus('edit_name')} onBlur={handleBlur}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea name="description" value={editFormData.description} onChange={handleEditChange} rows="4" 
                style={combineStyles(styles.inputBase, {minHeight: '100px'}, focusedInput === 'edit_desc' && styles.inputFocus)}
                onFocus={() => handleFocus('edit_desc')} onBlur={handleBlur}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Materials</label>
              <input type="text" name="materials" value={editFormData.materials} onChange={handleEditChange}
                style={combineStyles(styles.inputBase, focusedInput === 'edit_materials' && styles.inputFocus)}
                onFocus={() => handleFocus('edit_materials')} onBlur={handleBlur}
              />
            </div>

            <div style={combineStyles(styles.inputGrid, styles.formGroup)}>
              <div>
                <label style={styles.label}>Price ($)</label>
                <input type="number" name="price" value={editFormData.price} onChange={handleEditChange} 
                  style={combineStyles(styles.inputBase, focusedInput === 'edit_price' && styles.inputFocus)}
                  onFocus={() => handleFocus('edit_price')} onBlur={handleBlur}
                />
              </div>
              <div>
                <label style={styles.label}>Stock</label>
                <input type="number" name="stock" value={editFormData.stock} onChange={handleEditChange} 
                  style={combineStyles(styles.inputBase, focusedInput === 'edit_stock' && styles.inputFocus)}
                  onFocus={() => handleFocus('edit_stock')} onBlur={handleBlur}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <select name="category" value={editFormData.category} onChange={handleEditChange} 
                style={combineStyles(styles.inputBase, focusedInput === 'edit_category' && styles.inputFocus)}
                onFocus={() => handleFocus('edit_category')} onBlur={handleBlur}
              >
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={handleSaveEdit} 
                style={combineStyles(
                  styles.buttonBase,
                  styles.buttonPrimary,
                  hoverStates.editSave && styles.buttonPrimaryHover,
                  { flex: 1 }
                )}
                onMouseEnter={() => setHover('editSave', true)}
                onMouseLeave={() => setHover('editSave', false)}
              >
                💾 Save Changes
              </button>
              <button 
                onClick={() => setEditingProduct(null)} 
                style={combineStyles(
                  styles.buttonBase,
                  styles.buttonSecondary,
                  hoverStates.editCancel && styles.buttonSecondaryHover,
                  { flex: 1 }
                )}
                onMouseEnter={() => setHover('editCancel', true)}
                onMouseLeave={() => setHover('editCancel', false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <hr style={styles.hr} />

      {/* --- Create New Product Form --- */}
      <div>
        <h2 style={styles.sectionTitle}>Create New Product</h2>

        <form onSubmit={handleSubmit} style={styles.formContainer}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Product Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required 
              style={combineStyles(styles.inputBase, focusedInput === 'name' && styles.inputFocus)}
              onFocus={() => handleFocus('name')} onBlur={handleBlur}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" 
              style={combineStyles(styles.inputBase, {minHeight: '100px'}, focusedInput === 'desc' && styles.inputFocus)}
              onFocus={() => handleFocus('desc')} onBlur={handleBlur}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Materials Used</label>
            <input type="text" name="materials" value={formData.materials} onChange={handleChange} placeholder="e.g., Wood, Clay, Cotton, Metal" 
              style={combineStyles(styles.inputBase, focusedInput === 'materials' && styles.inputFocus)}
              onFocus={() => handleFocus('materials')} onBlur={handleBlur}
            />
            <small style={styles.smallText}>Optional: List the materials used to create this product</small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required 
              style={combineStyles(styles.inputBase, focusedInput === 'category' && styles.inputFocus)}
              onFocus={() => handleFocus('category')} onBlur={handleBlur}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div style={combineStyles(styles.inputGrid, styles.formGroup)}>
            <div>
              <label style={styles.label}>Price ($)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" 
                style={combineStyles(styles.inputBase, focusedInput === 'price' && styles.inputFocus)}
                onFocus={() => handleFocus('price')} onBlur={handleBlur}
              />
            </div>

            <div>
              <label style={styles.label}>Stock</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" 
                style={combineStyles(styles.inputBase, focusedInput === 'stock' && styles.inputFocus)}
                onFocus={() => handleFocus('stock')} onBlur={handleBlur}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Product Images (Max 5)</label>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} 
              style={combineStyles(styles.inputBase, {
                border: `2px dashed ${palette.primary}`, 
                background: palette.light, 
                padding: '20px', 
                cursor: 'pointer'
              })} 
            />
            <small style={styles.smallText}>📷 Upload up to 5 images (JPG, PNG, WEBP). First image will be the main one.</small>

            {imagePreviews.length > 0 && (
              <div style={styles.imageSelector}>
                {imagePreviews.map((preview, index) => (
                  <div key={index} style={combineStyles(
                    styles.imageThumb,
                    index === 0 && styles.imageThumbActive,
                    { width: '120px', height: '120px', cursor: 'default' }
                  )}>
                    <img src={preview} alt={`Preview ${index + 1}`} style={styles.imageThumbImg} />
                    {index === 0 && (
                      <span style={styles.primaryBadge}>PRIMARY</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={combineStyles(
              styles.buttonBase,
              styles.buttonPrimary,
              { width: '100%', marginTop: '20px', padding: '15px' },
              loading && styles.buttonDisabled,
              hoverStates.submit && !loading && styles.buttonPrimaryHover
            )}
            onMouseEnter={() => setHover('submit', true)}
            onMouseLeave={() => setHover('submit', false)}
          >
            {loading ? 'Creating Product...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ArtisanProducts;