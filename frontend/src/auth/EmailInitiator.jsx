import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UserSvg from "../components/UserSvg"

const EmailInitiator = () => {
  const { action } = useParams();

  const [emailInitiatorData, setEmailInitiator] = useState({
    email: "",
    action: action === "forgot-password" ? "f_p" : (action === "verify-email" ? "v_e" : "invalid_action"),
  });

  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDisabled(!["verify-email", "forgot-password"].includes(action));
  }, [action]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailInitiator((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSendCode = async () => {
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailInitiatorData.email)
    )
      return window.failure("Provide valid email address");
    setLoading(true);
    try {
      const endpoint = action === "verify-email" 
        ? `${process.env.REACT_APP_BACKEND_PORT}/api/send-email-verification-token/${emailInitiatorData.email}`
        : `${process.env.REACT_APP_BACKEND_PORT}/api/send-password-reset-token/${emailInitiatorData.email}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const result = await response.json();
      if (response.ok) {
        window.success("Email sent !");
      } else {
        window.failure(result.message || "Something went wrong");
      }
    } catch (error) {
      window.failure("Please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-container email-initiator-container'>
      <div className='signup-content email-initiator-content'>
        <UserSvg/>
        <h2>{action === "forgot-password" ? "Forgot Password" : (action === "verify-email") ? "Verify Email" : "Invalid Action"}</h2>
        <p>Please check email before sending the code!</p>
        <input 
          disabled={disabled || loading} 
          onChange={handleChange} 
          value={emailInitiatorData.email} 
          name='email' 
          placeholder='Email' 
          type="text" 
        />
        <button 
          disabled={disabled || loading} 
          style={disabled ? { cursor: "not-allowed", marginTop: "20px" } : { marginTop: "20px" }} 
          className='cta-login-btn' 
          onClick={handleSendCode}
        >
          {loading ? <>
              <span className='btn-icon'><i className="ri-key-2-line"></i></span>
              <span>Please wait...</span>
            </> : (
            <>
              <span className='btn-icon'><i className="ri-key-2-line"></i></span>
              <span>Send Code</span>
            </>
          )}
        </button>
        <p>Go to Login? <Link to="/auth/login"> Login</Link></p>
      </div>
    </div>
  );
};

export default EmailInitiator;
