// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from "react-router-dom";

import Login from "./Login";
import DashBoard from "./DashBoard";
import Signup from "./Signup";
import OwnerLogin from "./OwnerLogin";
import OwnerSignup from "./OwnerSignup";
import OwnerDashboard from "./OwnerDashboard";

import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";

import "./App.css";

import Sulli1 from "./Wa1.png";
import Sulli2 from "./Wa2.png";
import Sulli3 from "./Wa3.png";
import Sulli4 from "./Wa4.png";
import Sulli5 from "./Wa5.png";
import Sulli6 from "./Wa6.png";

function App() {
  // Check for admin token in localStorage
  const isAdminLoggedIn = () => !!localStorage.getItem("adminToken");

  // Inline wrapper for admin-only routes
  const AdminRoute = ({ children }) =>
    isAdminLoggedIn() ? children : <Navigate to="/admin/login" replace />;

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public / user-facing routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard/*" element={<DashBoard />} />

          {/* Owner routes */}
          <Route path="/ownerlogin" element={<OwnerLogin />} />
          <Route path="/ownersignup" element={<OwnerSignup />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />

          {/* Admin (hidden) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />

          {/* Fallback: redirect any unknown path to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <div className="hero-section">
        <div className="overlay">
          <h1 className="logo">Track And Taste</h1>
          <h2 className="tagline">Discover the best food & drinks</h2>
          <div className="menu-links">
            <Link to="/login" className="login-button">Log in</Link>
            <Link to="/signup" className="signup-button">Sign up</Link>
            <Link to="/ownerlogin" className="owner-button">Owner</Link>
          </div>
        </div>
      </div>
      <div className="card-section">
        <div className="card">
          <img src={Sulli1} alt="Order Online" />
          <h3>Order Online</h3>
          <p>Stay home and order to your doorstep</p>
        </div>
        <div className="card">
          <img src={Sulli2} alt="Dining" />
          <h3>Dining</h3>
          <p>View the city's favourite dining venues</p>
        </div>
        <div className="card">
          <img src={Sulli3} alt="Live Events" />
          <h3>Live Events</h3>
          <p>Discover India’s best events & concerts</p>
        </div>
        <div className="card">
          <img src={Sulli4} alt="Best Restaurants" />
          <h3>Best Restaurants</h3>
          <p>We test and review the Restaurants for best service</p>
        </div>
        <div className="card">
          <img src={Sulli5} alt="Healthy Options" />
          <h3>Healthy Options</h3>
          <p>Explore nutritious food choices</p>
        </div>
        <div className="card">
          <img src={Sulli6} alt="Best station" />
          <h3>Best station</h3>
          <p>
            We internally calculate distance and provide the destination station
            where your order arrives
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
