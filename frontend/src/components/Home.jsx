import React, { useEffect, useState } from "react";
import Filter from "./filter/Filters";
import { Tooltip } from "react-tooltip";
import { NavLink, useLocation, useParams, Link } from "react-router-dom";
import Categories from "../assets/Categories";
import HomePageSkeletonLoader from "../components/loaders/HomePageSkeletonLoader";
import giveCategoryIdSubCategoryId from "../assets/GiveCategoryIdSubCategoryId";
import axios from "axios";
import PageNotFound from "../components/PageNotFound";

const Home = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [n404, setn404] = useState(false);
  const { category, subcategory } = useParams();
  const [websiteData, setWebsiteData] = useState([]);
  const { categoryId, subcategoryId } = giveCategoryIdSubCategoryId(
    category,
    subcategory
  );
  const searchQuery = new URLSearchParams(window.location.search).get("search");

  const [filterData, setFilterData] = useState(() => ({
    categoryId,
    subcategoryId,
    location: location.pathname || "/",
    searchQuery,
  }));

  const handleFilterChange = (data) => {
    setFilterData((prev) => ({ ...prev, ...data }));
  };

  useEffect(() => {
    setFilterData((prev) => ({
      ...prev,
      categoryId,
      subcategoryId,
      location: location.pathname,
      searchQuery,
    }));
  }, [categoryId, subcategoryId, location.pathname, searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (filterData.location !== "/" && filterData.categoryId === -1)
        return setn404(true);
      if (
        filterData.location !== "/" &&
        filterData.subcategoryId === -1 &&
        filterData.categoryId === -1
      )
        return setn404(true);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_PORT}/api/get-website-for-home`,
          { ...filterData }
        );
        if (response.status === 200) {
          setLoading(false);
          setn404(false);
          setWebsiteData(response.data.message);
        }
      } catch (err) {
        setn404(true);
        setLoading(false);
      }
    };
    fetchData();
  }, [filterData]);

  return (
    <main>
      {<Filter onFilterChange={handleFilterChange} />}
      <div className="card-container">
        <div className="subcategory-container">
          <div className="subcategories">
            <ul>
              {location.pathname === "/" ? (
                Categories.map((value) =>
                  value.subcategories.map((sub, subindex) => (
                    <li key={subindex}>
                      <NavLink
                        to={`/${value.name
                          .toLowerCase()
                          .replace(/ /g, "-")}/${sub
                          .toLowerCase()
                          .replace(/ /g, "-")}`}
                      >
                        {sub}
                      </NavLink>
                    </li>
                  ))
                )
              ) : location.pathname !== "/" ? (
                Categories.map(
                  (value) =>
                    value.name.toLowerCase().replace(/ /g, "-") === category &&
                    value.subcategories.map((sub, subindex) => (
                      <li key={subindex}>
                        <NavLink
                          to={`/${category}/${sub
                            .toLowerCase()
                            .replace(/ /g, "-")}`}
                        >
                          {sub}
                        </NavLink>
                      </li>
                    ))
                )
              ) : (
                <></>
              )}
            </ul>
          </div>
        </div>
        <section>
          {loading && !n404 ? (
            <>
              <HomePageSkeletonLoader />
            </>
          ) : n404 ? (
            <>
              <PageNotFound />
            </>
          ) : (
            websiteData.map((item) => (
              <div key={item.web_id} className="card">
                <div className="card-image">
                  <img src={item.image_url} alt={item.title} />
                </div>
                <div className="card-content">
                  <div className="middle-content">
                    <h3 className="title">{item.title}</h3>
                    <p className="description">{item.description}...</p>
                    <p className="asset-text">Included Assets</p>
                    <div className="assets">
                      {item.assets.map((asset, index) => {
                        return (
                          <div className="asset" key={index}>
                            {asset} 
                          </div>
                        );
                      })}
                    </div>
                    <div className="t-s-u">
                      <div className="tsu-content">
                        <p>STATUS</p>
                        <h5>
                          {item.verified ? (
                            <span
                              data-tooltip-id="tooltip"
                              data-tooltip-content="Author owns this website"
                            >
                              Verified{" "}
                              <i className="ri-verified-badge-fill"></i>
                            </span>
                          ) : (
                            <span
                              data-tooltip-id="tooltip"
                              data-tooltip-content="Author may not own this website"
                            >
                              Unverified{" "}
                              <i className="ri-close-circle-fill"></i>
                            </span>
                          )}
                          <Tooltip
                            style={{
                              zIndex: "99999",
                              backgroundColor: "rgb(55,65,70)",
                            }}
                            id="tooltip"
                            noArrow
                          />
                        </h5>
                      </div>
                      <div className="tsu-content">
                        <p>AUTHOR</p>
                        <h5>{item.username}</h5>
                      </div>
                      <div className="tsu-content">
                        <p>VIEWS</p>
                        <h5>{item.views}</h5>
                      </div>
                      <div
                        style={{ borderRight: "1px solid transparent" }}
                        className="tsu-content"
                      >
                        <p>UPLOADED</p>
                        <h5>
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="last-content">
                    <div className="price-wrap">
                      <h3 className="price">
                        {!item.undisclosed
                          ? "NPR " +
                            Intl.NumberFormat("en-IN").format(item.price)
                          : "Undisclosed"}
                      </h3>
                      <small>
                        {item.negotiable ? (
                          <>
                            <i className="ri-shake-hands-line"></i> Negotiable
                          </>
                        ) : (
                          <>
                            <i className="ri-emotion-normal-line"></i> Non
                            negotiable
                          </>
                        )}
                      </small>
                    </div>

                    <div className="view-demo-btn">
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={item.website_url}
                        className="live-btn"
                      >
                        <i className="ri-eye-line"></i>&nbsp;Live&nbsp;Demo
                      </a>
                      <Link to={"/website/" + item.web_id} className="view-btn">
                        View&nbsp;Listing
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
};

export default Home;
