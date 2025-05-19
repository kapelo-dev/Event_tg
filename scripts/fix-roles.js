const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fixRoles() {
  try {
    // Mettre à jour tous les rôles en majuscules
    await prisma.user.updateMany({
      where: {
        role: "agent",
      },
      data: {
        role: "AGENT",
      },
    });

    await prisma.user.updateMany({
      where: {
        role: "user",
      },
      data: {
        role: "USER",
      },
    });

    await prisma.user.updateMany({
      where: {
        role: "admin",
      },
      data: {
        role: "ADMIN",
      },
    });

    // Vérifier les mises à jour
    const users = await prisma.user.findMany({
      select: {
        email: true,
        role: true,
      },
    });

    console.log("Rôles mis à jour :");
    users.forEach((user) => {
      console.log(`${user.email}: ${user.role}`);
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des rôles:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixRoles();
