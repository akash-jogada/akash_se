import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

// All your CSS is in this template literal
// It's the same style as Login, just with .register-
const registerStyles = `
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
.register-page-container {
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
.register-form-overlay {
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

/* --- Register Card --- */
.register-form-card {
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.95);
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  /* Add z-index to ensure it's above the fixed overlay */
  z-index: 1; 
}

.register-form-card h2 {
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

/* Base style for both input and select */
.input {
  width: 100%;
  padding: 12px 15px;
  font-size: 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: var(--white);
  color: var(--dark);
}

.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--focus-glow);
}

/* Specific style for select to make it look like an input */
select.input {
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%2C%20fill%3D%22%23666%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 16px;
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

/* --- Button --- */
.btn {
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.2s;
  width: 100%;
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

.btn-primary {
  background: var(--primary);
  color: var(--white);
  font-size: 18px;
  padding: 14px;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
}

/* --- Login Link --- */
.login-link {
  text-align: center;
  margin-top: 25px;
  font-size: 14px;
  color: var(--medium);
}

.login-link a {
  color: var(--primary);
  font-weight: bold;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
`;


const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Add password length check
    if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setLoading(false);
        return;
    }

    try {
      const response = await API.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      if (response.data.success) {
        alert('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* This <style> tag injects all the CSS onto the page */}
      <style>{registerStyles}</style>
      
      <div className="register-page-container">
        {/* Make sure this path is correct (e.g., /Bg-video.mp4) */}
        <video className="background-video" autoPlay loop muted playsInline>
          <source src="/Bg1-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="register-form-overlay"></div>

        <div className="register-form-card">
          <h2>Create Account</h2>
          
          {error && <p className="error-message">{error}</p>}
          
          <form onSubmit={handleSubmit} className="register-form">

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                className="input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                className="input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                className="input"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Register as</label>
              <select
                id="role"
                name="role"
                className="input"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="customer">Customer</option>
                <option value="artisan">Artisan</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
            
          </form>

          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;