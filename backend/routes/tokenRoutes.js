const express = require("express")
const router = express.Router()
const tokenController = require("../controller/tokenController")

router.post("/send-email-verification-token/:email", tokenController.send_email_verification_token)
router.get("/verify-email", tokenController.verify_email_token)
router.post("/send-password-reset-token/:email",tokenController.send_password_reset_token)


module.exports = router