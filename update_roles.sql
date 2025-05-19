-- Mettre à jour tous les rôles en majuscules
UPDATE users SET role = UPPER(role) WHERE role = 'agent';
UPDATE users SET role = UPPER(role) WHERE role = 'user';
UPDATE users SET role = UPPER(role) WHERE role = 'admin'; 