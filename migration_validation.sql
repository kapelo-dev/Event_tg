-- Ajout des colonnes pour la validation
ALTER TABLE `Ticket`
ADD COLUMN `validationDate` DATETIME NULL,
ADD COLUMN `validatedById` INTEGER NULL;

-- Ajout de l'index
CREATE INDEX `Ticket_validatedById_fkey` ON `Ticket`(`validatedById`);

-- Ajout de la contrainte de clé étrangère
ALTER TABLE `Ticket`
ADD CONSTRAINT `Ticket_validatedById_fkey` 
FOREIGN KEY (`validatedById`) REFERENCES `users`(`id`) 
ON DELETE SET NULL ON UPDATE CASCADE; 