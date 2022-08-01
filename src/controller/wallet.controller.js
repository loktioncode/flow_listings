const axios = require("axios").default;
const myCache = require("./cache");

const options = {
  method: "GET",
  url: "https://api-sandbox.circle.com/v1/encryption/public",
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
  },
};

const getPublicKey = (req, res) => {
  //store for 24hrs on FE
  axios
    .request(options)
    .then(function (response) {
      myCache.set("pubKey", response.data);
      res.status(200).json({
        message: response.data,
      });
    })
    .catch(function (error) {
      res.status(401).json({
        message: "Failed to get publick Key",
      });
    });
  // let c = myCache.get("pubKey");
  // console.log("get cached pubkey", c);
};

const createWallet = (req, res) => {
  res.status(200).send({ message: "create wallet" });
};

// const exchange = async (req, res) => {
//   var mint = req.body.nft.mint;
//   var name = req.body.nft.name;
//   const master = __basedir + "/public/admin.json";

//   if (mint === undefined || name === undefined) {
//     return res.status(400).send({ message: "Please add mint/name address " });
//   }

//   for (var key in new_Urls) {
//     if (new_Urls.hasOwnProperty(key)) {
//       if (new_Urls[key].name === name) {
//         var cmd = `metaboss update uri --keypair ${master} --account ${mint} --new-uri ${new_Urls[key].uri}`;
//         exec(cmd, function (error, stdout, stderr) {
//           console.log(stdout);
//           console.log(stderr);
//           res.status(200).send({ message: `upgrade done!!` });
//         });
//       }
//     }
//   }
// };

module.exports = {
  createWallet,
  getPublicKey,
  // upload,
  // uploadCSV,
  // getListFiles,
  // download,
  // runScript,
  // exchange,
};
