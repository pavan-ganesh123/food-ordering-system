import React, { useState } from 'react';
import axios from 'axios';
import './OwnerSignup.css';

function OwnerSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [message, setMessage] = useState('');
  const [restaurantImage, setRestaurantImage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://mern-backend-b5c1.onrender.com/owner/signup', {
        email,
        password,
        restaurantName,
        address,
        openingHours,
        cuisineType,
        restaurantImage,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error signing up');
    }
  };

  return (
    <div className="owner-signup-container">
      <form className="owner-signup-form" onSubmit={handleSignup}>
      <div className="blinking-ball"></div> {/* Blinking ball element */}
        <h2>Owner Signup</h2>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Restaurant Name:</label>
          <input
            type="text"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Opening Hours:</label>
          <input
            type="text"
            value={openingHours}
            onChange={(e) => setOpeningHours(e.target.value)}
          />
        </div>
        <div>
          <label>Cuisine Type:</label>
          <input
            type="text"
            value={cuisineType}
            onChange={(e) => setCuisineType(e.target.value)}
          />
        </div>
        <div>
          <label>Restaurant Image:</label>
          <input
            type="text"
            value={restaurantImage}
            onChange={(e) => setRestaurantImage(e.target.value)}
          />
        </div>
        <button type="submit">Sign Up</button>
        {message && <p className={`message ${message.includes('Error') ? 'error' : ''}`}>{message}</p>}
      </form>
    </div>
  );
}

export default OwnerSignup;
