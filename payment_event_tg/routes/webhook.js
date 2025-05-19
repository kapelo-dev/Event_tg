const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  try {
    const webhookData = req.body;
    const customData = webhookData.custom_data || {};

    console.log("Webhook Paydunya reçu:", {
      status: webhookData.status,
      token: webhookData.token,
      customData,
    });

    // URL de l'API principale
    const mainApiUrl =
      process.env.MAIN_API_URL || "https://event-tg.vercel.app/api";

    switch (webhookData.status) {
      case "completed":
        try {
          // Notifier l'API principale de la réussite du paiement
          await axios.post(`${mainApiUrl}/tickets/confirm-payment`, {
            transactionReference: customData.transactionId,
            status: "success",
            paymentDetails: {
              token: webhookData.token,
              amount: webhookData.invoice.total_amount,
              paymentMethod: "PayDunya",
              paymentDate: new Date().toISOString(),
            },
          });

          console.log(
            "Paiement confirmé avec succès pour le token:",
            webhookData.token
          );
        } catch (error) {
          console.error("Erreur lors de la confirmation du paiement:", error);
          throw error;
        }
        break;

      case "cancelled":
        try {
          await axios.post(`${mainApiUrl}/tickets/confirm-payment`, {
            transactionReference: customData.transactionId,
            status: "cancelled",
            paymentDetails: {
              token: webhookData.token,
              reason: "Payment cancelled by user",
            },
          });

          console.log("Paiement annulé pour le token:", webhookData.token);
        } catch (error) {
          console.error("Erreur lors de l'annulation du paiement:", error);
          throw error;
        }
        break;

      case "failed":
        try {
          await axios.post(`${mainApiUrl}/tickets/confirm-payment`, {
            transactionReference: customData.transactionId,
            status: "failed",
            paymentDetails: {
              token: webhookData.token,
              reason: webhookData.response_text || "Payment failed",
            },
          });

          console.log("Échec du paiement pour le token:", webhookData.token);
        } catch (error) {
          console.error(
            "Erreur lors de la notification d'échec du paiement:",
            error
          );
          throw error;
        }
        break;

      default:
        console.log("Statut de paiement non géré:", webhookData.status);
    }

    res.status(200).json({
      success: true,
      message: "Webhook traité avec succès",
    });
  } catch (error) {
    console.error("Erreur lors du traitement du webhook:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du traitement du webhook",
      error: error.message,
    });
  }
});

module.exports = router;
