const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const protect = async (req, res, next) => {
  try {
    // 1. Vérifier si le token existe
    console.log("Headers:", req.headers);
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token trouvé:", token);
    }

    if (!token) {
      console.log("Pas de token trouvé");
      return res.status(401).json({
        status: "error",
        message: "Non autorisé - Token manquant",
      });
    }

    // 2. Vérifier si le token est valide
    console.log("Vérification du token avec secret:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token décodé:", decoded);

    // 3. Vérifier si l'utilisateur existe toujours
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });
    console.log("Utilisateur trouvé:", user);

    if (!user) {
      console.log("Utilisateur non trouvé");
      return res.status(401).json({
        status: "error",
        message: "Non autorisé - Utilisateur non trouvé",
      });
    }

    // 4. Accorder l'accès à la route protégée
    req.user = user;
    console.log("Utilisateur attaché à la requête:", req.user);
    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    res.status(401).json({
      status: "error",
      message: "Non autorisé - Token invalide",
    });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({
      status: "error",
      message: "Non autorisé - Accès administrateur requis",
    });
  }
};

const agent = (req, res, next) => {
  if (req.user && req.user.role === "AGENT") {
    next();
  } else {
    res.status(403).json({
      status: "error",
      message: "Non autorisé - Accès agent requis",
    });
  }
};

module.exports = {
  protect,
  admin,
  agent,
};
