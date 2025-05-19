const express = require("express");
const router = express.Router();
const eventRoutes = require("./event.routes");
const authRoutes = require("./auth.routes");
const categoryRoutes = require("./category.routes");
const userRoutes = require("./user.routes");
const ticketRoutes = require("./ticket.routes");
const agentRoutes = require("./agent.routes");

// Monter les routes
router.use("/events", eventRoutes);
router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/users", userRoutes);
router.use("/tickets", ticketRoutes);
router.use("/agent", agentRoutes);

// Route de test API
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "API is working!",
  });
});

module.exports = router;
