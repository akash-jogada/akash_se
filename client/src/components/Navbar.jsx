import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

// All your CSS is in this template literal
const navbarStyles = `
/* 1. Import the 'Lato' font */
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');

/* 2. Define Color Palette as CSS Variables */
:root {
  --primary: #2a9d8f;
  --primary-dark: #227b70;
  --danger: #e76f51;
  --danger-dark: #d85e40;
  --light: #f9f9f9;
  --white: #ffffff;
  --dark: #333333; /* Navbar background */
  --medium: #aaaaaa; /* Welcome text */
  --border: #e0e0e0;
  --focus-glow: rgba(42, 157, 143, 0.3);
}

/* --- Navbar Styles --- */
.navbar {
  font-family: 'Lato', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: var(--dark);
  padding: 15px 40px;
  color: var(--white);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  
  /* --- Sticky Navbar --- */
  position: sticky;
  top: 0;
  z-index: 1000;
}

* {
  box-sizing: border-box;
}

.navbar-brand {
  color: var(--white);
  font-size: 22px;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.2s;
}
.navbar-brand:hover {
  color: var(--primary);
}

.navbar-links {
  display: flex;
  gap: 25px;
  align-items: center;
}

/* --- Base Nav Link --- */
.nav-link {
  color: var(--white);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}
.nav-link:hover {
  color: var(--primary);
}

/* --- Cart Link & Badge --- */
.cart-link {
  position: relative;
  font-size: 18px; /* Make emoji slightly bigger */
}

.cart-badge {
  position: absolute;
  top: -10px;
  right: -12px;
  background: var(--danger);
  color: var(--white);
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
  /* This border helps it stand out from the navbar */
  border: 2px solid var(--dark);
}

/* --- User Info --- */
.welcome-text {
  color: var(--medium);
  font-style: italic;
  font-size: 14px;
}

/* --- Highlighted Buttons --- */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.2s;
  text-align: center;
}
.btn:focus {
  outline: none;
  box-shadow: 0 0 0 4px var(--focus-glow);
}

/* Primary Button (Register) */
.btn-primary {
  background: var(--primary);
  color: var(--white);
}
.btn-primary:hover {
  background: var(--primary-dark);
}

/* Secondary Button (Login) */
.btn-secondary {
  background: transparent;
  color: var(--white);
  /* Use a border that matches the primary color */
  border: 2px solid var(--primary);
}
.btn-secondary:hover {
  background: var(--primary);
  color: var(--white);
}

/* Danger Button (Logout) */
.btn-danger {
  background: var(--danger);
  color: var(--white);
}
.btn-danger:hover {
  background: var(--danger-dark);
}

/* --- Scroll To Top Button --- */
.scroll-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1001; /* Above other content */
  
  background: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px; /* Makes the arrow larger */
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  
  /* --- Visibility Animation --- */
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: opacity 0.3s, transform 0.3s, visibility 0.3s;
}

.scroll-to-top.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.scroll-to-top:hover {
  background: var(--primary-dark);
}
`;

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  // --- Scroll to Top State ---
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top on click
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Calculate total items in cart (sum of quantities)
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    // React Fragment to return navbar + scroll button
    <>
      {/* This <style> tag injects all the CSS onto the page */}
      <style>{navbarStyles}</style>

      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          Handicraft Market
        </Link>
        
        <div className="navbar-links">
          {user && (
            <Link to="/orders" className="nav-link">
              My Orders
            </Link>
          )}
          
          <Link to="/cart" className="nav-link cart-link">
            🛒
            {cartItemCount > 0 && (
              <span className="cart-badge">
                {cartItemCount}
              </span>
            )}
          </Link>
          
          {user ? (
            <>
              <span className="welcome-text">Welcome, {user.name}</span>
              
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link">
                  🔐 Admin
                </Link>
              )}
              
              {user.role === 'artisan' && (
                <Link to="/artisan/products" className="nav-link">
                  My Products
                </Link>
              )}
              
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Highlighted CTA Buttons */}
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </nav>

      {/* --- Scroll to Top Button --- */}
      <button 
        onClick={scrollToTop} 
        className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
        title="Go to top"
      >
        ↑
      </button>
    </>
  );
};

export default Navbar;