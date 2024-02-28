const authController = require("../controllers/auth.controller");
const authMW = require("../middlewares/auth.mw");

module.exports = (app) => {
  app.post(
    "/ecomm/api/v1/auth/signup",
    [authMW.veryfySignUpBody],
    authController.signUp
  );
  app.post(
    "/ecomm/api/v1/auth/signin",
    [authMW.veryfySignInBody],
    authController.signin
  );
};
