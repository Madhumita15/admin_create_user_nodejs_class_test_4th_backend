const express = require('express')
const router = express.Router()
const userRouter = require("./src/router/user.router");


router.use("/api", userRouter);
router.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "backend is running ",
  });
});

module.exports = router

