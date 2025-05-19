-- Supprimer la colonne full_name
ALTER TABLE users DROP COLUMN full_name;

-- Ajouter les nouvelles colonnes
ALTER TABLE users 
ADD COLUMN first_name VARCHAR(255) NOT NULL,
ADD COLUMN last_name VARCHAR(255) NOT NULL,
ADD COLUMN phone VARCHAR(255),
ADD COLUMN status VARCHAR(255) NOT NULL DEFAULT 'ACTIVE';

-- Mettre à jour les données existantes si nécessaire
UPDATE users SET first_name = username, last_name = username WHERE first_name IS NULL; 