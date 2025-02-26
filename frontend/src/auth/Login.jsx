import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import UserSvg from "../components/UserSvg";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async () => {
    if (loginData.email.trim() === "" || loginData.password.trim() === "")
      return window.failure("Fields are empty");
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_PORT}/api/login`,
        loginData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        window.success(response.data.message);
        window.location.href = "../";
      }
    } catch (err) {
      window.failure(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-container">
      <div className="login-content">
        <UserSvg />
        <h2>Log in to your account</h2>
        <p>We're happy to see you again!</p>
        <input
          onChange={handleChange}
          name="email"
          placeholder="Email"
          type="text"
        />
        <input
          onChange={handleChange}
          name="password"
          placeholder="Password"
          type="password"
        />
        <div className="forgot-password-layer">
          <Link to="/auth/email-initiator/forgot-password">
            Forgot your password?
          </Link>
        </div>
        <button
          disabled={loading}
          onClick={handleLogin}
          className="cta-login-btn"
        >
          <span className="btn-icon">
            <i className="ri-lock-star-line"></i>
          </span>
          <span>{loading ? "Please wait..." : "Log in"}</span>
        </button>
        <p>
          Don't have an account?
          <Link to="/auth/signup"> Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
