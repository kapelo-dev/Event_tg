const express = require("express");
const router = express.Router();
const agentController = require("../controllers/agent.controller");
const { protect, admin, agent } = require("../middleware/auth.middleware");

// Appliquer l'authentification à toutes les routes
router.use(protect);

// Routes nécessitant le rôle AGENT
router.get("/dashboard", agent, agentController.getDashboardStats);
router.get("/events", agent, agentController.getAgentEvents);

// Routes administratives (nécessitant le rôle ADMIN)
router.post("/", admin, agentController.createAgent);
router.get("/all", admin, agentController.getAllAgents);
router.get("/:id", admin, agentController.getAgent);
router.put("/:id", admin, agentController.updateAgent);
router.delete("/:id", admin, agentController.deleteAgent);

module.exports = router;
