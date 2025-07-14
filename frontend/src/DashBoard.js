// src/DashBoard.js
import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import Restaurants from './Restaurants';
import Contact from './Contact';
import MyOrders from './MyOrders';
import './Home.css';

import './Trash.css';

function DashBoard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userEmail = localStorage.getItem('email');
  const userName = userEmail ? userEmail.split('@')[0] : 'Guest';
  const user = {
    name: userName,
    profileImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhP1LzsEOSiEWX4xedVLb8maKpMnHCUpdtNQ&s',
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <div className="App">
      <header>
        <div className="navbar">
          <h1 className="logo">Stamjsp</h1>
          <nav>
            <ul>
              <li>
                <Link to="/dashboard">Home</Link>
              </li>
              <li>
                <Link to="/dashboard/restaurants">Restaurants</Link>
              </li>
              <li>
                <Link to="/dashboard/contact">Contact</Link>
              </li>
            </ul>
          </nav>

          <div className="profile" onClick={toggleDropdown}>
            <img
              src={user.profileImage}
              alt="Profile"
              className="profile-image"
            />
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <p>{user.name}</p>
                <Link to="/dashboard/my-orders">My Orders</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="restaurants" element={<Restaurants />} />
        <Route path="contact" element={<Contact />} />
        <Route path="my-orders" element={<MyOrders />} />
      </Routes>
    </div>
  );
}

function Home() {
  return (
    <section id="hero">
      {/* 3D model background */}
      <model-viewer
  src="/models/robot_waiter.glb"
  alt="Robot Waiter"
  camera-controls
  disable-zoom
  disable-pan
  auto-rotate="false"
  interaction-prompt="none"
  style={{
    position: 'absolute',
    top: '50%',
    left: '0',
    transform: 'translateY(-50%)',
    width: '400px',
    height: '400px',
    zIndex: 1,
    
  }}
></model-viewer>



      {/* Dark overlay */}
      <div className="overlay" />

      {/* Hero content */}
      <div className="hero-content">
        <h2>Fast and Tasty..!!</h2>
        <p>
          Order food from top restaurants and get it delivered directly to
          you.
        </p>
        <Link to="/dashboard/restaurants">
          <button className="cta-button">Order Now</button>
        </Link>
      </div>
    </section>
  );
}

export default DashBoard;
