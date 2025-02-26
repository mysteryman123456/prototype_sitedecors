const express = require("express");
const app = express();

// Env file
require("dotenv").config();

//MiddleWare
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Database conenction
const { connection } = require("./database/db");
connection();

const statisticsRoutes = require("./routes/statisticsRoutes");
app.use("/api", statisticsRoutes);

const productViewRoutes = require("./routes/productViewRoutes");
app.use("/api", productViewRoutes);

const reiewRoutes = require("./routes/reviewRoutes");
app.use("/api", reiewRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api", userRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api", productRoutes);

const tokenRoutes = require("./routes/tokenRoutes");
app.use("/api", tokenRoutes);


// Port
const PORT = process.env.PORT;
app.listen(PORT);
