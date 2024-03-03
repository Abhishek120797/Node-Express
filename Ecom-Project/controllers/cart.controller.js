const cart_model = require("../models/cart.model");
const product_model = require("../models/product.model");

exports.addToCart = async (req, res) => {
  const productName = req.body.product;
  try {
    const productObj = await product_model.findOne({ name: productName });

    if (!productObj) {
      return res.status(400).send({
        message: "Product does not exist",
      });
    }
    const cartItem = {
      product: productObj._id,
      user: req.user.id,
    };
    const productAddedToCart = await cart_model.create(cartItem);

    return res.status(201).send(productAddedToCart);
  } catch (error) {
    console.log("Error while adding product to cart ", error);
    res.status(500).send({
      message: "Error while adding product to cart",
    });
  }
};

exports.getCart = async (req, res) => {
  const userObjId = req.user.id;
  try {
    const cartItems = await cart_model.find({ user: userObjId });
    if (cartItems.length === 0) {
      return res.status(201).send({
        message: "Your Cart is empty",
      });
    }
    return res.status(201).send(cartItems);
  } catch (error) {
    console.log("Error while getting cart item ", error);
    res.status(500).send({
      message: "Error while getting cart item",
    });
  }
};

exports.deleteFromCart = async (req, res) => {
  const productName = req.params.product;

  try {
    const productObj = await product_model.findOne({ name: productName });
    const userObjId = req.user.id;
    const cartItemDeleted = await cart_model.findOneAndDelete({
      product: productObj._id,
      user: userObjId,
    });

    if (!cartItemDeleted) {
      return res.status(404).send({
        message: "Item not found",
      });
    }
    res.status(201).send({
      message: "cart item deleted",
    });
  } catch (error) {
    console.log("Error while deleting cart item", error);
    res.status(500).send({
      message: "Error while deleting cart item",
    });
  }
};
