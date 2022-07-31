const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let optSchema = new Schema(
  {
    email: {
      type: String,
      unique: true
    },
    otp: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
    },
    expiration_time: {
      type: Date,
      required: true,
    },
    // time : { type : Date, default: Date.now }
  },
  {
    collection: "otp",
  }
);

module.exports = mongoose.model("Otp", optSchema);
