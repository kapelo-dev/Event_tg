const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth.middleware");
const {
  purchaseTicket,
  getEventTickets,
  validateTicket,
  checkTicket,
  getMyTickets,
  getAllTickets,
} = require("../controllers/ticket.controller");

// Middleware pour vérifier si l'utilisateur est un agent
const isAgent = (req, res, next) => {
  if (req.user && (req.user.role === "AGENT" || req.user.role === "ADMIN")) {
    next();
  } else {
    res.status(403).json({
      status: "error",
      message: "Non autorisé - Accès agent requis",
    });
  }
};

// Routes publiques
router.post("/purchase", protect, purchaseTicket);
router.get("/my-tickets", protect, getMyTickets);

// Routes pour les agents
router.get("/:ticketId/check", protect, isAgent, checkTicket);
router.post("/:ticketId/validate", protect, isAgent, validateTicket);

// Routes admin
router.get("/", protect, admin, getAllTickets);
router.get("/event/:eventId", protect, admin, getEventTickets);

module.exports = router;
