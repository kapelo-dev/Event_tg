const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Authentification requise",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer les informations complètes de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Utilisateur non trouvé",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    return res.status(403).json({
      status: "error",
      message: "Token invalide ou expiré",
    });
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Authentification requise",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "Accès non autorisé",
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole,
};
