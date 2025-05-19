const validatePaymentData = (data) => {
  const errors = [];

  // Validation du montant
  if (!data.amount || isNaN(data.amount) || data.amount <= 0) {
    errors.push("Le montant doit être un nombre positif");
  }

  // Validation des informations du ticket
  if (!data.ticketTypeId) {
    errors.push("L'ID du type de ticket est requis");
  }
  if (!data.eventTitle) {
    errors.push("Le titre de l'événement est requis");
  }
  if (!data.ticketName) {
    errors.push("Le nom du ticket est requis");
  }
  if (!data.quantity || data.quantity < 1) {
    errors.push("La quantité doit être au moins 1");
  }

  // Validation des informations de l'acheteur
  if (!data.buyerName || data.buyerName.trim().length === 0) {
    errors.push("Le nom de l'acheteur est requis");
  }
  if (!data.buyerEmail || !isValidEmail(data.buyerEmail)) {
    errors.push("L'email de l'acheteur est invalide");
  }
  if (!data.buyerPhone || !isValidPhone(data.buyerPhone)) {
    errors.push("Le numéro de téléphone est invalide");
  }

  // Validation de l'ID de transaction
  if (!data.transactionId) {
    errors.push("L'ID de transaction est requis");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  // Format: +228 XX XX XX XX ou XX XX XX XX
  const phoneRegex = /^(\+228)?\s*\d{2}\s*\d{2}\s*\d{2}\s*\d{2}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

module.exports = {
  validatePaymentData,
};
