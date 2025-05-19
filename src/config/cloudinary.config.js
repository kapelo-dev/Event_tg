const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "event-tg", // Le dossier dans votre compte Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }], // Redimensionnement automatique
  },
});

const uploadMiddleware = multer({ storage: storage });

module.exports = {
  cloudinary,
  uploadMiddleware,
};
