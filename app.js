const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const dbCon = require("./src/config/dbCon");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

dbCon();
const allowedOrigins = [
  process.env.LOCAL_FRONTEND_URL,
  process.env.FRONTEND_URL,
].filter(Boolean);
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require("./src/router/user.router");
app.use("/api", userRouter);
app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "backend is running ",
  });
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`app is listeing on http://localhost:${PORT}`);
});
