const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { validationResult } = require("express-validator");

const salt = 10;

const ping = (req, res) => {
  res.set("Content-Type", "text/html");
  res.status(200).send(Buffer.from("<p> api running ...!</p>"));
};

const getUser = (req, res) => {
  User.findById(req.params.id, (error, data) => {
    if (error) {
      res.status(401).json({
        message: "User not found!",
      });
    } else {
      res.status(200).json({
        message: data,
      });
    }
  });
};

// Sign-up
const registerUser = (req, res, next) => {
  const errors = validationResult(req);
  console.log(req.body);

  if (!errors.isEmpty()) {
    return res.status(422).jsonp(errors.array());
  } else {
    bcrypt.hash(req.body.password, salt).then((hash) => {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then((response) => {
          res.status(201).json({
            message: "User successfully created!",
            result: response,
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
          });
        });
    });
  }
};

const signIn = (req, res) => {


  let getUser;
  User
    .findOne({
      email: req.body.email,
    })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication failed",
        });
      }
      getUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((response) => {
      if (!response) {
        return res.status(401).json({
          message: "Authentication failed",
        });
      }
      let jwtToken = jwt.sign(
        {
          email: getUser.email,
          userId: getUser._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );
      res.status(200).json({
        token: jwtToken,
        expiresIn: 7200,
        message: getUser,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Authentication failed",
      });
    });
};
const getUsers = (req, res) => {
  User.find((error, response) => {
    if (error) {
      res.status(401).json({
        message: "User not Found",
      });
    } else {
      res.status(200).json(response);
    }
  });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        res.status(401).json({
          message: "User update failed!",
        });
      } else {
        res.json(data);
        console.log("User successfully updated!");
      }
    }
  );
};

const deleteUser = (req, res) => {
  User.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      res.status(401).json({
        message: "User deletion failed!",
      });
    } else {
      res.status(200).json({
        message: data,
      });
    }
  });
};

module.exports = {
  ping,
  getUser,
  registerUser,
  signIn,
  getUsers,
  updateUser,
  deleteUser,
};
