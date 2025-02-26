import React, { useContext, useEffect, useState } from "react";
import Placeholder from "../../assets/avatars/Placeholder.png";
import { SessionContext } from "../../context/SessionContext";
import axios from "axios";
import WarningCard from "../../assets/WarningCard";

const Profile = () => {
  const { sessionData } = useContext(SessionContext);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "" || "User",
    phonenumber: "",
    old_password: "",
    new_password: "",
    profileImage: "",
    googleLogin: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (sessionData?.email) {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_PORT}/api/get-user-by-email`,
            { email: sessionData?.email },
            { withCredentials: true }
          );
          if (response.status === 200) {
            setProfileData((prevData) => ({
              ...prevData,
              ...response.data.message,
            }));
          }
        } catch (err) {
          window.failure(
            err?.response?.data?.message || "Could not fetch user"
          );
        }
      }
    };
    fetchData();
  }, [sessionData?.email]);

  const getImagePreview = () => {
    if (profileData?.profileImage instanceof File) {
      return URL.createObjectURL(profileData.profileImage);
    }
    return profileData?.profileImage || Placeholder;
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if ((name === "new_password" || name === "old_password") && value === " ")
      return (value = "");
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfileData((prev) => ({ ...prev, profileImage: e.target.files[0] }));
  };

  // password check
  const isValid = /^(?=.*\d)(?=.*[\W_]).{7,}$/.test(profileData.new_password);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      profileData.profileImage instanceof File &&
      profileData.profileImage.size >= 2 * 1024 * 1024
    )
      return window.failure("Profile image exceeds 2 MB");
    if (!profileData.old_password.trim() !== !profileData.new_password.trim())
      return window.failure("Password field is empty");
    if (profileData.username.trim().length <= 3)
      return window.failure("Username must be longer");
    if (!/^9\d{9}$/.test(profileData.phonenumber.trim()))
      return window.failure("Invalid Phonenumber");
    if (
      profileData.old_password.trim() !== "" &&
      profileData.new_password.trim() !== "" &&
      !isValid
    )
      return window.failure("Use stroger password");
    try {
      const formData = new FormData();
      for (let key in profileData) {
        const value = profileData[key];
        if (key === "profileImage" && !(value instanceof File)) continue;
        if (profileData.hasOwnProperty(key)) {
          formData.append(key, value);
        }
      }
      setLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_PORT}/api/update-user`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      const data = response.data;
      if (response.status === 200) window.success(data.message);
    } catch (err) {
      window.failure(err.response.data.message || "Please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {profileData?.googleLogin ? (
        <WarningCard
          message={
            "This account uses Google login, so the password cannot be updated"
          }
        />
      ) : (
        <WarningCard
          message={
            "Leave the password fields empty if you do not wish to change your password !"
          }
        />
      )}
      <div className="ch-p-container">
        <div className="ch-p-image-cta">
          <div className="ch-p-profile-image">
            <img
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = Placeholder;
              }}
              className="ch-p-image"
              src={getImagePreview()}
              alt="Profile"
            />
            <label htmlFor="profileImage" className="add-image-label">
              <i className="ri-pencil-fill"></i>
            </label>
          </div>

          <input
            type="file"
            id="profileImage"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <div className="ch-p-name-group">
            <h3>{profileData.username}</h3>
            <small>
              <i className="ri-mail-check-line"></i> {sessionData?.email}
            </small>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="ch-p-form">
          <div className="ch-p-input-group">
            <label htmlFor="username">Full Name</label>
            <input
              name="username"
              value={profileData.username}
              type="text"
              id="username"
              placeholder="Enter your fullname"
              onChange={handleInputChange}
            />
          </div>

          <div className="ch-p-input-group">
            <label>Email</label>
            <input readOnly disabled value={sessionData?.email} />
          </div>

          <div className="ch-p-input-group">
            <label htmlFor="phonenumber">Phone Number</label>
            <input
              name="phonenumber"
              value={profileData.phonenumber}
              type="text"
              id="phonenumber"
              placeholder="Enter your phone number"
              onChange={handleInputChange}
            />
          </div>

          <div className="ch-p-input-group">
            <label htmlFor="old_password">Old Password</label>
            <input
              name="old_password"
              value={profileData.old_password}
              type="password"
              id="old_password"
              placeholder="Enter your old password"
              disabled={profileData?.googleLogin}
              onChange={handleInputChange}
            />
          </div>

          <div className="ch-p-input-group">
            <label htmlFor="new_password">New Password</label>
            <input
              name="new_password"
              value={profileData.new_password}
              type="password"
              id="new_password"
              disabled={profileData?.googleLogin}
              placeholder="Enter your new password"
              onChange={handleInputChange}
            />
            {profileData.new_password.length >= 1 && (
              <div className={`password-message ${isValid ? "valid" : ""}`}>
                <i
                  className={`ri-${isValid ? "checkbox" : "close"}-circle-line`}
                ></i>
                &nbsp;Password must be at least 7 characters long, with one
                special character and one number
              </div>
            )}
          </div>

          <button
            disabled={loading === true ? true : false}
            type="submit"
            className="ch-p-cta-button"
          >
            {loading === true ? "Updating..." : "Save Profile"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Profile;
