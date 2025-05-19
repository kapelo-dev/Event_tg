const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.user.create({
      data: {
        username: "admin",
        email: "admin@kapelo.com",
        password: hashedPassword,
        full_name: "Administrateur",
        role: "admin",
      },
    });

    console.log("Administrateur créé avec succès:", admin);
  } catch (error) {
    if (error.code === "P2002") {
      console.log("L'administrateur existe déjà.");
    } else {
      console.error("Erreur lors de la création de l'administrateur:", error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
