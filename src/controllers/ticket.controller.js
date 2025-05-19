const { PrismaClient } = require("@prisma/client");
const paydunyaService = require("../services/paydunya.service");
const axios = require("axios");

// Initialisation directe de Prisma
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
  errorFormat: "pretty",
});

// Vérifier la connexion au démarrage
prisma
  .$connect()
  .then(() => console.log("Base de données connectée avec succès"))
  .catch((err) =>
    console.error("Erreur de connexion à la base de données:", err)
  );

// Acheter un ticket
const purchaseTicket = async (req, res) => {
  let result = null;

  try {
    console.log("=== Début de la requête d'achat de ticket ===");
    console.log("Données reçues:", req.body);

    const {
      ticketTypeId,
      buyerEmail,
      quantity = 1,
      buyerPhone,
      buyerName,
      unitPrice,
      totalAmount,
    } = req.body;

    // Validation des données requises
    if (
      !ticketTypeId ||
      !buyerEmail ||
      !buyerPhone ||
      !buyerName ||
      !unitPrice ||
      !totalAmount
    ) {
      return res.status(400).json({
        status: "error",
        message: "Données manquantes",
        details: "Tous les champs sont requis",
      });
    }

    // Récupérer ou créer l'utilisateur
    const user = await prisma.user.upsert({
      where: { email: buyerEmail },
      update: {},
      create: {
        username: buyerEmail.split("@")[0],
        email: buyerEmail,
        password: "temporary",
        full_name: buyerName,
        role: "USER",
      },
    });

    // Vérifier le type de ticket
    const ticketType = await prisma.ticketType.findUnique({
      where: { id: parseInt(ticketTypeId) },
      include: { event: true },
    });

    if (!ticketType) {
      return res.status(404).json({
        status: "error",
        message: "Type de ticket non trouvé",
      });
    }

    // Vérifications
    if (ticketType.price !== unitPrice) {
      return res.status(400).json({
        status: "error",
        message: "Le prix du ticket a changé",
      });
    }

    if (ticketType.quantity < quantity) {
      return res.status(400).json({
        status: "error",
        message: "Quantité non disponible",
      });
    }

    // Générer les références
    const ticketCode = `TKT-${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}`;
    const transactionRef = `TXN-${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}`;

    // Créer le ticket et la transaction dans une transaction Prisma
    result = await prisma.$transaction(async (tx) => {
      const ticket = await tx.ticket.create({
        data: {
          ticketTypeId: ticketType.id,
          userId: user.id,
          code: ticketCode,
          status: "PENDING",
        },
      });

      const transaction = await tx.mobileMoneyTransaction.create({
        data: {
          ticketId: ticket.id,
          transactionReference: transactionRef,
          amount: parseFloat(totalAmount),
          provider: "PAYDUNYA",
          status: "PENDING",
          userId: user.id,
          ticketTypeId: ticketType.id,
          quantity: parseInt(quantity),
          phoneNumber: buyerPhone,
        },
      });

      return { ticket, transaction };
    });

    // Préparer les données pour PayDunya
    const paymentData = {
      totalAmount: parseInt(totalAmount),
      eventTitle: ticketType.event.title,
      ticketName: ticketType.name,
      quantity: parseInt(quantity),
      buyerName,
      buyerEmail,
      buyerPhone,
      transactionId: transactionRef,
    };

    // Initialiser le paiement
    const paymentResponse = await paydunyaService.initializePayment(
      paymentData
    );

    // Mettre à jour la transaction avec les informations de paiement
    const updatedTransaction = await prisma.mobileMoneyTransaction.update({
      where: { id: result.transaction.id },
      data: {
        paymentToken: paymentResponse.token,
        paymentUrl: paymentResponse.payment_url,
      },
      include: {
        ticket: true,
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        transaction: updatedTransaction,
        paymentUrl: paymentResponse.payment_url,
      },
    });
  } catch (error) {
    console.error("=== Erreur détaillée ===");
    console.error("Type:", error.name);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);

    // Nettoyer en cas d'erreur
    if (result?.ticket?.id) {
      try {
        await prisma.$transaction([
          prisma.mobileMoneyTransaction.deleteMany({
            where: { ticketId: result.ticket.id },
          }),
          prisma.ticket.delete({
            where: { id: result.ticket.id },
          }),
        ]);
      } catch (cleanupError) {
        console.error("Erreur lors du nettoyage:", cleanupError);
      }
    }

    res.status(500).json({
      status: "error",
      message: "Erreur lors de l'achat du ticket",
      details: error.message,
    });
  }
};

