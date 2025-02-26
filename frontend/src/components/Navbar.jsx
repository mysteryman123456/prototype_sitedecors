import React , {useState, useContext} from "react";
import { Link, NavLink , useLocation, useNavigate} from 'react-router-dom';
import handleLogout from "../auth/Logout";
import {SessionContext} from "../context/SessionContext"
import Mouse from "../assets/avatars/Mouse_avatar.png"


const Navbar = () => {
  const navigate = useNavigate();
  const {sessionData} = useContext(SessionContext)
  const userImage = sessionData?.profileImage;
  const [searchedText, setSearchedText] = useState("")

  const handleSearch = () => {
    if (searchedText.trim() !== "") {
      const query = new URLSearchParams({search : searchedText.trim()}).toString() 
      navigate(`?${query}`)
    }else{
      navigate("?")
    }
  };  

  const location = useLocation();
  return (
    <>
      <nav>
        <div className="nav-container">
          <div className="logo">
                 <Link to="">
                      <svg height={40} width={150} viewBox="0 0 2048 441" xmlns="http://www.w3.org/2000/svg">
                        <path d="M780 94h97l18 2 20 5 16 8 11 8 10 9 11 14 9 16 6 16 5 22 2 20v30l-3 24-5 19-5 13-8 15-13 16-7 7-13 9-14 7-13 4-17 3-11 1h-95l-9-2-8-5-5-6-3-9-1-10V123l2-11 4-8 7-6 7-3zm41 43-11 1v180l1 1h46l17-1 13-3 12-6 10-9 8-11 6-14 4-15 2-14 1-21-1-19-3-17-5-16-9-14-9-9-10-6-19-5-9-1-21-1z" fill="var(--logoBlack)"/>
                        <path d="M124 91h40l17 3 17 6 11 6 10 8 10 10 6 10 4 10 1 4v14l-4 8-5 6-7 4-4 1h-8l-8-3-5-5-9-14-7-12-7-8-10-6-12-3-16-1-14 2-11 4-9 6-6 7-3 7v10l3 7 7 8 12 7 26 8 32 8 27 9 19 10 13 10 9 12 6 13 3 17v16l-3 16-7 16-7 10-8 9-12 9-16 8-20 6-17 2h-34l-17-2-16-5-12-5-11-7-10-9-9-10-8-14-5-13-1-5v-13l4-9 8-7 5-2h14l8 5 6 7 11 24 8 11 7 6 10 5 12 3h24l12-3 12-5 9-7 7-11 2-10-1-11-3-7-5-7-9-6-11-5-21-6-35-9-22-8-17-9-11-9-8-9-5-8-5-16-1-4v-21l4-15 7-13 7-9 9-8 13-8 19-7z" fill="var(--logoPurple)"/>
                        <path d="M1109 163h16l17 2 18 6 13 7 11 9 7 7 9 14 5 11 4 14 1 6v16l-4 11-8 7-9 3-17 2h-101l4 21 8 16 9 9 12 6 9 2h15l12-3 12-6 9-7 10-9 10-8 2-1h13l8 5 3 7v8l-4 11-8 10-8 8-11 7-16 7-15 4-10 1h-28l-16-2-18-6-13-7-10-8-9-9-10-15-6-15-4-15-1-7-1-20 2-21 6-21 8-16 9-12 8-8 15-10 15-6 16-4zm4 35-11 2-10 5-8 7-8 14-3 9-2 13 1 1h89l-2-17-5-12-6-9-7-6-10-5-11-2z" fill="var(--logoBlack)"/>
                        <path d="M606 164h22l14 2 18 6 11 6 9 7 9 8 9 13 6 13 4 13 1 6v19l-4 10-7 6-9 3-13 2H570l4 21 8 16 7 8 10 6 9 3 16 1 13-2 10-4 14-10 13-12 6-5 3-1h12l6 3 4 5 2 9-4 11-6 10-9 9-14 9-14 6-14 4-10 1h-31l-15-2-18-6-11-6-13-10-9-10-7-11-6-13-5-19-1-6v-36l5-21 7-16 7-11 9-10 9-8 14-8 17-6 9-2zm0 35-11 4-9 7-6 7-5 10-4 14-1 8 2 1h88l1-4-3-16-5-12-9-10-9-6-10-3z" fill="var(--logoPurple)"/>
                        <path d="M1545 164h33l18 4 13 5 14 8 12 11 9 10 9 16 5 15 3 15 1 10v14l-3 21-5 16-8 16-8 10-12 12-11 7-10 5-15 5-16 2h-26l-15-2-16-6-13-7-9-7-12-12-9-14-5-11-5-18-2-13v-22l3-17 5-17 9-17 9-11 7-7 15-10 17-7zm9 37-13 4-9 6-8 9-6 12-4 14-1 7v24l3 15 5 13 7 10 9 8 12 5 5 1h15l11-3 9-5 7-6 7-10 6-16 2-15v-19l-2-14-6-16-8-11-9-7-12-5-5-1z" fill="var(--logoBlack)"/>
                        <path d="M1908 164h36l19 4 16 6 11 7 7 6 7 10 3 8v9l-4 8-6 5-5 2h-14l-7-4-6-5-9-11-8-7-9-4-5-1h-18l-12 4-7 6-2 4v10l4 6 10 6 19 6 31 8 18 6 17 9 11 9 7 10 4 11v22l-4 13-6 11-8 9-10 7-13 6-14 4-17 2h-30l-16-2-15-5-14-7-10-8-7-8-5-10-2-6v-13l5-8 5-4 5-2h12l7 4 6 8 7 11 8 8 9 5 10 3 8 1h12l13-3 8-5 5-6 1-2v-11l-3-7-5-5-13-6-36-10-21-7-16-8-11-8-9-11-4-11-1-5v-13l3-12 6-11 9-10 11-8 14-6 11-3zM1333 163h17l16 2 16 5 16 8 11 8 8 8 8 12 4 13-1 9-4 7-7 6-5 2h-12l-7-4-7-8-8-11-9-9-12-6-8-2h-14l-12 3-11 7-7 8-8 16-3 14-1 17 2 18 4 13 7 13 7 7 14 7 10 2h10l10-2 14-7 9-9 9-14 7-9 8-4h12l9 6 5 8 1 3v11l-4 12-7 11-13 13-13 8-15 6-17 4-12 1h-20l-18-2-18-6-11-6-13-10-9-10-8-13-5-11-5-19-1-7v-31l3-15 5-16 8-16 12-15 14-11 16-8 17-5z" fill="var(--logoBlack)"/>
                        <path d="M423 97h12l10 5 6 7 3 10v50h25l8 3 6 7 1 2v11l-4 7-9 4-13 2h-14l1 104 2 11 3 5 8 3 12-1 6-1h14l7 5 3 6v10l-4 8-9 6-12 4-9 1h-31l-11-2-12-6-6-5-6-9-4-14-2-20V205h-11l-11-4-6-8-1-8 3-8 7-6 7-2h12v-46l3-12 6-9z" fill="var(--logoPurple)"/>
                        <path d="M1717 164h16l6 3 5 6 4 10 2 9 7-11 6-7 10-7 8-3h23l15 5 10 6 7 8 2 5v9l-5 10-9 6-8 1-23-6h-14l-8 3-7 6-6 12-4 16-2 18-1 72-1 12-6 12-6 5-7 2h-12l-8-3-7-8-4-11V188l4-13 7-8z" fill="var(--logoBlack)"/>
                        <path d="M216 261h7l11 3h11l4 2 3 8v16l-3 16-7 16-7 10-8 9-12 9-16 8-20 6-17 2h-34l-17-2-16-5-12-5-11-7-10-9-9-10-8-14-5-13-1-5v-13l4-9 8-7 5-2h14l8 5 6 7 11 24 8 11 7 6 10 5 12 3h24l12-3 12-5 9-7 7-11 2-10-1-17 1-1 10-2 4-5z" fill="var(--logoPurple)"/>
                        <path d="M520 252h1l3 11 2 6 7-1 10-5 1-4 3-2 8 1 8 3 7 2h13l13-1 57-1 11-4 11-2v-1h6l2 3 2 7 7 1 6-2h6l-2 5-4 5-9 3-13 2H570l4 21 8 16 7 8 10 6 9 3 16 1 13-2 10-4 14-10 13-12 6-5 3-1h12l6 3 4 5 2 9-4 11-6 10-9 9-14 9-14 6-14 4-10 1h-31l-15-2-18-6-11-6-13-10-9-10-7-11-6-13-5-19-1-6z" fill="var(--logoPurple)"/>
                        <path d="m317 164 13 2 9 7 4 8 1 3v162l-3 9-6 7-5 3-4 1h-14l-8-4-6-7-3-9-1-19V199l1-14 4-11 8-7 4-2zM124 91h40l17 3 17 6 11 6 10 8 10 10 6 10 4 10 1 4v14l-4 8-5 6-7 4-4 1h-8l-8-3-5-5-9-14-7-12-7-8-10-6-12-3-16-1-14 2-11 4-9 6-6 5-1-1-5 2-3 2-18 5-8 5-9 4-5-1-1 2h-2v12h-2v-21l4-15 7-13 7-9 9-8 13-8 19-7zM428 252l6 1 5 3h11l2 1 1 4 2 48 2 11 3 5 8 3 12-1 6-1h14l7 5 3 6v10l-4 8-9 6-12 4-9 1h-31l-11-2-12-6-6-5-6-9-4-14-1-7v-57l1-6 10-1 6-4z" fill="var(--logoPurple)"/>
                        <path d="m317 164 13 2 9 7 4 8 1 3v80l-2-2-1-7-6-3-3-3-7-1-6 5-1 3-7 4-5 9-5 5-3 4-2 10h-1l-1-54v-35l1-14 4-11 8-7 4-2zM355 38l9 1 4 6 1 4v10l-4 16-7 17-8 14-10 14-14 14-10 6-9 1-6-5-2-8 1-13 7-21 10-19 10-14 9-10 10-9zM423 97h12l10 5 6 7 3 10v50h-1l-1-28-7 3-22-2h-6l-10-5-1 6 1 4h2v10l-1 2h-2l-1 10h-1v-46l3-12 6-9zM236 143l4 5v14l-4 8-5 6-7 4-4 1h-8l-5-2-5-5-1-7 2-3 2-11 8-7 17 1v-3zM56 265h14l8 5 6 7 3 6-1 2-3-4-5-1-5 2h-8l-15 4-5-1-4 1-1 10h-1v-13l4-9 8-7z" fill="var(--logoPurple)"/>
                        <path d="m317 164 13 2 1 2h-9l-18 6h-3l-2 5-2 1 2-6 8-7 4-2z" fill="var(--logoPurple)"/>
                        <path d="m385 171 2 1-6 5-2 9-1 4 1 6-3-3-1-8 3-8z" fill="var(--logoPurple)"/>
                  </svg>
                </Link>
          </div>

          <form className="search-form" onSubmit={(e)=>e.preventDefault()}>
            <div className="searchbar">
              <input name="search" autoComplete="off" onChange={(e)=>{setSearchedText(e.target.value)}} placeholder="Search for keywords..." type="text" />
              <button type="submit" onClick={handleSearch}>
                <i className="ri-search-line"></i>
              </button>
            </div>
          </form>

          <div className="nav-right">
            <div className="user-profile dropdown">
              <div className="dropbtn">
                <div className="user-image">
                  <img src={userImage || Mouse} />
                </div>
                <svg className='cv-d' version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="14" height="14" viewBox="0 0 10 7">
                      <g>
                          <path fill="var(--black-color)" d="M10,0v3L5,7L0,3V0l5,4L10,0z"></path>
                      </g>
                </svg>
              </div>
                <div className="dropdown-content">
                  <Link to="/user/dashboard"><i className="ri-dashboard-line"></i> Dashboard</Link>
                  <Link to="/auth/login"><i className="ri-login-box-line"></i> Login</Link>
                  <Link to="/auth/signup"><i className="ri-user-add-line"></i> Signup</Link>
                  <Link onClick={handleLogout}><i className="ri-logout-box-r-line"></i> Logout</Link>
                </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="lower-navbar">
        {[
          { icon: "ri-color-filter-ai", name: "General" },
          { icon: "ri-store-2", name: "Ecommerce" },
          { icon: "ri-service", name: "Services" },
          { icon: "ri-newspaper", name: "Media and Content" },
          { icon: "ri-graduation-cap", name: "Education" },
          { icon: "ri-hospital", name: "Health" },
          { icon: "ri-settings-3", name: "SaaS" },
          { icon: "ri-more", name: "Others" }
        ].map((category, index) => (
          <div key={index}  className="link-wrapper">
         <NavLink
            to={category.name.toLowerCase() === "general" ? "/" : category.name.toLowerCase().replace(/ /g, "-")}
          >
            <div className="category-name">
            <i
              className={
                location.pathname.includes(category.name.toLowerCase().replace(/ /g, "-")) || (location.pathname === "/" && index === 0)
                  ? category.icon + "-fill"
                  : category.icon + "-line"
              }
            />
            </div>
            {category.name}
          </NavLink>
          </div>
        ))}
      </div>
    </>
  );
};

export default Navbar;