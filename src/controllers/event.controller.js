const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Helper functions for validation
const isValidTimeFormat = (time) => {
  if (!time) return false;
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

const isValidTimeRange = (startTime, endTime) => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  if (startHour > endHour) return false;
  if (startHour === endHour && startMinute >= endMinute) return false;
  return true;
};

// Créer un événement
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      start_date,
      end_date,
      start_time,
      end_time,
      location,
      isOneDay,
      ticketTypes,
      categoryId,
      organizer,
    } = req.body;

    // Validation de base
    if (!title || !description || !location || !start_date) {
      return res.status(400).json({
        status: "error",
        message: "Veuillez fournir tous les champs requis",
      });
    }

    // Construire l'URL de l'image si elle existe
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Validation des heures si c'est un événement d'un jour
    if (isOneDay === "true" || isOneDay === true) {
      if (!start_time || !end_time) {
        return res.status(400).json({
          status: "error",
          message:
            "Les heures de début et de fin sont requises pour un événement d'un jour",
        });
      }

      if (!isValidTimeFormat(start_time) || !isValidTimeFormat(end_time)) {
        return res.status(400).json({
          status: "error",
          message: "Le format de l'heure doit être HH:mm",
        });
      }

      if (!isValidTimeRange(start_time, end_time)) {
        return res.status(400).json({
          status: "error",
          message: "L'heure de fin doit être après l'heure de début",
        });
      }
    } else {
      // Validation des dates pour un événement sur plusieurs jours
      if (!end_date) {
        return res.status(400).json({
          status: "error",
          message:
            "La date de fin est requise pour un événement sur plusieurs jours",
        });
      }

      const start = new Date(start_date);
      const end = new Date(end_date);

      if (end < start) {
        return res.status(400).json({
          status: "error",
          message: "La date de fin doit être après la date de début",
        });
      }
    }

    // Parsing et validation des types de tickets
    let parsedTicketTypes;
    try {
      parsedTicketTypes =
        typeof ticketTypes === "string" ? JSON.parse(ticketTypes) : ticketTypes;

      if (!Array.isArray(parsedTicketTypes) || parsedTicketTypes.length === 0) {
        return res.status(400).json({
          status: "error",
          message: "Au moins un type de ticket est requis",
        });
      }

      // Validation de chaque type de ticket
      for (const ticket of parsedTicketTypes) {
        if (
          !ticket.name ||
          typeof ticket.price !== "number" ||
          typeof ticket.quantity !== "number"
        ) {
          return res.status(400).json({
            status: "error",
            message:
              "Chaque type de ticket doit avoir un nom, un prix et une quantité valides",
          });
        }
      }
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: "Format des types de tickets invalide",
      });
    }

    // Création de l'événement dans la base de données
    const event = await prisma.event.create({
      data: {
        title,
        description,
        imageUrl,
        startDate: new Date(start_date),
        endDate: new Date(end_date || start_date),
        startTime: isOneDay === "true" || isOneDay === true ? start_time : null,
        endTime: isOneDay === "true" || isOneDay === true ? end_time : null,
        location,
        status: "DRAFT",
        organizer,
        isMultiDay: isOneDay === "false" || isOneDay === false,
        hasSpecificTime:
          (isOneDay === "true" || isOneDay === true) && start_time && end_time,
        ticketTypes: {
          create: parsedTicketTypes.map((ticket) => ({
            name: ticket.name,
            description: ticket.description || "",
            price: parseFloat(ticket.price),
            quantity: parseInt(ticket.quantity),
          })),
        },
        categoryId: categoryId ? parseInt(categoryId) : undefined,
      },
      include: {
        ticketTypes: true,
        category: true,
      },
    });

    // Logger l'activité
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: "CREATE",
        entityType: "EVENT",
        entityId: event.id,
        details: `Création de l'événement: ${event.title}`,
        ipAddress: req.ip,
      },
    });

    res.status(201).json({
      status: "success",
      data: event,
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'événement:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la création de l'événement",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Obtenir tous les événements
const getAllEvents = async (req, res) => {
  try {
    const { category, q, type } = req.query;
    const now = new Date();

    let where = {};

    // Filtre par catégorie
    if (category) {
      const categoryIds = Array.isArray(category)
        ? category.map(Number)
        : [Number(category)];

      where.OR = categoryIds.map((categoryId) => ({
        categoryId: categoryId,
      }));
    }

    // Filtre par recherche
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
      ];
    }

    // Filtre par type (populaire ou à venir)
    if (type === "popular") {
      where.categoryId = 5; // Catégorie "populaire"
    } else if (type === "upcoming") {
      where.startDate = {
        gte: now,
      };
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        ticketTypes: true,
        category: true,
      },
      orderBy: {
        startDate: "asc",
      },
    });

    res.json({
      status: "success",
      data: events,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération des événements",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Obtenir un événement par son ID
const getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        status: "error",
        message: "ID d'événement invalide",
      });
    }

    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
      include: {
        ticketTypes: {
          select: {
            id: true,
            name: true,
            price: true,
            quantity: true,
            description: true,
          },
        },
        category: true,
      },
    });

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Événement non trouvé",
      });
    }

    // Adapter les noms des champs pour le frontend
    const formattedEvent = {
      id: event.id,
      title: event.title,
      description: event.description,
      imageUrl: event.imageUrl,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      status: event.status,
      organizer: event.organizer,
      categoryId: event.categoryId,
      category: event.category,
      ticketTypes: event.ticketTypes.map((type) => ({
        id: type.id,
        eventId: event.id,
        name: type.name,
        price: type.price,
        quantity: type.quantity,
        description: type.description || "",
      })),
    };

    res.json({
      status: "success",
      data: formattedEvent,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération de l'événement",
    });
  }
};

