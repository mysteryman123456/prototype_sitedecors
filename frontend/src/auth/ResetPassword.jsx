import React, { useState } from 'react';
import { useLocation , Link} from 'react-router-dom';
import axios from 'axios';
import UserSvg from '../components/UserSvg';

const ResetPassword = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const [password, setPassword] = useState("");

  const isValid = /^(?=.*\d)(?=.*[\W_]).{7,}$/.test(password);
  const handleResetPassword = async () => {
    if(!isValid) return window.failure("Use stronger password")
    try {
      const response  = await axios.post(`${process.env.REACT_APP_BACKEND_PORT}/api/update-password`, 
        { newPassword: password, token },
        { headers: { "Content-Type": "application/json" } }
      );
      if(response.status === 200){
        window.success(response?.data?.message || "Password updated !")
      }
    } catch (error) {
      window.failure(error.response?.data?.message || "Please try again later");
    }
  };

  return (
    <div className='login-container forgot-password-container'>
      <div className='login-content forgot-password-content'>
        <UserSvg />
        <h2>Forgot your password?</h2>
        <p>Reset it to a new one in just a few seconds!</p>
        <input
          name='new-password'
          placeholder='New Password'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {password.length >= 1 && (
          <div
            style={{ textAlign: "left" }}
            className={`password-message ${isValid ? "valid" : ""}`}
          >
            <i
              className={`ri-${isValid ? "checkbox" : "close"}-circle-line`}
            ></i>
            &nbsp;7+ characters with atleast one number & special char
          </div>
        )}
        <button style={{ marginTop: "15px" }} className='cta-login-btn' onClick={handleResetPassword}>
          <span className='btn-icon'><i className="ri-key-2-line"></i></span>
          <span>Reset Password</span>
        </button>
        <p>Go to Login? <Link to="/auth/login"> Login</Link></p>
      </div>
    </div>
  );
};

export default ResetPassword;
