-- Ajout des nouveaux champs à la table events
ALTER TABLE events
ADD COLUMN is_multi_day BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN has_specific_time BOOLEAN NOT NULL DEFAULT true;

-- Mise à jour des valeurs existantes
UPDATE events
SET is_multi_day = CASE 
    WHEN start_time IS NULL AND end_time IS NULL THEN true
    ELSE false
END,
has_specific_time = CASE 
    WHEN start_time IS NOT NULL AND end_time IS NOT NULL THEN true
    ELSE false
END; 