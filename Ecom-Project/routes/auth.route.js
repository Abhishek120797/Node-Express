const authController = require("../controllers/auth.contoller");
const authMW = require("../middlewares/auth.mw");

module.exports = (app) => {
  app.post(
    "/ecomm/api/v1/auth/signup",
    [authMW.veryfySignUpBody],
    authController.signUp
  );
};
