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
  origin: "*",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};


// MongoDB conection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected')
},
    error => {
        console.log("Database can't be connected: " + error)
    }
)

// Remvoe MongoDB warning error
// mongoose.set('useCreateIndex', true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));

//api routes
initRoutes(app);


app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