// Mettre à jour un événement
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      startTime,
      endTime,
      imageUrl,
      categoryId,
      status,
      organizer,
    } = req.body;

    // Validation des heures si elles sont fournies
    if (startTime && !isValidTimeFormat(startTime)) {
      return res.status(400).json({
        status: "error",
        message: "Le format de l'heure de début doit être HH:mm",
      });
    }

    if (endTime && !isValidTimeFormat(endTime)) {
      return res.status(400).json({
        status: "error",
        message: "Le format de l'heure de fin doit être HH:mm",
      });
    }

    // Vérifier que l'heure de fin est après l'heure de début
    if (startTime && endTime && !isValidTimeRange(startTime, endTime)) {
      return res.status(400).json({
        status: "error",
        message: "L'heure de fin doit être après l'heure de début",
      });
    }

    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        location,
        startTime,
        endTime,
        imageUrl,
        organizer,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        status,
        isMultiDay: startTime === null && endTime === null,
        hasSpecificTime: startTime !== null && endTime !== null,
      },
      include: {
        category: true,
      },
    });

    // Logger l'activité
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: "UPDATE",
        entityType: "EVENT",
        entityId: event.id,
        details: `Mise à jour de l'événement: ${event.title}`,
        ipAddress: req.ip,
      },
    });

    res.json({
      status: "success",
      data: event,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'événement:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la mise à jour de l'événement",
    });
  }
};

// Assigner des agents à un événement
const assignAgents = async (req, res) => {
  try {
    const { id } = req.params;
    const { agentIds } = req.body;

    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
    });

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Événement non trouvé",
      });
    }

    // Créer les assignations d'agents
    const assignments = await Promise.all(
      agentIds.map((agentId) =>
        prisma.eventAgent.create({
          data: {
            eventId: parseInt(id),
            agentId: agentId,
          },
        })
      )
    );

    // Logger l'activité
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: "ASSIGN_AGENTS",
        entityType: "EVENT",
        entityId: event.id,
        details: `Attribution d'agents à l'événement: ${event.title}`,
        ipAddress: req.ip,
      },
    });

    res.json({
      status: "success",
      message: "Agents assignés avec succès",
      data: assignments,
    });
  } catch (error) {
    console.error("Erreur lors de l'assignation des agents:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de l'assignation des agents",
    });
  }
};

// Supprimer un événement
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const eventId = parseInt(id);

    // Supprimer d'abord les tickets liés à l'événement
    await prisma.ticketType.deleteMany({
      where: { eventId: eventId },
    });

    // Supprimer l'événement
    const event = await prisma.event.delete({
      where: { id: eventId },
    });

    // Logger l'activité
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: "DELETE",
        entityType: "EVENT",
        entityId: eventId,
        details: `Suppression de l'événement: ${event.title}`,
        ipAddress: req.ip,
      },
    });

    res.json({
      status: "success",
      message: "Événement supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'événement:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la suppression de l'événement",
    });
  }
};

const getEventCategories = async (req, res) => {
  try {
    const categories = [
      "Music Concert",
      "Exhibition",
      "Sports",
      "Theater",
      "Conference",
      "Festival",
    ];

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error getting event categories:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        ticketTypes: true,
        agentEvents: {
          include: {
            agent: true,
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Événement non trouvé",
      });
    }

    // Formater l'événement pour correspondre au format attendu par le frontend
    const formattedEvent = {
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      status: event.status,
      organizer: event.organizer,
      imageUrl: event.imageUrl,
      categoryId: event.categoryId,
      category: event.category,
      ticketTypes: event.ticketTypes.map((ticket) => ({
        id: ticket.id,
        eventId: ticket.eventId,
        name: ticket.name,
        price: ticket.price,
        quantity: ticket.quantity,
        description: ticket.description || "",
      })),
    };

    res.json({
      status: "success",
      data: formattedEvent,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur interne du serveur",
    });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  assignAgents,
  deleteEvent,
  getEventCategories,
  getEventById,
};
