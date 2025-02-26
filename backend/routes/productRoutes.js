const express = require('express');
const router = express.Router();
const productController = require("../controller/productController")
const upload =  require("../middleware/websiteImageUpload")
const authorize = require("../middleware/authorization")

router.post("/add-website", authorize, upload.array("images" , 3), productController.addWesbite)
router.get("/get-seller-website/:seller_email", authorize ,productController.getWebsiteForUpdate)
router.delete("/delete-listing", authorize ,productController.deleteWebsite)
router.put("/update-listing", authorize , productController.updateWebsite)
// for getting website details in home page
router.post("/get-website-for-home", productController.getWebsiteForHome)
// for displaying product page
router.get("/get-product-page",productController.fetchProductPage)

module.exports = router