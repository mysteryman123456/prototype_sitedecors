import { useState, useEffect } from "react";
import React from "react";

const Filter = ({ onFilterChange: handleFilterChange }) => {
  const emptyFilter = {
    co_founder: false,
    createdAt: "",
    funds: false,
    max_price: "",
    min_price: "",
    most_viewed: false,
    negotiable: false,
    price: "",
    undisclosed: false,
    verified: false,
    video_url: false,
  };

  const [filterData, setFilterData] = useState(emptyFilter);

  const handleChange = (event) => {
    let { name, value, type } = event.target;  
    if (type === "checkbox" && value !== false) {
      value = event.target.checked;
    }
    const updatedFilters = { ...filterData, [name]: value };
    setFilterData(updatedFilters);
    handleFilterChange(updatedFilters);
  };

  const clearFilter = () => {
    setFilterData(emptyFilter);
    handleFilterChange(emptyFilter);
  };

  return (
    <aside>
      <div className="inner-side">
        <button className="clear_filter" onClick={clearFilter}>
          Clear All
        </button>
        <div style={{ marginTop: "20px" }} className="filter-text">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="var(--dimgrey)"
          >
            <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z"></path>
          </svg>{" "}
          FILTERS
        </div>

        <div className="container">
          <label>
            <input
              onChange={handleChange}
              type="checkbox"
              name="most_viewed"
              checked={filterData.most_viewed}
            />
            Most Viewed
          </label>
        </div>

        <div className="container">
          <label>
            <input
              onChange={handleChange}
              type="checkbox"
              name="verified"
              checked={filterData.verified}
            />
            Verified
          </label>
        </div>

        <div className="container">
          <label>
            <input
              onChange={handleChange}
              type="checkbox"
              name="video_url"
              checked={filterData.video_url}
            />
            Having explanation video
          </label>
        </div>

        <div className="container">
          <label>
            <input
              onChange={handleChange}
              type="checkbox"
              name="co_founder"
              checked={filterData.co_founder}
            />
            Seeking for co-founder
          </label>
        </div>

        <div className="container">
          <label>
            <input
              onChange={handleChange}
              type="checkbox"
              name="funds"
              checked={filterData.funds}
            />
            Seeking for funds
          </label>
        </div>

        <div className="container">
          <label>
            <input
              onChange={handleChange}
              type="checkbox"
              name="negotiable"
              checked={filterData.negotiable}
            />
            Price negotiable
          </label>
        </div>

        <div className="container">
          <label>
            <input
              onChange={handleChange}
              type="checkbox"
              name="undisclosed"
              checked={filterData.undisclosed}
            />
            Price undisclosed
          </label>
        </div>

        <div className="container">
          <label htmlFor="sort_price">Sort Price</label>
          <select
            onChange={handleChange}
            name="price"
            id="sort_price"
            value={filterData.price}
          >
            <option value="">Best Match</option>
            <option value="l_h">Low to High</option>
            <option value="h_l">High to Low</option>
          </select>
        </div>

        <div className="container">
          <label>Price range</label>
          <div className="price-range">
            <input
              onChange={handleChange}
              type="number"
              name="min_price"
              placeholder="Min Price"
              value={filterData.min_price}
            />
            <span style={{color:"var(--black-color)"}}>-</span>
            <input
              onChange={handleChange}
              type="number"
              name="max_price"
              placeholder="Max Price"
              value={filterData.max_price}
            />
          </div>
        </div>

        <div className="container">
          <label htmlFor="date">Sort by Upload</label>
          <select
            onChange={handleChange}
            name="createdAt"
            id="date"
            value={filterData.date}
          >
            <option value="">Anytime</option>
            <option value="recent">Recent</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
    </aside>
  );
};

export default Filter;
