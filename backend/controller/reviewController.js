const jwt = require("jsonwebtoken");
const { Reviews } = require("../model/reviewModel");
const { sequelize } = require("../database/db");


const addReview = async (req, res) => {
  try {
    const token = req.cookies.sd_tkn;
    const { web_id, review, rating } = req.body;
    const email = jwt.verify(token, process.env.JWT_KEY).email;
    if (!email) return res.status(401).json({ message: "Please login again" });
    if (!review.trim() || review.trim().length > 200) return res.status(400).json({ message: "Provide valid review!" });

    const exists = await Reviews.findOne({ where: { web_id, email } });
    if (exists) return res.status(400).json({ message: "Already reviewed !" });
    await Reviews.create({ web_id, email, review, rating });
    res.status(201).json({ message: "Review added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" , error : error.message });
  }
};


const getReviews = async (req, res) => {
  try {
    const { web_id } = req.params;
    const reviews = await Reviews.findAll({
      where: { web_id },
      attributes: [
        'review',
        'rating',
        'createdAt',
        [
          sequelize.literal(`(SELECT "username" FROM "users" WHERE "users"."email" = "Reviews"."email")`),
          'username'
        ]
      ],
    });

    const averageRatingResult = await Reviews.findOne({
      where: { web_id },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
      ],
    });
    const averageRating = averageRatingResult ? averageRatingResult.get('averageRating') : 0;
    res.json({ reviews, averageRating });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



module.exports = { addReview , getReviews};
