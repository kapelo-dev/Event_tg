-- Base de données : `kapelo_event_tg`
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Structure de la table `ActivityLog`
CREATE TABLE `ActivityLog` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `action` varchar(191) NOT NULL,
  `entityType` varchar(191) NOT NULL,
  `entityId` int(11) NOT NULL,
  `details` text DEFAULT NULL,
  `ipAddress` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure de la table `AgentEvent`
CREATE TABLE `AgentEvent` (
  `agentId` int(11) NOT NULL,
  `eventId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure de la table `events`
CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `start_date` datetime(3) NOT NULL,
  `end_date` datetime(3) NOT NULL,
  `location` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'DRAFT',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `start_time` varchar(191) DEFAULT NULL,
  `end_time` varchar(191) DEFAULT NULL,
  `image_url` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Structure de la table `mobile_money_transactions`
CREATE TABLE `mobile_money_transactions` (
  `id` int(11) NOT NULL,
  `ticketId` int(11) NOT NULL,
  `transactionReference` varchar(191) NOT NULL,
  `amount` double NOT NULL,
  `phoneNumber` varchar(191) DEFAULT NULL,
  `provider` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PENDING',
  `paymentUrl` varchar(191) DEFAULT NULL,
  `paymentToken` varchar(191) DEFAULT NULL,
  `responseData` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `userId` int(11) NOT NULL,
  `ticketTypeId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure de la table `Ticket`
CREATE TABLE `Ticket` (
  `id` int(11) NOT NULL,
  `ticketTypeId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PENDING',
  `code` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure de la table `TicketType`
CREATE TABLE `TicketType` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `price` double NOT NULL,
  `quantity` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `eventId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Structure de la table `users`
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `full_name` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'user',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Index pour la table `ActivityLog`
ALTER TABLE `ActivityLog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ActivityLog_userId_fkey` (`userId`);

-- Index pour la table `AgentEvent`
ALTER TABLE `AgentEvent`
  ADD PRIMARY KEY (`agentId`,`eventId`),
  ADD KEY `AgentEvent_eventId_fkey` (`eventId`);

-- Index pour la table `events`
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

-- Index pour la table `mobile_money_transactions`
ALTER TABLE `mobile_money_transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mobile_money_transactions_ticketId_key` (`ticketId`),
  ADD UNIQUE KEY `mobile_money_transactions_transactionReference_key` (`transactionReference`);

-- Index pour la table `Ticket`
ALTER TABLE `Ticket`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Ticket_code_key` (`code`),
  ADD KEY `Ticket_ticketTypeId_fkey` (`ticketTypeId`),
  ADD KEY `Ticket_userId_fkey` (`userId`);

-- Index pour la table `TicketType`
ALTER TABLE `TicketType`
  ADD PRIMARY KEY (`id`),
  ADD KEY `TicketType_eventId_fkey` (`eventId`);

-- Index pour la table `users`
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`),
  ADD UNIQUE KEY `users_username_key` (`username`);

-- AUTO_INCREMENT pour les tables
ALTER TABLE `ActivityLog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `mobile_money_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `Ticket`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `TicketType`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- Contraintes pour les tables
ALTER TABLE `ActivityLog`
  ADD CONSTRAINT `ActivityLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

ALTER TABLE `AgentEvent`
  ADD CONSTRAINT `AgentEvent_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON UPDATE CASCADE;

ALTER TABLE `mobile_money_transactions`
  ADD CONSTRAINT `mobile_money_transactions_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket` (`id`) ON UPDATE CASCADE;

ALTER TABLE `Ticket`
  ADD CONSTRAINT `Ticket_ticketTypeId_fkey` FOREIGN KEY (`ticketTypeId`) REFERENCES `TicketType` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Ticket_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

ALTER TABLE `TicketType`
  ADD CONSTRAINT `TicketType_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON UPDATE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */; 