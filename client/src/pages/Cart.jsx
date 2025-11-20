import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
// No CSS import needed anymore

// All your CSS is now in this template literal
const cartStyles = `
/* 1. Import the 'Lato' font */
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');

/* 2. Set global font and box-sizing */
/* We scope this to the cart page to avoid affecting other pages */
.cart-page-container {
  font-family: 'Lato', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: #333333;
}

* {
  box-sizing: border-box;
}

/* 3. Define Color Palette as CSS Variables */
:root {
  --primary: #2a9d8f;
  --primary-dark: #227b70;
  --primary-light: #e9f5f4;
  --danger: #e76f51;
  --danger-dark: #d85e40;
  --danger-light: #fdebe6;
  --error: #c62828;
  --light: #f9f9f9;
  --white: #ffffff;
  --dark: #333333;
  --medium: #666666;
  --border: #e0e0e0;
  --shadow: rgba(0, 0, 0, 0.1);
  --shadow-light: rgba(0, 0, 0, 0.05);
  --focus-glow: rgba(42, 157, 143, 0.3);
}

/* --- Page Layout --- */
.cart-page-container {
  max-width: 1400px;
  margin: 20px auto;
  padding: 0 20px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--border);
}

.cart-header h1 {
  color: var(--primary);
  margin: 0;
}

.cart-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

/* --- Cart Item Card --- */
.cart-items-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 2px solid var(--border);
  background-color: var(--white);
  border-radius: 12px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px var(--shadow-light);
}

/* This class is added with JavaScript */
.cart-item-card.selected {
  border-color: var(--primary);
  background-color: var(--primary-light);
}

.item-checkbox {
  width: 20px;
  height: 20px;
  margin-right: 15px;
  cursor: pointer;
  accent-color: var(--primary);
}

.item-image {
  width: 90px;
  height: 90px;
  border-radius: 8px;
  background: var(--light);
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--medium);
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: var(--dark);
}

.item-details p {
  color: var(--medium);
  font-size: 14px;
  margin: 0;
}

.item-details span {
  font-weight: bold;
  color: var(--primary);
  margin-top: 5px;
  display: block;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 20px;
}

.quantity-control button {
  padding: 5px 12px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  border: 1px solid var(--border);
  background: var(--white);
  border-radius: 6px;
  transition: all 0.2s;
}

.quantity-control button:hover:not(:disabled) {
  background: var(--light);
  border-color: var(--medium);
}

.quantity-control button:disabled {
  color: var(--border);
  cursor: not-allowed;
}

.quantity-control .quantity-display {
  min-width: 30px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}

.stock-warning {
  font-size: 12px;
  color: var(--error);
  font-weight: 600;
  margin-top: 5px;
  text-align: center;
}

.item-price {
  min-width: 100px;
  text-align: right;
  font-weight: bold;
  font-size: 18px;
  margin-right: 20px;
}

.remove-button {
  padding: 8px 10px;
  background: var(--danger-light);
  color: var(--danger);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;
}

.remove-button:hover {
  background: var(--danger);
  color: var(--white);
}

/* --- Order Summary --- */
.summary-container {
  position: sticky;
  top: 20px;
  align-self: start;
}

.order-summary-card {
  padding: 25px;
  border: 2px solid var(--primary);
  border-radius: 12px;
  background-color: var(--primary-light);
}

.order-summary-card h2 {
  margin-top: 0;
  margin-bottom: 20px;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  margin-bottom: 12px;
  color: var(--medium);
}

.summary-line span:last-child {
  font-weight: 600;
  color: var(--dark);
}

.total-line {
  display: flex;
  justify-content: space-between;
  font-size: 22px;
  font-weight: bold;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid var(--border);
  color: var(--primary);
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 25px;
}

/* --- Base Button Styles --- */
.btn {
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.2s;
}

.btn:disabled {
  background: var(--border);
  color: var(--medium);
  cursor: not-allowed;
}

.btn:focus {
  outline: none;
  box-shadow: 0 0 0 4px var(--focus-glow);
}

.btn-checkout {
  background: var(--primary);
  color: var(--white);
  font-size: 18px;
  padding: 15px;
}

.btn-checkout:hover:not(:disabled) {
  background: var(--primary-dark);
}

.btn-clear-cart {
  background: var(--danger-light);
  color: var(--danger);
}

.btn-clear-cart:hover:not(:disabled) {
  background: var(--danger);
  color: var(--white);
}

.btn-select-all {
  background: var(--white);
  color: var(--dark);
  border: 1px solid var(--border);
}

.btn-select-all:hover:not(:disabled) {
  background: var(--light);
}

/* --- Empty Cart Page --- */
.empty-cart-container {
  max-width: 1200px;
  margin: 50px auto;
  text-align: center;
}

.empty-cart-container h2 {
  font-size: 2rem;
  color: var(--medium);
  margin-bottom: 20px;
}

.empty-cart-container .continue-shopping-link {
  color: var(--primary);
  font-size: 1.2rem;
  font-weight: 600;
  text-decoration: none;
  border: 2px solid var(--primary);
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.2s;
}

.empty-cart-container .continue-shopping-link:hover {
  background: var(--primary);
  color: var(--white);
}

/* --- Media Query for Responsiveness --- */
@media (max-width: 900px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
}
`;


