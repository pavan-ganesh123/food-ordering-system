import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './OwnerLogin.css';

function OwnerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/owner/login', {
        email,
        password,
      });
      setMessage(response.data.message);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('ownerEmail', response.data.email);
      localStorage.setItem('restaurantName', response.data.restaurantName);
      navigate('/owner-dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div className="owner-login-container">
      <h2>Owner Login</h2>
      <form onSubmit={handleLogin} className="owner-login-form">
        <div className="blinking-ball"></div> {/* Blinking ball element */}
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Log In</button>
      </form>
      {message && <p className="owner-login-message">{message}</p>}
      
      <p>
        <p>‎ </p>
        Don't have an account? <Link to="/ownersignup">Sign up here</Link>
      </p>
    </div>
  );
}

export default OwnerLogin;
