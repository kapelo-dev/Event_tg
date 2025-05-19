class PaymentError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = "PaymentError";
  }
}

const handleError = (error, req, res) => {
  console.error("Error details:", {
    name: error.name,
    message: error.message,
    stack: error.stack,
    details: error.details,
  });

  // Si c'est une erreur personnalisée
  if (error instanceof PaymentError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details,
    });
  }

  // Si c'est une erreur de PayDunya
  if (error.response?.data) {
    return res.status(error.response.status || 500).json({
      success: false,
      message: "Erreur PayDunya",
      details: error.response.data,
    });
  }

  // Erreur par défaut
  return res.status(500).json({
    success: false,
    message: "Une erreur interne est survenue",
    details: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
};

module.exports = {
  PaymentError,
  handleError,
};
