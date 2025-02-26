const express = require("express");
const jwt = require("jsonwebtoken");
const { WebsiteDetails } = require("../model/mainProductModel"); // primary key: web_id
const { Views } = require("../model/productViewModel"); // foreign key: web_id
const { sequelize } = require("../database/db");

const router = express.Router();

const website_details = WebsiteDetails.tableName;
const views = Views.tableName;

router.post("/get-statistics", async (req, res) => {
  try {
    const token = req.cookies.sd_tkn;
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const email = decoded.email;
    // 1. Fetch top 5 viewed websites based on view count
    const topWebsites = await sequelize.query(
      `SELECT w.web_id, w.category_id, w.subcategory_id, v.views
      FROM ${website_details} AS w
      JOIN ${views} AS v ON w.web_id = v.web_id
      ORDER BY v.views DESC
      LIMIT 5;`,
      { type: sequelize.QueryTypes.SELECT }
    );

    // 2. Fetch websites for the logged-in user's email
    const websitesForEmail = await sequelize.query(
      `SELECT DISTINCT w.web_id, w.category_id, w.subcategory_id, 
        SUM(v.views) AS views
      FROM ${website_details} AS w
      JOIN ${views} AS v ON w.web_id = v.web_id
      WHERE w.seller_email = :email
      GROUP BY w.web_id, w.category_id, w.subcategory_id;`, 
      {
        replacements: { email: email },
        type: sequelize.QueryTypes.SELECT
      }
    );

    // Remove any review-related code here

    // Separate the top websites and user websites for comparison
    const topWebsitesFormatted = topWebsites.map(website => ({
      web_id: website.web_id,
      category_id: website.category_id,
      subcategory_id: website.subcategory_id,
      views: website.views
    }));

    const userWebsitesFormatted = websitesForEmail.map(website => ({
      web_id: website.web_id,
      category_id: website.category_id,
      subcategory_id: website.subcategory_id,
      views: website.views
    }));

    res.json({
      topWebsites: topWebsitesFormatted,
      userWebsites: userWebsitesFormatted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
});

module.exports = router;
