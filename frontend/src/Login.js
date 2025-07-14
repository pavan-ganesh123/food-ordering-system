import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import tickGif from "./Tick.gif"; // Import the tick mark GIF

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showTick, setShowTick] = useState(false); // State for showing tick mark GIF
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://mern-backend-b5c1.onrender.com/login', { email, password });
      const { token, email: userEmail } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("email", userEmail);
      // setMessage("Login successful");
      setShowTick(true); // Show tick mark GIF on successful login
      setTimeout(() => {
        navigate("/dashboard");
      }, 8300); // Redirect to dashboard after a short delay
    } catch (error) {
      setMessage(error.response?.data?.message || "Error");
      setShowTick(false); // Hide tick mark GIF on error
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
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
        <button type="submit">Login</button>
      </form>
      <p className="message">{message}</p>
      {showTick && <img src={tickGif} alt="Success" className="tick-gif" />} {/* Display tick GIF */}
    </div>
  );
}

export default Login;
