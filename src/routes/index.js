const express = require("express");
const router = express.Router();
const wallet_controller = require("../controller/wallet.controller");
const auth_controller = require("../controller/auth.controller");
const authorize = require("../middleware/auth");
const { check } = require("express-validator");

const validateUserInput = [
  check("name")
    .not()
    .isEmpty()
    .isLength({ min: 3 })
    .withMessage("Name must be atleast 3 characters long"),
  check("email", "Email is required").not().isEmpty(),
  check("password", "Password should be between 5 to 8 characters long")
    .not()
    .isEmpty()
    .isLength({ min: 5, max: 8 }),
];

let routes = (app) => {
  router.get("/", auth_controller.test);
  //auth
  router.post(
    "/register-user",
    validateUserInput,
    auth_controller.registerUser
  );

  router.post("/signin", auth_controller.signIn);
  router.get("/getusers", authorize, auth_controller.getUsers);
  router.get("user-profile/:id", authorize, auth_controller.getUser);
  router.put("update-user/:id", authorize, auth_controller.updateUser);
  router.delete("delete-user/:id", authorize, auth_controller.deleteUser);

  //wallets
  router.post("/wallet", authorize, wallet_controller.defi_dapp);
  app.use(router);
};

module.exports = routes;
