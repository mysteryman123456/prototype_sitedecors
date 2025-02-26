import axios from 'axios';

const handleLogout = () => {
  axios.post(`${process.env.REACT_APP_BACKEND_PORT}/api/logout`, {}, { withCredentials: true })
    .then(() => {
      window.location.href = "/auth/login";
    })
    .catch(err => {
      window.failure("Logout failed!");
    });
};

export default handleLogout;
