const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// Enable trust proxy
app.enable("trust proxy");

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

// Routes
const paymentRoutes = require("./routes/payment");
app.use("/api/payment", paymentRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("=== Erreur Serveur ===");
  console.error("Time:", new Date().toISOString());
  console.error("URL:", req.url);
  console.error("Method:", req.method);
  console.error("Error:", {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Une erreur est survenue",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Pour Vercel, nous exportons l'app au lieu de la démarrer
module.exports = app;

// En développement local, nous démarrons le serveur
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log("Mode:", process.env.NODE_ENV);
    console.log("CORS Origin:", process.env.CORS_ORIGIN || "*");
  });
}
