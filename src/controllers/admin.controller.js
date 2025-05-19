const prisma = require("../lib/prisma");

const getDashboardStats = async (req, res) => {
  try {
    // Récupérer les totaux
    const [totalEvents, totalCategories, totalUsers, totalTickets] =
      await Promise.all([
        prisma.event.count(),
        prisma.category.count(),
        prisma.user.count(),
        prisma.ticketType.aggregate({
          _sum: {
            quantity: true,
          },
        }),
      ]);

    // Récupérer les statistiques par catégorie
    const categoryStats = await prisma.category.findMany({
      select: {
        name: true,
        _count: {
          select: {
            events: true,
          },
        },
        events: {
          select: {
            _count: {
              select: {
                ticketTypes: true,
              },
            },
          },
        },
      },
    });

    // Formater les statistiques par catégorie
    const formattedCategoryStats = categoryStats.map((cat) => ({
      name: cat.name,
      events: cat._count.events,
      tickets: cat.events.reduce(
        (acc, event) => acc + event._count.ticketTypes,
        0
      ),
    }));

    // Récupérer les statistiques des tickets
    const ticketStats = await prisma.ticketType.groupBy({
      by: ["name"],
      _count: {
        _all: true,
      },
    });

    // Formater les statistiques des tickets
    const formattedTicketStats = ticketStats.map((stat) => ({
      name: stat.name,
      value: stat._count._all,
    }));

    // Récupérer les événements récents
    const recentEvents = await prisma.event.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        _count: {
          select: {
            ticketTypes: true,
            agentEvents: true,
          },
        },
      },
    });

    res.json({
      totalEvents,
      totalCategories,
      totalUsers,
      totalTickets: totalTickets._sum.quantity || 0,
      categoryStats: formattedCategoryStats,
      ticketStats: formattedTicketStats,
      recentEvents: recentEvents.map((event) => ({
        ...event,
        totalTicketTypes: event._count.ticketTypes,
        totalAgents: event._count.agentEvents,
      })),
    });
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération des statistiques",
    });
  }
};

module.exports = {
  getDashboardStats,
};
