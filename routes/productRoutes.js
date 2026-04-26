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
    // এখানে descriptionPrice এর বদলে discountPrice দিয়েছেন, খেয়াল রাখবেন Schema তেও যেন এটাই থাকে
    const { name, category, sizes, quantity, price, discountPrice } = req.body;

    // ১. প্রথমে চেক করুন কোনো ছবি পাঠানো হয়েছে কি না
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // ২. এবার আপনার হেল্পার ফাংশনটি কল করে ছবিগুলো Cloudinary-তে আপলোড করুন
    // Promise.all ব্যবহার করা হয়েছে যাতে একসাথে একাধিক ছবি দ্রুত আপলোড হয়
    const imageUrls = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer)),
    );

    // ৩. Cloudinary থেকে পাওয়া URL গুলো দিয়ে প্রোডাক্ট তৈরি করুন
    const newProduct = new Product({
      name,
      category,
      sizes,
      quantity,
      price,
      discountPrice,
      images: imageUrls,
    });

    // ৪. Database-e save koro
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
