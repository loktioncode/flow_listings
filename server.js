const express = require('express');
const bodyParser = require("body-parser");
const mongoose= require('mongoose');
const cors = require('cors');

var cookieParser = require('cookie-parser');

require('dotenv').config();
const initRoutes = require("./src/routes/");


let port = process.env.PORT || 8090;
const app = express();

var corsOptions = {
  origin: '*'
};

// get our urls and secrets
const JWT_SECRET=process.env.SECRET || "secret dapp secret 101";
const MONGODB_URL=process.env.MONGO_DB;

// making connnection with our database
mongoose.connect(MONGODB_URL, {useFindAndModify: false,useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(cors(corsOptions));

initRoutes(app);

app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
