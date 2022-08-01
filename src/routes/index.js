const express = require("express");
const router = express.Router();
const wallet_controller = require("../controller/wallet.controller");
const auth_controller = require("../controller/auth.controller");
const otp_controller = require("../controller/otp.controller");
const authorize = require("../middleware");
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
  router.get("/", auth_controller.ping);

  // otp
  router.post("/email-otp",authorize, otp_controller.sendOtp);
  router.post("/verify-otp",authorize,  otp_controller.verifyOtp);

  //auth
  router.post(
    "/register-user",
    validateUserInput,
    auth_controller.registerUser
  );

  router.post("/signin", auth_controller.signIn);
  router.get("/getusers", auth_controller.getUsers);
  router.get("/user/:id", authorize, auth_controller.getUser);
  router.delete("/delete-user/:id", authorize, auth_controller.deleteUser);
  //wallets
  router.get("/add-wallet", authorize, wallet_controller.createWallet);
  router.get("/get-pubkey", authorize, wallet_controller.getPublicKey);

  app.use(router);
};

module.exports = routes;
