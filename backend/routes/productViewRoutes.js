const express = require("express")
const router = express.Router()
const productViewController = require("../controller/productViewController")
router.post("/update-views", productViewController.updateViews)
module.exports = router
