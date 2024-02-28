const category_controller = require("../controllers/category.controller");
const auth_mw = require("../middlewares/auth.mw");
const category_mw = require("../middlewares/category.mw");
module.exports = (app) => {
  app.post(
    "/ecomm/api/v1/categories",
    [auth_mw.verifyToken, auth_mw.isAdmin, category_mw.categoryCheck],
    category_controller.createNewCategory
  );
};
