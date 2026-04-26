import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    sizes: {
      type: [String],
      default: [],
    },
    quantity: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    discountPrice: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: [true, "At least one image is required"],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length >= 1 && v.length <= 5;
        },
        message: "You must provide between 1 and 5 image URLs.",
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "products" },
);

const Product = mongoose.model("Product", productSchema);
export default Product;
