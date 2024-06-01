import mongoose from "mongoose";

const productScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 200,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
    },
    productImage: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export const product_model = mongoose.model("Product", productScheme);
