-- MySQL dump
-- Encoding: UTF-8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kapelo_event_tg`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `slug` varchar(191) NOT NULL,
  `active` boolean NOT NULL DEFAULT true,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_name_key` (`name`),
  UNIQUE KEY `categories_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`name`, `description`, `slug`, `active`, `created_at`, `updated_at`) VALUES
('Concert', 'Événements musicaux et performances live', 'concert', true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('Sport', 'Événements sportifs et compétitions', 'sport', true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('Festival', 'Festivals culturels et artistiques', 'festival', true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('Conférence', 'Conférences professionnelles et séminaires', 'conference', true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('Populaire', 'Événements les plus populaires', 'populaire', true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('Formation', 'Ateliers et sessions de formation', 'formation', true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
('Exposition', 'Expositions d\'art et salons', 'exposition', true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `first_name` varchar(191) NOT NULL,
  `last_name` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'ACTIVE',
  `role` varchar(191) NOT NULL DEFAULT 'USER',
  `created_at` datetime(3) DEFAULT current_timestamp(3),
  `updated_at` datetime(3) DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`),
  UNIQUE KEY `users_username_key` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `first_name`, `last_name`, `role`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2a$10$cVA8.Cp/lyqAXJXDA.Mnx.CmTh71VAaMoTwsdOLAuCKCcOhw5Mexq', 'admin@kapelo.com', 'Administrateur', 'System', 'ADMIN', '2025-05-16 00:14:32.000', '2025-05-16 00:14:32.000'),
(2, 'DANSOU', '$2a$10$kWmmZu5KLdPro1nok2MaVu8OIUz3ponD3KrtrHsX/y20yBze1y2xO', 'landry@gmail.com', 'landry', 'DANSOU', 'USER', '2025-05-16 01:32:31.411', '2025-05-16 01:32:31.411');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `start_date` datetime(3) NOT NULL,
  `end_date` datetime(3) NOT NULL,
  `is_multi_day` boolean NOT NULL DEFAULT false,
  `has_specific_time` boolean NOT NULL DEFAULT true,
  `start_time` varchar(191) DEFAULT NULL,
  `end_time` varchar(191) DEFAULT NULL,
  `location` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'DRAFT',
  `organizer` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) DEFAULT current_timestamp(3),
  `updated_at` datetime(3) DEFAULT current_timestamp(3),
  `image_url` varchar(191) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `events_category_id_fkey` (`category_id`),
  CONSTRAINT `events_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `start_date`, `end_date`, `location`, `status`, `created_at`, `updated_at`, `start_time`, `end_time`, `image_url`, `category_id`) VALUES
(1, 'happy run', 'fun', '2025-05-18 00:00:00.000', '2025-05-18 00:00:00.000', 'lome ny', 'DRAFT', '2025-05-16 01:12:12.344', '2025-05-16 01:12:12.344', '03:13', '05:13', '/uploads/1747357932334-818529286.jpg', 2),
(2, 'kop', 'k', '2025-05-17 00:00:00.000', '2025-05-17 00:00:00.000', 'lome ny', 'DRAFT', '2025-05-16 01:16:48.177', '2025-05-16 01:16:48.177', '10:00', '11:00', '/uploads/1747358208163-214167299.jpeg', 3),
(3, 'mood', 'ko', '2025-05-16 00:00:00.000', '2025-05-23 00:00:00.000', 'lome ny', 'DRAFT', '2025-05-16 01:21:25.766', '2025-05-16 01:21:25.766', NULL, NULL, '/uploads/1747358485732-341716480.jpeg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `TicketType`
--

CREATE TABLE `TicketType` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `price` double NOT NULL,
  `quantity` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `eventId` int(11) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `TicketType_eventId_fkey` (`eventId`),
  CONSTRAINT `TicketType_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `TicketType`
--

INSERT INTO `TicketType` (`id`, `name`, `price`, `quantity`, `description`, `eventId`, `createdAt`, `updatedAt`) VALUES
(1, 'standard', 1000, 8, '', 1, '2025-05-16 01:12:12.344', '2025-05-16 01:12:12.344'),
(2, 'standard', 1000, 10, '', 2, '2025-05-16 01:16:48.177', '2025-05-16 01:16:48.177'),
(3, 'standard', 1000, 10, '', 3, '2025-05-16 01:21:25.766', '2025-05-16 01:21:25.766'),
(4, 'normal', 4000, 20, '', 3, '2025-05-16 01:21:25.766', '2025-05-16 01:21:25.766');