// Vérifier un ticket
const checkTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { code: ticketId },
      include: {
        ticketType: {
          include: {
            event: true,
          },
        },
        user: true,
      },
    });

    if (!ticket) {
      return res.status(404).json({
        status: "error",
        message: "Ticket non trouvé",
      });
    }

    const ticketDetails = {
      id: ticket.code,
      eventId: ticket.ticketType.event.id,
      eventTitle: ticket.ticketType.event.title,
      ticketType: ticket.ticketType.name,
      userName:
        `${ticket.user.firstName || ""} ${ticket.user.lastName || ""}`.trim() ||
        ticket.user.username,
      status: ticket.status,
      validationDate: ticket.validationDate,
      event: {
        startDate: ticket.ticketType.event.startDate,
        endDate: ticket.ticketType.event.endDate,
        startTime: ticket.ticketType.event.startTime,
        endTime: ticket.ticketType.event.endTime,
        isMultiDay: ticket.ticketType.event.isMultiDay,
        hasSpecificTime: ticket.ticketType.event.hasSpecificTime,
      },
    };

    res.json({
      status: "success",
      data: ticketDetails,
    });
  } catch (error) {
    console.error("Erreur lors de la vérification du ticket:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la vérification du ticket",
    });
  }
};

// Valider un ticket
const validateTicket = async (req, res) => {
  try {
    console.log("=== Début de la validation du ticket ===");
    console.log("User:", req.user);
    console.log("Params:", req.params);

    const { ticketId } = req.params;

    // Vérifier si l'utilisateur est un agent ou un admin
    if (req.user.role !== "AGENT" && req.user.role !== "ADMIN") {
      return res.status(403).json({
        status: "error",
        message: "Vous n'avez pas les droits pour valider les tickets",
      });
    }

    console.log("Recherche du ticket:", ticketId);
    const ticket = await prisma.ticket.findUnique({
      where: { code: ticketId },
      include: {
        ticketType: {
          include: {
            event: true,
          },
        },
        user: true,
      },
    });
    console.log("Ticket trouvé:", ticket);

    if (!ticket) {
      console.log("Ticket non trouvé");
      return res.status(404).json({
        status: "error",
        message: "Ticket non trouvé",
      });
    }

    // Vérifier si l'agent est assigné à l'événement (sauf pour les admins)
    if (req.user.role === "AGENT") {
      const agentEvent = await prisma.agentEvent.findUnique({
        where: {
          agentId_eventId: {
            agentId: req.user.id,
            eventId: ticket.ticketType.event.id,
          },
        },
      });

      if (!agentEvent) {
        return res.status(403).json({
          status: "error",
          message: "Vous n'êtes pas assigné à cet événement",
        });
      }
    }

    if (ticket.status === "USED") {
      console.log("Ticket déjà validé");
      return res.status(400).json({
        status: "error",
        message: "Ce ticket a déjà été validé",
      });
    }

    // Vérifier si le ticket est payé
    if (ticket.status !== "PAID") {
      return res.status(400).json({
        status: "error",
        message: "Ce ticket n'a pas encore été payé",
      });
    }

    console.log("Mise à jour du ticket...");
    const updatedTicket = await prisma.ticket.update({
      where: { code: ticketId },
      data: {
        status: "USED",
        validationDate: new Date().toISOString(),
        validatedById: req.user.id,
      },
      include: {
        ticketType: {
          include: {
            event: true,
          },
        },
        user: true,
        validatedBy: true,
      },
    });
    console.log("Ticket mis à jour:", updatedTicket);

    console.log("Création du log d'activité...");
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: "VALIDATE",
        entityType: "TICKET",
        entityId: ticket.id,
        details: `Validation du ticket: ${ticket.code}`,
        ipAddress: req.ip,
      },
    });
    console.log("Log d'activité créé");

    console.log("Envoi de la réponse...");
    res.json({
      status: "success",
      message: "Ticket validé avec succès",
      data: {
        id: updatedTicket.code,
        eventId: updatedTicket.ticketType.event.id,
        eventTitle: updatedTicket.ticketType.event.title,
        ticketType: updatedTicket.ticketType.name,
        userName:
          `${updatedTicket.user.firstName || ""} ${
            updatedTicket.user.lastName || ""
          }`.trim() || updatedTicket.user.username,
        status: updatedTicket.status,
        validationDate: updatedTicket.validationDate,
        validatedBy: {
          id: updatedTicket.validatedBy.id,
          username: updatedTicket.validatedBy.username,
        },
        event: {
          startDate: updatedTicket.ticketType.event.startDate,
          endDate: updatedTicket.ticketType.event.endDate,
          startTime: updatedTicket.ticketType.event.startTime,
          endTime: updatedTicket.ticketType.event.endTime,
          isMultiDay: updatedTicket.ticketType.event.isMultiDay,
          hasSpecificTime: updatedTicket.ticketType.event.hasSpecificTime,
        },
      },
    });
    console.log("=== Fin de la validation du ticket ===");
  } catch (error) {
    console.error("=== Erreur détaillée lors de la validation du ticket ===");
    console.error("Type d'erreur:", error.name);
    console.error("Message d'erreur:", error.message);
    console.error("Stack:", error.stack);
    if (error.code) console.error("Code d'erreur Prisma:", error.code);

    res.status(500).json({
      status: "error",
      message: "Erreur lors de la validation du ticket",
      details: error.message,
    });
  }
};