const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [selectedItems, setSelectedItems] = useState(
    cart.reduce((acc, item) => ({ ...acc, [item._id]: true }), {})
  );

  // This effect syncs the selection state with the cart
  useEffect(() => {
    const cartIds = new Set(cart.map(item => item._id));
    const newSelected = {};
    let selectionChanged = false;

    for (const id in selectedItems) {
      if (cartIds.has(id)) {
        newSelected[id] = selectedItems[id];
      } else {
        selectionChanged = true;
      }
    }
    
    for (const item of cart) {
      if (!(item._id in newSelected)) {
        newSelected[item._id] = true;
        selectionChanged = true;
      }
    }

    if (selectionChanged) {
      setSelectedItems(newSelected);
    }
  }, [cart, selectedItems]);


  if (cart.length === 0) {
    return (
      <div className="empty-cart-container">
        {/* We add the <style> tag here too for the empty cart page */}
        <style>{cartStyles}</style>
        <h2>Your Cart is Empty</h2>
        <Link to="/" className="continue-shopping-link">Continue Shopping</Link>
      </div>
    );
  }

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const toggleSelectAll = () => {
    const allSelected = cart.every(item => selectedItems[item._id]);
    const newSelection = cart.reduce((acc, item) => ({ ...acc, [item._id]: !allSelected }), {});
    setSelectedItems(newSelection);
  };

  const getSelectedItems = () => cart.filter(item => selectedItems[item._id]);
  const getSelectedTotal = () => getSelectedItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  const getSelectedCount = () => getSelectedItems().reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    const selected = getSelectedItems();
    if (selected.length === 0) {
      alert('Please select at least one item to checkout');
      return;
    }
    sessionStorage.setItem('checkoutItems', JSON.stringify(selected));
    navigate('/checkout');
  };

  const allSelected = cart.length > 0 && cart.every(item => selectedItems[item._id]);
  const selectedCount = getSelectedItems().length;

  return (
    // We use a React Fragment <> to return multiple elements
    <>
      {/* This <style> tag injects all the CSS onto the page */}
      <style>{cartStyles}</style>
      
      <div className="cart-page-container">
        <div className="cart-header">
          <h1>Shopping Cart ({cart.length})</h1>
          <button className="btn btn-select-all" onClick={toggleSelectAll}>
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        
        <div className="cart-layout">
          {/* --- Left Column: Cart Items --- */}
          <div className="cart-items-container">
            {cart.map(item => {
              const isSelected = selectedItems[item._id] || false;
              const isMaxStock = item.quantity >= item.stock;
              
              return (
                <div 
                  key={item._id} 
                  className={`cart-item-card ${isSelected ? 'selected' : ''}`}
                >
                  <input 
                    type="checkbox" 
                    className="item-checkbox"
                    checked={isSelected} 
                    onChange={() => toggleItemSelection(item._id)} 
                  />
                  
                  <div className="item-image">
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0]} alt={item.name} />
                    ) : (
                      <span>📷</span>
                    )}
                  </div>
                  
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>By {item.artisan?.name || 'Unknown Artisan'}</p>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} disabled={isMaxStock}>+</button>
                    
                    {isMaxStock && (
                      <div className="stock-warning">Max stock</div>
                    )}
                  </div>

                  <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                  
                  <button className="remove-button" onClick={() => removeFromCart(item._id)}>🗑️</button>
                </div>
              )
            })}
          </div>
          
          {/* --- Right Column: Order Summary --- */}
          <div className="summary-container">
            <div className="order-summary-card">
              <h2>Order Summary</h2>
              
              <div className="summary-line">
                <span>Items Selected:</span>
                <span>{selectedCount} of {cart.length}</span>
              </div>
              
              <div className="summary-line">
                <span>Total Quantity:</span>
                <span>{getSelectedCount()}</span>
              </div>
              
              <div className="total-line">
                <span>Total Price:</span>
                <span>${getSelectedTotal().toFixed(2)}</span>
              </div>
              
              <div className="button-group">
                <button 
                  className="btn btn-checkout" 
                  onClick={handleCheckout} 
                  disabled={selectedCount === 0}
                >
                  Checkout ({selectedCount} items)
                </button>
                <button className="btn btn-clear-cart" onClick={clearCart}>
                  Clear Entire Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;