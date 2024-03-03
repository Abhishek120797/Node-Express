const product_model = require("../models/product.model");
const category_model = require("../models/category.model");

exports.addProduct = async (req, res) => {
  try {
    const category = await category_model.findOne({ name: req.body.category });
    if (!category) {
      return res.status(500).send({
        message: "not able to find category you provided",
      });
    }
    const product = {
      name: req.body.name,
      description: req.body.description,
      productImage: req.body.productImage,
      price: req.body.price,
      stock: req.body.stock,
      category: category._id,
    };

    const product_added = await product_model.create(product);

    return res.status(200).send(product_added);
  } catch (error) {
    console.log("Error while adding product ", error);
    res.status(500).send({
      message: "Error while adding product",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  const productName = req.params.name;
  const categoryName = req.params.category;
  try {
    const category = await category_model.findOne({ name: categoryName });
    const categoryId = category._id;
    const productDeleted = await product_model.findOneAndDelete({
      name: productName,
      category: categoryId,
    });

    if (!productDeleted) {
      return res.status(404).send({
        message: "product not found check your fields you provided",
      });
    }
    return res.status(200).send({
      message: "Product is deleted",
    });
  } catch (error) {
    console.log("Error while deleting product ", error);
    res.status(500).send({
      message: "Error while deleting product",
    });
  }
};

exports.updateProduct = async (req, res) => {
  const productName = req.params.name;
  const categoryName = req.params.category;

  const categoryObj = await category_model.findOne({ name: categoryName });
  const { name, description, productImage, price, stock, category } = req.body;
  try {
    if (
      !name &&
      !description &&
      !productImage &&
      !price &&
      !stock &&
      !category
    ) {
      return res.status(400).send({
        messsage: "Provide at least one field to update",
      });
    }

    const updates = {};
    if (name) {
      updates.name = name;
    }
    if (description) {
      updates.description = description;
    }
    if (productImage) {
      updates.productImage = productImage;
    }
    if (price) {
      updates.price = price;
    }
    if (stock) {
      updates.stock = stock;
    }
    if (category) {
      const updateCategoryObj = await category_model.findOne({
        name: category,
      });
      updates.category = updateCategoryObj._id;
    }

    const updatedProduct = await product_model.findOneAndUpdate(
      { name: productName, category: categoryObj._id },
      { $set: updates }
    );

    if (!updatedProduct) {
      return res.status(500).send({
        message: "Product not found",
      });
    }

    return res.status(200).send({
      message: "product is updated",
    });
  } catch (error) {
    console.log("Error while updating product ", error);
    res.status(500).send({
      message: "Error while updating product",
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product_list = await product_model.find();
    return res.status(200).send(product_list);
  } catch (error) {
    console.log("Error while getting product", error);
    res.status(500).send({
      message: "Error while getting product",
    });
  }
};

exports.getProductByCategory = async (req, res) => {
  const categoryName = req.params.category;
  const category = await category_model.findOne({ name: categoryName });
  try {
    const product_list = await product_model.find({ category: category._id });
    return res.status(200).send(product_list);
  } catch (error) {
    console.log("Error while getting product by category", error);
    res.status(500).send({
      message: "Error while getting product by category",
    });
  }
};
