const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../middleware/authMiddleware");

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.get("/:id", authController.checkToken, userController.getUserById);

module.exports = router;
