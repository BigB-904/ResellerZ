const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const
{
    authenticateToken
}
=
require("../middleware/authMiddleware");

router.get("/", (req, res) =>
{
    res.json({
        success: true,
        message: "Authentication routes are working."
    });
});

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get(
    "/profile",
    authenticateToken,
    authController.profile
);

module.exports = router;