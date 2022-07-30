const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userSchema = require("../models/User");
const { validationResult } = require("express-validator");

const salt = 10;

const getUser = (req, res) => {
  userSchema.findById(req.params.id, (error, data) => {
    if (error) {
      res.status(401).json({
        msg: error,
      });
    } else {

      res.status(200).json({
        msg: data,
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
      const user = new userSchema({
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
  userSchema
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
        "longer-secret-is-better",
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        token: jwtToken,
        expiresIn: 3600,
        msg: getUser,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Authentication failed",
      });
    });
};
const getUsers = (req, res) => {
  userSchema.find((error, response) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json(response);
    }
  });
};


const updateUser = (req, res) => {
  userSchema.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return next(error);
        console.log(error);
      } else {
        res.json(data);
        console.log("User successfully updated!");
      }
    }
  );
};

const deleteUser = (req, res) => {
  userSchema.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
};

module.exports = {
  getUser,
  registerUser,
  signIn,
  getUsers,
  updateUser,
  deleteUser,
};
