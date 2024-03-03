const auth_mw = require("../middlewares/auth.mw");
const cart_controller = require("../controllers/cart.controller");
const cart_mw = require("../middlewares/cart.mw");

module.exports = (app) => {
  app.post(
    "/ecomm/api/v1/add-to-cart",
    [auth_mw.verifyToken, cart_mw.checkProductName],
    cart_controller.addToCart
  );
  app.get(
    "/ecomm/api/v1/get-cart",
    [auth_mw.verifyToken],
    cart_controller.getCart
  );
  app.delete(
    "/ecomm/api/v1/delete-from-cart/:product",
    [auth_mw.verifyToken, cart_mw.checkProductName],
    cart_controller.deleteFromCart
  );
};
