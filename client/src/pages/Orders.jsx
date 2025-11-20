import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

// All your CSS is now in this template literal
const ordersStyles = `
/* 1. Import the 'Lato' font */
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');

/* 2. Set global font and box-sizing */
.orders-page-container {
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
  --focus-glow: rgba(42, 157, 143, 0.3);
  
  /* Status Colors */
  --status-pending: #f59e0b;
  --status-processing: #3b82f6;
  --status-shipped: #8b5cf6;
  --status-delivered: #10b981;
  --status-cancelled: #ef4444;
  --status-default: #6b7280;
}

/* --- Page Layout --- */
.orders-page-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.orders-page-container h1 {
  color: var(--primary);
  border-bottom: 2px solid var(--border);
  padding-bottom: 15px;
}

.order-list-container {
  margin-top: 30px;
}

/* --- Order Card --- */
.order-card {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 20px;
  background-color: var(--white);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--light);
}

.order-id-date h3 {
  margin: 0 0 5px 0;
  font-size: 1.4rem;
  color: var(--dark);
}
.order-id-date p {
  margin: 0;
  font-size: 14px;
  color: var(--medium);
}

.order-status-total {
  text-align: right;
}

.status-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  color: white;
  /* Uses the --status-color variable set in the style attribute */
  background-color: var(--status-color, var(--status-default));
}

.order-total {
  margin: 10px 0 0 0;
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--primary);
}

/* --- Order Body --- */
.order-body h4 {
  margin-bottom: 10px;
  color: var(--dark);
  font-size: 1.1rem;
}

.items-list-container {
  margin-bottom: 15px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background-color: var(--light);
  border-radius: 8px;
  margin-bottom: 8px;
}

.order-item-details p:first-child {
  margin: 0 0 5px 0;
  font-weight: bold;
  color: var(--dark);
}
.order-item-details p:last-child {
  margin: 0;
  font-size: 14px;
  color: var(--medium);
}

.order-item-subtotal {
  font-weight: bold;
  color: var(--primary);
  font-size: 1.1rem;
}

.shipping-details {
  padding: 15px;
  background-color: var(--light);
  border-radius: 8px;
  margin-bottom: 20px;
}
.shipping-details p {
  margin: 0;
  font-size: 14px;
  color: var(--medium);
  line-height: 1.6;
}

/* --- Order Footer & Buttons --- */
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.payment-method {
  margin: 0;
  font-size: 14px;
  color: var(--medium);
}

.order-actions {
  display: flex;
  gap: 10px;
}

/* --- Base Button Styles --- */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.2s;
  text-align: center;
}
.btn:focus {
  outline: none;
  box-shadow: 0 0 0 4px var(--focus-glow);
}

/* Primary Button (View Details) */
.btn-primary {
  background: var(--primary);
  color: var(--white);
}
.btn-primary:hover {
  background: var(--primary-dark);
}

/* Secondary Button (Download Invoice) */
.btn-secondary {
  background: var(--white);
  color: var(--primary);
  border: 2px solid var(--primary);
}
.btn-secondary:hover {
  background: var(--primary-light);
}

/* --- Guard Pages (Login/Empty/Error) --- */
.centered-page {
  max-width: 600px;
  margin: 50px auto;
  text-align: center;
  padding: 40px;
  background: var(--light);
  border-radius: 12px;
}
.centered-page h2, .centered-page h3 {
  font-size: 1.8rem;
  color: var(--dark);
  margin-bottom: 15px;
}
.centered-page p {
  color: var(--medium);
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
.error-page {
  background-color: var(--danger-light);
  border: 1px solid var(--danger);
}
.error-page h3 {
  color: var(--error);
}
`;

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    API.get('/orders')
      .then(res => {
        // Sort orders by most recent first
        const sortedOrders = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to load orders');
        setLoading(false);
      });
  }, [user]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'var(--status-pending)',
      processing: 'var(--status-processing)',
      shipped: 'var(--status-shipped)',
      delivered: 'var(--status-delivered)',
      cancelled: 'var(--status-cancelled)'
    };
    return colors[status] || 'var(--status-default)';
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  // New feature: Handle invoice download
  const handleDownloadInvoice = (order) => {
    // In a real app, this would call an API endpoint:
    // API.get(`/orders/${order._id}/invoice`)
    // For now, it just shows an alert.
    alert(`Invoice download for Order #${order._id.slice(-8).toUpperCase()} is not implemented yet.`);
  };

  if (!user) {
    return (
      <>
        <style>{ordersStyles}</style>
        <div className="centered-page">
          <h2>Please login to view orders</h2>
          <Link to="/login" className="centered-page-link">Go to Login</Link>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <div className="orders-page-container">
        <h1 style={{ marginBottom: '30px' }}>My Orders</h1>
        <p style={{ textAlign: 'center' }}>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <style>{ordersStyles}</style>
        <div className="centered-page error-page">
          <h3>Error loading orders</h3>
          <p>{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* This <style> tag injects all the CSS onto the page */}
      <style>{ordersStyles}</style>

      <div className="orders-page-container">
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <div className="centered-page">
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here!</p>
            <Link to="/" className="centered-page-link">Browse Products</Link>
          </div>
        ) : (
          <div className="order-list-container">
            {orders.map(order => (
              <div
                key={order._id}
                className="order-card"
              >
                {/* Order Header */}
                <div className="order-header">
                  <div className="order-id-date">
                    <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p>
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="order-status-total">
                    <span
                      className="status-badge"
                      // Set the CSS variable for dynamic color
                      style={{ '--status-color': getStatusColor(order.status) }}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                    <p className="order-total">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order Body */}
                <div className="order-body">
                  <div className="items-list-container">
                    <h4>Items ({order.items.length})</h4>
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="order-item"
                      >
                        <div className="order-item-details">
                          <p>{item.name}</p>
                          <p>
                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="order-item-subtotal">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="shipping-details">
                    <h4 style={{ margin: '0 0 10px 0' }}>Shipping Address</h4>
                    <p>
                      {order.shippingAddress.street}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
                
                {/* Order Footer */}
                <div className="order-footer">
                  <p className="payment-method">
                    <strong>Payment Method:</strong> {order.paymentMethod || 'Cash on Delivery'}
                  </p>
                  <div className="order-actions">
                    {/* NEW: Download Invoice Button */}
                    {order.status === 'delivered' && (
                      <button
                        onClick={() => handleDownloadInvoice(order)}
                        className="btn btn-secondary"
                      >
                        Download Invoice
                      </button>
                    )}
                    
                    {/* View Details Button */}
                    <Link
                      to={`/orders/${order._id}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;