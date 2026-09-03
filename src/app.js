const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./router/index");


const allowedOrigins = [
  process.env.LOCAL_FRONTEND_URL,
  process.env.FRONTEND_URL,
  "http://localhost:5173",
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

app.use(router);


module.exports = app

