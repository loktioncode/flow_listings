const cors = require("cors");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config()

global.__basedir = __dirname;

var corsOptions = {
  origin: '*'
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors(corsOptions));

const initRoutes = require("./src/routes");

app.use(express.urlencoded({ extended: true }));
initRoutes(app);

let port = 8090;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
