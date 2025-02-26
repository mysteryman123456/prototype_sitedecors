const jwt = require("jsonwebtoken");

const authorize = (req, res, next) => {
  const sd_tkn = req.cookies.sd_tkn;
  if (!sd_tkn) return res.status(401).json({ message: "Please login first!" });
  try {
    const decodedData = jwt.verify(sd_tkn, process.env.JWT_KEY);
    req.user = decodedData
    next();
  } catch (err) {
    console.log(err)
    return res.status(403).json({ message: "Unauthorized!" });
  }
};

module.exports = authorize;

