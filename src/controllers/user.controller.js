const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });
    res.json({ status: "success", data: users });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération des utilisateurs",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "Utilisateur non trouvé" });
    }
    res.json({ status: "success", data: user });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération de l'utilisateur",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        fullName,
        role,
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json({ status: "success", data: user });
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === "P2002") {
      return res.status(400).json({
        status: "error",
        message:
          "Un utilisateur avec cet email ou ce nom d'utilisateur existe déjà",
      });
    }
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la création de l'utilisateur",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body;
    const updateData = {
      username,
      email,
      fullName,
      role,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({ status: "success", data: user });
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ status: "error", message: "Utilisateur non trouvé" });
    }
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la mise à jour de l'utilisateur",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({
      status: "success",
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ status: "error", message: "Utilisateur non trouvé" });
    }
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la suppression de l'utilisateur",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword, fullName } =
      req.body;
    const userId = req.user.id;

    // Vérifier le mot de passe actuel si un nouveau mot de passe est fourni
    if (newPassword) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const validPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!validPassword) {
        return res
          .status(400)
          .json({ status: "error", message: "Mot de passe actuel incorrect" });
      }
    }

    const updateData = {
      username,
      email,
      fullName,
    };

    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({ status: "success", data: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la mise à jour du profil",
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
};
