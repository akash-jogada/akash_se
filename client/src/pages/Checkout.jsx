import { useState, useContext, useEffect, useRef } from 'react'; // Import useRef
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

// All your CSS is now in this template literal
const checkoutStyles = `
/* 1. Import the 'Lato' font */
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');

/* 2. Set global font and box-sizing */
.checkout-page-container {
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
.checkout-page-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.checkout-page-container h1 {
  color: var(--primary);
  border-bottom: 2px solid var(--border);
  padding-bottom: 15px;
}

.checkout-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

/* --- Shipping Form (Left Column) --- */
.shipping-form-container {
  background: var(--white);
  padding: 30px;
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 4px 12px var(--shadow-light);
}

.shipping-form h2 {
  margin-top: 0;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.input {
  width: 100%;
  padding: 12px 15px;
  font-size: 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--focus-glow);
}

.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.error-message {
  padding: 15px;
  background: var(--danger-light);
  color: var(--error);
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid var(--danger);
}

/* --- Payment Method --- */
.payment-options-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

/* This is now the main button */
.payment-option-btn {
  padding: 15px;
  font-size: 18px; /* Made larger */
  font-weight: bold;
  color: var(--dark);
  background: var(--white);
  border: 2px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center; /* Centered text */
}

.payment-option-btn:hover:not(:disabled) {
  border-color: var(--primary);
  background: var(--primary-light);
}

/* Active state for the selected button */
.payment-option-btn.active {
  border-color: var(--primary);
  background: var(--primary);
  color: var(--white);
  box-shadow: 0 0 0 3px var(--focus-glow);
}

.payment-option-btn:disabled {
  background: var(--border);
  color: var(--medium);
  cursor: not-allowed;
  border-color: var(--border);
}


/* --- Order Summary (Right Column) --- */
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

.summary-item-list {
  margin-bottom: 15px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-item .item-name {
  color: var(--dark);
}

.summary-item .item-price {
  font-weight: bold;
  color: var(--dark);
}

.total-line {
  display: flex;
  justify-content: space-between;
  font-size: 22px;
  font-weight: bold;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid var(--primary);
  color: var(--primary);
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

/* --- Media Query for Responsiveness --- */
@media (max-width: 900px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }
}
`;

const Checkout = () => {
  const { cart, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({ street: '', city: '', state: '', zipCode: '', country: '' });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Create a ref for the form
  const formRef = useRef(null);

  useEffect(() => {
    const selectedItems = sessionStorage.getItem('checkoutItems');
    if (selectedItems) {
      setCheckoutItems(JSON.parse(selectedItems));
    } else if (cart.length > 0) {
      setCheckoutItems(cart);
    }
  }, [cart]);

  if (!user) {
    return (
      <>
        <style>{checkoutStyles}</style>
        <div className="centered-page">
          <h2>Please login to checkout</h2>
          <Link to="/login" className="centered-page-link">Go to Login</Link>
        </div>
      </>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <>
        <style>{checkoutStyles}</style>
        <div className="centered-page">
          <h2>No items selected for checkout</h2>
          <Link to="/cart" className="centered-page-link">Back to Cart</Link>
        </div>
      </>
    );
  }

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const getTotal = () => checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // This is the new handler for the payment buttons
  const handlePaymentSelectAndSubmit = (method) => {
    // 1. Set the payment method for UI highlight
    setPaymentMethod(method);
    
    // 2. Manually check form validity
    if (!formRef.current.reportValidity()) {
      // This will show the browser's "Please fill out this field" popup
      return; 
    }
    
    // 3. If form is valid, proceed to submit
    handleSubmit(method);
  };
  
  // This function now only contains the submission logic
  const handleSubmit = async (selectedPaymentMethod) => {
    setLoading(true);
    setError('');

    // --- Payment Logic ---
    if (selectedPaymentMethod !== 'cod' ) {
      setError('This payment method is not implemented yet. Please select Cash on Delivery.');
      setLoading(false);
      return; // Stop the submission
    }
    // --- End Payment Logic ---

    // Proceed with COD
    try {
      const orderData = {
        items: checkoutItems.map(item => ({ product: item._id, quantity: item.quantity })),
        shippingAddress,
        paymentMethod: selectedPaymentMethod
      };

      const response = await API.post('/orders', orderData);

      if (response.data.success) {
        checkoutItems.forEach(item => removeFromCart(item._id));
        sessionStorage.removeItem('checkoutItems');
        alert('Order placed successfully!');
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <style>{checkoutStyles}</style>

      <div className="checkout-page-container">
        <h1>Checkout</h1>

        <div className="checkout-layout">
          
          {/* --- Left Column: Shipping Form --- */}
          <div className="shipping-form-container">
            {/* We still use a <form> tag to get HTML5 validation, 
              but we remove the main submit button.
            */}
            <form ref={formRef} className="shipping-form" onSubmit={(e) => e.preventDefault()}>
              <h2>Shipping Address</h2>
              
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="street">Street Address</label>
                <input id="street" type="text" name="street" value={shippingAddress.street} onChange={handleChange} required className="input" />
              </div>

              <div className="input-grid form-group">
                <div>
                  <label htmlFor="city">City</label>
                  <input id="city" type="text" name="city" value={shippingAddress.city} onChange={handleChange} required className="input" />
                </div>
                <div>
                  <label htmlFor="state">State</label>
                  <input id="state" type="text" name="state" value={shippingAddress.state} onChange={handleChange} required className="input" />
                </div>
              </div>

              <div className="input-grid form-group">
                <div>
                  <label htmlFor="zipCode">ZIP Code</label>
                  <input id="zipCode" type="text" name="zipCode" value={shippingAddress.zipCode} onChange={handleChange} required className="input" />
                </div>
                <div>
                  <label htmlFor="country">Country</label>
                  <input id="country" type="text" name="country" value={shippingAddress.country} onChange={handleChange} required className="input" />
                </div>
              </div>

              {/* --- Payment Method Buttons --- */}
              <div className="form-group">
                <h2>Payment Method</h2>
                <div className="payment-options-container">
                  <button
                    type="button"
                    className={`payment-option-btn ${paymentMethod === 'cod' ? 'active' : ''}`}
                    onClick={() => handlePaymentSelectAndSubmit('cod')}
                    disabled={loading}
                  >
                    {loading && paymentMethod === 'cod' ? 'Processing...' : 'Place Order (Cash on Delivery)'}
                  </button>
                  <button
                    type="button"
                    className={`payment-option-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => handlePaymentSelectAndSubmit('upi')}
                    disabled={loading}
                  >
                    {loading && paymentMethod === 'upi' ? 'Processing...' : 'Pay with UPI'}
                  </button>
                  <button
                    type="button"
                    className={`payment-option-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => handlePaymentSelectAndSubmit('card')}
                    disabled={loading}
                  >
                    {loading && paymentMethod === 'card' ? 'Processing...' : 'Pay with Credit / Debit Card'}
                  </button>
                </div>
              </div>
              
              {/* --- The old submit button is gone --- */}
              
            </form>
          </div>

          {/* --- Right Column: Order Summary --- */}
          <div className="summary-container">
            <div className="order-summary-card">
              <h2>Order Summary</h2>
              <div className="summary-item-list">
                {checkoutItems.map(item => (
                  <div key={item._id} className="summary-item">
                    <span className="item-name">{item.name} x {item.quantity}</span>
                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="total-line">
                <span>Total:</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Checkout;