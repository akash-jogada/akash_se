import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// All your CSS is in this template literal
const loginStyles = `
/* 1. Import the 'Lato' font */
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');

/* --- FIX: Reset html and body to remove default margins --- */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
}

/* 2. Define Color Palette as CSS Variables */
:root {
  --primary: #2a9d8f;
  --primary-dark: #227b70;
  --danger-light: #fdebe6;
  --error: #c62828;
  --light: #f9f9f9;
  --white: #ffffff;
  --dark: #333333;
  --medium: #666666;
  --border: #e0e0e0;
  --focus-glow: rgba(42, 157, 143, 0.3);
}

/* --- Page Layout & Video Background --- */
.login-page-container {
  font-family: 'Lato', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  /* --- FIX: Use min-height and width: 100% --- */
  min-height: 100vh;
  width: 100%;
  overflow-y: auto; /* Allow scrolling if card is tall */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px; /* Add padding for small screens */
}

/* This is the video element */
.background-video {
  /* --- FIX: Use position: fixed --- */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -2; /* Sit behind everything */
  object-fit: cover; /* Cover the entire area */
}

/* This is the dark overlay on top of the video */
.login-form-overlay {
  /* --- FIX: Use position: fixed --- */
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 50% black tint */
  z-index: -1; /* Sit behind the form, on top of the video */
}

* {
  box-sizing: border-box;
}

/* --- Login Card --- */
.login-form-card {
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.95);
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  /* --- FIX: Add z-index to sit on top of overlay --- */
  z-index: 1;
}

.login-form-card h2 {
  text-align: center;
  color: var(--primary);
  font-size: 2rem;
  margin-top: 0;
  margin-bottom: 25px;
}

/* --- Form Elements --- */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 14px;
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

/* --- Error Message --- */
.error-message {
  padding: 12px;
  background: var(--danger-light);
  color: var(--error);
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid var(--error);
  font-size: 14px;
  text-align: center;
}

/* --- Base Button --- */
.btn {
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.2s;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
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

/* --- Primary Login Button --- */
.btn-primary {
  background: var(--primary);
  color: var(--white);
  font-size: 18px;
  padding: 14px;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
}

/* --- Social Login Buttons --- */
.social-login-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.btn-social {
  background: var(--white);
  color: var(--dark);
  border: 1px solid var(--border);
  padding: 14px;
}

.btn-social:hover:not(:disabled) {
  background: var(--light);
  border-color: var(--medium);
}

.btn-social img {
  width: 20px;
  height: 20px;
}

/* --- "OR" Divider --- */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--medium);
  font-size: 14px;
  font-weight: 600;
  margin: 25px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--border);
}

.divider:not(:empty)::before {
  margin-right: 1em;
}

.divider:not(:empty)::after {
  margin-left: 1em;
}

/* --- Links --- */
.links-container {
  display: flex;
  justify-content: space-between;
  margin-top: -10px;
  margin-bottom: 20px;
}

.form-link {
  font-size: 14px;
  color: var(--primary);
  font-weight: bold;
  text-decoration: none;
}

.form-link:hover {
  text-decoration: underline;
}

.register-link {
  text-align: center;
  margin-top: 25px;
  font-size: 14px;
  color: var(--medium);
}

.register-link a {
  color: var(--primary);
  font-weight: bold;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // This is where you would trigger your Google login popup/redirect
    console.log("Google login clicked");
    setError("Google login is not implemented yet.");
  };

  const handleAppleLogin = () => {
    // This is where you would trigger your Apple login
    console.log("Apple login clicked");
    setError("Apple login is not implemented yet.");
  };

  return (
    <>
      {/* This <style> tag injects all the CSS onto the page */}
      <style>{loginStyles}</style>

      <div className="login-page-container">
        {/* Make sure this path is correct (e.g., /Bg-video.mp4) */}
        <video className="background-video" autoPlay loop muted playsInline>
          <source src="/Bg-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="login-form-overlay"></div>

        <div className="login-form-card">
          <h2>Login</h2>
          
          {error && <p className="error-message">{error}</p>}

          <div className="social-login-group">
            <button className="btn btn-social" onClick={handleGoogleLogin}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google icon" />
              Continue with Google
            </button>
            <button className="btn btn-social" onClick={handleAppleLogin}>
              <img src="https://www.svgrepo.com/show/475631/apple-color.svg" alt="Apple icon" />
              Continue with Apple
            </button>
          </div>

          <div className="divider">OR</div>
          
          <form onSubmit={handleEmailSubmit} className="login-form">
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="links-container">
              <div></div> {/* Empty div for spacing */}
              <Link to="/forgot-password" className="form-link">Forgot password?</Link>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login with Email'}
            </button>
            
          </form>

          <p className="register-link">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;