const paydunyaConfig = {
  // Configuration de l'environnement
  mode: "live", // Forcer le mode production

  // Clés d'API PayDunya
  masterKey: process.env.PAYDUNYA_MASTER_KEY,
  privateKey: process.env.PAYDUNYA_PRIVATE_KEY,
  publicKey: process.env.PAYDUNYA_PUBLIC_KEY,
  token: process.env.PAYDUNYA_TOKEN,

  // Configuration du service
  serviceName: "Kapelo Events",
  serviceDescription: "Plateforme de gestion d'événements",
  serviceWebsite: process.env.FRONTEND_URL || "https://kapelo-events.com",
  serviceLogoUrl:
    process.env.SERVICE_LOGO_URL || "https://kapelo-events.com/logo.png",

  // Configuration des callbacks
  successUrl: process.env.FRONTEND_URL
    ? `${process.env.FRONTEND_URL}/payment/success`
    : "https://kapelo-events.com/payment/success",
  cancelUrl: process.env.FRONTEND_URL
    ? `${process.env.FRONTEND_URL}/payment/cancel`
    : "https://kapelo-events.com/payment/cancel",
  callbackUrl: process.env.BACKEND_URL
    ? `${process.env.BACKEND_URL}/api/tickets/confirm-payment`
    : "https://api.kapelo-events.com/api/tickets/confirm-payment",

  // Configuration des timeouts et retry
  timeout: 30000, // 30 secondes
  maxRetries: 3,
  retryDelay: 5000, // 5 secondes

  // Validation des clés
  validateConfig: function () {
    const requiredKeys = ["masterKey", "privateKey", "publicKey", "token"];
    const missingKeys = requiredKeys.filter((key) => !this[key]);

    if (missingKeys.length > 0) {
      throw new Error(
        `Configuration PayDunya invalide. Clés manquantes : ${missingKeys.join(
          ", "
        )}`
      );
    }

    // Validation du format des clés selon le mode
    const keyPrefix = this.mode === "live" ? "live" : "test";
    const privateKeyPattern = new RegExp(
      `^${keyPrefix}_private_[a-zA-Z0-9]{32,}$`
    );
    const publicKeyPattern = new RegExp(
      `^${keyPrefix}_public_[a-zA-Z0-9]{32,}$`
    );
    const masterKeyPattern = /^[a-zA-Z0-9]{32,}$/;
    const tokenPattern = /^[a-zA-Z0-9]{32,}$/;

    if (!privateKeyPattern.test(this.privateKey)) {
      throw new Error(
        `Format de clé privée PayDunya invalide. Mode: ${this.mode}`
      );
    }

    if (!publicKeyPattern.test(this.publicKey)) {
      throw new Error(
        `Format de clé publique PayDunya invalide. Mode: ${this.mode}`
      );
    }

    if (!masterKeyPattern.test(this.masterKey)) {
      throw new Error("Format de Master Key PayDunya invalide");
    }

    if (!tokenPattern.test(this.token)) {
      throw new Error("Format de Token PayDunya invalide");
    }

    // Validation des URLs
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(this.serviceWebsite)) {
      throw new Error("URL du site web invalide");
    }
    if (!urlPattern.test(this.successUrl)) {
      throw new Error("URL de succès invalide");
    }
    if (!urlPattern.test(this.cancelUrl)) {
      throw new Error("URL d'annulation invalide");
    }
    if (!urlPattern.test(this.callbackUrl)) {
      throw new Error("URL de callback invalide");
    }

    return true;
  },
};

module.exports = paydunyaConfig;
