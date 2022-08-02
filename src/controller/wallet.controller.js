const axios = require("axios").default;
const myCache = require("./cache");
const walletSchema = require("../models/Wallet");
const crypto = require("crypto");

const options = {
  method: "GET",
  url: "https://api-sandbox.circle.com/v1/encryption/public",
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
  },
};

const addWalletToDB = async (walletData, description, walletOwner) => {
  let obj = {
    walletID: walletData.walletId,
    walletDescription: description,
    walletOwner: walletOwner,
    walletEntity: walletData.entityId,
  };
  let wallet = new walletSchema(obj);
  wallet
    .save()
    .then(() => console.log("wallet added to db"))
    .catch((err) => console.log(err));
};



const getPublicKey = (req, res) => {
  //store for 24hrs on FE
  axios
    .request(options)
    .then(function (response) {
      myCache.set("pubKey", response.data);
      res.status(200).json(response.data);
      
    })
    .catch(function (error) {
      res.status(401).json({
        message: "Failed to get publick Key",
      });
    });
  // let c = myCache.get("pubKey");
  // console.log("get cached pubkey", c);
};

const createWallet = async (req, res, next) => {
  let walletDescription = req.body.walletDescription;
  let walletOwner = req.body.email;

  const options = {
    method: "POST",
    url: "https://api-sandbox.circle.com/v1/wallets",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
    },
    data: {
      idempotencyKey: crypto.randomUUID(),
      description: walletDescription,
    },
  };

  await axios
    .request(options)
    .then(function (response) {
      addWalletToDB(response.data.data, walletDescription, walletOwner);
      res.status(200).send({ walletInfo: response.data.data });
    })
    .catch(function (error) {
      const response = {
        Status: "Failure",
        Details: "Failed to Create Wallet",
      };
      res.status(401).send(response);
      console.error(error);
    });
};

const getWallet = (req, res) => {
  let walletId = req.params.id;
  const options = {
    method: "GET",
    url: `https://api-sandbox.circle.com/v1/wallets/${walletId}`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
    },
  };
  axios
    .request(options)
    .then(function (response) {
      res.status(200).send({ walletInfo: response.data.data });
    })
    .catch(function (error) {
      const response = {
        Status: "Failure",
        Details: "Failed to Fetch Wallet",
      };
      res.status(401).send(response);
    });
};

const createUsdcEthBlockchainAddress = async (req, res) => {
  let walletId = req.params.id;
  const options = {
    method: "POST",
    url: `https://api-sandbox.circle.com/v1/wallets/${walletId}/addresses`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
    },
    data: {
      idempotencyKey: crypto.randomUUID(),
      currency: "USD",
      chain: "ETH",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      res.status(200).json(response.data.data);
    })
    .catch(function (error) {
      console.error(error);
      const response = {
        Status: "Failure",
        Details: "Failed to create ETH address",
      };
      res.status(401).send(response);
    });
};

const getUserBlockchainAddresses = async (req, res) => {
  console.log("get BTCH ADDRESS>>");
  let walletId = req.params.id;
  const options = {
    method: "GET",
    url: `https://api-sandbox.circle.com/v1/wallets/${walletId}/addresses`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
    }
  };

  axios
    .request(options)
    .then(function (response) {
      res.status(200).json(response.data.data);
    })
    .catch(function (error) {
      console.error(error);
      const response = {
        Status: "Failure",
        Details: "Failed to create ETH address",
      };
      res.status(401).send(response);
    });
};

module.exports = {
  createWallet,
  getPublicKey,
  getWallet,
  createUsdcEthBlockchainAddress,
  getUserBlockchainAddresses
};
