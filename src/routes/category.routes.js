const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

// Routes publiques
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Routes protégées (admin seulement)
router.post("/", authenticateToken, createCategory);
router.put("/:id", authenticateToken, updateCategory);
router.delete("/:id", authenticateToken, deleteCategory);

module.exports = router;