-- --------------------------------------------------------

--
-- Table structure for table `Ticket`
--

CREATE TABLE `Ticket` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticketTypeId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PENDING',
  `code` varchar(191) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Ticket_code_key` (`code`),
  KEY `Ticket_ticketTypeId_fkey` (`ticketTypeId`),
  KEY `Ticket_userId_fkey` (`userId`),
  CONSTRAINT `Ticket_ticketTypeId_fkey` FOREIGN KEY (`ticketTypeId`) REFERENCES `TicketType` (`id`),
  CONSTRAINT `Ticket_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Ticket`
--

INSERT INTO `Ticket` (`id`, `ticketTypeId`, `userId`, `status`, `code`, `createdAt`, `updatedAt`) VALUES
(36, 1, 2, 'PENDING', 'TKT-1747438921598-c6fm8o', '2025-05-16 23:42:02.027', '2025-05-16 23:42:02.027');

-- --------------------------------------------------------

--
-- Table structure for table `mobile_money_transactions`
--

CREATE TABLE `mobile_money_transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticketId` int(11) NOT NULL,
  `transactionReference` varchar(191) NOT NULL,
  `amount` double NOT NULL,
  `phoneNumber` varchar(191) DEFAULT NULL,
  `provider` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PENDING',
  `paymentUrl` varchar(191) DEFAULT NULL,
  `paymentToken` varchar(191) DEFAULT NULL,
  `responseData` text DEFAULT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3),
  `userId` int(11) NOT NULL,
  `ticketTypeId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mobile_money_transactions_ticketId_key` (`ticketId`),
  UNIQUE KEY `mobile_money_transactions_transactionReference_key` (`transactionReference`),
  KEY `idx_ticket_type_id` (`ticketTypeId`),
  KEY `idx_user_id` (`userId`),
  CONSTRAINT `mobile_money_transactions_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mobile_money_transactions`
--

INSERT INTO `mobile_money_transactions` (`id`, `ticketId`, `transactionReference`, `amount`, `phoneNumber`, `provider`, `status`, `paymentUrl`, `paymentToken`, `responseData`, `createdAt`, `updatedAt`, `userId`, `ticketTypeId`, `quantity`) VALUES
(1, 36, 'TXN-1747438921598-gw5ifh', 1000, '+22892948264', 'PAYDUNYA', 'PENDING', 'https://paydunya.com/checkout/invoice/2cm6Z9kWaRmay3CRFcD3', '2cm6Z9kWaRmay3CRFcD3', NULL, '2025-05-16 23:42:02.709', '2025-05-16 23:42:06.088', 2, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `ActivityLog`
--

CREATE TABLE `ActivityLog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `action` varchar(191) NOT NULL,
  `entityType` varchar(191) NOT NULL,
  `entityId` int(11) NOT NULL,
  `details` text DEFAULT NULL,
  `ipAddress` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `ActivityLog_userId_fkey` (`userId`),
  CONSTRAINT `ActivityLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ActivityLog`
--

