import React, { useState, useEffect, use } from "react";
import { useParams, Link } from "react-router-dom";
import Placeholder from "../../assets/avatars/Placeholder.png";
import Website_placeholder from "../../assets/avatars/Website_placeholder.png";
import ContainerLoader from "../loaders/ContainerLoader";
import PageNotFound from "../../components/PageNotFound";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import giveCategoryAndSubcategory from "../../assets/GiveCategorySubCategory";

const ProductPage = () => {
  const { web_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [notfound, setn404] = useState(false);
  const [productData, setProductData] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState(null);
  const [avgRating, setAvgRating] = useState(0);
  const [categoryName, setCategoryName] = useState({
    category: "",
    subcategory: "",
  });

  // read more for description
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleReadMore = () => setIsExpanded(!isExpanded);

  // for rating
  const [reviewBoxVisible, setReviewBoxVisible] = useState(false);
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");
  const [rrData, setRrData] = useState(null);
  // for disabling button of write a review
  const [reviewLoading, setReviewLoading] = useState(false);

  const sendReview = async () => {
    if (review.trim().length > 200)
      return window.failure("Review must be shorter");
    if (review.trim().length <= 0)
      return window.failure("Review cannot be empty");
    setReviewLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_PORT}/api/add-review`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            review: review.trim(),
            rating,
            web_id,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && response.status === 201) {
        setRating(1);
        setReview("");
        return window.success("Review added successfully");
      } else {
        window.failure(data.message || "Failed to add review");
      }
    } catch (error) {
      window.failure("Failed to add review");
    } finally {
      setReviewLoading(false);
    }
  };

  const getReview = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_PORT}/api/get-review/${web_id}`
      );
      const data = await response.json();
      setRrData(data.reviews);
      setAvgRating(data.averageRating);
    } catch (error) {
      console.error("Error fetching reviews", error.message);
      window.failure("Failed to fetch reviews!");
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_PORT}/api/get-product-page?web_id=${web_id}`
      );
      const data = await response.json();
      if (response.ok) {
        setProductData(data.message);
        document.title = data.message.title || "SiteDecors product page";
      } else {
        setn404(true);
      }
    } catch (error) {
      window.failure(error?.message || "Could not fetch product page");
      setn404(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!productData) return;
    const trackProductVisit = (web_id, image_url, title, description) => {
      let recentlyViewed = JSON.parse(localStorage.getItem("r_v_l")) || [];
      const product = {
        web_id: web_id,
        image_url: image_url,
        title: title,
        description: description.slice(0, 50),
      };
      if (!recentlyViewed.some((item) => item.web_id === web_id)) {
        recentlyViewed.push(product);
        if (recentlyViewed.length > 5) recentlyViewed.shift();
        localStorage.setItem("r_v_l", JSON.stringify(recentlyViewed));
      }
    };
    trackProductVisit(
      web_id,
      productData?.ProductImages[0],
      productData.DescriptiveDetail?.title,
      productData.DescriptiveDetail?.description
    );
    const { category, subcategory } = giveCategoryAndSubcategory(
      productData?.category_id,
      productData?.subcategory_id
    );
    setCategoryName((prev) => ({ ...prev, category, subcategory }));
  }, [productData]);

  const updateViews = async () => {
    try {
      const viewedWebsites =
        JSON.parse(localStorage.getItem("viewedWebsites")) || [];
      if (!viewedWebsites.includes(web_id)) {
        await fetch(`${process.env.REACT_APP_BACKEND_PORT}/api/update-views`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ web_id: web_id }),
        });
        viewedWebsites.push(web_id);
        localStorage.setItem("viewedWebsites", JSON.stringify(viewedWebsites));
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchData();
    getReview();
    updateViews();
    const r_v_l = JSON.parse(localStorage.getItem("r_v_l")) || [];
    setRecentlyViewed(r_v_l);
  }, [web_id]);

  if (loading) return <ContainerLoader />;
  if (notfound) return <PageNotFound />;

  return (
    <>
      <div className="product-page">
        <div className="pp_left-content">
          <h3>
            <i className="ri-history-line"></i> Recently Visited
          </h3>
          <div className="recently_viewed">
            <div className="recently_viewed">
              {recentlyViewed.length > 0 ? (
                recentlyViewed.map((item, i) => (
                  <Link
                    to={`/website/${item.web_id}`}
                    rel="noopener noreferrer"
                    key={i}
                  >
                    <div className="r_v_l_wrapper">
                      <img
                        src={item.image_url?.image_url || Website_placeholder}
                        alt={item.title}
                        style={{ width: "100px", height: "55px" }}
                      />
                      <div className="r_v_l_content">
                        <h5 style={{ color: "#555555" }}>{item.title}</h5>
                        <p>{item.description}...</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="r_v_l_wrapper">
                  <img
                    src={Website_placeholder}
                    alt="No recent views"
                    style={{ width: "100px", height: "55px" }}
                  />
                  <div className="r_v_l_content">
                    <h5>No Recently Viewed Items</h5>
                    <p>Start exploring to see recently viewed items here...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="pp_main-content">
          <div className="product-header">
            <h2 className="pp_title">{productData.DescriptiveDetail.title}</h2>
            <p className="pp_description">
              {isExpanded
                ? productData.DescriptiveDetail.description
                : `${productData.DescriptiveDetail.description.slice(
                    0,
                    80
                  )}...`}
              {productData.DescriptiveDetail.description.length > 80 && (
                <span className="pp_d_readmore" onClick={toggleReadMore}>
                  {isExpanded ? "  see less" : "see more"}
                </span>
              )}
            </p>
            <div className="pp_stats">
              <div className="subcategory">
                {productData?.verified ? "Verified" : "Unverified"}{" "}
                {productData?.verified ? (
                  <>
                    <i className="ri-verified-badge-fill"></i>
                  </>
                ) : (
                  <>
                    <i className="ri-close-circle-fill"></i>
                  </>
                )}
              </div>
              <div className="category">{categoryName.category}</div>
              <div className="subcategory">{categoryName.subcategory}</div>
              <div className="ratings">
                Rated by {rrData?.length}{" "}
                {rrData?.length <= 1 ? "user" : "users"}
              </div>
            </div>
          </div>

          <div className="product-image">
            <Carousel
              showStatus={false}
              showThumbs={false}
              autoPlay
              showArrows={false}
              infiniteLoop
              stopOnHover
              transitionTime={500}
              interval={3000}
            >
              {productData.ProductImages?.map((image, index) => (
                <div key={index} className="pp_image-wrapper">
                  <img
                    src={image.image_url || Placeholder}
                    alt={`Product ${index + 1}`}
                  />
                </div>
              ))}
            </Carousel>
          </div>

          <div className="product-content">
            <details>
              <summary>
                What you should be aware of when purchasing this wbsite?
              </summary>
              <p>{productData.DescriptiveDetail.technical_description}</p>
            </details>
            <details>
              <summary>
                What you will be getting after purchasing this website?
              </summary>
              <p>
                {productData.DescriptiveDetail.assets.map((asset, i) => (
                  <li key={i}>{asset}</li>
                ))}
              </p>
            </details>
          </div>

          {/* adding rating */}
          <div className="add-rating">
            <h3>Rating & Reviews</h3>
            <div className="rating-header">
              <div>
                <div>
                  {Number(avgRating).toFixed(1)}{" "}
                  {[...Array(5)].map((_, index) => {
                    if (avgRating >= index + 1) {
                      return <i key={index} className="ri-star-fill"></i>;
                    } else if (avgRating >= index + 0.5) {
                      return <i key={index} className="ri-star-half-line"></i>;
                    } else {
                      return <i key={index} className="ri-star-line"></i>;
                    }
                  })}
                </div>
                <p className="rating-stats">Over {rrData?.length} reviews</p>
              </div>
              <div className="add-rating-btn-wrap">
                <button
                  onClick={() => setReviewBoxVisible(!reviewBoxVisible)}
                  className="add-rating-btn"
                >
                  <i className="ri-pencil-fill"></i> Write a Review
                </button>
              </div>
            </div>

            <div className="display-review">
              {rrData?.length > 0 ? (
                rrData.map((item, i) => (
                  <div key={i} className="review-box">
                    <div className="review-user-date">
                      <div className="user-initial">
                        {item?.username?.charAt(0).toUpperCase() || "B"}
                      </div>
                      <div className="user-info">
                        <span className="username">
                          {item.username || "Bot"}
                        </span>
                        <span className="date">
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "2-digit" }
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="review-content">
                      <div className="stars">
                        {[...Array(5)].map((_, index) => (
                          <i
                            key={index}
                            className={
                              index < item.rating
                                ? "ri-star-fill"
                                : "ri-star-line"
                            }
                          ></i>
                        ))}
                      </div>
                      <p>{item.review}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-review-available-text">No reviews available</p>
              )}
            </div>

            {reviewBoxVisible && (
              <div className="add-review">
                <div className="review-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      className={`stars ${rating >= star ? "star-gold" : ""}`}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </div>
                  ))}
                  <p>Out of 5 stars</p>
                </div>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  name="review"
                  placeholder="Please write your review (maximum 200 characters)"
                ></textarea>
                <div className="review-btn-wrap">
                  <button
                    disabled={reviewLoading}
                    onClick={sendReview}
                    className="review-btn"
                  >
                    {reviewLoading ? (
                      "Please wait..."
                    ) : (
                      <>
                        <i className="ri-send-plane-fill"></i>&nbsp;Add Review
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pp_right-content">
          <div className="pp_seller">
            <h6>WEBSITE AUTHOR</h6>
            <div className="pp_seller-info">
              <div className="pp_seller_image">
                <img
                  src={productData.User.profileImage || Placeholder}
                  alt="Seller"
                  width={50}
                  height={50}
                  className="seller-image"
                />
              </div>
              <div>
                <p className="pp_seller_name">{productData.User.username}</p>
                <p className="pp_seller_joinedDate">
                  Joined on{" "}
                  {new Date(productData.User.createdAt).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "short", day: "2-digit" }
                  )}
                </p>
                <p className="pp_seller_joinedDate">
                  <i className="ri-mail-line"></i>{" "}
                  {productData.User.phonenumber || productData.User.email}
                </p>
              </div>
            </div>
          </div>

          <div className="pp_pricing_details">
            <h4>Pricing Details</h4>
            <div className="pp_price">
              {!productData.undisclosed
                ? "NPR " + Intl.NumberFormat("en-IN").format(productData.price)
                : "Undisclosed"}
            </div>
            <p className="price_text">
              {productData.negotiable
                ? "The seller is open to price negotiation. You are welcome to make a reasonable counteroffer based on your budget and expectations."
                : "The price for this listing is fixed and non-negotiable. If you require further details or have any inquiries, please feel free to contact the author."}
            </p>
          </div>
          <button
            onClick={() =>
              (window.location.href =
                productData?.DescriptiveDetail.website_url)
            }
            className="pp_view-btn"
          >
            <i className="ri-eye-line"></i>LIVE DEMO
          </button>
          {productData?.DescriptiveDetail?.video_url &&
            productData.DescriptiveDetail.video_url.trim() !== "" && (
              <button
                onClick={() =>
                  (window.location.href =
                    productData.DescriptiveDetail.video_url)
                }
                className="pp_view-btn pp_video_btn"
              >
                <i className="ri-youtube-fill"></i>VIEW ON YOUTUBE
              </button>
            )}
        </div>
      </div>
    </>
  );
};

export default ProductPage;
