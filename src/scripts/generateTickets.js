const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function generateTickets(userId, ticketTypeId, quantity = 1) {
  try {
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    // Vérifier si le type de ticket existe
    const ticketType = await prisma.ticketType.findUnique({
      where: { id: ticketTypeId },
      include: { event: true },
    });

    if (!ticketType) {
      throw new Error(`Type de ticket avec l'ID ${ticketTypeId} non trouvé`);
    }

    // Vérifier la disponibilité
    if (ticketType.quantity < quantity) {
      throw new Error(
        `Quantité insuffisante disponible. Demandé: ${quantity}, Disponible: ${ticketType.quantity}`
      );
    }

    const tickets = [];
    const transactionRef = `TXN-${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}`;

    // Créer les tickets dans une transaction
    const result = await prisma.$transaction(async (tx) => {
      // Créer le premier ticket
      const ticket = await tx.ticket.create({
        data: {
          ticketTypeId,
          userId,
          code: `TKT-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          status: "PAID",
        },
      });

      // Créer la transaction
      const transaction = await tx.mobileMoneyTransaction.create({
        data: {
          ticketId: ticket.id,
          transactionReference: transactionRef,
          amount: ticketType.price * quantity,
          provider: "MANUAL",
          status: "SUCCESS",
          userId,
          ticketTypeId,
          quantity,
          phoneNumber: user.phone || "",
        },
      });

      // Mettre à jour la quantité disponible
      await tx.ticketType.update({
        where: { id: ticketTypeId },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });

      // Logger l'activité
      await tx.activityLog.create({
        data: {
          userId,
          action: "TICKET_GENERATION",
          entityType: "TICKET",
          entityId: ticket.id,
          details: `Génération manuelle de ticket pour l'événement: ${ticketType.event.title}`,
        },
      });

      return { ticket, transaction };
    });

    console.log("Tickets générés avec succès:", result);
    return result;
  } catch (error) {
    console.error("Erreur lors de la génération des tickets:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script avec les paramètres fournis
const userId = 1;
const ticketTypeId = 4;
const quantity = 1;

generateTickets(userId, ticketTypeId, quantity)
  .then(() => console.log("Script terminé avec succès"))
  .catch((error) => {
    console.error("Erreur lors de l'exécution du script:", error);
    process.exit(1);
  });
