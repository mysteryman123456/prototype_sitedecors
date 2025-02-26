const express = require('express');
const router = express.Router();
const reviewController = require("../controller/reviewController")
const authorize = require("../middleware/authorization")

router.post("/add-review", authorize ,reviewController.addReview)
router.get("/get-review/:web_id",reviewController.getReviews)

module.exports = router