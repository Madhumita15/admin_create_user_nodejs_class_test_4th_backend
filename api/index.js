const app = require("../app");
const dbCon = require("../src/config/dbCon");

const handler = async (req, res) => {
  try {
    await dbCon();
    return app(req, res);
  } catch (error) {
    console.error("Database connection error:", error);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });

    
  }
};

module.exports = handler;