// Obtenir les tickets d'un événement
const getEventTickets = async (req, res) => {
  try {
    const { eventId } = req.params;

    const tickets = await prisma.ticket.findMany({
      where: {
        ticketType: {
          eventId: parseInt(eventId),
        },
      },
      include: {
        ticketType: true,
        validatedBy: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        transaction: true,
      },
    });

    res.json({
      status: "success",
      data: tickets,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des tickets:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération des tickets",
    });
  }
};

// Obtenir les tickets d'un utilisateur
const getMyTickets = async (req, res) => {
  try {
    const userId = req.user.id;

    const tickets = await prisma.ticket.findMany({
      where: {
        userId: userId,
      },
      include: {
        ticketType: {
          include: {
            event: {
              select: {
                title: true,
                startDate: true,
                endDate: true,
                location: true,
                startTime: true,
                endTime: true,
                imageUrl: true,
              },
            },
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        transaction: {
          select: {
            status: true,
            amount: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(tickets);
  } catch (error) {
    console.error("Error getting user tickets:", error);
    res.status(500).json({ error: "Error getting user tickets" });
  }
};

// Confirmer le paiement d'un ticket (webhook PayDunya)
const confirmPayment = async (req, res) => {
  try {
    const { data } = req.body;
    const token = data.token;

    // Vérifier le statut du paiement auprès de PayDunya
    const paymentStatus = await paydunyaService.verifyPayment(token);

    if (!paymentStatus.success) {
      throw new Error("Échec de la vérification du paiement");
    }

    // Récupérer la transaction
    const transaction = await prisma.mobileMoneyTransaction.findFirst({
      where: { paymentToken: token },
      include: { ticketType: true },
    });

    if (!transaction) {
      throw new Error("Transaction non trouvée");
    }

    // Mettre à jour la transaction
    await prisma.mobileMoneyTransaction.update({
      where: { id: transaction.id },
      data: {
        status: paymentStatus.status === "completed" ? "SUCCESS" : "FAILED",
        responseData: JSON.stringify(paymentStatus),
      },
    });

    // Si le paiement est réussi, créer les tickets
    if (paymentStatus.status === "completed") {
      // Créer les tickets
      const tickets = await Promise.all(
        Array(transaction.quantity)
          .fill(null)
          .map(async () => {
            const ticketCode = `TKT-${Date.now()}-${Math.random()
              .toString(36)
              .substring(7)}`;
            return prisma.ticket.create({
              data: {
                ticketTypeId: transaction.ticketTypeId,
                userId: transaction.userId,
                status: "PAID",
                code: ticketCode,
                transactionId: transaction.id,
              },
            });
          })
      );

      // Mettre à jour la quantité de tickets disponibles
      await prisma.ticketType.update({
        where: { id: transaction.ticketTypeId },
        data: {
          quantity: {
            decrement: transaction.quantity,
          },
        },
      });

      // Logger l'activité
      await prisma.activityLog.create({
        data: {
          userId: transaction.userId,
          action: "TICKET_PURCHASE",
          entityType: "TICKET",
          entityId: tickets[0].id,
          details: `Achat de ${transaction.quantity} ticket(s) confirmé pour l'événement: ${transaction.ticketType.event.title}`,
        },
      });
    }

    res.json({
      status: "success",
      message: "Statut de paiement mis à jour avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la confirmation du paiement:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la confirmation du paiement",
      details: error.message,
    });
  }
};

// Obtenir tous les tickets
const getAllTickets = async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        ticketType: {
          include: {
            event: {
              select: {
                title: true,
                startDate: true,
                location: true,
              },
            },
          },
        },
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      status: "success",
      data: tickets,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des tickets:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération des tickets",
    });
  }
};

module.exports = {
  purchaseTicket,
  checkTicket,
  validateTicket,
  getEventTickets,
  getMyTickets,
  confirmPayment,
  getAllTickets,
};
