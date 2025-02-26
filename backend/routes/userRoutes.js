const express = require("express")
const router = express.Router()
const upload =  require("../middleware/profileImageUpload")
const userController = require("../controller/userController")
const authorize = require("../middleware/authorization")

router.post("/login", userController.authenticateUser)
router.post("/signup",userController.addUser)
router.put("/update-user", authorize, upload.single('profileImage'), userController.updateUser)
router.post("/get-user-by-email",authorize,userController.getUserByEmail)
router.post("/logout", async(req , res)=>{
    res.clearCookie("sd_tkn", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });
      return res.status(200).json({ message: "Logged out successfully" });      
})

router.get("/get-user-by-token" , authorize , (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized!" });
    res.json({ user : req.user }); 
})

router.get("/reset-password",userController.reset_password)

// for updating the password
router.post("/update-password",userController.update_password)


module.exports = router