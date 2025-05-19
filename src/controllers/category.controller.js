const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtenir toutes les catégories
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json({
      status: "success",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération des catégories",
    });
  }
};

// Obtenir une catégorie par son ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Catégorie non trouvée",
      });
    }

    res.json({
      status: "success",
      data: category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération de la catégorie",
    });
  }
};

// Créer une nouvelle catégorie
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validation de base
    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Le nom de la catégorie est requis",
      });
    }

    // Créer le slug à partir du nom
    const slug = name
      .toLowerCase()
      .replace(/[éèê]/g, "e")
      .replace(/[àâ]/g, "a")
      .replace(/[ùû]/g, "u")
      .replace(/[ôö]/g, "o")
      .replace(/[ïî]/g, "i")
      .replace(/[ç]/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const category = await prisma.category.create({
      data: {
        name,
        description,
        slug,
        active: true,
      },
    });

    res.status(201).json({
      status: "success",
      data: category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la création de la catégorie",
    });
  }
};

// Mettre à jour une catégorie
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, active } = req.body;

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        active,
        updatedAt: new Date(),
      },
    });

    res.json({
      status: "success",
      data: category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la mise à jour de la catégorie",
    });
  }
};

// Supprimer une catégorie
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      status: "success",
      message: "Catégorie supprimée avec succès",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la suppression de la catégorie",
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
