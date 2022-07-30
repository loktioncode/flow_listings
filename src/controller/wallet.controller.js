// const sdk = require("api")("@circle-api/v1#6zzs581kl64dbwsy");


// const baseUrl = "http://localhost:8080/files/";
const circle_api = process.env.CIRCLE_API;

const defi_dapp = (req, res) => {
  res.status(200).send({ message: "create wallet" });
}

const getWallet = (req, res) => {
  res.status(200).send({ message: "get wallet" });
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
  defi_dapp,
  // upload,
  // uploadCSV,
  // getListFiles,
  // download,
  // runScript,
  // exchange,
};
