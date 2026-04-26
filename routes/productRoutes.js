import express from "express";
import Product from "../models/ProductSchema.js";

const router = express.Router();

// Product upload route
router.post("/uploadProduct", upload.array("images", 5), async (req, res) => {
  try {
    const { name, category, sizes, quantity, price, descriptionPrice } =
      req.body;

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
      descriptionPrice,
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
