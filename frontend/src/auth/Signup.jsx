import React, { useState } from "react";
import { Link , useNavigate} from "react-router-dom";
import axios from "axios";
import UserSvg from "../components/UserSvg";

const Signup = () => {
  const[loading , setLoading] = useState(false)
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isValid = /^(?=.*\d)(?=.*[\W_]).{7,30}$/.test(signupData.password);
  const handleSignup = async () => {
    //validations
    if (signupData.username.trim().length <= 3)
      return window.failure("Username must be longer");
    if (signupData.username.trim().length > 30)
      return window.failure("Username must be shorter");
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(signupData.email)
    )
      return window.failure("Provide valid email address");
    if (!isValid) return window.failure("Provide valid password");
    if (signupData.password !== signupData.confirmPassword)
      return window.failure("Passwords do not match");
    setLoading(true)
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_PORT}/api/signup`,
        signupData
      );
      if (response.status === 201){
        const data = response.data;
        window.success(data.message);
        return navigate("/auth/email-initiator/verify-email")
      }
    } catch (err) {
      window.failure(err.response?.data?.message || "Signup failed");
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <UserSvg/>  
        <h2>Regsiter a new account</h2>
        <p>Start buying and selling in just a few steps</p>
        <input
          onChange={handleChange}
          name="username"
          placeholder="Username"
          type="text"
        />
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
        <input
          onChange={handleChange}
          name="confirmPassword"
          placeholder="Confirm password"
          type="password"
        />
        {signupData.password.length >= 1 && (
          <div
            style={{ textAlign: "left" }}
            className={`password-message ${isValid ? "valid" : ""}`}
          >
            <i
              className={`ri-${isValid ? "checkbox" : "close"}-circle-line`}
            ></i>
            &nbsp;7+ characters with atleast one number & special char and less than 30 characters
          </div>
        )}
        <p
          style={{
            fontSize: "13px",
            margin: "15px 10px 15px 0",
            color: "var(--black-color)",
            textAlign: "left",
          }}
        >
          Please click on verify email after signup{" "}
          <Link to="/auth/email-initiator/verify-email"> Verify Email</Link>
        </p>
        <button disabled={loading} onClick={handleSignup} className="cta-signup-btn">
          <span className="btn-icon">
            <i className="ri-add-circle-line"></i>
          </span>
          <span>{loading ? "Please wait..." : "Signup"}</span>
        </button>
        <p>
          Have an account?<Link to="/auth/login"> Log in</Link>
        </p>
        </div>
    </div>
  );
};

export default Signup;
