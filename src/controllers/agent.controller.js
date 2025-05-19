const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");

// Créer un agent
const createAgent = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, eventIds } = req.body;

    // Validation de base
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({
        status: "error",
        message: "Veuillez fournir tous les champs requis",
      });
    }

    // Vérifier si l'email existe déjà
    const existingAgent = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAgent) {
      return res.status(400).json({
        status: "error",
        message: "Un agent avec cet email existe déjà",
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Générer un username à partir de l'email
    const username = email.split("@")[0];

    // Créer l'agent avec les événements associés
    const agent = await prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        email,
        phone,
        role: "AGENT",
        status: "ACTIVE",
        password: hashedPassword,
        agentEvents: {
          create:
            eventIds?.map((eventId) => ({
              event: {
                connect: { id: parseInt(eventId) },
              },
            })) || [],
        },
      },
      include: {
        agentEvents: {
          include: {
            event: true,
          },
        },
      },
    });

    // Ne pas renvoyer le mot de passe dans la réponse
    const { password: _, ...agentWithoutPassword } = agent;

    // Logger l'activité
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: "CREATE",
        entityType: "AGENT",
        entityId: agent.id,
        details: `Création de l'agent: ${agent.firstName} ${agent.lastName}`,
        ipAddress: req.ip,
      },
    });

    res.status(201).json({
      status: "success",
      data: agentWithoutPassword,
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'agent:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la création de l'agent",
    });
  }
};

// Obtenir tous les agents
const getAllAgents = async (req, res) => {
  try {
    console.log("Getting all agents...");
    const agents = await prisma.user.findMany({
      where: {
        role: "AGENT",
      },
      include: {
        agentEvents: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    console.log("Found agents:", agents);

    const formattedAgents = agents.map((agent) => {
      const { password, ...agentWithoutPassword } = agent;
      return agentWithoutPassword;
    });

    console.log("Formatted agents:", formattedAgents);

    res.json({
      status: "success",
      data: formattedAgents,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des agents:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération des agents",
    });
  }
};

// Obtenir un agent par son ID
const getAgent = async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
        role: "AGENT",
      },
      include: {
        agentEvents: {
          include: {
            event: true,
          },
        },
      },
    });

    if (!agent) {
      return res.status(404).json({
        status: "error",
        message: "Agent non trouvé",
      });
    }

    const { password, ...agentWithoutPassword } = agent;

    res.json({
      status: "success",
      data: agentWithoutPassword,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'agent:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération de l'agent",
    });
  }
};

// Mettre à jour un agent
const updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, password, eventIds } = req.body;

    // Vérifier si l'agent existe
    const existingAgent = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
        role: "AGENT",
      },
    });

    if (!existingAgent) {
      return res.status(404).json({
        status: "error",
        message: "Agent non trouvé",
      });
    }

    // Vérifier si l'email est déjà utilisé par un autre agent
    if (email !== existingAgent.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return res.status(400).json({
          status: "error",
          message: "Cet email est déjà utilisé",
        });
      }
    }

    // Préparer les données de mise à jour
    const updateData = {
      firstName,
      lastName,
      email,
      phone,
      agentEvents: {
        deleteMany: {}, // Supprimer toutes les associations existantes
        create:
          eventIds?.map((eventId) => ({
            event: {
              connect: { id: parseInt(eventId) },
            },
          })) || [],
      },
    };

    // Ajouter le mot de passe uniquement s'il est fourni
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Mettre à jour l'agent et ses événements associés
    const updatedAgent = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        agentEvents: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    // Ne pas renvoyer le mot de passe dans la réponse
    const { password: _, ...agentWithoutPassword } = updatedAgent;

    // Logger l'activité
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: "UPDATE",
        entityType: "AGENT",
        entityId: updatedAgent.id,
        details: `Mise à jour de l'agent: ${updatedAgent.firstName} ${updatedAgent.lastName}`,
        ipAddress: req.ip,
      },
    });

    res.json({
      status: "success",
      data: agentWithoutPassword,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'agent:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la mise à jour de l'agent",
    });
  }
};

// Supprimer un agent
const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si l'agent existe
    const agent = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
        role: "AGENT",
      },
    });

    if (!agent) {
      return res.status(404).json({
        status: "error",
        message: "Agent non trouvé",
      });
    }

    // Supprimer l'agent (les relations seront automatiquement supprimées grâce à onDelete: Cascade)
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    // Logger l'activité
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: "DELETE",
        entityType: "AGENT",
        entityId: parseInt(id),
        details: `Suppression de l'agent: ${agent.firstName} ${agent.lastName}`,
        ipAddress: req.ip,
      },
    });

    res.json({
      status: "success",
      message: "Agent supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'agent:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la suppression de l'agent",
    });
  }
};

// @desc    Obtenir les statistiques du tableau de bord de l'agent
// @route   GET /api/agent/dashboard
// @access  Private/Agent
const getDashboardStats = asyncHandler(async (req, res) => {
  const agentId = req.user.id;

  // Obtenir les événements assignés à l'agent
  const agentEvents = await prisma.agentEvent.findMany({
    where: {
      agentId,
    },
    include: {
      event: {
        include: {
          tickets: true,
        },
      },
    },
  });

  // Calculer les statistiques
  const totalEvents = agentEvents.length;
  const totalTicketsScanned = await prisma.ticket.count({
    where: {
      status: "USED",
      ticketType: {
        event: {
          AgentEvent: {
            some: {
              agentId,
            },
          },
        },
      },
    },
  });

  const totalValidTickets = totalTicketsScanned; // Dans ce cas, tous les tickets scannés sont valides

  // Obtenir les prochains événements
  const upcomingEvents = await prisma.event.findMany({
    where: {
      AgentEvent: {
        some: {
          agentId,
        },
      },
      startDate: {
        gte: new Date(),
      },
    },
    include: {
      tickets: true,
    },
    orderBy: {
      startDate: "asc",
    },
    take: 5,
  });

  // Formater les événements à venir
  const formattedUpcomingEvents = upcomingEvents.map((event) => ({
    id: event.id,
    title: event.title,
    startDate: event.startDate,
    endDate: event.endDate,
    startTime: event.startTime,
    endTime: event.endTime,
    isMultiDay: event.startDate !== event.endDate,
    hasSpecificTime: Boolean(event.startTime && event.endTime),
    ticketsScanned: event.tickets.filter((t) => t.status === "USED").length,
    totalTickets: event.tickets.length,
  }));

  res.json({
    totalEvents,
    totalTicketsScanned,
    totalValidTickets,
    upcomingEvents: formattedUpcomingEvents,
  });
});

// @desc    Obtenir les événements assignés à l'agent
// @route   GET /api/agent/events
// @access  Private/Agent
const getAgentEvents = asyncHandler(async (req, res) => {
  const agentId = req.user.id;

  const events = await prisma.event.findMany({
    where: {
      AgentEvent: {
        some: {
          agentId,
        },
      },
    },
    include: {
      tickets: true,
      ticketTypes: true,
    },
    orderBy: {
      startDate: "asc",
    },
  });

  res.json(events);
});

module.exports = {
  getDashboardStats,
  getAgentEvents,
  createAgent,
  getAllAgents,
  getAgent,
  updateAgent,
  deleteAgent,
};
