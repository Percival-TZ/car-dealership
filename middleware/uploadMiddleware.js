const multer = require("multer");

let storage;

if (process.env.CLOUDINARY_CLOUD_NAME) {
    const cloudinary = require("cloudinary").v2;
    const { CloudinaryStorage } = require("multer-storage-cloudinary");

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    storage = new CloudinaryStorage({
        cloudinary,
        params: {
            folder: "car-dealership",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
        },
    });
} else {
    storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, "uploads/"),
        filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
    });
}

const upload = multer({ storage });

module.exports = upload;
