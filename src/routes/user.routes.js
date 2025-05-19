const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

// Routes protégées par authentification
router.use(protect);

// Routes accessibles uniquement aux administrateurs
router.get("/", admin, userController.getAllUsers);
router.get("/:id", admin, userController.getUserById);
router.post("/", admin, userController.createUser);
router.put("/:id", admin, userController.updateUser);
router.delete("/:id", admin, userController.deleteUser);

// Route pour mettre à jour son propre profil (accessible à tous les utilisateurs authentifiés)
router.put("/profile/update", userController.updateProfile);

module.exports = router;
