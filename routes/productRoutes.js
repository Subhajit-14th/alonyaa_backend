import express from "express";
import multer from "multer";
import Product from "../models/ProductSchema.js";
import cloudinary from "../config/cloudinaryConfig.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Cloudinary-তে ছবি আপলোড করার হেল্পার ফাংশন
const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "alonyaa_products" }, // Cloudinary-তে এই নামে ফোল্ডার হবে
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      },
    );
    uploadStream.end(fileBuffer);
  });
};

// Product upload route
router.post("/uploadProduct", upload.array("images", 5), async (req, res) => {
  try {
    const { name, category, sizes, quantity, price, discountPrice } = req.body;

    const imageUrls = req.files ? req.files.map((file) => file.path) : [];

    if (imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const newProduct = new Product({
      name,
      category,
      sizes,
      quantity,
      price,
      discountPrice,
      images: imageUrls,
    });

    // 3. Database-e save koro
    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Alonyaa Product added successfully!",
      data: savedProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Product upload failed",
      error: error.message,
    });
  }
});

export default router;
