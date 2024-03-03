const product_controller = require("../controllers/product.controller");
const auth_mw = require("../middlewares/auth.mw");

const product_mw = require("../middlewares/product.mw");

module.exports = (app) => {
  app.post(
    "/ecomm/api/v1/product",
    [
      auth_mw.verifyToken,
      auth_mw.isAdmin,
      product_mw.product_details_check,
      product_mw.categoryCheck,
    ],
    product_controller.addProduct
  );
  app.get(
    "/ecomm/api/v1/product",
    [auth_mw.verifyToken],
    product_controller.getProduct
  );
  app.get(
    "/ecomm/api/v1/product/:category",
    [auth_mw.verifyToken, product_mw.categoryCheck],
    product_controller.getProductByCategory
  );
  app.delete(
    "/ecomm/api/v1/product/:name/:category",
    [
      auth_mw.verifyToken,
      auth_mw.isAdmin,
      product_mw.productNameCheck,
      product_mw.categoryCheck,
    ],
    product_controller.deleteProduct
  );
  app.patch(
    "/ecomm/api/v1/product/:name/:category",
    [
      auth_mw.verifyToken,
      auth_mw.isAdmin,
      product_mw.productNameCheck,
      product_mw.categoryCheck,
    ],
    product_controller.updateProduct
  );
};
