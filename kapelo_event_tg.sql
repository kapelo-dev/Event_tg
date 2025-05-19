-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql-kapelo.alwaysdata.net
-- Generation Time: May 17, 2025 at 03:14 AM
-- Server version: 10.11.11-MariaDB
-- PHP Version: 7.4.33

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
-- Table structure for table `ActivityLog`
--

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
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

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

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `start_date`, `end_date`, `location`, `status`, `created_at`, `updated_at`, `start_time`, `end_time`, `image_url`) VALUES
(1, 'happy run', 'fun', '2025-05-18 00:00:00.000', '2025-05-18 00:00:00.000', 'lome ny', 'DRAFT', '2025-05-16 01:12:12.344', '2025-05-16 01:12:12.344', '03:13', '05:13', '/uploads/1747357932334-818529286.jpg'),
(2, 'kop', 'k', '2025-05-17 00:00:00.000', '2025-05-17 00:00:00.000', 'lome ny', 'DRAFT', '2025-05-16 01:16:48.177', '2025-05-16 01:16:48.177', '10:00', '11:00', '/uploads/1747358208163-214167299.jpeg'),
(3, 'mood', 'ko', '2025-05-16 00:00:00.000', '2025-05-23 00:00:00.000', 'lome ny', 'DRAFT', '2025-05-16 01:21:25.766', '2025-05-16 01:21:25.766', NULL, NULL, '/uploads/1747358485732-341716480.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `mobile_money_transactions`
--

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

--
-- Dumping data for table `mobile_money_transactions`
--

INSERT INTO `mobile_money_transactions` (`id`, `ticketId`, `transactionReference`, `amount`, `phoneNumber`, `provider`, `status`, `paymentUrl`, `paymentToken`, `responseData`, `createdAt`, `updatedAt`, `userId`, `ticketTypeId`, `quantity`) VALUES
(1, 36, 'TXN-1747438921598-gw5ifh', 1000, '+22892948264', 'PAYDUNYA', 'PENDING', 'https://paydunya.com/checkout/invoice/2cm6Z9kWaRmay3CRFcD3', '2cm6Z9kWaRmay3CRFcD3', NULL, '2025-05-16 23:42:02.709', '2025-05-16 23:42:06.088', 2, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Ticket`
--

CREATE TABLE `Ticket` (
  `id` int(11) NOT NULL,
  `ticketTypeId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PENDING',
  `code` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Ticket`
--

INSERT INTO `Ticket` (`id`, `ticketTypeId`, `userId`, `status`, `code`, `createdAt`, `updatedAt`) VALUES
(36, 1, 2, 'PENDING', 'TKT-1747438921598-c6fm8o', '2025-05-16 23:42:02.027', '2025-05-16 23:42:02.027');

-- --------------------------------------------------------

--
-- Table structure for table `TicketType`
--

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
-- Table structure for table `users`
--

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

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `full_name`, `role`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2a$10$cVA8.Cp/lyqAXJXDA.Mnx.CmTh71VAaMoTwsdOLAuCKCcOhw5Mexq', 'admin@kapelo.com', 'Administrateur', 'ADMIN', '2025-05-16 00:14:32.000', '2025-05-16 00:14:32.000'),
(2, 'DANSOU', '$2a$10$kWmmZu5KLdPro1nok2MaVu8OIUz3ponD3KrtrHsX/y20yBze1y2xO', 'landry@gmail.com', 'landry', 'USER', '2025-05-16 01:32:31.411', '2025-05-16 01:32:31.411');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ActivityLog`
--
ALTER TABLE `ActivityLog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ActivityLog_userId_fkey` (`userId`);

--
-- Indexes for table `AgentEvent`
--
ALTER TABLE `AgentEvent`
  ADD PRIMARY KEY (`agentId`,`eventId`),
  ADD KEY `AgentEvent_eventId_fkey` (`eventId`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mobile_money_transactions`
--
ALTER TABLE `mobile_money_transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mobile_money_transactions_ticketId_key` (`ticketId`),
  ADD UNIQUE KEY `mobile_money_transactions_transactionReference_key` (`transactionReference`);

--
-- Indexes for table `Ticket`
--
ALTER TABLE `Ticket`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Ticket_code_key` (`code`),
  ADD KEY `Ticket_ticketTypeId_fkey` (`ticketTypeId`),
  ADD KEY `Ticket_userId_fkey` (`userId`);

--
-- Indexes for table `TicketType`
--
ALTER TABLE `TicketType`
  ADD PRIMARY KEY (`id`),
  ADD KEY `TicketType_eventId_fkey` (`eventId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`),
  ADD UNIQUE KEY `users_username_key` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ActivityLog`
--
ALTER TABLE `ActivityLog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mobile_money_transactions`
--
ALTER TABLE `mobile_money_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Ticket`
--
ALTER TABLE `Ticket`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `TicketType`
--
ALTER TABLE `TicketType`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ActivityLog`
--
ALTER TABLE `ActivityLog`
  ADD CONSTRAINT `ActivityLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `AgentEvent`
--
ALTER TABLE `AgentEvent`
  ADD CONSTRAINT `AgentEvent_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `mobile_money_transactions`
--
ALTER TABLE `mobile_money_transactions`
  ADD CONSTRAINT `mobile_money_transactions_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `Ticket`
--
ALTER TABLE `Ticket`
  ADD CONSTRAINT `Ticket_ticketTypeId_fkey` FOREIGN KEY (`ticketTypeId`) REFERENCES `TicketType` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Ticket_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `TicketType`
--
ALTER TABLE `TicketType`
  ADD CONSTRAINT `TicketType_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
