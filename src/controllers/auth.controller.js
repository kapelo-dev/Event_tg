const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (userExists) {
      return res.status(400).json({
        status: "error",
        message:
          "Un utilisateur avec cet email ou ce nom d'utilisateur existe déjà",
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: "USER",
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    // Générer le token
    const token = generateToken(user.id);

    // Logger l'activité
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "REGISTER",
        entityType: "USER",
        entityId: user.id,
        details: "Création du compte utilisateur",
        ipAddress: req.ip,
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de l'inscription",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Veuillez fournir un email et un mot de passe",
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Email ou mot de passe incorrect",
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Email ou mot de passe incorrect",
      });
    }

    // Générer le token
    const token = generateToken(user.id);

    // Envoyer la réponse sans le mot de passe et avec le rôle en majuscules
    const { password: _, ...userWithoutPassword } = user;
    userWithoutPassword.role = userWithoutPassword.role.toUpperCase();

    // Logger l'activité
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        entityType: "USER",
        entityId: user.id,
        details: "Connexion utilisateur",
        ipAddress: req.ip,
      },
    });

    res.json({
      status: "success",
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la connexion",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Utilisateur non trouvé",
      });
    }

    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("Error in getMe:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération du profil",
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
