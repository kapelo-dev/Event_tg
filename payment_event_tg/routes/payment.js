const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const paydunyaService = require("../services/paydunya.service");
const { validatePaymentData } = require("../utils/validation");
const { PaymentError, handleError } = require("../utils/errorHandler");
require("dotenv").config();

// Rate limiting for payment requests
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: "Trop de tentatives de paiement, veuillez réessayer plus tard",
});

// Route pour initialiser le paiement
router.post("/initiate", paymentLimiter, async (req, res) => {
  try {
    console.log("=== Début de la requête de paiement ===");
    console.log("Body reçu:", req.body);

    const paymentData = req.body;

    // Validation des données
    const { isValid, errors } = validatePaymentData(paymentData);
    if (!isValid) {
      console.error("Erreur de validation:", errors);
      throw new PaymentError("Données de paiement invalides", 400, errors);
    }

    const {
      amount,
      ticketTypeId,
      eventTitle,
      ticketName,
      quantity,
      buyerName,
      buyerEmail,
      buyerPhone,
      transactionId,
    } = paymentData;

    try {
      const result = await paydunyaService.initializePayment({
        name: `${quantity}x ${ticketName} - ${eventTitle}`,
        quantity: quantity,
        unitPrice: amount / quantity,
        totalAmount: amount,
        description: `Achat de ${quantity} ticket(s) pour ${eventTitle}`,
      });

      return res.status(200).json({
        success: true,
        payment_url: result.paymentUrl,
        token: result.token,
      });
    } catch (error) {
      console.error("=== Erreur PayDunya détaillée ===");
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
        console.error("Data:", error.response.data);

        if (error.response.status === 403) {
          throw new PaymentError(
            "Erreur d'authentification PayDunya. Veuillez vérifier vos clés API.",
            403
          );
        }
      }
      throw error;
    }
  } catch (error) {
    console.error("=== Erreur détaillée ===");
    console.error("Type:", error.name);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    handleError(error, req, res);
  }
});

module.exports = router;
