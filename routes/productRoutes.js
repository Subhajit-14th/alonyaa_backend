import express from "express";
import Product from "../models/ProductSchema.js";

const router = express.Router();

// Product upload route
router.post("/uploadProduct", async (req, res) => {
  try {
    const { name, category, sizes, quantity, price, descriptionPrice, images } =
      req.body;

    const newProduct = new Product({
      name,
      category,
      sizes,
      quantity,
      price,
      descriptionPrice,
      images,
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
