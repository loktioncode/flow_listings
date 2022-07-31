const express = require("express");
const router = express.Router();
const wallet_controller = require("../controller/wallet.controller");
const authorize = require("../middleware/auth");

let routes = (app) => {
  //wallets
  router.post("/wallet", authorize, wallet_controller.defi_dapp);
  router.get("/get-pubkey", authorize, wallet_controller.getPublicKey);
  
  app.use(router);
};

module.exports = routes;
