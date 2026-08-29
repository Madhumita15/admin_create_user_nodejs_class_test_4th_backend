const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const dbCon = require("./src/config/dbCon");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

dbCon();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require("./src/router/user.router");
app.use("/api", userRouter);

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`app is listeing on http://localhost:${PORT}`);
});
