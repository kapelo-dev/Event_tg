const express = require("express");
const router = express.Router();
const { uploadMiddleware } = require("../config/cloudinary.config");
const { authenticateToken } = require("../middleware/auth");

// Route pour uploader une image
router.post(
  "/upload",
  authenticateToken,
  uploadMiddleware.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message: "Aucun fichier n'a été uploadé",
        });
      }

      // Cloudinary retourne déjà l'URL de l'image
      const imageUrl = req.file.path;

      res.json({
        status: "success",
        data: {
          url: imageUrl,
        },
      });
    } catch (error) {
      console.error("Erreur upload:", error);
      res.status(500).json({
        status: "error",
        message: "Erreur lors de l'upload de l'image",
      });
    }
  }
);

module.exports = router;
