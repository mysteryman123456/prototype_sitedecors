import {Link, NavLink, Outlet, useNavigate} from 'react-router-dom';
import handleLogout from '../../auth/Logout';
import { SessionContext } from '../../context/SessionContext';
import { useEffect, useContext } from 'react';
import ContainerLoader from "../loaders/ContainerLoader"

const Dashboard = () => {
  const navigate = useNavigate()
  const { sessionData , sessionLoading } = useContext(SessionContext);

  useEffect(() => {
    if (!sessionLoading && (!sessionData?.email)) {
      window.failure("Please login first!")
      navigate("/auth/login");
    }
  }, [sessionData, sessionLoading, navigate]);

  if(sessionLoading) return (
    <ContainerLoader/>
  )

  return (
    <div className='seller-dashboard'>
      <div className='sidebar'>
        <h2>Dashboard</h2>
        <ul>
        <li>
            <NavLink to="statistics">
              <i className="ri-bar-chart-line"></i>Statistics
            </NavLink>
          </li>
        <li>
            <NavLink to="edit-listing">
              <i className="ri-edit-box-line"></i> Edit Listings
            </NavLink>
          </li>
          <li>
            <NavLink to="profile">
              <i className="ri-user-line"></i> My Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="add-website">
              <i className="ri-add-box-line"></i> Sell Website
            </NavLink>
          </li>
          <li>
            <Link onClick={handleLogout}>
              <i className="ri-logout-box-r-line"></i> Logout
            </Link>
          </li>
        </ul>
      </div>
      
      <div className='dashboard-content'>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
