require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const { PrismaClient } = require("@prisma/client");
const routes = require("./routes");
const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");
const adminRoutes = require("./routes/admin.routes");
const agentRoutes = require("./routes/agent.routes");

const app = express();
const prisma = new PrismaClient();

// Middleware CORS personnalisé en premier
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://event-tg-frontend.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Gérer les requêtes OPTIONS préliminaires
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Trust proxy doit être en premier
app.set("trust proxy", 1);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware de sécurité avec configuration permissive pour le développement
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:", "*"],
        connectSrc: ["'self'", "*"],
      },
    },
  })
);

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use("/uploads", express.static(uploadsDir));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Augmenté à 1000 requêtes par fenêtre
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Monter toutes les routes sous /api
app.use("/api", routes);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/agent", agentRoutes);

// Test de connexion à la base de données
prisma
  .$connect()
  .then(() => {
    console.log("Base de données connectée avec succès");
  })
  .catch((error) => {
    console.error("Erreur de connexion à la base de données:", error);
  });

// Route de test
app.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Gestion des erreurs avec plus de détails
app.use((err, req, res, next) => {
  console.error("Error details:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    headers: req.headers,
  });

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Une erreur est survenue",
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée",
  });
});

const PORT = 3001;
const HOST = "0.0.0.0"; // Écouter sur toutes les interfaces réseau

app.listen(PORT, HOST, () => {
  console.log(`Serveur démarré sur http://${HOST}:${PORT}`);
});

module.exports = app;
