const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth.middleware");
const { getDashboardStats } = require("../controllers/admin.controller");

// Routes protégées pour l'admin
router.use(protect, admin);

// Route du tableau de bord
router.get("/dashboard", getDashboardStats);

module.exports = router;
