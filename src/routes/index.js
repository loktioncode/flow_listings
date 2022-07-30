const express = require("express");
const router = express.Router();
const controller = require("../controller/wallet.controller");

let routes = (app) => {
  router.get("/", controller.defi_dapp);
  // router.post("/create-wallet", controller.upload);
  // router.post("/upload-csv", controller.uploadCSV);
  // router.post("/run-script", controller.runScript);
  // router.get("/files", controller.getListFiles);
  // router.get("/files/:name", controller.download);
  // router.post("/exchange", controller.exchange);
  app.use(router);
};

module.exports = routes;
