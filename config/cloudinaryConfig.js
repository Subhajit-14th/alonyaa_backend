import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setting up Cloudinary storage with Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "alonyaa_products", // Cloudinary-তে এই নামে একটি ফোল্ডার তৈরি হবে
    allowedFormats: ["jpeg", "png", "jpg", "webp"], // যে ফরম্যাটগুলো অ্যালাউ করবেন
  },
});

export const upload = multer({ storage: storage });