INSERT INTO `ActivityLog` (`id`, `userId`, `action`, `entityType`, `entityId`, `details`, `ipAddress`, `createdAt`) VALUES
(1, 1, 'LOGIN', 'USER', 1, 'Connexion utilisateur', '::1', '2025-05-16 00:22:28.743'),
(2, 1, 'LOGIN', 'USER', 1, 'Connexion utilisateur', '::1', '2025-05-16 00:28:11.878'),
(3, 1, 'LOGIN', 'USER', 1, 'Connexion utilisateur', '::1', '2025-05-16 00:30:59.995'),
(4, 1, 'LOGIN', 'USER', 1, 'Connexion utilisateur', '::1', '2025-05-16 00:31:12.876'),
(5, 1, 'LOGIN', 'USER', 1, 'Connexion utilisateur', '::1', '2025-05-16 00:34:21.550'),
(6, 1, 'LOGIN', 'USER', 1, 'Connexion utilisateur', '::1', '2025-05-16 00:39:27.712'),
(7, 1, 'LOGIN', 'USER', 1, 'Connexion utilisateur', '::1', '2025-05-16 00:41:11.764'),
(8, 1, 'LOGIN', 'USER', 1, 'Connexion utilisateur', '::1', '2025-05-16 00:48:47.891'),
(9, 1, 'LOGIN', 'USER', 1, 'Connexion utilisateur', '::1', '2025-05-16 00:49:07.986'),
(10, 1, 'LOGIN', 'USER', 1, 'Connexion utilisateur', '::1', '2025-05-16 01:05:17.209'),
(11, 1, 'LOGIN', 'USER', 1, 'Connexion utilisateur', '::1', '2025-05-16 01:07:11.415'),
(12, 1, 'LOGIN', 'USER', 1, 'Connexion utilisateur', '::1', '2025-05-16 01:09:43.153'),
(13, 1, 'CREATE', 'EVENT', 1, 'Création de l\'événement: happy run', '::1', '2025-05-16 01:12:13.555'),
(14, 1, 'CREATE', 'EVENT', 2, 'Création de l\'événement: kop', '::1', '2025-05-16 01:16:49.325'),
(15, 1, 'CREATE', 'EVENT', 3, 'Création de l\'événement: mood', '::1', '2025-05-16 01:21:27.531'),
(16, 2, 'REGISTER', 'USER', 2, 'Création du compte utilisateur', '::1', '2025-05-16 01:32:32.152'),
(17, 2, 'LOGIN', 'USER', 2, 'Connexion utilisateur', '::1', '2025-05-16 01:32:38.503'),
(18, 2, 'LOGIN', 'USER', 2, 'Connexion utilisateur', '::1', '2025-05-16 09:56:08.612'),
(19, 1, 'LOGIN', 'USER', 1, 'Connexion utilisateur', '::1', '2025-05-16 14:55:51.320'),
(20, 2, 'LOGIN', 'USER', 2, 'Connexion utilisateur', '::1', '2025-05-16 14:59:48.074'),
(21, 1, 'LOGIN', 'USER', 1, 'Connexion utilisateur', '::1', '2025-05-16 16:59:14.852'),
(22, 2, 'LOGIN', 'USER', 2, 'Connexion utilisateur', '::1', '2025-05-16 17:00:23.071'),
(23, 2, 'LOGIN', 'USER', 2, 'Connexion utilisateur', '::1', '2025-05-16 17:04:48.861'),
(24, 2, 'LOGIN', 'USER', 2, 'Connexion utilisateur', '::1', '2025-05-16 17:38:27.159'),
(25, 2, 'LOGIN', 'USER', 2, 'Connexion utilisateur', '::1', '2025-05-16 18:07:39.115'),
(26, 2, 'LOGIN', 'USER', 2, 'Connexion utilisateur', '::1', '2025-05-16 18:15:16.693'),
(27, 2, 'LOGIN', 'USER', 2, 'Connexion utilisateur', '::1', '2025-05-16 19:21:59.183'),
(28, 2, 'LOGIN', 'USER', 2, 'Connexion utilisateur', '::1', '2025-05-16 19:26:18.173'),
(29, 2, 'LOGIN', 'USER', 2, 'Connexion utilisateur', '::1', '2025-05-16 20:42:21.957'),
(30, 2, 'LOGIN', 'USER', 2, 'Connexion utilisateur', '::1', '2025-05-16 22:52:49.137'),
(31, 2, 'LOGIN', 'USER', 2, 'Connexion utilisateur', '::1', '2025-05-17 00:24:53.489');

-- --------------------------------------------------------

--
-- Table structure for table `AgentEvent`
--

CREATE TABLE `AgentEvent` (
  `agentId` int(11) NOT NULL,
  `eventId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`agentId`,`eventId`),
  KEY `AgentEvent_eventId_fkey` (`eventId`),
  CONSTRAINT `AgentEvent_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`),
  CONSTRAINT `AgentEvent_agentId_fkey` FOREIGN KEY (`agentId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */; 