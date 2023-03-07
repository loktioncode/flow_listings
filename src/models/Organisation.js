const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrganisationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  logoUrl: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  }
}, {
    collection: "Organisation",
  }
);


const Organisation = mongoose.model('Organisation', OrganisationSchema);


module.exports = Organisation;
