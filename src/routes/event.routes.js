const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  assignAgents,
  deleteEvent,
  getEventById,
} = require("../controllers/event.controller");
const { authenticateToken } = require("../middleware/auth");
const upload = require("../middleware/upload.middleware");

// Routes publiques (pas besoin d'authentification)
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// Routes protégées (nécessite une authentification)
router.post("/", authenticateToken, upload.single("image"), createEvent);
router.put("/:id", authenticateToken, upload.single("image"), updateEvent);
router.post("/:id/agents", authenticateToken, assignAgents);
router.delete("/:id", authenticateToken, deleteEvent);

module.exports = router;
