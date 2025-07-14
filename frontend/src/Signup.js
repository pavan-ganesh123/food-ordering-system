import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; // Using the same CSS file
import gifIcon from "./Deepam.gif";

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await axios.post('http://localhost:5000/signup', { email, password });
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500); // Redirect to login after a delay
    } catch (error) {
      setMessage(error.response?.data?.message || "Error during signup");
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">
        S<img src={gifIcon} alt="GIF" className="gif-icon" />gn Up
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="blinking-ball"></div> {/* Blinking ball element */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p className="message">{message}</p>
    </div>
  );
}

export default Signup;
