const axios = require("axios");

const PAYMENT_API_URL = "https://event-tg-payment.vercel.app/api/payment";

const PaydunyaService = {
  async initializePayment(data) {
    try {
      console.log("=== Début de l'appel à l'API de paiement ===");
      console.log("URL:", `${PAYMENT_API_URL}/initiate`);
      console.log("Données envoyées:", {
        amount: data.totalAmount,
        eventTitle: data.eventTitle,
        ticketName: data.ticketName,
        quantity: data.quantity,
        buyerName: data.buyerName,
        buyerEmail: data.buyerEmail,
        buyerPhone: data.buyerPhone,
        transactionId: data.transactionId,
      });

      const response = await axios.post(`${PAYMENT_API_URL}/initiate`, {
        amount: data.totalAmount,
        eventTitle: data.eventTitle,
        ticketName: data.ticketName,
        quantity: data.quantity,
        buyerName: data.buyerName,
        buyerEmail: data.buyerEmail,
        buyerPhone: data.buyerPhone,
        transactionId: data.transactionId,
      });

      console.log("Réponse reçue:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "=== Erreur détaillée lors de l'appel à l'API de paiement ==="
      );
      console.error("Status:", error.response?.status);
      console.error("Message d'erreur:", error.message);
      console.error("Données d'erreur:", error.response?.data);
      console.error("Stack:", error.stack);
      throw error;
    }
  },

  async verifyPayment(token) {
    try {
      console.log("=== Vérification du paiement ===");
      console.log("Token:", token);
      const response = await axios.get(`${PAYMENT_API_URL}/verify/${token}`);
      console.log("Réponse de vérification:", response.data);
      return response.data;
    } catch (error) {
      console.error("=== Erreur lors de la vérification du paiement ===");
      console.error("Status:", error.response?.status);
      console.error("Message d'erreur:", error.message);
      console.error("Données d'erreur:", error.response?.data);
      throw error;
    }
  },
};

module.exports = PaydunyaService;
